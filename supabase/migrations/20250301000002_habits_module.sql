-- ============================================
-- HABITS MODULE
-- Migration: 20250301000002
-- ============================================

-- ============================================
-- 1. HABIT TEMPLATES
-- ============================================

CREATE TABLE habits_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255),
  description TEXT,
  category VARCHAR(50) CHECK (category IN ('health', 'fitness', 'nutrition', 'sleep', 'productivity', 'learning', 'social', 'creativity', 'mindfulness', 'finance', 'environment', 'other')),
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  suggested_frequency VARCHAR(50),
  suggested_time_of_day TIME,
  estimated_duration_minutes INT,
  trigger_suggestion TEXT,
  reminder_template TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  related_modules VARCHAR(20)[],
  expected_benefits TEXT[],
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO habits_templates (name, name_ru, category, difficulty, icon, color, related_modules, expected_benefits) VALUES
('Drink water after waking', 'Пить воду после пробуждения', 'health', 'easy', '💧', '#3b82f6', ARRAY['nutrition'], ARRAY['Hydration', 'Energy boost']),
('Morning meditation', 'Утренняя медитация', 'mindfulness', 'easy', '🧘', '#8b5cf6', ARRAY['psychology', 'sleep'], ARRAY['Reduced stress', 'Better focus']),
('10K steps', '10 тысяч шагов', 'fitness', 'medium', '🚶', '#f97316', ARRAY['movement'], ARRAY['Cardiovascular health', 'Weight management']),
('Read 30 minutes', 'Читать 30 минут', 'learning', 'easy', '📚', '#eab308', ARRAY['psychology'], ARRAY['Knowledge growth', 'Mental stimulation']),
('No phone 1h before bed', 'Нет телефону за час до сна', 'sleep', 'medium', '📵', '#8b5cf6', ARRAY['sleep'], ARRAY['Better sleep quality', 'Reduced blue light exposure']),
('Gratitude journal', 'Дневник благодарности', 'mindfulness', 'easy', '🙏', '#ec4899', ARRAY['psychology'], ARRAY['Positive mindset', 'Reduced anxiety']),
('Take vitamins', 'Принимать витамины', 'health', 'easy', '💊', '#ef4444', ARRAY['nutrition', 'medicine'], ARRAY['Nutritional support', 'Immune health']),
('Call parents', 'Звонить родителям', 'social', 'easy', '👨‍👩‍👧', '#ec4899', ARRAY['relationships'], ARRAY['Stronger family bonds', 'Emotional support']);

-- ============================================
-- 2. USER HABITS
-- ============================================

CREATE TABLE habits_user_habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES habits_templates(id),
  
  custom_name VARCHAR(255) NOT NULL,
  description TEXT,
  habit_type VARCHAR(20) CHECK (habit_type IN ('build', 'quit', 'maintain')),
  category VARCHAR(50),
  
  -- Frequency configuration
  target_frequency JSONB DEFAULT '{"type": "daily"}'::jsonb,
  -- Examples:
  -- {"type": "daily"}
  -- {"type": "weekly", "days_of_week": [1,3,5]}
  -- {"type": "times_per_week", "times": 3}
  
  trigger_habit_id UUID REFERENCES habits_user_habits(id),
  cue_description TEXT,
  location VARCHAR(255),
  estimated_duration_minutes INT,
  
  -- Motivation & Goals
  why_important TEXT,
  success_criteria TEXT,
  
  -- Timeline
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_end_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  -- Statistics
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_completions INT DEFAULT 0,
  success_rate_percent DECIMAL(5,2) DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  
  -- Reminders
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_time TIME[],
  
  -- Social
  accountability_partner_id UUID REFERENCES auth.users(id),
  reward_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_habits_user ON habits_user_habits(user_id, is_active);
CREATE INDEX idx_habits_category ON habits_user_habits(user_id, category);

-- ============================================
-- 3. HABIT COMPLETIONS
-- ============================================

CREATE TABLE habits_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits_user_habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  notes TEXT,
  difficulty_rating INT CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  satisfaction_rating INT CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
  location VARCHAR(255),
  mood_before INT CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INT CHECK (mood_after >= 1 AND mood_after <= 10),
  proof_photo_url VARCHAR(500),
  proof_notes TEXT,
  is_backdated BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_completions_habit ON habits_completions(habit_id, completion_date DESC);
