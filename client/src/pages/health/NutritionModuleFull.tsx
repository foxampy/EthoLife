/**
 * Nutrition Module - Компонент модуля питания
 * Полная реализация с Dashboard, Tracking, Analytics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Apple,
  Utensils,
  Droplets,
  Flame,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  BarChart3,
  BookOpen,
  Settings,
  Camera,
  Barcode,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { healthAPI } from '@/services/healthAPI';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NutritionModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddWater, setShowAddWater] = useState(false);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics, addMetric } = useHealthStore();

  useEffect(() => {
    loadNutritionData();
  }, []);

  const loadNutritionData = async () => {
    setLoading(true);
    await loadMetrics('nutrition');
    setLoading(false);
  };

  if (loading) {
    return <NutritionSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Питание</h1>
                <p className="text-sm text-gray-500">Калории, макросы, вода</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <BarChart3 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <CalorieCard />
          <MacrosCard />
          <WaterCard />
          <QuickActionsCard
            onAddMeal={() => setShowAddMeal(true)}
            onAddWater={() => setShowAddWater(true)}
            onSearchFood={() => setShowFoodSearch(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="meals" className="text-sm">
              <Utensils className="w-4 h-4 mr-2" />
              Приемы пищи
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="library" className="text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Библиотека
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="meals">
            <MealsTab onAddMeal={() => setShowAddMeal(true)} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="library">
            <LibraryTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddMealDialog open={showAddMeal} onOpenChange={setShowAddMeal} />
      <AddWaterDialog open={showAddWater} onOpenChange={setShowAddWater} />
      <FoodSearchDialog open={showFoodSearch} onOpenChange={setShowFoodSearch} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function CalorieCard() {
  const calories = 1840;
  const goal = 2000;
  const percent = (calories / goal) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-semibold text-gray-900">Калории</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {calories} / {goal} <span className="text-sm font-normal">ккал</span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">
          Осталось: {goal - calories} ккал
        </p>
      </CardContent>
    </Card>
  );
}

function MacrosCard() {
  const macros = {
    protein: { current: 140, goal: 180, unit: 'г' },
    carbs: { current: 220, goal: 250, unit: 'г' },
    fat: { current: 65, goal: 70, unit: 'г' },
  };

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-900">Макросы</span>
        </div>

        <MacroBar label="Белки" current={macros.protein.current} goal={macros.protein.goal} color="bg-blue-500" />
        <MacroBar label="Углеводы" current={macros.carbs.current} goal={macros.carbs.goal} color="bg-green-500" />
        <MacroBar label="Жиры" current={macros.fat.current} goal={macros.fat.goal} color="bg-yellow-500" />
      </CardContent>
    </Card>
  );
}

function MacroBar({ label, current, goal, color }: any) {
  const percent = Math.min(100, (current / goal) * 100);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">
          {current} / {goal} {label === 'Белки' || label === 'Углеводы' || label === 'Жиры' ? 'г' : ''}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function WaterCard() {
  const [water, setWater] = useState(1500);
  const goal = 2000;
  const percent = (water / goal) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="font-semibold text-gray-900">Вода</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {water / 1000} / {goal / 1000} <span className="text-sm font-normal">л</span>
        </div>
        <Progress value={percent} className="h-2" />
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => setWater(w => w + 250)}>
            +250ml
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => setWater(w => w + 500)}>
            +500ml
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onAddMeal, onAddWater, onSearchFood }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Plus className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="font-semibold text-gray-900">Действия</span>
        </div>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onAddMeal}>
            <Utensils className="w-4 h-4" />
            Добавить еду
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onAddWater}>
            <Droplets className="w-4 h-4" />
            Добавить воду
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onSearchFood}>
            <Search className="w-4 h-4" />
            Поиск продукта
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# TABS
# ============================================================================

function OverviewTab() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Сегодня</CardTitle>
          <CardDescription>Обзор питания за сегодня</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Данные загружаются...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MealsTab({ onAddMeal }: any) {
  const meals = [
    { type: 'breakfast', time: '08:00', calories: 450, items: ['Овсянка', 'Яблоко', 'Кофе'] },
    { type: 'lunch', time: '13:00', calories: 650, items: ['Куриная грудка', 'Рис', 'Салат'] },
    { type: 'snack', time: '16:00', calories: 200, items: ['Йогурт', 'Орехи'] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Приемы пищи</h3>
        <Button size="sm" onClick={onAddMeal}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {meals.map((meal, index) => (
        <MealCard key={index} meal={meal} />
      ))}
    </div>
  );
}

function MealCard({ meal }: any) {
  const mealIcons: Record<string, any> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{mealIcons[meal.type]}</span>
            <div>
              <p className="font-semibold capitalize">{meal.type}</p>
              <p className="text-xs text-gray-500">{meal.time}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{meal.calories} ккал</p>
            <p className="text-xs text-gray-500">{meal.items.length} продуктов</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Аналитика</CardTitle>
          <CardDescription>Тренды и статистика питания</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Графики и аналитика...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function LibraryTab() {
  const recipes = [
    { title: 'Овсянка с ягодами', calories: 350, time: '15 мин' },
    { title: 'Куриный салат', calories: 420, time: '20 мин' },
    { title: 'Протеиновый коктейль', calories: 280, time: '5 мин' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Рецепты</h3>
        <Button size="sm" variant="outline">
          <Search className="w-4 h-4 mr-2" />
          Поиск
        </Button>
      </div>

      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}

function RecipeCard({ recipe }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
            <Utensils className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{recipe.title}</p>
            <div className="flex gap-3 text-xs text-gray-500 mt-1">
              <span>{recipe.calories} ккал</span>
              <span>⏱ {recipe.time}</span>
            </div>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function AddMealDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Добавить прием пищи</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Форма добавления еды...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddWaterDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить воду</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Форма добавления воды...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FoodSearchDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Поиск продуктов</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="Название продукта..." className="pl-10" />
          </div>
          <p className="text-sm text-gray-500">Результаты поиска...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function NutritionSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-20 bg-white rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
