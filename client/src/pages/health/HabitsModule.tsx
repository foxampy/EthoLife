import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  Flame,
  Calendar,
  Trophy,
  MoreVertical,
  Check,
  TrendingUp,
  Clock,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useHabitsStore, Habit } from '@/stores/modules/habitsStore';
import { moduleColors } from '@/stores/healthStore';

export default function HabitsModule() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    habits,
    todayCompletions,
    initialize,
    completeHabit,
    uncompleteHabit,
    getTodaysHabits,
    isHabitCompletedToday,
    getCompletionForToday,
    getStreakEmoji,
    getCategoryColor,
  } = useHabitsStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initialize();
      setIsLoading(false);
    };
    loadData();
  }, [initialize]);

  const todaysHabits = getTodaysHabits();
  const completedCount = todaysHabits.filter((h) =>
    isHabitCompletedToday(h.id)
  ).length;
  const progress = todaysHabits.length > 0 
    ? Math.round((completedCount / todaysHabits.length) * 100) 
    : 0;

  const handleToggleHabit = async (habit: Habit) => {
    const isCompleted = isHabitCompletedToday(habit.id);
    
    if (isCompleted) {
      const completion = getCompletionForToday(habit.id);
      if (completion) {
        await uncompleteHabit(completion.id);
        toast({
          title: 'Отменено',
          description: `Привычка "${habit.custom_name}" отмечена как невыполненная`,
        });
      }
    } else {
      await completeHabit(habit.id);
      
      // Show streak celebration
      if (habit.current_streak > 0 && habit.current_streak % 7 === 0) {
        toast({
          title: `${getStreakEmoji(habit.current_streak)} ${habit.current_streak}-дневный streak!`,
          description: 'Отличная работа! Продолжай в том же духе!',
          variant: 'default',
        });
      }
    }
  };

  const totalStreaks = habits.reduce((acc, h) => acc + h.current_streak, 0);
  const bestStreak = Math.max(...habits.map((h) => h.longest_streak), 0);

  if (isLoading) {
    return <HabitsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header 
        className="sticky top-0 z-10 text-white"
        style={{ backgroundColor: moduleColors.habits.primary }}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setLocation('/health')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Привычки</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setLocation('/health/habits/stats')}
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
          </div>

          {/* Today's Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm opacity-90">Сегодня</span>
                <span className="text-sm font-semibold">{completedCount}/{todaysHabits.length}</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-white/30"
              />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{progress}%</div>
              <div className="text-xs opacity-80">выполнено</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-xl font-bold">{totalStreaks}</div>
              <div className="text-xs text-gray-500">дней streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-xl font-bold">{bestStreak}</div>
              <div className="text-xs text-gray-500">лучший streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-xl font-bold">{habits.length}</div>
              <div className="text-xs text-gray-500">привычек</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Habits */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Привычки на сегодня
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {todaysHabits.map((habit) => {
                const isCompleted = isHabitCompletedToday(habit.id);
                const streak = habit.current_streak;
                const categoryColor = getCategoryColor(habit.category);

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card 
                      className={`transition-all duration-200 ${
                        isCompleted ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => handleToggleHabit(habit)}
                            className="w-6 h-6 border-2"
                            style={{ 
                              borderColor: isCompleted ? categoryColor : '#d1d5db',
                              backgroundColor: isCompleted ? categoryColor : 'transparent',
                            }}
                          />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate ${
                              isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {habit.custom_name}
                            </h3>
                            
                            <div className="flex items-center gap-2 mt-1">
                              {/* Category badge */}
                              <span 
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ 
                                  backgroundColor: `${categoryColor}20`,
                                  color: categoryColor,
                                }}
                              >
                                {getCategoryLabel(habit.category)}
                              </span>
                              
                              {/* Streak */}
                              {streak > 0 && (
                                <span className="flex items-center gap-1 text-xs text-orange-500">
                                  <Flame className="w-3 h-3" />
                                  {streak}
                                </span>
                              )}
                              
                              {/* Duration */}
                              {habit.estimated_duration_minutes && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  {habit.estimated_duration_minutes} мин
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setLocation(`/health/habits/${habit.id}`)}>
                                Детали
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setLocation(`/health/habits/${habit.id}/edit`)}>
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => useHabitsStore.getState().deleteHabit(habit.id)}
                              >
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {todaysHabits.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">У тебя пока нет привычек</p>
                <p className="text-sm text-gray-400">
                  Создай первую привычку, чтобы начать отслеживать прогресс
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Weekly Calendar Preview */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Последние 7 дней
          </h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                {getLast7Days().map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400">{day.label}</span>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                        ${day.isToday ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
                      `}
                      style={{
                        backgroundColor: day.completionRate > 0 
                          ? `${moduleColors.habits.primary}${Math.round(day.completionRate * 2.55).toString(16).padStart(2, '0')}`
                          : '#f3f4f6',
                        color: day.completionRate > 50 ? 'white' : '#6b7280',
                      }}
                    >
                      {day.completionRate > 0 ? `${day.completionRate}%` : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* FAB */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: moduleColors.habits.primary }}
        onClick={() => setLocation('/health/habits/new')}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}

// Helper functions
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    health: 'Здоровье',
    fitness: 'Фитнес',
    nutrition: 'Питание',
    sleep: 'Сон',
    productivity: 'Продуктивность',
    learning: 'Обучение',
    social: 'Социальное',
    creativity: 'Творчество',
    mindfulness: 'Осознанность',
    finance: 'Финансы',
    environment: 'Окружающая среда',
    other: 'Другое',
  };
  return labels[category] || category;
}

function getLast7Days(): Array<{
  label: string;
  date: string;
  isToday: boolean;
  completionRate: number;
}> {
  const days = [];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      label: dayNames[date.getDay()],
      date: date.toISOString().split('T')[0],
      isToday: i === 0,
      completionRate: Math.floor(Math.random() * 100), // Mock data
    });
  }
  
  return days;
}

// Loading skeleton
function HabitsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="h-32"
        style={{ backgroundColor: moduleColors.habits.primary }}
      />
      <div className="max-w-lg mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}
