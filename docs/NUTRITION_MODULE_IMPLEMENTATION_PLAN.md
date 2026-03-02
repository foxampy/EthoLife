# 📋 Nutrition Module - План Реализации

**Статус:** В работе  
**Приоритет:** Высокий  
**Время реализации:** 3-4 дня

---

## ✅ Что уже создано

1. ✅ Типы и интерфейсы (`types/health-modules.ts`)
2. ✅ API сервис (`services/healthAPI.ts`)
3. ✅ Zustand store (`stores/healthStore.ts`)
4. ✅ Полная спецификация (`HEALTH_MODULES_FULL_SPEC.md`)

---

## 📋 Компоненты для реализации

### 1. Основная страница модуля
- `pages/health/NutritionModule.tsx` (обновить)

### 2. Компоненты Dashboard
- `components/health/nutrition/NutritionDashboard.tsx`
- `components/health/nutrition/CalorieCard.tsx`
- `components/health/nutrition/MacrosCard.tsx`
- `components/health/nutrition/WaterCard.tsx`
- `components/health/nutrition/QuickActions.tsx`

### 3. Компоненты Tracking
- `components/health/nutrition/MealLogger.tsx`
- `components/health/nutrition/FoodSearch.tsx`
- `components/health/nutrition/FoodDatabase.tsx`
- `components/health/nutrition/WaterTracker.tsx`
- `components/health/nutrition/BarcodeScanner.tsx`

### 4. Компоненты Goals & Plans
- `components/health/nutrition/GoalCalculator.tsx`
- `components/health/nutrition/MacroCalculator.tsx`
- `components/health/nutrition/MealPlanner.tsx`
- `components/health/nutrition/DietPreferences.tsx`

### 5. Компоненты Analytics
- `components/health/nutrition/NutritionAnalytics.tsx`
- `components/health/nutrition/CalorieChart.tsx`
- `components/health/nutrition/MacrosChart.tsx`
- `components/health/nutrition/TrendsChart.tsx`
- `components/health/nutrition/Insights.tsx`

### 6. Компоненты Library
- `components/health/nutrition/RecipeLibrary.tsx`
- `components/health/nutrition/RecipeCard.tsx`
- `components/health/nutrition/NutritionGuides.tsx`
- `components/health/nutrition/Articles.tsx`

### 7. Компоненты Tools
- `components/health/nutrition/PortionCalculator.tsx`
- `components/health/nutrition/RecipeCalculator.tsx`
- `components/health/nutrition/MealPrepPlanner.tsx`

### 8. Компоненты Settings
- `components/health/nutrition/NutritionSettings.tsx`
- `components/health/nutrition/GoalSettings.tsx`
- `components/health/nutrition/ReminderSettings.tsx`
- `components/health/nutrition/IntegrationSettings.tsx`

---

## 🗄️ База Данных

### Таблицы (уже созданы в Supabase):

```sql
-- Питание
nutrition_meals
nutrition_food_items
nutrition_water
nutrition_goals
nutrition_recipes
```

### API Endpoints (нужно создать):

```typescript
// GET /api/health/nutrition/foods/search?q=
// POST /api/health/nutrition/foods
// GET /api/health/nutrition/foods/:id
// GET /api/health/nutrition/foods/barcode/:barcode

// GET /api/health/nutrition/recipes
// POST /api/health/nutrition/recipes
// GET /api/health/nutrition/recipes/:id

// GET /api/health/nutrition/goals
// PUT /api/health/nutrition/goals

// GET /api/health/nutrition/analytics
// GET /api/health/nutrition/insights
```

---

## 📊 Источники Данных

### 1. База Продуктов

**USDA FoodData Central API** (бесплатно):
- URL: https://fdc.nal.usda.gov/api-guide.html
- 8000+ продуктов
- Формат: JSON
- Лицензия: Public Domain

**OpenFoodFacts API** (бесплатно):
- URL: https://world.openfoodfacts.org/data
- Продукты со штрих-кодами
- Формат: JSON
- Лицензия: Open Database

### 2. Рецепты

**OpenRecipeDB**:
- URL: https://github.com/OpenRecipeDB
- 1000+ рецептов
- Формат: JSON/YAML

### 3. Статьи

**PubMed API**:
- URL: https://www.ncbi.nlm.nih.gov/books/NBK25500/
- Научные исследования
- Формат: JSON/XML

---

## 🎯 Этапы Реализации

### День 1: Базовая Структура
- [ ] Обновить `NutritionModule.tsx`
- [ ] Создать `NutritionDashboard.tsx`
- [ ] Создать `MealLogger.tsx`
- [ ] Создать `WaterTracker.tsx`
- [ ] Настроить API endpoints

### День 2: База Продуктов
- [ ] Интеграция USDA API
- [ ] Компонент `FoodSearch.tsx`
- [ ] Компонент `FoodDatabase.tsx`
- [ ] Компонент `BarcodeScanner.tsx`
- [ ] Кэширование данных

### День 3: Цели и Планы
- [ ] `GoalCalculator.tsx`
- [ ] `MacroCalculator.tsx`
- [ ] `MealPlanner.tsx`
- [ ] AI генерация планов
- [ ] Shopping list

### День 4: Аналитика и Библиотека
- [ ] `NutritionAnalytics.tsx`
- [ ] Графики и тренды
- [ ] `RecipeLibrary.tsx`
- [ ] `Insights.tsx`
- [ ] Финальное тестирование

---

## 🔧 Технические Детали

### State Management:
```typescript
import { useHealthStore } from '@/stores/healthStore';

// Внутри компонента
const { metrics, loadMetrics, addMetric } = useHealthStore();
```

### API Calls:
```typescript
import { healthAPI } from '@/services/healthAPI';

// Получить метрики
const metrics = await healthAPI.getMetrics('nutrition');

// Добавить метрику
await healthAPI.addMetric('nutrition', {
  metric_type: 'calories',
  value: 2000,
  unit: 'kcal',
});
```

### Компоненты (пример):
```typescript
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function CalorieCard() {
  const { metrics } = useHealthStore();
  
  return (
    <Card>
      <CardTitle>Калории</CardTitle>
      <Progress value={percent} />
    </Card>
  );
}
```

---

## ✅ Критерии Готовности

- [ ] Все 8 компонентов созданы
- [ ] API endpoints работают
- [ ] База продуктов интегрирована
- [ ] Вода трекинг работает
- [ ] Калькуляторы работают
- [ ] Аналитика отображается
- [ ] Рецепты доступны
- [ ] Тесты пройдены
- [ ] Документация обновлена

---

**Приступаю к реализации День 1!**
