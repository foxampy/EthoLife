# Summary: Mobile App Plan & Landing Page

## 📱 Mobile App Implementation

### Сложность разработки

**React Native (РЕКОМЕНДУЕТСЯ)**
- **Время:** 4-6 недель для MVP
- **Сложность:** Средняя
- **Преимущества:**
  - Один код для iOS и Android
  - Можно переиспользовать существующий React код
  - Нативный доступ к камере, уведомлениям, HealthKit
  - Лучшая производительность чем WebView

**Альтернативы:**
- **PWA:** 1-2 недели, но нет доступа к HealthKit и ограниченные push
- **Capacitor:** 2-3 недели, но WebView медленнее

### Сроки публикации в сторах

**Google Play (Android):**
- Регистрация: $25 (одноразово)
- Review: 1-3 дня
- Быстрый запуск через Internal Testing: минуты

**App Store (iOS):**
- Регистрация: $99/год
- Review: 1-7 дней
- Советы для быстрого одобрения:
  - Следовать Human Interface Guidelines
  - Не использовать private APIs
  - Правильно объяснить разрешения
  - Тестировать на реальных устройствах

### План разработки (6 недель)

| Неделя | Задачи |
|--------|--------|
| 1 | Инициализация React Native, навигация, UI Kit |
| 2 | Auth (логин/регистрация), онбординг, Dashboard |
| 3 | Модули здоровья (питание, движение, сон) |
| 4 | AI чат, социальная сеть, профиль |
| 5 | Push-уведомления, Health интеграции (Apple/Google) |
| 6 | Тестирование, скриншоты, публикация |

### Бюджет (если outsource)
- React Native разработчик: $6,000-12,000
- UI/UX дизайнер: $2,000-4,000
- QA инженер: $1,000-2,000
- **Итого: $9,000-18,000**

---

## 🌐 Landing Page с 5-шаговым онбордингом

### Что создано

**Файл:** `client/src/pages/LandingPage.tsx`

### Структура лендинга

1. **Header**
   - Логотип EthosLife
   - Навигация (Features, Modules, Pricing, Specialists)
   - Переключатель языка (EN/RU)
   - Кнопки Login/Register
   - Sticky при скролле

2. **Hero Section**
   - Слоган: "Health is a daily habit. We make this habit easy, rewarding, and effective"
   - Timer для limited offer
   - CTA кнопки: "Start Free" и "Watch Demo"
   - Trust badges
   - Превью дашборда с анимированными карточками

3. **Social Proof**
   - 100K+ Users
   - 4.9 Rating
   - 500+ Specialists
   - 95% Satisfaction

4. **Problem Section**
   - Проблема: данные разбросаны по разным приложениям
   - Решение: единая платформа EthosLife

5. **7 Modules Grid**
   - Nutrition, Movement, Sleep, Psychology
   - Medicine, Social, Habits
   - С описаниями каждого модуля

6. **CTA Section**
   - Limited offer: Premium + команда из 6 специалистов
   - Прогресс-бар оставшихся бонусов
   - Список бонусов

7. **Footer**

### 5-шаговый онбординг

**Шаг 1: Mood**
- Выбор настроения от 😞 до 🤩
- 5 вариантов с эмодзи

**Шаг 2: Goals**
- Множественный выбор целей
- Похудеть, больше энергии, лучший сон и др.

**Шаг 3: Activity Level**
- 4 уровня активности
- От "В основном сижу" до "Очень активный"

**Шаг 4: Sleep**
- Сколько часов сна
- 4 варианта

**Шаг 5: Personal Plan**
- Показывается 21-дневная программа
- AI рекомендация
- CTA для активации

### Интернационализация

**Языки:**
- English (primary)
- Russian

**Переводы добавлены:**
- `client/src/i18n/locales/en.json`
- `client/src/i18n/locales/ru.json`

**Ключи:**
- `landing.*` - для лендинга
- `onboarding.*` - для онбординга

### Маршрутизация

```tsx
// App.tsx
<Route path={"/"} component={LandingPage} />      // Новый лендинг
<Route path={"/home"} component={Home} />          // Старый Home
<Route path={"/landing-new"} component={LandingPage} /> // Альтернативный путь
```

---

## 🚀 Следующие шаги

### Для мобильного приложения:
1. Инициализировать React Native проект
2. Настроить навигацию (React Navigation)
3. Перенести компоненты онбординга из веба
4. Добавить auth flow
5. Интегрировать с backend API

### Для лендинга:
1. Добавить dashboard preview image
2. Подключить email capture форму
3. Настроить analytics (Google Analytics, Amplitude)
4. A/B тестирование CTA
5. SEO оптимизация

### Общие задачи:
1. Настроить CI/CD для автоматической публикации
2. Добавить push-уведомления
3. Интегрировать с Apple Health / Google Fit
4. Добавить in-app purchases

---

**Готово к использованию!** 🎉

Landing page доступен по адресам:
- `/` - главная страница
- `/landing-new` - альтернативный путь
