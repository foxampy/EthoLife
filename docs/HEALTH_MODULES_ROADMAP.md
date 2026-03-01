# Health Modules - Development Roadmap
## Дорожная карта разработки 7 модулей здоровья

**Версия:** 1.0  
**Дата:** 01.03.2026  
**Сроки:** 12 недель

---

## 🎯 Общие принципы

### Приоритеты:
1. **User Value First** - Работающие фичи > идеальный код
2. **Mobile First** - 80% использования на мобильных
3. **Offline Capability** - Работа без интернета
4. **AI Integration** - Умные рекомендации на каждом этапе

### Технический стек:
- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **State:** Zustand (модульные stores + unified store)
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **AI:** OpenAI API (GPT-4o mini для начала)
- **Charts:** Recharts + Custom SVG
- **Animations:** Framer Motion

---

## 📅 Фазы разработки

### Phase 1: Foundation (Недели 1-2)
**Цель:** Единая архитектура и базовые компоненты

#### Backend:
- [ ] Создать `health_profiles` таблицу
- [ ] Создать `daily_health_snapshots` таблицу
- [ ] Создать `health_correlations` таблицу
- [ ] Настроить RLS policies
- [ ] Создать функции для расчета score

#### Frontend:
- [ ] Создать `ModuleCard` компонент
- [ ] Создать `DailyScoreRing` компонент
- [ ] Создать `MetricBar` компонент
- [ ] Создать unified health store (Zustand)
- [ ] Настроить цветовую палитру для модулей

#### Pages:
- [ ] Health Dashboard (главная страница)
- [ ] Module selection menu
- [ ] Settings page (базовая)

**Результат:** Работающий дашборд с 7 модулями (пока без данных)

---

### Phase 2: Core Modules (Недели 3-6)
**Цель:** 4 основных модуля с базовым функционалом

#### Module: HABITS (Неделя 3)
**Why first:** Поддерживает все остальные модули

Backend:
- [ ] `habits_user_habits` таблица
- [ ] `habits_completions` таблица
- [ ] CRUD API endpoints

Frontend:
- [ ] Habit list view
- [ ] Daily check-in
- [ ] Streak visualization
- [ ] Habit creation form

#### Module: NUTRITION (Недели 3-4)
Backend:
- [ ] `nutrition_foods` + базовый набор продуктов (1000 шт)
- [ ] `nutrition_diary_entries` таблица
- [ ] `nutrition_goals` таблица
- [ ] `nutrition_water_log` таблица

Frontend:
- [ ] Food diary (daily view)
- [ ] Quick add (search + manual)
- [ ] Macro progress bars
- [ ] Water tracker
- [ ] Daily calorie ring

#### Module: MOVEMENT (Недели 4-5)
Backend:
- [ ] `movement_workouts` таблица
- [ ] `movement_daily_activity` таблица
- [ ] `movement_exercises` справочник (200 упражнений)

Frontend:
- [ ] Workout logger
- [ ] Activity rings (steps/calories/time)
- [ ] Exercise library
- [ ] Daily activity summary

#### Module: SLEEP (Неделя 5-6)
Backend:
- [ ] `sleep_sessions` таблица
- [ ] `sleep_goals` таблица
- [ ] `sleep_routine_checklist` таблица

Frontend:
- [ ] Sleep entry (manual + wearables)
- [ ] Sleep timeline visualization
- [ ] Sleep score display
- [ ] Bedtime/wake time goals

**Результат:** 4 полноценных модуля с ежедневным трекингом

---

### Phase 3: Smart Features (Недели 7-8)
**Цель:** AI insights и cross-module correlations

#### AI Integration:
- [ ] OpenAI API integration
- [ ] Prompt engineering для health insights
- [ ] Daily insight generation
- [ ] Pattern recognition

#### Correlations:
- [ ] Cross-module data analysis
- [ ] Correlation detection (sleep → mood, workout → sleep)
- [ ] Insight generation
- [ ] Notification system

#### Frontend:
- [ ] AIInsightCard компонент
- [ ] Correlation visualization
- [ ] Smart recommendations UI
- [ ] Push notifications

**Результат:** Умные рекомендации и связи между модулями

---

### Phase 4: Advanced Modules (Недели 9-10)
**Цель:** Психология, медицина, отношения

#### Module: PSYCHOLOGY (Неделя 9)
Backend:
- [ ] `psychology_mood_entries` таблица
- [ ] `psychology_assessments` (PHQ-9, GAD-7)
- [ ] `psychology_techniques` библиотека

Frontend:
- [ ] Mood check-in (quick)
- [ ] Mood timeline
- [ ] Technique player (breathing, etc)
- [ ] Assessment forms

#### Module: MEDICINE (Неделя 9-10)
Backend:
- [ ] `medicine_user_medications` таблица
- [ ] `medicine_intake_log` таблица
- [ ] `medicine_symptom_entries` таблица

Frontend:
- [ ] Medication schedule
- [ ] Reminders
- [ ] Intake logging
- [ ] Symptom tracker

#### Module: RELATIONSHIPS (Неделя 10)
Backend:
- [ ] `relationships_contacts` таблица
- [ ] `relationships_interactions` таблица

Frontend:
- [ ] Contacts list
- [ ] Interaction logger
- [ ] Connection reminders
- [ ] Social balance view

