# 🪙 UNITY Token - Полная Токеномика и Реализация

**Версия:** 7.0  
**Дата:** 2026-03-02  
**Статус:** Готово к реализации

---

## 1. ХАРАКТЕРИСТИКИ ТОКЕНА

### 1.1 Базовые параметры

```typescript
interface UnityToken {
  name: 'Unity Token';
  symbol: 'UNITY';
  type: 'Utility Token (Off-chain)';
  decimals: 2;
  blockchain: 'Centralized (EthoLife Database)';
  contractAddress: null; // Офчейн токен
}

// Начальный курс
const INITIAL_EXCHANGE_RATE = {
  USD: 0.01,      // 1 UNITY = $0.01
  EUR: 0.0092,    // 1 UNITY = €0.0092
  RUB: 0.92,      // 1 UNITY = 0.92₽
};

// Обратный курс
const REVERSE_RATE = {
  '1 USD': 100 UNITY,
  '1 EUR': 108.7 UNITY,
  '1 RUB': 1.09 UNITY,
};
```

### 1.2 Механизм эмиссии

**Тип:** Динамическая эмиссия на основе активности

```typescript
// Формула эмиссии
function calculateNewTokens(userActivity: ActivityData): number {
  const baseReward = getActivityBaseReward(userActivity.type);
  const multiplier = getUserMultiplier(userActivity.userId);
  const bonus = getStreakBonus(userActivity.userId);
  
  return baseReward * multiplier + bonus;
}

// Базовые награды за действия
const ACTIVITY_REWARDS = {
  // Ежедневная активность
  daily_login: 10,           // 10 UNITY за вход
  daily_goal_completed: 50,  // 50 UNITY за цель
  
  // Здоровье
  workout_logged: 25,        // 25 UNITY за тренировку
  meal_logged: 5,            // 5 UNITY за прием пищи (макс 15/день)
  water_logged: 2,           // 2 UNITY за запись воды (макс 10/день)
  sleep_tracked: 10,         // 10 UNITY за трекинг сна
  mood_logged: 8,            // 8 UNITY за настроение
  meditation_completed: 15,  // 15 UNITY за медитацию
  journal_entry: 12,         // 12 UNITY за запись в журнале
  steps_goal: 20,            // 20 UNITY за 10,000 шагов
  
  // Привычки
  habit_completed: 5,        // 5 UNITY за привычку (макс 50/день)
  habit_streak_7: 50,        // 50 UNITY за 7 дней
  habit_streak_30: 300,      // 300 UNITY за 30 дней
  habit_streak_90: 1000,     // 1000 UNITY за 90 дней
  
  // Социальное
  challenge_completed: 100,  // 100 UNITY за челлендж
  group_activity: 25,        // 25 UNITY за групповую активность
  
  // Обучение
  article_read: 5,           // 5 UNITY за статью (макс 25/день)
  course_completed: 200,     // 200 UNITY за курс
  assessment_completed: 50,  // 50 UNITY за тест
  
  // Онбординг (одноразовые)
  registration: 100,         // 100 UNITY за регистрацию
  onboarding_completed: 1000, // 1000 UNITY за онбординг
  profile_completed: 100,    // 100 UNITY за профиль
  first_goal_set: 50,        // 50 UNITY за первую цель
  first_workout: 50,         // 50 UNITY за первую тренировку
  
  // Рефералы
  refer_friend: 200,         // 200 UNITY за друга
  friend_subscribes: 1000,   // 1000 UNITY если друг купил подписку
  friend_earns_1000: 100,    // 100 UNITY если друг заработал 1000 UNITY
  
  // Подписка
  subscription_active_bonus: 50, // 50 UNITY/день с активной подпиской
};
```

### 1.3 Множители

```typescript
// Множители на основе подписки
const SUBSCRIPTION_MULTIPLIERS = {
  free: 1.0,      // Без множителя
  basic: 1.2,     // +20%
  premium: 1.5,   // +50%
  family: 1.3,    // +30%
};

// Множители на основе уровня
const LEVEL_MULTIPLIERS = {
  level_1: 1.0,   // 0-1000 XP
  level_2: 1.05,  // 1000-5000 XP (+5%)
  level_3: 1.1,   // 5000-15000 XP (+10%)
  level_4: 1.15,  // 15000-30000 XP (+15%)
  level_5: 1.2,   // 30000+ XP (+20%)
};

// streak бонусы
const STREAK_BONUSES = {
  '7': 1.1,    // +10%
  '30': 1.25,  // +25%
  '90': 1.5,   // +50%
  '365': 2.0,  // +100%
};
```

