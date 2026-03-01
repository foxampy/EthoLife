# Module 1: NUTRITION (Питание)
## Полная спецификация

---

## 🎯 Цели модуля

1. **Отслеживание** - Быстрый учет всего, что ест пользователь
2. **Анализ** - Макросы, микрос, вода, тенденции
3. **Планирование** - AI-генерация меню, рецепты
4. **Образование** - Понимание питательной ценности

---

## 🗄️ Database Schema

```sql
-- ============================================
-- CORE: Продукты и блюда
-- ============================================

-- База продуктов (USDA FoodData Central + пользовательские)
nutrition_foods
├── id (uuid)
├── name (varchar 255)
├── brand (varchar 100, nullable)
├── barcode (varchar 50, nullable, indexed)
├── category (enum: grains, proteins, dairy, vegetables, fruits, fats, beverages, snacks, supplements, other)
├── serving_size (decimal 10,2) -- в граммах
├── serving_unit (varchar 20) -- 'g', 'ml', 'cup', 'piece'
├── is_verified (boolean) -- проверено USDA/модератором
├── is_user_created (boolean)
├── created_by_user_id (uuid, nullable)
├── source (enum: 'usda', 'custom', 'recipe')
└── nutrients (JSONB) -- все нутриенты
    ├── calories (kcal)
    ├── protein (g)
    ├── carbs (g)
    ├── fat (g)
    ├── fiber (g)
    ├── sugar (g)
    ├── sodium (mg)
    ├── cholesterol (mg)
    ├── saturated_fat (g)
    ├── trans_fat (g)
    ├── omega3 (mg)
    ├── omega6 (mg)
    ├── vitamin_a (mcg)
    ├── vitamin_c (mg)
    ├── vitamin_d (mcg)
    ├── vitamin_e (mg)
    ├── vitamin_k (mcg)
    ├── vitamin_b1 (mg)
    ├── vitamin_b2 (mg)
    ├── vitamin_b3 (mg)
    ├── vitamin_b6 (mg)
    ├── vitamin_b9 (mcg)
    ├── vitamin_b12 (mcg)
    ├── calcium (mg)
    ├── iron (mg)
    ├── magnesium (mg)
    ├── phosphorus (mg)
    ├── potassium (mg)
    ├── zinc (mg)
    ├── selenium (mcg)
    └── ... (можно расширять)

-- Блюда (рецепты)
nutrition_recipes
├── id (uuid)
├── user_id (uuid)
├── name (varchar 255)
├── description (text)
├── instructions (text[])
├── prep_time_minutes (int)
├── cook_time_minutes (int)
├── servings (int)
├── difficulty (enum: easy, medium, hard)
├── tags (varchar[])
├── image_url (varchar)
├── is_public (boolean)
├── likes_count (int)
├── total_nutrients (JSONB) -- посчитано из ингредиентов
└── created_at

-- Ингредиенты блюда
nutrition_recipe_ingredients
├── id (uuid)
├── recipe_id (uuid)
├── food_id (uuid)
├── amount (decimal 10,2)
├── unit (varchar 20)
└── notes (text)

-- ============================================
-- USER DATA: Приемы пищи
-- ============================================

-- Ежедневный дневник питания
nutrition_diary_entries
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── meal_type (enum: breakfast, lunch, dinner, snack, pre_workout, post_workout, other)
├── entry_type (enum: food, recipe, quick_add, barcode)
├── food_id (uuid, nullable)
├── recipe_id (uuid, nullable)
├── custom_name (varchar 255, nullable) -- для quick_add
├── amount (decimal 10,2)
├── unit (varchar 20)
├── calculated_nutrients (JSONB) -- финальные нутриенты (amount * ratio)
├── photo_url (varchar, nullable)
├── logged_at (timestamp)
├── location (JSONB, nullable) -- GPS координаты
├── mood (enum: hungry, satisfied, full, stuffed, emotional)
├── hunger_level_before (int 1-10)
├── hunger_level_after (int 1-10)
├── ai_analysis (JSONB) -- AI разбор фото/описания
└── notes (text)

-- ============================================
-- GOALS & PLANS
-- ============================================

-- Цели питания
nutrition_goals
├── id (uuid)
├── user_id (uuid)
├── goal_type (enum: lose_weight, maintain, gain_weight, gain_muscle, improve_health, manage_condition)
├── target_calories (int)
├── macro_goals (JSONB)
│   ├── protein_percent (int)
│   ├── carbs_percent (int)
│   └── fat_percent (int)
├── macro_grams (JSONB) -- альтернативно: точные граммы
│   ├── protein_g (int)
│   ├── carbs_g (int)
│   └── fat_g (int)
├── target_water_ml (int)
├── fasting_schedule (JSONB, nullable)
│   ├── type (16:8, 18:6, 20:4, 5:2, custom)
│   ├── eating_window_start (time)
│   └── eating_window_end (time)
├── dietary_restrictions (varchar[])
│   -- 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten_free', 
│   -- 'dairy_free', 'nut_free', 'kosher', 'halal', etc
├── allergies (varchar[])
├── avoid_foods (varchar[]) -- продукты на исключение
├── prefer_foods (varchar[]) -- предпочтительные продукты
├── meal_frequency (int) -- 3, 4, 5, 6 приемов
├── is_active (boolean)
├── start_date (date)
├── target_date (date)
└── ai_plan_description (text)

-- Планы питания (AI-generated)
nutrition_meal_plans
├── id (uuid)
├── user_id (uuid)
├── name (varchar 255)
├── description (text)
├── days_count (int)
├── is_ai_generated (boolean)
├── ai_prompt (text)
├── total_calories_avg (int)
├── macro_distribution (JSONB)
├── meals (JSONB[]) -- структура плана
│   └── [{ day: 1, meal_type: 'breakfast', recipe_id, calories, macros }, ...]
├── shopping_list (JSONB) --自动生成
├── is_active (boolean)
└── created_at

-- ============================================
-- TRACKING: Вода и дополнительно
-- ============================================

-- Учет воды
nutrition_water_log
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── amount_ml (int)
├── logged_at (timestamp)
├── source (enum: manual, reminder, smart_bottle)
└── photo_url (nullable) -- для проверки

-- Вес и измерения
nutrition_weight_log
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── weight_kg (decimal 5,2)
├── body_fat_percent (decimal 4,1, nullable)
├── muscle_mass_kg (decimal 5,2, nullable)
├── water_percent (decimal 4,1, nullable)
├── waist_cm (decimal 5,2, nullable)
├── hips_cm (decimal 5,2, nullable)
├── chest_cm (decimal 5,2, nullable)
├── source (enum: manual, smart_scale, photo_ai)
├── photo_url (nullable)
├── notes (text)
└── logged_at (timestamp)

-- Суперфуды и добавки
nutrition_supplements
├── id (uuid)
├── user_id (uuid)
├── name (varchar 255)
├── dosage (varchar 100)
├── frequency (varchar 100) -- "1 раз в день", "2 раза в неделю"
├── time_of_day (time[])
├── with_food (boolean)
├── reminder_enabled (boolean)
└── is_active (boolean)

-- ============================================
-- AI & ANALYTICS
-- ============================================

-- AI Insights для питания
nutrition_ai_insights
├── id (uuid)
├── user_id (uuid)
├── date (date)
├── insight_type (enum: pattern, warning, recommendation, achievement, prediction)
├── title (varchar 255)
├── description (text)
├── related_metrics (JSONB)
├── priority (enum: low, medium, high)
├── is_read (boolean)
├── actionable_steps (JSONB[])
└── created_at

-- Паттерны питания (AI-generated)
nutrition_patterns
├── id (uuid)
├── user_id (uuid)
├── pattern_name (varchar 255)
├── description (text)
├── confidence_score (decimal 3,2)
├── affected_metrics (varchar[])
├── discovered_at (timestamp)
└── is_active (boolean)
```

