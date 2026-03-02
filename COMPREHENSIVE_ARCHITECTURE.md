# 🏗️ EthoLife Comprehensive Architecture & Implementation Plan

## 📋 Executive Summary

**Версия:** 3.0  
**Дата:** 2026-03-02  
**Статус:** В разработке

Этот документ описывает полную архитектуру приложения EthoLife Health Ecosystem с учётом всех новых требований:
- Единая система аутентификации (Telegram auto-auth)
- Ролевая модель (User, Specialist, Partner, Business, Shop, Center)
- Бизнес-профили с подписками, кэшбэком, реферальными программами
- Оптимизированная навигация (упор на Health Center + AI Chat)
- Токеномика UNITY
- Глубокий онбординг
- Админ панель
- Настраиваемый дашборд с мини-приложениями

---

## 🎯 Completed Tasks ✅

### 1. Страница выбора лендингов
**Путь:** `/landings`  
**Статус:** ✅ Готово

- Просмотр всех версий лендингов (5 вариантов)
- Сравнение функций и статусов
- Рекомендации по использованию
- Предпросмотр деталей

### 2. Централизованная конфигурация
**Путь:** `client/src/config/index.ts`  
**Статус:** ✅ Готово

Включает:
- API endpoints
- Роли и разрешения
- Дизайн-система (цвета, типография, spacing)
- Маршруты
- Онбординг шаги
- Токеномика
- Модули здоровья
- Обработка ошибок

---

## 📐 Architecture Overview

### 2.1 Unified Authentication Flow

```typescript
// Auto-detection и аутентификация
interface AuthFlow {
  // 1. Определение платформы
  platform: 'telegram' | 'web' | 'mobile';
  
  // 2. Для Telegram - автоматическая аутентификация
  telegram: {
    - WebApp initData валидация
    - Проверка существующего аккаунта
    - Если есть → auto-login → /health-center
    - Если нет → создание → /onboarding
  };
  
  // 3. Для Web - стандартная аутентификация
  web: {
    - Email/Password
    - Google OAuth
    - Telegram Widget
  };
  
  // 4. Единый токен для всех платформ
  token: JWT with role-based permissions;
}
```

### 2.2 Role-Based Access Control

```typescript
type UserRole =
  | 'user'                  // Обычный пользователь
  | 'specialist'            // Специалист (тренер, врач, психолог)
  | 'partner'               // Партнёр (аффилиат)
  | 'business_owner'        // Владелец бизнеса (СПА, фитнес)
  | 'shop_owner'           // Владелец магазина
  | 'center_admin'         // Администратор центра здоровья
  | 'investor'             // Инвестор
  | 'admin'                // Администратор
  | 'super_admin';         // Супер-админ

interface RolePermissions {
  user: ['view_dashboard', 'view_health_modules', ...];
  specialist: ['manage_clients', 'view_client_data', ...];
  business_owner: ['create_offers', 'manage_subscriptions', ...];
  // и т.д.
}
```

### 2.3 Business Entities

```typescript
// Типы бизнесов
interface BusinessProfile {
  id: string;
  type: 'gym' | 'spa' | 'medical_center' | 'shop' | 'studio' | 'clinic';
  name: string;
  description: string;
  logo?: string;
  cover?: string;
  location: GeoLocation;
  contacts: Contacts;
  
  // Подписки
  subscriptions: SubscriptionPlan[];
  
  // Кэшбэк программы
  cashbackOffers: {
    percentage: number;
    minPurchase: number;
    maxCashback: number;
    categories: string[];
  }[];
  
  // Реферальная программа
  referralProgram: {
    referrerPercentage: number;  // % тому кто пригласил
    refereePercentage: number;   // % тому кого пригласили
    minPayout: number;
  };
  
  // Статистика
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}
```

---

## 🗂️ Optimized File Structure