---

## 2. СЖИГАНИЕ ТОКЕНОВ

### 2.1 Механизмы сжигания

```typescript
const BURN_MECHANISMS = {
  // Подписки (100% сжигание)
  subscription_basic_month: 999,     // 999 UNITY сжигается
  subscription_premium_month: 1999,  // 1999 UNITY сжигается
  subscription_family_month: 3999,   // 3999 UNITY сжигается
  
  // Услуги специалистов (50% сжигание)
  specialist_consultation: 0.5,  // 50% от суммы сжигается
  
  // Покупки в маркетплейсе (30% сжигание)
  marketplace_purchase: 0.3,  // 30% от суммы сжигается
  
  // Конвертация в фиат (10% комиссия, 100% сжигание)
  cashout_to_fiat: 0.1,  // 10% комиссия сжигается
  
  // Премиум функции (100% сжигание)
  ai_premium_analysis: 500,
  detailed_health_report: 300,
  personalized_plan: 1000,
};

// Функция сжигания
async function burnTokens(amount: number, reason: string, userId: string) {
  const burnAmount = amount * BURN_MECHANISMS[reason];
  
  // Перевод на burn адрес
  await transferTokens(userId, BURN_ADDRESS, burnAmount);
  
  // Запись в лог
  await logBurn({
    amount: burnAmount,
    reason,
    userId,
    timestamp: new Date(),
  });
  
  // Обновление общей статистики
  await updateTotalBurned(burnAmount);
}
```

### 2.2 Квартальное сжигание

```typescript
// Ежеквартальное сжигание из резерва платформы
async function quarterlyBurn() {
  const platformRevenue = await getQuarterlyRevenue();
  const burnPercentage = 0.5; // 50% от комиссии платформы
  const burnAmount = platformRevenue * burnPercentage;
  
  await burnTokens(burnAmount, 'quarterly_burn', PLATFORM_ADDRESS);
  
  // Публичный отчет
  await publishBurnReport({
    quarter: getCurrentQuarter(),
    amount: burnAmount,
    totalBurned: await getTotalBurned(),
    circulatingSupply: await getCirculatingSupply(),
  });
}
```

---

## 3. РАСПРЕДЕЛЕНИЕ ТОКЕНОВ

### 3.1 Прогноз на Год 1

```typescript
const YEAR_1_DISTRIBUTION = {
  // Пользователям (60%)
  users: {
    percentage: 60,
    amount: 10_000_000, // 10M UNITY
    breakdown: {
      daily_activity: 3_000_000,    // 30%
      goals_achievement: 2_000_000, // 20%
      challenges: 2_000_000,        // 20%
      content_creation: 1_000_000,  // 10%
      referrals: 2_000_000,         // 20%
    },
  },
  
  // Реферальная программа (15%)
  referrals: {
    percentage: 15,
    amount: 2_500_000,
    breakdown: {
      referrer_bonus: 1_500_000,    // 60%
      referee_bonus: 750_000,       // 30%
      tier_rewards: 250_000,        // 5%
    },
  },
  
  // Специалистам (10%)
  specialists: {
    percentage: 10,
    amount: 1_700_000,
    breakdown: {
      consultation_rewards: 1_000_000, // 59%
      content_creation: 400_000,       // 24%
      ratings_bonus: 300_000,          // 17%
    },
  },
  
  // Резерв платформы (10%)
  platform_reserve: {
    percentage: 10,
    amount: 1_700_000,
    usage: {
      marketing: 500_000,         // 29%
      development: 500_000,       // 29%
      emergency_reserve: 400_000, // 24%
      partnerships: 300_000,      // 18%
    },
  },
  
  // Команда (5%)
  team: {
    percentage: 5,
    amount: 850_000,
    vesting: {
      cliff: '6 months',
      vesting_period: '24 months',
      monthly_release: 35_416,
    },
  },
};

// Итого
const TOTAL_YEAR_1 = {
  total_emission: 16_750_000, // 16.75M UNITY
  total_burned: 3_350_000,    // 20% сожжено (оценка)
  circulating_supply: 13_400_000, // 13.4M UNITY
};
```

