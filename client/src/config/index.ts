/**
 * EthoLife Centralized Configuration
 * Единая точка конфигурации для всего приложения
 */

// ============================================================================
// API & ENDPOINTS
// ============================================================================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 30000,
  RETRIES: 3,
} as const;

export const ENDPOINTS = {
  // Аутентификация
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    GOOGLE: '/auth/google',
    TELEGRAM: '/auth/telegram',
  },
  // Пользователь
  USER: {
    PROFILE: '/users/:id/profile',
    SETTINGS: '/users/:id/settings',
    ONBOARDING: '/users/:id/onboarding',
    GOALS: '/users/:id/goals',
    METRICS: '/users/:id/metrics',
    PLANS: '/users/:id/plans',
  },
  // Здоровье
  HEALTH: {
    DASHBOARD: '/health/dashboard',
    MODULES: '/health/modules',
    MOVEMENT: '/health/movement',
    NUTRITION: '/health/nutrition',
    SLEEP: '/health/sleep',
    PSYCHOLOGY: '/health/psychology',
    MEDICINE: '/health/medicine',
    RELATIONSHIPS: '/health/relationships',
    HABITS: '/health/habits',
  },
  // Специалисты
  SPECIALIST: {
    LIST: '/specialists',
    PROFILE: '/specialists/:username',
    BOOKING: '/specialists/:username/book',
    DASHBOARD: '/specialist/dashboard',
    SCHEDULE: '/specialist/schedule',
    CLIENTS: '/specialist/clients',
    EARNINGS: '/specialist/earnings',
  },
  // Центры / Бизнесы
  CENTER: {
    LIST: '/centers',
    CRM: '/center/crm',
    ANALYTICS: '/center/analytics',
    STAFF: '/center/staff',
    CLIENTS: '/center/clients',
    SERVICES: '/center/services',
    SUBSCRIPTIONS: '/center/subscriptions',
    CASHBACK: '/center/cashback',
    REFERRALS: '/center/referrals',
  },
  // Бизнесы / Магазины
  BUSINESS: {
    LIST: '/businesses',
    PROFILE: '/businesses/:id',
    OFFERS: '/businesses/:id/offers',
    SUBSCRIPTIONS: '/businesses/:id/subscriptions',
    CASHBACK: '/businesses/:id/cashback',
    REFERRALS: '/businesses/:id/referrals',
  },
  // AI
  AI: {
    CHAT: '/ai/chat',
    PLANNER: '/ai/planner',
    RECOMMENDATIONS: '/ai/recommendations',
    ANALYSIS: '/ai/analysis',
  },
  // Платежи
  PAYMENTS: {
    SUBSCRIPTIONS: '/payments/subscriptions',
    ONE_TIME: '/payments/one-time',
    CRYPTO: '/payments/crypto',
    CASHBACK: '/payments/cashback',
    REFUNDS: '/payments/refunds',
  },
  // Токены
  TOKEN: {
    BALANCE: '/token/balance',
    EARN: '/token/earn',
    SPEND: '/token/spend',
    HISTORY: '/token/history',
    STAKE: '/token/stake',
  },
  // Админ
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SPECIALISTS: '/admin/specialists',
    CENTERS: '/admin/centers',
    BUSINESSES: '/admin/businesses',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;

