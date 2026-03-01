-- ============================================
-- NUTRITION MODULE
-- Migration: 20250301000003
-- ============================================

-- ============================================
-- 1. FOODS DATABASE
-- ============================================

CREATE TABLE nutrition_foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255),
  brand VARCHAR(100),
  barcode VARCHAR(50),
  category VARCHAR(50) CHECK (category IN ('grains', 'proteins', 'dairy', 'vegetables', 'fruits', 'fats', 'beverages', 'snacks', 'supplements', 'other')),
  
  -- Serving info
  serving_size DECIMAL(10,2) DEFAULT 100,
  serving_unit VARCHAR(20) DEFAULT 'g',
  
  -- Nutrients (per 100g)
  nutrients JSONB DEFAULT '{}'::jsonb,
  -- {
  --   "calories": 165,
  --   "protein": 31,
  --   "carbs": 0,
  --   "fat": 3.6,
  --   "fiber": 0,
  --   "sugar": 0,
  --   "sodium": 74,
  --   ...
  -- }
  
  -- Metadata
  is_verified BOOLEAN DEFAULT false,
  is_user_created BOOLEAN DEFAULT false,
  created_by_user_id UUID REFERENCES auth.users(id),
  source VARCHAR(50) DEFAULT 'custom',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_foods_barcode ON nutrition_foods(barcode);
CREATE INDEX idx_foods_category ON nutrition_foods(category);
CREATE INDEX idx_foods_search ON nutrition_foods USING gin(to_tsvector('english', name || ' ' || COALESCE(name_ru, '')));

-- Insert common foods
INSERT INTO nutrition_foods (name, name_ru, category, nutrients, is_verified, source) VALUES
('Chicken breast', 'Куриная грудка', 'proteins', '{"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "fiber": 0, "sugar": 0, "sodium": 74}'::jsonb, true, 'usda'),
('Rice (white, cooked)', 'Рис белый вареный', 'grains', '{"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3, "fiber": 0.4, "sugar": 0.1, "sodium": 1}'::jsonb, true, 'usda'),
('Oats', 'Овсянка', 'grains', '{"calories": 389, "protein": 16.9, "carbs": 66, "fat": 6.9, "fiber": 10.6, "sugar": 0.9, "sodium": 2}'::jsonb, true, 'usda'),
('Egg (whole)', 'Яйцо целое', 'proteins', '{"calories": 155, "protein": 13, "carbs": 1.1, "fat": 11, "fiber": 0, "sugar": 1.1, "sodium": 124}'::jsonb, true, 'usda'),
('Banana', 'Банан', 'fruits', '{"calories": 89, "protein": 1.1, "carbs": 23, "fat": 0.3, "fiber": 2.6, "sugar": 12, "sodium": 1}'::jsonb, true, 'usda'),
('Apple', 'Яблоко', 'fruits', '{"calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2, "fiber": 2.4, "sugar": 10, "sodium": 1}'::jsonb, true, 'usda'),
('Salmon', 'Лосось', 'proteins', '{"calories": 208, "protein": 20, "carbs": 0, "fat": 13, "fiber": 0, "sugar": 0, "sodium": 59}'::jsonb, true, 'usda'),
('Broccoli', 'Брокколи', 'vegetables', '{"calories": 34, "protein": 2.8, "carbs": 7, "fat": 0.4, "fiber": 2.6, "sugar": 1.7, "sodium": 33}'::jsonb, true, 'usda'),
('Greek yogurt', 'Греческий йогурт', 'dairy', '{"calories": 59, "protein": 10, "carbs": 3.6, "fat": 0.4, "fiber": 0, "sugar": 3.2, "sodium": 36}'::jsonb, true, 'usda'),
('Almonds', 'Миндаль', 'fats', '{"calories": 579, "protein": 21, "carbs": 22, "fat": 49, "fiber": 12.5, "sugar": 4.4, "sodium": 1}'::jsonb, true, 'usda'),
('Olive oil', 'Оливковое масло', 'fats', '{"calories": 884, "protein": 0, "carbs": 0, "fat": 100, "fiber": 0, "sugar": 0, "sodium": 2}'::jsonb, true, 'usda'),
('Milk (whole)', 'Молоко цельное', 'dairy', '{"calories": 61, "protein": 3.2, "carbs": 4.8, "fat": 3.3, "fiber": 0, "sugar": 5.1, "sodium": 43}'::jsonb, true, 'usda');

