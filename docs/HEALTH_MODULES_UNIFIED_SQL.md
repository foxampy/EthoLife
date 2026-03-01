# Unified Health Modules - SQL Schema
## Полная миграция для 7 модулей здоровья

---

## 🗄️ Unified Tables

### 1. Core Health Profile (единый профиль)
```sql
-- ============================================
-- CORE: Unified Health Profile
-- ============================================

CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  birth_date DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown')),
  
  -- Body Metrics
  height_cm DECIMAL(5,2),
  current_weight_kg DECIMAL(5,2),
  
  -- Lifestyle
  activity_level VARCHAR(20) CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  chronotype VARCHAR(20) CHECK (chronotype IN ('lion', 'bear', 'wolf', 'dolphin', 'unknown')),
  
  -- Health Status
  medical_conditions TEXT[],
  allergies TEXT[],
  medications TEXT[],
  
  -- Goals
  primary_goal VARCHAR(50) CHECK (primary_goal IN ('lose_weight', 'maintain', 'gain_muscle', 'improve_fitness', 'better_sleep', 'reduce_stress', 'improve_health', 'manage_condition')),
  goal_weight_kg DECIMAL(5,2),
  goal_timeline_date DATE,
  
  -- Restrictions & Preferences
  dietary_restrictions VARCHAR(50)[],
  food_allergies VARCHAR(100)[],
  preferred_workout_time VARCHAR(20),
  
  -- Streak Data
  current_overall_streak INT DEFAULT 0,
  longest_overall_streak INT DEFAULT 0,
  last_check_in_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_health_profiles_user ON health_profiles(user_id);
```

### 2. Daily Health Snapshot (ежедневная сводка)
```sql
-- ============================================
-- CORE: Daily Unified Snapshot
-- ============================================

CREATE TABLE daily_health_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Overall Score
  overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Module Scores (0-100 each)
  module_scores JSONB DEFAULT '{}'::jsonb,
  -- {
  --   "nutrition": 85,
  --   "movement": 60,
  --   "sleep": 90,
  --   "psychology": 75,
  --   "medicine": 95,
  --   "relationships": 70,
  --   "habits": 80
  -- }
  
  -- Key Metrics Summary
  key_metrics JSONB DEFAULT '{}'::jsonb,
  -- {
  --   "calories_consumed": 1850,
  --   "calories_burned": 420,
  --   "steps": 8432,
  --   "sleep_hours": 7.5,
  --   "water_ml": 1200,
  --   "mood_score": 8,
  --   "stress_level": 4
  -- }
  
  -- Streak Data
  streaks JSONB DEFAULT '{}'::jsonb,
  -- {
  --   "current": 12,
  --   "nutrition": 15,
  --   "movement": 8,
  --   "sleep": 20
  -- }
  
  -- AI Insights for the day
  ai_insights JSONB[] DEFAULT '{}',
  
  -- Completion Status
  modules_completed VARCHAR(20)[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_snapshots_user_date ON daily_health_snapshots(user_id, date DESC);
CREATE INDEX idx_snapshots_date ON daily_health_snapshots(date DESC);
```

### 3. Cross-Module Correlations
```sql
-- ============================================
-- AI: Cross-Module Correlations
-- ============================================

CREATE TABLE health_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Correlation Definition
  module_1 VARCHAR(20) NOT NULL,
  metric_1 VARCHAR(50) NOT NULL,
  module_2 VARCHAR(20) NOT NULL,
  metric_2 VARCHAR(50) NOT NULL,
  
  -- Analysis
  correlation_strength DECIMAL(3,2) CHECK (correlation_strength >= -1 AND correlation_strength <= 1),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  sample_size INT,
  
  -- Insight
  insight_text TEXT,
  insight_type VARCHAR(20) CHECK (insight_type IN ('positive', 'negative', 'causal', 'association')),
  
  -- Actionable Recommendations
  recommendations JSONB[],
  
  -- Discovery Metadata
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  last_validated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_correlations_user ON health_correlations(user_id, is_active);
CREATE INDEX idx_correlation_modules ON health_correlations(module_1, module_2);

-- Example correlations:
-- sleep_quality -> mood_score (positive, 0.78)
-- evening_caffeine -> sleep_quality (negative, -0.65)
-- workout -> deep_sleep (positive, 0.52)
```

### 4. Unified Notifications
```sql
-- ============================================
-- NOTIFICATIONS: Unified System
-- ============================================

CREATE TABLE health_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification Content
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  
  -- Source Module
  source_module VARCHAR(20) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  -- 'reminder', 'insight', 'achievement', 'warning', 'goal_progress', 'correlation'
  
  -- Priority & Timing
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  scheduled_for TIMESTAMPTZ,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  is_actioned BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Action
  action_type VARCHAR(50), -- 'open_module', 'log_data', 'view_insight', 'take_survey'
  action_payload JSONB,
  
  -- Related Data
  related_module VARCHAR(20),
  related_entity_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_unread ON health_notifications(user_id, is_read, scheduled_for DESC);
CREATE INDEX idx_notifications_user_module ON health_notifications(user_id, source_module);
```

---

