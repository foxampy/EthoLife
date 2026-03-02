-- ============================================================================
-- HEALTH MODULES - БАЗЫ ДАННЫХ
-- ============================================================================

-- ============================================================================
-- NUTRITION MODULE TABLES
-- ============================================================================

-- База продуктов (USDA + OpenFoodFacts)
CREATE TABLE IF NOT EXISTS nutrition_food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fdc_id TEXT, -- USDA ID
  barcode TEXT, -- Штрих-код
  name_ru TEXT NOT NULL,
  name_en TEXT,
  brand TEXT,
  category TEXT,
  serving_size_g DECIMAL(10,2),
  calories DECIMAL(10,2),
  protein_g DECIMAL(10,2),
  carbs_g DECIMAL(10,2),
  fiber_g DECIMAL(10,2),
  sugar_g DECIMAL(10,2),
  fat_g DECIMAL(10,2),
  saturated_fat_g DECIMAL(10,2),
  sodium_mg DECIMAL(10,2),
  potassium_mg DECIMAL(10,2),
  vitamins JSONB, -- {A, C, D, E, K, B1, B2, B3, B6, B12}
  minerals JSONB, -- {calcium, iron, magnesium, zinc}
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_food_items_name ON nutrition_food_items(name_ru);
CREATE INDEX idx_food_items_barcode ON nutrition_food_items(barcode);
CREATE INDEX idx_food_items_category ON nutrition_food_items(category);

-- Приемы пищи пользователя
CREATE TABLE IF NOT EXISTS nutrition_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  recorded_at TIMESTAMP DEFAULT NOW(),
  total_calories DECIMAL(10,2) DEFAULT 0,
  total_protein_g DECIMAL(10,2) DEFAULT 0,
  total_carbs_g DECIMAL(10,2) DEFAULT 0,
  total_fat_g DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meals_user_id ON nutrition_meals(user_id);
CREATE INDEX idx_meals_recorded_at ON nutrition_meals(recorded_at);
CREATE INDEX idx_meals_type ON nutrition_meals(meal_type);

-- Элементы приема пищи (связь с продуктами)
CREATE TABLE IF NOT EXISTS nutrition_meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES nutrition_meals(id) ON DELETE CASCADE,
  food_id UUID REFERENCES nutrition_food_items(id),
  quantity_g DECIMAL(10,2) NOT NULL,
  calories DECIMAL(10,2),
  protein_g DECIMAL(10,2),
  carbs_g DECIMAL(10,2),
  fat_g DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meal_items_meal_id ON nutrition_meal_items(meal_id);
CREATE INDEX idx_meal_items_food_id ON nutrition_meal_items(food_id);

-- Потребление воды
CREATE TABLE IF NOT EXISTS nutrition_water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  recorded_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_water_user_id ON nutrition_water_intake(user_id);
CREATE INDEX idx_water_recorded_at ON nutrition_water_intake(recorded_at);

-- Цели питания
CREATE TABLE IF NOT EXISTS nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  calorie_target DECIMAL(10,2) DEFAULT 2000,
  protein_target_g DECIMAL(10,2),
  carbs_target_g DECIMAL(10,2),
  fat_target_g DECIMAL(10,2),
  water_target_ml INTEGER DEFAULT 2000,
  diet_type TEXT DEFAULT 'balanced', -- balanced, keto, paleo, vegan, vegetarian
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_nutrition_goals_user_id ON nutrition_goals(user_id);

-- Рецепты
CREATE TABLE IF NOT EXISTS nutrition_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ru TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
  calories_per_serving DECIMAL(10,2),
  protein_per_serving_g DECIMAL(10,2),
  carbs_per_serving_g DECIMAL(10,2),
  fat_per_serving_g DECIMAL(10,2),
  ingredients JSONB NOT NULL, -- [{food_id, quantity_g}]
  instructions TEXT[], -- шаги приготовления
  tags TEXT[],
  category TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipes_category ON nutrition_recipes(category);
CREATE INDEX idx_recipes_tags ON nutrition_recipes USING GIN(tags);

-- ============================================================================
-- MOVEMENT MODULE TABLES
-- ============================================================================

-- База упражнений
CREATE TABLE IF NOT EXISTS movement_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru TEXT NOT NULL,
  name_en TEXT,
  category TEXT, -- strength, cardio, flexibility, balance
  muscle_group TEXT, -- chest, back, legs, shoulders, arms, core
  equipment TEXT, -- bodyweight, dumbbell, barbell, machine
  difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  description TEXT,
  instructions TEXT[],
  video_url TEXT,
  image_url TEXT,
  calories_per_minute DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercises_name ON movement_exercises(name_ru);
CREATE INDEX idx_exercises_category ON movement_exercises(category);
CREATE INDEX idx_exercises_muscle ON movement_exercises(muscle_group);

