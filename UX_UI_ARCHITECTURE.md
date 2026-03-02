# 🎨 EthoLife UX/UI Architecture 2.0

**Версия:** 6.0  
**Дата:** 2026-03-02  
**Статус:** План масштабирования

---

## 📱 Новая UX/UI Архитектура

### 🎯 Принципы дизайна

1. **Mobile-First** - основное использование с телефонов
2. **Modular** - каждый модуль независим
3. **Scalable** - легко добавлять новые функции
4. **Accessible** - доступно для всех пользователей
5. **Fast** - загрузка < 3 секунд

---

## 🗺️ Карта приложения (Sitemap)

### Уровень 1: Главная навигация (Bottom Bar)

```
┌─────────────────────────────────────────────────────┐
│  [Здоровье]  [AI Chat]  [Дашборд]  [Проекты]  [Ещё] │
└─────────────────────────────────────────────────────┘
```

### Уровень 2: Основные разделы

#### 1. 🏥 Здоровье (Health Hub)
**Путь:** `/health`  
**Иконка:** Heart  
**Цвет:** Emerald

```
Health Hub (Единый центр здоровья)
├── Quick Stats (виджеты сверху)
│   ├── Steps Today
│   ├── Water Intake
│   ├── Calories
│   └── Sleep Hours
│
├── Health Modules (7 основных)
│   ├── Movement (Движение)
│   │   ├── Steps & Activity
│   │   ├── Workouts
│   │   ├── Posture Analysis (NEW!)
│   │   └── Exercise Library
│   │
│   ├── Nutrition (Питание)
│   │   ├── Meal Tracker
│   │   ├── Calorie Counter
│   │   ├── Water Tracker
│   │   ├── Macro Calculator
│   │   └── Recipe Database
│   │
│   ├── Sleep (Сон)
│   │   ├── Sleep Tracker
│   │   ├── Sleep Quality
│   │   ├── Smart Alarm
│   │   └── Recovery Score
│   │
│   ├── Psychology (Психология)
│   │   ├── Mood Tracker
│   │   ├── Stress Level
│   │   ├── Meditation
│   │   ├── Journal
│   │   └── Breathing Exercises
│   │
│   ├── Medicine (Медицина)
│   │   ├── Health Metrics
│   │   ├── Lab Results
│   │   ├── Medications
│   │   ├── Appointments
│   │   └── Symptoms Tracker
│   │
│   ├── Relationships (Отношения)
│   │   ├── Social Connections
│   │   ├── Communication Log
│   │   ├── Support Network
│   │   └── Community
│   │
│   └── Habits (Привычки)
│       ├── Habit Tracker
│       ├── Streaks
│       ├── Goals
│       └── Rewards
│
├── Integration Hub (NEW!)
│   ├── Wearables
│   │   ├── Apple Health
│   │   ├── Google Fit
│   │   ├── Fitbit
│   │   ├── Garmin
│   │   ├── Oura Ring
│   │   └── Whoop
│   │
│   ├── Smart Scales
│   │   ├── Withings
│   │   ├── Xiaomi
│   │   └── Garmin
│   │
│   └── Other Apps
│       ├── Strava
│       ├── MyFitnessPal
│       └── Calm
│
└── Health AI
    ├── Personal Insights
    ├── Trend Analysis
    ├── Recommendations
    └── Predictive Analytics
```

#### 2. 🤖 AI Chat (Unified Interface)
**Путь:** `/ai-chat`  
**Иконка:** Bot  
**Цвет:** Blue

```
AI Chat Center
├── Chat Interface
│   ├── Text Chat
│   ├── Voice Messages
│   ├── Image Analysis (food, labs)
│   └── Voice Commands
│
├── AI Features
│   ├── Health Assistant
│   ├── Nutrition Coach
│   ├── Workout Planner
│   ├── Mental Health Support
│   └── Medical Q&A
│
├── Specialist Connect (NEW!)
│   ├── Chat with Specialist
│   ├── Video Consultation
│   ├── Share Health Data
│   └── Get Recommendations
│
├── App Control (NEW!)
│   ├── "Log my breakfast"
│   ├── "Start workout"
│   ├── "Show my stats"
│   ├── "Book appointment"
│   └── "Remind me to..."
│
└── AI Projects (NEW!)
    ├── Posture Tracking (Webcam)
    ├── Form Analysis (Workout)
    ├── Gait Analysis
    └── Facial Health Analysis
```

#### 3. 📊 Dashboard (Personal Command Center)
**Путь:** `/dashboard`  
**Иконка:** LayoutDashboard  
**Цвет:** Purple

