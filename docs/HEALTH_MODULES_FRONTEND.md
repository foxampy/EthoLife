# Health Modules - Frontend Architecture
## UI/UX Patterns & Component Structure

---

## 📱 Unified Design System

### Color Palette by Module
```typescript
const moduleColors = {
  nutrition: {
    primary: '#22c55e',    // green-500
    secondary: '#86efac',  // green-300
    accent: '#166534',     // green-800
    bg: '#f0fdf4',         // green-50
  },
  movement: {
    primary: '#f97316',    // orange-500
    secondary: '#fdba74',  // orange-300
    accent: '#c2410c',     // orange-800
    bg: '#fff7ed',         // orange-50
  },
  sleep: {
    primary: '#8b5cf6',    // violet-500
    secondary: '#c4b5fd',  // violet-300
    accent: '#5b21b6',     // violet-800
    bg: '#f5f3ff',         // violet-50
  },
  psychology: {
    primary: '#06b6d4',    // cyan-500
    secondary: '#67e8f9',  // cyan-300
    accent: '#155e75',     // cyan-800
    bg: '#ecfeff',         // cyan-50
  },
  medicine: {
    primary: '#ef4444',    // red-500
    secondary: '#fca5a5',  // red-300
    accent: '#991b1b',     // red-800
    bg: '#fef2f2',         // red-50
  },
  relationships: {
    primary: '#ec4899',    // pink-500
    secondary: '#f9a8d4',  // pink-300
    accent: '#9d174d',     // pink-800
    bg: '#fdf2f8',         // pink-50
  },
  habits: {
    primary: '#eab308',    // yellow-500
    secondary: '#fde047',  // yellow-300
    accent: '#854d0e',     // yellow-800
    bg: '#fefce8',         // yellow-50
  },
};
```

### Typography
```typescript
const typography = {
  // Headers
  h1: 'text-3xl font-bold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-medium',
  
  // Body
  bodyLarge: 'text-base leading-relaxed',
  body: 'text-sm leading-relaxed',
  bodySmall: 'text-xs leading-relaxed',
  
  // Special
  metric: 'text-4xl font-bold tabular-nums',
  metricSmall: 'text-2xl font-semibold tabular-nums',
  label: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
};
```

---

## 🧩 Shared Components

### 1. ModuleCard (Unified Module Preview)
```typescript
interface ModuleCardProps {
  module: HealthModule;
  score: number;
  streak?: number;
  quickStats: QuickStat[];
  aiInsight?: string;
  onClick: () => void;
  onQuickAction?: (action: string) => void;
}

// Usage:
<ModuleCard
  module="nutrition"
  score={85}
  streak={12}
  quickStats={[
    { label: 'Ккал', value: '1,450', target: '2,000' },
    { label: 'Белки', value: '80г', target: '100г' },
  ]}
  aiInsight="Отличный сон! Добавь белка на завтрак."
  onClick={() => navigate('/nutrition')}
  onQuickAction={(action) => logQuickAction(action)}
/>
```

### 2. DailyScoreRing
```typescript
interface DailyScoreRingProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  moduleBreakdown?: ModuleScore[];
}

// Visual: Concentric ring with segments for each module
// Center: Overall score
// Segments: Module colors with their proportions
```

### 3. MetricBar
```typescript
interface MetricBarProps {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Visual: Progress bar with value/target
```

### 4. QuickAddButton
```typescript
interface QuickAddButtonProps {
  module: HealthModule;
  options: QuickAddOption[];
  onSelect: (option: QuickAddOption) => void;
}

// Visual: Large touch-friendly button with expanding options
```

