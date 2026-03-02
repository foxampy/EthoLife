import { Router } from 'express';
import { supabase } from '../supabase/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// ============================================================================
// ОБЩИЕ ENDPOINTS ДЛЯ ВСЕХ МОДУЛЕЙ
// ============================================================================

/**
 * GET /api/health/modules
 * Получить список всех модулей здоровья
 */
router.get('/modules', async (req, res) => {
  try {
    const modules = [
      {
        id: 'nutrition',
        name: 'Питание',
        description: 'Калории, макросы, вода, планы питания',
        icon: 'utensils',
        color: '#10B981',
        order: 1,
      },
      {
        id: 'movement',
        name: 'Движение',
        description: 'Шаги, тренировки, активность',
        icon: 'activity',
        color: '#3B82F6',
        order: 2,
      },
      {
        id: 'sleep',
        name: 'Сон',
        description: 'Продолжительность, качество, фазы',
        icon: 'moon',
        color: '#8B5CF6',
        order: 3,
      },
      {
        id: 'psychology',
        name: 'Психология',
        description: 'Настроение, стресс, медитации',
        icon: 'brain',
        color: '#F59E0B',
        order: 4,
      },
      {
        id: 'medicine',
        name: 'Медицина',
        description: 'Анализы, лекарства, приемы',
        icon: 'heart',
        color: '#EF4444',
        order: 5,
      },
      {
        id: 'relationships',
        name: 'Отношения',
        description: 'Социальные связи, общение',
        icon: 'users',
        color: '#EC4899',
        order: 6,
      },
      {
        id: 'habits',
        name: 'Привычки',
        description: 'Трекер привычек, streaks, цели',
        icon: 'sparkles',
        color: '#06B6D4',
        order: 7,
      },
    ];

    res.json({ modules });
  } catch (error) {
    console.error('Error getting modules:', error);
    res.status(500).json({ error: 'Failed to get modules' });
  }
});

/**
 * GET /api/health/dashboard
 * Получить общий dashboard здоровья
 */
