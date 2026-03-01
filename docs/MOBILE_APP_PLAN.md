# План мобильного приложения EthoLife

**Дата:** 01.03.2026  
**Цель:** iOS + Android приложение  
**Оценка времени:** 4-6 недель

---

## 📱 ВАРИАНТЫ РЕАЛИЗАЦИИ

### Вариант 1: React Native (РЕКОМЕНДУЕТСЯ) ⭐

**Почему:**
- ✅ Один код для iOS и Android
- ✅ Используем существующий React код
- ✅ Лучшая производительность чем WebView
- ✅ Нативный доступ к камере, уведомлениям, HealthKit

**Время разработки:** 4-6 недель

**Сложность:** Средняя

### Вариант 2: PWA (Progressive Web App)

**Почему нет:**
- ❌ Нет доступа к HealthKit / Google Fit
- ❌ Ограниченные push-уведомления
- ❌ Не в App Store (только через Safari "Add to Home")

**Время:** 1-2 недели  
**Сложность:** Низкая, но функционал ограничен

### Вариант 3: Capacitor / Cordova (WebView)

**Почему нет:**
- ❌ Медленнее React Native
- ❌ Проблемы с производительностью
- ❌ UX не нативный

---

## 🚀 REACT NATIVE: ПЛАН РЕАЛИЗАЦИИ

### Архитектура

```
mobile/
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   ├── screens/             # Экраны приложения
│   │   ├── auth/            # Авторизация
│   │   ├── onboarding/      # Онбординг
│   │   ├── dashboard/       # Дашборд
│   │   ├── health/          # 7 модулей здоровья
│   │   ├── social/          # Социальная сеть
│   │   └── profile/         # Профиль
│   ├── navigation/          # Навигация
│   ├── services/            # API, хранилище
│   ├── hooks/               # Custom hooks
│   ├── context/             # Context providers
│   └── utils/               # Утилиты
├── ios/                     # iOS нативный код
├── android/                 # Android нативный код
└── App.tsx                  # Точка входа
```

---

## 📋 ПОШАГОВЫЙ ПЛАН (6 НЕДЕЛЬ)

### Неделя 1: Настройка и Foundation

#### День 1-2: Инициализация проекта
```bash
# Создаём React Native проект
npx react-native@latest init EthoLifeMobile --template react-native-template-typescript

# Устанавливаем зависимости
cd EthoLifeMobile

# Навигация
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @react-navigation/native-stack

# UI библиотека
npm install react-native-paper react-native-vector-icons

# Хранилище
npm install @react-native-async-storage/async-storage

# HTTP клиент
npm install axios

# Локализация
npm install react-i18next i18next

# Дата/время
npm install date-fns

# Анимации
npm install react-native-reanimated react-native-gesture-handler

# Графики
npm install react-native-chart-kit

# Камера и галерея
npm install react-native-image-picker

# Push уведомления
npm install @react-native-firebase/app @react-native-firebase/messaging
```

#### День 3-4: Навигация и структура
- Настроить React Navigation
- Создать Tab Navigator (5 табов)
- Создать Stack Navigator для каждого таба
- Настроить типы TypeScript

#### День 5-7: UI Kit
- Создать дизайн-систему (цвета, типографика)
- Компоненты: Button, Card, Input, Avatar
- Тёмная/светлая тема

---

### Неделя 2: Auth и Onboarding

#### День 1-2: Авторизация
- Экран входа
- Экран регистрации
- Интеграция с backend API
- Сохранение токена
- Biometric auth (Face ID / Touch ID)

#### День 3-5: Онбординг
- 5-шаговый онбординг (как на вебе)
- Swipe между шагами
- Анимации
- Сохранение прогресса

#### День 6-7: Dashboard
- Главный экран
- Карточки модулей
- Быстрая статистика
- Pull-to-refresh

---

### Неделя 3: Модули здоровья

#### День 1-2: Питание
- Дневник питания
- Добавление приёма пищи
- База продуктов (локальная)
- График калорий

