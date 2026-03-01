-- ============================================
-- MOVEMENT MODULE - Activity & Workouts
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Exercise library
CREATE TABLE IF NOT EXISTS movement_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('cardio', 'strength', 'flexibility', 'balance', 'plyometrics', 'mobility')),
    muscle_groups VARCHAR(50)[] DEFAULT '{}',
    equipment VARCHAR(50)[] DEFAULT '{}',
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructions TEXT[] DEFAULT '{}',
    video_url VARCHAR(500),
    image_url VARCHAR(500),
    met_value DECIMAL(4,2),
    calories_per_hour INT,
    is_verified BOOLEAN DEFAULT false,
    tags VARCHAR(50)[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily activity tracking
CREATE TABLE IF NOT EXISTS movement_daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    steps INT DEFAULT 0,
    distance_meters INT DEFAULT 0,
    calories_burned INT DEFAULT 0,
    active_minutes INT DEFAULT 0,
    floors_climbed INT DEFAULT 0,
    source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'phone', 'wearable', 'mixed')),
    is_goal_achieved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Workouts
CREATE TABLE IF NOT EXISTS movement_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_type VARCHAR(50) NOT NULL CHECK (workout_type IN ('cardio', 'strength', 'hiit', 'yoga', 'pilates', 'running', 'cycling', 'swimming', 'walking', 'hiking', 'sports', 'martial_arts', 'dance', 'other')),
    name VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_seconds INT,
    calories_burned INT,
    heart_rate_avg INT,
    heart_rate_max INT,
    heart_rate_min INT,
    source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'app', 'wearable', 'imported')),
    location_data JSONB,
    notes TEXT,
    feeling_rating INT CHECK (feeling_rating BETWEEN 1 AND 10),
    rpe INT CHECK (rpe BETWEEN 6 AND 20),
    is_planned BOOLEAN DEFAULT false,
    planned_workout_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout exercises (sets/reps details)