### 3.2 Прогноз на 5 лет

```typescript
const FIVE_YEAR_PROJECTION = {
  year_1: {
    users: 100_000,
    emission: 16_750_000,
    burned: 3_350_000,
    circulating: 13_400_000,
    price_usd: 0.01,
    market_cap: 134_000, // $134K
  },
  year_2: {
    users: 500_000,
    emission: 50_000_000,
    burned: 12_500_000,
    circulating: 50_900_000,
    price_usd: 0.015,
    market_cap: 763_500, // $763K
  },
  year_3: {
    users: 2_000_000,
    emission: 150_000_000,
    burned: 45_000_000,
    circulating: 155_900_000,
    price_usd: 0.02,
    market_cap: 3_118_000, // $3.1M
  },
  year_4: {
    users: 5_000_000,
    emission: 300_000_000,
    burned: 105_000_000,
    circulating: 350_900_000,
    price_usd: 0.025,
    market_cap: 8_772_500, // $8.7M
  },
  year_5: {
    users: 10_000_000,
    emission: 500_000_000,
    burned: 200_000_000,
    circulating: 650_900_000,
    price_usd: 0.03,
    market_cap: 19_527_000, // $19.5M
  },
};
```

---

## 4. СПОСОБЫ ПОЛУЧЕНИЯ (EARN)

### 4.1 Детальная таблица наград