#### День 3-4: Движение
- Шагомер (React Native Sensors)
- Тренировки
- Таймер
- Интеграция с Apple Health / Google Fit

#### День 5: Сон
- Трекер сна
- Умный будильник
- Графики качества сна

#### День 6-7: Остальные модули
- Психология (дневник настроения)
- Медицина (таблетки)
- Привычки (streaks)

---

### Неделя 4: AI и Социальное

#### День 1-2: AI Чат
- Интерфейс чата
- История сообщений
- Быстрые вопросы
- Интеграция с API

#### День 3-4: Социальная сеть
- Лента новостей
- Создание поста
- Лайки и комментарии
- Профили пользователей

#### День 5: Специалисты
- Каталог специалистов
- Карточка специалиста
- Бронирование

#### День 6-7: Профиль и настройки
- Профиль пользователя
- Настройки
- Уведомления
- Язык (EN/RU)

---

### Неделя 5: Нативные функции

#### День 1-2: Push-уведомления
- Firebase Cloud Messaging
- Локальные уведомления
- Напоминания о привычках
- Напоминания о лекарствах

#### День 3-4: Health интеграции
**iOS:**
- Apple HealthKit
- Чтение шагов, сна, пульса
- Запись данных

**Android:**
- Google Fit API
- Health Connect
- Samsung Health (опционально)

#### День 5: Камера и медиа
- Фото профиля
- Фото еды
- Scan QR кодов

#### День 6-7: Офлайн режим
- Кэширование данных
- SQLite для локального хранения
- Синхронизация при подключении

---

### Неделя 6: Тестирование и публикация

#### День 1-2: Тестирование
- Unit тесты (Jest)
- E2E тесты (Detox)
- Тестирование на реальных устройствах
- Performance testing

#### День 3-4: Подготовка к публикации
- App Store Connect (iOS)
- Google Play Console (Android)
- Скриншоты для сторов
- Описание приложения
- Иконки и splash screens

#### День 5-6: Публикация
- Сборка release версий
- Загрузка в сторы
- Beta testing (TestFlight / Internal Testing)

#### День 7: Мониторинг
- Firebase Analytics
- Crashlytics
- Отзывы пользователей

---

## 🛠 ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Основной стек
```json
{
  "react": "18.2.0",
  "react-native": "0.73.0",
  "typescript": "5.3.0",
  
  "navigation": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/native-stack": "^6.9.17"
  },
  
  "ui": {
    "react-native-paper": "^5.11.0",
    "react-native-vector-icons": "^10.0.0",
    "react-native-reanimated": "^3.6.0",
    "react-native-gesture-handler": "^2.14.0"
  },
  
  "storage": {
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-native-firebase/app": "^18.7.0",
    "@react-native-firebase/messaging": "^18.7.0"
  },
  
  "health": {
    "react-native-health": "^1.19.0",
    "react-native-google-fit": "^0.7.0"
  },
  
  "utils": {
    "axios": "^1.6.0",
    "react-i18next": "^14.0.0",
    "date-fns": "^3.0.0",
    "react-native-chart-kit": "^6.12.0"
  }
}
```

---

## 📱 UI/UX ДЛЯ МОБИЛЬНОГО

### Навигация (Tab Bar)

```
┌───────────────────────────────────────────────────────┐
│                                                       │
│                    [Контент]                          │
│                                                       │
├───────┬─────────┬─────────┬──────────┬────────────────┤
│  🏠   │   ❤️    │   🤖    │    👥    │      👤        │
│ Home  │ Health  │   AI    │  Social  │    Profile     │
└───────┴─────────┴─────────┴──────────┴────────────────┘
```

### Цвета (единые с вебом)
```javascript
const colors = {
  primary: '#10B981',      // Emerald 500
  primaryDark: '#059669',  // Emerald 600
  accent: '#3B82F6',       // Blue 500
  background: '#F9FAFB',   // Gray 50
  surface: '#FFFFFF',
  text: '#111827',         // Gray 900
  textSecondary: '#6B7280', // Gray 500
  error: '#EF4444',        // Red 500
  success: '#22C55E',      // Green 500
};
```

