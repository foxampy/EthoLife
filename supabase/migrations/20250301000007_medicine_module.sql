-- ============================================
-- MIGRATION: Medicine Module
-- Description: Complete medication tracking, lab results, appointments
-- ============================================

-- ============================================
-- CORE: Drug Reference Database
-- ============================================

CREATE TYPE drug_category AS ENUM ('prescription', 'otc', 'supplement', 'herbal', 'vitamin');
CREATE TYPE drug_form AS ENUM ('tablet', 'capsule', 'liquid', 'injection', 'cream', 'patch', 'inhaler', 'drops', 'spray', 'powder');

CREATE TABLE medicine_drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  name_generic varchar(255),
  category drug_category NOT NULL DEFAULT 'otc',
  drug_class varchar(100), -- e.g., 'SSRI', 'NSAID', 'antibiotic'
  form drug_form NOT NULL DEFAULT 'tablet',
  dosage_units varchar[] DEFAULT '{}',
  common_dosages jsonb DEFAULT '[]',
  side_effects text[] DEFAULT '{}',
  contraindications text[] DEFAULT '{}',
  drug_interactions text[] DEFAULT '{}',
  storage_instructions text,
  is_prescription_required boolean DEFAULT false,
  approved_in_countries varchar[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_drugs IS 'Reference database of medications';

-- ============================================
-- USER MEDICATIONS
-- ============================================

CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'as_needed', 'custom');
CREATE TYPE food_timing AS ENUM ('before', 'with', 'after', 'empty_stomach', 'no_matter');

CREATE TABLE medicine_user_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drug_id uuid REFERENCES medicine_drugs(id) ON DELETE SET NULL,
  custom_name varchar(255), -- if not in reference database
  dosage_amount decimal(10,2),
  dosage_unit varchar(20),
  frequency jsonb DEFAULT '{"type": "daily", "times_per_day": 1}'::jsonb,
  prescribed_by varchar(255),
  prescribed_date date,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  reason text,
  instructions text,
  with_food food_timing DEFAULT 'no_matter',
  reminder_enabled boolean DEFAULT true,
  reminder_sound varchar(50),
  refill_reminder_days integer DEFAULT 7,
  current_stock decimal(10,2),
  pharmacy_info jsonb,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE medicine_user_medications IS 'User personal medication records with schedules';

-- ============================================
-- MEDICATION INTAKE LOG
-- ============================================

CREATE TYPE intake_status AS ENUM ('taken', 'skipped', 'missed', 'late', 'early', 'scheduled');

