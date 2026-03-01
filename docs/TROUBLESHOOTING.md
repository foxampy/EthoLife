# Устранение проблем с Telegram ботом и аутентификацией

## Проверка 1: Webhook настроен?

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/getwebhookinfo`
3. Должен быть показан URL: `https://your-project.vercel.app/api/telegram/webhook`

Если webhook не настроен:
```
/setwebhook
https://your-project.vercel.app/api/telegram/webhook
```

## Проверка 2: Переменные окружения

В Vercel Dashboard → Settings → Environment Variables должны быть:

- ✅ `TELEGRAM_BOT_TOKEN` - токен бота
- ✅ `DATABASE_URL` - строка подключения к базе данных

## Проверка 3: Тестовый endpoint

Откройте в браузере:
```
https://your-project.vercel.app/api/telegram/test
```

Должен вернуть JSON с информацией о статусе.

## Проверка 4: Логи в Vercel

1. Откройте Vercel Dashboard
2. Перейдите в Deployments
3. Откройте последний деплой
4. Перейдите в Functions → api/telegram/webhook
5. Проверьте логи на ошибки

## Проверка 5: Бот отвечает?

1. Откройте вашего бота в Telegram
2. Отправьте `/start`
3. Проверьте логи в Vercel (должны быть записи о вызове webhook)

## Проверка 6: Аутентификация в Web App

1. Откройте приложение через Telegram бота (не в браузере!)
2. Откройте консоль браузера (F12 → Console)
3. Проверьте ошибки

### Типичные ошибки:

**"Telegram Web App не загрузился"**
- Приложение открыто не через Telegram
- Скрипт Telegram не загрузился

**"Не удалось получить данные пользователя Telegram"**
- Приложение открыто не через Telegram бота
- Нет доступа к `window.Telegram.WebApp`

**"Ошибка при подключении к серверу"**
- API endpoint не работает
- Проблема с базой данных
- Проверьте логи в Vercel

**"Database initialization failed"**
- `DATABASE_URL` не настроен
- Неправильная строка подключения
- База данных недоступна

## Быстрая диагностика

### Шаг 1: Проверьте тестовый endpoint
```
https://your-project.vercel.app/api/telegram/debug?test=true
```

### Шаг 2: Проверьте webhook
В BotFather: `/getwebhookinfo`

### Шаг 3: Проверьте логи
Vercel Dashboard → Deployments → Functions → Logs

### Шаг 4: Проверьте переменные окружения
Vercel Dashboard → Settings → Environment Variables

## Решение проблем

### Бот не отвечает на /start

1. Проверьте webhook: `/getwebhookinfo` в BotFather
2. Проверьте `TELEGRAM_BOT_TOKEN` в Environment Variables
3. Проверьте логи в Vercel
4. Попробуйте переустановить webhook:
   ```
   /deletewebhook
   /setwebhook
   https://your-project.vercel.app/api/telegram/webhook
   ```

### Аутентификация не работает

1. Убедитесь, что приложение открыто через Telegram бота
2. Проверьте консоль браузера (F12) на ошибки
3. Проверьте, что `DATABASE_URL` настроен
4. Проверьте логи API endpoint в Vercel

### Ошибка базы данных

1. Проверьте `DATABASE_URL` в Environment Variables
2. Убедитесь, что база данных создана и доступна
3. Проверьте строку подключения
4. Попробуйте пересоздать базу данных

---

## Персональные приветствия бота

Бот автоматически распознает пользователей:
- `403161451` - Мария (персональное приветствие)
- `7694835964` - Tixy (персональное приветствие)
- `8530599793` - Запасной аккаунт (персональное приветствие)
- Остальные - стандартное приветствие

Доступные команды бота:
- `/start` - Начать работу с ботом
- `/menu` - Меню быстрого доступа
- `/today` - План на сегодня
- `/help` - Справка по командам
- `/settings` - Настройки уведомлений