// ============================================================================
// РОЛИ И ДОСТУПЫ
// ============================================================================
export const ROLES = {
  USER: 'user',
  SPECIALIST: 'specialist',
  CENTER_ADMIN: 'center_admin',
  BUSINESS_OWNER: 'business_owner',
  SHOP_OWNER: 'shop_owner',
  PARTNER: 'partner',
  INVESTOR: 'investor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: [
    'view_dashboard',
    'view_health_modules',
    'edit_own_profile',
    'use_ai_chat',
    'book_specialists',
    'view_offers',
    'earn_tokens',
    'spend_tokens',
  ],
  [ROLES.SPECIALIST]: [
    'view_dashboard',
    'view_health_modules',
    'edit_own_profile',
    'use_ai_chat',
    'manage_schedule',
    'manage_clients',
    'view_client_data',
    'create_recommendations',
    'earn_tokens',
    'withdraw_tokens',
  ],
  [ROLES.CENTER_ADMIN]: [
    'view_dashboard',
    'manage_center',
    'manage_staff',
    'manage_clients',
    'view_analytics',
    'create_subscriptions',
    'create_cashback_offers',
    'manage_referrals',
  ],
  [ROLES.BUSINESS_OWNER]: [
    'view_dashboard',
    'manage_business',
    'create_offers',
    'create_subscriptions',
    'create_cashback_offers',
    'manage_referrals',
    'view_analytics',
  ],
  [ROLES.ADMIN]: [
    'view_all',
    'edit_all',
    'delete_all',
    'manage_users',
    'manage_specialists',
    'manage_centers',
    'manage_businesses',
    'view_analytics',
    'manage_settings',
  ],
} as const;