CREATE TABLE IF NOT EXISTS movement_workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES movement_workouts(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES movement_exercises(id),
    exercise_name VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    notes TEXT,
    rest_seconds INT DEFAULT 60,
    sets JSONB[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training programs
CREATE TABLE IF NOT EXISTS movement_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    goal VARCHAR(50) CHECK (goal IN ('lose_weight', 'build_muscle', 'improve_endurance', 'general_fitness', 'strength', 'flexibility')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INT NOT NULL,
    days_per_week INT NOT NULL,
    equipment_needed VARCHAR(50)[] DEFAULT '{}',
    is_ai_generated BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    likes_count INT DEFAULT 0,
    weeks JSONB[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planned workouts
CREATE TABLE IF NOT EXISTS movement_planned_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES movement_programs(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    workout_type VARCHAR(50) NOT NULL CHECK (workout_type IN ('cardio', 'strength', 'hiit', 'yoga', 'pilates', 'running', 'cycling', 'swimming', 'walking', 'hiking', 'sports', 'martial_arts', 'dance', 'other')),
    estimated_duration_minutes INT,
    estimated_calories INT,
    exercises JSONB[] DEFAULT '{}',
    is_completed BOOLEAN DEFAULT false,
    completed_workout_id UUID REFERENCES movement_workouts(id),
    reminder_enabled BOOLEAN DEFAULT false,
    reminder_time TIME,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fitness metrics
CREATE TABLE IF NOT EXISTS movement_fitness_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    vo2_max DECIMAL(4,1),
    resting_heart_rate INT,
    recovery_heart_rate INT,
    hrv DECIMAL(5,2),
    lactate_threshold DECIMAL(4,1),
    ftp INT,
    body_composition JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Personal records
CREATE TABLE IF NOT EXISTS movement_personal_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES movement_exercises(id),
    pr_type VARCHAR(20) NOT NULL CHECK (pr_type IN ('weight', 'reps', 'distance', 'time', 'speed', 'power', 'volume')),
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    achieved_at TIMESTAMPTZ NOT NULL,
    workout_id UUID REFERENCES movement_workouts(id),
    previous_best DECIMAL(10,2),
    improvement_percent DECIMAL(5,2),
    is_notified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recovery status
CREATE TABLE IF NOT EXISTS movement_recovery_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    recovery_score INT CHECK (recovery_score BETWEEN 0 AND 100),
    sleep_quality_impact INT CHECK (sleep_quality_impact BETWEEN -50 AND 50),
    nutrition_impact INT CHECK (nutrition_impact BETWEEN -50 AND 50),
    stress_impact INT CHECK (stress_impact BETWEEN -50 AND 50),
    previous_workout_impact INT CHECK (previous_workout_impact BETWEEN -50 AND 50),
    readiness_to_train VARCHAR(20) CHECK (readiness_to_train IN ('low', 'moderate', 'high', 'optimal')),
    recommended_intensity VARCHAR(20) CHECK (recommended_intensity IN ('rest', 'light', 'moderate', 'hard', 'max')),
    muscle_groups_fatigue JSONB DEFAULT '{}',
    ai_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- AI insights
CREATE TABLE IF NOT EXISTS movement_ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('pattern', 'warning', 'recommendation', 'achievement', 'prediction', 'form_tip')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    related_metrics JSONB,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_movement_daily_activity_user_date ON movement_daily_activity(user_id, date);
CREATE INDEX IF NOT EXISTS idx_movement_workouts_user_start ON movement_workouts(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_movement_workout_exercises_workout ON movement_workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_movement_planned_workouts_user_date ON movement_planned_workouts(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_movement_programs_user ON movement_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_movement_personal_records_user ON movement_personal_records(user_id, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_movement_recovery_status_user_date ON movement_recovery_status(user_id, date);
CREATE INDEX IF NOT EXISTS idx_movement_ai_insights_user ON movement_ai_insights(user_id, created_at DESC);

-- ============================================
-- SAMPLE EXERCISES DATA
-- ============================================

INSERT INTO movement_exercises (name, name_ru, category, muscle_groups, equipment, difficulty, instructions, met_value, calories_per_hour, is_verified, tags) VALUES
-- Strength exercises
('Barbell Squat', 'Приседания со штангой', 'strength', ARRAY['legs', 'core'], ARRAY['barbell'], 'intermediate', 
 ARRAY['Stand with feet shoulder-width apart', 'Place barbell on upper back', 'Lower down until thighs parallel', 'Drive up through heels'], 
 6.0, 450, true, ARRAY['compound', 'legs', 'squat']),

('Deadlift', 'Становая тяга', 'strength', ARRAY['back', 'legs', 'core'], ARRAY['barbell'], 'advanced', 
 ARRAY['Stand with feet hip-width apart', 'Grip barbell with hands outside legs', 'Keep back straight, lift by extending hips', 'Lower with control'], 
 6.0, 500, true, ARRAY['compound', 'back', 'posterior']),

('Bench Press', 'Жим штанги лежа', 'strength', ARRAY['chest', 'shoulders', 'arms'], ARRAY['barbell', 'bench'], 'intermediate', 
 ARRAY['Lie on bench with feet flat', 'Grip bar slightly wider than shoulders', 'Lower to chest, press up explosively'], 
 5.0, 380, true, ARRAY['compound', 'chest', 'push']),

('Overhead Press', 'Жим штанги стоя', 'strength', ARRAY['shoulders', 'arms', 'core'], ARRAY['barbell'], 'intermediate', 
 ARRAY['Stand with bar at shoulder height', 'Brace core', 'Press bar overhead until arms locked', 'Lower with control'], 
 4.5, 340, true, ARRAY['compound', 'shoulders', 'push']),

('Pull-up', 'Подтягивания', 'strength', ARRAY['back', 'arms'], ARRAY['none', 'pull_up_bar'], 'intermediate', 
 ARRAY['Hang from bar with palms away', 'Pull body up until chin over bar', 'Lower with control'], 
 4.0, 300, true, ARRAY['compound', 'back', 'pull']),

('Dumbbell Row', 'Тяга гантели в наклоне', 'strength', ARRAY['back', 'arms'], ARRAY['dumbbells'], 'beginner', 
 ARRAY['Hinge at hips, back flat', 'Pull dumbbell to hip', 'Squeeze shoulder blade', 'Lower with control'], 
 4.0, 280, true, ARRAY['back', 'unilateral']),

('Lunges', 'Выпады', 'strength', ARRAY['legs', 'core'], ARRAY['none', 'dumbbells'], 'beginner', 
 ARRAY['Step forward into lunge', 'Lower back knee toward ground', 'Push through front heel to return'], 
 4.0, 280, true, ARRAY['legs', 'unilateral']),

('Push-ups', 'Отжимания', 'strength', ARRAY['chest', 'shoulders', 'arms', 'core'], ARRAY['none'], 'beginner', 
 ARRAY['Start in plank position', 'Lower chest to ground', 'Push back up'], 
 3.8, 280, true, ARRAY['chest', 'bodyweight']),

('Plank', 'Планка', 'strength', ARRAY['core'], ARRAY['none'], 'beginner', 
 ARRAY['Hold push-up position on forearms', 'Keep body straight', 'Engage core'], 
 3.0, 220, true, ARRAY['core', 'isometric']),

('Russian Twist', 'Русские скручивания', 'strength', ARRAY['core'], ARRAY['none', 'dumbbells', 'kettlebell'], 'beginner', 
 ARRAY['Sit with knees bent', 'Lean back slightly', 'Rotate torso side to side'], 
 3.0, 220, true, ARRAY['core', 'rotation']),

-- Cardio exercises
('Running', 'Бег', 'cardio', ARRAY['legs'], ARRAY['none'], 'beginner', 
 ARRAY['Start with light jog', 'Maintain steady pace', 'Land midfoot'], 
 9.0, 600, true, ARRAY['cardio', 'endurance']),

('Cycling', 'Велосипед', 'cardio', ARRAY['legs'], ARRAY['bicycle'], 'beginner', 
 ARRAY['Adjust seat height', 'Maintain steady cadence', 'Use gears appropriately'], 
 7.5, 500, true, ARRAY['cardio', 'low_impact']),

('Jump Rope', 'Прыжки на скакалке', 'cardio', ARRAY['legs', 'core'], ARRAY['jump_rope'], 'intermediate', 
 ARRAY['Hold handles at hip height', 'Jump with small bounces', 'Land softly on balls of feet'], 
 10.0, 700, true, ARRAY['cardio', 'coordination']),

('Burpees', 'Берпи', 'cardio', ARRAY['legs', 'chest', 'core', 'arms'], ARRAY['none'], 'intermediate', 
 ARRAY['Drop to squat', 'Jump back to plank', 'Do push-up', 'Jump forward and up'], 
 8.0, 600, true, ARRAY['hiit', 'full_body']),

('Swimming', 'Плавание', 'cardio', ARRAY['back', 'shoulders', 'arms', 'legs', 'core'], ARRAY['pool'], 'intermediate', 
 ARRAY['Maintain streamlined position', 'Breathe rhythmically', 'Kick from hips'], 
 8.0, 550, true, ARRAY['cardio', 'full_body']),

-- Flexibility/Mobility
('Yoga Flow', 'Йога флоу', 'flexibility', ARRAY['back', 'legs', 'core'], ARRAY['yoga_mat'], 'beginner', 
 ARRAY['Move with breath', 'Hold poses with control', 'Focus on alignment'], 
 2.5, 180, true, ARRAY['flexibility', 'mindfulness']),

('Hip Flexor Stretch', 'Растяжка бедренных сгибателей', 'flexibility', ARRAY['legs'], ARRAY['none'], 'beginner', 
 ARRAY['Kneel on one knee', 'Push hips forward', 'Hold stretch'], 
 2.0, 140, true, ARRAY['mobility', 'hips']),

('Shoulder Dislocations', 'Разминка плеч', 'mobility', ARRAY['shoulders'], ARRAY['resistance_band'], 'beginner', 
 ARRAY['Hold band with wide grip', 'Slowly raise arms overhead', 'Lower behind back'], 
 2.0, 140, true, ARRAY['mobility', 'warmup']),

('Foam Rolling', 'Массаж роллом', 'mobility', ARRAY['legs', 'back'], ARRAY['foam_roller'], 'beginner', 
 ARRAY['Roll slowly over muscles', 'Pause on tight spots', 'Breathe deeply'], 
 2.5, 180, true, ARRAY['recovery', 'myofascial']),

('Hanging Leg Raises', 'Подъем ног в висе', 'strength', ARRAY['core', 'arms'], ARRAY['pull_up_bar'], 'intermediate', 
 ARRAY['Hang from bar', 'Lift legs to 90 degrees', 'Lower with control'], 
 4.0, 300, true, ARRAY['core', 'abs'])
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for daily activity
DROP TRIGGER IF EXISTS update_movement_daily_activity_updated_at ON movement_daily_activity;
CREATE TRIGGER update_movement_daily_activity_updated_at
    BEFORE UPDATE ON movement_daily_activity
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update daily_health_snapshots with movement data
CREATE OR REPLACE FUNCTION update_daily_snapshot_movement()
RETURNS TRIGGER AS $$
DECLARE
    snapshot_id UUID;
    total_active_minutes INT;
    total_calories INT;
    workout_count INT;
    movement_score INT;
BEGIN
    -- Get or create today's snapshot
    SELECT id INTO snapshot_id
    FROM daily_health_snapshots
    WHERE user_id = NEW.user_id AND date = NEW.date;
    
    -- Calculate totals
    SELECT 
        COALESCE(SUM(active_minutes), 0),
        COALESCE(SUM(calories_burned), 0)
    INTO total_active_minutes, total_calories
    FROM movement_daily_activity
    WHERE user_id = NEW.user_id AND date = NEW.date;
    
    -- Count workouts for today
    SELECT COUNT(*) INTO workout_count
    FROM movement_workouts
    WHERE user_id = NEW.user_id 
    AND DATE(start_time) = NEW.date;
    
    -- Calculate movement score (0-100)
    -- Based on: steps goal (10k), active minutes goal (60), workouts
    movement_score := LEAST(100, 
        (LEAST(NEW.steps, 10000)::FLOAT / 10000 * 40) +
        (LEAST(total_active_minutes, 60)::FLOAT / 60 * 30) +
        (LEAST(workout_count * 20, 30))
    );
    
    IF snapshot_id IS NULL THEN
        INSERT INTO daily_health_snapshots (
            user_id, date, module_scores, key_metrics
        ) VALUES (
            NEW.user_id, 
            NEW.date,
            jsonb_build_object('movement', movement_score),
            jsonb_build_object(
                'steps', NEW.steps,
                'distance_meters', NEW.distance_meters,
                'calories_burned', total_calories,
                'active_minutes', total_active_minutes,
                'workouts_count', workout_count
            )
        );
    ELSE
        UPDATE daily_health_snapshots
        SET 
            module_scores = jsonb_set(
                COALESCE(module_scores, '{}'::jsonb),
                '{movement}',
                to_jsonb(movement_score)
            ),
            key_metrics = jsonb_set(
                COALESCE(key_metrics, '{}'::jsonb),
                '{steps}',
                to_jsonb(NEW.steps)
            ) || jsonb_build_object(
                'distance_meters', NEW.distance_meters,
                'calories_burned', total_calories,
                'active_minutes', total_active_minutes,
                'workouts_count', workout_count
            ),
            updated_at = NOW()
        WHERE id = snapshot_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for daily activity updates
DROP TRIGGER IF EXISTS trigger_update_snapshot_movement ON movement_daily_activity;
CREATE TRIGGER trigger_update_snapshot_movement
    AFTER INSERT OR UPDATE ON movement_daily_activity
    FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot_movement();

-- Function to update snapshot when workout is added
CREATE OR REPLACE FUNCTION update_daily_snapshot_from_workout()
RETURNS TRIGGER AS $$
DECLARE
    workout_date DATE;
    snapshot_id UUID;
    total_active_minutes INT;
    total_calories INT;
    workout_count INT;
    current_steps INT;
    movement_score INT;
BEGIN
    workout_date := DATE(NEW.start_time);
    
    -- Get current steps
    SELECT COALESCE(steps, 0) INTO current_steps
    FROM movement_daily_activity
    WHERE user_id = NEW.user_id AND date = workout_date;
    
    IF current_steps IS NULL THEN
        current_steps := 0;
    END IF;
    
    -- Calculate totals
    SELECT 
        COALESCE(SUM(active_minutes), 0),
        COALESCE(SUM(calories_burned), 0)
    INTO total_active_minutes, total_calories
    FROM movement_daily_activity
    WHERE user_id = NEW.user_id AND date = workout_date;
    
    -- Add workout calories to total
    total_calories := total_calories + COALESCE(NEW.calories_burned, 0);
    total_active_minutes := total_active_minutes + COALESCE(NEW.duration_seconds / 60, 0);
    
    -- Count workouts
    SELECT COUNT(*) INTO workout_count
    FROM movement_workouts
    WHERE user_id = NEW.user_id 
    AND DATE(start_time) = workout_date;
    
    -- Calculate movement score
    movement_score := LEAST(100, 
        (LEAST(current_steps, 10000)::FLOAT / 10000 * 40) +
        (LEAST(total_active_minutes, 60)::FLOAT / 60 * 30) +
        (LEAST(workout_count * 20, 30))
    );
    
    -- Get snapshot
    SELECT id INTO snapshot_id
    FROM daily_health_snapshots
    WHERE user_id = NEW.user_id AND date = workout_date;
    
    IF snapshot_id IS NULL THEN
        INSERT INTO daily_health_snapshots (
            user_id, date, module_scores, key_metrics
        ) VALUES (
            NEW.user_id, 
            workout_date,
            jsonb_build_object('movement', movement_score),
            jsonb_build_object(
                'steps', current_steps,
                'calories_burned', total_calories,
                'active_minutes', total_active_minutes,
                'workouts_count', workout_count
            )
        );
    ELSE
        UPDATE daily_health_snapshots
        SET 
            module_scores = jsonb_set(
                COALESCE(module_scores, '{}'::jsonb),
                '{movement}',
                to_jsonb(movement_score)
            ),
            key_metrics = COALESCE(key_metrics, '{}'::jsonb) || jsonb_build_object(
                'calories_burned', total_calories,
                'active_minutes', total_active_minutes,
                'workouts_count', workout_count
            ),
            updated_at = NOW()
        WHERE id = snapshot_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for workout updates
DROP TRIGGER IF EXISTS trigger_update_snapshot_workout ON movement_workouts;
CREATE TRIGGER trigger_update_snapshot_workout
    AFTER INSERT OR UPDATE ON movement_workouts
    FOR EACH ROW EXECUTE FUNCTION update_daily_snapshot_from_workout();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE movement_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_planned_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_fitness_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_recovery_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_ai_insights ENABLE ROW LEVEL SECURITY;

-- Exercises: readable by all, writable by admins
CREATE POLICY "Exercises are readable by all" ON movement_exercises
    FOR SELECT USING (true);

-- Daily activity: users can only access their own
CREATE POLICY "Users can CRUD their own daily activity" ON movement_daily_activity
    FOR ALL USING (auth.uid() = user_id);

-- Workouts: users can only access their own
CREATE POLICY "Users can CRUD their own workouts" ON movement_workouts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD their own workout exercises" ON movement_workout_exercises
    FOR ALL USING (EXISTS (
        SELECT 1 FROM movement_workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()
    ));

-- Programs: users can access their own + public programs
CREATE POLICY "Users can CRUD their own programs" ON movement_programs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read public programs" ON movement_programs
    FOR SELECT USING (is_public = true);

-- Planned workouts: users can only access their own
CREATE POLICY "Users can CRUD their own planned workouts" ON movement_planned_workouts
    FOR ALL USING (auth.uid() = user_id);

-- Fitness metrics: users can only access their own
CREATE POLICY "Users can CRUD their own fitness metrics" ON movement_fitness_metrics
    FOR ALL USING (auth.uid() = user_id);

-- Personal records: users can only access their own
CREATE POLICY "Users can CRUD their own personal records" ON movement_personal_records
    FOR ALL USING (auth.uid() = user_id);

-- Recovery status: users can only access their own
CREATE POLICY "Users can CRUD their own recovery status" ON movement_recovery_status
    FOR ALL USING (auth.uid() = user_id);

-- AI insights: users can only access their own
CREATE POLICY "Users can CRUD their own AI insights" ON movement_ai_insights
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- VIEWS
-- ============================================

-- Weekly movement summary view
CREATE OR REPLACE VIEW v_movement_weekly_summary AS
SELECT 
    user_id,
    DATE_TRUNC('week', date) as week_start,
    SUM(steps) as total_steps,
    SUM(distance_meters) as total_distance,
    SUM(calories_burned) as total_calories,
    SUM(active_minutes) as total_active_minutes,
    COUNT(*) FILTER (WHERE is_goal_achieved) as days_goal_achieved,
    AVG(steps)::INT as avg_steps
FROM movement_daily_activity
GROUP BY user_id, DATE_TRUNC('week', date);

-- Workout summary view
CREATE OR REPLACE VIEW v_workout_summary AS
SELECT 
    w.id,
    w.user_id,
    w.name,
    w.workout_type,
    w.start_time,
    w.duration_seconds,
    w.calories_burned,
    w.feeling_rating,
    w.rpe,
    COUNT(we.id) as exercise_count,
    COALESCE(
        SUM(
            (SELECT SUM((s->>'reps')::int * (s->>'weight_kg')::numeric) 
             FROM jsonb_array_elements(to_jsonb(we.sets)) AS s)
        ), 0
    ) as total_volume
FROM movement_workouts w
LEFT JOIN movement_workout_exercises we ON we.workout_id = w.id
GROUP BY w.id, w.user_id, w.name, w.workout_type, w.start_time, w.duration_seconds, w.calories_burned, w.feeling_rating, w.rpe;
