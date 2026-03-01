# План устранения заглушек "В разработке"

**Для:** Команды разработки  
**Цель:** Заменить все "Feature under development" на рабочий функционал  
**Срок:** 2 недели  
**Дата:** 01.03.2026

---

## 📊 СТАТИСТИКА ЗАГЛУШЕК

| Модуль | Кол-во заглушек | Приоритет | Оценка времени |
|--------|----------------|-----------|----------------|
| Питание | 4 таба | 🔴 Высокий | 3 дня |
| Движение | 2 таба | 🟡 Средний | 2 дня |
| Сон | 4 таба | 🟡 Средний | 2 дня |
| Психология | 3 таба | 🟢 Низкий | 2 дня |
| Медицина | 2 таба | 🟡 Средний | 2 дня |
| Социальное | 3 таба | 🟢 Низкий | 1 день |
| **ИТОГО** | **18 заглушек** | | **12 дней** |

---

## 🔴 НЕДЕЛЯ 1: КРИТИЧНЫЕ МОДУЛИ

### День 1-2: Питание (Nutrition)

**Файл:** `client/src/pages/health/NutritionHealth.tsx`

#### Tab: Diary (Дневник питания)

**Текущее состояние:**
```tsx
<TabsContent value="diary">
  <p className="text-foreground/60">Feature under development</p>
</TabsContent>
```

**Что нужно сделать:**

1. **Компонент `MealList`**
```tsx
// client/src/components/nutrition/MealList.tsx
interface MealListProps {
  meals: Meal[];
  onDelete: (id: string) => void;
  onEdit: (meal: Meal) => void;
}

export function MealList({ meals, onDelete, onEdit }: MealListProps) {
  return (
    <div className="space-y-4">
      {meals.map(meal => (
        <MealCard 
          key={meal.id} 
          meal={meal} 
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
```

2. **Компонент `MealCard`**
```tsx
// Отображает: тип приёма пищи, время, калории, БЖУ, фото
interface MealCardProps {
  meal: {
    id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    meal_date: string;
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
    photo_url?: string;
    notes?: string;
  };
}
```

3. **API интеграция**
```typescript
// GET /api/nutrition/meals?date=2026-03-01
// POST /api/nutrition/meals
// DELETE /api/nutrition/meals/:id
```

4. **Форма добавления**
- Поля: тип приёма пищи, поиск продуктов, количество, фото
- База продуктов (пока локальная, 100 популярных продуктов)

**Результат:**
- ✅ Просмотр приёмов пищи за день
- ✅ Добавление нового приёма
- ✅ Удаление приёма
- ✅ Подсчёт калорий и БЖУ

---

#### Tab: Macros (БЖУ)

**Текущее состояние:** Заглушка

**Что нужно сделать:**

1. **Круговая диаграмма (Pie Chart)**
```tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Белки', value: protein, color: '#3B82F6' },
  { name: 'Жиры', value: fat, color: '#EF4444' },
  { name: 'Углеводы', value: carbs, color: '#10B981' },
];
```

2. **Прогресс-бары**
- Текущие / Целевые значения
- Цветовая индикация (зелёный/жёлтый/красный)

3. **История**
- График БЖУ за неделю
- Средние значения

**Результат:**
- ✅ Визуализация соотношения БЖУ
- ✅ Прогресс к целям
- ✅ История потребления

---

#### Tab: Plans (Планы питания)

**Текущее состояние:** Заглушка

**Что нужно сделать:**

1. **Шаблоны планов**
```typescript
const mealPlans = [
  { id: 'weight_loss', name: 'Похудение', calories: 1500 },
  { id: 'maintenance', name: 'Поддержание', calories: 2000 },
  { id: 'muscle_gain', name: 'Набор массы', calories: 2500 },
  { id: 'keto', name: 'Кето-диета', calories: 1800 },
];
```

2. **Просмотр плана**
- День 1-7
- Приёмы пищи с примерами блюд
- Список покупок

3. **Активация плана**
- Кнопка "Начать план"
- Установка целей

**Результат:**
- ✅ 4 базовых плана питания
- ✅ Просмотр деталей
- ✅ Активация плана

---

### День 3: Сон (Sleep)

**Файл:** `client/src/pages/health/SleepHealth.tsx`