```typescript
const EARN_TABLE = {
  // Ежедневная активность
  daily_login: {
    amount: 10,
    limit: 'per_day',
    description: 'Вход в приложение',
  },
  daily_all_modules: {
    amount: 50,
    limit: 'per_day',
    description: 'Отметить все 7 модулей за день',
  },
  
  // Модуль: Питание
  meal_logged: {
    amount: 5,
    limit: 'per_meal',
    daily_max: 15, // 3 приема пищи
    description: 'Запись приема пищи',
  },
  water_logged: {
    amount: 2,
    limit: 'per_entry',
    daily_max: 10, // 2.5L
    description: 'Запись воды',
  },
  calorie_goal_met: {
    amount: 25,
    limit: 'per_day',
    description: 'Достиг цели по калориям',
  },
  
  // Модуль: Движение
  workout_logged: {
    amount: 25,
    limit: 'per_workout',
    daily_max: 75, // 3 тренировки
    description: 'Запись тренировки',
  },
  steps_10k: {
    amount: 20,
    limit: 'per_day',
    description: '10,000+ шагов за день',
  },
  steps_20k: {
    amount: 50,
    limit: 'per_day',
    description: '20,000+ шагов за день',
  },
  active_minutes: {
    amount: 10,
    limit: 'per_30min',
    daily_max: 60, // 3 часа
    description: '30 мин активности',
  },
  
  // Модуль: Сон
  sleep_tracked: {
    amount: 10,
    limit: 'per_day',
    description: 'Запись сна',
  },
  sleep_7h: {
    amount: 15,
    limit: 'per_day',
    description: '7+ часов сна',
  },
  sleep_quality_high: {
    amount: 20,
    limit: 'per_day',
    description: 'Высокое качество сна (8+)',
  },
  
  // Модуль: Психология
  mood_logged: {
    amount: 8,
    limit: 'per_day',
    description: 'Запись настроения',
  },
  meditation_completed: {
    amount: 15,
    limit: 'per_session',
    daily_max: 45, // 3 сессии
    description: 'Медитация завершена',
  },
  journal_entry: {
    amount: 12,
    limit: 'per_entry',
    daily_max: 36, // 3 записи
    description: 'Запись в журнале',
  },
  assessment_completed: {
    amount: 50,
    limit: 'per_assessment',
    description: 'Тест (PHQ-9, GAD-7)',
  },
  
  // Модуль: Привычки
  habit_completed: {
    amount: 5,
    limit: 'per_habit',
    daily_max: 50, // 10 привычек
    description: 'Привычка выполнена',
  },
  streak_7_days: {
    amount: 50,
    limit: 'per_habit',
    description: '7 дней стрик',
  },
  streak_30_days: {
    amount: 300,
    limit: 'per_habit',
    description: '30 дней стрик',
  },
  streak_90_days: {
    amount: 1000,
    limit: 'per_habit',
    description: '90 дней стрик',
  },
  streak_365_days: {
    amount: 5000,
    limit: 'per_habit',
    description: '365 дней стрик',
  },
  
  // Модуль: Медицина
  medication_taken: {
    amount: 3,
    limit: 'per_medication',
    daily_max: 30, // 10 лекарств
    description: 'Лекарство принято',
  },
  vitals_logged: {
    amount: 10,
    limit: 'per_day',
    description: 'Запись показателей',
  },
  lab_result_uploaded: {
    amount: 25,
    limit: 'per_upload',
    description: 'Загрузка анализа',
  },
  appointment_completed: {
    amount: 50,
    limit: 'per_appointment',
    description: 'Визит к врачу завершен',
  },
  
  // Модуль: Отношения
  social_interaction: {
    amount: 10,
    limit: 'per_interaction',
    daily_max: 50, // 5 взаимодействий
    description: 'Социальное взаимодействие',
  },
  group_challenge_joined: {
    amount: 25,
    limit: 'per_challenge',
    description: 'Участие в челлендже',
  },
  group_challenge_completed: {
    amount: 100,
    limit: 'per_challenge',
    description: 'Челлендж завершен',
  },
  friend_referred: {
    amount: 200,
    limit: 'per_friend',
    description: 'Друг пригласил',
  },
  
  // Модуль: Обучение
  article_read: {
    amount: 5,
    limit: 'per_article',
    daily_max: 25, // 5 статей
    description: 'Статья прочитана',
  },
  video_watched: {
    amount: 10,
    limit: 'per_video',
    daily_max: 50, // 5 видео
    description: 'Видео просмотрено',
  },
  course_completed: {
    amount: 200,
    limit: 'per_course',
    description: 'Курс завершен',
  },
  quiz_passed: {
    amount: 50,
    limit: 'per_quiz',
    description: 'Тест сдан',
  },
  
  // Контент
  post_created: {
    amount: 20,
    limit: 'per_post',
    daily_max: 60, // 3 поста
    description: 'Пост создан',
  },
  recipe_shared: {
    amount: 50,
    limit: 'per_recipe',
    description: 'Рецепт опубликован',
  },
  workout_shared: {
    amount: 50,
    limit: 'per_workout',
    description: 'Тренировка опубликована',
  },
  
  // Онбординг (одноразовые)
  registration: {
    amount: 100,
    limit: 'once',
    description: 'Регистрация',
  },
  onboarding_completed: {
    amount: 1000,
    limit: 'once',
    description: 'Онбординг (10 шагов)',
  },
  profile_completed: {
    amount: 100,
    limit: 'once',
    description: 'Профиль заполнен',
  },
  first_goal_set: {
    amount: 50,
    limit: 'once',
    description: 'Первая цель',
  },
  first_workout_logged: {
    amount: 50,
    limit: 'once',
    description: 'Первая тренировка',
  },
  first_meal_logged: {
    amount: 50,
    limit: 'once',
    description: 'Первый прием пищи',
  },
  
  // Достижения
  achievement_unlocked: {
    amount: 100,
    limit: 'per_achievement',
    description: 'Достижение получено',
  },
  level_up: {
    amount: 500,
    limit: 'per_level',
    description: 'Уровень повышен',
  },
};
```

---

## 5. СПОСОБЫ ТРАТЫ (SPEND)

### 5.1 Подписки

```typescript
const SUBSCRIPTION_PRICES = {
  basic: {
    unity: 999,      // 999 UNITY
    usd: 9.99,       // $9.99
    discount: '0%',  // Без скидки
    benefits: [
      'Все 7 модулей',
      '50 AI сообщений/день',
      'Базовая аналитика',
    ],
  },
  premium: {
    unity: 1699,     // 1699 UNITY (-15% скидка)
    usd: 19.99,      // $19.99
    discount: '15%',
    benefits: [
      'Все 7 модулей',
      '200 AI сообщений/день',
      'Расширенная аналитика',
      'Персональные планы',
      'Приоритетная поддержка',
    ],
  },
  family: {
    unity: 3399,     // 3399 UNITY (-15% скидка)
    usd: 39.99,      // $39.99
    discount: '15%',
    benefits: [
      'До 5 аккаунтов',
      'Все функции Premium',
      'Семейные цели',
      'Совместные челленджи',
    ],
  },
};
```

### 5.2 Услуги специалистов

