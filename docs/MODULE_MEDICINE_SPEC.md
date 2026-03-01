# Module 5: MEDICINE (Медицина)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Медикаменты** - Напоминания, adherence, взаимодействия
2. **Симптомы** - Трекинг, паттерны, триггеры
3. **Анализы** - Результаты, динамика, нормы
4. **Врачи** - Приемы, история, рекомендации
5. **Диагнозы** - Хронические, острые, ремиссия

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Медикаменты
-- ============================================

-- Справочник лекарств
medicine_drugs
├── id (uuid)
├── name (varchar 255)
├── name_generic (varchar 255)
├── category (enum: prescription, otc, supplement, herbal, vitamin)
├── drug_class (varchar 100) -- e.g., 'SSRI', 'NSAID', 'antibiotic'
├── form (enum: tablet, capsule, liquid, injection, cream, patch, inhaler, drops, spray)
├── dosage_units (varchar[]) -- ['mg', 'mcg', 'ml', 'IU']
├── common_dosages (JSONB[]) -- [{ amount: 10, unit: 'mg' }]
├── side_effects (text[])
├── contraindications (text[])
├── drug_interactions (text[])
├── storage_instructions (text)
├── is_prescription_required (boolean)
└── approved_in_countries (varchar[])

-- Лекарства пользователя
medicine_user_medications
├── id (uuid)
├── user_id (uuid)
├── drug_id (uuid, nullable)
├── custom_name (varchar 255) -- если не в справочнике
├── dosage_amount (decimal 10,2)
├── dosage_unit (varchar 20)
├── frequency (JSONB) -- сложное расписание
│   ├── type (enum: daily, weekly, as_needed, custom)
│   ├── times_per_day (int)
│   ├── specific_times (time[])
│   ├── days_of_week (int[])
│   └── interval_hours (int)
├── prescribed_by (varchar 255) -- врач
├── prescribed_date (date)
├── start_date (date)
├── end_date (date, nullable) -- для курсов
├── reason (text) -- показание
├── instructions (text) -- как принимать
├── with_food (enum: before, with, after, empty_stomach, no_matter)
├── reminder_enabled (boolean)
├── reminder_sound (varchar, nullable)
├── refill_reminder_days (int) -- за сколько дней предупреждать
├── current_stock (decimal 10,2) -- сколько осталось
├── pharmacy_info (JSONB)
├── is_active (boolean)
└── notes (text)

-- Приемы лекарств (лог)
medicine_intake_log
├── id (uuid)
├── user_id (uuid)
├── medication_id (uuid)
├── scheduled_time (timestamp)
├── taken_at (timestamp, nullable)
├── status (enum: taken, skipped, missed, late, early)
├── dosage_taken (decimal 10,2)
├── notes (text)
├── location (JSONB, nullable)
├── taken_with_food (boolean, nullable)
├── side_effects_noted (text[])
└── mood_after (int 1-10, nullable)

-- ============================================
-- SYMPTOMS
-- ============================================

-- Справочник симптомов
medicine_symptoms_catalog
├── id (uuid)
├── name (varchar 255)
├── name_ru (varchar 255)
├── body_system (enum: general, cardiovascular, respiratory, digestive, neurological, musculoskeletal, skin, mental, reproductive, sensory)
├── severity_scale (JSONB) -- { min: 1, max: 10, descriptions: {...} }
├── common_causes (text[])
├── when_to_see_doctor (text)
└── tags (varchar[])

-- Симптомы пользователя
medicine_symptom_entries
├── id (uuid)
├── user_id (uuid)
├── symptom_id (uuid, nullable)
├── custom_symptom_name (varchar 255)
├── severity (int 1-10)
├── body_location (varchar 100) -- где болит/проявляется
├── quality (varchar[]) -- описание: 'sharp', 'dull', 'burning', etc
├── triggers (text[])
├── relievers (text[])
├── started_at (timestamp)
├── ended_at (timestamp, nullable)
├── duration_notes (text)
├── associated_symptoms (uuid[])
├── related_factors (JSONB) -- { sleep_quality, stress_level, food, activity }
├── notes (text)
└── created_at

-- Дневник симптомов (ежедневный обзор)
medicine_symptom_daily_summary
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── overall_wellness (int 1-10)
├── symptoms_present (uuid[]) -- какие симптомы были
├── pain_level_avg (int 1-10, nullable)
├── energy_level (int 1-10)
├── mobility_level (int 1-10)
├── notes (text)
└── created_at

-- ============================================
-- LAB TESTS & RESULTS
-- ============================================

