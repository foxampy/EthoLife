# Module 3: SLEEP (Сон)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Отслеживание** - Длительность, фазы, качество
2. **Анализ** - Гигиена сна, факторы влияния
3. **Улучшение** - Персональные рекомендации
4. **Расписание** - Smart alarm, оптимальное время

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Сессии сна
-- ============================================

-- Ночной сон
sleep_sessions
├── id (uuid)
├── user_id (uuid)
├── date (date) -- дата, на которую приходится сон
├── bedtime (timestamp) -- лег спать
├── wake_time (timestamp) -- проснулся
├── duration_minutes (int) -- общая длительность
├── sleep_latency_minutes (int) -- время засыпания
├── awake_duration_minutes (int) -- время бодрствования ночью
├── sleep_efficiency_percent (decimal 5,2) -- эффективность сна
├── source (enum: manual, wearable, phone_app, smart_alarm)
├── quality_score (int 0-100) -- субъективная оценка
├── notes (text)
└── created_at

-- Фазы сна (из wearables)
sleep_phases
├── id (uuid)
├── sleep_session_id (uuid)
├── phase_type (enum: deep, light, rem, awake)
├── start_time (timestamp)
├── end_time (timestamp)
├── duration_minutes (int)
└── percentage_of_total (decimal 5,2)

-- Показатели качества
sleep_metrics
├── id (uuid)
├── sleep_session_id (uuid)
├── heart_rate_avg (int, nullable)
├── heart_rate_min (int, nullable)
├── heart_rate_max (int, nullable)
├── hrv_avg (decimal 5,2, nullable)
├── breathing_rate_avg (decimal 4,1, nullable) -- вдохов/мин
├── body_temperature_avg (decimal 4,1, nullable)
├── spo2_avg (decimal 4,1, nullable) -- saturation
├── movement_score (int 0-100) -- двигался ли
├── snoring_duration_minutes (int, nullable)
├── sleep_apnea_events (int, nullable) -- из wearables
└── environmental_data (JSONB)
    ├── room_temp_celsius
    ├── room_humidity_percent
    ├── noise_level_db
    └── light_level_lux

-- ============================================
-- GOALS & SCHEDULES
-- ============================================

-- Цели и расписание сна
sleep_goals
├── id (uuid)
├── user_id (uuid)
├── target_bedtime (time)
├── target_wake_time (time)
├── target_duration_minutes (int) -- usually 420-540 (7-9 hours)
├── target_sleep_efficiency (decimal 5,2) -- usually 85%+
├── workdays_schedule (JSONB)
│   ├── bedtime
│   ├── wake_time
│   └── is_enabled
├── weekend_schedule (JSONB)
├── chronotype (enum: lion, bear, wolf, dolphin) -- тип личности по сну
├── is_smart_alarm_enabled (boolean)
├── smart_alarm_window_minutes (int) -- usually 30
└── is_active (boolean)

-- Smart alarm лог
sleep_smart_alarms
├── id (uuid)
├── user_id (uuid)
├── sleep_session_id (uuid)
├── scheduled_time (timestamp) -- когда должен был сработать
├── actual_trigger_time (timestamp) -- когда сработал (в light phase)
├── phase_at_trigger (enum: deep, light, rem, awake)
├── user_response (enum: dismissed, snoozed, missed)
└── effectiveness_rating (int 1-5) -- насколько легко проснулся

-- ============================================
-- HYGIENE & ROUTINE
-- ============================================

-- Гигиена сна (чеклисты)
sleep_routine_checklist
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── pre_sleep_activities (JSONB)
│   ├── no_caffeine_after_14h (boolean)
│   ├── no_heavy_meal_3h_before (boolean)
│   ├── no_screens_1h_before (boolean)
│   ├── dimmed_lights (boolean)
│   ├── meditation_or_relaxation (boolean)
│   ├── consistent_bedtime (boolean)
│   └── cool_room (boolean)
├── environment_score (int 0-100)
└── completed_at (timestamp)

