-- ============================================
-- HEALTH MODULES - CORE TABLES
-- Migration: 20250301000001
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- 1. HEALTH PROFILES (Unified user health profile)
-- ============================================

CREATE TABLE health_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- ============================================
-- 2. DAILY HEALTH SNAPSHOTS (Unified daily summary)
-- ============================================

CREATE TABLE daily_health_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
  
  module_scores JSONB DEFAULT '{"nutrition": 0, "movement": 0, "sleep": 0, "psychology": 0, "medicine": 0, "relationships": 0, "habits": 0}'::jsonb,
  key_metrics JSONB DEFAULT '{}'::jsonb,
  streaks JSONB DEFAULT '{}'::jsonb,
  ai_insights JSONB[] DEFAULT ARRAY[]::jsonb[],
  modules_completed VARCHAR(20)[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX idx_snapshots_user_date ON daily_health_snapshots(user_id, date DESC);
CREATE INDEX idx_snapshots_date ON daily_health_snapshots(date DESC);

-- ============================================
-- 3. HEALTH CORRELATIONS
-- ============================================

CREATE TABLE health_correlations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  module_1 VARCHAR(20) NOT NULL,
  metric_1 VARCHAR(50) NOT NULL,
  module_2 VARCHAR(20) NOT NULL,
  metric_2 VARCHAR(50) NOT NULL,
  
  correlation_strength DECIMAL(3,2) CHECK (correlation_strength >= -1 AND correlation_strength <= 1),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  sample_size INT,
  
  insight_text TEXT,
  insight_type VARCHAR(20) CHECK (insight_type IN ('positive', 'negative', 'causal', 'association')),
  recommendations JSONB[],
  
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  last_validated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_correlations_user ON health_correlations(user_id, is_active);

-- ============================================
-- 4. UNIFIED NOTIFICATIONS
-- ============================================

CREATE TABLE health_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  source_module VARCHAR(20) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  scheduled_for TIMESTAMPTZ,
  
  is_read BOOLEAN DEFAULT false,
  is_actioned BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  action_type VARCHAR(50),
  action_payload JSONB,
  related_module VARCHAR(20),
  related_entity_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_unread ON health_notifications(user_id, is_read, scheduled_for DESC);

-- ============================================
-- 5. RLS POLICIES
-- ============================================

ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own health profile" ON health_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health profile" ON health_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health profile" ON health_profiles FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE daily_health_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own snapshots" ON daily_health_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snapshots" ON daily_health_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own snapshots" ON daily_health_snapshots FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE health_correlations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own correlations" ON health_correlations FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE health_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON health_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON health_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON health_notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON health_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_snapshots_updated_at BEFORE UPDATE ON daily_health_snapshots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate overall health score
CREATE OR REPLACE FUNCTION calculate_overall_health_score(
  p_nutrition INT, p_movement INT, p_sleep INT, p_psychology INT,
  p_medicine INT, p_relationships INT, p_habits INT
)
RETURNS INT AS $$
BEGIN
  RETURN LEAST(100, GREATEST(0, ROUND((
    p_nutrition * 0.15 + p_movement * 0.15 + p_sleep * 0.20 + 
    p_psychology * 0.20 + p_medicine * 0.10 + 
    p_relationships * 0.10 + p_habits * 0.10
  )::numeric)));
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. VIEWS
-- ============================================

CREATE OR REPLACE VIEW v_user_health_dashboard AS
SELECT 
  s.user_id, s.date, s.overall_score, s.module_scores,
  s.key_metrics, s.streaks, s.ai_insights, s.modules_completed,
  p.current_overall_streak, p.longest_overall_streak, p.primary_goal,
  LAG(s.overall_score) OVER (PARTITION BY s.user_id ORDER BY s.date) as yesterday_score,
  s.overall_score - COALESCE(LAG(s.overall_score) OVER (PARTITION BY s.user_id ORDER BY s.date), s.overall_score) as score_change
FROM daily_health_snapshots s
LEFT JOIN health_profiles p ON p.user_id = s.user_id
WHERE s.date >= CURRENT_DATE - INTERVAL '30 days';

CREATE OR REPLACE VIEW v_user_weekly_summary AS
SELECT 
  user_id, DATE_TRUNC('week', date) as week_start,
  ROUND(AVG(overall_score), 1) as avg_weekly_score,
  ROUND(AVG((module_scores->>'nutrition')::numeric), 1) as avg_nutrition,
  ROUND(AVG((module_scores->>'movement')::numeric), 1) as avg_movement,
  ROUND(AVG((module_scores->>'sleep')::numeric), 1) as avg_sleep,
  ROUND(AVG((module_scores->>'psychology')::numeric), 1) as avg_psychology,
  ROUND(AVG((module_scores->>'medicine')::numeric), 1) as avg_medicine,
  ROUND(AVG((module_scores->>'relationships')::numeric), 1) as avg_relationships,
  ROUND(AVG((module_scores->>'habits')::numeric), 1) as avg_habits,
  COUNT(DISTINCT date) as days_logged
FROM daily_health_snapshots
WHERE date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY user_id, DATE_TRUNC('week', date)
ORDER BY week_start DESC;

CREATE OR REPLACE VIEW v_today_dashboard AS
SELECT s.*, p.height_cm, p.current_weight_kg, p.birth_date, p.gender, p.primary_goal
FROM daily_health_snapshots s
LEFT JOIN health_profiles p ON p.user_id = s.user_id
WHERE s.date = CURRENT_DATE;
