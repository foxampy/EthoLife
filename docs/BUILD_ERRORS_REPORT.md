# Отчёт об ошибках сборки EthoLife

**Дата:** 01.03.2026  
**Всего ошибок:** ~150  
**Критических:** ~40  
**Предупреждений:** ~110

---

## 🔴 КРИТИЧЕСКИЕ ОШИБКИ (Блокируют сборку)

### 1. Ошибки типа User (Token, Name, Full_name)

**Файлы:**
- `client/src/components/Header.tsx(64,72)`
- `client/src/pages/AIChat.tsx(31,34,39,53,81,137)`
- `client/src/pages/UserProfile.tsx(102,103,165,261,262)`
- `client/src/pages/CreatePost.tsx(232,235)`
- `client/src/pages/DashboardV2.tsx(281)`

**Проблема:** Тип `User` не содержит полей `token`, `name`, `full_name`, `id`

**Решение:** Обновить интерфейс User в `client/src/contexts/AuthContext.tsx` или `client/src/types/index.ts`:

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  token?: string;
  // ... остальные поля
}
```

### 2. Ошибки Card/title (Самые массовые)

**Файлы:** 30+ страниц
- `client/src/pages/AIChat.tsx`
- `client/src/pages/Booking.tsx`
- `client/src/pages/CreatePost.tsx`
- `client/src/pages/CreateStory.tsx`
- `client/src/pages/CryptoPayment.tsx`
- `client/src/pages/DashboardV2.tsx`
- `client/src/pages/Wallet.tsx`
- И многие другие...

**Проблема:** В компонент Card передаётся проп `title`, но его там нет

**Пример ошибки:**
```tsx
<Card title="Some title">  // ❌ Ошибка!
  {children}
</Card>
```

**Решение:** Использовать правильный API Card:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Some title</CardTitle>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

### 3. Ошибка i18n replace

**Файл:** `client/src/i18n/index.tsx(56,65)`

**Проблема:** Некорректная работа с Object.entries

**Код с ошибкой:**
```typescript
return Object.entries(params).reduce(
  (acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), String(val)),
  value
);
```

**Решение:** Уже исправлено, проверить работу.

### 4. Отсутствующие модули middleware/auth

**Файлы:**
- `server/routes/ai.ts`
- `server/routes/auth.ts`
- `server/routes/auth-pg.ts`
- `server/routes/payments.ts`

**Проблема:** Функции не экспортируются из `server/middleware/auth.ts`:
- `generateToken`
- `authMiddleware`
- `requireSubscription`

**Решение:** Создать/обновить `server/middleware/auth.ts`:

```typescript
import jwt from 'jsonwebtoken';

export function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function authMiddleware(req: any, res: any, next: any) {
  // ...
}