### Компоненты
- **Cards** с border-radius 16px
- **Buttons** с gradient
- **Inputs** с floating labels
- **Bottom Sheets** для действий
- **Swipe gestures** для навигации

---

## 🚀 ПУБЛИКАЦИЯ В СТОРАХ

### Google Play (Android) — 1-3 дня

**Требования:**
- Google Play Developer account ($25 один раз)
- Privacy Policy
- Скриншоты (min 2) — 1080x1920
- Feature graphic — 1024x500
- App icon — 512x512
- APK / AAB файл

**Шаги:**
1. Создать аккаунт: https://play.google.com/console
2. Заплатить $25
3. Создать приложение
4. Заполнить Store Listing
5. Загрузить AAB (Android App Bundle)
6. Пройти review (1-3 дня)

**Быстрый запуск:**
- Internal Testing (минуты)
- Closed Testing (часы)
- Production (1-3 дня)

### App Store (iOS) — 1-7 дней

**Требования:**
- Apple Developer Program ($99/год)
- Privacy Policy
- Скриншоты (min 3) — 1242x2688 (iPhone), 2048x2732 (iPad)
- App Preview video (опционально)
- App icon — 1024x1024
- IPA файл

**Шаги:**
1. Создать аккаунт: https://developer.apple.com
2. Заплатить $99/год
3. Создать App ID в Certificates
4. Создать приложение в App Store Connect
5. Заполнить App Information
6. Загрузить IPA через Transporter
7. Пройти review (1-7 дней)

**Советы для быстрого одобрения:**
- ✅ Следовать Human Interface Guidelines
- ✅ Не использовать private APIs
- ✅ Правильно объяснить разрешения (health, camera)
- ✅ Тестировать на реальных устройствах
- ✅ Beta testing через TestFlight перед подачей

---

## ⚡ БЫСТРЫЙ СТАРТ (MVP)

### Минимальный функционал для публикации:

**Неделя 1-2:**
- [ ] Регистрация/вход
- [ ] Онбординг
- [ ] Dashboard с 7 модулями
- [ ] Базовый ввод данных (вручную)

**Неделя 3:**
- [ ] AI чат
- [ ] Профиль
- [ ] Push уведомления

**Неделя 4:**
- [ ] Тестирование
- [ ] Скриншоты
- [ ] Публикация

**Итого: 4 недели до публикации**

---

## 💰 БЮДЖЕТ

### Разработка (если outsource):
| Позиция | Время | Стоимость |
|---------|-------|-----------|
| React Native разработчик | 6 недель | $6,000-12,000 |
| UI/UX дизайнер | 2 недели | $2,000-4,000 |
| QA инженер | 1 неделя | $1,000-2,000 |
| **Итого** | | **$9,000-18,000** |

### Сторы:
- Google Play: $25 (одноразово)
- App Store: $99/год
- Firebase: бесплатно (до лимитов)

---

## 📊 МЕТРИКИ ПОСЛЕ ЗАПУСКА

### Технические:
- Crash-free users > 99%
- App size < 50MB
- Launch time < 3 сек

### Продуктовые:
- DAU/MAU > 30%
- Session duration > 5 мин
- Retention Day 1 > 40%
- Retention Day 7 > 20%

---

## ✅ РЕКОМЕНДАЦИЯ

**Начать с:**
1. Неделя 1: Настройка React Native
2. Неделя 2-3: Core функционал (Auth, Dashboard, 2-3 модуля)
3. Неделя 4: Тестирование и публикация в Google Play (быстрее)
4. Неделя 5: iOS адаптация и публикация в App Store
5. Неделя 6: Полировка и добавление остальных модулей

**Параллельно:**
- Разработчик делает мобильное приложение
- Другой разработчик улучшает веб (landing page)

---

**Готовы начать мобильную разработку?** 🚀

Следующий шаг: Создать React Native проект и начать с онбординга.
