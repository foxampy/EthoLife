# 🚀 EthoLife - Quick Start Guide

## 📋 Что было сделано

### ✅ Завершённые задачи

1. **Страница выбора лендингов** (`/landings`)
   - 5 версий лендингов для просмотра
   - Сравнение функций и статусов
   - Рекомендации по использованию

2. **Централизованная конфигурация**
   - Файл: `client/src/config/index.ts`
   - API endpoints, роли, дизайн-система, токеномика, ошибки

3. **Архитектурный документ**
   - Файл: `COMPREHENSIVE_ARCHITECTURE.md`
   - Полное описание архитектуры и план реализации

4. **Защита маршрутов**
   - Все маршруты защищены через `ProtectedRoute`
   - Поддержка ролей (user, specialist, center_admin, etc.)

5. **Единая аутентификация**
   - Обновлён `AuthContext.tsx`
   - Поддержка Email, Google, Telegram

6. **Глубокий онбординг** (спроектирован)
   - 10 шагов с исследованиями
   - Медицинская история, образ жизни, цели

7. **Токеномика UNITY** (спроектирована)
   - Earn методы (активность, цели, рефералы)
   - Spend методы (подписки, специалисты, маркетплейс)
   - Кэшбэк система (3-10% с покупок)

8. **Ролевая модель** (спроектирована)
   - User, Specialist, Partner, Business Owner, Shop Owner, Center Admin, Admin

---

## 🔧 Быстрая настройка

### 1. Создайте файл `.env`

```bash
# Supabase (ОБЯЗАТЕЛЬНО)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# JWT Secret (ОБЯЗАТЕЛЬНО)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Google OAuth (ОПЦИОНАЛЬНО)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Telegram Bot (ОПЦИОНАЛЬНО)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# API URL
VITE_API_URL=/api
```

### 2. Установка и запуск

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm run dev

# Приложение доступно на http://localhost:3000
```

### 3. Проверка аутентификации

```
1. Перейдите на /register
2. Создайте аккаунт
3. Должна быть переадресация на /onboarding
4. Проверьте /login → вход → редирект на /dashboard
5. Попробуйте /dashboard без входа → редирект на /login
```

---

## 📁 Структура проекта

```
EthoLife/
├── client/src/
│   ├── config/              # ✅ Централизованная конфигурация
│   │   └── index.ts
│   ├── contexts/
│   │   └── AuthContext.tsx  # ✅ Единая аутентификация
│   ├── components/
│   │   └── ProtectedRoute.tsx  # ✅ Защита маршрутов
│   ├── pages/
│   │   ├── LandingsPage.tsx    # ✅ Выбор лендингов
│   │   ├── Login.tsx           # ✅ Обновлён
│   │   ├── Register.tsx        # ✅ Обновлён
│   │   └── ...
│   └── App.tsx              # ✅ Все маршруты защищены
│
├── server/
│   ├── routes/
│   │   └── auth.ts          # Аутентификация
│   └── middleware/
│       └── auth.ts          # Проверка токена
│
└── docs/
    ├── AUTH_SETUP_GUIDE.md
    ├── ARCHITECTURE_OVERVIEW.md
    ├── COMPREHENSIVE_ARCHITECTURE.md
    └── QUICK_START.md       # Этот файл