-- Типы анализов
medicine_lab_test_types
├── id (uuid)
├── name (varchar 255)
├── name_ru (varchar 255)
├── category (enum: blood, urine, stool, imaging, genetic, microbiology, biopsy, other)
├── body_system (varchar 100)
├── description (text)
├── preparation_instructions (text)
├── parameters (JSONB[]) -- что измеряется
└── normal_frequency (varchar) -- как часто обычно делается

-- Результаты анализов
medicine_lab_results
├── id (uuid)
├── user_id (uuid)
├── test_type_id (uuid)
├── test_name (varchar 255)
├── ordered_by (varchar 255) -- врач
├── lab_name (varchar 255)
├── date_collected (date)
├── date_results (date)
├── results_data (JSONB) -- { parameter: { value, unit, reference_range, flag } }
├── overall_flag (enum: normal, borderline, abnormal, critical)
├── notes (text)
├── file_url (varchar) -- PDF скан
├── is_reviewed (boolean)
├── reviewed_by_user_at (timestamp)
└── created_at

-- Отдельные показатели анализов (для трендов)
medicine_lab_parameters
├── id (uuid)
├── lab_result_id (uuid)
├── parameter_name (varchar 100)
├── value (decimal 10,3)
├── unit (varchar 20)
├── reference_range_low (decimal 10,3)
├── reference_range_high (decimal 10,3)
├── flag (enum: low, normal, high, critical_low, critical_high)
├── previous_value (decimal 10,3, nullable)
├── change_percent (decimal 5,2, nullable)
└── trend (enum: improving, worsening, stable, new)

-- ============================================
-- APPOINTMENTS & DOCTORS
-- ============================================

-- Врачи
medicine_doctors
├── id (uuid)
├── user_id (uuid)
├── name (varchar 255)
├── specialty (varchar 100)
├── clinic_name (varchar 255)
├── address (text)
├── phone (varchar 50)
├── email (varchar 255)
├── is_primary_care (boolean)
├── notes (text)
└── is_active (boolean)

-- Приемы у врачей
medicine_appointments
├── id (uuid)
├── user_id (uuid)
├── doctor_id (uuid, nullable)
├── appointment_type (enum: routine, follow_up, urgent, procedure, consultation, telemedicine)
├── scheduled_date (date)
├── scheduled_time (time)
├── duration_minutes (int)
├── reason (text)
├── preparation_notes (text)
├── questions_to_ask (text[])
├── status (enum: scheduled, completed, cancelled, no_show, rescheduled)
├── outcome_notes (text)
├── diagnosis (text)
├── prescriptions_given (uuid[]) -- связь с medications
├── follow_up_needed (boolean)
├── follow_up_date (date, nullable)
├── reminder_enabled (boolean)
├── reminder_time (timestamp)
└── created_at

-- ============================================
-- CONDITIONS & HISTORY
-- ============================================

-- Диагнозы (хронические и острые)
medicine_conditions
├── id (uuid)
├── user_id (uuid)
├── icd10_code (varchar 20, nullable)
├── condition_name (varchar 255)
├── condition_type (enum: acute, chronic, recurrent, resolved, in_remission)
├── diagnosed_by (varchar 255)
├── diagnosed_date (date)
├── severity (enum: mild, moderate, severe)
├── symptoms (text[])
├── current_status (enum: active, managed, improving, worsening, resolved, in_remission)
├── treatment_plan (text)
├── medications (uuid[]) -- связь с user_medications
├── related_lab_tests (uuid[])
├── notes (text)
└── is_active (boolean)

-- История болезни (timeline)
medicine_health_timeline
├── id (uuid)
├── user_id (uuid)
├── event_date (date)
├── event_type (enum: diagnosis, procedure, hospitalization, surgery, vaccination, injury, recovery_milestone)
├── title (varchar 255)
├── description (text)
├── related_condition_id (uuid, nullable)
├── severity (enum: minor, moderate, major, critical)
├── outcome (varchar 255)
├── documents (JSONB[]) -- файлы
└── created_at

-- ============================================
-- FAMILY HISTORY
-- ============================================

medicine_family_history
├── id (uuid)
├── user_id (uuid)
├── relation (enum: mother, father, sibling, grandparent, child, aunt_uncle, cousin)
├── condition_name (varchar 255)
├── age_at_diagnosis (int, nullable)
├── current_status (enum: living_with, recovered, deceased, unknown)
├── notes (text)
└── genetic_risk_level (enum: low, moderate, high, unknown)

-- ============================================
-- AI & INSIGHTS
-- ============================================

medicine_ai_insights
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, drug_interaction, adherence_alert, appointment_reminder)
├── title (varchar 255)
├── description (text)
├── related_data (JSONB)
├── priority (enum: low, medium, high, critical)
├── is_read (boolean)
└── created_at

