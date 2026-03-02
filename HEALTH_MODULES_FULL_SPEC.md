# 🏥 Health Modules - Полная Спецификация Функций

**Версия:** 7.0  
**Дата:** 2026-03-02  
**Статус:** План реализации

---

## 📋 Структура каждого модуля

Каждый из 7 модулей здоровья включает:

1. **Dashboard** - главная страница с метриками
2. **Tracking** - ежедневное отслеживание
3. **Goals & Plans** - цели и программы
4. **Analytics** - аналитика и отчеты
5. **Library** - база знаний
6. **Tools** - инструменты
7. **Settings** - настройки

---

## 1. 🥗 NUTRITION (Питание)

### 1.1 Dashboard Widget

**Функции:**
- Калории сегодня (прогресс бар к цели)
- БЖУ распределение (круговая диаграмма)
- Вода (стаканы/литры)
- Время до следующего приема пищи
- Быстрые действия (добавить еду, воду)

**UX/UI:**
- Цветовая схема: Green/Emerald
- Иконки: Apple, Utensils, Droplets
- Анимации: прогресс бары, pulse эффекты

### 1.2 Daily Tracking

**Функции:**
```
├── Meal Logger (4 приема пищи)
│   ├── Breakfast
│   ├── Lunch
│   ├── Dinner
│   └── Snacks
│
├── Food Entry
│   ├── Search database (10,000+ продуктов)
│   ├── Barcode scanner
│   ├── Photo recognition (AI)
│   ├── Manual entry (калории, БЖУ)
│   ├── Portion calculator
│   └── Quick add (избранное)
│
├── Water Tracker
│   ├── Add water (быстро: 250ml, 500ml)
│   ├── Custom amount
│   ├── Daily goal progress
│   └── Reminders
│
└── Macros Breakdown
    ├── Protein (г, %, ккал)
    ├── Carbs (г, %, ккал)
    ├── Fat (г, %, ккал)
    ├── Fiber (г)
    ├── Sugar (г)
    └── Sodium (мг)
```

**База продуктов:**
- Источники: USDA, OpenFoodFacts (бесплатные API)
- Формат: JSON (текстовые данные)
- Поля: name, calories, protein, carbs, fat, fiber, serving_size, barcode
- Локализация: RU/EN

### 1.3 Goals & Plans

**Функции:**
```
├── Calorie Goal Calculator
│   ├── BMR расчет (Mifflin-St Jeor)
│   ├── TDEE расчет (активность)
│   ├── Цель (похудение/набор/поддержание)
│   └── Персональная норма ккал
│
├── Macro Calculator
│   ├── Пропорции БЖУ
│   ├── Под диету (keto, paleo, vegan)
│   └── Автоматический расчет
│
├── Meal Plans (AI-generated)
│   ├── 7-day plans
│   ├── Shopping list
│   ├── Recipes
│   └── Prep instructions
│
└── Diet Preferences
    ├── Allergies
    ├── Restrictions (vegetarian, vegan)
    ├── Dislikes
    └── Favorite foods
```

### 1.4 Analytics

**Функции:**
```
├── Weekly/Monthly Trends
│   ├── Calories (line chart)
│   ├── Macros (stacked bar)
│   ├── Water intake
│   └── Weight correlation
│
├── Insights
│   ├── Average calories
│   ├── Macro balance score
│   ├── Eating patterns
│   └── Recommendations
│
└── Reports
    ├── PDF export
    ├── Share with specialist
    └── Print
```

### 1.5 Library

**Контент:**
```
├── Recipes Database
│   ├── Healthy recipes (1000+)
│   ├── Filter by calories, macros
│   ├── Cooking time
│   └── Difficulty
│
├── Nutrition Guides
│   ├── Macronutrients 101
│   ├── Micronutrients guide
│   ├── Portion sizes
│   └── Meal timing
│
├── Food Database
│   ├── Searchable (10,000+ items)
│   ├── Categorized
│   └── Nutritional info
│
└── Articles
    ├── Healthy eating tips
    ├── Myth busters
    └── Latest research
```

**Источники:**
- Рецепты: OpenRecipeDB (бесплатно)
- Статьи: PubMed API (научные)
- Формат: Markdown/JSON

### 1.6 Tools