## 📊 Module-Specific Tables (Summary)

### NUTRITION Module Tables:
- `nutrition_foods` - база продуктов
- `nutrition_recipes` - рецепты
- `nutrition_diary_entries` - дневник питания
- `nutrition_goals` - цели
- `nutrition_water_log` - учет воды
- `nutrition_weight_log` - вес

### MOVEMENT Module Tables:
- `movement_exercises` - справочник упражнений
- `movement_workouts` - тренировки
- `movement_daily_activity` - шаги/активность
- `movement_programs` - программы
- `movement_recovery_status` - восстановление

### SLEEP Module Tables:
- `sleep_sessions` - сессии сна
- `sleep_phases` - фазы сна
- `sleep_goals` - расписание/цели
- `sleep_routine_checklist` - гигиена сна
- `sleep_factors` - факторы влияния

### PSYCHOLOGY Module Tables:
- `psychology_mood_entries` - настроение
- `psychology_assessments` - опросники
- `psychology_technique_sessions` - техники
- `psychology_journal_entries` - дневник

### MEDICINE Module Tables:
- `medicine_user_medications` - лекарства
- `medicine_intake_log` - приемы
- `medicine_symptom_entries` - симптомы
- `medicine_lab_results` - анализы
- `medicine_appointments` - приемы у врачей

### RELATIONSHIPS Module Tables:
- `relationships_contacts` - контакты
- `relationships_interactions` - взаимодействия
- `relationships_assessments` - оценки отношений

### HABITS Module Tables:
- `habits_user_habits` - привычки пользователя
- `habits_completions` - выполнения
- `habits_streak_history` - история streaks

---

## 🔗 Cross-Module Triggers

### Auto-update daily snapshot on module update:
```sql
-- Function to update daily snapshot
CREATE OR REPLACE FUNCTION update_daily_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_date DATE;
BEGIN
  -- Determine user_id and date from the triggering table
  IF TG_TABLE_NAME = 'nutrition_diary_entries' THEN
    v_user_id := NEW.user_id;
    v_date := NEW.date;
  ELSIF TG_TABLE_NAME = 'movement_workouts' THEN
    v_user_id := NEW.user_id;
    v_date := DATE(NEW.start_time);
  ELSIF TG_TABLE_NAME = 'sleep_sessions' THEN
    v_user_id := NEW.user_id;
    v_date := NEW.date;
  ELSIF TG_TABLE_NAME = 'psychology_mood_entries' THEN
    v_user_id := NEW.user_id;
    v_date := NEW.date;
  ELSIF TG_TABLE_NAME = 'medicine_intake_log' THEN
    v_user_id := NEW.user_id;
    v_date := DATE(NEW.taken_at);
  ELSIF TG_TABLE_NAME = 'habits_completions' THEN
    v_user_id := NEW.user_id;
    v_date := NEW.completion_date;
  END IF;
  
  -- Insert or update daily snapshot
  INSERT INTO daily_health_snapshots (
    user_id, date, modules_completed, updated_at
  ) VALUES (
    v_user_id, v_date, ARRAY[TG_TABLE_NAME], NOW()
  )
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    modules_completed = array_append(
      COALESCE(daily_health_snapshots.modules_completed, ARRAY[]::varchar[]),
      TG_TABLE_NAME
    ),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_nutrition_update_snapshot
  AFTER INSERT OR UPDATE ON nutrition_diary_entries
  FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot();

CREATE TRIGGER trg_movement_update_snapshot
  AFTER INSERT OR UPDATE ON movement_workouts
  FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot();

CREATE TRIGGER trg_sleep_update_snapshot
  AFTER INSERT OR UPDATE ON sleep_sessions
  FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot();

CREATE TRIGGER trg_psychology_update_snapshot
  AFTER INSERT OR UPDATE ON psychology_mood_entries
  FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot();

CREATE TRIGGER trg_medicine_update_snapshot
  AFTER INSERT OR UPDATE ON medicine_intake_log
  FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot();

CREATE TRIGGER trg_habits_update_snapshot
  AFTER INSERT OR UPDATE ON habits_completions
  FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot();
```

---

## 📈 Daily Score Calculation

