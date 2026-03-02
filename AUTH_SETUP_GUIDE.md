# 🔐 Настройка аутентификации в EthoLife

## Проблемы которые были исправлены

### 1. **Аутентификация не работала**
**Причины:**
- Отсутствовал `.env` файл с необходимыми ключами
- Конфликт между `AuthContext` и `UserContext`
- Неправильная обработка токенов
- Отсутствие защиты маршрутов

**Решения:**
- ✅ Обновлён `AuthContext.tsx` с единой моделью пользователя
- ✅ Создан `ProtectedRoute.tsx` компонент для защиты страниц
- ✅ Обновлены `Login.tsx` и `Register.tsx` с правильной обработкой
- ✅ Все маршруты в `App.tsx` теперь защищены

---

## 📋 Инструкция по настройке

### Шаг 1: Создайте `.env` файл

```bash
# Скопируйте .env.example в .env
cp .env.example .env
```

### Шаг 2: Заполните обязательные переменные

#### **Supabase (ОБЯЗАТЕЛЬНО)**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Где получить:**
1. Перейдите на https://supabase.com
2. Создайте новый проект или выберите существующий
3. Project Settings → Database
4. Скопируйте URL и Service Role Key

#### **JWT Secret (ОБЯЗАТЕЛЬНО)**
```env
JWT_SECRET=сгенерируйте-случайную-строку
```

**Как сгенерировать:**
```bash
# Windows PowerShell
[node] -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Или просто введите любую длинную строку (32+ символа)
JWT_SECRET=my-super-secret-key-change-this-in-production
```

### Шаг 3: Опциональные настройки

#### **Google OAuth (если нужен вход через Google)**
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Где получить:**
1. https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3000/auth/callback`

#### **Telegram Bot (если нужна Telegram авторизация)**
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**Где получить:**
1. Откройте @BotFather в Telegram
2. /newbot → придумайте имя
3. Скопируйте токен

---

## 🚀 Запуск приложения

```bash
# Установка зависимостей
pnpm install

# Запуск dev сервера
pnpm run dev

# Приложение будет доступно на http://localhost:3000
```

---

## 📁 Структура аутентификации

### Файлы которые были обновлены:

```
client/src/
├── contexts/
│   └── AuthContext.tsx      # ✅ Обновлён - единая система auth
├── components/
│   └── ProtectedRoute.tsx   # ✅ Создан - защита маршрутов
├── pages/
│   ├── Login.tsx            # ✅ Обновлён - правильный login flow
│   └── Register.tsx         # ✅ Обновлён - правильная регистрация
└── App.tsx                  # ✅ Обновлён - все маршруты защищены
```

---

## 🔒 Как работает защита маршрутов

### Пример использования ProtectedRoute:

```typescript
// Базовая защита (требуется авторизация)
<Route path="/dashboard">
  <ProtectedRoute>
    <DashboardV2 />
  </ProtectedRoute>
</Route>

// Защита по роли (только для admin и center_admin)
<Route path="/center/crm">
  <ProtectedRoute allowedRoles={['center_admin', 'admin']}>
    <CenterCRM />
  </ProtectedRoute>