```
Personal Dashboard
├── Today's Overview
│   ├── Health Score
│   ├── Daily Goals Progress
│   ├── Today's Plan
│   └── Reminders
│
├── Customizable Widgets (NEW!)
│   ├── Add/Remove Widgets
│   ├── Drag & Drop Layout
│   ├── Resize Widgets
│   └── Widget Templates
│       ├── Steps Widget
│       ├── Water Widget
│       ├── Calories Widget
│       ├── Sleep Widget
│       ├── Mood Widget
│       ├── Weight Widget
│       ├── Workout Widget
│       ├── Meditation Widget
│       └── Custom Widget
│
├── Weekly/Monthly Trends
│   ├── Activity Graph
│   ├── Sleep Graph
│   ├── Nutrition Graph
│   └── Mood Graph
│
├── Achievements & Gamification
│   ├── Badges
│   ├── Streaks
│   ├── Levels
│   ├── Leaderboards
│   └── Challenges
│
└── Quick Actions
    ├── Log Meal
    ├── Log Workout
    ├── Log Sleep
    ├── Log Mood
    ├── Add Water
    └── Book Specialist
```

#### 4. 🚀 Projects (Innovation Lab) (NEW!)
**Путь:** `/projects`  
**Иконка:** Rocket  
**Цвет:** Orange

```
Innovation Lab
├── Active Projects
│   ├── Posture AI (Webcam Analysis)
│   │   ├── Real-time Posture Tracking
│   │   ├── Posture Score
│   │   ├── Exercises & Corrections
│   │   ├── Progress Over Time
│   │   └── Alerts & Reminders
│   │
│   ├── Movement Analysis (NEW!)
│   │   ├── Workout Form Check
│   │   ├── Exercise Corrections
│   │   ├── Injury Prevention
│   │   └── Performance Optimization
│   │
│   ├── Body Visualization (NEW!)
│   │   ├── 3D Body Model
│   │   ├── Muscle Activation
│   │   ├── Movement Mechanics
│   │   └── Exercise Demonstrations
│   │
│   └── Gait Analysis (NEW!)
│       ├── Walking Pattern Analysis
│       ├── Running Analysis
│       ├── Imbalance Detection
│       └── Correction Recommendations
│
├── Beta Features
│   ├── Facial Health Analysis
│   ├── Voice Stress Analysis
│   ├── Sleep Apnea Detection
│   └── Nutrition Image Recognition
│
├── Research & Studies
│   ├── Participate in Studies
│   ├── Contribute Data
│   └── Get Rewards
│
└── Feedback & Ideas
    ├── Submit Ideas
    ├── Vote on Features
    └── Beta Testing Program
```

#### 5. 📱 More (Extended Menu)
**Путь:** `/more`  
**Иконка:** Grid  
**Цвет:** Gray

```
More Menu
├── Profile & Settings
│   ├── My Profile
│   ├── Account Settings
│   ├── Privacy Settings
│   ├── Notification Settings
│   └── Subscription
│
├── Social
│   ├── Friends
│   ├── Messages
│   ├── Community Feed
│   ├── Groups
│   └── Events
│
├── Specialists
│   ├── Find Specialists
│   ├── My Specialists
│   ├── Appointments
│   ├── Reviews
│   └── Q&A
│
├── Business & Marketplace
│   ├── Shop (Health Products)
│   ├── Services (Specialists)
│   ├── Centers (Gyms, Spas, Clinics)
│   ├── Offers & Discounts
│   └── Cashback Program
│
├── Finance (NEW!)
│   ├── Wallet
│   ├── UNITY Tokens
│   ├── Subscriptions
│   ├── Payment History
│   ├── Buy Tokens
│   └── Sell Tokens
│
├── Content
│   ├── Library (Articles, Videos)
│   ├── Programs (Workout, Nutrition)
│   ├── Recipes
│   ├── Meditations
│   └── Podcasts
│
├── Tools
│   ├── Calendar
│   ├── Reminders
│   ├── Export Data
│   ├── Health Reports
│   └── API Integrations
│
└── Info
    ├── About EthoLife
    ├── Roadmap
    ├── Tokenomics
    ├── Whitepaper
    ├── FAQ
    └── Support
```

---

## 🎨 Дизайн-система 2.0

### Цветовая схема

```typescript
// Основные цвета
const colors = {
  // Brand
  primary: '#10B981',      // Emerald 500
  secondary: '#3B82F6',    // Blue 500
  accent: '#F59E0B',       // Amber 500
  
  // Health Modules
  movement: '#3B82F6',     // Blue
  nutrition: '#10B981',    // Green
  sleep: '#8B5CF6',        // Purple
  psychology: '#F59E0B',   // Amber
  medicine: '#EF4444',     // Red
  relationships: '#EC4899',// Pink
  habits: '#06B6D4',       // Cyan
  
  // Projects
  projects: '#F97316',     // Orange
  ai: '#6366F1',           // Indigo
  
  // Status
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textMuted: '#64748B',
};
```

### Компоненты

