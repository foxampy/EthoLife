import { Router } from 'express';
import { supabase } from '../supabase/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// ============================================================================
# EXERCISE DATABASE
# ============================================================================

/**
 * GET /api/movement/exercises/search
 * Поиск упражнений
 */
router.get('/exercises/search', async (req, res) => {
  try {
    const { q, muscle_group, equipment, difficulty, limit = 50 } = req.query;

    let query = supabase
      .from('movement_exercises')
      .select('*')
      .limit(Number(limit));

    if (q) {
      query = query.ilike('name_ru', `%${q}%`);
    }

    if (muscle_group) {
      query = query.eq('muscle_group', muscle_group);
    }

    if (equipment) {
      query = query.eq('equipment', equipment);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: exercises, error } = await query;

    if (error) throw error;

    res.json({ exercises: exercises || [] });
  } catch (error) {
    console.error('Error searching exercises:', error);
    res.status(500).json({ error: 'Failed to search exercises' });
  }
});

/**
 * GET /api/movement/exercises/:id
 * Получить упражнение по ID
 */
router.get('/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: exercise, error } = await supabase
      .from('movement_exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ exercise });
  } catch (error) {
    console.error('Error getting exercise:', error);
    res.status(500).json({ error: 'Failed to get exercise' });
  }
});

// ============================================================================
# WORKOUTS
# ============================================================================

/**
 * GET /api/movement/workouts
 * Получить тренировки пользователя
 */
router.get('/workouts', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date, workout_type } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = supabase
      .from('movement_workouts')
      .select('*, workout_exercises(exercise_id, sets_completed, reps_per_set)')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (start_date) {
      query = query.gte('started_at', start_date as string);
    }

    if (end_date) {
      query = query.lte('started_at', end_date as string);
    }

    if (workout_type) {
      query = query.eq('workout_type', workout_type as string);
    }

    const { data: workouts, error } = await query;

    if (error) throw error;

    res.json({ workouts: workouts || [] });
  } catch (error) {
    console.error('Error getting workouts:', error);
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

/**
 * POST /api/movement/workouts
 * Создать тренировку
 */
router.post('/workouts', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { workout_type, title, exercises } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Создать тренировку
    const { data: workout, error: workoutError } = await supabase
      .from('movement_workouts')
      .insert({
        user_id: userId,
        workout_type,
        title,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (workoutError) throw workoutError;

    // Добавить упражнения
    if (exercises && exercises.length > 0) {
      const workoutExercises = exercises.map((ex: any, index: number) => ({
        workout_id: workout.id,
        exercise_id: ex.exercise_id,
        order_index: index,
        target_sets: ex.target_sets || 3,
        reps_per_set: ex.reps_per_set || [],
        weight_kg: ex.weight_kg || [],
      }));

      const { error: exercisesError } = await supabase
        .from('movement_workout_exercises')
        .insert(workoutExercises);

      if (exercisesError) throw exercisesError;
    }

    res.status(201).json({ workout });
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

/**
 * PUT /api/movement/workouts/:id/complete
 * Завершить тренировку
 */
router.put('/workouts/:id/complete', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { duration_seconds, calories_burned, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: workout, error } = await supabase
      .from('movement_workouts')
      .update({
        completed_at: new Date().toISOString(),
        duration_seconds,
        calories_burned,
        notes,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Начислить UNITY токены
    await supabase.rpc('add_unity_tokens', {
      p_user_id: userId,
      p_amount: 25,
      p_description: 'Workout completed',
    });

    res.json({ workout });
  } catch (error) {
    console.error('Error completing workout:', error);
    res.status(500).json({ error: 'Failed to complete workout' });
  }
});

/**
 * DELETE /api/movement/workouts/:id
 * Удалить тренировку
 */
router.delete('/workouts/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('movement_workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

// ============================================================================
# DAILY ACTIVITY
# ============================================================================

/**
 * GET /api/movement/activity
 * Получить дневную активность
 */
router.get('/activity', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { date } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    const { data: activity, error } = await supabase
      .from('movement_daily_activity')
      .select('*')
      .eq('user_id', userId)
      .eq('date', targetDate)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ activity: activity || null });
  } catch (error) {
    console.error('Error getting activity:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

/**
 * POST /api/movement/activity
 * Обновить дневную активность (например, шаги)
 */
router.post('/activity', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const {
      steps,
      distance_km,
      active_minutes,
      calories_burned,
      floors_climbed,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Проверить есть ли запись за сегодня
    const { data: existing } = await supabase
      .from('movement_daily_activity')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    let error;
    if (existing) {
      // Обновить
      ({ error } = await supabase
        .from('movement_daily_activity')
        .update({
          steps: steps || 0,
          distance_km: distance_km || 0,
          active_minutes: active_minutes || 0,
          calories_burned: calories_burned || 0,
          floors_climbed: floors_climbed || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('date', today));
    } else {
      // Создать
      ({ error } = await supabase
        .from('movement_daily_activity')
        .insert({
          user_id: userId,
          date: today,
          steps: steps || 0,
          distance_km: distance_km || 0,
          active_minutes: active_minutes || 0,
          calories_burned: calories_burned || 0,
          floors_climbed: floors_climbed || 0,
        }));
    }

    if (error) throw error;

    // Начислить UNITY токены за шаги
    if (steps && steps >= 10000) {
      await supabase.rpc('add_unity_tokens', {
        p_user_id: userId,
        p_amount: 20,
        p_description: '10K steps goal reached',
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// ============================================================================
# PROGRAMS
# ============================================================================

/**
 * GET /api/movement/programs
 * Получить программы тренировок
 */
router.get('/programs', async (req, res) => {
  try {
    const { level, category, limit = 20 } = req.query;

    // Временные данные (пока нет БД программ)
    const programs = [
      {
        id: '1',
        title: 'Похудение',
        description: 'Программа для снижения веса',
        duration_weeks: 4,
        level: 'beginner',
        workouts_count: 16,
        category: 'weight_loss',
      },
      {
        id: '2',
        title: 'Набор массы',
        description: 'Программа для набора мышечной массы',
        duration_weeks: 8,
        level: 'intermediate',
        workouts_count: 32,
        category: 'muscle_gain',
      },
      {
        id: '3',
        title: 'Сила',
        description: 'Программа для развития силы',
        duration_weeks: 12,
        level: 'advanced',
        workouts_count: 48,
        category: 'strength',
      },
    ];

    res.json({ programs });
  } catch (error) {
    console.error('Error getting programs:', error);
    res.status(500).json({ error: 'Failed to get programs' });
  }
});

export default router;