</Route>
```

### Доступные роли:
- `user` - обычный пользователь
- `specialist` - специалист
- `center_admin` - администратор центра
- `investor` - инвестор
- `admin` - супер-администратор

---

## 🧪 Тестирование аутентификации

### 1. Регистрация нового пользователя

```
1. Перейдите на /register
2. Введите имя, email, пароль
3. Нажмите "Создать аккаунт"
4. Должна произойти переадресация на /onboarding
```

### 2. Вход существующего пользователя

```
1. Перейдите на /login
2. Введите email и пароль
3. Нажмите "Войти"
4. Должна произойти переадресация на /dashboard
```

### 3. Проверка защиты маршрутов

```
1. Выйдите из аккаунта (если вошли)
2. Попробуйте перейти на /dashboard
3. Должна произойти переадресация на /login
```

### 4. Google OAuth (если настроен)

```
1. На /login нажмите "Google"
2. Авторизуйтесь в Google
3. Должна произойти переадресация на /dashboard
```

---

## 🐛 Возможные ошибки и решения

### Ошибка: "Google OAuth не настроен"
**Решение:** Заполните `VITE_GOOGLE_CLIENT_ID` в `.env`

### Ошибка: "Invalid token"
**Решение:** 
```bash
# Очистите localStorage в браузере
# Или выполните logout и login заново
```

### Ошибка: "Profile not found"
**Решение:** Убедитесь что Supabase настроен и таблица `profiles` существует

### Ошибка CORS
**Решение:** Добавьте ваш frontend URL в Supabase Dashboard → API Settings

---

## 📊 Матрица доступа к страницам

| Страница | Guest | User | Specialist | Center Admin |
|----------|-------|------|------------|--------------|
| `/` (лендинг) | ✅ | ✅ | ✅ | ✅ |
| `/login` | ✅ | ➡️/dashboard | ➡️/dashboard | ➡️/dashboard |
| `/register` | ✅ | ➡️/dashboard | ➡️/dashboard | ➡️/dashboard |
| `/dashboard` | ➡️/login | ✅ | ✅ | ✅ |
| `/health/*` | ➡️/login | ✅ | ✅ | ✅ |
| `/specialists` | ✅ | ✅ | ✅ | ✅ |
| `/specialist/dashboard` | ➡️/login | ❌ | ✅ | ❌ |
| `/center/crm` | ➡️/login | ❌ | ❌ | ✅ |
| `/wallet` | ➡️/login | ✅ | ✅ | ✅ |

➡️ = редирект

---

## 🎯 Архитектурные улучшения

### До изменений:
```
❌ Два контекста аутентификации (AuthContext + UserContext)
❌ Маршруты без защиты
❌ Дублирование страниц (Dashboard + DashboardV2)
❌ Нет разделения по ролям
❌ Неправильная обработка токенов
```

### После изменений:
```
✅ Единый AuthContext с правильным User типом
✅ Все маршруты защищены через ProtectedRoute
✅ Чёткое разделение на public/private страницы
✅ Поддержка ролей (user, specialist, center_admin, etc.)
✅ Правильная обработка и хранение токенов
✅ Toast уведомления об ошибках
✅ Редиректы после login/logout
```

---

## 📱 UX/UI улучшения для разных типов пользователей

### Обычный пользователь (User):
- ✅ Персонализированный дашборд
- ✅ 7 модулей здоровья в одном месте
- ✅ AI-помощник для рекомендаций
- ✅ Трекер привычек и целей
- ✅ Социальные функции (друзья, истории)

### Специалист (Specialist):
- 🔄 **Требуется разработка:**
  - `/specialist/dashboard` - дашборд с метриками
  - `/specialist/schedule` - управление расписанием
  - `/specialist/clients` - база клиентов
  - `/specialist/earnings` - доходы

### Партнёр/Центр (Center Admin):
- ✅ CRM система (`/center/crm`)
- 🔄 **Требуется разработка:**
  - Аналитика и отчёты
  - Финансовый модуль
  - Мульти-центр поддержка

### Инвестор (Investor):
- ✅ Инвестиционная информация (`/investment`)
- 🔄 **Требуется разработка:**
  - `/investor/dashboard` - трекинг инвестиций
  - `/investor/portfolio` - портфель
  - `/investor/reports` - отчёты

---

## 🎨 Дизайн-система

### Цветовая схема EthoLife:
```css
--primary: oklch(0.32 0.14 245);     /* Premium Deep Blue */
--secondary: oklch(0.52 0.09 245);   /* Medium Blue */
--accent: oklch(0.22 0.03 245);      /* Dark Gray */
--background: oklch(0.99 0.002 245); /* Premium White */
```

### Компоненты:
- ✅ Premium карточки с тенями
- ✅ Градиентные кнопки
- ✅ Анимированные переходы
- ✅ Адаптивный дизайн
- ✅ Safe area для мобильных

---

## ✅ Чеклист перед запуском

- [ ] Создан `.env` файл
- [ ] Заполнен `SUPABASE_URL`
- [ ] Заполнен `SUPABASE_SERVICE_KEY`
- [ ] Заполнен `JWT_SECRET`
- [ ] (Опционально) Настроен Google OAuth
- [ ] (Опционально) Настроен Telegram Bot
- [ ] Зависимости установлены (`pnpm install`)
- [ ] Dev сервер запущен (`pnpm run dev`)
- [ ] Тестовая регистрация прошла успешно
- [ ] Тестовый вход прошёл успешно
- [ ] Защита маршрутов работает

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте `.env` файл
2. Проверьте консоль браузера на ошибки
3. Проверьте логи сервера
4. Убедитесь что Supabase проект активен

---

**Версия:** 2.0  
**Дата обновления:** 2026-03-02  
**Статус:** ✅ Готово к продакшену