-- Взаимодействия лекарств (рассчитанные)
medicine_drug_interactions
├── id (uuid)
├── user_id (uuid)
├── medication_1_id (uuid)
├── medication_2_id (uuid)
├── interaction_severity (enum: minor, moderate, major, contraindicated)
├── interaction_type (enum: additive_effect, antagonistic, increased_toxicity, decreased_absorption)
├── description (text)
├── recommendation (text)
├── is_acknowledged (boolean)
└── detected_at (timestamp)
```

---

## 📱 UX/UI Design

### 1. Medication Dashboard
```
┌─────────────────────────────────────┐
│ 💊 Медицина                   [⚙️]  │
├─────────────────────────────────────┤
│                                     │
│ 📅 Сегодня, 15 марта                │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ⏰ УТРО (7:00)                      │
│ ┌─────────────────────────────────┐ │
│ │ 💊 Цетиризин 10мг              │ │
│ │    Противоаллергическое        │ │
│ │    [✓ Принято 7:05]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⏰ ДЕНЬ (13:00)                     │
│ ┌─────────────────────────────────┐ │
│ │ 💊 Омега-3 1000мг              │ │
│ │    С едой                      │ │
│ │    [⏰ Напомнить]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⏰ ВЕЧЕР (21:00)                    │
│ ┌─────────────────────────────────┐ │
│ │ 💊 Мелатонин 3мг               │ │
│ │    Перед сном                  │ │
│ │    [⏰ Напомнить]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 📊 Adherence (7 дней): 94%          │
│ [███████████░]                      │
│                                     │
│ ⚠️ Требует внимания:                │
│ Запас Цетиризина закончится через   │
│ 3 дня                               │
│                                     │
│ [💊 Все лекарства] [📋 История]     │
└─────────────────────────────────────┘
```

### 2. Add Medication
```
┌─────────────────────────────────────┐
│ ← Новое лекарство                   │
├─────────────────────────────────────┤
│                                     │
│ Название:                           │
│ [🔍 Начни печатать...     ]         │
│                                     │
│ Или выбери из списка:               │
│ [💊 Популярные] [🏠 Домашние]       │
│                                     │
│ Дозировка:                          │
│ [10] [мг ▼]                         │
│                                     │
│ Форма: [Таблетка ▼]                 │
│                                     │
│ Расписание:                         │
│ [Каждый день ▼]                     │
│                                     │
│ Время приема:                       │
│ [+] 08:00                           │
│ [+] 20:00                           │
│                                     │
│ Принимать:                          │
│ (•) Не имеет значения               │
│ ( ) До еды                          │
│ ( ) Во время еды                    │
│ ( ) После еды                       │
│                                     │
│ Показание (для чего):               │
│ [_________________]                 │
│                                     │
│ Назначил врач:                      │
│ [Др. Смитов]                        │
│                                     │
│ Напоминания: [✓]                    │
│                                     │
│         [💾 Сохранить]              │
└─────────────────────────────────────┘
```

### 3. Lab Results
```
┌─────────────────────────────────────┐
│ ← Результаты анализов          [+]  │
├─────────────────────────────────────┤
│                                     │
│ [📊 Все] [🩸 Кровь] [📷 Снимки]     │
│                                     │
│ Последние:                          │
│ ┌─────────────────────────────────┐ │
│ │ 🩸 Общий анализ крови          │ │
│ │ 📅 10 марта 2026               │ │
│ │ Лаборатория: Ситилаб           │ │
│ │                                 │ │
│ │ Статус: ⚠️ Требует внимания     │ │
│ │ • Гемоглобин: 118 (норма:      │ │
│ │   120-140) ↓ Ниже нормы        │ │
│ │                                 │ │
│ │ [Подробнее]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🧪 Биохимия крови              │ │
│ │ 📅 5 февраля 2026              │ │
│ │                                 │ │
│ │ Статус: ✅ Все в норме          │ │
│ │                                 │ │
│ │ [Подробнее]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [📈 Тренды показателей]             │
│                                     │
│ 💡 AI: "Гемоглобин снизился на      │
│ 5% за 3 месяца. Рекомендуется       │
│ консультация терапевта."            │
└─────────────────────────────────────┘
```

### 4. Lab Result Detail
```
┌─────────────────────────────────────┐
│ ← Общий анализ крови                │
├─────────────────────────────────────┤
│                                     │
│ 📅 10 марта 2026                    │
│ Лаборатория: Ситилаб                │
│ Направил: Др. Петров                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [📄 Просмотреть PDF]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Показатели:                         │
│                                     │
│ Гемоглобин                          │
│ [ГРАФИК ТРЕНДА]                     │
│ 118 г/л  ↓                          │
│ Норма: 120-140                      │
│ ⚠️ Ниже нормы на 1.7%               │
│                                     │
│ Эритроциты                          │
│ [ГРАФИК ТРЕНДА]                     │
│ 4.2 млн/мкл                         │
│ Норма: 4.0-5.0                      │
│ ✅ В норме                          │
│                                     │
│ Лейкоциты                           │
│ [ГРАФИК ТРЕНДА]                     │
│ 6.8 тыс/мкл                         │
│ Норма: 4.0-9.0                      │
│ ✅ В норме                          │
│                                     │
│ Тромбоциты                          │
│ [ГРАФИК ТРЕНДА]                     │
│ 245 тыс/мкл                         │
│ Норма: 150-400                      │
│ ✅ В норме                          │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 💡 AI Анализ:                       │
│ "Гемоглобин слегка снижен. Это      │
│ может быть связано с недостатком    │
│ железа. Рекомендуется добавить      │
│ больше красного мяса, печени,       │
│ шпината. Обсудите с врачом."       │
│                                     │
│ [👨‍⚕️ Найти врача]                    │
└─────────────────────────────────────┘
```

### 5. Health Timeline
```
┌─────────────────────────────────────┐
│ 📋 История здоровья            [📅] │
├─────────────────────────────────────┤
│                                     │
│ 2026                                │
│                                     │
│ Март ▼                              │
│ ├── 15 мар                          │
│ │   💊 Начат прием Витамина D       │
│ │                                     │
│ ├── 10 мар                          │
│ │   🩸 Анализ крови                 │
│ │   ⚠️ Гемоглобин низкий            │
│ │                                     │
│ ├── 5 мар                           │
│ │   👨‍⚕️ Прием терапевта             │
│ │   Жалобы на усталость             │
│ │                                     │
│                                     │
│ Февраль ▼                           │
│ ├── 20 фев                          │
│ │   🏥 Вакцинация от гриппа         │
│ │                                     │
│ ├── 5 фев                           │
│ │   🧪 Биохимия - всё в норме       │
│ │                                     │
│                                     │
│ Январь ▼                            │
│ ├── 15 янв                          │
│ │   🤧 ОРВИ - выздоровел           │
│ │                                     │
│ │   [Показать еще...]               │
│                                     │
│ [➕ Добавить событие]                │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:

1. **Nutrition:**
   - Таблетки → С едой/натощак/до еды
   - Анализы → Дефициты (железо, витамин D, B12)
   - Диета → Корректировка при болезнях

2. **Sleep:**
   - Мелатонин → Расписание
   - Антидепрессанты → Сон изменения
   - Sleep apnea → Требует врача

3. **Psychology:**
   - Антидепрессанты → Mood tracking
   - Терапия → Записи/домашка
   - Тревога → Медикаментозное лечение

4. **Movement:**
   - Травмы → Ограничения
   - Реабилитация → Специальные упражнения
   - Медикаменты → Пульс ограничения

---

## 📊 Ежедневные метрики

1. **Принятые лекарства** - adherence %
2. **Симптомы** - если есть
3. **Побочные эффекты** - отмечать
4. **Настроение после приема** - для психотропов

### По необходимости:
5. **Анализы** - динамика показателей
6. **Приемы у врачей** - расписание
7. **Остаток лекарств** - refill reminders

---

## 🤖 AI Features

### 1. Adherence Analysis
- "Ты пропускаешь вечернюю дозу по выходным"
- Reminder optimization
- Pattern recognition

### 2. Drug Interaction Check
- Автоматический анализ комбинаций
- Alerts for dangerous interactions
- Food-drug interactions

### 3. Symptom Pattern Recognition
- "Головная боль чаще по понедельникам"
- Корреляции с едой/соном/стрессом
- Trigger identification

### 4. Lab Trend Analysis
- "Гемоглобин снижается 3 месяца"
- Comparison with population norms
- Early warning system

### 5. Appointment Reminders
- Smart scheduling
- Preparation checklists
- Questions to ask doctor

---

## ✅ Implementation Checklist

### Phase 1: Core
- [ ] Medication tracking
- [ ] Reminders
- [ ] Basic adherence

### Phase 2: Smart Features
- [ ] Symptom tracking
- [ ] Lab results
- [ ] Drug interactions
- [ ] AI insights

### Phase 3: Advanced
- [ ] Doctor appointments
- [ ] Health timeline
- [ ] Family history
- [ ] Integration with doctors

---

**Готово к разработке!** 💊
