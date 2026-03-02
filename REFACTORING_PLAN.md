# 📋 План оптимизации структуры EthoLife

## 🎯 Цель
Создать логичную, поддерживаемую структуру проекта для упрощения разработки и масштабирования.

---

## 📁 Новая структура папок

### Текущая проблема:
```
client/src/pages/
├── LandingPage.tsx
├── Dashboard.tsx
├── DashboardV2.tsx
├── HealthCenter.tsx
├── Login.tsx
├── Register.tsx
├── ... (ещё 70+ файлов в одной директории)
```

### Целевая структура:
```
client/src/
├── config/                      # ✅ Уже есть
│   └── index.ts
│
├── contexts/                    # ✅ Уже есть
│   ├── AuthContext.tsx
│   ├── UserContext.tsx
│   └── ThemeContext.tsx
│
├── components/
│   ├── ui/                      # Базовые UI компоненты
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── common/                  # Общие компоненты
│   │   ├── Header.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── health/                  # Health модули
│   │   ├── ModuleCard.tsx
│   │   ├── DailyScoreRing.tsx
│   │   └── ...
│   │
│   ├── dashboard/               # Dashboard компоненты
│   │   ├── DashboardWidgets.tsx
│   │   ├── StatCard.tsx
│   │   └── ...
│   │
│   ├── auth/                    # Auth компоненты
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ...
│   │
│   └── admin/                   # Admin компоненты
│       ├── AdminSidebar.tsx
│       ├── UserTable.tsx
│       └── ...
│
├── pages/
│   ├── public/                  # Публичные страницы
│   │   ├── LandingPage.tsx
│   │   ├── LandingsPage.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── GoogleCallback.tsx
│   │   └── index.ts             # Экспорты
│   │
│   ├── onboarding/              # Онбординг
│   │   ├── DeepOnboarding.tsx
│   │   ├── steps/
│   │   │   ├── MoodStep.tsx
│   │   │   ├── GoalsStep.tsx
│   │   │   └── ...
│   │   └── index.ts
│   │
│   ├── protected/               # Защищённые (User)
│   │   ├── Dashboard.tsx
│   │   ├── HealthCenter.tsx
│   │   ├── AIChat.tsx
│   │   ├── Calendar.tsx
│   │   ├── Habits.tsx
│   │   ├── Journal.tsx
│   │   ├── Wallet.tsx
│   │   ├── Documents.tsx
│   │   ├── Shop.tsx
│   │   ├── Map.tsx
│   │   ├── News.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── index.ts
│   │
│   ├── health/                  # Модули здоровья
│   │   ├── HealthDashboard.tsx
│   │   ├── MovementModule.tsx
│   │   ├── NutritionModule.tsx
│   │   ├── SleepModule.tsx
│   │   ├── PsychologyModule.tsx
│   │   ├── MedicineModule.tsx
│   │   ├── RelationshipsModule.tsx
│   │   ├── HabitsModule.tsx
│   │   └── index.ts
│   │
│   ├── specialist/              # Кабинет специалиста
│   │   ├── Dashboard.tsx
│   │   ├── Schedule.tsx
│   │   ├── Clients.tsx
│   │   ├── Earnings.tsx
│   │   ├── Reviews.tsx
│   │   ├── Settings.tsx
│   │   └── index.ts
│   │
│   ├── business/                # Кабинет бизнеса
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── Offers.tsx
│   │   ├── Subscriptions.tsx
│   │   ├── Cashback.tsx
│   │   ├── Referrals.tsx
│   │   ├── Analytics.tsx
│   │   ├── Staff.tsx
│   │   ├── Clients.tsx
│   │   └── index.ts
│   │
│   ├── center/                  # Центр здоровья
│   │   ├── CRM.tsx
│   │   ├── Analytics.tsx
│   │   └── index.ts
│   │
│   ├── admin/                   # Админ панель
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Specialists.tsx
│   │   ├── Businesses.tsx
│   │   ├── Centers.tsx
│   │   ├── Analytics.tsx
│   │   ├── Settings.tsx
│   │   ├── Moderation.tsx
│   │   └── index.ts
│   │
│   ├── social/                  # Социальные
│   │   ├── Friends.tsx
│   │   ├── Messages.tsx
│   │   ├── CreatePost.tsx
│   │   ├── CreateStory.tsx
│   │   ├── UserProfile.tsx
│   │   └── index.ts
│   │
│   ├── specialists/             # Специалисты (публичные)
│   │   ├── SpecialistsCatalog.tsx
│   │   ├── SpecialistProfile.tsx
│   │   ├── Booking.tsx
│   │   └── index.ts
│   │
│   ├── info/                    # Информация
│   │   ├── Roadmap.tsx
│   │   ├── Tokenomics.tsx
│   │   ├── Whitepaper.tsx
│   │   ├── EconomicModel.tsx
│   │   ├── InvestmentProposal.tsx
│   │   ├── Pricing.tsx
│   │   ├── Presentation.tsx
│   │   └── index.ts
│   │
│   └── errors/                  # Страницы ошибок
│       ├── NotFound.tsx
│       ├── Unauthorized.tsx
│       └── index.ts
│
├── hooks/                       # Кастомные хуки
│   ├── useAuth.ts
│   ├── useRole.ts
│   ├── useTokenomics.ts
│   ├── useHealthMetrics.ts
│   └── index.ts
│
├── services/                    # API сервисы
│   ├── api.ts                   # Базовый API клиент
│   ├── auth.ts                  # Auth API
│   ├── health.ts                # Health API
│   ├── business.ts              # Business API
│   ├── specialist.ts            # Specialist API
│   ├── admin.ts                 # Admin API
│   └── tokenomics.ts            # Tokenomics API
│
├── stores/                      # Zustand stores
│   ├── healthStore.ts
│   ├── chatStore.ts
│   ├── widgetStore.ts
│   └── index.ts
│
├── types/                       # TypeScript типы
│   ├── user.ts
│   ├── health.ts
│   ├── business.ts
│   ├── specialist.ts
│   ├── admin.ts
│   └── index.ts
│
├── utils/                       # Утилиты
│   ├── errorHandler.ts
│   ├── format.ts
│   ├── validation.ts
│   ├── constants.ts
│   └── index.ts
│
└── lib/                         # Библиотеки
    ├── utils.ts
    └── ...
```

