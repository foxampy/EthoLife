-- ============================================
-- PSYCHOLOGY MODULE
-- Migration: 20250301000006
-- ============================================

-- ============================================
-- 1. MOOD ENTRIES (Daily check-ins)
-- ============================================

CREATE TABLE psychology_mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_of_day VARCHAR(20) CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
  
  -- Core metrics (1-10 scale)
  overall_mood INT CHECK (overall_mood >= 1 AND overall_mood <= 10),
  energy_level INT CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INT CHECK (stress_level >= 1 AND stress_level <= 10),
  anxiety_level INT CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  focus_level INT CHECK (focus_level >= 1 AND focus_level <= 10),
  
  -- Emotions and context
  emotions VARCHAR(50)[],
  mood_tags VARCHAR(50)[],
  journal_entry TEXT,
  voice_note_url VARCHAR(500),
  photo_mood_url VARCHAR(500),
  
  -- Context
  weather VARCHAR(20),
  location_context VARCHAR(50),
  social_context VARCHAR(50),
  trigger_event TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date, time_of_day)
);

CREATE INDEX idx_mood_entries_user_date ON psychology_mood_entries(user_id, date DESC);
CREATE INDEX idx_mood_entries_user_time ON psychology_mood_entries(user_id, time_of_day);

-- ============================================
-- 2. EMOTION CHECKINS (Detailed emotions)
-- ============================================

CREATE TABLE psychology_emotion_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_entry_id UUID REFERENCES psychology_mood_entries(id) ON DELETE CASCADE,
  
  emotion_name VARCHAR(50) NOT NULL,
  emotion_intensity INT CHECK (emotion_intensity >= 1 AND emotion_intensity <= 10),
  valence VARCHAR(20) CHECK (valence IN ('positive', 'neutral', 'negative')),
  arousal INT CHECK (arousal >= 1 AND arousal <= 10),
  body_sensation VARCHAR(255),
  duration_minutes INT,
  resolved BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emotion_checkins_user ON psychology_emotion_checkins(user_id, created_at DESC);
CREATE INDEX idx_emotion_checkins_mood_entry ON psychology_emotion_checkins(mood_entry_id);

-- ============================================
-- 3. ASSESSMENTS (PHQ-9, GAD-7, etc.)
-- ============================================

CREATE TABLE psychology_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  assessment_type VARCHAR(20) CHECK (assessment_type IN ('phq9', 'gad7', 'pss', 'wb5', 'who5', 'custom')),
  assessment_name VARCHAR(255) NOT NULL,
  total_score INT,
  severity_level VARCHAR(30) CHECK (severity_level IN ('minimal', 'mild', 'moderate', 'moderately_severe', 'severe')),
  answers JSONB DEFAULT '{}'::jsonb,
  interpretation TEXT,
  
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  next_recommended_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_user ON psychology_assessments(user_id, taken_at DESC);
CREATE INDEX idx_assessments_type ON psychology_assessments(user_id, assessment_type, taken_at DESC);

-- PHQ-9 specific scores
CREATE TABLE psychology_phq9_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES psychology_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  total_score INT CHECK (total_score >= 0 AND total_score <= 27),
  severity VARCHAR(20),
  suicidal_ideation_flag BOOLEAN DEFAULT false,
  requires_follow_up BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_phq9_user ON psychology_phq9_scores(user_id, created_at DESC);

-- GAD-7 specific scores
CREATE TABLE psychology_gad7_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES psychology_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  total_score INT CHECK (total_score >= 0 AND total_score <= 21),
  severity VARCHAR(20),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gad7_user ON psychology_gad7_scores(user_id, created_at DESC);

-- ============================================
-- 4. TECHNIQUES LIBRARY
-- ============================================

CREATE TABLE psychology_techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255),
  category VARCHAR(30) CHECK (category IN ('breathing', 'meditation', 'cbt', 'grounding', 'mindfulness', 'gratitude', 'journaling', 'visualization', 'somatic', 'relaxation')),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INT,
  
  description TEXT,
  instructions TEXT[],
  
  audio_url VARCHAR(500),
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  
  tags VARCHAR(50)[],
  target_symptoms VARCHAR(50)[],
  
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_techniques_category ON psychology_techniques(category);
CREATE INDEX idx_techniques_symptoms ON psychology_techniques USING GIN(target_symptoms);