#### Tab: Quality (Качество сна)

**Что нужно сделать:**

1. **Sleep Score**
```tsx
// Расчёт на основе:
// - Длительность (30%)
// - Эффективность (25%)
// - Время засыпания (20%)
// - Пробуждения (15%)
// - Постоянность (10%)

interface SleepScoreProps {
  score: number; // 0-100
  factors: {
    duration: number;
    efficiency: number;
    latency: number;
    awakenings: number;
    consistency: number;
  };
}
```

2. **Факторы сна**
- Список что влияет на сон (кофеин, экраны, стресс)
- Оценка каждого фактора

3. **Рекомендации**
- Персональные советы по улучшению

---

#### Tab: Schedule (Расписание)

**Что нужно сделать:**

1. **Целевое время сна**
```tsx
// Установка:
// - Время отхода ко сну
// - Время пробуждения
// - Целевая длительность

interface SleepSchedule {
  bedtime: string; // "22:00"
  wakeTime: string; // "06:00"
  targetDuration: number; // 8 часов
}
```

2. **Напоминания**
- Уведомление за 30 мин до сна
- Умный будильник (в рамках 30-минутного окна)

3. **Статистика по дням недели**

---

### День 4-5: Медицина (Medicine)

**Файл:** `client/src/pages/health/MedicineHealth.tsx` (создать)

#### Tab: Documents (Документы)

**Что нужно сделать:**

1. **Загрузка документов**
```tsx
// Поддержка форматов: PDF, JPG, PNG
// Максимальный размер: 10MB

interface DocumentUpload {
  title: string;
  document_type: 'lab_result' | 'prescription' | 'imaging';
  file: File;
  document_date: string;
  doctor_name?: string;
  clinic_name?: string;
  notes?: string;
}
```

2. **Список документов**
- Превью (для изображений)
- Иконка PDF
- Дата, тип, название

3. **Просмотр документа**
- Модальное окно с просмотром
- Скачивание
- Удаление

---

#### Tab: Medications (Лекарства)

**Что нужно сделать:**

1. **Таблица лекарств**
```tsx
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  schedule: string[]; // ["08:00", "20:00"]
  start_date: string;
  end_date?: string;
  is_active: boolean;
}
```

2. **Форма добавления**
- Название, дозировка
- Частота (каждый день, через день, по дням недели)
- Время приёма (мульти-селект)

3. **Напоминания**
- Push-уведомления
- Отметка о приёме

---

## 🟡 НЕДЕЛЯ 2: ОСТАЛЬНЫЕ МОДУЛИ

### День 6-7: Движение (Movement)

**Файл:** `client/src/pages/health/MovementHealth.tsx`

#### Tab: Plans (Планы тренировок)

**Что нужно сделать:**

1. **База упражнений (локальная)**
```typescript
const exercises = [
  {
    id: 'pushups',
    name: 'Отжимания',
    category: 'strength',
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    instructions: '...',
    video_url?: string,
  },
  // 50 базовых упражнений
];
```

2. **Готовые программы**
- Программа для начинающих (4 недели)
- Домашние тренировки
- Кардио программа
- Силовая программа

3. **Создание своей тренировки**
- Добавление упражнений
- Установка подходов/повторений
- Порядок выполнения

---

### День 8: Психология (Psychology)

#### Tab: Meditation (Медитации)

**Что нужно сделать:**

1. **Список медитаций**
```typescript
const meditations = [
  {
    id: 'breathing_5min',
    title: 'Дыхание (5 мин)',
    duration: 300,
    category: 'relaxation',
    description: 'Простое дыхательное упражнение',
  },
  {
    id: 'sleep_10min',
    title: 'Для сна (10 мин)',
    duration: 600,
    category: 'sleep',
    description: 'Расслабление перед сном',
  },
  // 10 базовых медитаций
];
```

2. **Плеер медитации**
- Таймер с обратным отсчётом
- Пауза/стоп
- Прогресс-бар

3. **История медитаций**
- Сколько раз практиковали
- Общее время

---

### День 9: Социальное (Relationships)

#### Tab: Connections (Связи)

**Что нужно сделать:**

