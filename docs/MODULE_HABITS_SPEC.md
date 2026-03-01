# Module 7: HABITS (Привычки)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Создание** - Новые полезные привычки
2. **Отказ** - От вредных привычек
3. **Отслеживание** - Streaks, consistency, progress
4. **Укрепление** - Accountability, rewards, stacking

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Привычки
-- ============================================

-- Шаблоны привычек
habits_templates
├── id (uuid)
├── name (varchar 255)
├── name_ru (varchar 255)
├── description (text)
├── category (enum: health, fitness, nutrition, sleep, productivity, learning, social, creativity, mindfulness, finance, environment, other)
├── difficulty (enum: easy, medium, hard)
├── suggested_frequency (enum: daily, weekly, specific_days)
├── suggested_time_of_day (time, nullable)
├── estimated_duration_minutes (int)
├── trigger_suggestion (text) -- "после кофе", "перед сном"
├── reminder_template (text)
├── icon (varchar 50)
├── color (varchar 7) -- hex
├── related_modules (varchar[]) -- ['nutrition', 'sleep', 'psychology']
├── expected_benefits (text[])
├── is_premium (boolean)
└── created_at

-- Привычки пользователя
habits_user_habits
├── id (uuid)
├── user_id (uuid)
├── template_id (uuid, nullable)
├── custom_name (varchar 255)
├── description (text)
├── habit_type (enum: build, quit, maintain)
├── category (varchar 50)
├── target_frequency (JSONB)
│   ├── type (enum: daily, weekly, specific_days, times_per_week)
│   ├── days_of_week (int[])
│   ├── times_per_week (int)
│   └── specific_times (time[])
├── trigger_habit_id (uuid, nullable) -- для habit stacking
├── cue_description (text) -- напоминание/триггер
├── location (varchar 255) -- где выполнять
├── estimated_duration_minutes (int)
├── why_important (text) -- мотивация
├── success_criteria (text) -- как понять что выполнено
├── start_date (date)
├── target_end_date (date, nullable) -- для quit habits
├── is_active (boolean)
├── current_streak (int)
├── longest_streak (int)
├── total_completions (int)
├── success_rate_percent (decimal 5,2)
├── last_completed_at (timestamp)
├── reminder_enabled (boolean)
├── reminder_time (time[])
├── accountability_partner_id (uuid, nullable) -- другой пользователь
├── reward_description (text)
└── created_at

-- ============================================
-- TRACKING
-- ============================================

-- Выполнения привычек
habits_completions
├── id (uuid)
├── habit_id (uuid)
├── user_id (uuid)
├── completed_at (timestamp)
├── completion_date (date)
├── notes (text)
├── difficulty_rating (int 1-10) -- насколько было сложно
├── satisfaction_rating (int 1-10) -- насколько приятно
├── location (varchar 255)
├── mood_before (int 1-10)
├── mood_after (int 1-10)
├── proof_photo_url (varchar, nullable)
├── proof_notes (text, nullable)
├── is_backdated (boolean) -- заполнено задним числом
└── created_at

-- Пропуски (для анализа)
habits_skips
├── id (uuid)
├── habit_id (uuid)
├── user_id (uuid)
├── scheduled_date (date)
├── skip_reason (enum: forgot, no_time, too_hard, not_motivated, emergency, intentional_rest, other)
├── reason_notes (text)
├── recovery_plan (text) -- как вернуться
└── created_at

-- ============================================
-- STREAKS & MILESTONES
-- ============================================

-- История streaks
habits_streak_history
├── id (uuid)
├── habit_id (uuid)
├── user_id (uuid)
├── streak_type (enum: current, longest, broken)
├── streak_length (int) -- дней
├── start_date (date)
├── end_date (date, nullable)
├── is_active (boolean)
└── created_at

-- Вехи (milestones)
habits_milestones
├── id (uuid)
├── habit_id (uuid)
├── milestone_type (enum: streak_days, total_completions, consistency_percent)
├── target_value (int)
├── achieved_at (timestamp, nullable)
├── reward_description (text)
├── is_achieved (boolean)
└── created_at

-- ============================================
-- GROUPS & ACCOUNTABILITY
-- ============================================

-- Группы привычек (челленджи)
habits_groups
├── id (uuid)
├── name (varchar 255)
├── description (text)
├── habit_template_id (uuid, nullable)
├── creator_id (uuid)
├── max_members (int)
├── start_date (date)
├── end_date (date)
├── is_public (boolean)
├── join_code (varchar 20, nullable)
├── members_count (int)
├── leaderboard_enabled (boolean)
├── chat_enabled (boolean)
└── created_at

-- Участники группы
habits_group_members
├── id (uuid)
├── group_id (uuid)
├── user_id (uuid)
├── joined_at (timestamp)
├── personal_habit_id (uuid) -- связанная привычка
├── current_streak (int)
├── completions_count (int)
├── last_active_at (timestamp)
└── is_active (boolean)

-- ============================================
-- ANALYTICS
-- ============================================