---

## 📱 UX/UI Design

### 1. Quick Add (Быстрое добавление)
**Цель:** Добавить еду за 5 секунд

```
┌─────────────────────────────────────┐
│ 🍎 Быстрое добавление               │
├─────────────────────────────────────┤
│                                     │
│ [📷] [🎤] [⭐] [🕐]                 │
│ Камера Голос Избр. История          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🥗 Греческий салат        350   │ │
│ │    ↳ 15г белка • 20г жиров      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ + Добавить свое ]                 │
│                                     │
│ 📸 Последние фото:                  │
│ [🍳] [🥗] [🍎] [☕]                 │
└─────────────────────────────────────┘
```

### 2. Daily Dashboard
**Цель:** Видеть прогресс сразу

```
┌─────────────────────────────────────┐
│ ←      Сегодня, 15 марта     [+]
├─────────────────────────────────────┤
│                                     │
│        [КРУГОВАЯ ДИАГРАММА]         │
│              1,450                  │
│            из 2,000                 │
│             ккал                    │
│                                     │
│  🍎 1,450    💧 1,200    ⚖️ 75.2   │
│  ккал         мл         кг         │
│  ████████░░  ██████░░░   -0.3       │
│  72%          60%        за 7 дн    │
│                                     │
│  МАКРОСЫ:                           │
│  Белки  ████████░░  80г/100г ✓      │
│  Жиры   ██████░░░░  45г/75г         │
│  Углев. █████░░░░░  120г/250г       │
│                                     │
├─────────────────────────────────────┤
│ 📋 Приемы пищи:                     │
│                                     │
│ 🌅 Завтрак     450 ккал    ✓        │
│    Овсянка с ягодами                │
│                                     │
│ 🌞 Обед        600 ккал    ✓        │
│    Курица, рис, овощи               │
│                                     │
│ 🌙 Ужин        --          [+]      │
│                                     │
│ 🍪 Перекус     400 ккал    ✓        │
│    Орехи, яблоко                    │
│                                     │
├─────────────────────────────────────┤
│ 💡 AI Совет:                        │
│ "Ты съел мало белка. Добавь        │
│  творог на ужин (20г белка)"        │
│                            [Применить]│
└─────────────────────────────────────┘
```