router.get('/dashboard', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Получить общий score
    const { data: overallScore } = await supabase
      .from('health_scores')
      .select('overall_score')
      .eq('user_id', userId)
      .single();

    // Получить scores по модулям
    const { data: moduleScores } = await supabase
      .from('module_scores')
      .select('*')
      .eq('user_id', userId);

    // Получить активные цели
    const { data: activeGoals } = await supabase
      .from('health_goals')
      .select('id, title, module_id, status, progress')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(5);

    // Получить активные планы
    const { data: activePlans } = await supabase
      .from('health_plans')
      .select('id, title, module_id, status, progress')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(5);

    // Получить последние инсайты
    const { data: insights } = await supabase
      .from('health_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      overall_score: overallScore?.overall_score || 0,
      modules: moduleScores || [],
      active_goals: activeGoals || [],
      active_plans: activePlans || [],
      insights: insights || [],
    });
  } catch (error) {
    console.error('Error getting dashboard:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

/**
 * GET /api/health/stats
 * Получить quick stats
 */
router.get('/stats', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Общее количество метрик
    const { count: totalMetrics } = await supabase
      .from('health_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Активные цели
    const { count: activeGoals } = await supabase
      .from('health_goals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Активные планы
    const { count: activePlans } = await supabase
      .from('health_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Баланс UNITY токенов
    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('unity_balance')
      .eq('user_id', userId)
      .single();

    res.json({
      total_metrics: totalMetrics || 0,
      active_goals: activeGoals || 0,
      active_plans: activePlans || 0,
      unity_balance: wallet?.unity_balance || 0,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// ============================================================================
// ENDPOINTS ДЛЯ МОДУЛЕЙ (динамические)
// ============================================================================

/**
 * GET /api/health/:moduleId/metrics
 * Получить метрики модуля
 */
router.get('/:moduleId/metrics', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { moduleId } = req.params;
    const { limit = 50, start_date, end_date, metric_type } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .order('recorded_at', { ascending: false })
      .limit(Number(limit));

    if (start_date) {
      query = query.gte('recorded_at', start_date as string);
    }

    if (end_date) {
      query = query.lte('recorded_at', end_date as string);
    }

    if (metric_type) {
      query = query.eq('metric_type', metric_type as string);
    }

    const { data: metrics, error } = await query;

    if (error) throw error;

    res.json({ metrics: metrics || [] });
  } catch (error) {
    console.error('Error getting metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

/**
 * POST /api/health/:moduleId/metrics
 * Добавить метрику модуля
 */
router.post('/:moduleId/metrics', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { moduleId } = req.params;
    const { metric_type, value, unit, recorded_at, metadata, source = 'manual' } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!metric_type || value === undefined) {
      return res.status(400).json({ error: 'metric_type and value are required' });
    }

    const { data: metric, error } = await supabase
      .from('health_metrics')
      .insert({
        user_id: userId,
        module_id: moduleId,
        metric_type,
        value,
        unit,
        recorded_at: recorded_at || new Date().toISOString(),
        metadata,
        source,
      })
      .select()
      .single();

    if (error) throw error;

    // Начислить UNITY токены за трекинг
    if (source === 'manual') {
      await rewardTracking(userId, moduleId, metric_type);
    }

    res.status(201).json({ metric });
  } catch (error) {
    console.error('Error adding metric:', error);
    res.status(500).json({ error: 'Failed to add metric' });
  }
});

/**
 * GET /api/health/:moduleId/metrics/summary
 * Получить сводку метрик
 */
router.get('/:moduleId/metrics/summary', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { moduleId } = req.params;
    const { period = 'week' } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Получить цели для модуля
    const { data: goals } = await supabase
      .from('health_goals')
      .select('id, metric_type, target_value, current_value')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .eq('status', 'active');

    // Получить последние метрики по каждому типу
    const summaries = [];

    if (goals && goals.length > 0) {
      for (const goal of goals) {
        const { data: metrics } = await supabase
          .from('health_metrics')
          .select('value, recorded_at')
          .eq('user_id', userId)
          .eq('module_id', moduleId)
          .eq('metric_type', goal.metric_type)
          .order('recorded_at', { ascending: false })
          .limit(7);

        if (metrics && metrics.length > 0) {
          const currentValue = metrics[0].value as number;
          const previousValue = metrics.length > 1 ? metrics[1].value : null;
          const change = previousValue ? currentValue - (previousValue as number) : 0;
          const changePercentage = previousValue ? (change / previousValue) * 100 : 0;

          summaries.push({
            metric_type: goal.metric_type,
            current_value: currentValue,
            previous_value: previousValue,
            change,
            change_percentage: changePercentage,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
            goal_value: goal.target_value,
            goal_progress: goal.target_value ? (currentValue / goal.target_value) * 100 : 0,
            last_updated: metrics[0].recorded_at,
          });
        }
      }
    }

    res.json({ summaries });
  } catch (error) {
    console.error('Error getting metrics summary:', error);
    res.status(500).json({ error: 'Failed to get metrics summary' });
  }
});

/**
 * PUT /api/health/:moduleId/metrics/:metricId
 * Обновить метрику
 */
router.put('/:moduleId/metrics/:metricId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { moduleId, metricId } = req.params;
    const { value, unit, recorded_at, metadata } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: metric, error } = await supabase
      .from('health_metrics')
      .update({
        value,
        unit,
        recorded_at,
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', metricId)
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .select()
      .single();

    if (error) throw error;

    res.json({ metric });
  } catch (error) {
    console.error('Error updating metric:', error);
    res.status(500).json({ error: 'Failed to update metric' });
  }
});

/**
 * DELETE /api/health/:moduleId/metrics/:metricId
 * Удалить метрику
 */
router.delete('/:moduleId/metrics/:metricId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { moduleId, metricId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('health_metrics')
      .delete()
      .eq('id', metricId)
      .eq('user_id', userId)
      .eq('module_id', moduleId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting metric:', error);
    res.status(500).json({ error: 'Failed to delete metric' });
  }
});

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Начислить UNITY токены за трекинг
 */
async function rewardTracking(userId: string, moduleId: string, metricType: string) {
  try {
    // Определить награду на основе типа метрики
    const rewards: Record<string, number> = {
      'calories': 5,
      'water': 2,
      'steps': 10,
      'workout': 25,
      'sleep_duration': 10,
      'mood': 8,
      'meditation': 15,
      'medication': 3,
      'habit': 5,
    };

    const reward = rewards[metricType] || 5;

    // Обновить баланс
    await supabase.rpc('add_unity_tokens', {
      p_user_id: userId,
      p_amount: reward,
      p_description: `Tracking: ${moduleId} - ${metricType}`,
    });
  } catch (error) {
    console.error('Error rewarding tracking:', error);
    // Не прерываем основной запрос
  }
}

export default router;