CREATE TABLE medicine_intake_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id uuid NOT NULL REFERENCES medicine_user_medications(id) ON DELETE CASCADE,
  scheduled_time timestamptz NOT NULL,
  taken_at timestamptz,
  status intake_status NOT NULL DEFAULT 'scheduled',
  dosage_taken decimal(10,2),
  notes text,
  location jsonb,
  taken_with_food boolean,
  side_effects_noted text[] DEFAULT '{}',
  mood_after integer CHECK (mood_after BETWEEN 1 AND 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_intake_log IS 'Log of medication intake events';

-- ============================================
-- SYMPTOMS TRACKING
-- ============================================

CREATE TYPE body_system AS ENUM ('general', 'cardiovascular', 'respiratory', 'digestive', 'neurological', 'musculoskeletal', 'skin', 'mental', 'reproductive', 'sensory');

CREATE TABLE medicine_symptoms_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  name_ru varchar(255),
  body_system body_system NOT NULL DEFAULT 'general',
  severity_scale jsonb DEFAULT '{"min": 1, "max": 10}'::jsonb,
  common_causes text[] DEFAULT '{}',
  when_to_see_doctor text,
  tags varchar[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_symptoms_catalog IS 'Reference catalog of symptoms';

CREATE TABLE medicine_symptom_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptom_id uuid REFERENCES medicine_symptoms_catalog(id) ON DELETE SET NULL,
  custom_symptom_name varchar(255),
  severity integer NOT NULL CHECK (severity BETWEEN 1 AND 10),
  body_location varchar(100),
  quality varchar[] DEFAULT '{}', -- 'sharp', 'dull', 'burning', etc.
  triggers text[] DEFAULT '{}',
  relievers text[] DEFAULT '{}',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_notes text,
  associated_symptoms uuid[] DEFAULT '{}',
  related_factors jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_symptom_entries IS 'User symptom tracking entries';

-- ============================================
-- LAB TESTS & RESULTS
-- ============================================

CREATE TYPE lab_category AS ENUM ('blood', 'urine', 'stool', 'imaging', 'genetic', 'microbiology', 'biopsy', 'other');
CREATE TYPE result_flag AS ENUM ('low', 'normal', 'high', 'critical_low', 'critical_high');
CREATE TYPE overall_result_status AS ENUM ('normal', 'borderline', 'abnormal', 'critical');

CREATE TABLE medicine_lab_test_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  name_ru varchar(255),
  category lab_category NOT NULL DEFAULT 'blood',
  body_system varchar(100),
  description text,
  preparation_instructions text,
  parameters jsonb[] DEFAULT '{}',
  normal_frequency varchar(100),
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_lab_test_types IS 'Reference for lab test types';

CREATE TABLE medicine_lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type_id uuid REFERENCES medicine_lab_test_types(id) ON DELETE SET NULL,
  test_name varchar(255) NOT NULL,
  ordered_by varchar(255),
  lab_name varchar(255),
  date_collected date NOT NULL,
  date_results date,
  results_data jsonb DEFAULT '{}',
  overall_flag overall_result_status DEFAULT 'normal',
  notes text,
  file_url varchar(500),
  is_reviewed boolean DEFAULT false,
  reviewed_by_user_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_lab_results IS 'User lab test results';

CREATE TABLE medicine_lab_parameters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_result_id uuid NOT NULL REFERENCES medicine_lab_results(id) ON DELETE CASCADE,
  parameter_name varchar(100) NOT NULL,
  value decimal(10,3),
  unit varchar(20),
  reference_range_low decimal(10,3),
  reference_range_high decimal(10,3),
  flag result_flag DEFAULT 'normal',
  previous_value decimal(10,3),
  change_percent decimal(5,2),
  trend varchar(20), -- 'improving', 'worsening', 'stable', 'new'
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_lab_parameters IS 'Individual parameter values from lab results';

-- ============================================
-- APPOINTMENTS & DOCTORS
-- ============================================

CREATE TYPE appointment_type AS ENUM ('routine', 'follow_up', 'urgent', 'procedure', 'consultation', 'telemedicine');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled');

CREATE TABLE medicine_doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  specialty varchar(100),
  clinic_name varchar(255),
  address text,
  phone varchar(50),
  email varchar(255),
  is_primary_care boolean DEFAULT false,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_doctors IS 'User doctors directory';

CREATE TABLE medicine_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES medicine_doctors(id) ON DELETE SET NULL,
  appointment_type appointment_type NOT NULL DEFAULT 'routine',
  scheduled_date date NOT NULL,
  scheduled_time time,
  duration_minutes integer DEFAULT 30,
  reason text,
  preparation_notes text,
  questions_to_ask text[] DEFAULT '{}',
  status appointment_status NOT NULL DEFAULT 'scheduled',
  outcome_notes text,
  diagnosis text,
  prescriptions_given uuid[] DEFAULT '{}',
  follow_up_needed boolean DEFAULT false,
  follow_up_date date,
  reminder_enabled boolean DEFAULT true,
  reminder_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_appointments IS 'Doctor appointments tracking';

-- ============================================
-- CONDITIONS & DIAGNOSES
-- ============================================

CREATE TYPE condition_type AS ENUM ('acute', 'chronic', 'recurrent', 'resolved', 'in_remission');
CREATE TYPE condition_severity AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE condition_status AS ENUM ('active', 'managed', 'improving', 'worsening', 'resolved', 'in_remission');

CREATE TABLE medicine_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  icd10_code varchar(20),
  condition_name varchar(255) NOT NULL,
  condition_type condition_type NOT NULL DEFAULT 'chronic',
  diagnosed_by varchar(255),
  diagnosed_date date,
  severity condition_severity DEFAULT 'mild',
  symptoms text[] DEFAULT '{}',
  current_status condition_status DEFAULT 'active',
  treatment_plan text,
  medications uuid[] DEFAULT '{}',
  related_lab_tests uuid[] DEFAULT '{}',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_conditions IS 'Medical conditions and diagnoses';

-- ============================================
-- DRUG INTERACTIONS (Calculated)
-- ============================================

CREATE TYPE interaction_severity AS ENUM ('minor', 'moderate', 'major', 'contraindicated');
CREATE TYPE interaction_type AS ENUM ('additive_effect', 'antagonistic', 'increased_toxicity', 'decreased_absorption');

CREATE TABLE medicine_drug_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_1_id uuid NOT NULL REFERENCES medicine_user_medications(id) ON DELETE CASCADE,
  medication_2_id uuid NOT NULL REFERENCES medicine_user_medications(id) ON DELETE CASCADE,
  interaction_severity interaction_severity NOT NULL DEFAULT 'minor',
  interaction_type interaction_type,
  description text,
  recommendation text,
  is_acknowledged boolean DEFAULT false,
  detected_at timestamptz DEFAULT now(),
  acknowledged_at timestamptz
);

COMMENT ON TABLE medicine_drug_interactions IS 'Detected drug interactions for user';

-- ============================================
-- AI INSIGHTS
-- ============================================

CREATE TYPE medicine_insight_type AS ENUM ('pattern', 'warning', 'recommendation', 'drug_interaction', 'adherence_alert', 'appointment_reminder', 'refill_reminder');
CREATE TYPE insight_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE medicine_ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  insight_type medicine_insight_type NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  related_data jsonb,
  priority insight_priority DEFAULT 'medium',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE medicine_ai_insights IS 'AI-generated insights for medicine module';

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_user_medications_user_id ON medicine_user_medications(user_id);
CREATE INDEX idx_user_medications_active ON medicine_user_medications(user_id, is_active);
CREATE INDEX idx_intake_log_user_id ON medicine_intake_log(user_id);
CREATE INDEX idx_intake_log_medication ON medicine_intake_log(medication_id);
CREATE INDEX idx_intake_log_scheduled ON medicine_intake_log(user_id, scheduled_time);
CREATE INDEX idx_intake_log_status ON medicine_intake_log(user_id, status);
CREATE INDEX idx_symptom_entries_user_id ON medicine_symptom_entries(user_id);
CREATE INDEX idx_symptom_entries_started ON medicine_symptom_entries(user_id, started_at);
CREATE INDEX idx_lab_results_user_id ON medicine_lab_results(user_id);
CREATE INDEX idx_lab_results_date ON medicine_lab_results(user_id, date_collected);
CREATE INDEX idx_lab_parameters_result ON medicine_lab_parameters(lab_result_id);
CREATE INDEX idx_appointments_user_id ON medicine_appointments(user_id);
CREATE INDEX idx_appointments_date ON medicine_appointments(user_id, scheduled_date);
CREATE INDEX idx_appointments_status ON medicine_appointments(user_id, status);
CREATE INDEX idx_conditions_user_id ON medicine_conditions(user_id);
CREATE INDEX idx_conditions_active ON medicine_conditions(user_id, is_active);
CREATE INDEX idx_drug_interactions_user ON medicine_drug_interactions(user_id);
CREATE INDEX idx_ai_insights_user ON medicine_ai_insights(user_id, is_read);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE medicine_drugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_user_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_intake_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_symptoms_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_lab_test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_lab_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_drug_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_ai_insights ENABLE ROW LEVEL SECURITY;

-- Reference tables: readable by all, writable by admins
CREATE POLICY "Drugs reference readable by all" ON medicine_drugs
  FOR SELECT USING (true);

CREATE POLICY "Symptoms catalog readable by all" ON medicine_symptoms_catalog
  FOR SELECT USING (true);

CREATE POLICY "Lab test types readable by all" ON medicine_lab_test_types
  FOR SELECT USING (true);

-- User data: users can only access their own data
CREATE POLICY "Users can manage their medications" ON medicine_user_medications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their intake log" ON medicine_intake_log
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their symptom entries" ON medicine_symptom_entries
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their lab results" ON medicine_lab_results
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their lab parameters" ON medicine_lab_parameters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM medicine_lab_results 
      WHERE medicine_lab_results.id = medicine_lab_parameters.lab_result_id 
      AND medicine_lab_results.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their doctors" ON medicine_doctors
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their appointments" ON medicine_appointments
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their conditions" ON medicine_conditions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their drug interactions" ON medicine_drug_interactions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their AI insights" ON medicine_ai_insights
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medicine_drugs_updated_at
  BEFORE UPDATE ON medicine_drugs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_medications_updated_at
  BEFORE UPDATE ON medicine_user_medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intake_log_updated_at
  BEFORE UPDATE ON medicine_intake_log
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptom_entries_updated_at
  BEFORE UPDATE ON medicine_symptom_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_results_updated_at
  BEFORE UPDATE ON medicine_lab_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON medicine_doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON medicine_appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conditions_updated_at
  BEFORE UPDATE ON medicine_conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update daily health snapshot when medication is taken
CREATE OR REPLACE FUNCTION update_medicine_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_today date;
  v_adherence_rate integer;
  v_meds_taken integer;
  v_meds_scheduled integer;
BEGIN
  v_user_id := NEW.user_id;
  v_today := CURRENT_DATE;
  
  -- Calculate today's adherence
  SELECT 
    COUNT(*) FILTER (WHERE status = 'taken'),
    COUNT(*)
  INTO v_meds_taken, v_meds_scheduled
  FROM medicine_intake_log
  WHERE user_id = v_user_id
    AND DATE(scheduled_time) = v_today;
  
  IF v_meds_scheduled > 0 THEN
    v_adherence_rate := ROUND((v_meds_taken::numeric / v_meds_scheduled::numeric) * 100);
  ELSE
    v_adherence_rate := 0;
  END IF;
  
  -- Update daily snapshot
  UPDATE daily_health_snapshots
  SET 
    module_scores = jsonb_set(
      COALESCE(module_scores, '{}'::jsonb),
      '{medicine}',
      to_jsonb(v_adherence_rate)
    ),
    key_metrics = jsonb_set(
      COALESCE(key_metrics, '{}'::jsonb),
      '{medicine_adherence}',
      jsonb_build_object(
        'taken', v_meds_taken,
        'scheduled', v_meds_scheduled,
        'rate', v_adherence_rate
      )
    ),
    updated_at = now()
  WHERE user_id = v_user_id AND date = v_today;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snapshot_on_intake
  AFTER INSERT OR UPDATE ON medicine_intake_log
  FOR EACH ROW EXECUTE FUNCTION update_medicine_snapshot();

-- ============================================
-- SEED DATA: Common Drugs
-- ============================================

INSERT INTO medicine_drugs (name, name_generic, category, drug_class, form, dosage_units, common_dosages, side_effects, is_prescription_required) VALUES
('Парацетамол', 'Acetaminophen', 'otc', 'analgesic', 'tablet', ARRAY['mg'], '[{"amount": 500, "unit": "mg"}, {"amount": 1000, "unit": "mg"}]'::jsonb, ARRAY['nausea', 'rash'], false),
('Ибупрофен', 'Ibuprofen', 'otc', 'NSAID', 'tablet', ARRAY['mg'], '[{"amount": 200, "unit": "mg"}, {"amount": 400, "unit": "mg"}]'::jsonb, ARRAY['stomach upset', 'dizziness'], false),
('Аспирин', 'Aspirin', 'otc', 'NSAID', 'tablet', ARRAY['mg'], '[{"amount": 100, "unit": "mg"}, {"amount": 500, "unit": "mg"}]'::jsonb, ARRAY['stomach bleeding', 'allergic reaction'], false),
('Цетиризин', 'Cetirizine', 'otc', 'antihistamine', 'tablet', ARRAY['mg'], '[{"amount": 10, "unit": "mg"}]'::jsonb, ARRAY['drowsiness', 'dry mouth'], false),
('Лоратадин', 'Loratadine', 'otc', 'antihistamine', 'tablet', ARRAY['mg'], '[{"amount": 10, "unit": "mg"}]'::jsonb, ARRAY['headache', 'fatigue'], false),
('Омега-3', 'Fish Oil', 'supplement', 'supplement', 'capsule', ARRAY['mg'], '[{"amount": 1000, "unit": "mg"}]'::jsonb, ARRAY['fishy aftertaste'], false),
('Витамин D3', 'Cholecalciferol', 'vitamin', 'vitamin', 'capsule', ARRAY['IU', 'mg'], '[{"amount": 2000, "unit": "IU"}, {"amount": 5000, "unit": "IU"}]'::jsonb, ARRAY[]::text[], false),
('Витамин C', 'Ascorbic Acid', 'vitamin', 'vitamin', 'tablet', ARRAY['mg'], '[{"amount": 500, "unit": "mg"}, {"amount": 1000, "unit": "mg"}]'::jsonb, ARRAY['stomach upset'], false),
('Магний', 'Magnesium', 'supplement', 'mineral', 'tablet', ARRAY['mg'], '[{"amount": 200, "unit": "mg"}, {"amount": 400, "unit": "mg"}]'::jsonb, ARRAY['diarrhea'], false),
('Мелатонин', 'Melatonin', 'supplement', 'sleep aid', 'tablet', ARRAY['mg'], '[{"amount": 3, "unit": "mg"}, {"amount": 5, "unit": "mg"}, {"amount": 10, "unit": "mg"}]'::jsonb, ARRAY['drowsiness', 'vivid dreams'], false),
('Цинк', 'Zinc', 'supplement', 'mineral', 'tablet', ARRAY['mg'], '[{"amount": 15, "unit": "mg"}, {"amount": 25, "unit": "mg"}]'::jsonb, ARRAY['nausea'], false),
('Железо', 'Iron', 'supplement', 'mineral', 'tablet', ARRAY['mg'], '[{"amount": 65, "unit": "mg"}]'::jsonb, ARRAY['constipation', 'dark stools'], false),
('Витамин B12', 'Cyanocobalamin', 'vitamin', 'vitamin', 'tablet', ARRAY['mcg'], '[{"amount": 1000, "unit": "mcg"}]'::jsonb, ARRAY[]::text[], false),
('Пробиотик', 'Probiotic', 'supplement', 'probiotic', 'capsule', ARRAY['CFU'], '[{"amount": 10000000000, "unit": "CFU"}]'::jsonb, ARRAY['bloating'], false),
('Коэнзим Q10', 'CoQ10', 'supplement', 'antioxidant', 'capsule', ARRAY['mg'], '[{"amount": 100, "unit": "mg"}, {"amount": 200, "unit": "mg"}]'::jsonb, ARRAY['insomnia'], false);

-- Seed symptoms catalog
INSERT INTO medicine_symptoms_catalog (name, name_ru, body_system, common_causes, tags) VALUES
('Headache', 'Головная боль', 'neurological', ARRAY['stress', 'dehydration', 'lack of sleep'], ARRAY['pain']),
('Fever', 'Жар', 'general', ARRAY['infection', 'inflammation'], ARRAY['temperature']),
('Fatigue', 'Усталость', 'general', ARRAY['stress', 'poor sleep', 'anemia'], ARRAY['energy']),
('Nausea', 'Тошнота', 'digestive', ARRAY['food poisoning', 'migraine', 'medication'], ARRAY['stomach']),
('Cough', 'Кашель', 'respiratory', ARRAY['cold', 'flu', 'allergies'], ARRAY['breathing']),
('Chest Pain', 'Боль в груди', 'cardiovascular', ARRAY['anxiety', 'heart issues', 'muscle strain'], ARRAY['urgent']),
('Shortness of Breath', 'Одышка', 'respiratory', ARRAY['asthma', 'anxiety', 'heart issues'], ARRAY['urgent']),
('Dizziness', 'Головокружение', 'neurological', ARRAY['low blood pressure', 'dehydration', 'vertigo'], ARRAY['balance']),
('Joint Pain', 'Боль в суставах', 'musculoskeletal', ARRAY['arthritis', 'injury', 'overuse'], ARRAY['pain', 'mobility']),
('Skin Rash', 'Кожная сыпь', 'skin', ARRAY['allergy', 'infection', 'irritation'], ARRAY['visible']),
('Insomnia', 'Бессонница', 'mental', ARRAY['stress', 'anxiety', 'caffeine'], ARRAY['sleep']),
('Anxiety', 'Тревога', 'mental', ARRAY['stress', 'caffeine', 'medical condition'], ARRAY['mood']),
('Back Pain', 'Боль в спине', 'musculoskeletal', ARRAY['poor posture', 'injury', 'strain'], ARRAY['pain']),
('Stomach Pain', 'Боль в животе', 'digestive', ARRAY['indigestion', 'infection', 'food intolerance'], ARRAY['pain']),
('Heart Palpitations', 'Сердцебиение', 'cardiovascular', ARRAY['anxiety', 'caffeine', 'arrhythmia'], ARRAY['urgent', 'heart']);

-- Seed lab test types
INSERT INTO medicine_lab_test_types (name, name_ru, category, body_system, description, preparation_instructions) VALUES
('Complete Blood Count', 'Общий анализ крови', 'blood', 'general', 'Measures red blood cells, white blood cells, and platelets', 'Fast for 8-12 hours if glucose is included'),
('Comprehensive Metabolic Panel', 'Биохимия крови', 'blood', 'general', 'Measures glucose, electrolytes, kidney and liver function', 'Fast for 8-12 hours'),
('Lipid Panel', 'Липидный профиль', 'blood', 'cardiovascular', 'Measures cholesterol and triglycerides', 'Fast for 9-12 hours'),
('Thyroid Panel', 'Тиреоидная панель', 'blood', 'endocrine', 'Measures TSH, T3, T4 levels', 'No special preparation needed'),
('HbA1c', 'Гликированный гемоглобин', 'blood', 'endocrine', 'Measures average blood sugar over 2-3 months', 'No fasting required'),
('Vitamin D', 'Витамин D', 'blood', 'general', 'Measures 25-hydroxyvitamin D level', 'No special preparation needed'),
('Iron Panel', 'Железо панель', 'blood', 'general', 'Measures iron, ferritin, TIBC', 'Fast for 8-12 hours, morning sample preferred'),
('CRP', 'С-реактивный белок', 'blood', 'general', 'Measures inflammation marker', 'No special preparation needed'),
('Urinalysis', 'Общий анализ мочи', 'urine', 'general', 'Analyzes urine composition', 'First morning sample preferred'),
('ECG', 'ЭКГ', 'imaging', 'cardiovascular', 'Records electrical activity of the heart', 'No special preparation needed');

-- ============================================
-- VIEWS
-- ============================================

-- View for medication schedule with next intake times
CREATE OR REPLACE VIEW v_medication_schedule AS
SELECT 
  um.id AS medication_id,
  um.user_id,
  COALESCE(d.name, um.custom_name) AS medication_name,
  um.dosage_amount,
  um.dosage_unit,
  um.frequency,
  um.with_food,
  um.instructions,
  um.reminder_enabled,
  um.is_active,
  um.current_stock,
  il.scheduled_time AS next_scheduled,
  il.status AS last_status,
  il.taken_at AS last_taken
FROM medicine_user_medications um
LEFT JOIN medicine_drugs d ON um.drug_id = d.id
LEFT JOIN LATERAL (
  SELECT * FROM medicine_intake_log 
  WHERE medication_id = um.id 
  ORDER BY scheduled_time DESC 
  LIMIT 1
) il ON true
WHERE um.is_active = true;

-- View for adherence statistics
CREATE OR REPLACE VIEW v_medication_adherence AS
SELECT 
  user_id,
  medication_id,
  DATE_TRUNC('week', scheduled_time) AS week,
  COUNT(*) FILTER (WHERE status = 'taken') AS taken_count,
  COUNT(*) AS total_scheduled,
  ROUND((COUNT(*) FILTER (WHERE status = 'taken')::numeric / NULLIF(COUNT(*), 0) * 100), 1) AS adherence_rate
FROM medicine_intake_log
GROUP BY user_id, medication_id, DATE_TRUNC('week', scheduled_time);

-- View for upcoming appointments
CREATE OR REPLACE VIEW v_upcoming_appointments AS
SELECT 
  a.*,
  d.name AS doctor_name,
  d.specialty AS doctor_specialty,
  d.phone AS doctor_phone
FROM medicine_appointments a
LEFT JOIN medicine_doctors d ON a.doctor_id = d.id
WHERE a.status = 'scheduled'
  AND a.scheduled_date >= CURRENT_DATE
ORDER BY a.scheduled_date, a.scheduled_time;

COMMENT ON MIGRATION IS 'Medicine module with medication tracking, lab results, appointments, and conditions';