export function requireSubscription(req: any, res: any, next: any) {
  // ...
}
```

### 5. Отсутствующие функции supabase/client

**Файлы:**
- `server/routes/auth.ts`
- `server/routes/payments.ts`

**Проблема:** Не экспортируются:
- `createUserProfile`
- `getUserByEmail`
- `getSubscriptionPlan`
- `createSubscription`
- `awardTokens`

**Решение:** Добавить в `server/supabase/client.ts` или создать отдельные сервисы.

### 6. Ошибка @types/cors

**Файл:** `server/index.ts(2)`

**Решение:**
```bash
npm i --save-dev @types/cors
```

---

## 🟡 ОШИБКИ ТИПОВ (Нужно исправить)

### 7. Ошибки enum/union types

**Файлы:**
- `client/src/components/AIChat.tsx(58-63)` - Type 'string' not assignable to 'AIQuickQuestion'
- `client/src/pages/DashboardV2.tsx(196)` - trend: string vs "up" | "down" | "neutral"
- `client/src/components/JournalStats.tsx(53)` - "chart" | "heart" | "trending" | "calendar"

**Решение:** Использовать `as const` или правильные типы.

### 8. Ошибки в опросниках

**Файлы:**
- `client/src/data/questionnaires/relationships.ts`
- `client/src/data/questionnaires/sleep.ts`

**Проблема:** Поля `showIf`, `helpText` не существуют в типе `Question`

**Решение:** Расширить тип Question или убрать лишние поля.

### 9. Ошибки в компонентах

**Файлы:**
- `client/src/components/interactive/WeightSelector.tsx(129-130)` - операторы с объектами
- `client/src/components/JournalEditor.tsx(198)` - Conversion string[] to MoodLevel[]
- `client/src/components/JournalList.tsx(16)` - description prop
- `client/src/components/SettingsPanel.tsx(121)` - сравнение строк
- `client/src/components/Stories.tsx(178)` - title prop

### 10. Дублирующиеся идентификаторы

**Файл:** `client/src/pages/Medicine.tsx`
- Duplicate identifier 'Upload'

### 11. Ошибки в telegram.ts

**Файл:** `client/src/utils/telegram.ts(67,82)`
- Duplicate identifier 'ready'

### 12. Ошибки MariaDashboard

**Файл:** `client/src/pages/MariaDashboard.tsx(274,277,361,365)`
- Property 'technique' does not exist

### 13. Ошибки server/api

**Файлы:**
- `server/api/ai.ts(224,248)` - Variable 'aiResponse' used before assigned
- `server/api/center.ts(72)` - Parameter 'sum', 'a' implicitly has 'any' type
- `server/api/social.ts(666)` - Parameter 'f' implicitly has 'any' type

### 14. Ошибки server/routes/ai.ts

**Файл:** `server/routes/ai.ts`
- Property 'id' does not exist on type '{ userId: string; email: string; role: string; }'
- Нужно заменить `id` на `userId`

### 15. Ошибки telegram-bot.ts

**Файл:** `server/telegram-bot.ts`
- 'ctx.from' is possibly 'undefined'
- Property 'match' does not exist
- 'polling' does not exist in LaunchOptions

---

## 📊 СТАТИСТИКА ОШИБОК

### По категориям:

| Категория | Количество | Критичность |
|-----------|------------|-------------|
| Отсутствующие поля User | 25 | 🔴 Высокая |
| Card/title ошибки | 35 | 🔴 Высокая |
| Отсутствующие экспорты | 20 | 🔴 Высокая |
| Типы enum/union | 10 | 🟡 Средняя |
| Опросники | 10 | 🟡 Средняя |
| Server API | 15 | 🟡 Средняя |
| Разные типы | 35 | 🟢 Низкая |

### По файлам (топ-10):

| Файл | Ошибок |
|------|--------|
| server/routes/ai.ts | 15 |
| client/src/pages/UserProfile.tsx | 12 |
| server/routes/payments.ts | 10 |
| client/src/pages/Booking.tsx | 8 |
| client/src/pages/CreatePost.tsx | 8 |
| client/src/pages/AIChat.tsx | 8 |
| client/src/pages/Wallet.tsx | 7 |
| server/routes/auth.ts | 6 |
| client/src/pages/CreateStory.tsx | 6 |
| client/src/pages/DashboardV2.tsx | 5 |

---

## 🛠️ ПЛАН ИСПРАВЛЕНИЯ

### Приоритет 1 (Критический)

1. **Исправить тип User**
   ```bash
   # Обновить client/src/types/index.ts
   ```

2. **Исправить Card компоненты**
   ```bash
   # Заменить все <Card title="..."> на правильный синтаксис
   # Можно сделать автозаменой
   ```

3. **Создать middleware/auth.ts**
   ```bash
   # Добавить недостающие функции
   ```

4. **Установить @types/cors**
   ```bash
   npm i --save-dev @types/cors
   ```

### Приоритет 2 (Высокий)

5. **Исправить supabase клиент**
6. **Исправить server/routes/ai.ts** (заменить id на userId)
7. **Исправить типы enum**
8. **Исправить telegram-bot.ts**

### Приоритет 3 (Средний)

9. **Исправить опросники**
10. **Исправить компоненты Journal**
11. **Исправить MariaDashboard**
12. **Исправить Medicine.tsx (дубликат Upload)**

---

## ⚡ БЫСТРЫЕ ИСПРАВЛЕНИЯ

### 1. Исправить Card/title (автозамена)

```bash
# Найти все файлы с проблемой
grep -r "<Card title=" client/src/pages/ --include="*.tsx" -l

# Заменить (пример для одного файла)
# Было:
<Card title="Dashboard">
  {children}
</Card>

# Стало:
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

### 2. Исправить тип User

```typescript
// client/src/types/index.ts
export interface User {
  id: string;
  userId?: string;  // для совместимости
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  token?: string;
  role?: 'user' | 'specialist' | 'admin';
  subscription?: Subscription;
}
```

### 3. Исправить middleware/auth.ts

```typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireSubscription(req: Request, res: Response, next: NextFunction) {
  // проверка подписки
  next();
}
```

---

## 📋 КОМАНДЫ ДЛЯ ИСПРАВЛЕНИЯ

```bash
# 1. Установить недостающие типы
npm i --save-dev @types/cors

# 2. Проверить сборку после каждого этапа
npx tsc --noEmit

# 3. Запустить dev сервер
npm run dev

# 4. Сборка для production
npm run build
```

---

## ✅ ПРОВЕРКА ПОСЛЕ ИСПРАВЛЕНИЯ

- [ ] `npx tsc --noEmit` показывает 0 ошибок
- [ ] `npm run build` успешно завершается
- [ ] Dev сервер запускается без ошибок
- [ ] Главная страница загружается
- [ ] Авторизация работает
- [ ] Дашборд открывается

---

## 💡 РЕКОМЕНДАЦИИ

1. **Использовать strict TypeScript** - поможет избежать подобных ошибок
2. **Настроить ESLint** - автоматическая проверка перед коммитом
3. **Настроить Husky** - pre-commit hooks
4. **CI/CD** - GitHub Actions для проверки сборки

**Время исправления:** 4-8 часов (при последовательном подходе)
