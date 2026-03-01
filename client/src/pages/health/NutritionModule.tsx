import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  Droplets,
  Target,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Dumbbell,
  MoreHorizontal,
  Trash2,
  Camera,
  Mic,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNutritionStore } from '@/stores/modules/nutritionStore';
import { moduleColors } from '@/stores/healthStore';
import { DailyScoreRing } from '@/components/health/DailyScoreRing';

const mealTypes = [
  { id: 'breakfast', label: 'Завтрак', icon: Coffee, color: '#f59e0b' },
  { id: 'lunch', label: 'Обед', icon: Sun, color: '#f97316' },
  { id: 'dinner', label: 'Ужин', icon: Moon, color: '#8b5cf6' },
  { id: 'snack', label: 'Перекус', icon: Cookie, color: '#ec4899' },
  { id: 'pre_workout', label: 'До трени', icon: Dumbbell, color: '#3b82f6' },
  { id: 'post_workout', label: 'После трени', icon: Dumbbell, color: '#10b981' },
];

const quickWaterAmounts = [250, 500, 750];

export default function NutritionModule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    todayEntries,
    goals,
    waterLogs,
    foods,
    initialize,
    fetchFoods,
    addEntry,
    deleteEntry,
    addWater,
    deleteWater,
    getTotals,
    getRemaining,
    getWaterTotal,
    getMealEntries,
    getMacroPercentages,
  } = useNutritionStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initialize();
      setIsLoading(false);
    };
    loadData();
  }, [initialize]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchFoods(searchQuery);
    }
  }, [searchQuery, fetchFoods]);

  const totals = getTotals();
  const remaining = getRemaining();
  const waterTotal = getWaterTotal();
  const macroPercents = getMacroPercentages();

  const calorieProgress = goals ? Math.min(100, (totals.calories / goals.target_calories) * 100) : 0;
  const waterProgress = goals ? Math.min(100, (waterTotal / goals.target_water_ml) * 100) : 0;

  const handleAddFood = async (food: any) => {
    await addEntry({
      meal_type: selectedMeal as any,
      food_id: food.id,
      amount: 100,
      unit: 'g',
    });
    setShowAddDialog(false);
    toast({
      title: 'Добавлено',
      description: `${food.name} добавлено в ${mealTypes.find(m => m.id === selectedMeal)?.label}`,
    });
  };

  const handleQuickAddWater = async (amount: number) => {
    await addWater(amount);
    toast({
      title: 'Вода добавлена',
      description: `+${amount} мл воды`,
    });
  };

  if (isLoading) {
    return <NutritionSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header 
        className="sticky top-0 z-10 text-white"
        style={{ backgroundColor: moduleColors.nutrition.primary }}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/health')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Питание</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/health/nutrition/goals')}
            >
              <Target className="w-5 h-5" />
            </Button>
          </div>

          {/* Calorie Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm opacity-90">Калории</span>
                <span className="text-sm font-semibold">
                  {totals.calories} / {goals?.target_calories || 2000}
                </span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${calorieProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(calorieProgress)}%</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Macros Card */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Макросы сегодня</h3>
            
            {/* Protein */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Белки</span>
                <span className="font-medium">
                  {Math.round(totals.protein)}г / {Math.round((goals?.target_calories || 2000) * (goals?.macro_goals.protein_percent || 30) / 100 / 4)}г
                </span>
              </div>
              <Progress 
                value={macroPercents.protein} 
                className="h-2"
                style={{ backgroundColor: '#fee2e2' }}
              />
            </div>

            {/* Carbs */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Углеводы</span>
                <span className="font-medium">
                  {Math.round(totals.carbs)}г / {Math.round((goals?.target_calories || 2000) * (goals?.macro_goals.carbs_percent || 40) / 100 / 4)}г
                </span>
              </div>
              <Progress 
                value={macroPercents.carbs} 
                className="h-2"
                style={{ backgroundColor: '#fef3c7' }}
              />
            </div>

            {/* Fat */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Жиры</span>
                <span className="font-medium">
                  {Math.round(totals.fat)}г / {Math.round((goals?.target_calories || 2000) * (goals?.macro_goals.fat_percent || 30) / 100 / 9)}г
                </span>
              </div>
              <Progress 
                value={macroPercents.fat} 
                className="h-2"
                style={{ backgroundColor: '#dbeafe' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Water Tracker */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Вода</h3>
              </div>
              <span className="text-sm font-medium">
                {waterTotal} / {goals?.target_water_ml || 2000} мл
              </span>
            </div>
            
            <Progress 
              value={waterProgress} 
              className="h-3 mb-3"
              style={{ backgroundColor: '#dbeafe' }}
            />

            {/* Quick add buttons */}
            <div className="flex gap-2">
              {quickWaterAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleQuickAddWater(amount)}
                >
                  +{amount} мл
                </Button>
              ))}
            </div>

            {/* Water history */}
            {waterLogs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {waterLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full text-sm"
                  >
                    <span>{log.amount_ml} мл</span>
                    <button
                      onClick={() => deleteWater(log.id)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meals */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Приёмы пищи</h2>
          
          <div className="space-y-3">
            {mealTypes.map((meal) => {
              const entries = getMealEntries(meal.id);
              const mealCalories = entries.reduce((acc, e) => acc + (e.calculated_nutrients?.calories || 0), 0);
              const Icon = meal.icon;

              return (
                <Card key={meal.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Meal Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${meal.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: meal.color }} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{meal.label}</h3>
                          <span className="text-sm text-gray-500">{mealCalories} ккал</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedMeal(meal.id);
                          setShowAddDialog(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Entries */}
                    {entries.length > 0 && (
                      <div className="space-y-2">
                        {entries.map((entry) => (
                          <div 
                            key={entry.id}
                            className="flex items-center justify-between py-2 border-t"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {entry.food?.name || entry.custom_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {entry.amount}{entry.unit} • {Math.round(entry.calculated_nutrients?.calories || 0)} ккал
                              </p>
                            </div>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Add Food Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Добавить еду - {mealTypes.find(m => m.id === selectedMeal)?.label}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск продуктов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick add options */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Камера
              </Button>
              <Button variant="outline" className="flex-1">
                <Mic className="w-4 h-4 mr-2" />
                Голос
              </Button>
            </div>

            {/* Search results */}
            {foods.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {foods.map((food) => (
                  <button
                    key={food.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border"
                    onClick={() => handleAddFood(food)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{food.name_ru || food.name}</p>
                        <p className="text-sm text-gray-500">{food.nutrients.calories} ккал / 100г</p>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent/Favorites placeholder */}
            {searchQuery.length <= 2 && (
              <div className="text-center py-8 text-gray-500">
                <p>Начните вводить название продукта</p>
                <p className="text-sm">или используйте быстрое добавление</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* FAB */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: moduleColors.nutrition.primary }}
        onClick={() => {
          setSelectedMeal('snack');
          setShowAddDialog(true);
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}

// Loading skeleton
function NutritionSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="h-32"
        style={{ backgroundColor: moduleColors.nutrition.primary }}
      />
      <div className="max-w-lg mx-auto px-4 -mt-8 space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