-- Insert default techniques
INSERT INTO psychology_techniques (name, name_ru, category, difficulty, duration_minutes, description, instructions, tags, target_symptoms) VALUES
('4-7-8 Breathing', 'Дыхание 4-7-8', 'breathing', 'beginner', 5, 
 'A relaxing breathing technique that reduces anxiety and helps with sleep', 
 ARRAY['Place the tip of your tongue behind your upper front teeth', 'Exhale completely through your mouth', 'Close your mouth and inhale through your nose for 4 seconds', 'Hold your breath for 7 seconds', 'Exhale completely through your mouth for 8 seconds', 'Repeat the cycle 3 more times'],
 ARRAY['breathing', 'anxiety', 'sleep'], ARRAY['anxiety', 'insomnia', 'stress']),

('Box Breathing', 'Квадратное дыхание', 'breathing', 'beginner', 4,
 'Used by Navy SEALs to stay calm under pressure',
 ARRAY['Inhale for 4 counts', 'Hold for 4 counts', 'Exhale for 4 counts', 'Hold empty for 4 counts', 'Repeat for 5 minutes'],
 ARRAY['breathing', 'focus', 'stress'], ARRAY['stress', 'anxiety', 'focus']),

('Body Scan Meditation', 'Сканирование тела', 'meditation', 'beginner', 15,
 'Progressive relaxation through body awareness',
 ARRAY['Lie down in a comfortable position', 'Close your eyes and take deep breaths', 'Focus attention on your toes', 'Slowly move attention up through your body', 'Notice any tension and let it go', 'Reach the top of your head', 'Take a final deep breath and open your eyes'],
 ARRAY['meditation', 'relaxation', 'sleep'], ARRAY['stress', 'insomnia', 'tension']),

('5-4-3-2-1 Grounding', 'Заземление 5-4-3-2-1', 'grounding', 'beginner', 3,
 'Quick technique to manage anxiety and panic',
 ARRAY['Name 5 things you can see', 'Name 4 things you can touch', 'Name 3 things you can hear', 'Name 2 things you can smell', 'Name 1 thing you can taste'],
 ARRAY['grounding', 'anxiety', 'panic'], ARRAY['anxiety', 'panic', 'dissociation']),

('Worry Time', 'Время для тревог', 'cbt', 'intermediate', 20,
 'Schedule worry to prevent it from taking over your day',
 ARRAY['Set a specific time each day for worrying', 'When worries come outside this time, write them down', 'Postpone thinking about them until worry time', 'During worry time, review your list', 'Distinguish between controllable and uncontrollable worries', 'Create action plans for controllable worries', 'Let go of uncontrollable worries'],
 ARRAY['cbt', 'anxiety', 'worry'], ARRAY['anxiety', 'overthinking', 'insomnia']),

('Gratitude Journal', 'Дневник благодарности', 'gratitude', 'beginner', 10,
 'Write down things you are grateful for to boost mood',
 ARRAY['Find a quiet moment', 'Write 3 things you are grateful for today', 'Be specific - not just "family" but "mom''s call today"', 'Write why each thing matters to you', 'Notice how you feel after writing'],
 ARRAY['gratitude', 'mood', 'positive'], ARRAY['depression', 'low_mood', 'negativity']),

('Progressive Muscle Relaxation', 'Прогрессивная релаксация', 'relaxation', 'intermediate', 15,
 'Tense and release muscle groups to reduce physical tension',
 ARRAY['Find a comfortable position', 'Start with your feet - tense for 5 seconds', 'Release and notice the relaxation', 'Move to calves, thighs, stomach', 'Continue to hands, arms, shoulders', 'Finish with face and neck', 'Enjoy the full body relaxation'],
 ARRAY['relaxation', 'tension', 'sleep'], ARRAY['stress', 'muscle_tension', 'insomnia']),

('Loving Kindness Meditation', 'Медитация любящей доброты', 'meditation', 'intermediate', 10,
 'Cultivate compassion for yourself and others',
 ARRAY['Sit comfortably and close your eyes', 'Begin with yourself - "May I be happy"', 'Visualize a loved one, wish them well', 'Extend to a neutral person', 'Extend to someone difficult', 'Finally, extend to all beings', 'Rest in the feeling of connection'],
 ARRAY['meditation', 'compassion', 'connection'], ARRAY['anger', 'loneliness', 'self_criticism']);

-- ============================================
-- 5. TECHNIQUE SESSIONS
-- ============================================