-- ============================================
-- 2. RECIPES
-- ============================================

CREATE TABLE nutrition_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT[],
  prep_time_minutes INT,
  cook_time_minutes INT,
  servings INT DEFAULT 1,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  tags VARCHAR(50)[],
  image_url VARCHAR(500),
  
  -- Calculated nutrients per serving
  total_nutrients JSONB DEFAULT '{}'::jsonb,
  
  is_public BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recipes_user ON nutrition_recipes(user_id);

-- Recipe ingredients
CREATE TABLE nutrition_recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES nutrition_recipes(id) ON DELETE CASCADE,
  food_id UUID REFERENCES nutrition_foods(id),
  
  custom_name VARCHAR(255), -- if not in foods db
  amount DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  notes TEXT,
  
  -- Calculated nutrients for this amount
  calculated_nutrients JSONB
);

-- ============================================
-- 3. DIARY ENTRIES
-- ============================================

CREATE TABLE nutrition_diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout', 'other')),
  entry_type VARCHAR(20) CHECK (entry_type IN ('food', 'recipe', 'quick_add', 'barcode')) DEFAULT 'food',
  
  -- References
  food_id UUID REFERENCES nutrition_foods(id),
  recipe_id UUID REFERENCES nutrition_recipes(id),
  
  -- For quick add or custom entries
  custom_name VARCHAR(255),
  
  -- Amount consumed
  amount DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  
  -- Calculated nutrients for this entry
  calculated_nutrients JSONB NOT NULL,
  
  -- Additional data
  photo_url VARCHAR(500),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  location JSONB,
  
  -- Context
  mood VARCHAR(20) CHECK (mood IN ('hungry', 'satisfied', 'full', 'stuffed', 'emotional')),
  hunger_level_before INT CHECK (hunger_level_before >= 1 AND hunger_level_before <= 10),
  hunger_level_after INT CHECK (hunger_level_after >= 1 AND hunger_level_after <= 10),
  
  -- AI Analysis
  ai_analysis JSONB,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_diary_user_date ON nutrition_diary_entries(user_id, date DESC);
CREATE INDEX idx_diary_meal_type ON nutrition_diary_entries(user_id, date, meal_type);

-- ============================================
-- 4. NUTRITION GOALS
-- ============================================

CREATE TABLE nutrition_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  goal_type VARCHAR(50) CHECK (goal_type IN ('lose_weight', 'maintain', 'gain_weight', 'gain_muscle', 'improve_health', 'manage_condition')),
  
  -- Calorie target
  target_calories INT NOT NULL,
  
  -- Macro goals (percentage or grams)
  macro_goals JSONB DEFAULT '{"protein_percent": 30, "carbs_percent": 40, "fat_percent": 30}'::jsonb,
  macro_grams JSONB, -- optional specific gram targets
  
  -- Water
  target_water_ml INT DEFAULT 2000,
  
  -- Fasting
  fasting_schedule JSONB,
  
  -- Dietary preferences
  dietary_restrictions VARCHAR(50)[],
  allergies VARCHAR(100)[],
  avoid_foods VARCHAR(100)[],
  prefer_foods VARCHAR(100)[],
  
  meal_frequency INT DEFAULT 3,
  
  is_active BOOLEAN DEFAULT true,
  start_date DATE DEFAULT CURRENT_DATE,
  target_date DATE,
  
  ai_plan_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nutrition_goals_user ON nutrition_goals(user_id, is_active);

-- ============================================
-- 5. WATER LOG
-- ============================================

CREATE TABLE nutrition_water_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_ml INT NOT NULL,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(20) DEFAULT 'manual',
  photo_url VARCHAR(500),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_user_date ON nutrition_water_log(user_id, date DESC);

