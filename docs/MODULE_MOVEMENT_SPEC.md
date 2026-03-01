# Module 2: MOVEMENT (Движение/Активность)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Отслеживание** - Шаги, дистанция, калории, тренировки
2. **Структура** - Планирование тренировок, программы
3. **Анализ** - Прогресс, форма, восстановление
4. **Мотивация** - Streaks, достижения, челленджи

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Активность и тренировки
-- ============================================

-- Ежедневная активность (авто + ручной ввод)
movement_daily_activity
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── steps (int) -- шаги
├── distance_meters (int)
├── calories_burned (int) -- активные калории
├── active_minutes (int) -- время в движении
├── floors_climbed (int)
├── source (enum: manual, phone, wearable, mixed)
├── is_goal_achieved (boolean)
└── created_at

-- Тренировки
movement_workouts
├── id (uuid)
├── user_id (uuid)
├── workout_type (enum)
│   -- cardio, strength, hiit, yoga, pilates, running, cycling, 
│   -- swimming, walking, hiking, sports, martial_arts, dance, other
├── name (varchar 255)
├── start_time (timestamp)
├── end_time (timestamp)
├── duration_seconds (int)
├── calories_burned (int)
├── heart_rate_avg (int, nullable)
├── heart_rate_max (int, nullable)
├── heart_rate_min (int, nullable)
├── source (enum: manual, app, wearable, imported)
├── location_data (JSONB, nullable) -- GPS трек
├── notes (text)
├── feeling_rating (int 1-10) -- как себя чувствовал
├── rpe (int 6-20) -- Rate of Perceived Exertion
├── is_planned (boolean)
├── planned_workout_id (uuid, nullable)
└── created_at

-- Детали тренировки (упражнения)
movement_workout_exercises
├── id (uuid)
├── workout_id (uuid)
├── exercise_id (uuid) -- ссылка на справочник
├── exercise_name (varchar 255) -- денормализация
├── order_index (int)
├── notes (text)
├── rest_seconds (int)
└── sets (JSONB[]) -- [{ reps, weight_kg, duration_seconds, distance_meters, rpe, notes }]

-- Справочник упражнений
movement_exercises
├── id (uuid)
├── name (varchar 255)
├── name_ru (varchar 255)
├── category (enum: cardio, strength, flexibility, balance, plyometrics, mobility)
├── muscle_groups (varchar[]) -- ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
├── equipment (varchar[]) -- ['none', 'dumbbells', 'barbell', 'kettlebell', 'machine', 'cable', 'bodyweight']
├── difficulty (enum: beginner, intermediate, advanced)
├── instructions (text[])
├── video_url (varchar)
├── image_url (varchar)
├── met_value (decimal 4,2) -- Metabolic Equivalent of Task
├── calories_per_hour (int) -- примерный расход
├── is_verified (boolean)
└── tags (varchar[])

-- ============================================
-- PLANS & PROGRAMS
-- ============================================

-- Программы тренировок
movement_programs
├── id (uuid)
├── name (varchar 255)
├── description (text)
├── goal (enum: lose_weight, build_muscle, improve_endurance, general_fitness, strength, flexibility)
├── difficulty (enum: beginner, intermediate, advanced)
├── duration_weeks (int)
├── days_per_week (int)
├── equipment_needed (varchar[])
├── is_ai_generated (boolean)
├── created_by_user_id (uuid, nullable)
├── is_public (boolean)
├── likes_count (int)
├── weeks (JSONB[]) -- структура программы
└── created_at

-- Запланированные тренировки
movement_planned_workouts
├── id (uuid)
├── user_id (uuid)
├── program_id (uuid, nullable)
├── name (varchar 255)
├── scheduled_date (date)
├── scheduled_time (time, nullable)
├── workout_type (enum)
├── estimated_duration_minutes (int)
├── estimated_calories (int)
├── exercises (JSONB[]) -- план упражнений
├── is_completed (boolean)
├── completed_workout_id (uuid, nullable)
├── reminder_enabled (boolean)
├── reminder_time (time, nullable)
└── notes (text)