**Инструменты:**
```
├── Barcode Scanner
├── Photo Food Recognition (AI)
├── Portion Size Calculator
├── Recipe Nutrition Calculator
├── Meal Prep Planner
├── Grocery List Generator
└── Restaurant Guide (healthy options)
```

### 1.7 Settings

**Настройки:**
```
├── Goals
│   ├── Daily calories
│   ├── Macro ratios
│   └── Water goal
│
├── Preferences
│   ├── Measurement units (g/oz)
│   ├── Meal times
│   └── Reminders
│
└── Integrations
    ├── Apple Health
    ├── Google Fit
    └── MyFitnessPal
```

---

## 2. 💪 MOVEMENT (Движение)

### 2.1 Dashboard Widget

**Функции:**
- Шаги сегодня (прогресс к 10,000)
- Активные минуты
- Калории сожжены
- Пройденная дистанция
- Быстрые действия (начать тренировку)

**UX/UI:**
- Цвет: Blue
- Иконки: Activity, Dumbbell, Footprints
- Анимации: step counter, circular progress

### 2.2 Daily Tracking

**Функции:**
```
├── Steps Tracker
│   ├── Real-time step count
│   ├── Hourly breakdown
│   ├── Goal progress
│   └── Auto-sync (wearables)
│
├── Workout Logger
│   ├── Quick add workout
│   ├── Exercise details
│   ├── Sets/reps/weight
│   ├── Duration
│   └── Calories burned
│
├── Activity Minutes
│   ├── Light activity
│   ├── Moderate activity
│   └── Vigorous activity
│
└── Distance Tracker
    ├── Running
    ├── Cycling
    └── Walking
```

### 2.3 Exercise Library

**База упражнений:**
```
├── By Muscle Group
│   ├── Chest
│   ├── Back
│   ├── Legs
│   ├── Shoulders
│   ├── Arms
│   └── Core
│
├── By Equipment
│   ├── Bodyweight
│   ├── Dumbbells
│   ├── Barbells
│   ├── Machines
│   └── Resistance bands
│
├── By Difficulty
│   ├── Beginner
│   ├── Intermediate
│   └── Advanced
│
└── Exercise Details
    ├── Name (RU/EN)
    ├── Description
    ├── Video demo (URL)
    ├── Muscles worked
    ├── Tips
    └── Common mistakes
```

**Источники:**
- ExerciseDB API (бесплатно, 1300+ упражнений)
- Формат: JSON с GIF/видео ссылками
- Локализация: RU/EN

### 2.4 Workout Plans

**Функции:**
```
├── Pre-made Programs
│   ├── Weight Loss (4 weeks)
│   ├── Muscle Gain (8 weeks)
│   ├── Strength (12 weeks)
│   ├── Home Workout (no equipment)
│   └── Beginner Program
│
├── Custom Plans (AI-generated)
│   ├── Based on goals
│   ├── Available equipment
│   ├── Time availability
│   └── Fitness level
│
├── Workout Player
│   ├── Exercise list
│   ├── Timer
│   ├── Rest timer
│   ├── Video demos
│   └── Log sets/reps
│
└── Progress Tracking
    ├── Weight lifted
    ├── Volume
    ├── PRs (personal records)
    └── Strength curves
```

### 2.5 Analytics

**Функции:**
```
├── Activity Trends
│   ├── Steps (weekly/monthly)
│   ├── Workouts completed
│   ├── Active minutes
│   └── Calories burned
│
├── Performance Metrics
│   ├── Strength progress
│   ├── Endurance improvement
│   └── Volume analysis
│
├── Body Metrics
│   ├── Weight
│   ├── Body fat %
│   ├── Muscle mass
│   └── Measurements
│
└── Insights
    ├── Activity score
    ├── Consistency
    └── Recommendations
```

### 2.6 Tools

**Инструменты:**
```
├── Workout Timer (Tabata, HIIT)
├── Rest Timer
├── 1RM Calculator
├── BMI Calculator
├── Body Fat Calculator
├── TDEE Calculator
├── Posture Analysis (Webcam AI)
└── Form Check (Video AI)
```

### 2.7 Library

**Контент:**
```
├── Exercise Guides
├── Workout Programs
├── Training Principles
├── Recovery Guides
├── Injury Prevention
└── Nutrition for Athletes
```

### 2.8 Settings

