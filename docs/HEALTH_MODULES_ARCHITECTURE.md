# Архитектура модулей здоровья EthoLife
## Полная спецификация 7 модулей

**Версия:** 2.0  
**Дата:** 01.03.2026  
**Цель:** Полнофункциональные модули с единой экосистемой

---

## 📊 Общая концепция

### Принципы дизайна:
1. **2-tap rule** - Любое действие за 2 нажатия
2. **Daily focus** - Ежедневные метрики на виду
3. **Contextual AI** - AI рекомендации на основе всех модулей
4. **Progressive disclosure** - Просто для новичков, глубоко для продвинутых
5. **Cross-module insights** - Взаимосвязи между модулями

### Единые сущности (Shared):
```
User Health Profile
├── Baseline Metrics (вес, рост, возраст, пол)
├── Goals (по всем модулям)
├── Restrictions (аллергии, травмы, болезни)
├── Preferences (веган, кошер, etc)
└── Daily Streaks (непрерывность использования)
```

---

## 🗄️ Общая структура БД

### Core Tables:
```sql
-- Профиль здоровья пользователя
health_profiles
├── user_id
├── birth_date, gender, blood_type
├── height_cm, current_weight_kg
├── activity_level (sedentary/light/moderate/active/very_active)
├── medical_conditions[]
├── allergies[]
├── medications[]
├── goal_weight_kg, goal_timeline
└── created_at, updated_at

-- Ежедневная сводка (универсальная)
daily_health_snapshots
├── user_id, date
├── overall_score (0-100)
├── module_scores (JSON: {nutrition: 85, sleep: 70...})
├── ai_insights[]
└── streak_data

-- Связи между модулями (cross-module correlations)
health_correlations
├── user_id
├── metric_1 (module + metric_name)
├── metric_2 (module + metric_name)
├── correlation_strength (-1 to 1)
├── ai_discovered_at
└── insight_text
```

---

## 🔄 Взаимосвязи модулей (Cross-Module Logic)

### Корреляции для AI:
```
Nutrition × Sleep: 
  - Ужин поздно → Качество сна ↓
  - Кофеин после 16:00 → Время засыпания ↑

Sleep × Psychology:
  - Сон < 6ч → Уровень тревожности ↑
  - Deep sleep ↓ → Усталость ↑

Movement × Nutrition:
  - Тренировка → Необходимость белка ↑
  - Дефицит калорий → Сила ↓

Medicine × All modules:
  - Антидепрессанты → Сон/Аппетит изменения
  - Терапия → Корректировка всех метрик

Relationships × Psychology:
  - Конфликты → Стресс ↑ → Сон ↓
  - Поддержка → Ментальное здоровье ↑
```

---

## 📱 UX/UI Паттерны для всех модулей

### 1. Daily Quick View (Dashboard):
```
┌─────────────────────────────────────┐
│ 🌅 Доброе утро, Алекс!              │
│ Сегодня: 15 марта                   │
│                                     │
│ [🔥 Streak: 12 дней]                │
│                                     │
│ ┌──────┬──────┬──────┬──────┐      │
│ │ 🍎   │ 🏃   │ 😴   │ 🧠   │      │
│ │ 85%  │ 60%  │ 90%  │ 75%  │      │
│ └──────┴──────┴──────┴──────┘      │
│                                     │
│ 💡 AI: "Отличный сон! Добавь       │
│    белка на завтрак для восстанов."│
└─────────────────────────────────────┘
```

### 2. Module Detail View:
```
┌─────────────────────────────────────┐
│ ← Назад    🍎 Питание     [⋮]      │
├─────────────────────────────────────┤
│                                     │
│ [КРУГОВАЯ ДИАГРАММА ДНЯ]            │
│                                     │
│ Калории: 1,450 / 2,000              │
│ ████████████░░░░░░ 72%              │
│                                     │
│ Макросы:                            │
│ Белки  ████████░░░ 80% ✓            │
│ Жиры   ██████░░░░░ 60%              │
│ Углев. █████░░░░░░ 50%              │
│                                     │
│ [+ БЫСТРОЕ ДОБАВЛЕНИЕ]              │
│                                     │
│ 📊 Сегодня:                         │
│ • Завтрак: Овсянка (350 ккал) ✓     │
│ • Обед:     ...                     │
│ • Ужин:     ...                     │
│                                     │
│ 🎯 План на завтра:                  │
│ Увеличьте белок на 20г              │
└─────────────────────────────────────┘
```

### 3. Data Entry Patterns:
- **One-tap logging:** Избранные продукты/активности
- **Voice input:** "Я съел греческий салат"
- **Photo AI:** Сканирование еды/документов
- **Smart suggestions:** "Вы обычно завтракаете в 8:00"

---

## 📊 Метрики и KPI по модулям

### Universal Metrics (все модули):
1. **Daily Score** (0-100) - комплексная оценка дня
2. **Streak** - дней подряд с заполненными данными
3. **Adherence** - % выполнения плана
4. **Trend (7d, 30d, 90d)** - динамика
5. **AI Predictions** - прогнозы на основе данных

### Module-Specific Metrics:
| Модуль | Key Metrics | Ввод | Авто |
|--------|-------------|------|------|
| Nutrition | Калории, макросы, вода, вес | 3-5x/день | Фото AI |
| Movement | Шаги, тренировки, пульс | 1-2x/день | Wearables |
| Sleep | Длительность, фазы, качество | - | Телефон/часы |
| Psychology | Настроение, стресс, дневник | 1-2x/день | Опросники |
| Medicine | Таблетки, симптомы, анализы | По событию | Напоминания |
| Relationships | Общение, качество контактов | 1x/день | - |
| Habits | Выполнение, цепочки | Ежедневно | Check-ins |

---

## 🤖 AI Integration Points

### Для каждого модуля AI должен:
1. **Анализировать** паттерны и тренды
2. **Предсказывать** проблемы (burnout, болезнь, etc)
3. **Рекомендовать** корректировки
4. **Генерировать** персональные планы
5. **Связывать** данные между модулями

### Пример AI Insight:
```
"Заметил паттерн: после тренировок (Movement) ты ешь 
на 30% меньше белка (Nutrition), чем нужно. 
Это может замедлить восстановление. 

Рекомендация: Добавь протеиновый коктейль 
в течение 30 минут после тренировки."
```

---

## 📋 Структура доработки модулей

Для каждого модуля создаем:

### 1. Database Schema
- Таблицы для метрик
- Таблицы для планов/целей
- Таблицы для истории
- Индексы для поиска

### 2. Backend API
- CRUD endpoints
- AI integration
- Analytics endpoints
- Import/Export

### 3. Frontend Components
- Quick Daily View
- Detailed Dashboard
- Data Entry Forms
- History & Trends
- Settings & Plans

### 4. Mobile Optimization
- Swipe gestures
- Offline mode
- Push notifications
- Widget support

---

## 🎯 Порядок доработки

Приоритет (по важности для пользователей):
1. **Nutrition** - Частый ввод, высокий retention
2. **Movement** - Автоматика + wearables
3. **Sleep** - Passive tracking, high value
4. **Psychology** - Growing need, good engagement
5. **Habits** - Supports all other modules
6. **Medicine** - Critical when needed
7. **Relationships** - Unique differentiator

Начинаем с Nutrition как самого сложного и важного.