### 3. Food Detail Screen
```
┌─────────────────────────────────────┐
│ ←  🥗 Греческий салат          ✓    │
├─────────────────────────────────────┤
│                                     │
│ [ФОТО БЛЮДА]                        │
│                                     │
│ Порция: 350г                    [⚙️]│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔥 450 ккал                     │ │
│ │                                 │ │
│ │ 🥩 Белки      25г  ████████░░   │ │
│ │ 🥑 Жиры       20g  ██████░░░░   │ │
│ │ 🍞 Углеводы   35g  █████░░░░░   │ │
│ │ 🌾 Клетчатка   8g  ████░░░░░░   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 Микронутриенты:                  │
│ Витамин C: 45% от нормы ✓           │
│ Кальций:    15% от нормы ⚠️         │
│ Железо:     20% от нормы            │
│                                     │
│ 💧 Вода в составе: 180 мл           │
│                                     │
│ 🏷️ Теги: #обед #салат #средиземномор│
│                                     │
│ 📝 Заметки:                         │
│ Без заправки, добавил лимон         │
│                                     │
│ 😋 Как чувствуешь себя после?       │
│ [Энергично] [Норм] [Сонливо]        │
└─────────────────────────────────────┘
```

### 4. AI Food Scanner (Smart Camera)
```
┌─────────────────────────────────────┐
│ 📷 Наведи на еду                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │      [ПРЕВЬЮ КАМЕРЫ]           │ │
│ │                                 │ │
│ │    [🔴]  AI анализирует...      │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Результаты:                         │
│ ┌─────────────────────────────────┐ │
│ │ 🥗 Греческий салат    95% ✓    │ │
│ │    ~350г • 450 ккал             │ │
│ │    [Выбрать]                    │ │
│ ├─────────────────────────────────┤ │
│ │ 🥙 Цезарь салат       65%      │ │
│ │    ~300г • 520 ккал             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Совет: "Похоже на греческий      │
│ салат. Если есть фета, добавит      │
│ ~150 ккал от жиров."                │
└─────────────────────────────────────┘
```

### 5. Weekly Analysis
```
┌─────────────────────────────────────┐
│ 📊 Анализ недели: 8-14 марта        │
├─────────────────────────────────────┤
│                                     │
│ [ГРАФИК КАЛОРИЙ ПО ДНЯМ]            │
│                                     │
│ Среднее: 1,890 ккал/день            │
│ Цель:    2,000 ккал/день            │
│                                     │
│ 🏆 Достижения:                      │
│ • 5 дней в норме белка ✓            │
│ • Употребление воды +20% 📈         │
│ • Новый рецепт: Запеченная рыба     │
│                                     │
│ ⚠️ Обрати внимание:                 │
│ • Слишком много сахара в Пт (85г)   │
│ • Пропущен завтрак в Ср             │
│ • Ужин позже 21:00 (3 раза)         │
│                                     │
│ 💡 AI Рекомендации:                 │
│ 1. Подготовь завтрак заранее        │
│ 2. Замени сладкий перекус на орехи  │
│ 3. Перенеси ужин на 19:00           │
│                                     │
│ [📥 Экспорт отчета] [📤 Поделиться] │
└─────────────────────────────────────┘
```

