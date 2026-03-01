-- ============================================
-- SLEEP MODULE
-- Migration: 20250301000005
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ENUM TYPES
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sleep_phase_type') THEN
    CREATE TYPE sleep_phase_type AS ENUM ('deep', 'light', 'rem', 'awake');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sleep_source') THEN
    CREATE TYPE sleep_source AS ENUM ('manual', 'wearable', 'phone_app', 'smart_alarm');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chronotype') THEN
    CREATE TYPE chronotype AS ENUM ('lion', 'bear', 'wolf', 'dolphin');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alarm_response') THEN
    CREATE TYPE alarm_response AS ENUM ('dismissed', 'snoozed', 'missed');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sleep_factor_type') THEN
    CREATE TYPE sleep_factor_type AS ENUM (
      'caffeine', 'alcohol', 'exercise', 'stress', 'medication', 
      'late_meal', 'nap', 'travel', 'illness', 'other'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factor_impact') THEN
    CREATE TYPE factor_impact AS ENUM ('positive', 'negative', 'neutral');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nap_type') THEN
    CREATE TYPE nap_type AS ENUM ('power_nap_20min', 'restorative_90min', 'other');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nap_effect') THEN
    CREATE TYPE nap_effect AS ENUM ('improved', 'no_effect', 'worsened');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dream_time') THEN
    CREATE TYPE dream_time AS ENUM ('early_night', 'middle_night', 'early_morning');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'emotional_tone') THEN
    CREATE TYPE emotional_tone AS ENUM ('positive', 'neutral', 'negative', 'mixed', 'nightmare');
  END IF;
END$$;

-- ============================================
-- 2. CORE SLEEP TABLES
-- ============================================

-- Sleep Sessions
CREATE TABLE sleep_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bedtime TIMESTAMPTZ NOT NULL,
  wake_time TIMESTAMPTZ,
  duration_minutes INT CHECK (duration_minutes >= 0),
  sleep_latency_minutes INT DEFAULT 0 CHECK (sleep_latency_minutes >= 0),
  awake_duration_minutes INT DEFAULT 0 CHECK (awake_duration_minutes >= 0),
  sleep_efficiency_percent DECIMAL(5,2) CHECK (sleep_efficiency_percent >= 0 AND sleep_efficiency_percent <= 100),
  source sleep_source DEFAULT 'manual',
  quality_score INT CHECK (quality_score >= 0 AND quality_score <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_sleep_sessions_user_date ON sleep_sessions(user_id, date DESC);
CREATE INDEX idx_sleep_sessions_user ON sleep_sessions(user_id);

-- Sleep Phases
CREATE TABLE sleep_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sleep_session_id UUID NOT NULL REFERENCES sleep_sessions(id) ON DELETE CASCADE,
  phase_type sleep_phase_type NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  percentage_of_total DECIMAL(5,2) CHECK (percentage_of_total >= 0 AND percentage_of_total <= 100)
);

CREATE INDEX idx_sleep_phases_session ON sleep_phases(sleep_session_id);
CREATE INDEX idx_sleep_phases_type ON sleep_phases(phase_type);

-- Sleep Metrics (wearable data)
CREATE TABLE sleep_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sleep_session_id UUID NOT NULL REFERENCES sleep_sessions(id) ON DELETE CASCADE,
  heart_rate_avg INT CHECK (heart_rate_avg >= 30 AND heart_rate_avg <= 200),
  heart_rate_min INT CHECK (heart_rate_min >= 30 AND heart_rate_min <= 200),
  heart_rate_max INT CHECK (heart_rate_max >= 30 AND heart_rate_max <= 200),
  hrv_avg DECIMAL(5,2),
  breathing_rate_avg DECIMAL(4,1),
  body_temperature_avg DECIMAL(4,1),
  spo2_avg DECIMAL(4,1) CHECK (spo2_avg >= 0 AND spo2_avg <= 100),
  movement_score INT CHECK (movement_score >= 0 AND movement_score <= 100),
  snoring_duration_minutes INT,
  sleep_apnea_events INT,
  environmental_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sleep_metrics_session ON sleep_metrics(sleep_session_id);