-- ============================================
-- 6. WEIGHT LOG
-- ============================================

CREATE TABLE nutrition_weight_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg DECIMAL(5,2) NOT NULL,
  
  body_fat_percent DECIMAL(4,1),
  muscle_mass_kg DECIMAL(5,2),
  water_percent DECIMAL(4,1),
  waist_cm DECIMAL(5,2),
  hips_cm DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  
  source VARCHAR(20) DEFAULT 'manual',
  photo_url VARCHAR(500),
  notes TEXT,
  
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weight_user_date ON nutrition_weight_log(user_id, date DESC);

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE nutrition_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Foods are viewable by everyone" ON nutrition_foods FOR SELECT USING (true);
CREATE POLICY "Users can create custom foods" ON nutrition_foods FOR INSERT WITH CHECK (auth.uid() = created_by_user_id);

ALTER TABLE nutrition_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public recipes or own" ON nutrition_recipes FOR SELECT 
  USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "Users can CRUD own recipes" ON nutrition_recipes FOR ALL USING (user_id = auth.uid());

ALTER TABLE nutrition_recipe_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view ingredients for accessible recipes" ON nutrition_recipe_ingredients FOR SELECT 
  USING (EXISTS (SELECT 1 FROM nutrition_recipes r WHERE r.id = recipe_id AND (r.is_public = true OR r.user_id = auth.uid())));

ALTER TABLE nutrition_diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own diary entries" ON nutrition_diary_entries FOR ALL USING (user_id = auth.uid());

ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own goals" ON nutrition_goals FOR ALL USING (user_id = auth.uid());

ALTER TABLE nutrition_water_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own water log" ON nutrition_water_log FOR ALL USING (user_id = auth.uid());

ALTER TABLE nutrition_weight_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own weight log" ON nutrition_weight_log FOR ALL USING (user_id = auth.uid());

-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamps
CREATE TRIGGER update_nutrition_foods_updated_at BEFORE UPDATE ON nutrition_foods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nutrition_recipes_updated_at BEFORE UPDATE ON nutrition_recipes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nutrition_goals_updated_at BEFORE UPDATE ON nutrition_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate nutrients for diary entry
CREATE OR REPLACE FUNCTION calculate_diary_entry_nutrients()
RETURNS TRIGGER AS $$
DECLARE
  v_food_record RECORD;
  v_multiplier DECIMAL(10,4);
  v_nutrients JSONB;
BEGIN
  -- Get food data
  SELECT * INTO v_food_record FROM nutrition_foods WHERE id = NEW.food_id;
  
  IF v_food_record IS NULL THEN
    -- For quick add or custom entries, use provided nutrients
    RETURN NEW;
  END IF;
  
  -- Calculate multiplier based on amount
  -- Standard is per 100g or per serving
  IF NEW.unit = 'g' OR NEW.unit = 'ml' THEN
    v_multiplier := NEW.amount / 100;
  ELSE
    v_multiplier := NEW.amount;
  END IF;
  
  -- Calculate nutrients
  v_nutrients := jsonb_object_agg(
    key, 
    ROUND((value::text::numeric * v_multiplier)::numeric, 2)
  )
  FROM jsonb_each(v_food_record.nutrients);
  
  NEW.calculated_nutrients := v_nutrients;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_diary_nutrients
  BEFORE INSERT OR UPDATE ON nutrition_diary_entries
  FOR EACH ROW EXECUTE FUNCTION calculate_diary_entry_nutrients();

