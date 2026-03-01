# Module 4: PSYCHOLOGY (Психология)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Оценка** - Ежедневное настроение, эмоции, стресс
2. **Понимание** - Паттерны, триггеры, связи
3. **Поддержка** - Техники, медитации, терапия
4. **Профилактика** - Предотвращение выгорания, депрессии

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Настроение и эмоции
-- ============================================

-- Ежедневный чек-ин настроения
psychology_mood_entries
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── time_of_day (enum: morning, afternoon, evening, night)
├── overall_mood (int 1-10) -- общее настроение
├── energy_level (int 1-10)
├── stress_level (int 1-10)
├── anxiety_level (int 1-10)
├── focus_level (int 1-10)
├── emotions (varchar[]) -- ['happy', 'grateful', 'anxious', 'tired', 'motivated', ...]
├── mood_tags (varchar[]) -- контекст: работа, семья, здоровье, финансы
├── journal_entry (text)
├── voice_note_url (varchar, nullable)
├── photo_mood_url (varchar, nullable)
├── weather (varchar, nullable) -- sunny, rainy, etc
├── location_context (varchar, nullable) -- home, work, outdoors
├── social_context (varchar, nullable) -- alone, with_family, with_friends, at_work
├── trigger_event (text, nullable) -- что вызвало эмоцию
└── created_at

-- Детальная эмоциональная карта
psychology_emotion_checkins
├── id (uuid)
├── user_id (uuid)
├── mood_entry_id (uuid)
├── emotion_name (varchar 50) -- из списка Plutchik wheel
├── emotion_intensity (int 1-10)
├── valence (enum: positive, neutral, negative)
├── arousal (int 1-10) -- возбуждение/спокойствие
├── body_sensation (varchar 255) -- где чувствуется в теле
├── duration_minutes (int, nullable)
└── resolved (boolean)

-- ============================================
-- ASSESSMENTS & SCREENINGS
-- ============================================

-- Стандартизированные опросники
psychology_assessments
├── id (uuid)
├── user_id (uuid)
├── assessment_type (enum: phq9, gad7, pss, wb5, who5, custom)
├── assessment_name (varchar 255)
├── total_score (int)
├── severity_level (enum: minimal, mild, moderate, moderately_severe, severe)
├── answers (JSONB) -- { question_id: answer_value }
├── interpretation (text)
├── taken_at (timestamp)
├── next_recommended_at (timestamp)
└── is_completed (boolean)

-- PHQ-9 (Depression screening)
psychology_phq9_scores
├── id (uuid)
├── assessment_id (uuid)
├── user_id (uuid)
├── total_score (int 0-27)
├── severity (varchar 20) -- minimal(0-4), mild(5-9), moderate(10-14), moderately_severe(15-19), severe(20-27)
├── suicidal_ideation_flag (boolean) -- question 9
├── created_at
└── requires_follow_up (boolean)

-- GAD-7 (Anxiety screening)
psychology_gad7_scores
├── id (uuid)
├── assessment_id (uuid)
├── user_id (uuid)
├── total_score (int 0-21)
├── severity (varchar 20)
└── created_at

-- ============================================
-- TECHNIQUES & EXERCISES
-- ============================================

-- Техники для работы с эмоциями
psychology_techniques
├── id (uuid)
├── name (varchar 255)
├── name_ru (varchar 255)
├── category (enum: breathing, meditation, cbt, grounding, mindfulness, gratitude, journaling, visualization, somatic, relaxation)
├── difficulty (enum: beginner, intermediate, advanced)
├── duration_minutes (int)
├── description (text)
├── instructions (text[])
├── audio_url (varchar, nullable)
├── video_url (varchar, nullable)
├── image_url (varchar)
├── tags (varchar[])
├── target_symptoms (varchar[]) -- anxiety, depression, stress, insomnia, etc
├── is_premium (boolean)
└── created_at

-- Сессии выполнения техник
psychology_technique_sessions
├── id (uuid)
├── user_id (uuid)
├── technique_id (uuid)
├── started_at (timestamp)
├── completed_at (timestamp, nullable)
├── duration_seconds (int)
├── completion_rate (decimal 5,2) -- процент завершения
├── effectiveness_rating (int 1-10) -- насколько помогло
├── pre_stress_level (int 1-10)
├── post_stress_level (int 1-10)
├── notes (text)
└── mood_before (int 1-10)
└── mood_after (int 1-10)