-- ============================================
-- 3. GOALS & SCHEDULES
-- ============================================

-- Sleep Goals
CREATE TABLE sleep_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_bedtime TIME,
  target_wake_time TIME,
  target_duration_minutes INT DEFAULT 480 CHECK (target_duration_minutes >= 240 AND target_duration_minutes <= 720),
  target_sleep_efficiency DECIMAL(5,2) DEFAULT 85.00,
  workdays_schedule JSONB DEFAULT '{"bedtime": "22:00", "wake_time": "06:30", "is_enabled": true}'::jsonb,
  weekend_schedule JSONB DEFAULT '{"bedtime": "23:00", "wake_time": "08:00", "is_enabled": true}'::jsonb,
  chronotype chronotype DEFAULT 'bear',
  is_smart_alarm_enabled BOOLEAN DEFAULT false,
  smart_alarm_window_minutes INT DEFAULT 30 CHECK (smart_alarm_window_minutes >= 10 AND smart_alarm_window_minutes <= 60),
  alarm_sound VARCHAR(100) DEFAULT 'birds',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_sleep_goals_user ON sleep_goals(user_id);

-- Smart Alarm Log
CREATE TABLE sleep_smart_alarms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_session_id UUID REFERENCES sleep_sessions(id) ON DELETE SET NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  actual_trigger_time TIMESTAMPTZ,
  phase_at_trigger sleep_phase_type,
  user_response alarm_response,
  effectiveness_rating INT CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_smart_alarms_user ON sleep_smart_alarms(user_id);
CREATE INDEX idx_smart_alarms_session ON sleep_smart_alarms(sleep_session_id);

-- ============================================
-- 4. HYGIENE & ROUTINE
-- ============================================

-- Sleep Routine Checklist
CREATE TABLE sleep_routine_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  no_caffeine_after_14h BOOLEAN DEFAULT false,
  no_heavy_meal_3h_before BOOLEAN DEFAULT false,
  no_screens_1h_before BOOLEAN DEFAULT false,
  dimmed_lights BOOLEAN DEFAULT false,
  meditation_or_relaxation BOOLEAN DEFAULT false,
  consistent_bedtime BOOLEAN DEFAULT false,
  cool_room BOOLEAN DEFAULT false,
  darkness_and_silence BOOLEAN DEFAULT false,
  environment_score INT GENERATED ALWAYS AS (
    (CASE WHEN no_caffeine_after_14h THEN 12 ELSE 0 END +
     CASE WHEN no_heavy_meal_3h_before THEN 12 ELSE 0 END +
     CASE WHEN no_screens_1h_before THEN 12 ELSE 0 END +
     CASE WHEN dimmed_lights THEN 12 ELSE 0 END +
     CASE WHEN meditation_or_relaxation THEN 14 ELSE 0 END +
     CASE WHEN consistent_bedtime THEN 14 ELSE 0 END +
     CASE WHEN cool_room THEN 12 ELSE 0 END +
     CASE WHEN darkness_and_silence THEN 12 ELSE 0 END)
  ) STORED,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_sleep_routine_user_date ON sleep_routine_checklist(user_id, date DESC);