-- Факторы влияния
sleep_factors
├── id (uuid)
├── sleep_session_id (uuid)
├── factor_type (enum: caffeine, alcohol, exercise, stress, medication, late_meal, nap, travel, illness, other)
├── factor_value (varchar 255) -- например "2 cups coffee at 16:00"
├── estimated_impact (enum: positive, negative, neutral)
├── severity (int 1-10) -- насколько сильно повлияло
└── notes (text)

-- Дневной сон
sleep_naps
├── id (uuid)
├── user_id (uuid)
├── start_time (timestamp)
├── end_time (timestamp)
├── duration_minutes (int)
├── nap_type (enum: power_nap_20min, restorative_90min, other)
├── quality_rating (int 1-5)
├── effect_on_night_sleep (enum: improved, no_effect, worsened)
└── notes (text)

-- ============================================
-- DREAMS (опционально)
-- ============================================

sleep_dreams
├── id (uuid)
├── user_id (uuid)
├── sleep_session_id (uuid)
├── dream_time (enum: early_night, middle_night, early_morning)
├── vividness (int 1-10)
├── emotional_tone (enum: positive, neutral, negative, mixed, nightmare)
├── content_summary (text)
├── is_lucid (boolean)
└── recorded_at (timestamp)

-- ============================================
-- ANALYTICS
-- ============================================

sleep_weekly_summaries
├── id (uuid)
├── user_id (uuid)
├── week_start_date (date)
├── avg_duration_minutes (int)
├── avg_quality_score (int)
├── avg_sleep_efficiency (decimal 5,2)
├── deep_sleep_avg_percent (decimal 5,2)
├── rem_sleep_avg_percent (decimal 5,2)
├── consistency_score (int 0-100) -- одинаковое время отхода/подъема
├── bedtime_variance_minutes (int)
├── wake_time_variance_minutes (int)
├── sleep_debt_minutes (int) -- накопленный недосып
└── ai_insights (text[])

-- Паттерны сна
sleep_patterns
├── id (uuid)
├── user_id (uuid)
├── pattern_name (varchar 255)
├── description (text)
├── pattern_type (enum: irregular_bedtime, insufficient_sleep, poor_efficiency, good_consistency, improving_trend, declining_trend)
├── confidence_score (decimal 3,2)
├── discovered_at (timestamp)
└── is_active (boolean)

-- ============================================
-- AI & INSIGHTS
-- ============================================