```typescript
const SPECIALIST_SERVICES = {
  consultation_30min: {
    min_price_unity: 3000,  // $30
    min_price_usd: 30,
    platform_fee: 0.2,      // 20% комиссии
    burn_percentage: 0.5,   // 50% сжигается
  },
  consultation_60min: {
    min_price_unity: 6000,  // $60
    min_price_usd: 60,
    platform_fee: 0.2,
    burn_percentage: 0.5,
  },
  monthly_coaching: {
    min_price_unity: 20000, // $200
    min_price_usd: 200,
    platform_fee: 0.15,     // 15%
    burn_percentage: 0.5,
  },
};
```

### 5.3 Маркетплейс

```typescript
const MARKETPLACE_CATEGORIES = {
  supplements: {
    unity_accepted: true,
    cashback_percentage: 0.03, // 3% кэшбэк
    burn_percentage: 0.3,      // 30% сжигается
  },
  equipment: {
    unity_accepted: true,
    cashback_percentage: 0.05, // 5% кэшбэк
    burn_percentage: 0.3,
  },
  programs: {
    unity_accepted: true,
    cashback_percentage: 0.10, // 10% кэшбэк
    burn_percentage: 0.5,      // 50% сжигается
  },
  courses: {
    unity_accepted: true,
    cashback_percentage: 0.10,
    burn_percentage: 0.5,
  },
};
```

### 5.4 Премиум функции

```typescript
const PREMIUM_FEATURES = {
  ai_health_analysis: {
    unity: 500,
    description: 'Полный AI анализ здоровья',
  },
  detailed_report: {
    unity: 300,
    description: 'Детальный отчет по модулю',
  },
  personalized_plan: {
    unity: 1000,
    description: 'Персональный план на месяц',
  },
  specialist_matching: {
    unity: 200,
    description: 'Подбор специалиста',
  },
  priority_support: {
    unity: 100,
    description: 'Приоритетная поддержка (неделя)',
  },
};
```

### 5.5 Конвертация в фиат

```typescript
const CASHOUT_OPTIONS = {
  min_amount: 1000,              // Минимум 1000 UNITY ($10)
  fee_percentage: 0.1,           // 10% комиссия
  burn_percentage: 1.0,          // 100% комиссии сжигается
  payment_methods: [
    'PayPal',
    'Bank Transfer',
    'Crypto (USDT, BTC)',
  ],
  processing_time: '3-5 дней',
};

// Пример
function calculateCashout(amount: number) {
  const fee = amount * 0.1;           // 10% комиссия
  const burned = fee;                 // Всё сжигается
  const received = amount - fee;      // Пользователь получает
  const usd_value = received * 0.01;  // Конвертация в $
  
  return {
    amount,
    fee,
    burned,
    received,
    usd_value,
  };
}

// cashout(10000) = {
//   amount: 10000,
//   fee: 1000,
//   burned: 1000,
//   received: 9000,
//   usd_value: $90
// }
```

---

## 6. КЭШБЭК ПРОГРАММА

### 6.1 Уровни кэшбэка

```typescript
const CASHBACK_TIERS = {
  // По подписке
  free: {
    base_rate: 0.01,    // 1% кэшбэк
    unity_multiplier: 1.0,
  },
  basic: {
    base_rate: 0.03,    // 3% кэшбэк
    unity_multiplier: 1.2,
  },
  premium: {
    base_rate: 0.05,    // 5% кэшбэк
    unity_multiplier: 1.5,
  },
  family: {
    base_rate: 0.04,    // 4% кэшбэк
    unity_multiplier: 1.3,
  },
  
  // По активности (дополнительно)
  activity_bonus: {
    level_1: 0.005,   // +0.5% (1000 UNITY заработано)
    level_2: 0.01,    // +1% (5000 UNITY)
    level_3: 0.02,    // +2% (15000 UNITY)
    level_4: 0.03,    // +3% (30000 UNITY)
  },
};
```

### 6.2 Источники кэшбэка

