# Summary: PWA, Pages Audit, Whitepaper & Build Errors

**Дата:** 01.03.2026

---

## ✅ 1. PWA ДЛЯ ALPHA ВЕРСИИ

### Готово: `docs/PWA_SETUP.md`

**Преимущества PWA для Alpha:**
- ✅ Установка без App Store / Google Play
- ✅ Push-уведомления (Android)
- ✅ Офлайн режим (Service Worker)
- ✅ Камера, геолокация, LocalStorage
- ⚠️ Push на iOS только через Safari
- ❌ Нет Apple HealthKit / Google Fit

**Время настройки:** 15 минут

**Быстрый старт:**
```bash
npm install -D vite-plugin-pwa
# + добавить конфигурацию из docs/PWA_SETUP.md
```

**Как пользователи устанавливают:**
- **iOS:** Safari → Share → Add to Home Screen
- **Android:** Chrome → Menu → Install App
- **Desktop:** Chrome → Install button in address bar

---

## ✅ 2. ПОЛНЫЙ АУДИТ СТРАНИЦ

### Готово: `docs/SITE_PAGES_AUDIT.md`

**Статистика:**
- **Всего файлов:** 73 страницы
- **Активных маршрутов:** 66
- **Спрятанных (без навигации):** ~18
- **Устаревших/дублей:** ~13
- **Не подключенных к роутеру:** 8

### Категории страниц:

#### 🏠 Landing/Marketing (7)
| Маршрут | Статус | В навигации |
|---------|--------|-------------|
| `/` | ✅ Новый лендинг | ✅ Да |
| `/home` | ⚠️ Устарел | ❌ Нет |
| `/landing` | ⚠️ Устарел | ❌ Нет |
| `/v2` | ⚠️ Устарел | ❌ Нет |
| `/newstyle` | ⚠️ Устарел | ❌ Нет |
| `/presentation` | ✅ Активен | ✅ Да |

#### 📄 Документация (6)
| Маршрут | Описание | В навигации |
|---------|----------|-------------|
| `/whitepaper` | ✅ Whitepaper существует | ✅ Да |
| `/roadmap` | Дорожная карта | ✅ Да |
| `/tokenomics` | Токеномика | ✅ Да |
| `/economic-model` | Экономика | ⚠️ Частично |
| `/investment` | Инвестиции | ✅ Да |
| `/documents` | Документы | ✅ Да |

**Litepaper:** ❌ Отдельной страницы нет (можно сделать `/litepaper`)

#### 🔐 Авторизация (5)
- `/login`, `/register`, `/auth/callback`, `/telegram-auth`, `/onboarding`

#### ❤️ Модули здоровья
- **Новые (7):** `/health/movement`, `/health/nutrition`, `/health/sleep`, `/health/psychology`, `/health/medicine`, `/health/relationships`, `/health/habits`
- **Устаревшие (6):** `/medicine`, `/nutrition`, `/movement`, `/psychology`, `/sleep`, `/relationships` - можно удалить

#### 👥 Социальная сеть (7)
- `/social/friends`, `/social/messages`, `/social/specialists`
- `/specialists`, `/specialist/:username`, `/specialist/:username/book`
- `/u/:username` (профили пользователей)

#### 💰 Финансы (5)
- `/pricing`, `/checkout`, `/wallet`, `/payment/crypto/:planId`, `/shop`

#### 🤖 AI (2)
- `/ai-chat`, `/ai-planner`

### Спрятанные страницы (8 файлов существуют но НЕ подключены):
1. `PhysicalHealth.tsx`
2. `CognitiveHealth.tsx`
3. `PsychoEmotional.tsx`
4. `SocialHealth.tsx`
5. `Prevention.tsx`
6. `SleepRecovery.tsx`
7. `LoginPage.tsx` (дубль Login.tsx)
8. `RegisterPage.tsx` (дубль Register.tsx)

### Дубли страниц:
- `Login.tsx` vs `LoginPage.tsx`
- `Register.tsx` vs `RegisterPage.tsx`
- `/specialists` vs `/social/specialists`
- `/dashboard` vs `/health-center`