```
EthoLife/
├── client/src/
│   ├── config/              # ✅ Централизованная конфигурация
│   │   ├── index.ts         # Все конфиги
│   │   ├── endpoints.ts     # API endpoints
│   │   ├── roles.ts         # Роли и разрешения
│   │   ├── design.ts        # Дизайн-система
│   │   ├── tokenomics.ts    # Токеномика
│   │   └── errors.ts        # Обработка ошибок
│   │
│   ├── contexts/            # ✅ Единая аутентификация
│   │   ├── AuthContext.tsx
│   │   ├── UserContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── components/
│   │   ├── ProtectedRoute.tsx  # ✅ Защита маршрутов
│   │   ├── ErrorBoundary.tsx   # ✅ Обработчик ошибок
│   │   ├── Header.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── AIChat/             # AI Chat компонент
│   │   ├── health/             # Health модули
│   │   ├── business/           # Бизнес компоненты
│   │   └── admin/              # Админ компоненты
│   │
│   ├── pages/
│   │   ├── public/             # Публичные страницы
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LandingsPage.tsx  # ✅ Выбор лендингов
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   │
│   │   ├── protected/          # Защищённые (User)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HealthCenter.tsx
│   │   │   ├── AIChat.tsx
│   │   │   └── ...
│   │   │
│   │   ├── specialist/         # Кабинет специалиста
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── Clients.tsx
│   │   │   └── ...
│   │   │
│   │   ├── business/           # Кабинет бизнеса
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Offers.tsx
│   │   │   ├── Subscriptions.tsx
│   │   │   ├── Cashback.tsx
│   │   │   ├── Referrals.tsx
│   │   │   └── ...
│   │   │
│   │   ├── center/             # Центр здоровья
│   │   │   ├── CRM.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── ...
│   │   │
│   │   ├── admin/              # Админ панель
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── Moderation.tsx
│   │   │   └── ...
│   │   │
│   │   └── onboarding/         # Глубокий онбординг
│   │       ├── Step1_Mood.tsx
│   │       ├── Step2_Goals.tsx
│   │       ├── Step3_Activity.tsx
│   │       ├── Step4_MedicalHistory.tsx
│   │       └── ...
│   │
│   ├── stores/                # Zustand stores
│   │   ├── healthStore.ts
│   │   ├── chatStore.ts
│   │   └── ...
│   │
│   ├── hooks/                 # Кастомные хуки
│   │   ├── useAuth.ts
│   │   ├── useRole.ts
│   │   ├── useTokenomics.ts
│   │   └── ...
│   │
│   ├── services/              # API сервисы
│   │   ├── auth.ts
│   │   ├── health.ts
│   │   ├── business.ts
│   │   └── ...
│   │
│   ├── types/                 # TypeScript типы
│   │   ├── user.ts
│   │   ├── business.ts
│   │   └── ...
│   │
│   └── utils/                 # Утилиты
│       ├── format.ts
│       ├── validation.ts
│       └── ...
│
├── server/
│   ├── routes/
│   │   ├── auth.ts           # ✅ Единая аутентификация
│   │   ├── users.ts
│   │   ├── specialists.ts
│   │   ├── businesses.ts
│   │   ├── centers.ts
│   │   ├── tokenomics.ts
│   │   └── admin.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts           # Проверка токена
│   │   ├── roles.ts          # Проверка ролей
│   │   └── rateLimit.ts
│   │
│   └── services/
│       ├── telegram.ts       # Telegram бот
│       ├── payments.ts       # Платежи
│       └── notifications.ts
│
└── shared/                   # Общие типы и утилиты
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2) ✅
- [x] Централизованная конфигурация
- [x] Страница выбора лендингов
- [ ] Единая аутентификация с Telegram auto-auth
- [ ] Обновление ProtectedRoute с ролями
- [ ] Обработчик ошибок

### Phase 2: Role Management (Week 3-4)
- [ ] Профиль специалиста (расширенный)
- [ ] Профиль бизнеса (магазин, СПА, фитнес)
- [ ] Профиль партнёра
- [ ] Система подписок для бизнесов
- [ ] Кэшбэк система
- [ ] Реферальная программа

### Phase 3: Health Center & AI Chat (Week 5-6)
- [ ] Оптимизация Health Center (главный экран)
- [ ] AI Chat с интеграцией всех функций
- [ ] Управление приложением из чата
- [ ] Подключение специалистов к чату
- [ ] Голосовые сообщения в чате

### Phase 4: Deep Onboarding (Week 7-8)
- [ ] 10-шаговый онбординг с исследованиями
- [ ] Медицинская история
- [ ] Образ жизни и привычки
- [ ] Цели и предпочтения
- [ ] Генерация персонального плана

### Phase 5: Specialist Features (Week 9-10)
- [ ] Доступ к данным клиента (с подтверждением)
- [ ] Просмотр Health Center клиента
- [ ] Координация и пометки
- [ ] Изменение рекомендаций
- [ ] Интеграция с AI Chat

### Phase 6: Tokenomics (Week 11-12)
- [ ] UNITY token integration
- [ ] Earn methods (daily, goals, referrals)
- [ ] Spend methods (subscriptions, marketplace)
- [ ] Cashback conversion
- [ ] Staking mechanism

### Phase 7: Admin Panel (Week 13-14)
- [ ] Админ дашборд
- [ ] Управление пользователями
- [ ] Модерация специалистов и бизнесов
- [ ] Аналитика платформы
- [ ] Настройки системы

### Phase 8: Dashboard Widgets (Week 15-16)
- [ ] Мини-приложения трекеры
- [ ] Настраиваемый дашборд
- [ ] Drag-and-drop виджеты
- [ ] Скрытие/показ модулей
- [ ] Кастомные метрики

---

## 💰 Tokenomics Implementation

### EARN Methods

```typescript
const EARN_RULES = {
  // Ежедневная активность
  daily_login: { amount: 10, limit: 'per_day' },
  daily_goal_completed: { amount: 50, limit: 'per_goal' },
  
  // Серии
  weekly_streak: { amount: 100, limit: 'per_week' },
  monthly_streak: { amount: 500, limit: 'per_month' },
  
  // Рефералы
  refer_friend: { amount: 200, limit: 'per_referral' },
  referral_subscription: { amount: 1000, limit: 'per_purchase', percentage: 0.1 },
  
  // Здоровье
  workout_logged: { amount: 25, limit: 'per_workout' },
  meal_logged: { amount: 5, limit: 'per_meal', daily_max: 15 },
  sleep_tracked: { amount: 10, limit: 'per_day' },
  meditation_completed: { amount: 15, limit: 'per_session' },
  journal_entry: { amount: 15, limit: 'per_entry' },
  
  // Онбординг
  onboarding_completed: { amount: 1000, limit: 'once' },
  profile_completed: { amount: 100, limit: 'once' },
  
  // Кэшбэк
  cashback_from_purchase: { type: 'percentage', min: 0.01, max: 0.1 },
};
```

### SPEND Methods

```typescript
const SPEND_RULES = {
  // Подписки
  subscription_basic_month: 999,
  subscription_premium_month: 1999,
  subscription_family_month: 3999,
  
  // Специалисты
  specialist_consultation: { min: 3000, max: 15000 }, // зависит от специалиста
  specialist_subscription: 5000, // доступ к специалисту на месяц
  
  // Маркетплейс
  marketplace_purchase: 'variable', // зависит от товара
  
  // Кэшбэк конвертация
  cashback_to_tokens: { rate: 100, min: 100 }, // $1 = 100 UNITY
  
  // Премиум функции
  ai_premium_analysis: 500,
  detailed_health_report: 300,
  personalized_plan: 1000,
};
```

### Cashback System

```typescript
interface CashbackFlow {
  // 1. Пользователь покупает по реферальной ссылке
  purchase: {
    amount: 100; // $100
    shop: 'fitness_shop';
    referredBy: 'user123';
  };
  