**Настройки:**
```
├── Goals
│   ├── Daily steps
│   ├── Weekly workouts
│   └── Target weight
│
├── Preferences
│   ├── Preferred workout time
│   ├── Equipment available
│   └── Workout types
│
└── Integrations
    ├── Apple Health
    ├── Google Fit
    ├── Fitbit
    ├── Garmin
    ├── Strava
    └── Oura
```

---

## 3. 😴 SLEEP (Сон)

### 3.1 Dashboard Widget

**Функции:**
-昨晚睡眠时长
- 睡眠质量评分
- 就寝/起床时间
- 睡眠阶段（深睡、浅睡、REM）
- 快速操作（记录睡眠）

**UX/UI:**
- 颜色：紫色
- 图标：月亮、星星
- 动画：渐变效果、脉冲

### 3.2 Sleep Tracking

**Функции:**
```
├── Sleep Logger
│   ├── Bedtime
│   ├── Wake time
│   ├── Sleep duration
│   └── Sleep quality (1-10)
│
├── Sleep Stages (AI estimation)
│   ├── Deep sleep
│   ├── Light sleep
│   ├── REM sleep
│   └── Awake time
│
├── Sleep Factors
│   ├── Caffeine intake
│   ├── Exercise timing
│   ├── Screen time
│   ├── Stress level
│   └── Room temperature
│
└── Smart Alarm
    ├── Wake up window
    ├── Gentle vibration
    └── Sleep phase detection
```

### 3.3 Sleep Programs

**Функции:**
```
├── Sleep Improvement Plans
│   ├── 7-day Sleep Reset
│   ├── Insomnia Program
│   ├── Jet Lag Recovery
│   └── Shift Worker Plan
│
├── Bedtime Routines
│   ├── Wind-down activities
│   ├── Relaxation techniques
│   └── Sleep hygiene tips
│
└── Sound Library
    ├── White noise
    ├── Nature sounds
    ├── Binaural beats
    └── Guided sleep meditations
```

### 3.4 Analytics

**Функции:**
```
├── Sleep Trends
│   ├── Duration (weekly/monthly)
│   ├── Quality score
│   ├── Consistency
│   └── Sleep debt
│
├── Correlation Analysis
│   ├── Exercise vs sleep
│   ├── Caffeine vs sleep
│   ├── Stress vs sleep
│   └── Screen time vs sleep
│
└── Insights
    ├── Sleep score
    ├── Recommendations
    └── Health impact
```

### 3.5 Library

**Контент:**
```
├── Sleep Science
├── Sleep Hygiene Guide
├── Dream Interpretation
├── Meditation for Sleep
└── Research Articles
```

### 3.6 Tools

**Инструменты:**
```
├── Sleep Calculator (optimal wake time)
├── Nap Calculator
├── Caffeine Calculator
├── Sleep Environment Checker
└── Breathing Exercises (4-7-8)
```

### 3.7 Settings

**Настройки:**
```
├── Sleep Goals
│   ├── Target duration
│   ├── Bedtime reminder
│   └── Wake up goal
│
├── Smart Alarm
│   ├── Enable/disable
│   ├── Wake window
│   └── Sound selection
│
└── Integrations
    ├── Apple Health
    ├── Oura Ring
    ├── Whoop
    └── Sleep Cycle
```

---

## 4. 🧠 PSYCHOLOGY (Психология)

### 4.1 Dashboard Widget

**Функции:**
- Настроение сегодня (1-10)
- Уровень стресса
- Тревожность
- Быстрые действия (записать настроение, медитация)

**UX/UI:**
- Цвет: Amber/Pink
- Иконки: Brain, Smile, Heart
- Анимации: mood emoji transitions

### 4.2 Mood Tracking

**Функции:**
```
├── Mood Logger
│   ├── Current mood (1-10)
│   ├── Emoji selector
│   ├── Mood tags
│   │   ├── Happy
│   │   ├── Sad
│   │   ├── Anxious
│   │   ├── Angry
│   │   └── Calm
│   └── Notes
│
├── Stress Tracker
│   ├── Stress level (1-10)
│   ├── Stressors identification
│   └── Coping mechanisms used
│
├── Anxiety Tracker
│   ├── Anxiety level
│   ├── Triggers
│   └── Symptoms
│
└── Gratitude Journal
    ├── 3 things grateful for
    ├── Daily reflections
    └── Positive moments
```

### 4.3 Meditation & Breathing