-- Тренировки пользователя
CREATE TABLE IF NOT EXISTS movement_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_type TEXT, -- strength, cardio, mixed
  title TEXT,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  calories_burned DECIMAL(10,2),
  average_heart_rate INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workouts_user_id ON movement_workouts(user_id);
CREATE INDEX idx_workouts_started_at ON movement_workouts(started_at);

-- Упражнения в тренировке
CREATE TABLE IF NOT EXISTS movement_workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES movement_workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES movement_exercises(id),
  order_index INTEGER NOT NULL,
  sets_completed INTEGER DEFAULT 0,
  target_sets INTEGER,
  reps_per_set INTEGER[],
  weight_kg DECIMAL(10,2)[],
  rest_seconds INTEGER DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_exercises_workout_id ON movement_workout_exercises(workout_id);

-- Дневная активность
CREATE TABLE IF NOT EXISTS movement_daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  distance_km DECIMAL(10,2) DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  calories_burned DECIMAL(10,2) DEFAULT 0,
  floors_climbed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_activity_user_id ON movement_daily_activity(user_id);
CREATE INDEX idx_daily_activity_date ON movement_daily_activity(date);

-- ============================================================================
-- SLEEP MODULE TABLES
-- ============================================================================

-- Сессии сна
CREATE TABLE IF NOT EXISTS sleep_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bedtime TIMESTAMP,
  wake_time TIMESTAMP,
  duration_hours DECIMAL(10,2),
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
  deep_sleep_minutes INTEGER,
  light_sleep_minutes INTEGER,
  rem_sleep_minutes INTEGER,
  awake_minutes INTEGER,
  sleep_efficiency DECIMAL(5,2), -- percentage
  factors JSONB, -- {caffeine, exercise, screen_time, stress}
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sleep_sessions_user_id ON sleep_sessions(user_id);
CREATE INDEX idx_sleep_sessions_date ON sleep_sessions(date);

-- Цели сна
CREATE TABLE IF NOT EXISTS sleep_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_duration_hours DECIMAL(10,2) DEFAULT 8,
  target_bedtime TIME,
  target_wake_time TIME,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PSYCHOLOGY MODULE TABLES
-- ============================================================================

-- Настроение
CREATE TABLE IF NOT EXISTS psychology_mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  tags TEXT[],
  notes TEXT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mood_user_id ON psychology_mood_entries(user_id);
CREATE INDEX idx_mood_recorded_at ON psychology_mood_entries(recorded_at);

-- Журнал
CREATE TABLE IF NOT EXISTS psychology_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood_score INTEGER,
  tags TEXT[],
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_journal_user_id ON psychology_journal_entries(user_id);
CREATE INDEX idx_journal_created_at ON psychology_journal_entries(created_at);

-- Медитации
CREATE TABLE IF NOT EXISTS psychology_meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meditation_type TEXT, -- guided, unguided, breathing
  duration_minutes INTEGER,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meditation_user_id ON psychology_meditation_sessions(user_id);

-- ============================================================================
-- MEDICINE MODULE TABLES
-- ============================================================================

-- Лекарства
CREATE TABLE IF NOT EXISTS medicine_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT, -- daily, twice_daily, weekly, etc.
  start_date DATE,
  end_date DATE,
  instructions TEXT,
  side_effects TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medications_user_id ON medicine_medications(user_id);

-- Прием лекарств
CREATE TABLE IF NOT EXISTS medicine_medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medicine_medications(id) ON DELETE CASCADE,
  taken_at TIMESTAMP DEFAULT NOW(),
  dose_taken TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medication_logs_medication_id ON medicine_medication_logs(medication_id);

-- Показатели здоровья
CREATE TABLE IF NOT EXISTS medicine_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vital_type TEXT NOT NULL, -- blood_pressure, heart_rate, temperature, etc.
  value TEXT NOT NULL, -- e.g., "120/80" for BP
  unit TEXT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vitals_user_id ON medicine_vitals(user_id);
CREATE INDEX idx_vitals_type ON medicine_vitals(vital_type);

-- ============================================================================
-- HABITS MODULE TABLES
-- ============================================================================

-- Привычки
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- health, fitness, productivity, mental, etc.
  frequency TEXT DEFAULT 'daily', -- daily, weekly, custom
  target_count INTEGER DEFAULT 1,
  best_streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  color TEXT DEFAULT '#10B981',
  icon TEXT DEFAULT 'sparkles',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_category ON habits(category);

-- Выполнения привычек
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  unity_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, DATE(completed_at))
);

CREATE INDEX idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_completed_at ON habit_completions(completed_at);

-- ============================================================================
-- UNITY TOKEN TABLES
-- ============================================================================

-- Кошельки пользователей
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  unity_balance DECIMAL(15,2) DEFAULT 0,
  total_earned DECIMAL(15,2) DEFAULT 0,
  total_spent DECIMAL(15,2) DEFAULT 0,
  total_burned DECIMAL(15,2) DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Транзакции токенов
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- earn, spend, burn, transfer
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2),
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_transactions_type ON token_transactions(type);