```typescript
// Базовые компоненты
const components = {
  // Layout
  - AppShell (main container)
  - Header (top bar)
  - BottomNav (bottom bar)
  - Sidebar (drawer)
  - PageContainer
  
  // Navigation
  - TabBar
  - MenuDrawer
  - Breadcrumbs
  - Pagination
  
  // Content
  - Card
  - Panel
  - Section
  - Grid
  - List
  
  // Forms
  - Input
  - Button
  - Select
  - Checkbox
  - Radio
  - Switch
  - Slider
  
  // Feedback
  - Toast
  - Dialog
  - Alert
  - Progress
  - Skeleton
  
  // Data Display
  - Chart
  - Graph
  - Table
  - Stat
  - Badge
  
  // Health Specific
  - HealthScoreRing
  - ModuleCard
  - MetricWidget
  - TimelineChart
  - BodyVisualization
};
```

---

## 📦 Новые страницы для реализации

### 1. Интеграции (Integrations Hub)
**Путь:** `/health/integrations`  
**Приоритет:** Высокий

```typescript
// Страница подключения устройств
- Список доступных интеграций
- OAuth подключение
- Статус синхронизации
- Настройки импорта данных
```

### 2. Posture AI (Webcam Analysis)
**Путь:** `/projects/posture-ai`  
**Приоритет:** Высокий

```typescript
// Реальное время
- Webcam feed
- Posture overlay
- Real-time score

// Анализ
- Posture history
- Problem areas
- Exercise recommendations

// Progress
- Improvement over time
- Achievements
```

### 3. Body Visualization 3D
**Путь:** `/health/visualization`  
**Приоритет:** Средний

```typescript
// 3D модель тела
- Muscle groups
- Activation levels
- Imbalances

// Exercise demo
- Proper form
- Common mistakes
- Modifications
```

### 4. Marketplace
**Путь:** `/marketplace`  
**Приоритет:** Средний

```typescript
// Продукты
- Health supplements
- Fitness equipment
- Wellness products

// Услуги
- Personal trainers
- Nutritionists
- Therapists

// Центры
- Gyms
- Spas
- Medical centers
```

### 5. Finance Hub
**Путь:** `/finance`  
**Приоритет:** Высокий

```typescript
// Wallet
- Balance (USD, UNITY)
- Transaction history
- Send/Receive

// Subscriptions
- Current plan
- Upgrade/Downgrade
- Billing history

// Token Management
- Buy UNITY
- Sell UNITY
- Stake UNITY
- Rewards
```

---

## 🔄 User Flow

### Новый пользователь

```
1. Landing Page
   ↓
2. Onboarding (10 steps)
   ↓
3. Health Assessment
   ↓
4. AI Plan Generation
   ↓
5. Health Hub (главная)
   ↓
6. Tutorial (widgets, modules)
   ↓
7. First Goal Setting
```

### Ежедневное использование

```
1. Open App → Dashboard
   ↓
2. Check Today's Plan
   ↓
3. Log Activities (meals, workouts, sleep)
   ↓
4. Check Health Score
   ↓
5. AI Chat for questions
   ↓
6. Review Progress (weekly)
```

### Специалист

```
1. Login → Specialist Dashboard
   ↓
2. Review Client Data (with permission)
   ↓
3. Add Notes/Recommendations
   ↓
4. Chat with Client
   ↓
5. Update Plans
   ↓
6. Track Earnings
```

---

## 🚀 Roadmap реализации

### Phase 1: Foundation (Weeks 1-4)
- [ ] Оптимизация структуры (сейчас)
- [ ] Telegram Auto-Auth (сейчас)
- [ ] Admin Panel (сейчас)
- [ ] Payment Integration (крипто)
- [ ] Basic Integrations (Apple Health, Google Fit)

### Phase 2: Core Features (Weeks 5-8)
- [ ] Health Hub 2.0 (обновлённый UI)
- [ ] AI Chat с голосом
- [ ] Customizable Dashboard
- [ ] Posture AI (MVP)
- [ ] Token System

### Phase 3: Advanced (Weeks 9-12)
- [ ] Body Visualization 3D
- [ ] Movement Analysis
- [ ] Marketplace
- [ ] Specialist Features
- [ ] Business Features

### Phase 4: Scale (Weeks 13-16)
- [ ] More Integrations
- [ ] Advanced Analytics
- [ ] Community Features
- [ ] Research Program
- [ ] Mobile Apps (iOS/Android)

---

## 💡 Идеи для будущего

### AI Features
- Nutrition Image Recognition (фото → калории)
- Voice Stress Analysis
- Sleep Apnea Detection
- Personalized Supplement Recommendations
- Genetic Analysis Integration

### Hardware Integration
- Smart Mirror Integration
- AR Glasses Support
- Smart Clothing
- Home Gym Equipment

### Social Features
- Group Challenges
- Live Workout Classes
- Community Leaderboards
- Mentorship Program

### Business Features
- White-label Solution
- API for Third Parties
- Franchise Management
- Analytics Dashboard

---

**Этот документ будет обновляться по мере развития проекта.**