---

## 🔗 Интеграции

### С другими модулями:
1. **Movement:**
   - Тренировка → Требуется +20-40г белка
   - Сожженные калории → Корректировка лимита
   - Pre/post workout meals

2. **Sleep:**
   - Ужин поздно → Качество сна ↓
   - Кофеин после 16:00 → Засыпание ↑
   - Триптофан на ужин → Сон лучше

3. **Psychology:**
   - Стресс → Тяга к сахару/фастфуду
   - Эмоциональное переедание → Mood tracking
   - Успех в питании → Самооценка ↑

4. **Medicine:**
   - Таблетки → Принимать с едой/натощак
   - Побочки терапии → Корректировка диеты
   - Анализы → Дефициты микроэлементов

5. **Weight (встроено):**
   - Вес тела → Корректировка калорий
   - Динамика → Прогноз достижения цели

---

## 📊 Ежедневные метрики для трекинга

### Обязательные (каждый день):
1. **Калории** - общее потребление
2. **Макросы** - белки/жиры/углеводы
3. **Вода** - мл выпито
4. **Приемы пищи** - что и когда

### Рекомендуемые (3+ раза в неделю):
5. **Вес** - утром натощак
6. **Волокна** - клетчатка
7. **Сахар** - добавленный
8. **Натрий** - соль

### Опциональные (по желанию):
9. **Микронутриенты** - витамины/минералы
10. **Фото еды** - визуальный дневник
11. **Голод/Сытость** - уровень до/после
12. **Настроение** - связь с едой

---

## 🤖 AI Features

### 1. Smart Food Recognition
- Фото → Автоопределение блюда
- Оценка порции (100г? 200г?)
- Предложение более здоровых альтернатив

### 2. Predictive Logging
- "Вы обычно завтракаете в 8:00"
- Автопредложение частых продуктов
- Учет дня недели (выходные vs будни)

### 3. Nutrient Gap Analysis
- "Сегодня не хватает витамина C"
- "Добавь темную зелень на ужин"
- Персональные рекомендации по дефицитам

### 4. Meal Plan Generation
- AI генерирует недельное меню
- Учитывает: цели, аллергии, предпочтения
- Автогенерация списка покупок

### 5. Pattern Recognition
- "Во вторник вы едите на 300 ккал больше"
- "После бессонной ночи тяга к сахару +40%"
- "Белок выше в среду (тренировки)"

---

## 🎨 UI Components to Build

1. **CircularProgress** - круговая диаграмма калорий
2. **MacroBars** - прогресс-бары макросов
3. **FoodCard** - карточка продукта/блюда
4. **MealTimeline** - временная шкала приемов пищи
5. **QuickAddModal** - быстрое добавление
6. **FoodScanner** - AI сканер камеры
7. **WaterTracker** - трекер воды с анимацией
8. **WeeklyChart** - график недели
9. **AISuggestionCard** - карточки AI рекомендаций
10. **RecipeBuilder** - конструктор рецептов

---

## ✅ Checklist Implementation

### Phase 1: Core (Неделя 1-2)
- [ ] Database schema (foods, diary, goals)
- [ ] Basic CRUD для приемов пищи
- [ ] Simple dashboard (калории + макросы)
- [ ] Search по базе продуктов

### Phase 2: Smart Features (Неделя 3-4)
- [ ] AI food photo recognition
- [ ] Barcode scanner
- [ ] Voice input
- [ ] Smart suggestions

### Phase 3: Advanced (Неделя 5-6)
- [ ] Meal plans & recipes
- [ ] Weekly analytics
- [ ] AI insights
- [ ] Cross-module integrations

### Phase 4: Polish (Неделя 7-8)
- [ ] Widgets
- [ ] Offline mode
- [ ] Import/Export (MyFitnessPal, etc)
- [ ] Testing & optimization

---

**Готово к разработке!** 🍎