-- ============================================
-- METRICS & ANALYTICS
-- ============================================

-- Показатели физической формы
movement_fitness_metrics
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── vo2_max (decimal 4,1, nullable) -- мл/кг/мин
├── resting_heart_rate (int, nullable)
├── recovery_heart_rate (int, nullable) -- через 1 мин после нагрузки
├── hrv (decimal 5,2, nullable) -- Heart Rate Variability
├── lactate_threshold (decimal 4,1, nullable)
├── ftp (int, nullable) -- Functional Threshold Power (велосипед)
├── body_composition (JSONB)
│   ├── muscle_mass_kg
│   ├── body_fat_percent
│   └── bone_mass_kg
└── created_at

-- Личные рекорды
movement_personal_records
├── id (uuid)
├── user_id (uuid)
├── exercise_id (uuid, nullable)
├── pr_type (enum: weight, reps, distance, time, speed, power, volume)
├── value (decimal 10,2)
├── unit (varchar 20)
├── achieved_at (timestamp)
├── workout_id (uuid)
├── previous_best (decimal 10,2)
├── improvement_percent (decimal 5,2)
└── is_notified (boolean)

-- Состояние восстановления
movement_recovery_status
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── recovery_score (int 0-100) -- общий балл восстановления
├── sleep_quality_impact (int -50 to +50)
├── nutrition_impact (int -50 to +50)
├── stress_impact (int -50 to +50)
├── previous_workout_impact (int -50 to +50)
├── readiness_to_train (enum: low, moderate, high, optimal)
├── recommended_intensity (enum: rest, light, moderate, hard, max)
├── muscle_groups_fatigue (JSONB) -- { chest: 80, legs: 40, back: 60 }
└── ai_recommendation (text)

-- ============================================
-- ROUTES & OUTDOOR
-- ============================================

-- Маршруты (бег, велосипед, хайкинг)
movement_routes
├── id (uuid)
├── user_id (uuid)
├── name (varchar 255)
├── activity_type (enum: running, cycling, hiking, walking)
├── distance_meters (int)
├── elevation_gain_meters (int)
├── elevation_loss_meters (int)
├── geojson (JSONB) -- полный трек
├── start_point (JSONB) -- { lat, lng, address }
├── end_point (JSONB)
├── photos (varchar[])
├── difficulty_rating (int 1-5)
├── is_public (boolean)
├── times_completed (int)
└── created_at

-- ============================================
-- AI & INSIGHTS
-- ============================================

movement_ai_insights
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, achievement, prediction, form_tip)
├── title (varchar 255)
├── description (text)
├── related_metrics (JSONB)
├── priority (enum: low, medium, high)
├── is_read (boolean)
└── created_at