**Результат:** Все 7 модулей полностью функциональны

---

### Phase 5: Polish & Scale (Недели 11-12)
**Цель:** Качество, производительность, дополнительные фичи

#### Advanced Features:
- [ ] Photo food recognition (AI)
- [ ] Voice input для логирования
- [ ] Wearables integration (Apple Health, Google Fit)
- [ ] Export data (PDF, CSV)
- [ ] Import from других apps

#### Gamification:
- [ ] Achievements system
- [ ] Group challenges
- [ ] Streak recovery
- [ ] Rewards

#### Performance:
- [ ] Query optimization
- [ ] Caching strategy
- [ ] Offline sync
- [ ] PWA enhancements

#### Testing:
- [ ] Unit tests (critical paths)
- [ ] Integration tests
- [ ] User testing (5-10 людей)
- [ ] Bug fixes

**Результат:** Production-ready система

---

## 📊 Success Metrics

### Technical:
- [ ] 7 working modules with data persistence
- [ ] < 3s load time for dashboard
- [ ] Offline capability for all CRUD operations
- [ ] 99%+ uptime

### User:
- [ ] 70%+ daily retention (check-in 4+ modules)
- [ ] 50%+ users complete daily snapshot
- [ ] 30%+ users engage with AI insights
- [ ] 4.5+ star rating (when published)

### Business:
- [ ] Premium conversion 5%+
- [ ] 1000+ active users (month 3)
- [ ] 50%+ users complete onboarding

---

## 🚀 Quick Wins (Неделя 1)

Задачи для быстрого результата:

1. **Create unified dashboard** - Показывает все 7 модулей с mock data
2. **Simple habit tracker** - Только checkbox ежедневный
3. **Mood check-in** - 1-10 scale + эмодзи
4. **Water tracker** - +250ml кнопки
5. **Steps counter** - Manual input + Apple Health sync

Это даст пользователям сразу видеть ценность, пока разрабатываются сложные фичи.

---

## 📝 Week-by-Week Breakdown

### Week 1: Foundation
- Day 1-2: Database schema (core tables)
- Day 3-4: Dashboard layout + components
- Day 5: Quick wins (habits, mood, water)

### Week 2: Core Components
- Day 1-2: Nutrition schema + basic UI
- Day 3-4: Movement schema + basic UI
- Day 5: Integration + testing

### Week 3: Nutrition & Habits
- Day 1-3: Food diary + search + quick add
- Day 4-5: Habits completion + streaks

### Week 4: Movement
- Day 1-2: Workout logger
- Day 3-4: Exercise library
- Day 5: Activity tracking

### Week 5: Sleep
- Day 1-2: Sleep entry + timeline
- Day 3-4: Sleep phases visualization
- Day 5: Sleep goals + routine

### Week 6: Integration
- Day 1-3: Cross-module data flow
- Day 4-5: Daily snapshot calculation

### Week 7: AI Setup
- Day 1-2: OpenAI integration
- Day 3-4: Insight generation prompts
- Day 5: AIInsightCard component

### Week 8: Correlations
- Day 1-3: Pattern detection algorithms
- Day 4-5: Correlation UI + notifications

### Week 9: Psychology & Medicine
- Day 1-3: Psychology module (mood, techniques)
- Day 4-5: Medicine module (medications, symptoms)

### Week 10: Relationships & Polish
- Day 1-3: Relationships module
- Day 4-5: Module polish + bug fixes

### Week 11: Advanced Features
- Day 1-3: Photo recognition, voice input
- Day 4-5: Wearables integration

### Week 12: Launch Prep
- Day 1-3: Testing + bug fixes
- Day 4-5: Documentation + deployment

---

## 🎨 Design Deliverables

### Week 1:
- [ ] Design system (colors, typography, spacing)
- [ ] Dashboard wireframes
- [ ] Module card component specs

### Week 2:
- [ ] Nutrition screens mockups
- [ ] Movement screens mockups
- [ ] Sleep screens mockups

### Week 5:
- [ ] Psychology screens mockups
- [ ] Medicine screens mockups
- [ ] Relationships screens mockups

---

## ✅ Definition of Done

### Для каждого модуля:
- [ ] База данных создана и протестирована
- [ ] API endpoints работают (CRUD)
- [ ] UI responsive (mobile + desktop)
- [ ] Daily check-in работает
- [ ] Данные сохраняются
- [ ] Offline mode работает

### Для AI features:
- [ ] Prompts тестированы
- [ ] Insights релевантны
- [ ] Response time < 2s

### Для launch:
- [ ] Все critical bugs fixed
- [ ] Performance benchmarks met
- [ ] User testing пройден
- [ ] Documentation complete

---

## 🚨 Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | High | Medium | Strict priority, MVP first |
| AI latency | Medium | Medium | Caching, fallbacks |
| Complex DB queries | Medium | High | Indexes, materialized views |
| User adoption | Medium | High | Quick wins, onboarding |
| Mobile performance | Low | High | Optimization phase |

---

**Готово к старту разработки!** 🚀

Создано: 9 спецификаций документов  
- Общая архитектура
- 7 модулей (по одному на каждый)
- SQL миграция
- Frontend архитектура  
- Дорожная карта