-- ============================================
-- JOURNALING
-- ============================================

-- Дневник (разные типы)
psychology_journal_entries
├── id (uuid)
├── user_id (uuid)
├── entry_type (enum: free_form, gratitude, worry_dump, cognitive_restructuring, goal_setting, reflection)
├── title (varchar 255, nullable)
├── content (text)
├── ai_analysis (JSONB, nullable)
│   ├── sentiment_score (decimal 3,2) -- -1 to 1
│   ├── key_themes (varchar[])
│   ├── suggested_techniques (uuid[])
│   ├── cognitive_distortions_detected (varchar[])
│   └── ai_summary (text)
├── word_count (int)
├── writing_duration_minutes (int)
├── mood_before (int 1-10)
├── mood_after (int 1-10)
├── is_favorite (boolean)
├── is_shared_with_therapist (boolean)
└── created_at

-- ============================================
-- GOALS & THERAPY
-- ============================================

-- Цели ментального здоровья
psychology_goals
├── id (uuid)
├── user_id (uuid)
├── goal_type (enum: reduce_anxiety, improve_mood, better_sleep, increase_resilience, stress_management, build_confidence, overcome_phobia, other)
├── description (text)
├── target_metric (varchar 50) -- e.g., 'anxiety_level < 4'
├── current_baseline (int)
├── target_value (int)
├── deadline (date, nullable)
├── action_plan (text[])
├── progress_percent (int)
├── is_active (boolean)
└── achieved_at (timestamp, nullable)

-- Терапия (если работает с терапевтом)
psychology_therapy_sessions
├── id (uuid)
├── user_id (uuid)
├── therapist_id (uuid, nullable)
├── session_type (enum: in_person, video, text, group)
├── session_date (date)
├── topics_discussed (text[])
├── homework_assigned (text)
├── insights_gained (text)
├── mood_before (int 1-10)
├── mood_after (int 1-10)
├── notes (text)
└── created_at

-- ============================================
-- CRISIS & SAFETY
-- ============================================

-- Сигналы кризиса (для мониторинга)
psychology_crisis_flags
├── id (uuid)
├── user_id (uuid)
├── flag_type (enum: low_mood_streak, high_anxiety, suicidal_ideation, self_harm, isolation, sudden_change)
├── severity (enum: low, moderate, high, immediate)
├── trigger_data (JSONB) -- что вызвало
├── is_resolved (boolean)
├── resolved_at (timestamp)
├── resolution_notes (text)
└── created_at

-- Emergency contacts
psychology_emergency_contacts
├── id (uuid)
├── user_id (uuid)
├── contact_type (enum: therapist, psychiatrist, family, friend, crisis_line)
├── name (varchar 255)
├── phone (varchar 50)
├── email (varchar 255)
├── is_24_7 (boolean)
├── priority (int)
└── is_active (boolean)

-- ============================================
-- ANALYTICS & INSIGHTS
-- ============================================

-- Паттерны настроения
psychology_mood_patterns
├── id (uuid)
├── user_id (uuid)
├── pattern_name (varchar 255)
├── description (text)
├── pattern_type (enum: weekly_cycle, monthly_cycle, trigger_based, seasonal, improving, declining, stable)
├── confidence_score (decimal 3,2)
├── related_factors (JSONB) -- { sleep_correlation: 0.8, exercise_correlation: 0.6 }
├── discovered_at (timestamp)
└── is_active (boolean)

-- Корреляции с другими модулями
psychology_cross_correlations
├── id (uuid)
├── user_id (uuid)
├── correlation_type (enum: sleep_mood, exercise_mood, nutrition_mood, social_mood)
├── correlation_strength (decimal 3,2) -- -1 to 1
├── analysis_data (JSONB)
└── discovered_at (timestamp)

-- ============================================
-- AI & INSIGHTS
-- ============================================