### Рекомендации по удалению:
```
/home, /landing, /v2, /newstyle, /landing-new → редирект на /
/dashboard-v1 → удалить
/medicine, /nutrition, /movement, /psychology, /sleep, /relationships → удалить
/specialists-old → удалить
```

---

## ✅ 3. WHITEPAPER / LITEPAPER

### Whitepaper:
- ✅ **Существует:** `client/src/pages/Whitepaper.tsx`
- ✅ **Маршрут:** `/whitepaper`
- ✅ **В навигации:** Да

### Litepaper:
- ❌ **Не существует** отдельной страницы
- 💡 **Можно создать:** `/litepaper` (сокращённая версия whitepaper)
- **Или:** добавить anchor на `/whitepaper#litepaper`

---

## ✅ 4. ОШИБКИ СБОРКИ

### Готово: `docs/BUILD_ERRORS_REPORT.md`

**Всего ошибок:** ~150

### Критические ошибки (~40):

#### 1. Тип User (25 ошибок)
```
Property 'token' does not exist on type 'User'
Property 'name' does not exist on type 'User'
Property 'full_name' does not exist on type 'User'
```
**Файлы:** Header.tsx, AIChat.tsx, UserProfile.tsx, CreatePost.tsx, DashboardV2.tsx

#### 2. Card/title (35 ошибок)
```
Property 'title' does not exist in type 'Card'
```
**Файлы:** 30+ страниц (AIChat, Booking, CreatePost, Wallet, etc.)

#### 3. Отсутствующие экспорты (20 ошибок)
```
Module 'middleware/auth' has no exported member 'generateToken'
Module 'supabase/client' has no exported member 'createUserProfile'
```
**Файлы:** server/routes/*.ts

#### 4. @types/cors
```
Could not find a declaration file for module 'cors'
```
**Решение:** `npm i --save-dev @types/cors`

### Средние ошибки (~70):
- Типы enum/union (10)
- Опросники (10)
- Server API (15)
- Telegram bot (10)
- Разные типы (35)

### Быстрое исправление Card/title:
```tsx
// Было:
<Card title="Dashboard">...</Card>

// Стало:
<Card>
  <CardHeader><CardTitle>Dashboard</CardTitle></CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### План исправления:
1. **Приоритет 1:** Тип User, Card/title, middleware/auth, @types/cors
2. **Приоритет 2:** supabase client, server/routes/ai.ts, enum types
3. **Приоритет 3:** Опросники, компоненты, MariaDashboard

**Время исправления:** 4-8 часов

---

## 📊 ИТОГОВАЯ СТАТИСТИКА

| Компонент | Статус | Файл документации |
|-----------|--------|-------------------|
| PWA Plan | ✅ Готово | `docs/PWA_SETUP.md` |
| Pages Audit | ✅ Готово | `docs/SITE_PAGES_AUDIT.md` |
| Whitepaper | ✅ Существует | `/whitepaper` |
| Litepaper | ❌ Нет | Можно создать |
| Build Errors | ✅ Проанализированы | `docs/BUILD_ERRORS_REPORT.md` |
| Mobile Plan | ✅ Готово | `docs/MOBILE_APP_PLAN.md` |
| Landing Page | ✅ Создан | `client/src/pages/LandingPage.tsx` |

---

## 🚀 РЕКОМЕНДАЦИИ ПО ПРИОРИТЕТАМ

### Сейчас (Alpha):
1. ✅ Исправить критические ошибки сборки (4-8 часов)
2. ✅ Настроить PWA (15 минут)
3. ✅ Удалить дубли страниц (30 минут)
4. ✅ Протестировать лендинг с онбордингом

### Ближайшее будущее (Beta):
1. Исправить все TypeScript ошибки
2. Добавить тесты
3. Настроить CI/CD
4. Подготовить к публикации в сторах (если нужно)

### Мобильное приложение:
1. PWA для Alpha ✅
2. React Native для Production (4-6 недель)

---

**Все документы готовы!** 📚