### 5. AIInsightCard
```typescript
interface AIInsightCardProps {
  title: string;
  description: string;
  type: 'tip' | 'warning' | 'celebration' | 'pattern';
  relatedModules?: HealthModule[];
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### 6. StreakFlame
```typescript
interface StreakFlameProps {
  count: number;
  record?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Visual: Animated flame with streak count
```

---

## 📱 Page Structure

### 1. Main Dashboard (/health)
```
┌─────────────────────────────────────┐
│ 🏥 Health Hub                 [👤]  │
├─────────────────────────────────────┤
│                                     │
│ [🔥 12 дней streak]                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │   [DAILY SCORE RING]           │ │
│ │                                 │ │
│ │      78/100                     │ │
│ │    Хороший день!                │ │
│ │                                 │ │
│ │   🍎85 🏃60 😴90 🧠75           │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 AI Совет дня:                    │
│ ┌─────────────────────────────────┐ │
│ │ "Ты спал отлично! Используй     │ │
│ │ энергию для тренировки."        │ │
│ │              [Начать ▶️]        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Мои модули:                         │
│ ┌─────────────────────────────────┐ │
│ │ 🍎 Питание              85% [→]│ │
│ │    1,450 / 2,000 ккал           │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🏃 Движение             60% [→]│ │
│ │    8,432 / 10,000 шагов         │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 😴 Сон                  90% [→]│ │
│ │    7ч 24мин из 8ч               │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🧠 Психология           75% [→]│ │
│ │    Настроение: 8/10             │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💊 Медицина             95% [→]│ │
│ │    Все принято ✓                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [📊 Полный отчет] [⚙️ Настройки]    │
└─────────────────────────────────────┘
```

### 2. Module Detail Page (/health/:module)
```
┌─────────────────────────────────────┐
│ ←      🍎 Питание            [+]    │
├─────────────────────────────────────┤
│                                     │
│ [🔥 12 дней]                        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        [SCORE RING]            │ │
│ │          85/100                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 📊 Ключевые метрики:                │
│ Калории  [████████░░] 1,450/2,000   │
│ Белки    [████████░░] 80г/100г      │
│ Жиры     [██████░░░░] 45г/75г       │
│ Углеводы [█████░░░░░] 120г/250г     │
│ Вода     [██████░░░░] 1.2л/2л       │
│                                     │
│ ⚡ Быстрые действия:                │
│ [📷] [🎤] [⭐] [📝]                  │
│                                     │
├─────────────────────────────────────┤
│ 📋 Сегодня:                         │
│ 🌅 Завтрак    450 ккал        [✓]   │
│ 🌞 Обед       600 ккал        [✓]   │
│ 🌙 Ужин       --              [+]   │
│ 🍪 Перекус    400 ккал        [✓]   │
│                                     │
├─────────────────────────────────────┤
│ 📈 Тренды:                          │
│ [ГРАФИК НЕДЕЛИ]                     │
│                                     │
│ Среднее: 1,890 ккал/день            │
│ Цель: 2,000 ккал/день               │
│                                     │
├─────────────────────────────────────┤
│ 💡 AI Рекомендации:                 │
│ • Увеличь белок на ужине            │
│ • Поздний ужин влияет на сон        │
│                                     │
├─────────────────────────────────────┤
│ 🎯 Мои цели:                        │
│ Сбросить 5 кг к июню                │
│ [████████░░] 60%                    │
│                                     │
│ [⚙️ Настройки модуля]               │
└─────────────────────────────────────┘
```

### 3. Data Entry Modal (Unified)
```
┌─────────────────────────────────────┐
│ ✕    Быстрое добавление             │
├─────────────────────────────────────┤
│                                     │
│ [📷 Камера] [🎤 Голос]              │
│ [⭐ Избранное] [🕐 История]          │
│                                     │
│ Или найти:                          │
│ [🔍 Поиск продуктов...]             │
│                                     │
│ Недавнее:                           │
│ ┌─────────────────────────────────┐ │
│ │ 🥗 Греческий салад     350 ккал│ │
│ │ 🍳 Омлет с овощами     280 ккал│ │
│ │ 🍎 Яблоко               95 ккал│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⏰ Время: [Сейчас ▼]                │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Создать свое:                       │
│ Название: [________________]        │
│ Калории:  [____] ккал               │
│                                     │
│ [💾 Добавить]                       │
└─────────────────────────────────────┘
```

---

## 🔄 Navigation Structure

### Tab Bar (Mobile)
```
┌─────────────────────────────────────┐
│                                     │
│  🏥      🍎      ➕      📊      👤  │
│ Home   Modules  Quick   Stats   Profile
│                                     │
└─────────────────────────────────────┘
```

### Modules Menu (все 7 модулей)
```
Модули здоровья:
┌─────────────────────────────────────┐
│                                     │
│ 🍎 Питание           [85% ✓]       │
│ 🏃 Движение          [60% ~]       │
│ 😴 Сон               [90% ✓]       │
│ 🧠 Психология        [75% ~]       │
│ 💊 Медицина          [95% ✓]       │
│ 👥 Отношения         [70% ~]       │
│ 🎯 Привычки          [80% ✓]       │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ 💡 AI Аналитика                     │
│ 📊 Полный отчет                     │
│ ⚙️ Настройки                        │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
client/src/
├── components/
│   ├── health/                    # Health module components
│   │   ├── ModuleCard.tsx         # Unified module preview
│   │   ├── DailyScoreRing.tsx     # Overall health score
│   │   ├── QuickAddModal.tsx      # Universal data entry
│   │   ├── AIInsightCard.tsx      # AI recommendations
│   │   └── MetricBar.tsx          # Progress bars
│   │
│   ├── nutrition/
│   │   ├── FoodLogger.tsx
│   │   ├── MacroChart.tsx
│   │   ├── WaterTracker.tsx
│   │   └── FoodScanner.tsx
│   │
│   ├── movement/
│   │   ├── WorkoutLogger.tsx
│   │   ├── ActivityRings.tsx
│   │   ├── ExerciseLibrary.tsx
│   │   └── RecoveryStatus.tsx
│   │
│   ├── sleep/
│   │   ├── SleepTimeline.tsx
│   │   ├── SleepPhaseChart.tsx
│   │   ├── SmartAlarm.tsx
│   │   └── SleepHygieneChecklist.tsx
│   │
│   ├── psychology/
│   │   ├── MoodCheckIn.tsx
│   │   ├── MoodTimeline.tsx
│   │   ├── TechniquePlayer.tsx
│   │   └── AssessmentForm.tsx
│   │
│   ├── medicine/
│   │   ├── MedicationSchedule.tsx
│   │   ├── IntakeLogger.tsx
│   │   ├── LabResults.tsx
│   │   └── SymptomTracker.tsx
│   │
│   ├── relationships/
│   │   ├── ContactList.tsx
│   │   ├── InteractionLogger.tsx
│   │   ├── SocialBalance.tsx
│   │   └── ConnectionReminders.tsx
│   │
│   └── habits/
│       ├── HabitTracker.tsx
│       ├── StreakFlame.tsx
│       ├── HabitStackBuilder.tsx
│       └── GroupChallenge.tsx
│
├── hooks/
│   ├── useHealthData.ts           # Unified health data hook
│   ├── useModuleScore.ts          # Calculate module scores
│   ├── useAIInsights.ts           # Get AI recommendations
│   └── useCrossCorrelations.ts    # Cross-module analysis
│
├── pages/
│   ├── HealthDashboard.tsx        # Main health hub
│   ├── ModuleDetail.tsx           # Generic module detail
│   ├── DailyReport.tsx            # Daily summary
│   └── Settings.tsx               # Module settings
│
└── stores/
    ├── healthStore.ts             # Zustand store for health data
    └── moduleStores/              # Individual module stores
        ├── nutritionStore.ts
        ├── movementStore.ts
        └── ...
```

---

## 🎨 Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '640px',   // Single column, bottom nav
  tablet: '768px',   // Two columns, side nav
  desktop: '1024px', // Full dashboard layout
  wide: '1280px',    // Extended sidebar
};

// Layout adaptation:
// Mobile: Stack everything, bottom tab bar
// Tablet: Side nav + 2-column grid
// Desktop: Side nav + 3-column grid + right sidebar
```

---

## 📱 Mobile-First Patterns

### Touch Targets
- Minimum: 44x44px
- Primary actions: 56x56px
- Quick add: 64x64px (FAB)

### Gestures
- Swipe right: Mark as done
- Swipe left: Edit/Delete
- Pull down: Refresh
- Long press: Quick actions

### Offline Support
- Queue actions locally
- Sync when online
- Show offline indicator
- Cache last 7 days

---

## ✅ Implementation Priority

### Phase 1: Core (Week 1-2)
- [ ] ModuleCard component
- [ ] DailyScoreRing
- [ ] HealthDashboard page
- [ ] QuickAddModal
- [ ] AIInsightCard

### Phase 2: Modules Core (Week 3-6)
- [ ] Nutrition basic (diary, macros)
- [ ] Movement basic (steps, workouts)
- [ ] Sleep basic (duration, quality)
- [ ] Habits basic (tracking, streaks)

### Phase 3: Advanced Modules (Week 7-10)
- [ ] Psychology (mood, techniques)
- [ ] Medicine (medications, labs)
- [ ] Relationships (contacts, interactions)

### Phase 4: AI & Polish (Week 11-12)
- [ ] Cross-module correlations UI
- [ ] AI insights display
- [ ] Advanced analytics
- [ ] Gamification

---

**Готово к разработке!** 🎨