-- Sleep Factors
CREATE TABLE sleep_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sleep_session_id UUID NOT NULL REFERENCES sleep_sessions(id) ON DELETE CASCADE,
  factor_type sleep_factor_type NOT NULL,
  factor_value VARCHAR(255),
  estimated_impact factor_impact DEFAULT 'neutral',
  severity INT CHECK (severity >= 1 AND severity <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sleep_factors_session ON sleep_factors(sleep_session_id);
CREATE INDEX idx_sleep_factors_type ON sleep_factors(factor_type);

-- Sleep Naps
CREATE TABLE sleep_naps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INT CHECK (duration_minutes > 0),
  nap_type nap_type DEFAULT 'other',
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  effect_on_night_sleep nap_effect,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sleep_naps_user ON sleep_naps(user_id);
CREATE INDEX idx_sleep_naps_date ON sleep_naps(start_time DESC);

-- Sleep Dreams (optional feature)
CREATE TABLE sleep_dreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_session_id UUID REFERENCES sleep_sessions(id) ON DELETE CASCADE,
  dream_time dream_time,
  vividness INT CHECK (vividness >= 1 AND vividness <= 10),
  emotional_tone emotional_tone,
  content_summary TEXT,
  is_lucid BOOLEAN DEFAULT false,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sleep_dreams_user ON sleep_dreams(user_id);
CREATE INDEX idx_sleep_dreams_session ON sleep_dreams(sleep_session_id);

-- ============================================
-- 5. ANALYTICS TABLES
-- ============================================

-- Weekly Sleep Summaries
CREATE TABLE sleep_weekly_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  avg_duration_minutes INT,
  avg_quality_score INT,
  avg_sleep_efficiency DECIMAL(5,2),
  deep_sleep_avg_percent DECIMAL(5,2),
  rem_sleep_avg_percent DECIMAL(5,2),
  consistency_score INT CHECK (consistency_score >= 0 AND consistency_score <= 100),
  bedtime_variance_minutes INT,
  wake_time_variance_minutes INT,
  sleep_debt_minutes INT,
  ai_insights TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX idx_sleep_weekly_user_week ON sleep_weekly_summaries(user_id, week_start_date DESC);

-- Sleep Patterns
CREATE TABLE sleep_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_name VARCHAR(255) NOT NULL,
  description TEXT,
  pattern_type VARCHAR(50) CHECK (pattern_type IN (
    'irregular_bedtime', 'insufficient_sleep', 'poor_efficiency', 
    'good_consistency', 'improving_trend', 'declining_trend'
  )),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_sleep_patterns_user ON sleep_patterns(user_id, is_active);

-- Sleep AI Insights
CREATE TABLE sleep_ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  insight_type VARCHAR(20) CHECK (insight_type IN ('pattern', 'warning', 'recommendation', 'achievement', 'prediction', 'hygiene_tip')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  related_factors JSONB DEFAULT '{}'::jsonb,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sleep_insights_user ON sleep_ai_insights(user_id, date DESC);
CREATE INDEX idx_sleep_insights_unread ON sleep_ai_insights(user_id, is_read) WHERE is_read = false;

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Calculate sleep efficiency
CREATE OR REPLACE FUNCTION calculate_sleep_efficiency(
  p_duration INT,
  p_awake INT,
  p_latency INT
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_time INT;
  actual_sleep INT;
BEGIN
  total_time := p_duration + p_latency;
  actual_sleep := p_duration - p_awake;
  
  IF total_time <= 0 THEN
    RETURN 0;
  END IF;
  
  RETURN LEAST(100, GREATEST(0, ROUND((actual_sleep::numeric / total_time) * 100, 2)));
END;
$$ LANGUAGE plpgsql;

-- Calculate sleep score (0-100)
CREATE OR REPLACE FUNCTION calculate_sleep_score(
  p_duration INT,
  p_efficiency DECIMAL,
  p_deep_percent DECIMAL,
  p_rem_percent DECIMAL,
  p_quality INT
)
RETURNS INT AS $$
DECLARE
  duration_score INT;
  efficiency_score INT;
  phase_score INT;
BEGIN
  -- Duration score (optimal: 420-540 minutes / 7-9 hours)
  duration_score := LEAST(35, GREATEST(0, ROUND((p_duration::numeric / 480) * 35)));
  
  -- Efficiency score (optimal: 85%+)
  efficiency_score := LEAST(30, GREATEST(0, ROUND((p_efficiency / 100) * 30)));
  
  -- Phase score (optimal deep: 15-20%, REM: 20-25%)
  phase_score := LEAST(20, GREATEST(0, ROUND(((p_deep_percent + p_rem_percent) / 40) * 20)));
  
  -- Quality subjective score (0-15 points)
  IF p_quality IS NULL THEN
    p_quality := 50;
  END IF;
  
  RETURN LEAST(100, duration_score + efficiency_score + phase_score + (p_quality * 0.15));
END;
$$ LANGUAGE plpgsql;

-- Smart alarm: find optimal wake time
CREATE OR REPLACE FUNCTION find_optimal_wake_time(
  p_user_id UUID,
  p_target_time TIMESTAMPTZ
)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  window_start TIMESTAMPTZ;
  optimal_time TIMESTAMPTZ;
  light_phase sleep_phases%ROWTYPE;
BEGIN
  window_start := p_target_time - INTERVAL '30 minutes';
  
  -- Find a light phase within the window
  SELECT * INTO light_phase
  FROM sleep_phases sp
  JOIN sleep_sessions ss ON sp.sleep_session_id = ss.id
  WHERE ss.user_id = p_user_id
    AND ss.date = CURRENT_DATE
    AND sp.phase_type = 'light'
    AND sp.start_time >= window_start
    AND sp.start_time <= p_target_time
  ORDER BY sp.start_time DESC
  LIMIT 1;
  
  IF FOUND THEN
    RETURN light_phase.start_time;
  ELSE
    RETURN p_target_time;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update sleep session phases percentages
CREATE OR REPLACE FUNCTION update_phase_percentages()
RETURNS TRIGGER AS $$
DECLARE
  total_duration INT;
BEGIN
  SELECT SUM(duration_minutes) INTO total_duration
  FROM sleep_phases
  WHERE sleep_session_id = NEW.sleep_session_id;
  
  IF total_duration > 0 THEN
    UPDATE sleep_phases
    SET percentage_of_total = ROUND((duration_minutes::numeric / total_duration) * 100, 2)
    WHERE sleep_session_id = NEW.sleep_session_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_sleep_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. TRIGGERS
-- ============================================

-- Update timestamps
CREATE TRIGGER update_sleep_sessions_updated_at BEFORE UPDATE ON sleep_sessions
  FOR EACH ROW EXECUTE FUNCTION update_sleep_updated_at();

CREATE TRIGGER update_sleep_goals_updated_at BEFORE UPDATE ON sleep_goals
  FOR EACH ROW EXECUTE FUNCTION update_sleep_updated_at();

CREATE TRIGGER update_sleep_routine_updated_at BEFORE UPDATE ON sleep_routine_checklist
  FOR EACH ROW EXECUTE FUNCTION update_sleep_updated_at();

CREATE TRIGGER update_sleep_weekly_updated_at BEFORE UPDATE ON sleep_weekly_summaries
  FOR EACH ROW EXECUTE FUNCTION update_sleep_updated_at();

-- Update phase percentages
CREATE TRIGGER update_phase_percentages_trigger AFTER INSERT OR UPDATE ON sleep_phases
  FOR EACH ROW EXECUTE FUNCTION update_phase_percentages();

-- Auto-calculate sleep efficiency on session update
CREATE OR REPLACE FUNCTION auto_calculate_sleep_efficiency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.duration_minutes IS NOT NULL AND NEW.awake_duration_minutes IS NOT NULL AND NEW.sleep_latency_minutes IS NOT NULL THEN
    NEW.sleep_efficiency_percent := calculate_sleep_efficiency(
      NEW.duration_minutes, 
      NEW.awake_duration_minutes, 
      NEW.sleep_latency_minutes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calc_efficiency BEFORE INSERT OR UPDATE ON sleep_sessions
  FOR EACH ROW EXECUTE FUNCTION auto_calculate_sleep_efficiency();

-- Update daily health snapshot when sleep session changes
CREATE OR REPLACE FUNCTION update_sleep_daily_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  sleep_score INT;
  today_snapshot_id UUID;
  current_scores JSONB;
BEGIN
  -- Calculate sleep score
  sleep_score := calculate_sleep_score(
    COALESCE(NEW.duration_minutes, 0),
    COALESCE(NEW.sleep_efficiency_percent, 0),
    COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = NEW.id AND phase_type = 'deep'), 0),
    COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = NEW.id AND phase_type = 'rem'), 0),
    COALESCE(NEW.quality_score, 50)
  );
  
  -- Find or create today's snapshot
  SELECT id, module_scores INTO today_snapshot_id, current_scores
  FROM daily_health_snapshots
  WHERE user_id = NEW.user_id AND date = NEW.date;
  
  IF today_snapshot_id IS NULL THEN
    INSERT INTO daily_health_snapshots (
      user_id, date, module_scores, overall_score
    ) VALUES (
      NEW.user_id,
      NEW.date,
      jsonb_build_object('sleep', sleep_score),
      sleep_score * 0.20
    );
  ELSE
    UPDATE daily_health_snapshots
    SET 
      module_scores = jsonb_set(
        COALESCE(current_scores, '{}'::jsonb),
        '{sleep}',
        to_jsonb(sleep_score)
      ),
      updated_at = NOW()
    WHERE id = today_snapshot_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snapshot_after_sleep AFTER INSERT OR UPDATE ON sleep_sessions
  FOR EACH ROW EXECUTE FUNCTION update_sleep_daily_snapshot();

