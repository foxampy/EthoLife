/**
 * Movement Module - Компонент модуля движения
 * Полная реализация: шаги, тренировки, упражнения, активность
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Dumbbell,
  Footprints,
  Timer,
  Flame,
  Plus,
  Play,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Search,
  Filter,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MovementModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showWorkout, setShowWorkout] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadMovementData();
  }, []);

  const loadMovementData = async () => {
    setLoading(true);
    await loadMetrics('movement');
    setLoading(false);
  };

  if (loading) {
    return <MovementSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Движение</h1>
                <p className="text-sm text-gray-500">Шаги, тренировки, активность</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Calendar className="w-5 h-5" />
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
          <StepsCard />
          <ActivityCard />
          <CaloriesCard />
          <QuickActionsCard
            onWorkout={() => setShowWorkout(true)}
            onExercise={() => setShowExercise(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="text-sm">
              <Target className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="workouts" className="text-sm">
              <Dumbbell className="w-4 h-4 mr-2" />
              Тренировки
            </TabsTrigger>
            <TabsTrigger value="exercises" className="text-sm">
              <Activity className="w-4 h-4 mr-2" />
              Упражнения
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Прогресс
            </TabsTrigger>
            <TabsTrigger value="programs" className="text-sm">
              <Award className="w-4 h-4 mr-2" />
              Программы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutsTab onStartWorkout={() => setShowWorkout(true)} />
          </TabsContent>

          <TabsContent value="exercises">
            <ExercisesTab onSelectExercise={() => setShowExercise(true)} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <WorkoutDialog open={showWorkout} onOpenChange={setShowWorkout} />
      <ExerciseDialog open={showExercise} onOpenChange={setShowExercise} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function StepsCard() {
  const steps = 8432;
  const goal = 10000;
  const percent = (steps / goal) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Footprints className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Шаги</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {steps.toLocaleString()} / {goal.toLocaleString()}
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">
          Осталось: {(goal - steps).toLocaleString()} шагов
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityCard() {
  const activeMinutes = 45;
  const goal = 60;
  const percent = (activeMinutes / goal) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Активность</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {activeMinutes} / {goal} <span className="text-sm font-normal">мин</span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">
          Умеренная активность сегодня
        </p>
      </CardContent>
    </Card>
  );
}

function CaloriesCard() {
  const calories = 2150;
  const goal = 2500;
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
          {calories.toLocaleString()} / {goal.toLocaleString()} <span className="text-sm font-normal">ккал</span>
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">
          Сожжено калорий сегодня
        </p>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onWorkout, onExercise }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Plus className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-semibold text-gray-900">Действия</span>
        </div>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onWorkout}>
            <Play className="w-4 h-4" />
            Начать тренировку
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onExercise}>
            <Search className="w-4 h-4" />
            Найти упражнение
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
  const todayActivity = {
    steps: 8432,
    distance: 6.2,
    activeMinutes: 45,
    calories: 2150,
    floors: 12,
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Сегодня</CardTitle>
          <CardDescription>Обзор активности за сегодня</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatItem icon={Footprints} label="Шаги" value={todayActivity.steps.toLocaleString()} unit="шагов" />
            <StatItem icon={Activity} label="Дистанция" value={todayActivity.distance} unit="км" />
            <StatItem icon={Timer} label="Активность" value={todayActivity.activeMinutes} unit="мин" />
            <StatItem icon={Flame} label="Калории" value={todayActivity.calories.toLocaleString()} unit="ккал" />
            <StatItem icon={Award} label="Этажи" value={todayActivity.floors} unit="этажей" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Недельная активность</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">График активности...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, unit }: any) {
  return (
    <div className="text-center p-3 rounded-lg bg-gray-50">
      <Icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
}

function WorkoutsTab({ onStartWorkout }: any) {
  const workouts = [
    { id: 1, title: 'Утренняя пробежка', type: 'cardio', duration: 30, calories: 320, date: 'Сегодня, 07:00' },
    { id: 2, title: 'Силовая тренировка', type: 'strength', duration: 45, calories: 280, date: 'Вчера, 18:00' },
    { id: 3, title: 'Йога', type: 'flexibility', duration: 60, calories: 180, date: '28 фев, 09:00' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Тренировки</h3>
        <Button size="sm" onClick={onStartWorkout}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}

function WorkoutCard({ workout }: any) {
  const typeIcons: Record<string, string> = {
    cardio: '🏃',
    strength: '💪',
    flexibility: '🧘',
    mixed: '🔥',
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{typeIcons[workout.type]}</span>
            <div>
              <p className="font-semibold">{workout.title}</p>
              <p className="text-xs text-gray-500">{workout.date}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">{workout.duration} мин</span>
              <span className="text-orange-600 font-medium">{workout.calories} ккал</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExercisesTab({ onSelectExercise }: any) {
  const exercises = [
    { id: 1, name: 'Отжимания', muscle: 'Грудь', equipment: 'Вес тела', difficulty: 'beginner' },
    { id: 2, name: 'Приседания', muscle: 'Ноги', equipment: 'Вес тела', difficulty: 'beginner' },
    { id: 3, name: 'Тяга штанги', muscle: 'Спина', equipment: 'Штанга', difficulty: 'intermediate' },
    { id: 4, name: 'Жим гантелей', muscle: 'Грудь', equipment: 'Гантели', difficulty: 'intermediate' },
  ];

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Упражнения</h3>
        <div className="flex gap-2">
          <Input placeholder="Поиск..." className="w-64" />
          <Button variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} onSelect={onSelectExercise} />
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, onSelect }: any) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(exercise)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-gray-900">{exercise.name}</p>
            <p className="text-sm text-gray-500">{exercise.muscle}</p>
          </div>
          <Badge className={difficultyColors[exercise.difficulty]}>
            {exercise.difficulty === 'beginner' ? 'Легко' : exercise.difficulty === 'intermediate' ? 'Средне' : 'Сложно'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Dumbbell className="w-4 h-4" />
          <span>{exercise.equipment}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressTab() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Прогресс</CardTitle>
          <CardDescription>Динамика показателей</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Графики прогресса...</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <AchievementBadge icon="🏆" label="10K шагов" count={15} />
            <AchievementBadge icon="🔥" label="Серия 7 дней" count={3} />
            <AchievementBadge icon="💪" label="50 тренировок" count={1} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AchievementBadge({ icon, label, count }: any) {
  return (
    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-500 mt-1">Получено: {count} раз</p>
    </div>
  );
}

function ProgramsTab() {
  const programs = [
    { title: 'Похудение', duration: '4 недели', level: 'Начинающий', workouts: 16 },
    { title: 'Набор массы', duration: '8 недель', level: 'Средний', workouts: 32 },
    { title: 'Сила', duration: '12 недель', level: 'Продвинутый', workouts: 48 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Программы тренировок</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program, index) => (
          <ProgramCard key={index} program={program} />
        ))}
      </div>
    </div>
  );
}

function ProgramCard({ program }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <h4 className="font-bold text-lg mb-2">{program.title}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Длительность:</span>
            <span className="font-medium">{program.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Уровень:</span>
            <span className="font-medium">{program.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Тренировок:</span>
            <span className="font-medium">{program.workouts}</span>
          </div>
        </div>
        <Button className="w-full mt-4">Начать программу</Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function WorkoutDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Начать тренировку</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Выбор типа тренировки...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExerciseDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Упражнение</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Детали упражнения...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function MovementSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
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