// ============================================================================
// ДИЗАЙН-СИСТЕМА
// ============================================================================
export const DESIGN = {
  // Цветовая палитра (OKLCH)
  COLORS: {
    PRIMARY: 'oklch(0.32 0.14 245)',      // Premium Deep Blue
    SECONDARY: 'oklch(0.52 0.09 245)',    // Medium Blue
    ACCENT: 'oklch(0.22 0.03 245)',       // Dark Gray
    BACKGROUND: 'oklch(0.99 0.002 245)',  // Premium White
    FOREGROUND: 'oklch(0.20 0.02 245)',   // Text
    
    // Module colors
    MODULES: {
      MOVEMENT: { primary: '#3B82F6', bg: 'bg-blue-50' },
      NUTRITION: { primary: '#10B981', bg: 'bg-green-50' },
      SLEEP: { primary: '#8B5CF6', bg: 'bg-purple-50' },
      PSYCHOLOGY: { primary: '#F59E0B', bg: 'bg-amber-50' },
      MEDICINE: { primary: '#EF4444', bg: 'bg-red-50' },
      RELATIONSHIPS: { primary: '#EC4899', bg: 'bg-pink-50' },
      HABITS: { primary: '#06B6D4', bg: 'bg-cyan-50' },
    },
    
    // Status colors
    SUCCESS: 'oklch(0.72 0.19 142)',
    WARNING: 'oklch(0.78 0.18 66)',
    ERROR: 'oklch(0.63 0.24 25)',
    INFO: 'oklch(0.70 0.15 230)',
  },
  
  // Типография
  TYPOGRAPHY: {
    FONT_FAMILY: {
      HEADING: 'Poppins, sans-serif',
      BODY: 'Nunito, sans-serif',
    },
    FONT_SIZES: {
      XS: '0.75rem',
      SM: '0.875rem',
      BASE: '1rem',
      LG: '1.125rem',
      XL: '1.25rem',
      '2XL': '1.5rem',
      '3XL': '1.875rem',
      '4XL': '2.25rem',
      '5XL': '3rem',
    },
    FONT_WEIGHTS: {
      NORMAL: 400,
      MEDIUM: 500,
      SEMIBOLD: 600,
      BOLD: 700,
      EXTRABOLD: 800,
    },
  },
  
  // Отступы и размеры
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
  },
  
  // Скругления
  RADIUS: {
    SM: '0.25rem',
    MD: '0.5rem',
    LG: '0.75rem',
    XL: '1rem',
    '2XL': '1.5rem',
    FULL: '9999px',
  },
  
  // Тени
  SHADOWS: {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // Анимации
  ANIMATIONS: {
    DURATION: {
      FAST: '150ms',
      NORMAL: '300ms',
      SLOW: '500ms',
    },
    EASING: {
      LINEAR: 'linear',
      EASE_IN_OUT: 'ease-in-out',
      EASE_OUT: 'ease-out',
      SPRING: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
} as const;

// ============================================================================
// МАРШРУТЫ
// ============================================================================
export const ROUTES = {
  // Публичные
  PUBLIC: {
    HOME: '/',
    LANDINGS: '/landings',
    LANDING: '/landing',
    LANDING_V2: '/v2',
    LANDING_NEW: '/landing-new',
    PRESENTATION: '/presentation',
    WHITEPAPER: '/whitepaper',
    ROADMAP: '/roadmap',
    TOKENOMICS: '/tokenomics',
    ECONOMIC_MODEL: '/economic-model',
    INVESTMENT: '/investment',
    PRICING: '/pricing',
    LOGIN: '/login',
    REGISTER: '/register',
    AUTH_CALLBACK: '/auth/callback',
    TELEGRAM_AUTH: '/telegram-auth',
    SPECIALISTS: '/specialists',
    SPECIALIST_PROFILE: '/specialist/:username',
  },
  
  // Защищённые (User)
  PROTECTED: {
    DASHBOARD: '/dashboard',
    HEALTH_CENTER: '/health-center',
    HEALTH: '/health',
    HEALTH_MODULE: '/health/:moduleId',
    CALENDAR: '/calendar',
    HABITS: '/habits',
    JOURNAL: '/journal',
    AI_CHAT: '/ai-chat',
    WALLET: '/wallet',
    DOCUMENTS: '/documents',
    SHOP: '/shop',
    MAP: '/map',
    NEWS: '/news',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    SOCIAL: '/social',
  },
  
  // Специалист
  SPECIALIST: {
    DASHBOARD: '/specialist/dashboard',
    SCHEDULE: '/specialist/schedule',
    CLIENTS: '/specialist/clients',
    EARNINGS: '/specialist/earnings',
    REVIEWS: '/specialist/reviews',
    SETTINGS: '/specialist/settings',
  },
  
  // Центр / Бизнес
  BUSINESS: {
    DASHBOARD: '/business/dashboard',
    PROFILE: '/business/profile',
    OFFERS: '/business/offers',
    SUBSCRIPTIONS: '/business/subscriptions',
    CASHBACK: '/business/cashback',
    REFERRALS: '/business/referrals',
    ANALYTICS: '/business/analytics',
    STAFF: '/business/staff',
    CLIENTS: '/business/clients',
    SETTINGS: '/business/settings',
  },
  
  // Админ
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SPECIALISTS: '/admin/specialists',
    CENTERS: '/admin/centers',
    BUSINESSES: '/admin/businesses',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;

// ============================================================================
// ОНБОРДИНГ
// ============================================================================
export const ONBOARDING = {
  STEPS: [
    {
      id: 'mood',
      title: 'Текущее состояние',
      description: 'Оцените ваше текущее самочувствие',
      required: true,
    },
    {
      id: 'goals',
      title: 'Цели',
      description: 'Выберите приоритетные цели здоровья',
      required: true,
    },
    {
      id: 'activity',
      title: 'Активность',
      description: 'Ваш уровень физической активности',
      required: true,
    },
    {
      id: 'sleep',
      title: 'Сон',
      description: 'Качество и продолжительность сна',
      required: true,
    },
    {
      id: 'nutrition',
      title: 'Питание',
      description: 'Ваши пищевые привычки',
      required: true,
    },
    {
      id: 'stress',
      title: 'Стресс',
      description: 'Уровень стресса и методы управления',
      required: true,
    },
    {
      id: 'medical_history',
      title: 'Здоровье',
      description: 'Травмы, заболевания, противопоказания',
      required: false,
    },
    {
      id: 'lifestyle',
      title: 'Образ жизни',
      description: 'Вредные привычки, предпочтения',
      required: false,
    },
    {
      id: 'specialists',
      title: 'Специалисты',
      description: 'Работаете ли вы со специалистами',
      required: false,
    },
    {
      id: 'plan',
      title: 'Персональный план',
      description: 'Ваша программа здоровья',
      required: true,
    },
  ],
  
  RESEARCH_LINKS: {
    SLEEP: 'https://sleepfoundation.org/sleep-hygiene',
    NUTRITION: 'https://nutrition.org/nutrition-science',
    EXERCISE: 'https://acsm.org/exercise-guidelines',
    STRESS: 'https://apa.org/topics/stress',
  },
} as const;

// ============================================================================
// ТОКЕНОМИКА
// ============================================================================
export const TOKENOMICS = {
  TOKEN_NAME: 'UNITY',
  TOKEN_SYMBOL: 'UNITY',
  DECIMALS: 18,
  
  // Курсы обмена
  EXCHANGE_RATES: {
    UNITY_USD: 0.01, // 1 UNITY = $0.01
    USD_UNITY: 100,  // $1 = 100 UNITY
  },
  
  // Способы заработка
  EARN_METHODS: {
    DAILY_LOGIN: 10,           // UNITY за ежедневный вход
    COMPLETE_GOAL: 50,         // UNITY за завершение цели
    WEEKLY_STREAK: 100,        // UNITY за недельную серию
    MONTHLY_STREAK: 500,       // UNITY за месячную серию
    REFER_FRIEND: 200,         // UNITY за приглашённого друга
    COMPLETE_ONBOARDING: 1000, // UNITY за завершение онбординга
    WORKOUT_COMPLETED: 25,     // UNITY за тренировку
    MEAL_LOGGED: 5,            // UNITY за запись приёма пищи
    SLEEP_TRACKED: 10,         // UNITY за трекинг сна
    JOURNAL_ENTRY: 15,         // UNITY за запись в журнале
  },
  
  // Способы трат
  SPEND_METHODS: {
    SPECIALIST_CONSULTATION: 5000,  // UNITY за консультацию
    PREMIUM_SUBSCRIPTION_MONTH: 10000, // UNITY за месяц премиум
    PREMIUM_SUBSCRIPTION_YEAR: 100000, // UNITY за год премиум
    MARKETPLACE_PURCHASE: 0,       // UNITY за покупку (variable)
    CASHBACK_CONVERSION: 0,        // Конвертация кэшбэка (variable)
  },
  
  // Кэшбэк программы
  CASHBACK_RATES: {
    SPECIALIST_REFERRAL: 0.05,     // 5% кэшбэк за рекомендацию специалиста
    SHOP_REFERRAL: 0.03,           // 3% кэшбэк за рекомендацию магазина
    CENTER_REFERRAL: 0.07,         // 7% кэшбэк за рекомендацию центра
    SUBSCRIPTION_REFERRAL: 0.10,   // 10% кэшбэк за подписку
  },
  
  // Уровни подписки
  SUBSCRIPTION_TIERS: {
    FREE: {
      name: 'Free',
      price_usd: 0,
      price_unity: 0,
      features: ['1 модуль', 'Базовая статистика', 'AI чат (ограничено)'],
    },
    BASIC: {
      name: 'Basic',
      price_usd: 9.99,
      price_unity: 999,
      features: ['Все модули', 'Расширенная статистика', 'AI чат'],
    },
    PREMIUM: {
      name: 'Premium',
      price_usd: 19.99,
      price_unity: 1999,
      features: ['Все модули', 'Персональный план', 'AI чат (приоритет)', 'Специалисты'],
    },
    FAMILY: {
      name: 'Family',
      price_usd: 39.99,
      price_unity: 3999,
      features: ['До 5 аккаунтов', 'Семейные цели', 'Все функции Premium'],
    },
  },
} as const;

// ============================================================================
// МОДУЛИ ЗДОРОВЬЯ
// ============================================================================
export const HEALTH_MODULES = [
  {
    id: 'movement',
    name: 'Движение',
    icon: 'activity',
    description: 'Шаги, тренировки, активность, осанка',
    color: DESIGN.COLORS.MODULES.MOVEMENT,
    metrics: ['steps', 'workouts', 'active_minutes', 'calories_burned'],
  },
  {
    id: 'nutrition',
    name: 'Питание',
    icon: 'utensils',
    description: 'Калории, макросы, вода, планы питания',
    color: DESIGN.COLORS.MODULES.NUTRITION,
    metrics: ['calories', 'protein', 'carbs', 'fat', 'water'],
  },
  {
    id: 'sleep',
    name: 'Сон',
    icon: 'moon',
    description: 'Продолжительность, качество, фазы',
    color: DESIGN.COLORS.MODULES.SLEEP,
    metrics: ['duration', 'quality', 'deep_sleep', 'rem_sleep'],
  },
  {
    id: 'psychology',
    name: 'Психология',
    icon: 'brain',
    description: 'Настроение, стресс, медитации, журнал',
    color: DESIGN.COLORS.MODULES.PSYCHOLOGY,
    metrics: ['mood', 'stress', 'meditation_minutes', 'journal_entries'],
  },
  {
    id: 'medicine',
    name: 'Медицина',
    icon: 'heart',
    description: 'Анализы, приёмы, медикаменты, симптомы',
    color: DESIGN.COLORS.MODULES.MEDICINE,
    metrics: ['appointments', 'medications', 'lab_results', 'vitals'],
  },
  {
    id: 'relationships',
    name: 'Отношения',
    icon: 'users',
    description: 'Социальные связи, общение, поддержка',
    color: DESIGN.COLORS.MODULES.RELATIONSHIPS,
    metrics: ['interactions', 'quality_score', 'support_score'],
  },
  {
    id: 'habits',
    name: 'Привычки',
    icon: 'sparkles',
    description: 'Трекер привычек, streaks, цели',
    color: DESIGN.COLORS.MODULES.HABITS,
    metrics: ['active_habits', 'completed', 'streak_days'],
  },
] as const;

// ============================================================================
// ОБРАБОТКА ОШИБОК
// ============================================================================
export const ERROR_MESSAGES = {
  // Аутентификация
  AUTH: {
    INVALID_CREDENTIALS: 'Неверный email или пароль',
    USER_NOT_FOUND: 'Пользователь не найден',
    EMAIL_EXISTS: 'Email уже зарегистрирован',
    TOKEN_EXPIRED: 'Срок действия токена истёк',
    TOKEN_INVALID: 'Недействительный токен',
    UNAUTHORIZED: 'Требуется авторизация',
    FORBIDDEN: 'Недостаточно прав',
  },
  
  // Сеть
  NETWORK: {
    TIMEOUT: 'Превышено время ожидания',
    OFFLINE: 'Нет подключения к интернету',
    SERVER_ERROR: 'Ошибка сервера',
    INVALID_RESPONSE: 'Неверный формат ответа',
  },
  
  // Валидация
  VALIDATION: {
    REQUIRED: 'Поле обязательно для заполнения',
    INVALID_EMAIL: 'Неверный формат email',
    INVALID_PHONE: 'Неверный формат телефона',
    PASSWORD_TOO_SHORT: 'Пароль должен быть не менее 6 символов',
    PASSWORDS_MISMATCH: 'Пароли не совпадают',
  },
  
  // Общие
  GENERIC: {
    UNKNOWN: 'Произошла неизвестная ошибка',
    TRY_AGAIN: 'Попробуйте ещё раз',
    CONTACT_SUPPORT: 'Обратитесь в поддержку',
  },
} as const;

// ============================================================================
// ЭКСПОРТ ВСЕГО
// ============================================================================
export default {
  API_CONFIG,
  ENDPOINTS,
  ROLES,
  ROLE_PERMISSIONS,
  DESIGN,
  ROUTES,
  ONBOARDING,
  TOKENOMICS,
  HEALTH_MODULES,
  ERROR_MESSAGES,
};
