# Module 6: RELATIONSHIPS (Отношения)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Контакты** - Учет важных людей, их значимость
2. **Взаимодействия** - Качество и частота общения
3. **Анализ** - Баланс, проблемные зоны, улучшения
4. **Развитие** - Советы, чек-ины, упражнения

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Контакты
-- ============================================

-- Важные люди в жизни пользователя
relationships_contacts
├── id (uuid)
├── user_id (uuid)
├── name (varchar 255)
├── relationship_type (enum: family, partner, friend, colleague, mentor, acquaintance, other)
├── relationship_subtype (varchar 50) -- mother, father, sibling, spouse, best_friend, etc
├── importance_level (int 1-10) -- насколько важен
├── intimacy_level (int 1-10) -- насколько близок
├── stress_level (int 1-10) -- насколько стрессовые отношения
├── satisfaction_level (int 1-10) -- насколько удовлетворен
├── contact_frequency_goal (enum: daily, few_times_week, weekly, biweekly, monthly, quarterly, as_needed)
├── preferred_contact_methods (varchar[]) -- call, text, video, in_person, social_media
├── birthday (date, nullable)
├── anniversary (date, nullable)
├── key_memories (text[])
├── shared_interests (varchar[])
├── photo_url (varchar)
├── notes (text)
├── is_active (boolean)
└── created_at

-- Контактная информация
relationships_contact_details
├── id (uuid)
├── contact_id (uuid)
├── detail_type (enum: phone, email, address, social_media, messenger, other)
├── label (varchar 50) -- home, work, personal
├── value (varchar 255)
├── is_primary (boolean)
└── is_active (boolean)

-- ============================================
-- INTERACTIONS
-- ============================================

-- Взаимодействия (общения)
relationships_interactions
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid)
├── interaction_type (enum: call, video_call, text_message, voice_message, in_person, social_media, email, letter, other)
├── initiated_by (enum: me, them, mutual)
├── start_time (timestamp)
├── end_time (timestamp, nullable)
├── duration_minutes (int, nullable)
├── quality_rating (int 1-10) -- как прошло
├── energy_change (int -5 to +5) -- +5 = зарядился энергией, -5 = истощен
├── mood_before (int 1-10)
├── mood_after (int 1-10)
├── topics_discussed (text[])
├── was_supportive (boolean) -- получил/дал поддержку
├── had_conflict (boolean)
├── conflict_resolution (enum: resolved, ongoing, avoided, not_discussed)
├── location (varchar 255)
├── occasion (varchar 255) -- birthday, casual, planned_meeting
├── follow_up_needed (boolean)
├── follow_up_notes (text)
├── photos (varchar[])
└── notes (text)

-- Планируемые взаимодействия
relationships_planned_interactions
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid)
├── planned_type (enum: call, meet, celebrate, gift, support, other)
├── scheduled_date (date)
├── scheduled_time (time, nullable)
├── occasion (varchar 255)
├── preparation_needed (text)
├── reminder_enabled (boolean)
├── reminder_time (timestamp)
├── is_completed (boolean)
├── completed_interaction_id (uuid, nullable)
└── notes (text)

-- ============================================
-- QUALITY & ASSESSMENTS
-- ============================================

-- Оценки отношений
relationships_assessments
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid)
├── assessment_date (date)
├── overall_satisfaction (int 1-10)
├── communication_quality (int 1-10)
├── trust_level (int 1-10)
├── support_received (int 1-10)
├── support_given (int 1-10)
├── conflict_frequency (enum: never, rarely, sometimes, often, constantly)
├── conflict_resolution_quality (int 1-10)
├── shared_values_alignment (int 1-10)
├── future_outlook (enum: improving, stable, declining, uncertain)
├── strength_areas (text[])
├── growth_areas (text[])
└── notes (text)

-- Love Languages (для близких отношений)
relationships_love_languages
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid)
├── my_love_language (enum: words_of_affirmation, acts_of_service, receiving_gifts, quality_time, physical_touch)
├── their_love_language_guess (enum) -- что думает пользователь
├── their_confirmed_love_language (enum, nullable) -- если обсуждали
├── my_satisfaction_giving (int 1-10) -- удовлетворенность от "давать"
├── my_satisfaction_receiving (int 1-10) -- удовлетворенность от "получать"
└── notes (text)

-- ============================================
-- BOUNDARIES & PATTERNS
-- ============================================

-- Границы в отношениях
relationships_boundaries
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid)
├── boundary_type (enum: time, emotional, physical, digital, financial, other)
├── boundary_description (text)
├── is_communicated (boolean) -- озвучена ли граница
├── is_respected (enum: always, usually, sometimes, rarely, never)
├── enforcement_needed (text)
└── created_at

-- Паттерны в отношениях
relationships_patterns
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid, nullable) -- если общий паттерн
├── pattern_name (varchar 255)
├── pattern_type (enum: positive, negative, neutral, toxic, growth)
├── description (text)
├── trigger_situations (text[])
├── my_typical_response (text)
├── their_typical_response (text)
├── desired_change (text)
├── action_plan (text)
├── is_active (boolean)
└── discovered_at (timestamp)