  // 2. Распределение кэшбэка
  distribution: {
    shopKeeps: 97;        // $97 (97%)
    cashbackPool: 3;      // $3 (3%)
  };
  
  // 3. Разделение кэшбэка
  split: {
    buyer: 2;             // $2 в UNITY токенах (200 UNITY)
    referrer: 1;          // $1 в UNITY токенах (100 UNITY)
    platform: 0;          // $0 (платформа не берёт комиссию)
  };
}
```

---

## 🎨 Deep Onboarding Flow

### Step 1: Current State (Mood & Energy)
```typescript
{
  mood: 1-10,
  energy_level: 1-10,
  stress_level: 1-10,
  sleep_quality: 1-10,
  research_link: 'https://sleepfoundation.org/...',
  explanation: 'Исследования показывают, что качество сна влияет на...',
}
```

### Step 2: Goals & Priorities
```typescript
{
  primary_goals: ['weight_loss', 'muscle_gain', 'stress_reduction', ...],
  secondary_goals: [...],
  timeline: '1_month' | '3_months' | '6_months' | '1_year',
  motivation_level: 1-10,
  research_link: 'https://nutrition.org/...',
  explanation: 'Постановка конкретных целей увеличивает шансы на успех на 70%...',
}
```

### Step 3: Activity & Lifestyle
```typescript
{
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  workout_frequency: '0' | '1-2' | '3-4' | '5+' per_week,
  workout_type: ['cardio', 'strength', 'yoga', 'pilates', ...],
  daily_steps: '<3000' | '3000-5000' | '5000-8000' | '8000+',
  occupation: 'desk_job' | 'active_job' | 'physical_labor',
  research_link: 'https://acsm.org/...',
  explanation: 'ВОЗ рекомендует минимум 150 минут умеренной активности в неделю...',
}
```

### Step 4: Nutrition & Diet
```typescript
{
  diet_type: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | ...,
  meals_per_day: 1-6,
  snacking: 'never' | 'rarely' | 'sometimes' | 'often' | 'always',
  water_intake: '<1L' | '1-2L' | '2-3L' | '3L+',
  alcohol: 'never' | 'rarely' | 'sometimes' | 'often',
  smoking: 'never' | 'former' | 'occasional' | 'regular',
  restrictions: ['gluten', 'dairy', 'nuts', ...],
  research_link: 'https://nutrition.org/...',
  explanation: 'Сбалансированное питание обеспечивает организм необходимыми нутриентами...',
}
```

### Step 5: Medical History
```typescript
{
  chronic_conditions: ['diabetes', 'hypertension', 'asthma', ...],
  injuries: ['knee', 'back', 'shoulder', ...],
  surgeries: [{ type: string, year: number }],
  medications: [{ name: string, dosage: string, frequency: string }],
  allergies: ['penicillin', 'peanuts', ...],
  family_history: ['heart_disease', 'cancer', 'diabetes', ...],
  last_checkup: 'YYYY-MM-DD',
  research_link: 'https://mayoclinic.org/...',
  explanation: 'Знание медицинской истории помогает избежать противопоказаний...',
}
```

### Step 6: Mental Health & Stress
```typescript
{
  anxiety_level: 1-10,
  depression_level: 1-10,
  stress_sources: ['work', 'family', 'finances', 'health', ...],
  coping_mechanisms: ['exercise', 'meditation', 'therapy', ...],
  therapy: 'current' | 'past' | 'never',
  meditation_practice: 'daily' | 'weekly' | 'never',
  support_system: 'strong' | 'moderate' | 'weak',
  research_link: 'https://apa.org/stress/...',
  explanation: 'Хронический стресс повышает риск сердечно-сосудистых заболеваний...',
}
```

### Step 7: Sleep & Recovery
```typescript
{
  sleep_duration: '<6h' | '6-7h' | '7-8h' | '8-9h' | '9h+',
  sleep_quality: 1-10,
  sleep_schedule: 'regular' | 'irregular',
  bedtime: 'HH:MM',
  wake_time: 'HH:MM',
  sleep_issues: ['insomnia', 'apnea', 'restless_legs', ...],
  screen_time_before_bed: '<1h' | '1-2h' | '2h+',
  research_link: 'https://sleepfoundation.org/...',
  explanation: 'Качественный сон критически важен для восстановления и когнитивных функций...',
}
```

### Step 8: Social & Relationships
```typescript
{
  relationship_status: 'single' | 'dating' | 'committed' | 'married',
  social_connections: 'many' | 'few' | 'none',
  community_involvement: 'active' | 'occasional' | 'none',
  support_from_friends: 'strong' | 'moderate' | 'weak',
  loneliness_level: 1-10,
  research_link: 'https://health.harvard.edu/...',
  explanation: 'Социальные связи снижают риск депрессии и увеличивают продолжительность жизни...',
}
```

### Step 9: Specialists & Support
```typescript
{
  current_specialists: [
    { type: 'personal_trainer', frequency: 'weekly' },
    { type: 'nutritionist', frequency: 'monthly' },
    { type: 'therapist', frequency: 'biweekly' },
  ],
  interested_in_specialists: ['personal_trainer', 'nutritionist', ...],
  budget_for_specialists: '<$100' | '$100-300' | '$300-500' | '$500+' per_month,
  preferred_format: 'in_person' | 'online' | 'both',
  research_link: 'https://acsm.org/...',
  explanation: 'Работа со специалистами увеличивает эффективность в 3 раза...',
}
```

### Step 10: Preferences & Commitments
```typescript
{
  workout_preferences: ['gym', 'home', 'outdoor', 'studio'],
  workout_time: 'morning' | 'afternoon' | 'evening',
  workout_duration: '15min' | '30min' | '45min' | '60min+',
  coaching_style: 'gentle' | 'balanced' | 'intense',
  accountability: 'self_motivated' | 'needs_reminders' | 'needs_coach',
  commitment_level: 1-10,
  research_link: 'https://psychology.org/...',
  explanation: 'Персонализация подхода увеличивает adherence на 85%...',
}
```

### Step 11: Personalized Plan Generation
```typescript
{
  // AI генерирует план на основе всех ответов
  plan: {
    daily_routine: {...},
    weekly_goals: [...],
    recommended_modules: ['movement', 'nutrition', 'sleep'],
    recommended_specialists: [...],
    recommended_products: [...],
    milestone_timeline: {...},
  },
  explanation: 'Ваш персональный план основан на научных исследованиях и лучших практиках...',
}
```

---

## 🤖 AI Chat Integration

### Unified Chat Interface

```typescript
interface AIChatFeatures {
  // Базовые функции
  text_chat: true;
  voice_messages: true;
  image_analysis: true;  // фото еды, анализов, тренировок
  