-- Update daily snapshot when diary entry added
CREATE OR REPLACE FUNCTION update_snapshot_on_nutrition()
RETURNS TRIGGER AS $$
DECLARE
  v_snapshot_id UUID;
  v_total_calories INT;
  v_total_protein DECIMAL(10,2);
  v_total_carbs DECIMAL(10,2);
  v_total_fat DECIMAL(10,2);
  v_target_calories INT;
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
  
  -- Calculate totals for the day
  SELECT 
    COALESCE(SUM((calculated_nutrients->>'calories')::int), 0),
    COALESCE(SUM((calculated_nutrients->>'protein')::decimal), 0),
    COALESCE(SUM((calculated_nutrients->>'carbs')::decimal), 0),
    COALESCE(SUM((calculated_nutrients->>'fat')::decimal), 0)
  INTO v_total_calories, v_total_protein, v_total_carbs, v_total_fat
  FROM nutrition_diary_entries
  WHERE user_id = NEW.user_id AND date = NEW.date;
  
  -- Get target calories
  SELECT target_calories INTO v_target_calories
  FROM nutrition_goals
  WHERE user_id = NEW.user_id AND is_active = true
  LIMIT 1;
  
  IF v_target_calories IS NULL THEN
    v_target_calories := 2000;
  END IF;
  
  -- Calculate score (0-100)
  -- 80% for being within 10% of target
  -- 20% for logging at least 3 meals
  v_score := 0;
  
  -- Calorie adherence (max 60 points)
  IF v_total_calories > 0 THEN
    DECLARE
      v_variance DECIMAL := ABS(v_total_calories - v_target_calories)::decimal / v_target_calories;
    BEGIN
      IF v_variance <= 0.1 THEN
        v_score := v_score + 60;
      ELSIF v_variance <= 0.2 THEN
        v_score := v_score + 45;
      ELSIF v_variance <= 0.3 THEN
        v_score := v_score + 30;
      ELSE
        v_score := v_score + 15;
      END IF;
    END;
  END IF;
  
  -- Meal logging (max 40 points)
  DECLARE
    v_meal_count INT;
  BEGIN
    SELECT COUNT(DISTINCT meal_type) INTO v_meal_count
    FROM nutrition_diary_entries
    WHERE user_id = NEW.user_id AND date = NEW.date;
    
    v_score := v_score + LEAST(40, v_meal_count * 15);
  END;
  
  -- Update snapshot
  UPDATE daily_health_snapshots SET
    module_scores = jsonb_set(
      COALESCE(module_scores, '{}'::jsonb),
      '{nutrition}',
      to_jsonb(LEAST(100, v_score))
    ),
    key_metrics = jsonb_set(
      COALESCE(key_metrics, '{}'::jsonb),
      '{calories_consumed}',
      to_jsonb(v_total_calories)
    ),
    updated_at = NOW()
  WHERE id = v_snapshot_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_nutrition_update_snapshot
  AFTER INSERT OR UPDATE OR DELETE ON nutrition_diary_entries
  FOR EACH ROW EXECUTE FUNCTION update_snapshot_on_nutrition();

-- ============================================
-- 9. VIEWS
-- ============================================

-- Daily nutrition summary
CREATE OR REPLACE VIEW v_daily_nutrition_summary AS
SELECT 
  user_id,
  date,
  SUM((calculated_nutrients->>'calories')::int) as total_calories,
  SUM((calculated_nutrients->>'protein')::decimal) as total_protein,
  SUM((calculated_nutrients->>'carbs')::decimal) as total_carbs,
  SUM((calculated_nutrients->>'fat')::decimal) as total_fat,
  SUM((calculated_nutrients->>'fiber')::decimal) as total_fiber,
  SUM((calculated_nutrients->>'sugar')::decimal) as total_sugar,
  COUNT(*) as total_entries,
  COUNT(DISTINCT meal_type) as meal_count
FROM nutrition_diary_entries
GROUP BY user_id, date;

-- Today's diary with food details
CREATE OR REPLACE VIEW v_today_diary AS
SELECT 
  d.*,
  f.name as food_name,
  f.name_ru as food_name_ru,
  f.category as food_category,
  f.image_url as food_image
FROM nutrition_diary_entries d
LEFT JOIN nutrition_foods f ON f.id = d.food_id
WHERE d.date = CURRENT_DATE AND d.user_id = auth.uid()
ORDER BY d.logged_at DESC;

COMMENT ON TABLE nutrition_foods IS 'Food database with nutritional information';
COMMENT ON TABLE nutrition_diary_entries IS 'User daily food diary entries';