-- ============================================
-- SOCIAL CIRCLE ANALYSIS
-- ============================================

-- Анализ социального круга
relationships_social_circle_analysis
├── id (uuid)
├── user_id (uuid)
├── analysis_date (date)
├── total_active_contacts (int)
├── avg_interaction_frequency_days (decimal 4,1)
├── relationship_distribution (JSONB) -- { family: 5, friends: 8, colleagues: 12 }
├── satisfaction_by_category (JSONB)
├── energy_balance (int -100 to +100) -- сумма energy_change
├── support_network_strength (int 1-10)
├── isolation_risk_score (int 1-10)
├── diversity_score (int 1-10) -- разнообразие контактов
├── reciprocity_score (int 1-10) -- баланс давать/получать
└── ai_insights (text[])

-- ============================================
-- GOALS & EXERCISES
-- ============================================

-- Цели по отношениям
relationships_goals
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid, nullable) -- конкретный человек или общая цель
├── goal_type (enum: improve_communication, spend_more_time, resolve_conflict, build_trust, deepen_intimacy, set_boundaries, reconnect, maintain, let_go)
├── description (text)
├── specific_actions (text[])
├── target_date (date, nullable)
├── progress_percent (int)
├── is_achieved (boolean)
└── created_at

-- Упражнения для отношений
relationships_exercises
├── id (uuid)
├── name (varchar 255)
├── category (enum: communication, appreciation, conflict_resolution, intimacy, trust_building, boundary_setting, forgiveness)
├── description (text)
├── instructions (text[])
├── duration_minutes (int)
├── is_for_couples (boolean)
├── is_for_families (boolean)
├── is_for_friends (boolean)
└── created_at

-- Выполненные упражнения
relationships_exercise_sessions
├── id (uuid)
├── user_id (uuid)
├── contact_id (uuid, nullable) -- с кем делал
├── exercise_id (uuid)
├── completed_at (timestamp)
├── effectiveness_rating (int 1-10)
├── notes (text)
└── would_repeat (boolean)

-- ============================================
-- AI & INSIGHTS
-- ============================================