  // Интеграции
  health_data_access: true;  // доступ к модулям здоровья
  calendar_integration: true; // планирование
  specialist_connect: true;   // подключение специалиста
  
  // Управление приложением
  voice_commands: [
    'покажи мой дашборд',
    'добавь тренировку',
    'запиши приём пищи',
    'найди специалиста',
    'покажи статистику',
  ];
  
  // Контекст
  context_awareness: {
    user_health_data: true;
    user_goals: true;
    user_history: true;
    current_time: true;
    location: true;
  };
}
```

### Chat Commands

```typescript
const CHAT_COMMANDS = {
  // Здоровье
  '/log meal': 'Записать приём пищи',
  '/log workout': 'Записать тренировку',
  '/log sleep': 'Записать сон',
  '/log mood': 'Записать настроение',
  
  // Данные
  '/show dashboard': 'Показать дашборд',
  '/show stats': 'Показать статистику',
  '/show progress': 'Показать прогресс',
  
  // Специалисты
  '/find specialist': 'Найти специалиста',
  '/book consultation': 'Записаться на консультацию',
  '/ask specialist': 'Задать вопрос специалисту',
  
  // Планы
  '/show plan': 'Показать план на сегодня',
  '/update plan': 'Обновить план',
  
  // Токены
  '/token balance': 'Баланс UNITY',
  '/token earn': 'Как заработать токены',
  '/token spend': 'Куда потратить токены',
};
```

---

## 📊 Admin Panel Features

### Dashboard

```typescript
interface AdminDashboard {
  // Метрики платформы
  total_users: number;
  active_users: { daily: number; weekly: number; monthly: number };
  total_specialists: number;
  total_businesses: number;
  total_centers: number;
  
