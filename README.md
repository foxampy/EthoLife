# EthoLife — Экосистема управления здоровьем

[![Health](https://img.shields.io/badge/Focus-Health%20%26%20Wellness-green)]()
[![AI Powered](https://img.shields.io/badge/AI-Qwen%20LLM-blue)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-yellow)]()
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)]()

> 🏥 Комплексная платформа для управления физическим, психологическим и социальным здоровьем с персональным AI-ассистентом

**🌐 Сайт:** https://ethoslife.onrender.com/  
**📖 Документация:** [docs/README.md](./docs/README.md)  
**📊 Полный обзор:** [PROJECT_COMPLETE_SUMMARY.md](./PROJECT_COMPLETE_SUMMARY.md)

---

## 🎯 Для чего нужен EthoLife

- **Отслеживание здоровья** — 7 модулей: медицина, питание, движение, сон, психология, социум, привычки
- **AI-рекомендации** — персональные советы на основе ваших данных (Qwen LLM)
- **Планирование** — тренировки, питание, медицинские приёмы
- **Сообщество** — поддержка единомышленников и групповые челленджи
- **Специалисты** — прямое подключение к врачам, тренерам, психологам

---

## 🚀 Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd etholife

# 2. Установить зависимости
pnpm install

# 3. Настроить окружение
cp .env.example .env
# Отредактировать .env с вашими ключами

# 4. Запустить локально
pnpm dev
```

Приложение будет доступно на `http://localhost:3000`

---

## 📱 Модули здоровья

| Модуль | Описание | Статус |
|--------|----------|--------|
| 🏥 **Медицина** | Электронная карта, анализы, лекарства | ✅ Готово |
| 🥗 **Питание** | Калории, БЖУ, планы питания | ✅ Готово |
| 💪 **Движение** | Тренировки, упражнения, прогресс | ✅ Готово |
| 😴 **Сон** | Трекер сна, умный будильник | ✅ Готово |
| 🧠 **Психология** | Настроение, стресс, медитации | ✅ Готово |
| 👥 **Социальное** | Связи, сообщества, челленджи | ⚠️ В разработке |
| ⭐ **Привычки** | Трекер привычек, streaks | ✅ Готово |

---

## 🛠 Технический стек

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Express.js, Node.js
- **База данных:** PostgreSQL (Supabase)
- **AI:** Qwen LLM (Hugging Face)
- **Аутентификация:** JWT + Google OAuth + Telegram
- **Платежи:** NOWPayments (крипто)
- **Хостинг:** Render (backend), Vercel (frontend)

---

## 📊 Тарифы

### Для пользователей:

| Тариф | Цена | Возможности |
|-------|------|-------------|
| **Free** | $0 | 3 модуля, 5 AI-сообщений/день |
| **Basic** | $20/мес | Все модули, 50 AI-сообщений, 50 UNITY кэшбэк |
| **Premium** | $50/мес | Безлимит, подключение специалистов, 150 UNITY |

### Для специалистов:

| Тариф | Цена | Комиссия |
|-------|------|----------|
| **Starter** | Free | 15% |
| **Professional** | $30/мес | 5% |

---

## 🤖 AI-помощник

EthoLife использует **Qwen LLM** через Hugging Face API:

- ✅ Бесплатный AI (альтернатива ChatGPT)
- ✅ Персональные рекомендации
- ✅ История сообщений
- ✅ Rate limiting по тарифам
- ✅ Fallback-ответы при недоступности API

---

## 🪙 Unity Token

Внутренняя валюта платформы для геймификации:

- Регистрация: **100 UNITY**
- Реферал: **500 UNITY**
- Стрик 7 дней: **50 UNITY**
- Стрик 30 дней: **300 UNITY**
- Кэшбэк от подписки: **50-150 UNITY/мес**

Использование: оплата подписок (скидка 15%), доступ к премиум-функциям.

---

## 📁 Структура проекта

```
etholife/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/         # Страницы приложения
│   │   ├── components/    # UI компоненты
│   │   └── contexts/      # React контексты
│   └── public/            # Статические файлы
├── server/                # Backend API
│   ├── api/              # API endpoints
│   ├── services/         # AI, payments и др.
│   └── supabase/         # Миграции БД
├── docs/                  # Документация
└── scripts/               # Вспомогательные скрипты
```

---

## 📚 Документация

- [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) — Гайд по деплою
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) — Документация проекта
- [ECOSYSTEM_DOCUMENTATION.md](./ECOSYSTEM_DOCUMENTATION.md) — Документация экосистемы
- [AI_CHAT_OPTIMIZATION_PLAN.md](./docs/AI_CHAT_OPTIMIZATION_PLAN.md) — Оптимизация для ИИ-чатов
- [FAQ.md](./FAQ.md) — Часто задаваемые вопросы

---

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📄 Лицензия

Распространяется под лицензией MIT. См. [LICENSE](./LICENSE) для подробностей.

---

## 📞 Контакты

- **Сайт:** https://ethoslife.onrender.com/
- **Email:** support@ethoslife.com
- **Telegram:** @ethoslife_bot

---

## 🙏 Благодарности

- [Qwen](https://huggingface.co/Qwen) — AI модель
- [Supabase](https://supabase.com) — База данных
- [shadcn/ui](https://ui.shadcn.com) — UI компоненты
- [Lucide](https://lucide.dev) — Иконки

---

<div align="center">
  <sub>Built with ❤️ for healthy life</sub>
</div>