```typescript
const CASHBACK_SOURCES = {
  // Покупки в маркетплейсе
  marketplace_purchase: {
    rate: 0.03,  // 3%
    unity: true,
  },
  
  // Подписка друга
  referral_subscription: {
    rate: 0.10,  // 10% от стоимости подписки
    unity: true,
  },
  
  // Рекомендация специалиста
  specialist_referral: {
    rate: 0.05,  // 5% от консультации
    unity: true,
  },
  
  // Рекомендация центра
  center_referral: {
    rate: 0.07,  // 7% от услуги
    unity: true,
  },
  
  // Покупки у партнеров
  partner_shop: {
    rate: 0.05,  // 5%
    unity: true,
  },
  partner_gym: {
    rate: 0.07,  // 7%
    unity: true,
  },
  partner_spa: {
    rate: 0.07,  // 7%
    unity: true,
  },
};
```

### 6.3 Пример расчета кэшбэка

```typescript
function calculateCashback(
  purchaseAmount: number,
  source: string,
  userTier: string,
  userActivityLevel: number
): number {
  const baseRate = CASHBACK_SOURCES[source]?.rate || 0;
  const tierMultiplier = CASHBACK_TIERS[userTier].unity_multiplier;
  const activityBonus = getActivityBonus(userActivityLevel);
  
  const totalRate = baseRate * tierMultiplier + activityBonus;
  const cashbackUnity = purchaseAmount * totalRate / 0.01; // Конвертация в UNITY
  
  return cashbackUnity;
}

// Пример:
// Пользователь Premium покупает за $100 в маркетплейсе
// cashback(100, 'marketplace_purchase', 'premium', 3)
// = 100 * 0.05 * 1.5 + 0.01 = 7.5 + 0.01 = 7.51% = 751 UNITY
```

---

## 7. УРОВНИ И XP

### 7.1 Система уровней

```typescript
const LEVEL_SYSTEM = {
  level_1: { min_xp: 0, max_xp: 1000, title: 'Новичок' },
  level_2: { min_xp: 1000, max_xp: 5000, title: 'Начинающий' },
  level_3: { min_xp: 5000, max_xp: 15000, title: 'Активный' },
  level_4: { min_xp: 15000, max_xp: 30000, title: 'Продвинутый' },
  level_5: { min_xp: 30000, max_xp: 50000, title: 'Эксперт' },
  level_6: { min_xp: 50000, max_xp: 75000, title: 'Мастер' },
  level_7: { min_xp: 75000, max_xp: 100000, title: 'Гуру' },
  level_8: { min_xp: 100000, max_xp: 150000, title: 'Легенда' },
  level_9: { min_xp: 150000, max_xp: 200000, title: 'Чемпион' },
  level_10: { min_xp: 200000, title: 'Икона здоровья' },
};
```

### 7.2 Получение XP

```typescript
const XP_REWARDS = {
  // Активность
  daily_login: 10,
  daily_all_modules: 50,
  
  // Модули
  workout_logged: 25,
  meal_logged: 10,
  sleep_tracked: 15,
  mood_logged: 10,
  habit_completed: 5,
  meditation_completed: 20,
  
  // Достижения
  goal_completed: 100,
  streak_7_days: 70,
  streak_30_days: 300,
  streak_90_days: 900,
  streak_365_days: 3650,
  
  // Социальное
  challenge_completed: 150,
  friend_referred: 200,
  
  // Обучение
  article_read: 5,
  course_completed: 300,
  assessment_completed: 50,
};
```

---

## 8. БАЗА ДАННЫХ

### 8.1 Таблицы

```sql
-- Баланс пользователей
CREATE TABLE user_wallets (
  user_id UUID PRIMARY KEY,
  unity_balance DECIMAL(15,2) DEFAULT 0,
  total_earned DECIMAL(15,2) DEFAULT 0,
  total_spent DECIMAL(15,2) DEFAULT 0,
  total_burned DECIMAL(15,2) DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Транзакции
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_wallets(user_id),
  type VARCHAR(50), -- 'earn', 'spend', 'burn', 'transfer'
  amount DECIMAL(15,2),
  balance_after DECIMAL(15,2),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Награды
CREATE TABLE token_rewards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_wallets(user_id),
  reward_type VARCHAR(100),
  amount DECIMAL(15,2),
  multiplier DECIMAL(5,2) DEFAULT 1.0,
  streak_bonus DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Курсы обмена
CREATE TABLE unity_exchange_rates (
  id UUID PRIMARY KEY,
  currency VARCHAR(3), -- 'USD', 'EUR', 'RUB'
  rate DECIMAL(20,10),
  effective_from TIMESTAMP DEFAULT NOW(),
  effective_until TIMESTAMP
);

-- Сожженные токены
CREATE TABLE token_burns (
  id UUID PRIMARY KEY,
  amount DECIMAL(15,2),
  reason VARCHAR(100),
  burned_by UUID, -- user_id или PLATFORM
  created_at TIMESTAMP DEFAULT NOW()
);

-- Общая статистика
CREATE TABLE token_statistics (
  id UUID PRIMARY KEY DEFAULT 1,
  total_emitted DECIMAL(20,2) DEFAULT 0,
  total_burned DECIMAL(20,2) DEFAULT 0,
  circulating_supply DECIMAL(20,2) DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  average_balance DECIMAL(15,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. API ENDPOINTS

```typescript
// GET /api/token/balance
// Получить баланс пользователя
Response: {
  balance: number,
  total_earned: number,
  total_spent: number,
  level: number,
  xp: number,
}