-- ============================================
-- 8. RLS POLICIES
-- ============================================

-- Sleep Sessions
ALTER TABLE sleep_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sleep sessions" ON sleep_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep sessions" ON sleep_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep sessions" ON sleep_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sleep sessions" ON sleep_sessions FOR DELETE USING (auth.uid() = user_id);

-- Sleep Phases
ALTER TABLE sleep_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sleep phases" ON sleep_phases FOR SELECT USING (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_phases.sleep_session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own sleep phases" ON sleep_phases FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_phases.sleep_session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own sleep phases" ON sleep_phases FOR UPDATE USING (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_phases.sleep_session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete own sleep phases" ON sleep_phases FOR DELETE USING (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_phases.sleep_session_id AND user_id = auth.uid())
);

-- Sleep Metrics
ALTER TABLE sleep_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sleep metrics" ON sleep_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_metrics.sleep_session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own sleep metrics" ON sleep_metrics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_metrics.sleep_session_id AND user_id = auth.uid())
);

-- Sleep Goals
ALTER TABLE sleep_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sleep goals" ON sleep_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep goals" ON sleep_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep goals" ON sleep_goals FOR UPDATE USING (auth.uid() = user_id);

-- Smart Alarms
ALTER TABLE sleep_smart_alarms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own smart alarms" ON sleep_smart_alarms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own smart alarms" ON sleep_smart_alarms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own smart alarms" ON sleep_smart_alarms FOR UPDATE USING (auth.uid() = user_id);