CREATE TABLE psychology_technique_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES psychology_techniques(id) ON DELETE CASCADE,
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INT,
  completion_rate DECIMAL(5,2),
  
  effectiveness_rating INT CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 10),
  pre_stress_level INT CHECK (pre_stress_level >= 1 AND pre_stress_level <= 10),
  post_stress_level INT CHECK (post_stress_level >= 1 AND post_stress_level <= 10),
  mood_before INT CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INT CHECK (mood_after >= 1 AND mood_after <= 10),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_technique_sessions_user ON psychology_technique_sessions(user_id, started_at DESC);
CREATE INDEX idx_technique_sessions_technique ON psychology_technique_sessions(technique_id);

-- ============================================
-- 6. JOURNAL ENTRIES
-- ============================================

CREATE TABLE psychology_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  entry_type VARCHAR(30) CHECK (entry_type IN ('free_form', 'gratitude', 'worry_dump', 'cognitive_restructuring', 'goal_setting', 'reflection')),
  title VARCHAR(255),
  content TEXT NOT NULL,
  
  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  word_count INT,
  writing_duration_minutes INT,
  
  mood_before INT CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INT CHECK (mood_after >= 1 AND mood_after <= 10),
  
  is_favorite BOOLEAN DEFAULT false,
  is_shared_with_therapist BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_entries_user ON psychology_journal_entries(user_id, created_at DESC);
CREATE INDEX idx_journal_entries_type ON psychology_journal_entries(user_id, entry_type);

-- ============================================
-- 7. GOALS
-- ============================================

CREATE TABLE psychology_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  goal_type VARCHAR(50) CHECK (goal_type IN ('reduce_anxiety', 'improve_mood', 'better_sleep', 'increase_resilience', 'stress_management', 'build_confidence', 'overcome_phobia', 'other')),
  description TEXT NOT NULL,
  target_metric VARCHAR(50),
  current_baseline INT,
  target_value INT,
  deadline DATE,
  action_plan TEXT[],
  
  progress_percent INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  achieved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON psychology_goals(user_id, is_active);

-- ============================================
-- 8. CRISIS FLAGS
-- ============================================

CREATE TABLE psychology_crisis_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  flag_type VARCHAR(50) CHECK (flag_type IN ('low_mood_streak', 'high_anxiety', 'suicidal_ideation', 'self_harm', 'isolation', 'sudden_change')),
  severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'immediate')),
  trigger_data JSONB DEFAULT '{}'::jsonb,
  
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crisis_flags_user ON psychology_crisis_flags(user_id, is_resolved);
CREATE INDEX idx_crisis_flags_severity ON psychology_crisis_flags(severity, created_at DESC);

-- ============================================
-- 9. EMERGENCY CONTACTS
-- ============================================

CREATE TABLE psychology_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  contact_type VARCHAR(30) CHECK (contact_type IN ('therapist', 'psychiatrist', 'family', 'friend', 'crisis_line')),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_24_7 BOOLEAN DEFAULT false,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emergency_contacts_user ON psychology_emergency_contacts(user_id, is_active);

-- ============================================
-- 10. RLS POLICIES
-- ============================================

ALTER TABLE psychology_mood_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own mood entries" ON psychology_mood_entries 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE psychology_emotion_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own emotion checkins" ON psychology_emotion_checkins 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE psychology_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own assessments" ON psychology_assessments 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE psychology_phq9_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own PHQ-9 scores" ON psychology_phq9_scores 
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE psychology_gad7_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own GAD-7 scores" ON psychology_gad7_scores 
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE psychology_techniques ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Techniques are viewable by everyone" ON psychology_techniques 
  FOR SELECT USING (true);

ALTER TABLE psychology_technique_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own technique sessions" ON psychology_technique_sessions 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE psychology_journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own journal entries" ON psychology_journal_entries 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE psychology_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own goals" ON psychology_goals 
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE psychology_crisis_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own crisis flags" ON psychology_crisis_flags 
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE psychology_emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own emergency contacts" ON psychology_emergency_contacts 
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 11. FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at
CREATE TRIGGER update_psychology_mood_updated_at BEFORE UPDATE ON psychology_mood_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psychology_journal_updated_at BEFORE UPDATE ON psychology_journal_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psychology_goals_updated_at BEFORE UPDATE ON psychology_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate PHQ-9 severity
CREATE OR REPLACE FUNCTION calculate_phq9_severity(score INT)
RETURNS VARCHAR AS $$
BEGIN
  IF score <= 4 THEN RETURN 'minimal';
  ELSIF score <= 9 THEN RETURN 'mild';
  ELSIF score <= 14 THEN RETURN 'moderate';
  ELSIF score <= 19 THEN RETURN 'moderately_severe';
  ELSE RETURN 'severe';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Calculate GAD-7 severity