**Функции:**
```
├── Meditation Library
│   ├── Guided meditations
│   │   ├── Stress relief (5-30 min)
│   │   ├── Sleep meditation
│   │   ├── Anxiety relief
│   │   ├── Focus enhancement
│   │   └── Self-compassion
│   ├── Unguided timer
│   └── Progress tracking
│
├── Breathing Exercises
│   ├── 4-7-8 technique
│   ├── Box breathing
│   ├── Alternate nostril
│   └── Custom patterns
│
└── Relaxation Techniques
    ├── Progressive muscle relaxation
    ├── Body scan
    └── Visualization
```

**Контент:**
- Источники: Insight Timer API, бесплатные CC лицензии
- Формат: MP3 (аудио), JSON (метаданные)
- Локализация: RU/EN

### 4.4 CBT Tools

**Функции:**
```
├── Thought Record
│   ├── Situation
│   ├── Emotions
│   ├── Automatic thoughts
│   ├── Evidence for/against
│   └── Balanced thought
│
├── Cognitive Distortions
│   ├── Identification
│   ├── Challenges
│   └── Reframing
│
├── Behavioral Activation
│   ├── Activity scheduling
│   ├── Mood monitoring
│   └── Achievement tracking
│
└── Exposure Therapy
    ├── Fear hierarchy
    ├── Exposure exercises
    └── Progress tracking
```

### 4.5 Assessments

**Тесты:**
```
├── PHQ-9 (Depression)
├── GAD-7 (Anxiety)
├── PSS (Perceived Stress)
├── WHO-5 (Well-being)
├── Sleep Quality Index
└── Burnout Assessment
```

**Источники:**
- Публичные валидированные тесты
- Автоматическая интерпретация результатов
- Рекомендации на основе результатов

### 4.6 Analytics

**Функции:**
```
├── Mood Trends
│   ├── Weekly/monthly patterns
│   ├── Mood distribution
│   └── Triggers analysis
│
├── Stress Patterns
│   ├── Stress over time
│   ├── Peak stress times
│   └── Coping effectiveness
│
├── Meditation Stats
│   ├── Sessions completed
│   ├── Total time
│   └── Streak
│
└── Insights
    ├── Mental health score
    ├── Patterns discovered
    └── Recommendations
```

### 4.7 Library

**Контент:**
```
├── Mental Health Guides
├── CBT Workbooks
├── Mindfulness Articles
├── Stress Management
└── Research Papers
```

### 4.8 Settings

**Настройки:**
```
├── Reminders
│   ├── Mood check-ins
│   ├── Meditation reminders
│   └── Journaling prompts
│
├── Privacy
│   ├── Journal encryption
│   ├── Data sharing
│   └── Anonymous mode
│
└── Integrations
    ├── Apple Health
    └── Calm/Headspace
```

---

## 5. 🏥 MEDICINE (Медицина)

### 5.1 Dashboard Widget

**Функции:**
- Следующий прием лекарств
- Ближайший визит к врачу
- Последние анализы
- Быстрые действия (добавить лекарство, анализ)

**UX/UI:**
- Цвет: Red
- Иконки: Heart, Stethoscope, Pill
- Анимации: pulse для напоминаний

### 5.2 Health Records

**Функции:**
```
├── Medical Profile
│   ├── Blood type
│   ├── Allergies
│   ├── Chronic conditions
│   ├── Surgeries
│   ├── Family history
│   └── Current medications
│
├── Lab Results
│   ├── Blood tests
│   ├── Urine tests
│   ├── Imaging (X-ray, MRI)
│   └── Other tests
│   ├── OCR scan upload
│   └── AI interpretation
│
├── Vital Signs
│   ├── Blood pressure
│   ├── Heart rate
│   ├── Temperature
│   ├── Oxygen saturation
│   └── Weight/BMI
│
└── Vaccinations
    ├── Vaccination history
    └── Upcoming vaccines
```

### 5.3 Medications

**Функции:**
```
├── Medication List
│   ├── Name
│   ├── Dosage
│   ├── Frequency
│   ├── Duration
│   └── Prescribing doctor
│
├── Reminders
│   ├── Take medication
│   ├── Refill reminder
│   └── Side effects tracking
│
├── Drug Interactions Checker
│   ├── Interaction warnings
│   └── Food interactions
│
└── Medication History
    ├── Past medications
    └── Effectiveness notes
```