CREATE INDEX idx_completions_user_date ON habits_completions(user_id, completion_date DESC);

-- ============================================
-- 4. HABIT SKIPS (for analytics)
-- ============================================

CREATE TABLE habits_skips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits_user_habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  skip_reason VARCHAR(50) CHECK (skip_reason IN ('forgot', 'no_time', 'too_hard', 'not_motivated', 'emergency', 'intentional_rest', 'other')),
  reason_notes TEXT,
  recovery_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skips_user_date ON habits_skips(user_id, scheduled_date DESC);

-- ============================================
-- 5. STREAK HISTORY
-- ============================================

CREATE TABLE habits_streak_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits_user_habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  streak_type VARCHAR(20) CHECK (streak_type IN ('current', 'longest', 'broken')),
  streak_length INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streak_history_habit ON habits_streak_history(habit_id, created_at DESC);

-- ============================================
-- 6. ACHIEVEMENTS
-- ============================================

CREATE TABLE habits_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  achievement_type VARCHAR(50) CHECK (achievement_type IN (
    'streak_master', 'consistency_king', 'comeback_kid', 'habit_stacker',
    'early_bird', 'night_owl', 'weekend_warrior', 'perfect_week', 'phoenix_rising',
    'seven_day_streak', 'thirty_day_streak', 'hundred_day_streak'
  )),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  related_habit_id UUID REFERENCES habits_user_habits(id),
  rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common'
);

CREATE INDEX idx_achievements_user ON habits_achievements(user_id, earned_at DESC);

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE habits_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are viewable by everyone" ON habits_templates FOR SELECT USING (true);

ALTER TABLE habits_user_habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own habits" ON habits_user_habits 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE habits_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own completions" ON habits_completions 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE habits_skips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own skips" ON habits_skips 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE habits_streak_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own streak history" ON habits_streak_history 
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE habits_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON habits_achievements 
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at
CREATE TRIGGER update_habits_user_updated_at BEFORE UPDATE ON habits_user_habits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update habit stats after completion
CREATE OR REPLACE FUNCTION update_habit_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_current_streak INT;
  v_last_completion DATE;
  v_habit_frequency JSONB;
BEGIN
  -- Get habit frequency
  SELECT target_frequency INTO v_habit_frequency
  FROM habits_user_habits WHERE id = NEW.habit_id;
  
  -- Find last completion before this one
  SELECT completion_date INTO v_last_completion
  FROM habits_completions
  WHERE habit_id = NEW.habit_id AND completion_date < NEW.completion_date
  ORDER BY completion_date DESC
  LIMIT 1;
  
  -- Calculate streak
  IF v_last_completion IS NULL OR v_last_completion = NEW.completion_date - INTERVAL '1 day' THEN
    -- Continue or start streak
    SELECT COALESCE(current_streak, 0) + 1 INTO v_current_streak
    FROM habits_user_habits WHERE id = NEW.habit_id;
  ELSE
    -- Break streak
    v_current_streak := 1;
  END IF;
  
  -- Update habit
  UPDATE habits_user_habits SET
    current_streak = v_current_streak,
    longest_streak = GREATEST(longest_streak, v_current_streak),
    total_completions = total_completions + 1,
    last_completed_at = NEW.completed_at,
    success_rate_percent = (
      SELECT ROUND((COUNT(*)::numeric / NULLIF(
        (NEW.completion_date - start_date + 1), 0
      ) * 100), 2)
      FROM habits_completions
      WHERE habit_id = NEW.habit_id
    )
  WHERE id = NEW.habit_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_habit_stats
  AFTER INSERT ON habits_completions
  FOR EACH ROW EXECUTE FUNCTION update_habit_stats();

-- Update daily snapshot when habit completed
CREATE OR REPLACE FUNCTION update_snapshot_on_habit()
RETURNS TRIGGER AS $$
DECLARE
  v_snapshot_id UUID;
  v_completion_count INT;
  v_target_count INT;
  v_score INT;