-- Sleep Routine Checklist
ALTER TABLE sleep_routine_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own routine checklist" ON sleep_routine_checklist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routine checklist" ON sleep_routine_checklist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routine checklist" ON sleep_routine_checklist FOR UPDATE USING (auth.uid() = user_id);

-- Sleep Factors
ALTER TABLE sleep_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sleep factors" ON sleep_factors FOR SELECT USING (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_factors.sleep_session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own sleep factors" ON sleep_factors FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM sleep_sessions WHERE id = sleep_factors.sleep_session_id AND user_id = auth.uid())
);

-- Sleep Naps
ALTER TABLE sleep_naps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own naps" ON sleep_naps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own naps" ON sleep_naps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own naps" ON sleep_naps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own naps" ON sleep_naps FOR DELETE USING (auth.uid() = user_id);

-- Sleep Dreams
ALTER TABLE sleep_dreams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own dreams" ON sleep_dreams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dreams" ON sleep_dreams FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Weekly Summaries
ALTER TABLE sleep_weekly_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own weekly summaries" ON sleep_weekly_summaries FOR SELECT USING (auth.uid() = user_id);

-- Sleep Patterns
ALTER TABLE sleep_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sleep patterns" ON sleep_patterns FOR SELECT USING (auth.uid() = user_id);

