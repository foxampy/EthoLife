# EthoLife — Техническое задание (Tech Spec)

**Версия:** 1.0  
**Дата:** 01.03.2026  
**Для:** Команды разработки  
**Статус:** Активно

---

## 📋 Оглавление

1. [Обзор проекта](#1-обзор-проекта)
2. [Архитектура](#2-архитектура)
3. [API Endpoints](#3-api-endpoints)
4. [База данных](#4-база-данных)
5. [Модули (детально)](#5-модули-детально)
6. [Интеграции](#6-интеграции)
7. [Безопасность](#7-безопасность)
8. [Деплой](#8-деплой)

---

## 1. ОБЗОР ПРОЕКТА

### 1.1 Стек технологий

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Frontend | React | 19 |
| Language | TypeScript | 5.6 |
| Styling | Tailwind CSS | 4 |
| UI Kit | shadcn/ui | latest |
| Routing | wouter | latest |
| Backend | Express.js | 4.21 |
| Database | PostgreSQL | 15 |
| ORM/Client | Supabase | 2.49 |
| AI | Groq/Gemini/Qwen | API |
| Auth | JWT | - |

### 1.2 Структура проекта

```
etholife/
├── client/                    # Frontend приложение
│   ├── src/
│   │   ├── pages/            # 59 страниц
│   │   │   ├── health/       # 7 модулей здоровья
│   │   │   ├── LandingV2.tsx
│   │   │   ├── DashboardV2.tsx
│   │   │   └── ...
│   │   ├── components/       # 38 компонентов
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   └── index.html
├── server/                    # Backend API
│   ├── api/                  # API routes (10 файлов)
│   ├── middleware/           # Auth, etc.
│   ├── services/             # AI, payments
│   ├── supabase/             # Migrations
│   └── index.ts              # Entry point
├── docs/                      # Документация
└── package.json
```

---

## 2. АРХИТЕКТУРА

### 2.1 Диаграмма потоков данных

```
Пользователь → React Frontend → Express API → Supabase (PostgreSQL)
                     ↓                ↓
                AI Chat ← Groq/Gemini/Qwen
                     ↓
           NOWPayments (crypto)
```

### 2.2 Контексты React

| Контекст | Файл | Назначение |
|----------|------|------------|
| AuthContext | `client/src/contexts/AuthContext.tsx` | Аутентификация, JWT |
| UserContext | `client/src/contexts/UserContext.tsx` | Данные пользователя |
| ThemeContext | `client/src/contexts/ThemeContext.tsx` | Тема оформления |

---

## 3. API ENDPOINTS

### 3.1 Аутентификация (`/api/auth`)

```typescript
// POST /api/auth/register
Body: { email: string, password: string, username?: string }
Response: { token: string, user: User }

// POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: User }

// POST /api/auth/google
Body: { credential: string }
Response: { token: string, user: User }

// POST /api/auth/telegram
Body: { initData: string }
Response: { token: string, user: User }

// GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { user: User }
```

### 3.2 Пользователи (`/api/users`)

```typescript
// GET /api/users/:id
Response: { user: User }

// GET /api/users/:id/metrics?metric_type=&limit=
Response: { metrics: Metric[] }

// POST /api/users/:id/metrics
Body: { metric_type: string, value: number, unit?: string }
Response: { metric: Metric }

// GET /api/users/:id/goals?category=
Response: { goals: Goal[] }

// POST /api/users/:id/goals
Body: { title: string, category: string, target_value?: number }
Response: { goal: Goal }

// GET /api/users/:id/plans?date=&category=
Response: { plans: Plan[] }

// PATCH /api/users/:id
Body: Partial<User>
Response: { user: User }
```

### 3.3 AI Chat (`/api/ai`)

```typescript
// POST /api/ai/chat
Headers: Authorization: Bearer {token} (optional)
Body: { message: string, conversation_id?: string }
Response: { response: string, model: string, recommendations?: [] }
Rate Limits: Free: 10/day, Basic: 50/day, Premium: 200/day

// GET /api/ai/chat/history
Headers: Authorization: Bearer {token}
Response: { conversations: Conversation[] }

// GET /api/ai/chat/history/:id
Headers: Authorization: Bearer {token}
Response: Conversation

// POST /api/ai/recommendations
Body: { category: string, context?: any }
Response: { recommendations: string[] }
```

### 3.4 Платежи (`/api/payments`)

```typescript
// POST /api/payments/crypto/create
Headers: Authorization: Bearer {token}
Body: { plan_id: string, payment_currency?: string }
Response: { payment_id, payment_url, amount, currency, address }

// POST /api/payments/token/pay
Headers: Authorization: Bearer {token}
Body: { plan_id: string }
Response: { success: boolean }

// GET /api/payments/subscription
Headers: Authorization: Bearer {token}
Response: { subscription: Subscription | null }

// GET /api/payments/tokens/balance
Headers: Authorization: Bearer {token}
Response: { balance, total_earned, total_spent, transactions: [] }

// POST /api/payments/tokens/transfer
Headers: Authorization: Bearer {token}
Body: { amount: number, recipient_username: string }
Response: { success: boolean }
```

### 3.5 Социальная сеть (`/api/social`)

```typescript
// GET /api/social/users/:username
Response: { profile: PublicProfile }

// GET /api/social/users/:username/posts
Query: { page?: number, limit?: number }
Response: { posts: Post[], hasMore: boolean }

// POST /api/social/posts
Headers: Authorization: Bearer {token}
Body: { content: string, media_urls?: string[], visibility?: string }
Response: { post: Post }

// POST /api/social/posts/:id/like
Headers: Authorization: Bearer {token}
Response: { success: boolean }

// POST /api/social/posts/:id/comment
Headers: Authorization: Bearer {token}
Body: { content: string }
Response: { comment: Comment }

// POST /api/social/follow/:username
Headers: Authorization: Bearer {token}
Response: { success: boolean }

// POST /api/social/unfollow/:username
Headers: Authorization: Bearer {token}
Response: { success: boolean }
```

### 3.6 Специалисты (`/api/specialists`)

```typescript
// GET /api/specialists
Query: { specialization?: string, location?: string, rating?: number }
Response: { specialists: Specialist[] }

// GET /api/specialists/:id
Response: { specialist: Specialist }

// POST /api/specialists/:id/book
Headers: Authorization: Bearer {token}
Body: { date: string, time: string, notes?: string }
Response: { booking: Booking }
```

### 3.7 Центры (`/api/center`)

```typescript
// GET /api/center/stats
Headers: Authorization: Bearer {token} (center_admin)
Response: { stats: CenterStats }

// GET /api/center/clients
Headers: Authorization: Bearer {token}
Response: { clients: Client[] }

// GET /api/center/employees
Headers: Authorization: Bearer {token}
Response: { employees: Employee[] }

// POST /api/center/employees
Headers: Authorization: Bearer {token}
Body: { email: string, role: string }
Response: { employee: Employee }
```

---

## 4. БАЗА ДАННЫХ

### 4.1 Основные таблицы

```sql
-- Пользователи
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    role VARCHAR(50) DEFAULT 'user',
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unity токены
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) DEFAULT 0,
    total_earned DECIMAL(15,2) DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Транзакции токенов
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'reward', 'payment', 'referral', 'transfer'
    description TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Подписки
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    payment_provider VARCHAR(50),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Платежи
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10),
    provider VARCHAR(50),
    provider_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Модули здоровья

```sql
-- Питание
CREATE TABLE nutrition_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    meal_type VARCHAR(50), -- breakfast, lunch, dinner, snack
    meal_date DATE NOT NULL,
    total_calories INTEGER DEFAULT 0,
    total_protein_g DECIMAL(6,2) DEFAULT 0,
    total_carbs_g DECIMAL(6,2) DEFAULT 0,
    total_fat_g DECIMAL(6,2) DEFAULT 0,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Движение
CREATE TABLE movement_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    workout_type VARCHAR(100),
    duration_minutes INTEGER,
    calories_burned INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Сон
CREATE TABLE sleep_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL,
    duration_hours DECIMAL(4,2),
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10),
    deep_sleep_hours DECIMAL(4,2),
    rem_sleep_hours DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Привычки
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    frequency VARCHAR(50) DEFAULT 'daily',
    streak_count INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, completed_date)
);
```

### 4.3 Социальная сеть

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT,
    media_urls TEXT[],
    post_type VARCHAR(50) DEFAULT 'text',
    visibility VARCHAR(20) DEFAULT 'public',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);
```

---

## 5. МОДУЛИ (ДЕТАЛЬНО)

### 5.1 Модуль Питания (Nutrition)

**Статус:** UI готов, функционал в заглушках

**Компоненты:**
- `client/src/pages/health/NutritionHealth.tsx`
- `client/src/components/MealCard.tsx` (нужно создать)
- `client/src/components/FoodSearch.tsx` (нужно создать)

**Функционал для реализации:**

```typescript
// Добавление блюда
interface AddMealRequest {
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_date: string;
  food_items: {
    name: string;
    calories: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    quantity: number;
    unit: string;
  }[];
  photo_url?: string;
  notes?: string;
}

// Поиск продуктов
interface FoodSearchResponse {
  foods: {
    id: string;
    name: string;
    brand?: string;
    calories_per_100g: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  }[];
}
```

**Задачи:**
- [ ] Интеграция с API еды (Edamam или аналог)
- [ ] Сканер штрих-кодов
- [ ] AI-генерация планов питания
- [ ] Фото дневник

---

### 5.2 Модуль Движение (Movement)

**Статус:** 60% готово

**Компоненты:**
- `client/src/pages/health/MovementHealth.tsx` — готово
- `client/src/components/WorkoutTimer.tsx` (нужно создать)
- `client/src/components/ExerciseCard.tsx` (нужно создать)

**Функционал:**
- ✅ Отображение шагов
- ✅ График активности
- ✅ Список планов
- ⚠️ База упражнений (заглушка)
- ⚠️ Таймер тренировок (заглушка)

---

### 5.3 Модуль Сон (Sleep)

**Статус:** 30% готово

**Компоненты:**
- `client/src/pages/health/SleepHealth.tsx` — базовый UI

**Задачи:**
- [ ] Трекер фаз сна
- [ ] Умный будильник
- [ ] Звуки для сна
- [ ] Корреляция с активностью

---

## 6. ИНТЕГРАЦИИ

### 6.1 AI Провайдеры

**Приоритет:** Groq → Gemini → Qwen

```typescript
// Groq (рекомендуется)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192'; // быстрый и дешёвый

// Gemini (fallback)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Qwen (fallback)
const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
```

### 6.2 Платежи

**NOWPayments:**
```typescript
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
```

### 6.3 Wearables (в планах)

- Apple HealthKit
- Google Fit
- Fitbit API
- Garmin Connect
- Oura Ring

---

## 7. БЕЗОПАСНОСТЬ

### 7.1 Переменные окружения

```env
# Database
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# Auth
JWT_SECRET=

# AI
GROQ_API_KEY=
GEMINI_API_KEY=
QWEN_API_KEY=

# Payments
NOWPAYMENTS_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=

# Google OAuth
VITE_GOOGLE_CLIENT_ID=
```

### 7.2 RLS Policies (Supabase)

```sql
-- Пример: пользователи видят только свои данные
CREATE POLICY "Users can only see own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can only update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

---

## 8. ДЕПЛОЙ

### 8.1 Render (Backend)

```yaml
# render.yaml
services:
  - type: web
    name: etholife-api
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_KEY
        sync: false
      - key: JWT_SECRET
        sync: false
```

### 8.2 Vercel (Frontend)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 9. ТЕСТИРОВАНИЕ

### 9.1 Unit тесты

```bash
# Запуск тестов
npm test

# Coverage
npm run test:coverage
```

### 9.2 E2E тесты

```bash
# Cypress
npm run cypress:open
```

---

## 10. МОНИТОРИНГ

### 10.1 Логи

```typescript
// Логирование ошибок
console.error('[API Error]', {
  endpoint: req.path,
  method: req.method,
  error: error.message,
  timestamp: new Date().toISOString()
});
```

### 10.2 Метрики

- Uptime (Render Dashboard)
- Response time
- Error rate
- AI API usage

---

**Документ поддерживается в актуальном состоянии.**

Последнее обновление: 01.03.2026