BEGIN
  -- Get or create snapshot
  SELECT id INTO v_snapshot_id
  FROM daily_health_snapshots
  WHERE user_id = NEW.user_id AND date = NEW.completion_date;
  
  IF v_snapshot_id IS NULL THEN
    INSERT INTO daily_health_snapshots (user_id, date, module_scores, overall_score)
    VALUES (NEW.user_id, NEW.completion_date, '{}'::jsonb, 0)
    RETURNING id INTO v_snapshot_id;
  END IF;
  
  -- Count completions for today
  SELECT COUNT(*) INTO v_completion_count
  FROM habits_completions
  WHERE user_id = NEW.user_id AND completion_date = NEW.completion_date;
  
  -- Count active habits for today
  SELECT COUNT(*) INTO v_target_count
  FROM habits_user_habits
  WHERE user_id = NEW.user_id 
    AND is_active = true
    AND start_date <= NEW.completion_date
    AND (target_end_date IS NULL OR target_end_date >= NEW.completion_date);
  
  -- Calculate score (simple version)
  v_score := LEAST(100, ROUND((v_completion_count::numeric / NULLIF(v_target_count, 0) * 100)));
  
  -- Update snapshot
  UPDATE daily_health_snapshots SET
    module_scores = jsonb_set(
      COALESCE(module_scores, '{}'::jsonb),
      '{habits}',
      to_jsonb(v_score)
    ),
    modules_completed = array_append(
      COALESCE(modules_completed, ARRAY[]::varchar[]),
      'habits'
    ),
    updated_at = NOW()
  WHERE id = v_snapshot_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_habit_update_snapshot
  AFTER INSERT ON habits_completions
  FOR EACH ROW EXECUTE FUNCTION update_snapshot_on_habit();

-- Check and award achievements
CREATE OR REPLACE FUNCTION check_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- 7-day streak achievement
  IF NEW.current_streak = 7 AND OLD.current_streak < 7 THEN
    INSERT INTO habits_achievements (user_id, achievement_type, title, description, icon, rarity, related_habit_id)
    VALUES (
      NEW.user_id, 
      'seven_day_streak', 
      '7-Day Streak', 
      'Completed a habit for 7 days in a row!',
      '🔥',
      'common',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- 30-day streak achievement
  IF NEW.current_streak = 30 AND OLD.current_streak < 30 THEN
    INSERT INTO habits_achievements (user_id, achievement_type, title, description, icon, rarity, related_habit_id)
    VALUES (
      NEW.user_id, 
      'thirty_day_streak', 
      '30-Day Streak', 
      'Completed a habit for 30 days in a row!',
      '💪',
      'rare',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_achievements
  AFTER UPDATE OF current_streak ON habits_user_habits
  FOR EACH ROW EXECUTE FUNCTION check_achievements();

-- ============================================
-- 9. VIEWS
-- ============================================

-- Today's habits with completion status
CREATE OR REPLACE VIEW v_today_habits AS
SELECT 
  h.*,
  c.id as completion_id,
  c.completed_at,
  c.difficulty_rating,
  c.satisfaction_rating,
  CASE WHEN c.id IS NOT NULL THEN true ELSE false END as is_completed_today
FROM habits_user_habits h
LEFT JOIN habits_completions c ON c.habit_id = h.id AND c.completion_date = CURRENT_DATE
WHERE h.user_id = auth.uid()
  AND h.is_active = true
  AND h.start_date <= CURRENT_DATE
  AND (h.target_end_date IS NULL OR h.target_end_date >= CURRENT_DATE);

-- Habit statistics
CREATE OR REPLACE VIEW v_habit_stats AS
SELECT 
  h.id as habit_id,
  h.user_id,
  h.custom_name,
  h.current_streak,
  h.longest_streak,
  h.total_completions,
  h.success_rate_percent,
  COUNT(c.id) FILTER (WHERE c.completion_date >= CURRENT_DATE - INTERVAL '7 days') as completions_last_7_days,
  COUNT(c.id) FILTER (WHERE c.completion_date >= CURRENT_DATE - INTERVAL '30 days') as completions_last_30_days,
  AVG(c.difficulty_rating) as avg_difficulty,
  AVG(c.satisfaction_rating) as avg_satisfaction
FROM habits_user_habits h
LEFT JOIN habits_completions c ON c.habit_id = h.id
WHERE h.is_active = true
GROUP BY h.id, h.user_id, h.custom_name, h.current_streak, h.longest_streak, h.total_completions, h.success_rate_percent;

COMMENT ON TABLE habits_user_habits IS 'User habits with tracking configuration';
COMMENT ON TABLE habits_completions IS 'Daily habit completion log';