  // Финансы
  revenue: { daily: number; weekly: number; monthly: number };
  subscriptions: { active: number; cancelled: number };
  token_circulation: number;
  
  // Активность
  health_entries: { daily: number; weekly: number };
  ai_chat_messages: { daily: number; weekly: number };
  bookings: { daily: number; weekly: number };
  
  // Графики
  growth_chart: {...};
  retention_chart: {...};
  revenue_chart: {...};
}
```

### Moderation

```typescript
interface ModerationTools {
  // Пользователи
  view_all_users: true;
  search_users: true;
  edit_user: true;
  ban_user: true;
  verify_user: true;
  
  // Специалисты
  approve_specialist: true;
  reject_specialist: true;
  verify_credentials: true;
  suspend_specialist: true;
  
  // Бизнесы
  approve_business: true;
  verify_license: true;
  suspend_business: true;
  
  // Контент
  moderate_reviews: true;
  moderate_posts: true;
  remove_content: true;
}
```

---

## 📱 Mobile-First Navigation

### Bottom Navigation (Optimized)

```typescript
const BOTTOM_NAV = {
  // Основная навигация (всегда видна)
  main: [
    { path: '/health-center', icon: Heart, label: 'Здоровье' },
    { path: '/ai-chat', icon: Bot, label: 'AI' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  ],
  
  // Вторичная навигация (в меню)
  secondary: [
    { path: '/calendar', icon: Calendar, label: 'Календарь' },
    { path: '/habits', icon: Sparkles, label: 'Привычки' },
    { path: '/journal', icon: BookOpen, label: 'Журнал' },
    { path: '/wallet', icon: Wallet, label: 'Кошелёк' },
    { path: '/specialists', icon: Users, label: 'Специалисты' },
    { path: '/map', icon: Map, label: 'Карта' },
    { path: '/shop', icon: ShoppingBag, label: 'Магазин' },
    { path: '/settings', icon: Settings, label: 'Настройки' },
  ],
};
```

---

## ✅ Next Steps

1. **Создать обновлённую структуру папок** (переместить страницы по директориям)
2. **Реализовать Telegram auto-auth** (валидация initData, создание/вход)
3. **Добавить роли в базу данных** (миграции)
4. **Создать профили для бизнесов** (CRUD операции)
5. **Реализовать систему подписок** (Stripe/crypto)
6. **Настроить кэшбэк систему** (расчёт, распределение)
7. **Создать реферальную программу** (трекинг, выплаты)
8. **Обновить AI Chat** (интеграция со всеми функциями)
9. **Создать глубокий онбординг** (10 шагов с исследованиями)
10. **Реализовать токеномику** (UNITY token logic)

---

**Документ будет обновляться по мере реализации функций.**