// POST /api/token/earn
// Заработать токены (за действие)
Body: { action_type: string, metadata?: object }
Response: { earned: number, new_balance: number }

// POST /api/token/spend
// Потратить токены
Body: { item_type: string, item_id: string, amount: number }
Response: { success: boolean, new_balance: number }

// GET /api/token/history
// История транзакций
Response: { transactions: Transaction[] }

// POST /api/token/transfer
// Перевод токенов
Body: { recipient_username: string, amount: number }
Response: { success: boolean }

// GET /api/token/exchange-rate
// Текущий курс
Response: { USD: number, EUR: number, RUB: number }

// POST /api/token/cashout
// Конвертация в фиат
Body: { amount: number, payment_method: string }
Response: { usd_amount: number, fee: number, eta: string }

// GET /api/token/statistics
// Общая статистика токена
Response: {
  total_emitted: number,
  total_burned: number,
  circulating_supply: number,
  total_users: number,
}
```

---

## 10. РЕАЛИЗАЦИЯ

### 10.1 Сервис токенов

```typescript
// server/services/tokenService.ts

class TokenService {
  // Заработать токены
  async earnTokens(userId: string, actionType: string, metadata: any = {}) {
    const baseReward = ACTIVITY_REWARDS[actionType];
    if (!baseReward) throw new Error('Invalid action type');
    
    // Проверка лимитов
    const dailyLimit = this.getDailyLimit(actionType);
    const earnedToday = await this.getEarnedToday(userId, actionType);
    if (earnedToday >= dailyLimit) {
      throw new Error('Daily limit reached');
    }
    
    // Множители
    const user = await getUser(userId);
    const subMultiplier = SUBSCRIPTION_MULTIPLIERS[user.subscription_tier];
    const levelMultiplier = this.getLevelMultiplier(user.level);
    const streakMultiplier = this.getStreakMultiplier(userId);
    
    const finalAmount = baseReward * subMultiplier * levelMultiplier * streakMultiplier;
    
    // Начисление
    await this.addBalance(userId, finalAmount);
    await this.addXP(userId, this.getXPForAction(actionType));
    await this.logTransaction(userId, 'earn', finalAmount, actionType, metadata);
    
    return { earned: finalAmount };
  }
  
  // Потратить токены
  async spendTokens(userId: string, amount: number, itemType: string) {
    const balance = await this.getBalance(userId);
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Сжигание части
    const burnRate = BURN_MECHANISMS[itemType] || 0;
    const burnAmount = amount * burnRate;
    
    await this.subtractBalance(userId, amount);
    if (burnAmount > 0) {
      await this.burnTokens(burnAmount, itemType, userId);
    }
    await this.logTransaction(userId, 'spend', amount, itemType);
    
    return { success: true };
  }
  
  // Конвертация в фиат
  async cashout(userId: string, amount: number, paymentMethod: string) {
    const FEE = 0.1; // 10%
    const fee = amount * FEE;
    const received = amount - fee;
    const usdValue = received * 0.01;
    
    await this.subtractBalance(userId, amount);
    await this.burnTokens(fee, 'cashout_fee', userId);
    await this.logTransaction(userId, 'cashout', amount, paymentMethod);
    
    // Создание выплаты
    await this.createPayout(userId, usdValue, paymentMethod);
    
    return { usd_value: usdValue, fee, eta: '3-5 дней' };
  }
}
```

---

**Это полная спецификация UNITY токена.**

**Следующий шаг:** Реализация в коде.