### 5.4 Appointments

**Функции:**
```
├── Appointment Scheduler
│   ├── Book specialist
│   ├── Calendar integration
│   └── Reminders
│
├── Appointment History
│   ├── Past visits
│   ├── Doctor notes
│   └── Follow-ups
│
└── Telemedicine
    ├── Video calls
    └── Chat with doctor
```

### 5.5 Symptom Checker

**Функции:**
```
├── Symptom Logger
│   ├── Current symptoms
│   ├── Severity
│   ├── Duration
│   └── Triggers
│
├── AI Symptom Analysis
│   ├── Possible conditions
│   ├── Urgency level
│   └── Recommendations
│
└── Health Concerns
    ├── Track over time
    └── Share with doctor
```

### 5.6 Analytics

**Функции:**
```
├── Health Metrics Trends
│   ├── Blood pressure
│   ├── Heart rate
│   ├── Weight
│   └── Lab values
│
├── Medication Adherence
│   ├── Compliance rate
│   └── Missed doses
│
└── Health Score
    ├── Overall health
    └── Risk factors
```

### 5.7 Library

**Контент:**
```
├── Medical Conditions Database
├── Medication Guides
├── Lab Tests Explained
├── Healthy Living Tips
└── Research Articles
```

**Источники:**
- MedlinePlus (бесплатно)
- PubMed API
- Drugs.com API

### 5.8 Settings

**Настройки:**
```
├── Reminders
│   ├── Medication times
│   ├── Appointment reminders
│   └── Lab test reminders
│
├── Privacy
│   ├── Data encryption
│   ├── Share with doctor
│   └── Emergency access
│
└── Integrations
    ├── Apple Health
    ├── Google Fit
    └── Clinic EHR systems
```

---

## 6. 👥 RELATIONSHIPS (Отношения)

### 6.1 Dashboard Widget

**Функции:**
- Социальная активность
- Ближайшие события
- Настроение в обществе
- Быстрые действия (добавить контакт, событие)

**UX/UI:**
- Цвет: Pink/Orange
- Иконки: Users, Heart, MessageCircle
- Анимации: social graph

### 6.2 Social Network

**Функции:**
```
├── Connections
│   ├── Friends list
│   ├── Family
│   ├── Colleagues
│   └── Specialists
│
├── Communication Log
│   ├── Calls
│   ├── Messages
│   ├── Meetings
│   └── Quality rating
│
├── Social Activities
│   ├── Events attended
│   ├── Group activities
│   └── Satisfaction
│
└── Support Network
    ├── Close contacts
    ├── Support availability
    └── Help given/received
```

### 6.3 Community Features

**Функции:**
```
├── Groups
│   ├── Health challenges
│   ├── Support groups
│   ├── Interest groups
│   └── Local communities
│
├── Challenges
│   ├── Group challenges
│   ├── Team goals
│   └── Leaderboards
│
├── Feed
│   ├── Friend updates
│   ├── Achievements
│   └── Posts
│
└── Events
    ├── Community events
    ├── Meetups
    └── Webinars
```

### 6.4 Relationship Quality

**Функции:**
```
├── Relationship Assessment
│   ├── Satisfaction score
│   ├── Communication quality
│   └── Support level
│
├── Social Wellness
│   ├── Loneliness score
│   ├── Social anxiety
│   └── Connection quality
│
└── Recommendations
    ├── Improve relationships
    ├── Social activities
    └── Communication tips
```

### 6.5 Analytics

**Функции:**
```
├── Social Activity Trends
│   ├── Interactions over time
│   ├── Quality score
│   └── Satisfaction
│
├── Network Analysis
│   ├── Network size
│   ├── Diversity
│   └── Strength
│
└── Insights
    ├── Social wellness score
    ├── Patterns
    └── Recommendations
```

### 6.6 Library

**Контент:**
```
├── Communication Skills
├── Building Relationships
├── Conflict Resolution
├── Social Anxiety Help
└── Research on Social Health
```

### 6.7 Settings

**Настройки:**
```
├── Privacy
│   ├── Profile visibility
│   ├── Data sharing
│   └── Block users
│
├── Notifications
│   ├── Friend requests
│   ├── Event invitations
│   └── Messages
│
└── Preferences
    ├── Interests
    └── Activity preferences
```

---

## 7. ⭐ HABITS (Привычки)

### 7.1 Dashboard Widget