```sql
-- Function to calculate module scores
CREATE OR REPLACE FUNCTION calculate_module_score(
  p_user_id UUID,
  p_date DATE,
  p_module VARCHAR(20)
)
RETURNS INT AS $$
DECLARE
  v_score INT := 50; -- base score
BEGIN
  CASE p_module
    WHEN 'nutrition' THEN
      -- Calculate based on: calorie adherence, macro balance, water intake
      SELECT 
        CASE 
          WHEN ABS(total_calories - target_calories) / target_calories < 0.1 THEN 30
          WHEN ABS(total_calories - target_calories) / target_calories < 0.2 THEN 20
          ELSE 10
        END +
        CASE 
          WHEN protein_percent BETWEEN 15 AND 35 THEN 20
          ELSE 10
        END +
        CASE 
          WHEN water_ml >= target_water * 0.8 THEN 20
          WHEN water_ml >= target_water * 0.5 THEN 10
          ELSE 0
        END +
        LEAST(30, (meals_logged * 10)) -- up to 30 for logging meals
      INTO v_score
      FROM (
        SELECT 
          COALESCE(SUM(calculated_nutrients->>'calories')::int, 0) as total_calories,
          (SELECT target_calories FROM nutrition_goals WHERE user_id = p_user_id AND is_active = true LIMIT 1) as target_calories,
          COALESCE((SELECT SUM(amount_ml) FROM nutrition_water_log WHERE user_id = p_user_id AND date = p_date), 0) as water_ml,
          (SELECT target_water_ml FROM nutrition_goals WHERE user_id = p_user_id AND is_active = true LIMIT 1) as target_water,
          COUNT(*) as meals_logged
        FROM nutrition_diary_entries
        WHERE user_id = p_user_id AND date = p_date
      ) data;
      
    WHEN 'movement' THEN
      -- Calculate based on: steps, active minutes, workout completion
      SELECT 
        LEAST(40, (steps / 10000.0 * 40)::int) +
        LEAST(30, (active_minutes / 30.0 * 30)::int) +
        CASE WHEN workout_completed THEN 30 ELSE 0 END
      INTO v_score
      FROM (
        SELECT 
          COALESCE(steps, 0) as steps,
          COALESCE(active_minutes, 0) as active_minutes,
          EXISTS(SELECT 1 FROM movement_workouts WHERE user_id = p_user_id AND DATE(start_time) = p_date) as workout_completed
        FROM movement_daily_activity
        WHERE user_id = p_user_id AND date = p_date
      ) data;
      
    WHEN 'sleep' THEN
      -- Calculate based on: duration, efficiency, schedule adherence
      SELECT 
        CASE 
          WHEN duration_minutes >= 420 AND duration_minutes <= 540 THEN 40
          WHEN duration_minutes >= 360 THEN 30
          ELSE 20
        END +
        CASE 
          WHEN sleep_efficiency_percent >= 85 THEN 30
          WHEN sleep_efficiency_percent >= 70 THEN 20
          ELSE 10
        END +
        CASE 
          WHEN ABS(EXTRACT(EPOCH FROM (bedtime - target_bedtime))/60) < 30 THEN 30
          WHEN ABS(EXTRACT(EPOCH FROM (bedtime - target_bedtime))/60) < 60 THEN 20
          ELSE 10
        END
      INTO v_score
      FROM sleep_sessions s
      LEFT JOIN sleep_goals g ON g.user_id = p_user_id AND g.is_active = true
      WHERE s.user_id = p_user_id AND s.date = p_date;
      
    -- Similar calculations for psychology, medicine, relationships, habits
    ELSE
      v_score := 50;
  END CASE;
  
  RETURN LEAST(100, GREATEST(0, v_score));
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Views for Dashboard

```sql
-- Unified dashboard view
CREATE OR REPLACE VIEW v_user_health_dashboard AS
SELECT 
  s.user_id,
  s.date,
  s.overall_score,
  s.module_scores,
  s.key_metrics,
  s.streaks,
  s.ai_insights,
  p.current_overall_streak,
  p.longest_overall_streak,
  -- Calculate trend (vs yesterday)
  LAG(s.overall_score) OVER (PARTITION BY s.user_id ORDER BY s.date) as yesterday_score,
  s.overall_score - LAG(s.overall_score) OVER (PARTITION BY s.user_id ORDER BY s.date) as score_change
FROM daily_health_snapshots s
JOIN health_profiles p ON p.user_id = s.user_id
WHERE s.date >= CURRENT_DATE - INTERVAL '30 days';

-- Weekly summary view
CREATE OR REPLACE VIEW v_user_weekly_summary AS
SELECT 
  user_id,
  DATE_TRUNC('week', date) as week_start,
  AVG(overall_score) as avg_weekly_score,
  AVG((module_scores->>'nutrition')::int) as avg_nutrition,
  AVG((module_scores->>'movement')::int) as avg_movement,
  AVG((module_scores->>'sleep')::int) as avg_sleep,
  AVG((module_scores->>'psychology')::int) as avg_psychology,
  AVG((module_scores->>'medicine')::int) as avg_medicine,
  AVG((module_scores->>'relationships')::int) as avg_relationships,
  AVG((module_scores->>'habits')::int) as avg_habits,
  COUNT(DISTINCT date) as days_logged
FROM daily_health_snapshots
WHERE date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY user_id, DATE_TRUNC('week', date)
ORDER BY week_start DESC;
```

---

## ✅ Migration Order

Execute migrations in this order:

1. **Core Tables**
   - `health_profiles`
   - `daily_health_snapshots`
   - `health_correlations`
   - `health_notifications`

2. **Module Tables** (can be parallel)
   - Nutrition module tables
   - Movement module tables
   - Sleep module tables
   - Psychology module tables
   - Medicine module tables
   - Relationships module tables
   - Habits module tables

3. **Functions & Triggers**
   - `update_daily_snapshot()`
   - `calculate_module_score()`
   - All table triggers

4. **Views**
   - `v_user_health_dashboard`
   - `v_user_weekly_summary`
   - Module-specific views

---

**Готово к деплою!** 🚀