```

---

## 🎯 Ключевые файлы

| Файл | Описание |
|------|----------|
| `client/src/config/index.ts` | Централизованная конфигурация |
| `client/src/contexts/AuthContext.tsx` | Единая аутентификация |
| `client/src/components/ProtectedRoute.tsx` | Защита маршрутов |
| `client/src/pages/LandingsPage.tsx` | Выбор лендингов |
| `client/src/App.tsx` | Маршрутизация с защитой |
| `COMPREHENSIVE_ARCHITECTURE.md` | Полная архитектура |

---

## 🗺️ Доступные маршруты

### Публичные
```
/                    - Основной лендинг
/landings            - Выбор лендингов ✅ NEW
/landing             - Оригинальный лендинг
/v2                  - Лендинг V2
/landing-new         - Новый лендинг (рекомендуется)
/newstyle            - Новый стиль
/presentation        - Презентация
/login               - Вход
/register            - Регистрация
/specialists         - Каталог специалистов
```

### Защищённые (требуют авторизации)
```
/dashboard           - Дашборд
/health-center       - Центр здоровья
/health/*            - Модули здоровья
/ai-chat             - AI чат
/calendar            - Календарь
/habits              - Привычки
/journal             - Журнал
/wallet              - Кошелёк
/specialists         - Специалисты
/map                 - Карта
/settings            - Настройки
```

### Бизнес / Специалисты
```
/specialist/dashboard    - Дашборд специалиста
/business/dashboard      - Дашборд бизнеса
/center/crm              - CRM центра
/admin/dashboard         - Админ панель
```

---

## 🎨 Дизайн-система

### Цвета (OKLCH)
```css
--primary: oklch(0.32 0.14 245);      /* Deep Blue */
--secondary: oklch(0.52 0.09 245);    /* Medium Blue */
--accent: oklch(0.22 0.03 245);       /* Dark Gray */
--background: oklch(0.99 0.002 245);  /* Premium White */
```

### Модули здоровья
```typescript
MOVEMENT:     { primary: '#3B82F6', bg: 'bg-blue-50' }
NUTRITION:    { primary: '#10B981', bg: 'bg-green-50' }
SLEEP:        { primary: '#8B5CF6', bg: 'bg-purple-50' }
PSYCHOLOGY:   { primary: '#F59E0B', bg: 'bg-amber-50' }
MEDICINE:     { primary: '#EF4444', bg: 'bg-red-50' }
RELATIONSHIPS:{ primary: '#EC4899', bg: 'bg-pink-50' }
HABITS:       { primary: '#06B6D4', bg: 'bg-cyan-50' }
```

---

## 💰 Токеномика (кратко)

### Заработок UNITY
```
Ежедневный вход:     10 UNITY
Завершение цели:     50 UNITY
Недельная серия:     100 UNITY
Реферал:             200 UNITY
Тренировка:          25 UNITY
Запись приёма пищи:  5 UNITY
Сон:                 10 UNITY
Онбординг:           1000 UNITY
```

### Траты UNITY
```
Basic подписка:      999 UNITY/мес
Premium подписка:    1999 UNITY/мес
Консультация:        3000-15000 UNITY
Кэшбэк:              1-10% с покупок
```

---

## 🔐 Роли и доступы

| Роль | Доступ |
|------|--------|
| `user` | Дашборд, модули здоровья, AI чат, специалисты |
| `specialist` | + управление клиентами, расписанием, доходы |
| `business_owner` | + создание офферов, подписок, кэшбэка |
| `center_admin` | + CRM, управление персоналом |
| `admin` | Полный доступ ко всем функциям |

---

## 📱 Навигация (оптимизирована)

### Bottom Navigation
```
[Здоровье] [AI Чат] [Дашборд] [Меню]
```

### Меню (вторичная навигация)
```
Календарь, Привычки, Журнал, Кошелёк,
Специалисты, Карта, Магазин, Настройки
```

---

## 🛠️ Следующие шаги

### Неделя 1-2
- [ ] Telegram auto-auth реализация
- [ ] Обновление структуры папок
- [ ] Миграции базы данных (роли)

### Неделя 3-4
- [ ] Профили для бизнесов (CRUD)
- [ ] Система подписок
- [ ] Кэшбэк логика

### Неделя 5-6
- [ ] AI Chat интеграция
- [ ] Глубокий онбординг (10 шагов)
- [ ] Токеномика реализация

### Неделя 7-8
- [ ] Админ панель
- [ ] Настраиваемый дашборд
- [ ] Тестирование и полировка

---

## 📞 Поддержка

### Документация
- `AUTH_SETUP_GUIDE.md` - Настройка аутентификации
- `ARCHITECTURE_OVERVIEW.md` - Архитектурный обзор
- `COMPREHENSIVE_ARCHITECTURE.md` - Полная архитектура
- `QUICK_START.md` - Этот файл

### При возникновении проблем
1. Проверьте `.env` файл
2. Проверьте консоль браузера
3. Проверьте логи сервера
4. Убедитесь что Supabase активен

---

## ✅ Чеклист готовности

- [x] `.env` файл создан и заполнен
- [x] `pnpm install` выполнен
- [x] `pnpm run dev` запущен
- [x] `/landings` страница работает
- [x] Регистрация работает
- [x] Вход работает
- [x] Защита маршрутов работает
- [x] Документация изучена

---

**Версия:** 3.0  
**Дата:** 2026-03-02  
**Статус:** ✅ Готово к использованию

**Приложение готово! Откройте http://localhost:3000** 🎉