relationships_ai_insights
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, celebration, connection_reminder, balance_alert)
├── title (varchar 255)
├── description (text)
├── related_contact_id (uuid, nullable)
├── priority (enum: low, medium, high)
├── suggested_action (text)
├── is_read (boolean)
└── created_at
```

---

## 📱 UX/UI Design

### 1. Relationships Dashboard
```
┌─────────────────────────────────────┐
│ 👥 Отношения                  [⚙️]  │
├─────────────────────────────────────┤
│                                     │
│ [🔥 5 дней подряд чек-инов]         │
│                                     │
│ 📊 Мой социальный круг:             │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │    [КРУГОВАЯ ДИАГРАММА]        │ │
│ │                                 │ │
│ │    ● Мама (близко)              │ │
│ │    ● Партнер (очень близко)     │ │
│ │    ● Друг Алекс (нужно вним.)   │ │
│ │    ● Коллеги (поверхностно)     │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💚 Баланс энергии: +15              │
│ Отношения заряжают                  │
│                                     │
│ 📅 Сегодня:                         │
│ 🎂 День рождения: Лена              │
│ [🎁 Идеи подарков] [💬 Написать]    │
│                                     │
│ ⚠️ Требуют внимания:                │
│ • Папа - не звонил 2 недели         │
│ • Катя - конфликт не разрешен       │
│                                     │
│ [👥 Все контакты] [📊 Анализ]       │
└─────────────────────────────────────┘
```

### 2. Contact Detail
```
┌─────────────────────────────────────┐
│ ← Мама                              │
├─────────────────────────────────────┤
│                                     │
│ [📷 ФОТО]                           │
│ Мама                                │
│ Семья • Мать                        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⭐ Важность: 10/10              │ │
│ │ 💕 Близость: 9/10               │ │
│ │ 😊 Удовлетворенность: 8/10      │ │
│ │ ⚡ Энергия: +3 (в среднем)      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 Статистика:                      │
│ • Звонки: 2.3/неделю               │
│ • Последний: 3 дня назад            │
│ • Средняя длительность: 45 мин      │
│ • Качество: 9/10                    │
│                                     │
│ 📝 Последние взаимодействия:        │
│ ┌─────────────────────────────────┐ │
│ │ 📞 12 марта • 52 мин           │ │
│ │    Темы: здоровье, работа       │ │
│ │    Настроение: +2               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 AI: "Мама звонит чаще когда      │
│ у нее тревога. Спроси как она."     │
│                                     │
│ [📞 Позвонить] [💬 Написать]        │
│ [📅 Запланировать]                  │
└─────────────────────────────────────┘
```

### 3. Interaction Logger
```
┌─────────────────────────────────────┐
│ ← Записать взаимодействие           │
├─────────────────────────────────────┤
│                                     │
│ С кем: Мама                    [🔄] │
│                                     │
│ Тип: [📞 Звонок ▼]                  │
│                                     │
│ Когда: Сегодня, 15:30               │
│                                     │
│ Длительность: 52 мин                │
│                                     │
│ Кто начал: (•) Я  ( ) Она           │
│                                     │
│ Как прошло?                         │
│                                     │
│ Качество:                           │
│ 😞 1 ────●──── 10 😄                 │
│                                      │
│ Энергия после:                      │
│ 😫 -5 ───●─── +5 😃                  │
│       +2 (вдохновлен)               │
│                                     │
│ Темы:                               │
│ [здоровье] [работа] [дети] [+]      │
│                                     │
│ Было поддержкой? [✓]                │
│ Конфликт? [ ]                       │
│                                     │
│ Заметки:                            │
│ Обсудили ее визит к врачу...        │
│                                     │
│        [💾 Сохранить]               │
└─────────────────────────────────────┘
```

### 4. Social Balance
```
┌─────────────────────────────────────┐
│ ⚖️ Баланс отношений                 │
├─────────────────────────────────────┤
│                                     │
│ 📊 Распределение энергии:           │
│                                     │
│ [КРУГОВАЯ ДИАГРАММА ДАЕТ/ПОЛУЧАЕТ]  │
│                                     │
│ Даю энергии:  ████████████  65%     │
│ Получаю:      ██████░░░░░░  35%     │
│ ⚠️ Дисбаланс в сторону отдачи       │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ По категориям:                      │
│                                     │
│ Семья     ████████████  +25         │
│ Друзья    ██████░░░░░░  +8          │
│ Работа    ████░░░░░░░░  -5          │
│ Партнер   ██████████░░  +18         │
│                                     │
│ ⚠️ Внимание:                        │
│ Рабочие отношения истощают          │
│                                     │
│ 💡 Рекомендация:                    │
│ "Попробуй ограничить общение с      │
│ коллегой Иваном - он забирает       │
│ много энергии без отдачи"           │
│                                     │
│ [📋 Упражнения по балансу]          │
└─────────────────────────────────────┘
```

### 5. Connection Reminders
```
┌─────────────────────────────────────┐
│ 🔔 Напоминания о связи              │
├─────────────────────────────────────┤
│                                     │
│ Сегодня рекомендуется связаться с:  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👴 Папа                        │ │
│ │ Не звонил 14 дней              │ │
│ │ Цель: раз в неделю             │ │
│ │                                 │ │
│ │ [📞 Позвонить] [⏰ Напомнить]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👩‍❤️‍👨 Партнер                    │ │
│ │ Quality time давно не было     │ │
│ │ Последнее свидание: 2 недели   │ │
│ │                                 │ │
│ │ [💡 Идеи свиданий] [📅 В план] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Ближайшие события:                  │
│ 🎂 18 мар - День рождения Лены      │
│ 💐 8 мар - прошло (не поздравил!)   │
│                                     │
│ [📅 Календарь событий]              │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:

1. **Psychology:**
   - Конфликты → Стресс ↑
   - Поддержка → Резилиенс ↑
   - Одиночество → Депрессия
   - Качество связи → Настроение

2. **Sleep:**
   - Ссоры → Проблемы со сном
   - Поддержка партнера → Сон лучше

3. **Movement:**
   - Совместные тренировки → Близость ↑
   - Спорт с друзьями → Мотивация ↑

4. **Habits:**
   - Ежедневные чек-ины → Привычка связи
   - Date nights → Планирование

---

## 📊 Ежедневные метрики

1. **Взаимодействия** - кто, тип, качество
2. **Энергия** - +/- от общения
3. **Важные даты** - дни рождения, годовщины
4. **Чек-ин** - как чувствую отношения

### Еженедельные:
5. **Баланс** - даю vs получаю
6. **Частота** - цель vs факт
7. **Удовлетворенность** - по контактам

---

## 🤖 AI Features

### 1. Connection Pattern Analysis
- "Ты звонишь маме чаще когда сам тревожен"
- "Во вторник энергия после работы ниже - лучше не планировать важные разговоры"

### 2. Relationship Balance Alert
- "Отношения с Иваном дают -3 энергии в среднем"
- "Рекомендую поставить границы"

### 3. Smart Reminders
- "14 дней не звонил папе - цель: раз в неделю"
- "Завтра день рождения Лены"

### 4. Quality Suggestions
- "С партнером последний quality time 2 недели назад"
- Идеи для свиданий

### 5. Toxic Pattern Detection
- "Заметил паттерн: после встреч с коллегой X ты чувствуешь себя хуже"
- Предложение action plan

---

## ✅ Implementation Checklist

### Phase 1: Core
- [ ] Contacts management
- [ ] Interaction logging
- [ ] Basic stats

### Phase 2: Smart Features
- [ ] Balance analysis
- [ ] Reminders
- [ ] AI insights

### Phase 3: Advanced
- [ ] Assessments
- [ ] Exercises
- [ ] Pattern recognition

---

**Готово к разработке!** 👥