-- Тренировочные паттерны
movement_patterns
├── id (uuid)
├── user_id (uuid)
├── pattern_name (varchar 255)
├── description (text)
├── pattern_type (enum: overtraining, undertraining, plateau, improvement, inconsistency)
├── confidence_score (decimal 3,2)
├── affected_metrics (varchar[])
├── discovered_at (timestamp)
└── is_active (boolean)
```

---

## 📱 UX/UI Design

### 1. Activity Dashboard
```
┌─────────────────────────────────────┐
│ 🏃 Движение                   [⚙️]  │
├─────────────────────────────────────┤
│                                     │
│  [🔥 12 дней streak]                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │    [КОЛЬЦА АКТИВНОСТИ]      │   │
│  │                             │   │
│  │    Шаги  Калории  Время     │   │
│  │    8,432   420     65       │   │
│  │    ██████  ██████  ██████   │   │
│  │    /10K   /600   /90мин     │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  🏃 Сегодня:                        │
│  ┌─────────────────────────────┐   │
│  │ 🏋️ Силовая тренировка       │   │
│  │    07:00 • 45 мин • 320 ккал│   │
│  │    [Грудь + Трицепс]        │   │
│  │    ████████░░ 8/10 силы     │   │
│  └─────────────────────────────┘   │
│                                     │
│  📅 Завтра запланировано:           │
│  🏃 Бег легкий • 5км                │
│  Рекомендация AI: "Отличный восст." │
│                                     │
├─────────────────────────────────────┤
│ [🏃 Начать]  [📊 Статистика]        │
│ [🏆 Рекорды] [👥 Друзья]            │
└─────────────────────────────────────┘
```

### 2. Workout Logger (Во время тренировки)
```
┌─────────────────────────────────────┐
│ 🏋️ Силовая тренировка        ⏸️ ⏹️  │
├─────────────────────────────────────┤
│ ⏱️ 00:35:24    💓 128    🔥 245     │
├─────────────────────────────────────┤
│                                     │
│ Текущее упражнение:                 │
│ ┌─────────────────────────────────┐ │
│ │ #3 Жим гантелей лежа            │ │
│ │                                 │ │
│ │ [ФОТО/ВИДЕО УПРАЖНЕНИЯ]         │ │
│ │                                 │ │
│ │ Грудь • Средний • Гантели       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Подходы:                            │
│ ┌────┬────────┬──────┬──────────┐  │
│ │ 1  │ 12 ×   │ 20   │ ✓        │  │
│ │ 2  │ 10 ×   │ 20   │ ✓        │  │
│ │ 3  │   ×    │      │ [+Добав.]│  │
│ └────┴────────┴──────┴──────────┘  │
│                                     │
│ Быстрый ввод:                       │
│ [12] [10] [8] [6]                   │
│                                     │
│ Отдых: [00:45] ⏱️ [Пропустить]      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  ▶️  Следующее: Разводка       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 3. Exercise Library
```
┌─────────────────────────────────────┐
│ ← Библиотека упражнений      [🔍]   │
├─────────────────────────────────────┤
│                                     │
│ [Все] [Сила] [Кардио] [Йога] [..]   │
│                                     │
│ Поиск: _____________________        │
│                                     │
│ 💪 Силовые:                         │
│ ┌─────────────────────────────────┐ │
│ │ [📷] Приседания со штангой      │ │
│ │ ⭐ 4.8 • Ноги • Штанга • Сложн. │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [📷] Становая тяга              │ │
│ │ ⭐ 4.9 • Спина • Штанга • Сложн.│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [📷] Жим грудей лежа            │ │
│ │ ⭐ 4.7 • Грудь • Штанга • Средн.│ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠 Дома] [🏋️ Зал] [🤸 Без инстр.]│
│                                     │
│ 💡 AI: "На основе твоих целей,      │
│ добавь тягу к поясу для баланса"    │
└─────────────────────────────────────┘
```

### 4. Recovery Status
```
┌─────────────────────────────────────┐
│ 🧘 Восстановление                   │
├─────────────────────────────────────┤
│                                     │
│ [КРУГОВАЯ ДИАГРАММА]                │
│                                     │
│     Состояние: 78/100               │
│     [ОТЛИЧНОЕ] 🟢                   │
│                                     │
│ Факторы восстановления:             │
│                                     │
│ 😴 Сон      ████████████░░  85%     │
│ 🍎 Питание  ██████████░░░░  75%     │
│ 😌 Стресс   ███████████░░░  80%     │
│ 🏋️ Вчера    █████████████░  95%     │
│                                     │
│ Усталость мышц:                     │
│ Грудь   ████████░░░░  Тренируй      │
│ Спина   ██████████░░  Отдохни ⚠️    │
│ Ноги    ██████░░░░░░  Можно тренир. │
│ Руки    ████░░░░░░░░  Восстановлены │
│                                     │
│ 💡 AI Рекомендация:                 │
│ "Спина еще восстанавливается.       │
│  Лучше сегодня кардио или ноги."    │
│                                     │
│ [🏃 Кардио] [🦵 Ноги] [🧘 Отдых]    │
└─────────────────────────────────────┘
```