-- Sleep AI Insights
ALTER TABLE sleep_ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insights" ON sleep_ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON sleep_ai_insights FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 9. VIEWS
-- ============================================

-- Sleep dashboard view
CREATE OR REPLACE VIEW v_sleep_dashboard AS
SELECT 
  ss.user_id,
  ss.date,
  ss.id as session_id,
  ss.bedtime,
  ss.wake_time,
  ss.duration_minutes,
  ss.sleep_latency_minutes,
  ss.sleep_efficiency_percent,
  ss.quality_score,
  ss.source,
  ss.notes,
  -- Phase breakdown
  COALESCE((SELECT SUM(duration_minutes) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'deep'), 0) as deep_minutes,
  COALESCE((SELECT SUM(duration_minutes) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'light'), 0) as light_minutes,
  COALESCE((SELECT SUM(duration_minutes) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'rem'), 0) as rem_minutes,
  COALESCE((SELECT SUM(duration_minutes) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'awake'), 0) as awake_minutes,
  -- Phase percentages
  COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'deep'), 0) as deep_percent,
  COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'light'), 0) as light_percent,
  COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'rem'), 0) as rem_percent,
  -- Routine score
  src.environment_score as routine_score,
  -- Goals
  sg.target_bedtime,
  sg.target_wake_time,
  sg.target_duration_minutes,
  -- Calculated score
  calculate_sleep_score(
    COALESCE(ss.duration_minutes, 0),
    COALESCE(ss.sleep_efficiency_percent, 0),
    COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'deep'), 0),
    COALESCE((SELECT SUM(percentage_of_total) FROM sleep_phases WHERE sleep_session_id = ss.id AND phase_type = 'rem'), 0),
    COALESCE(ss.quality_score, 50)
  ) as calculated_score
FROM sleep_sessions ss
LEFT JOIN sleep_routine_checklist src ON ss.user_id = src.user_id AND ss.date = src.date
LEFT JOIN sleep_goals sg ON ss.user_id = sg.user_id
WHERE ss.date >= CURRENT_DATE - INTERVAL '30 days';

-- Sleep trends view
CREATE OR REPLACE VIEW v_sleep_trends AS
SELECT 
  user_id,
  DATE_TRUNC('week', date) as week_start,
  ROUND(AVG(duration_minutes), 0) as avg_duration,
  ROUND(AVG(quality_score), 0) as avg_quality,
  ROUND(AVG(sleep_efficiency_percent), 1) as avg_efficiency,
  COUNT(*) as nights_logged,
  STDDEV(EXTRACT(EPOCH FROM bedtime::time) / 60) / 60 as bedtime_variance_hours,
  STDDEV(EXTRACT(EPOCH FROM wake_time::time) / 60) / 60 as wake_time_variance_hours
FROM sleep_sessions
WHERE date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY user_id, DATE_TRUNC('week', date)
ORDER BY week_start DESC;

-- Today's sleep summary
CREATE OR REPLACE VIEW v_today_sleep AS
SELECT * FROM v_sleep_dashboard WHERE date = CURRENT_DATE;

-- ============================================
-- 10. INITIAL DATA SETUP
-- ============================================

-- Create default sleep goals for new users
CREATE OR REPLACE FUNCTION create_default_sleep_goals()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO sleep_goals (user_id, target_bedtime, target_wake_time, target_duration_minutes)
  VALUES (NEW.id, '22:30'::time, '06:30'::time, 480)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default goals on user creation
-- Note: This should be attached to auth.users if Supabase Auth is used
-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION create_default_sleep_goals();