sleep_ai_insights
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, achievement, prediction, hygiene_tip)
├── title (varchar 255)
├── description (text)
├── related_factors (JSONB) -- связанные факторы
├── priority (enum: low, medium, high)
├── is_read (boolean)
└── created_at
```

---

## 📱 UX/UI Design

### 1. Sleep Dashboard
```
┌─────────────────────────────────────┐
│ 😴 Сон                        [⚙️]  │
├─────────────────────────────────────┤
│                                     │
│ [🔥 12 дней хорошего сна]           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │     [ДУГОВАЯ ДИАГРАММА]        │ │
│ │                                 │ │
│ │        7ч 24мин                 │ │
│ │        из 8ч цели               │ │
│ │                                 │ │
│ │        [спиральная визуализация]│ │
│ │        фаз сна                  │ │
│ │                                 │ │
│ │   🌙  ████████  35%  Глубокий   │ │
│ │   💤  ██████████  45%  Легкий   │ │
│ │   👁️  ████  20%  Быстрый        │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Качество: ⭐⭐⭐⭐☆ (4/5)              │
│ Эффективность: 89% ✓                │
│                                     │
│ 🌙 Вчера: 23:15 → 🌅 06:39          │
│                                     │
├─────────────────────────────────────┤
│ 📊 За 7 дней:                       │
│ Средний сон: 7ч 12мин               │
│ Лучший: 8ч 05мин (Вт)               │
│ Худший: 6ч 30мин (Пт) ⚠️            │
│                                     │
│ 💡 AI: "Пятница - поздний ужин.     │
│    Попробуй есть до 20:00."         │
└─────────────────────────────────────┘
```

### 2. Sleep Details
```
┌─────────────────────────────────────┐
│ ←  14 марта, пятница                │
├─────────────────────────────────────┤
│                                     │
│ Время сна                           │
│ ┌─────────────────────────────────┐ │
│ │ 🌙 23:15      🌅 06:39         │ │
│ │ Лег спать     Проснулся         │ │
│ │                                 │ │
│ │      [ТАЙМЛАЙН ФАЗ]             │ │
│ │ ████░░██████░░░░████░░██████    │ │
│ │ Лег  Глуб Лег  БД Лег  БД Рем   │ │
│ │                                 │ │
│ │ Общее: 7ч 24мин                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Фазы сна:                           │
│ ┌─────────────────────────────────┐ │
│ │ 🌙 Глубокий    2ч 35мин (35%)  │ │
│ │ 💤 Легкий      3ч 20мин (45%)  │ │
│ │ 👁️ Быстрый (REM) 1ч 29мин (20%)│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Показатели:                         │
│ 💓 Пульс: 58-72 (средн. 64)         │
│ 🫁 Дыхание: 14/мин                  │
│ 🌡️ Температура: 36.4°              │
│                                     │
│ Факторы:                            │
│ ⚠️ Кофе в 17:00                     │
│ ⚠️ Ужин в 21:30 (тяжелая еда)       │
│ ✓ Темная комната                    │
│                                     │
│ 📝 Заметки:                         │
│ "Чувствовал себя бодрым вечером,    │
│  поэтому поздно уснул"              │
└─────────────────────────────────────┘
```

### 3. Sleep Hygiene Checklist
```
┌─────────────────────────────────────┐
│ ✅ Гигиена сна                      │
├─────────────────────────────────────┤
│                                     │
│ Подготовка ко сну:                  │
│                                     │
│ ☐ Нет кофеина после 14:00           │
│    [Последний кофе в 10:30 ✓]       │
│                                     │
│ ☐ Легкий ужин (не позднее 3ч)       │
│    [Установить напоминание 18:30]   │
│                                     │
│ ☐ Нет экранов за час до сна         │
│    [21:00 включить серый фильтр]    │
│                                     │
│ ☐ Приглушенный свет                 │
│    [Авто: закат в 20:30]            │
│                                     │
│ ☐ Расслабление/медитация            │
│    [▶️ Запустить sleep story]       │
│                                     │
│ ☐ Прохладная комната (18-20°)       │
│    [Сейчас: 21° - открыть окно?]    │
│                                     │
│ ☐ Темнота и тишина                  │
│    [Включить white noise]           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🎯 Оптимальное время сна:       │ │
│ │    22:30 - 06:30                │ │
│ │                                 │ │
│ │ [🌙 Заснуть сейчас]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Совет: "Если не можешь уснуть    │
│ за 20 минут - вставай и почитай"    │
└─────────────────────────────────────┘
```

### 4. Sleep Trends
```
┌─────────────────────────────────────┐
│ 📈 Тренды сна                  [📅] │
├─────────────────────────────────────┤
│                                     │
│ [Неделя] [Месяц] [Год]              │
│                                     │
│ Длительность сна:                   │
│ [ГРАФИК СНА ПО ДНЯМ НЕДЕЛИ]         │
│                                     │
│ ──── Цель: 8 часов                  │
│ ═══  Фактически                     │
│                                     │
│ Среднее: 7ч 18мин                   │
│ Лучший день: Вт (8ч 12мин)          │
│ Худший день: Сб (6ч 15мин)          │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Последовательность: 72%             │
│ (одинаковое время отхода/подъема)   │
│                                     │
│ [ГРАФИК ВРЕМЕНИ ОТХОДА КО СНУ]      │
│                                     │
│ ⚠️ Проблемные паттерны:             │
│ • Выходные: поздно ложусь (+2ч)     │
│ • Понедельник: недосып (-1.5ч)      │
│                                     │
│ 💡 AI рекомендация:                 │
│ "Пробуй ложиться в одно время       │
│ и в выходные для лучшего ритма"     │
└─────────────────────────────────────┘
```

### 5. Smart Alarm
```
┌─────────────────────────────────────┐
│ ⏰ Умный будильник                  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        06:30                    │ │
│ │      [⏰ КОЛОКОЛЬЧИК]           │ │
│ │                                 │ │
│ │    [+] 06:30  [-]               │ │
│ │    [+] 30 мин [-] окно          │ │
│ │                                 │ │
│ │ 🧠 Smart wake: 06:00-06:30      │ │
│ │    Разбудит в легкой фазе       │ │
│ │                                 │ │
│ │ 🎵 Звук: "Пение птиц"           │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Расписание:                         │
│ ┌─────────────────────────────────┐ │
│ │ Пн-Пт  06:30 ☀️  [Smart]  [✓]  │ │
│ │ Сб-Вс  08:00 ☀️  [Smart]  [✓]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ История пробуждений:                │
│ Сегодня: 06:27 (фаза: Легкий) ✓     │
│ Вчера: 06:30 (фаза: Глубокий) ⚠️    │
│                                     │
│ 💡 Совет: "Вчера проснулся в        │
│ глубокой фазе - попробуй лечь      │
│ на 15 минут раньше"                 │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:

1. **Nutrition:**
   - Ужин поздно → Качество сна ↓
   - Кофеин после 14:00 → Засыпание ↑
   - Алкоголь → REM-сон ↓
   - Триптофан → Сон лучше
   - Тяжелая еда → Бессонница

2. **Movement:**
   - Тренировка вечером → Засыпание сложнее
   - Morning workout → Deep sleep ↑
   - Recovery → Сон важен для мышц

3. **Psychology:**
   - Стресс → Проблемы со сном
   - Meditation → Sleep quality ↑
   - Sleep deprivation → Тревожность ↑

4. **Medicine:**
   - Снотворные → Эффективность/зависимость
   - Депрессия ↔ Sleep issues
   - Sleep apnea → Требует врача

---

## 📊 Ежедневные метрики

### Автоматические (wearables):
1. **Длительность** - общее время сна
2. **Фазы** - % deep, light, REM
3. **Эффективность** - время сна / время в кровати
4. **Пульс** - средний, min, max во сне
5. **HRV** - восстановление
6. **Дыхание** - частота
7. **Движения** - беспокойство

### Ручной ввод:
8. **Оценка качества** - 1-5 звезд
9. **Заметки** - что повлияло
10. **Факторы** - кофе, алкоголь, стресс

---

## 🤖 AI Features

### 1. Sleep Quality Prediction
- "Сегодня качество сна будет 75%"
- На основе: кофе, тренировки, стресс

### 2. Optimal Bedtime Calculator
- "Лучше лечь в 22:30 для 8ч сна"
- Учитывает: chronotype, schedule

### 3. Factor Analysis
- "Когда ты пьешь кофе после 15:00,
   deep sleep падает на 20%"

### 4. Sleep Debt Calculator
- "Недосып за неделю: 3.5 часа"
- Рекомендации по восстановлению

### 5. Circadian Rhythm Advisor
- Chronotype detection (lion/bear/wolf/dolphin)
- Персональное расписание

---

## ✅ Implementation Checklist

### Phase 1: Core
- [ ] Sleep session tracking
- [ ] Manual entry
- [ ] Basic stats (duration, quality)
- [ ] Sleep goals

### Phase 2: Smart Features
- [ ] Wearable integration
- [ ] Phase tracking
- [ ] Smart alarm
- [ ] Hygiene checklist

### Phase 3: Advanced
- [ ] Factor correlation analysis
- [ ] AI insights
- [ ] Chronotype detection
- [ ] Environmental tracking

---

**Готово к разработке!** 😴