---

## 🔄 План миграции

### Этап 1: Подготовка (1-2 часа)
1. [ ] Создать новую структуру папок
2. [ ] Создать `index.ts` файлы для экспортов
3. [ ] Обновить `tsconfig.json` если нужно

### Этап 2: Перемещение компонентов (2-3 часа)
1. [ ] Переместить UI компоненты в `components/ui/`
2. [ ] Переместить общие компоненты в `components/common/`
3. [ ] Переместить health компоненты в `components/health/`
4. [ ] Переместить остальные компоненты

### Этап 3: Перемещение страниц (3-4 часа)
1. [ ] Переместить публичные страницы в `pages/public/`
2. [ ] Переместить защищённые страницы в `pages/protected/`
3. [ ] Переместить health модули в `pages/health/`
4. [ ] Переместить specialist страницы в `pages/specialist/`
5. [ ] Переместить business страницы в `pages/business/`
6. [ ] Переместить admin страницы в `pages/admin/`
7. [ ] Переместить social страницы в `pages/social/`
8. [ ] Переместить info страницы в `pages/info/`

### Этап 4: Обновление импортов (2-3 часа)
1. [ ] Обновить импорты в `App.tsx`
2. [ ] Обновить импорты в компонентах
3. [ ] Проверить TypeScript ошибки
4. [ ] Запустить `pnpm run check`

### Этап 5: Тестирование (1-2 часа)
1. [ ] Протестировать все маршруты
2. [ ] Проверить сборку `pnpm run build`
3. [ ] Исправить ошибки

---

## 📝 Скрипт для автоматизации

```bash
#!/bin/bash
# migrate-structure.sh

# Создать структуру
mkdir -p client/src/pages/{public,onboarding,protected,health,specialist,business,center,admin,social,specialists,info,errors}
mkdir -p client/src/components/{ui,common,health,dashboard,auth,admin}
mkdir -p client/src/{services,stores,types,hooks}

echo "Структура создана!"
```

---

## ✅ Чеклист после миграции

- [ ] Все файлы перемещены
- [ ] Все импорты обновлены
- [ ] TypeScript компилируется без ошибок
- [ ] Сборка работает
- [ ] Все маршруты работают
- [ ] Документация обновлена

---

**Время выполнения:** 8-12 часов  
**Сложность:** Средняя  
**Риски:** Низкие (можно откатить через git)
