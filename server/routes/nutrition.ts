import { Router } from 'express';
import { supabase } from '../supabase/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// ============================================================================
# FOOD DATABASE
# ============================================================================

/**
 * GET /api/nutrition/foods/search
 * Поиск продуктов в базе
 */
router.get('/foods/search', async (req, res) => {
  try {
    const { q, category, limit = 50 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const { data: foods, error } = await supabase
      .from('nutrition_food_items')
      .select('*')
      .ilike('name_ru', `%${q}%`)
      .limit(Number(limit));

    if (error) throw error;

    res.json({ foods: foods || [] });
  } catch (error) {
    console.error('Error searching foods:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

/**
 * GET /api/nutrition/foods/barcode/:barcode
 * Получить продукт по штрих-коду
 */
router.get('/foods/barcode/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;

    const { data: food, error } = await supabase
      .from('nutrition_food_items')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ food: food || null });
  } catch (error) {
    console.error('Error getting food by barcode:', error);
    res.status(500).json({ error: 'Failed to get food' });
  }
});

/**
 * GET /api/nutrition/foods/:id
 * Получить продукт по ID
 */
router.get('/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: food, error } = await supabase
      .from('nutrition_food_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ food });
  } catch (error) {
    console.error('Error getting food:', error);
    res.status(500).json({ error: 'Failed to get food' });
  }
});

// ============================================================================
# MEALS
# ============================================================================

/**
 * GET /api/nutrition/meals
 * Получить приемы пищи пользователя
 */
router.get('/meals', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date, meal_type } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = supabase
      .from('nutrition_meals')
      .select('*, meal_items(*)')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });

    if (start_date) {
      query = query.gte('recorded_at', start_date as string);
    }

    if (end_date) {
      query = query.lte('recorded_at', end_date as string);
    }

    if (meal_type) {
      query = query.eq('meal_type', meal_type as string);
    }

    const { data: meals, error } = await query;

    if (error) throw error;

    res.json({ meals: meals || [] });
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json({ error: 'Failed to get meals' });
  }
});

/**
 * POST /api/nutrition/meals
 * Создать прием пищи
 */
router.post('/meals', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { meal_type, items, notes, image_url } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!meal_type) {
      return res.status(400).json({ error: 'meal_type required' });
    }

    // Создать прием пищи
    const { data: meal, error: mealError } = await supabase
      .from('nutrition_meals')
      .insert({
        user_id: userId,
        meal_type,
        notes,
        image_url,
      })
      .select()
      .single();

    if (mealError) throw mealError;

    // Добавить элементы
    if (items && items.length > 0) {
      const mealItems = items.map((item: any) => ({
        meal_id: meal.id,
        food_id: item.food_id,
        quantity_g: item.quantity_g,
        calories: item.calories,
        protein_g: item.protein_g,
        carbs_g: item.carbs_g,
        fat_g: item.fat_g,
      }));

      const { error: itemsError } = await supabase
        .from('nutrition_meal_items')
        .insert(mealItems);

      if (itemsError) throw itemsError;

      // Обновить totals
      const totals = items.reduce((acc: any, item: any) => ({
        total_calories: (acc.total_calories || 0) + (item.calories || 0),
        total_protein_g: (acc.total_protein_g || 0) + (item.protein_g || 0),
        total_carbs_g: (acc.total_carbs_g || 0) + (item.carbs_g || 0),
        total_fat_g: (acc.total_fat_g || 0) + (item.fat_g || 0),
      }), {});

      await supabase
        .from('nutrition_meals')
        .update(totals)
        .eq('id', meal.id);

      // Начислить UNITY токены
      await supabase.rpc('add_unity_tokens', {
        p_user_id: userId,
        p_amount: 5,
        p_description: 'Meal logged',
      });
    }

    res.status(201).json({ meal });
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

/**
 * DELETE /api/nutrition/meals/:id
 * Удалить прием пищи
 */
router.delete('/meals/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('nutrition_meals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

// ============================================================================
# WATER TRACKING
# ============================================================================

/**
 * GET /api/nutrition/water
 * Получить записи воды
 */
router.get('/water', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { date } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = supabase
      .from('nutrition_water_intake')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });

    if (date) {
      query = query.gte('recorded_at', `${date}T00:00:00`);
      query = query.lte('recorded_at', `${date}T23:59:59`);
    }

    const { data: water, error } = await query;

    if (error) throw error;

    res.json({ water: water || [] });
  } catch (error) {
    console.error('Error getting water:', error);
    res.status(500).json({ error: 'Failed to get water' });
  }
});

/**
 * POST /api/nutrition/water
 * Добавить воду
 */
router.post('/water', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { amount_ml, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!amount_ml) {
      return res.status(400).json({ error: 'amount_ml required' });
    }

    const { data: water, error } = await supabase
      .from('nutrition_water_intake')
      .insert({
        user_id: userId,
        amount_ml,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Начислить UNITY токены
    await supabase.rpc('add_unity_tokens', {
      p_user_id: userId,
      p_amount: 2,
      p_description: 'Water logged',
    });

    res.status(201).json({ water });
  } catch (error) {
    console.error('Error adding water:', error);
    res.status(500).json({ error: 'Failed to add water' });
  }
});

/**
 * DELETE /api/nutrition/water/:id
 * Удалить запись воды
 */
router.delete('/water/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('nutrition_water_intake')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting water:', error);
    res.status(500).json({ error: 'Failed to delete water' });
  }
});

// ============================================================================
# GOALS
# ============================================================================

/**
 * GET /api/nutrition/goals
 * Получить цели питания
 */
router.get('/goals', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: goals, error } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ goals: goals || null });
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({ error: 'Failed to get goals' });
  }
});

/**
 * PUT /api/nutrition/goals
 * Обновить цели питания
 */
router.put('/goals', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const {
      calorie_target,
      protein_target_g,
      carbs_target_g,
      fat_target_g,
      water_target_ml,
      diet_type,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Проверить есть ли уже цели
    const { data: existing } = await supabase
      .from('nutrition_goals')
      .select('id')
      .eq('user_id', userId)
      .single();

    let error;
    if (existing) {
      // Обновить
      ({ error } = await supabase
        .from('nutrition_goals')
        .update({
          calorie_target,
          protein_target_g,
          carbs_target_g,
          fat_target_g,
          water_target_ml,
          diet_type,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId));
    } else {
      // Создать
      ({ error } = await supabase
        .from('nutrition_goals')
        .insert({
          user_id: userId,
          calorie_target,
          protein_target_g,
          carbs_target_g,
          fat_target_g,
          water_target_ml,
          diet_type,
        }));
    }

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({ error: 'Failed to update goals' });
  }
});

// ============================================================================
# RECIPES
# ============================================================================

/**
 * GET /api/nutrition/recipes
 * Получить рецепты
 */
router.get('/recipes', async (req, res) => {
  try {
    const { category, difficulty, limit = 20 } = req.query;

    let query = supabase
      .from('nutrition_recipes')
      .select('*')
      .eq('is_public', true)
      .limit(Number(limit));

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: recipes, error } = await query;

    if (error) throw error;

    res.json({ recipes: recipes || [] });
  } catch (error) {
    console.error('Error getting recipes:', error);
    res.status(500).json({ error: 'Failed to get recipes' });
  }
});

/**
 * GET /api/nutrition/recipes/:id
 * Получить рецепт по ID
 */
router.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: recipe, error } = await supabase
      .from('nutrition_recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ recipe });
  } catch (error) {
    console.error('Error getting recipe:', error);
    res.status(500).json({ error: 'Failed to get recipe' });
  }
});

export default router;
