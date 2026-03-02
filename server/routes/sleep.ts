import { Router } from 'express';
import { supabase } from '../supabase/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// ============================================================================
# SLEEP SESSIONS
# ============================================================================

/**
 * GET /api/sleep/sessions
 * Получить сессии сна пользователя
 */
router.get('/sessions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = supabase
      .from('sleep_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (start_date) {
      query = query.lte('date', start_date as string);
    }

    if (end_date) {
      query = query.gte('date', end_date as string);
    }

    const { data: sessions, error } = await query;

    if (error) throw error;

    res.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('Error getting sleep sessions:', error);
    res.status(500).json({ error: 'Failed to get sleep sessions' });
  }
});

/**
 * POST /api/sleep/sessions
 * Создать сессию сна
 */
router.post('/sessions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const {
      date,
      bedtime,
      wake_time,
      duration_hours,
      quality_score,
      deep_sleep_minutes,
      light_sleep_minutes,
      rem_sleep_minutes,
      awake_minutes,
      factors,
      notes,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!date) {
      return res.status(400).json({ error: 'date required' });
    }

    const { data: session, error } = await supabase
      .from('sleep_sessions')
      .insert({
        user_id: userId,
        date,
        bedtime,
        wake_time,
        duration_hours,
        quality_score,
        deep_sleep_minutes,
        light_sleep_minutes,
        rem_sleep_minutes,
        awake_minutes,
        factors,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Начислить UNITY токены за трекинг сна
    await supabase.rpc('add_unity_tokens', {
      p_user_id: userId,
      p_amount: 10,
      p_description: 'Sleep logged',
    });

    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating sleep session:', error);
    res.status(500).json({ error: 'Failed to create sleep session' });
  }
});

/**
 * PUT /api/sleep/sessions/:id
 * Обновить сессию сна
 */
router.put('/sessions/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      quality_score,
      deep_sleep_minutes,
      light_sleep_minutes,
      rem_sleep_minutes,
      notes,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: session, error } = await supabase
      .from('sleep_sessions')
      .update({
        quality_score,
        deep_sleep_minutes,
        light_sleep_minutes,
        rem_sleep_minutes,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ session });
  } catch (error) {
    console.error('Error updating sleep session:', error);
    res.status(500).json({ error: 'Failed to update sleep session' });
  }
});

/**
 * DELETE /api/sleep/sessions/:id
 * Удалить сессию сна
 */
router.delete('/sessions/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('sleep_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting sleep session:', error);
    res.status(500).json({ error: 'Failed to delete sleep session' });
  }
});

// ============================================================================
# SLEEP GOALS
# ============================================================================

/**
 * GET /api/sleep/goals
 * Получить цели сна
 */
router.get('/goals', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: goals, error } = await supabase
      .from('sleep_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({ goals: goals || null });
  } catch (error) {
    console.error('Error getting sleep goals:', error);
    res.status(500).json({ error: 'Failed to get sleep goals' });
  }
});

/**
 * PUT /api/sleep/goals
 * Обновить цели сна
 */
router.put('/goals', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const {
      target_duration_hours,
      target_bedtime,
      target_wake_time,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Проверить есть ли уже цели
    const { data: existing } = await supabase
      .from('sleep_goals')
      .select('id')
      .eq('user_id', userId)
      .single();

    let error;
    if (existing) {
      // Обновить
      ({ error } = await supabase
        .from('sleep_goals')
        .update({
          target_duration_hours,
          target_bedtime,
          target_wake_time,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId));
    } else {
      // Создать
      ({ error } = await supabase
        .from('sleep_goals')
        .insert({
          user_id: userId,
          target_duration_hours,
          target_bedtime,
          target_wake_time,
        }));
    }

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating sleep goals:', error);
    res.status(500).json({ error: 'Failed to update sleep goals' });
  }
});

// ============================================================================
# SLEEP ANALYTICS
# ============================================================================

/**
 * GET /api/sleep/analytics
 * Получить аналитику сна
 */
router.get('/analytics', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { period = 'week' } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Получить сессии за период
    let daysAgo = 7;
    if (period === 'month') daysAgo = 30;
    if (period === 'year') daysAgo = 365;

    const { data: sessions } = await supabase
      .from('sleep_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (!sessions || sessions.length === 0) {
      return res.json({
        average_duration: 0,
        average_quality: 0,
        trends: [],
        insights: [],
      });
    }

    // Рассчитать средние
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_hours || 0), 0);
    const totalQuality = sessions.reduce((sum, s) => sum + (s.quality_score || 0), 0);
    
    const averageDuration = totalDuration / sessions.length;
    const averageQuality = totalQuality / sessions.length;

    // Тренды
    const trends = sessions.map(s => ({
      date: s.date,
      duration: s.duration_hours,
      quality: s.quality_score,
    }));

    // Инсайты
    const insights = [];
    
    if (averageQuality >= 80) {
      insights.push({
        type: 'positive',
        message: 'Отличное качество сна! Продолжайте в том же духе.',
      });
    } else if (averageQuality < 60) {
      insights.push({
        type: 'warning',
        message: 'Качество сна низкое. Попробуйте улучшить гигиену сна.',
      });
    }

    if (averageDuration < 7) {
      insights.push({
        type: 'warning',
        message: 'Вы спите меньше рекомендуемых 7-8 часов.',
      });
    }

    res.json({
      average_duration: averageDuration,
      average_quality: averageQuality,
      trends,
      insights,
    });
  } catch (error) {
    console.error('Error getting sleep analytics:', error);
    res.status(500).json({ error: 'Failed to get sleep analytics' });
  }
});

// ============================================================================
# SLEEP SOUNDS
# ============================================================================

/**
 * GET /api/sleep/sounds
 * Получить звуки для сна
 */
router.get('/sounds', async (req, res) => {
  try {
    // Временные данные (пока нет БД)
    const sounds = [
      {
        id: '1',
        name: 'Белый шум',
        category: 'nature',
        url: '/sounds/white-noise.mp3',
        duration_minutes: 60,
      },
      {
        id: '2',
        name: 'Дождь',
        category: 'nature',
        url: '/sounds/rain.mp3',
        duration_minutes: 90,
      },
      {
        id: '3',
        name: 'Океан',
        category: 'nature',
        url: '/sounds/ocean.mp3',
        duration_minutes: 120,
      },
      {
        id: '4',
        name: 'Лес',
        category: 'nature',
        url: '/sounds/forest.mp3',
        duration_minutes: 60,
      },
      {
        id: '5',
        name: 'Бинауральные ритмы',
        category: 'meditation',
        url: '/sounds/binaural.mp3',
        duration_minutes: 30,
      },
    ];

    res.json({ sounds });
  } catch (error) {
    console.error('Error getting sounds:', error);
    res.status(500).json({ error: 'Failed to get sounds' });
  }
});

export default router;