-- Награды токенами
CREATE TABLE IF NOT EXISTS token_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  multiplier DECIMAL(5,2) DEFAULT 1.0,
  streak_bonus DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rewards_user_id ON token_rewards(user_id);

-- Сожженные токены
CREATE TABLE IF NOT EXISTS token_burns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(15,2) NOT NULL,
  reason TEXT NOT NULL,
  burned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Статистика токенов
CREATE TABLE IF NOT EXISTS token_statistics (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_emitted DECIMAL(20,2) DEFAULT 0,
  total_burned DECIMAL(20,2) DEFAULT 0,
  circulating_supply DECIMAL(20,2) DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  average_balance DECIMAL(15,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- ============================================================================

-- Функция начисления UNITY токенов
CREATE OR REPLACE FUNCTION add_unity_tokens(
  p_user_id UUID,
  p_amount DECIMAL(10,2),
  p_description TEXT
)
RETURNS VOID AS $$
DECLARE
  v_new_balance DECIMAL(15,2);
BEGIN
  -- Обновить баланс
  UPDATE user_wallets
  SET 
    unity_balance = unity_balance + p_amount,
    total_earned = total_earned + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING unity_balance INTO v_new_balance;
  
  -- Если пользователь не найден, создать
  IF NOT FOUND THEN
    INSERT INTO user_wallets (user_id, unity_balance, total_earned)
    VALUES (p_user_id, p_amount, p_amount);
    v_new_balance := p_amount;
  END IF;
  
  -- Записать транзакцию
  INSERT INTO token_transactions (user_id, type, amount, balance_after, description)
  VALUES (p_user_id, 'earn', p_amount, v_new_balance, p_description);
  
  -- Записать награду
  INSERT INTO token_rewards (user_id, reward_type, amount)
  VALUES (p_user_id, 'activity', p_amount);
END;
$$ LANGUAGE plpgsql;

-- Функция списания UNITY токенов
CREATE OR REPLACE FUNCTION spend_unity_tokens(
  p_user_id UUID,
  p_amount DECIMAL(10,2),
  p_description TEXT,
  p_burn_percentage DECIMAL(5,2) DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
  v_balance DECIMAL(15,2);
  v_burn_amount DECIMAL(15,2);
BEGIN
  -- Проверить баланс
  SELECT unity_balance INTO v_balance
  FROM user_wallets
  WHERE user_id = p_user_id;
  
  IF v_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Рассчитать сжигание
  v_burn_amount := p_amount * (p_burn_percentage / 100);
  
  -- Обновить баланс
  UPDATE user_wallets
  SET 
    unity_balance = unity_balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Записать транзакцию
  INSERT INTO token_transactions (user_id, type, amount, balance_after, description)
  VALUES (p_user_id, 'spend', p_amount, v_balance - p_amount, p_description);
  
  -- Сжечь токены если нужно
  IF v_burn_amount > 0 THEN
    INSERT INTO token_burns (amount, reason, burned_by)
    VALUES (v_burn_amount, p_description, p_user_id);
    
    UPDATE token_statistics
    SET total_burned = total_burned + v_burn_amount
    WHERE id = 1;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления streak привычек
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_habit_id UUID;
  v_current_streak INTEGER;
  v_best_streak INTEGER;
  v_unity_reward INTEGER;
BEGIN
  -- Получить привычку
  SELECT habit_id INTO v_habit_id FROM habits WHERE id = NEW.habit_id;
  
  -- Посчитать текущий стрик
  SELECT COUNT(*) INTO v_current_streak
  FROM habit_completions
  WHERE habit_id = v_habit_id
    AND completed_at >= CURRENT_DATE - INTERVAL '30 days';
  
  -- Обновить стрики
  UPDATE habits
  SET 
    current_streak = v_current_streak,
    best_streak = GREATEST(best_streak, v_current_streak),
    total_completions = total_completions + 1,
    updated_at = NOW()
  WHERE id = v_habit_id;
  
  -- Наградить токенами за стрик
  IF v_current_streak = 7 THEN
    v_unity_reward := 50;
  ELSIF v_current_streak = 30 THEN
    v_unity_reward := 300;
  ELSIF v_current_streak = 90 THEN
    v_unity_reward := 1000;
  ELSIF v_current_streak = 365 THEN
    v_unity_reward := 5000;
  ELSE
    v_unity_reward := 5; -- обычная награда
  END IF;
  
  IF v_unity_reward > 0 THEN
    PERFORM add_unity_tokens(
      (SELECT user_id FROM habits WHERE id = v_habit_id),
      v_unity_reward,
      FORMAT('Habit streak: %d days', v_current_streak)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_habit_streak
AFTER INSERT ON habit_completions
FOR EACH ROW
EXECUTE FUNCTION update_habit_streak();

-- ============================================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- ============================================================================

-- Инициализация статистики токенов
INSERT INTO token_statistics (id, total_emitted, total_burned, circulating_supply)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