**Функции:**
- Активные привычки
- Текущий стрик
- Выполнено сегодня
- Быстрые действия (отметить привычку)

**UX/UI:**
- Цвет: Cyan
- Иконки: Sparkles, CheckCircle, Flame
- Анимации: streak fire, confetti

### 7.2 Habit Tracker

**Функции:**
```
├── Habit List
│   ├── Morning habits
│   ├── Evening habits
│   ├── Health habits
│   ├── Productivity habits
│   └── Custom habits
│
├── Daily Tracking
│   ├── Check off habits
│   ├── Notes
│   └── Mood after completion
│
├── Streak Counter
│   ├── Current streak
│   ├── Longest streak
│   └── Streak freeze
│
└── Habit Details
    ├── Description
    ├── Best time
    ├── Frequency
    ├── Triggers
    └── Rewards
```

### 7.3 Goal Setting

**Функции:**
```
├── SMART Goals
│   ├── Specific
│   ├── Measurable
│   ├── Achievable
│   ├── Relevant
│   └── Time-bound
│
├── Goal Breakdown
│   ├── Milestones
│   ├── Action steps
│   └── Deadlines
│
├── Progress Tracking
│   ├── Visual progress
│   ├── Percentage
│   └── Time remaining
│
└── Goal Templates
    ├── Health goals
    ├── Fitness goals
    ├── Learning goals
    └── Career goals
```

### 7.4 Habit Building Programs

**Функции:**
```
├── Pre-made Programs
│   ├── 21-Day Challenge
│   ├── 30-Day Transformation
│   ├── Morning Routine Builder
│   ├── Healthy Habits Stack
│   └── Productivity Boost
│
├── Custom Programs
│   ├── Duration
│   ├── Habits included
│   ├── Difficulty
│   └── Rewards
│
└── Accountability
    ├── Habit partners
    ├── Group challenges
    └── Public commitment
```

### 7.5 Analytics

**Функции:**
```
├── Completion Rate
│   ├── Daily rate
│   ├── Weekly rate
│   └── Monthly rate
│
├── Streak Analysis
│   ├── Current streaks
│   ├── Best streaks
│   └── Broken streaks
│
├── Habit Correlation
│   ├── Habits that help
│   ├── Habits that hinder
│   └── Optimal combinations
│
└── Insights
    ├── Success rate
    ├── Patterns
    └── Recommendations
```

### 7.6 Gamification

**Функции:**
```
├── Unity Token Rewards
│   ├── Daily completion
│   ├── Streak milestones
│   ├── Goal achievement
│   └── Challenge completion
│
├── Achievements
│   ├── Badges
│   ├── Levels
│   └── Titles
│
├── Leaderboards
│   ├── Friends
│   ├── Community
│   └── Global
│
└── Challenges
    ├── Daily challenges
    ├── Weekly challenges
    └── Special events
```

### 7.7 Library

**Контент:**
```
├── Habit Formation Science
├── Atomic Habits Summary
├── Behavior Change Guides
├── Motivation Tips
└── Success Stories
```

### 7.8 Settings

**Настройки:**
```
├── Reminders
│   ├── Habit reminders
│   ├── Custom times
│   └── Smart scheduling
│
├── Rewards
│   ├── Unity tokens
│   ├── Achievements
│   └── Real-world rewards
│
└── Privacy
    ├── Share progress
    └── Anonymous mode
```

---

## 📊 ОБЩАЯ АРХИТЕКТУРА

### Базы данных (текстовые, JSON):

```
1. ExerciseDB - 1300+ упражнений (JSON + GIF)
2. USDA Food Database - 8000+ продуктов (JSON)
3. OpenFoodFacts - продукты со штрих-кодами (API)
4. MedlinePlus - медицинские статьи (API)
5. PubMed - исследования (API)
6. Insight Timer - медитации (CC лицензии)
7. OpenRecipeDB - рецепты (JSON)
```

### Форматы:
- JSON для структурированных данных
- Markdown для статей
- MP3 для аудио (медитации)
- URL для видео (YouTube, Vimeo)

### Интеграции:
- Apple HealthKit
- Google Fit
- Fitbit API
- Garmin API
- Strava API
- Oura API
- Whoop API

---

**Это полная спецификация для реализации всех 7 модулей.**

**Следующий шаг:** Реализация каждого модуля по очереди.