1. **Добавление контакта**
```tsx
interface Connection {
  id: string;
  name: string;
  relationship_type: 'family' | 'friend' | 'colleague' | 'other';
  contact_frequency: 'daily' | 'weekly' | 'monthly';
  last_contact_date?: string;
  notes?: string;
}
```

2. **Список контактов**
- Фото, имя, тип связи
- Дней с последнего контакта
- Напоминание связаться

3. **История контактов**
- Дата встречи/звонка
- Заметки
- Качество связи (1-5)

---

### День 10: Полировка

#### Финальные задачи:

1. **Унификация UI**
- Все табы используют одинаковые компоненты
- Consistent spacing
- Consistent typography

2. **Loading states**
- Скелетоны при загрузке
- Error states
- Empty states

3. **Mobile responsive**
- Проверка на мобильных устройствах
- Touch-friendly кнопки
- Swipe gestures

4. **Accessibility**
- ARIA labels
- Keyboard navigation
- Color contrast

---

## 📁 НОВЫЕ ФАЙЛЫ

### Компоненты для создания:

```
client/src/components/
├── nutrition/
│   ├── MealList.tsx
│   ├── MealCard.tsx
│   ├── MealForm.tsx
│   ├── FoodSearch.tsx
│   ├── MacroChart.tsx
│   └── MealPlanCard.tsx
├── sleep/
│   ├── SleepScore.tsx
│   ├── SleepFactors.tsx
│   ├── SleepScheduleForm.tsx
│   └── SleepQualityChart.tsx
├── movement/
│   ├── ExerciseList.tsx
│   ├── ExerciseCard.tsx
│   ├── WorkoutPlanCard.tsx
│   └── WorkoutTimer.tsx
├── medicine/
│   ├── DocumentList.tsx
│   ├── DocumentUpload.tsx
│   ├── MedicationList.tsx
│   └── MedicationForm.tsx
├── psychology/
│   ├── MeditationList.tsx
│   ├── MeditationPlayer.tsx
│   └── BreathingExercise.tsx
└── relationships/
    ├── ConnectionList.tsx
    ├── ConnectionForm.tsx
    └── ContactReminder.tsx
```

---

## 🔧 API ENDPOINTS (добавить)

### Питание
```typescript
// GET    /api/nutrition/meals
// POST   /api/nutrition/meals
// DELETE /api/nutrition/meals/:id
// GET    /api/nutrition/foods?search=
```

### Сон
```typescript
// GET    /api/sleep/sessions
// POST   /api/sleep/sessions
// GET    /api/sleep/schedule
// POST   /api/sleep/schedule
```

### Медицина
```typescript
// GET    /api/medicine/documents
// POST   /api/medicine/documents
// DELETE /api/medicine/documents/:id
// GET    /api/medicine/medications
// POST   /api/medicine/medications
```

---

## ✅ ЧЕКЛИСТ ЗАВЕРШЕНИЯ

### Питание
- [ ] MealList отображает приёмы пищи
- [ ] MealCard показывает калории и БЖУ
- [ ] Форма добавления работает
- [ ] Pie chart отображает соотношение БЖУ
- [ ] 4 плана питания доступны

### Сон
- [ ] Sleep score рассчитывается
- [ ] Факторы сна отображаются
- [ ] Расписание можно настроить
- [ ] Напоминания работают

### Движение
- [ ] База из 50 упражнений
- [ ] 4 готовые программы
- [ ] Создание тренировки работает

### Медицина
- [ ] Загрузка документов работает
- [ ] Список документов отображается
- [ ] Таблица лекарств работает
- [ ] Напоминания о лекарствах

### Психология
- [ ] 10 медитаций доступны
- [ ] Плеер работает
- [ ] Дыхательные упражнения

### Социальное
- [ ] Добавление контактов
- [ ] Отслеживание связей

---

## 🎯 ОПРЕДЕЛЕНИЕ УСПЕХА

**Успешно, если:**
- Нет текста "Feature under development" на главных экранах
- Все кнопки работают
- Данные сохраняются в БД
- Мобильная версия работает

**После завершения:**
- Обновить `TODO_MASTER.md`
- Задеплоить на Render
- Протестировать с реальными пользователями

---

**Начало работ:** ___  
**Окончание:** ___  
**Ответственный:** ___