CREATE OR REPLACE FUNCTION calculate_gad7_severity(score INT)
RETURNS VARCHAR AS $$
BEGIN
  IF score <= 4 THEN RETURN 'minimal';
  ELSIF score <= 9 THEN RETURN 'mild';
  ELSIF score <= 14 THEN RETURN 'moderate';
  ELSE RETURN 'severe';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update daily snapshot when mood entry is added
CREATE OR REPLACE FUNCTION update_snapshot_on_mood()
RETURNS TRIGGER AS $$
DECLARE
  v_snapshot_id UUID;
  v_avg_mood DECIMAL(4,2);
  v_score INT;
BEGIN
  -- Get or create snapshot
  SELECT id INTO v_snapshot_id
  FROM daily_health_snapshots
  WHERE user_id = NEW.user_id AND date = NEW.date;
  
  IF v_snapshot_id IS NULL THEN
    INSERT INTO daily_health_snapshots (user_id, date, module_scores, overall_score)
    VALUES (NEW.user_id, NEW.date, '{}'::jsonb, 0)
    RETURNING id INTO v_snapshot_id;
  END IF;
  
  -- Calculate average mood for the day
  SELECT AVG(overall_mood) INTO v_avg_mood
  FROM psychology_mood_entries
  WHERE user_id = NEW.user_id AND date = NEW.date;
  
  -- Calculate psychology score (based on mood, inverse of stress/anxiety)
  -- Scale: mood * 10, minus stress/anxiety penalties
  v_score := LEAST(100, GREATEST(0, 
    ROUND((v_avg_mood * 10) - 
    (NEW.stress_level * 2) - 
    (NEW.anxiety_level * 2) + 
    (NEW.energy_level))
  ));
  
  -- Update snapshot
  UPDATE daily_health_snapshots SET
    module_scores = jsonb_set(
      COALESCE(module_scores, '{}'::jsonb),
      '{psychology}',
      to_jsonb(v_score)
    ),
    key_metrics = jsonb_set(
      COALESCE(key_metrics, '{}'::jsonb),
      '{mood}',
      to_jsonb(NEW.overall_mood)
    ),
    modules_completed = CASE 
      WHEN 'psychology' = ANY(COALESCE(modules_completed, ARRAY[]::varchar[]))
      THEN modules_completed
      ELSE array_append(COALESCE(modules_completed, ARRAY[]::varchar[]), 'psychology')
    END,
    updated_at = NOW()
  WHERE id = v_snapshot_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mood_update_snapshot
  AFTER INSERT OR UPDATE ON psychology_mood_entries
  FOR EACH ROW EXECUTE FUNCTION update_snapshot_on_mood();

-- Crisis detection trigger
CREATE OR REPLACE FUNCTION detect_crisis()
RETURNS TRIGGER AS $$
DECLARE
  v_low_mood_count INT;
  v_last_7_days DATE;