psychology_ai_insights
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, achievement, crisis_alert, technique_suggestion)
├── title (varchar 255)
├── description (text)
├── related_entries (uuid[])
├── suggested_actions (JSONB[])
├── priority (enum: low, medium, high, critical)
├── is_read (boolean)
└── created_at
```

---

## 📱 UX/UI Design

### 1. Mood Quick Check-in
```
┌─────────────────────────────────────┐
│ 🧠 Как ты себя чувствуешь?          │
├─────────────────────────────────────┤
│                                     │
│ Общее настроение:                   │
│                                     │
│ 😢 1 ──●── 5 ────── 10 😄           │
│      Выбери...                      │
│                                     │
│ [😢] [😕] [😐] [🙂] [😄]             │
│                                     │
│ Что ты чувствуешь? (выбери все)     │
│ ┌─────────────────────────────────┐ │
│ │ 😊 Радость  😌 Спокойствие     │ │
│ │ 💪 Энергия  🤔 Задумчивость    │ │
│ │ 😰 Тревога  😴 Усталость       │ │
│ │ 😤 Раздражение  😔 Грусть      │ │
│ │ 🙏 Благодарность  🤩 Вдохновение│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Энергия:    [████████░░] 8/10       │
│ Стресс:     [████░░░░░░] 4/10       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💭 Добавить заметку (опционально)│ │
│ └─────────────────────────────────┘ │
│                                     │
│           [💾 Сохранить]            │
└─────────────────────────────────────┘
```

### 2. Mood Timeline
```
┌─────────────────────────────────────┐
│ 🧠 Настроение                 [📊]  │
├─────────────────────────────────────┤
│                                     │
│ Март 2026                           │
│                                     │
│ [КАЛЕНДАРЬ С ЦВЕТНЫМИ ТОЧКАМИ]     │
│ ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │
│ 🟢🟡🟢🟢🔴🟡🟢🟢🟢🟡🟢🟢🟢🟢🟡🟢   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Среднее настроение: 7.2/10 📈       │
│                                     │
│ 📊 За последние 30 дней:            │
│ • Лучший день: 9/10 (8 марта)       │
│ • Самый сложный: 3/10 (5 марта)     │
│ • Тренд: +12% к лучшему! 🎉         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📈 График настроения по часам   │ │
│ │ [ЛИНЕЙНЫЙ ГРАФИК СУТОЧНЫЙ]     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 AI: "Ты чаще чувствуешь себя    │
│ энергичным после утренних          │
│ тренировок (+2.3 балла)"           │
│                                     │
└─────────────────────────────────────┘
```

### 3. Techniques Library
```
┌─────────────────────────────────────┐
│ 🧘 Техники                       [🔍]│
├─────────────────────────────────────┤
│                                     │
│ Как ты себя чувствуешь сейчас?      │
│ [Тревожно 😰] [Устало 😴] [В стрессе]│
│                                     │
│ Рекомендовано для тебя:             │
│ ┌─────────────────────────────────┐ │
│ │ [🎵] Дыхание 4-7-8             │ │
│ │ ⭐ 4.8 • 5 мин • 12K использов.  │ │
│ │ Для: тревога, засыпание         │ │
│ │                                 │ │
│ │ [▶️ Начать]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Категории:                          │
│ [🫁 Дыхание] [🧘 Медитация]         │
│ [📝 CBT] [🌍 Grounding] [✨ Другое]  │
│                                     │
│ Популярные:                         │
│ ┌─────────────────────────────────┐ │
│ │ 🧘 Body Scan • 15 мин          │ │
│ │ 🫁 Box Breathing • 4 мин       │ │
│ │ 📝 Worry Time • 20 мин         │ │
│ │ ✨ Loving Kindness • 10 мин    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 AI: "Вчера это помогло снизить   │
│ тревогу с 7 до 3 за 10 минут"       │
└─────────────────────────────────────┘
```

### 4. Active Technique Session
```
┌─────────────────────────────────────┐
│ 🫁 Дыхание 4-7-8              ⏸️ ⏹️  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │      [АНИМАЦИЯ ДЫХАНИЯ]        │ │
│ │                                 │ │
│ │         🌬️                     │ │
│ │       (круг расширяется)        │ │
│ │                                 │ │
│ │      ВДОХ ••••                 │ │
│ │      (4 секунды)               │ │
│ │                                 │ │
│ │         [======    ]           │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Прогресс: [████████░░] 2/3 цикла    │
│                                     │
│ Инструкция:                         │
│ 1. Вдох носом - 4 сек               │
│ 2. Задержка - 7 сек                 │
│ 3. Выдох ртом - 8 сек               │
│                                     │
│ 🎵 [🔊] Звуки природы               │
│                                     │
│ ⏱️ Осталось: 3 мин 24 сек           │
└─────────────────────────────────────┘
```

### 5. Assessment Results
```
┌─────────────────────────────────────┐
│ 📋 Опросник GAD-7                   │
├─────────────────────────────────────┤
│                                     │
│ Результаты от 15 марта 2026         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │       [СЕМИЦВЕТНАЯ ШКАЛА]      │ │
│ │                                 │ │
│ │         8 / 21                  │ │
│ │                                 │ │
│ │    ●────┼────┼────┼────┼──●    │ │
│ │    Легкое  Умеренное Тяжелое    │ │
│ │                                 │ │
│ │      Легкая тревожность         │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 Сравнение:                       │
│ Сегодня:  8                         │
│ Неделю назад: 11 ↓                  │
│ Месяц назад: 14 ↓↓                  │
│                                     │
│ Тренд: Улучшение! 🎉                │
│                                     │
│ 💡 Рекомендации:                    │
│ • Продолжай практиковать техники    │
│   дыхания (помогает в 87% случаев)  │
│ • Рассмотри консультацию если       │
│   поднимется выше 10                │
│                                     │
│ [🧘 Техники] [👨‍⚕️ Специалисты]       │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:

1. **Sleep:**
   - Плохой сон → Настроение ↓
   - Настроение плохое → Сон хуже
   - Deep sleep → Восстановление эмоций

2. **Movement:**
   - Тренировка → Эндорфины → Настроение ↑
   - Streak → Чувство достижения
   - Пропуск → Вина (если негативно)

3. **Nutrition:**
   - Сахар/фастфуд → Кратковременное улучшение, потом спад
   - Дефицит омега-3 → Депрессия
   - Триптофан → Серотонин

4. **Medicine:**
   - Антидепрессанты → Mood tracking
   - Терапия → Заметки/домашка
   - Побочки → Корректировка

5. **Relationships:**
   - Конфликты → Стресс ↑
   - Поддержка → Резилиенс ↑
   - Одиночество → Депрессия

---

## 📊 Ежедневные метрики

1. **Общее настроение** - 1-10
2. **Энергия** - 1-10
3. **Стресс** - 1-10
4. **Тревога** - 1-10
5. **Концентрация** - 1-10
6. **Эмоции** - мультивыбор
7. **Контекст** - где/с кем
8. **Триггер** - что вызвало

### Еженедельные:
9. **Опросники** - PHQ-9, GAD-7
10. **Паттерны** - тренды настроения

---

## 🤖 AI Features

### 1. Mood Prediction
- "Завтра настроение может быть ниже
  из-за предстоящей презентации"

### 2. Crisis Detection
- Мониторинг: low streak, suicidal ideation
- Автоматические рекомендации
- Emergency contact suggestions

### 3. Pattern Recognition
- "Каждый понедельник тревога выше"
- "После звонков маме настроение ↓"
- "Тренировки улучшают настроение на 2.3 балла"

### 4. Technique Recommendation
- "Попробуй дыхание 4-7-8 - в прошлый раз
  помогло снизить тревогу с 8 до 3"

### 5. Journal Analysis
- AI анализирует записи
- Выявляет когнитивные искажения
- Suggests CBT techniques

---

## ✅ Implementation Checklist

### Phase 1: Core
- [ ] Mood entry
- [ ] Basic stats
- [ ] Simple techniques

### Phase 2: Advanced
- [ ] Assessments (PHQ-9, GAD-7)
- [ ] Pattern analysis
- [ ] AI insights
- [ ] Crisis detection

### Phase 3: Professional
- [ ] Therapist integration
- [ ] Journal AI analysis
- [ ] Emergency contacts

---

**Готово к разработке!** 🧠