### 5. Progress & Achievements
```
┌─────────────────────────────────────┐
│ 📈 Прогресс                    [📅] │
├─────────────────────────────────────┤
│                                     │
│ [График: 1М] [3М] [6М] [1Г] [Всё]  │
│                                     │
│ Объем тренировок (кг × повторения)  │
│ [ЛИНЕЙНЫЙ ГРАФИК РОСТА]             │
│                                     │
│ Статистика за 30 дней:              │
│ • Тренировок: 18                    │
│ • Активных дней: 24                 │
│ • Общий объем: 145,000 кг           │
│ • Время: 22 часа                    │
│                                     │
├─────────────────────────────────────┤
│ 🏆 Личные рекорды:                  │
│ ┌─────────────────────────────────┐ │
│ │ 🎉 НОВЫЙ! Становая тяга        │ │
│ │    140 кг × 3 повт.            │ │
│ │    Было: 130 кг (+7.7%)        │ │
│ │    15 марта, 2026              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Достижения:                         │
│ [💪] [🏃] [🔥] [⭐] [🎯] [🏆] [🎖️]  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:

1. **Nutrition:**
   - Тренировка → Требуется +20-40г белка
   - Сожженные калории → Корректировка лимита калорий
   - Pre/post workout nutrition timing
   - Гликоген → Интенсивность тренировки

2. **Sleep:**
   - Плохой сон → Рекомендуется легкая тренировка
   - Deep sleep → Восстановление мышц
   - Тренировка поздно → Качество сна ↓

3. **Psychology:**
   - Тренировка → Эндорфины → Настроение ↑
   - Streak → Мотивация
   - Пропуск → Чувство вины (управление)

4. **Medicine:**
   - Травмы → Корректировка программы
   - Медикаменты → Пульс/Нагрузка ограничения
   - Реабилитация → Специальные упражнения

5. **Posture (отдельный модуль):**
   - Сидячая работа → Мобильность упражнения
   - Проблемы осанки → Упражнения на осанку

---

## 📊 Ежедневные метрики

### Автоматические (wearables/phone):
1. **Шаги** - цель обычно 10,000
2. **Дистанция** - км пройдено
3. **Активные калории** - сожжено
4. **Время движения** - минуты
5. **Этажи** - подъемы

### Тренировки (ручной ввод):
6. **Тип тренировки** - сила/кардио/йога/etc
7. **Длительность** - минуты
8. **Пульс** - средний, мин, макс
9. **Ощущения** - RPE 6-20
10. **Упражнения** - сеты/повторы/вес

### Еженедельные:
11. **VO2 max** - аэробная форма
12. **HRV** - вариабельность пульса
13. **Пульс покоя** - утром
14. **Recovery score** - готовность

---

## 🤖 AI Features

### 1. Workout Generator
- AI создает тренировку на сегодня
- Учитывает: recovery, goals, available equipment, time
- Прогрессия от недели к неделе

### 2. Form Analysis (Video)
- Загружаешь видео упражнения
- AI анализирует технику
- Советы по улучшению

### 3. Plateau Detection
- "Нет прогресса в жиме 3 недели"
- Рекомендации: deload, смена упражнения, volume

### 4. Injury Prevention
- Анализ дисбалансов (толкающие vs тянущие)
- Предупреждение о перетренированности
- Рекомендации по восстановлению

### 5. Adaptive Programs
- Автокорректировка программы
- Если пропустил тренировку → перепланировка
- Если слишком легко → увеличение нагрузки

---

## ✅ Implementation Checklist

### Phase 1: Core
- [ ] Database schema
- [ ] Workout logger
- [ ] Exercise library
- [ ] Basic stats

### Phase 2: Smart Features
- [ ] Wearables integration
- [ ] GPS tracking (running/cycling)
- [ ] Recovery calculator
- [ ] AI workout generator

### Phase 3: Advanced
- [ ] Video form analysis
- [ ] Social features
- [ ] Programs builder
- [ ] Challenges

---

**Готово к разработке!** 🏃