BEGIN
  v_last_7_days := CURRENT_DATE - INTERVAL '7 days';
  
  -- Check for low mood streak (mood <= 3 for 3+ days in last 7)
  SELECT COUNT(DISTINCT date) INTO v_low_mood_count
  FROM psychology_mood_entries
  WHERE user_id = NEW.user_id 
    AND date >= v_last_7_days
    AND overall_mood <= 3;
  
  IF v_low_mood_count >= 3 THEN
    INSERT INTO psychology_crisis_flags (user_id, flag_type, severity, trigger_data)
    VALUES (
      NEW.user_id, 
      'low_mood_streak', 
      'moderate',
      jsonb_build_object('days_count', v_low_mood_count, 'mood_threshold', 3)
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Check for high anxiety (>= 8)
  IF NEW.anxiety_level >= 8 THEN
    INSERT INTO psychology_crisis_flags (user_id, flag_type, severity, trigger_data)
    VALUES (
      NEW.user_id,
      'high_anxiety',
      CASE WHEN NEW.anxiety_level >= 9 THEN 'high' ELSE 'moderate' END,
      jsonb_build_object('anxiety_level', NEW.anxiety_level)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detect_crisis
  AFTER INSERT ON psychology_mood_entries
  FOR EACH ROW EXECUTE FUNCTION detect_crisis();

-- PHQ-9 completion handler
CREATE OR REPLACE FUNCTION handle_phq9_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_severity VARCHAR;
  v_suicidal_flag BOOLEAN;
BEGIN
  -- Calculate severity
  v_severity := calculate_phq9_severity(NEW.total_score);
  
  -- Check for suicidal ideation (question 9)
  v_suicidal_flag := (NEW.answers->>'q9')::int > 0;
  
  -- Insert detailed score record
  INSERT INTO psychology_phq9_scores (
    assessment_id, user_id, total_score, severity, 
    suicidal_ideation_flag, requires_follow_up
  ) VALUES (
    NEW.id, NEW.user_id, NEW.total_score, v_severity,
    v_suicidal_flag, v_suicidal_flag OR NEW.total_score >= 15
  );
  
  -- Create crisis flag if needed
  IF v_suicidal_flag THEN
    INSERT INTO psychology_crisis_flags (user_id, flag_type, severity, trigger_data)
    VALUES (
      NEW.user_id,
      'suicidal_ideation',
      'immediate',
      jsonb_build_object('phq9_score', NEW.total_score, 'q9_answer', NEW.answers->>'q9')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_handle_phq9
  AFTER INSERT ON psychology_assessments
  FOR EACH ROW WHEN (NEW.assessment_type = 'phq9')
  EXECUTE FUNCTION handle_phq9_completion();

-- GAD-7 completion handler
CREATE OR REPLACE FUNCTION handle_gad7_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_severity VARCHAR;
BEGIN
  -- Calculate severity
  v_severity := calculate_gad7_severity(NEW.total_score);
  
  -- Insert detailed score record
  INSERT INTO psychology_gad7_scores (
    assessment_id, user_id, total_score, severity
  ) VALUES (
    NEW.id, NEW.user_id, NEW.total_score, v_severity
  );
  
  -- Create crisis flag if severe
  IF NEW.total_score >= 15 THEN
    INSERT INTO psychology_crisis_flags (user_id, flag_type, severity, trigger_data)
    VALUES (
      NEW.user_id,
      'high_anxiety',
      'high',
      jsonb_build_object('gad7_score', NEW.total_score)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_handle_gad7
  AFTER INSERT ON psychology_assessments
  FOR EACH ROW WHEN (NEW.assessment_type = 'gad7')
  EXECUTE FUNCTION handle_gad7_completion();

-- ============================================
-- 12. VIEWS
-- ============================================

-- Daily mood summary
CREATE OR REPLACE VIEW v_daily_mood_summary AS
SELECT 
  user_id,
  date,
  AVG(overall_mood) as avg_mood,
  AVG(energy_level) as avg_energy,
  AVG(stress_level) as avg_stress,
  AVG(anxiety_level) as avg_anxiety,
  AVG(focus_level) as avg_focus,
  COUNT(*) as entries_count,
  MODE() WITHIN GROUP (ORDER BY UNNEST(emotions)) as common_emotion
FROM psychology_mood_entries
GROUP BY user_id, date;

-- Weekly mood trends
CREATE OR REPLACE VIEW v_weekly_mood_trends AS
SELECT 
  user_id,
  DATE_TRUNC('week', date) as week_start,
  AVG(overall_mood) as avg_weekly_mood,
  MIN(overall_mood) as min_mood,
  MAX(overall_mood) as max_mood,
  STDDEV(overall_mood) as mood_volatility,
  COUNT(DISTINCT date) as days_logged
FROM psychology_mood_entries
GROUP BY user_id, DATE_TRUNC('week', date);

-- Technique effectiveness
CREATE OR REPLACE VIEW v_technique_effectiveness AS
SELECT 
  ts.user_id,
  ts.technique_id,
  t.name as technique_name,
  t.category,
  COUNT(*) as sessions_count,
  AVG(ts.effectiveness_rating) as avg_effectiveness,
  AVG(ts.pre_stress_level - ts.post_stress_level) as avg_stress_reduction,
  AVG(ts.completion_rate) as avg_completion_rate
FROM psychology_technique_sessions ts
JOIN psychology_techniques t ON t.id = ts.technique_id
WHERE ts.completed_at IS NOT NULL
GROUP BY ts.user_id, ts.technique_id, t.name, t.category;

COMMENT ON TABLE psychology_mood_entries IS 'Daily mood tracking entries';
COMMENT ON TABLE psychology_assessments IS 'Mental health assessments (PHQ-9, GAD-7, etc.)';
COMMENT ON TABLE psychology_techniques IS 'Library of mental wellness techniques';
COMMENT ON TABLE psychology_technique_sessions IS 'User practice sessions of techniques';