-- Аналитика привычек
habits_analytics
├── id (uuid)
├── user_id (uuid)
├── habit_id (uuid)
├── analysis_period (enum: week, month, quarter, year)
├── period_start (date)
├── period_end (date)
├── completion_rate (decimal 5,2)
├── avg_streak_length (decimal 5,2)
├── best_day_of_week (int 0-6)
├── best_time_of_day (time)
├── common_skip_reasons (JSONB) -- { forgot: 5, no_time: 3 }
├── difficulty_trend (enum: improving, stable, worsening)
├── motivation_level (int 1-10)
└── ai_insights (text[])

-- Паттерны успеха/неудач
habits_patterns
├── id (uuid)
├── user_id (uuid)
├── habit_id (uuid, nullable)
├── pattern_type (enum: success_factor, failure_trigger, optimal_conditions)
├── description (text)
├── confidence_score (decimal 3,2)
├── supporting_data (JSONB)
└── discovered_at (timestamp)

-- ============================================
-- REWARDS & GAMIFICATION
-- ============================================

-- Награды
habits_rewards
├── id (uuid)
├── user_id (uuid)
├── reward_type (enum: intrinsic, extrinsic, social, achievement)
├── description (text)
├── trigger_condition (varchar 255) -- "streak_7", "completion_100"
├── is_claimed (boolean)
├── claimed_at (timestamp)
└── created_at

-- Достижения
habits_achievements
├── id (uuid)
├── user_id (uuid)
├── achievement_type (enum: streak_master, consistency_king, comeback_kid, habit_stacker, early_bird, night_owl, weekend_warrior, perfect_week, phoenix_rising)
├── title (varchar 255)
├── description (text)
├── icon (varchar 50)
├── earned_at (timestamp)
├── related_habit_id (uuid, nullable)
└── rarity (enum: common, rare, epic, legendary)

-- ============================================
-- AI & INSIGHTS
-- ============================================

habits_ai_insights
├── id (uuid)
├── user_id (uuid)
├── habit_id (uuid, nullable)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, celebration, prediction, technique_suggestion)
├── title (varchar 255)
├── description (text)
├── supporting_data (JSONB)
├── suggested_action (text)
├── priority (enum: low, medium, high)
├── is_read (boolean)
└── created_at
```

---

## 📱 UX/UI Design

### 1. Habits Dashboard
```
┌─────────────────────────────────────┐
│ 🎯 Привычки                   [+]   │
├─────────────────────────────────────┤
│                                     │
│ [🔥 12 дней общий streak]           │
│                                     │
│ Сегодня, 15 марта:                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🌅 Утренняя зарядка            │ │
│ │ 🔥 15 дней streak               │ │
│ │    [✓ Выполнено 7:05]          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📖 Чтение 30 мин               │ │
│ │ 🔥 8 дней streak                │ │
│ │    [✓ Выполнено 21:30]         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🧘 Медитация                   │ │
│ │ 🔥 3 дня streak                 │ │
│ │    [⭕ Отметить выполнение]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🚫 Не есть сахар               │ │
│ │ 🔥 5 дней streak                │ │
│ │    [⚠️ Сложный день - держись] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ 📊 Эта неделя: [✓✓✓✓✓✓➖] 6/7        │
│                                     │
│ 💡 AI: "Утро - твое лучшее время    │
│ для медитации. Попробуй перенести   │
│ на 7:00."                           │
│                                     │
│ [🏆 Достижения] [👥 Группы]         │
└─────────────────────────────────────┘
```

### 2. Habit Detail
```
┌─────────────────────────────────────┐
│ ← 🧘 Медитация                 [⚙️]  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │       [FLAME АНИМАЦИЯ]         │ │
│ │                                 │ │
│ │         🔥 15                  │ │
│ │       дней streak              │ │
│ │                                 │ │
│ │    Цель: 30 дней               │ │
│ │    [████████░░░░░░] 50%        │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 Статистика:                      │
│ • Всего выполнено: 47 раз           │
│ • Лучший streak: 23 дня             │
│ • Успешность: 78%                   │
│ • Средняя длительность: 12 мин      │
│                                     │
│ 📅 История:                         │
│ Март: [✓✓✓✓✓✓✓] [✓✓✓✓✓✓➖] [✓...] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📈 График streak за 3 месяца    │ │
│ │ [ЛИНЕЙНЫЙ ГРАФИК]               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🎯 Следующая веха: 21 день          │
│ Награда: Значок "Медитатор"         │
│                                     │
│ 💡 AI Совет:                        │
│ "Ты чаще пропускаешь в выходные.    │
│ Поставь напоминание на 9:00 суббота"│
│                                     │
│ [✅ Отметить сейчас]                │
└─────────────────────────────────────┘
```

### 3. Add New Habit
```
┌─────────────────────────────────────┐
│ ← Новая привычка                    │
├─────────────────────────────────────┤
│                                     │
│ [🏃 Создать] [📚 Шаблоны]           │
│                                     │
│ Название:                           │
│ [🧘 Медитация                       │
│  10 минут]                          │
│                                     │
│ Тип: (•) Создать  ( ) Отказаться    │
│                                     │
│ Категория:                          │
│ [🧠 Осознанность ▼]                 │
│                                     │
│ Частота:                            │
│ (•) Каждый день                     │
│ ( ) Будние дни                      │
│ ( ) 3 раза в неделю                 │
│ ( ) Свое расписание                 │
│                                     │
│ Время:                              │
│ [07:00] [+]                         │
│                                     │
│ ⏰ Напоминание: [✓] за 10 мин       │
│                                     │
│ Habit Stack (связка):               │
│ После: [☕ Утренний кофе ▼]          │
│ Я буду: [медитировать 10 мин]       │
│                                     │
│ Почему это важно:                   │
│ "Хочу меньше тревожиться и          │
│ лучше концентрироваться"            │
│                                     │
│ Где: [🛋️ Дома, в кресле]            │
│                                     │
│         [🚀 Начать привычку]        │
└─────────────────────────────────────┘
```

### 4. Habit Stacking
```
┌─────────────────────────────────────┐
│ 🔗 Связка привычек                  │
├─────────────────────────────────────┤
│                                     │
│ Текущие связки:                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ☕ Утренний кофе                │ │
│ │            ↓                    │ │
│ │ 🧘 Медитация 10 мин            │ │
│ │            ↓                    │ │
│ │ 📖 Чтение 20 мин               │ │
│ │                                 │ │
│ │ [✓✓✓] Успешность: 85%          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🍽️ Обед                         │ │
│ │            ↓                    │ │
│ │ 🚶 Прогулка 15 мин             │ │
│ │                                 │ │
│ │ [✓✓➖] Успешность: 67%          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Создать новую связку:               │
│ После: [_________________ ▼]        │
│ Я буду: [_________________]         │
│                                     │
│         [➕ Добавить связку]        │
└─────────────────────────────────────┘
```

### 5. Group Challenge
```
┌─────────────────────────────────────┐
│ 👥 Групповой челлендж               │
├─────────────────────────────────────┤
│                                     │
│ 🏃 Morning Runners Club             │
│ 30 дней утренних пробежек           │
│                                     │
│ [🎆 Осталось 12 дней]               │
│                                     │
│ 📊 Моя позиция: #3 из 12            │
│                                     │
│ 🏆 Топ участников:                  │
│ ┌─────────────────────────────────┐ │
│ │ 🥇 Анна          28 дней 🔥    │ │
│ │ 🥈 Михаил        26 дней       │ │
│ │ 🥉 Я             24 дней       │ │
│ │    Сергей        21 день       │ │
│ │    ...                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💬 Чат группы:                      │
│ Анна: "Сегодня 5км за 25 мин! 💪"   │
│ Я: "Отличный результат!"            │
│                                     │
│ 📈 Статистика группы:               │
│ • Всего пробежек: 312               │
│ • Общая дистанция: 1,456 км         │
│ • Средний streak: 18 дней           │
│                                     │
│ [💬 Открыть чат] [📤 Пригласить]    │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:

1. **All Modules:**
   - Habits поддерживают ВСЕ остальные модули
   - Daily check-ins для каждого модуля
   - Cross-module streaks

2. **Nutrition:**
   - Привычка: "Пить воду после пробуждения"
   - Привычка: "Принимать витамины"

3. **Movement:**
   - Привычка: "10K шагов"
   - Привычка: "Утренняя зарядка"

4. **Sleep:**
   - Привычка: "Ложиться в 22:30"
   - Привычка: "Без телефона за час до сна"

5. **Psychology:**
   - Привычка: "3 благодарности"
   - Привычка: "5 минут медитации"

6. **Medicine:**
   - Привычка: "Принимать лекарства"

7. **Relationships:**
   - Привычка: "Позвонить родителям"
   - Привычка: "Date night раз в неделю"

---

## 📊 Ежедневные метрики

1. **Привычки выполнены** - % от плана
2. **Streaks** - по каждой привычке
3. **Общий streak** - дней подряд с любыми чек-инами
4. **Сложность** - насколько было тяжело
5. **Удовлетворение** - насколько приятно

---

## 🤖 AI Features

### 1. Optimal Time Suggestion
- "Ты лучше выполняешь медитацию в 7:00, чем в 21:00"

### 2. Failure Prediction
- "Вероятность пропуска завтра: 65%"
- "Причина: поздний ужин, поздний подъем"

### 3. Streak Recovery
- Streak сломан → Suggested recovery plan
- "Не переживай, начни сначала. 80% людей ломают streak на 2-3 неделе"

### 4. Habit Stacking Suggestions
- "Добавь 'пить воду' после 'утреннего кофе'"

### 5. Difficulty Adjustment
- "Эта привычка слишком сложна - уменьши до 5 минут"

---

## ✅ Implementation Checklist

### Phase 1: Core
- [ ] Habit CRUD
- [ ] Daily check-in
- [ ] Streak tracking
- [ ] Basic stats

### Phase 2: Smart Features
- [ ] Habit stacking
- [ ] Groups/challenges
- [ ] AI insights
- [ ] Rewards

### Phase 3: Advanced
- [ ] Accountability partners
- [ ] Advanced analytics
- [ ] Integrations with all modules

---

**Готово к разработке!** 🎯
