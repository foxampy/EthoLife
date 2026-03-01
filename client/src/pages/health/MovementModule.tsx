import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Activity, 
  ChevronLeft, 
  Clock, 
  Flame, 
  Settings, 
  Plus, 
  TrendingUp,
  Calendar,
  Trophy,
  Footprints,
  Timer,
  Dumbbell,
  Play,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  Search,
  Filter,
  MoreHorizontal,
  X
} from 'lucide-react';
import { useMovementStore, WorkoutType, Exercise } from '@/stores/modules/movementStore';
import { useHealthStore, moduleColors } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WorkoutLogger } from '@/components/health/WorkoutLogger';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Module color theme (Orange)
const theme = moduleColors.movement;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function MovementModule() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWorkoutLogger, setShowWorkoutLogger] = useState(false);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType>('strength');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const {
    initialize,
    isLoading,
    isInitialized,
    exercises,
    workouts,
    todayActivity,
    weeklyProgress,
    programs,
    plannedWorkouts,
    activeWorkout,
    isWorkoutActive,
    fetchExercises,
    startWorkout,
    formatDuration,
    getWorkoutTypeIcon,
    getMuscleGroupColor,
  } = useMovementStore();

  const { updateModuleScore } = useHealthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Update overall health score based on activity
  useEffect(() => {
    const stepProgress = Math.min(100, (todayActivity.steps / todayActivity.stepGoal) * 100);
    updateModuleScore('movement', Math.round(stepProgress));
  }, [todayActivity.steps, todayActivity.stepGoal, updateModuleScore]);

  // Filter exercises based on search and category
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.name_ru && ex.name_ru.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [exercises, searchQuery, selectedCategory]);

  // Calculate stats
  const todayWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.start_time).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return workoutDate === today;
  });

  const weekWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.start_time);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });

  const totalWeekDuration = weekWorkouts.reduce((acc, w) => acc + (w.duration_seconds || 0), 0);
  const totalWeekCalories = weekWorkouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0);

  const handleStartWorkout = (type: WorkoutType) => {
    setSelectedWorkoutType(type);
    startWorkout(type);
    setShowWorkoutLogger(true);
  };

  if (isLoading && !isInitialized) {
    return <MovementModuleSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 pt-16 md:pt-20">
      <div className="container max-w-7xl px-4 py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/health-center')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.bg }}
              >
                <Activity className="w-6 h-6" style={{ color: theme.primary }} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Движение</h1>
                <p className="text-sm text-foreground/60">Активность и тренировки</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="hidden sm:flex items-center gap-1"
                style={{ backgroundColor: theme.bg, color: theme.primary }}
              >
                <Flame className="w-3 h-3" />
                <span>{weekWorkouts.length} тренировок</span>
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-foreground/60" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-fit md:inline-flex">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="workouts">Тренировки</TabsTrigger>
            <TabsTrigger value="exercises">Упражнения</TabsTrigger>
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Activity Rings Card */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card 
                  className="overflow-hidden"
                  style={{ borderLeftWidth: '4px', borderLeftColor: theme.primary }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Activity Rings */}
                      <div className="shrink-0 relative">
                        <ActivityRings 
                          steps={todayActivity.steps}
                          stepsGoal={todayActivity.stepGoal}
                          calories={todayActivity.calories}
                          caloriesGoal={todayActivity.calorieGoal}
                          activeMinutes={todayActivity.activeMinutes}
                          activeMinutesGoal={todayActivity.activeMinutesGoal}
                        />
                      </div>

                      {/* Stats Grid */}
                      <div className="flex-1 w-full">
                        <h2 className="text-xl font-semibold mb-4">Сегодня</h2>
                        <div className="grid grid-cols-3 gap-4">
                          <ActivityStat
                            icon={<Footprints className="w-4 h-4" />}
                            label="Шаги"
                            value={todayActivity.steps.toLocaleString()}
                            goal={todayActivity.stepGoal.toLocaleString()}
                            color={theme.primary}
                            percentage={Math.min(100, (todayActivity.steps / todayActivity.stepGoal) * 100)}
                          />
                          <ActivityStat
                            icon={<Flame className="w-4 h-4" />}
                            label="Калории"
                            value={todayActivity.calories.toString()}
                            goal={todayActivity.calorieGoal.toString()}
                            color="#ef4444"
                            percentage={Math.min(100, (todayActivity.calories / todayActivity.calorieGoal) * 100)}
                          />
                          <ActivityStat
                            icon={<Timer className="w-4 h-4" />}
                            label="Активность"
                            value={`${todayActivity.activeMinutes} мин`}
                            goal={`${todayActivity.activeMinutesGoal} мин`}
                            color="#22c55e"
                            percentage={Math.min(100, (todayActivity.activeMinutes / todayActivity.activeMinutesGoal) * 100)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Start Card */}
              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" style={{ color: theme.primary }} />
                      Быстрый старт
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <QuickStartButton 
                      icon="💪"
                      label="Силовая"
                      onClick={() => handleStartWorkout('strength')}
                      color={theme.primary}
                    />
                    <QuickStartButton 
                      icon="🏃"
                      label="Кардио"
                      onClick={() => handleStartWorkout('cardio')}
                      color="#3b82f6"
                    />
                    <QuickStartButton 
                      icon="🧘"
                      label="Йога"
                      onClick={() => handleStartWorkout('yoga')}
                      color="#8b5cf6"
                    />
                    <QuickStartButton 
                      icon="⚡"
                      label="HIIT"
                      onClick={() => handleStartWorkout('hiit')}
                      color="#eab308"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Today's Workouts & Planned */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Dumbbell className="w-5 h-5" style={{ color: theme.primary }} />
                        Сегодня
                      </CardTitle>
                      <Badge variant="outline">{todayWorkouts.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {todayWorkouts.length > 0 ? (
                      <div className="space-y-3">
                        {todayWorkouts.map((workout) => (
                          <WorkoutItem key={workout.id} workout={workout} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-foreground/60">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Нет тренировок сегодня</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3"
                          onClick={() => setActiveTab('workouts')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Начать
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" style={{ color: theme.primary }} />
                        Запланировано
                      </CardTitle>
                      <Badge variant="outline">{plannedWorkouts.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {plannedWorkouts.length > 0 ? (
                      <div className="space-y-3">
                        {plannedWorkouts.slice(0, 3).map((workout) => (
                          <PlannedWorkoutItem key={workout.id} workout={workout} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-foreground/60">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Нет запланированных тренировок</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Weekly Chart */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
                    За 7 дней
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weeklyProgress.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' })}
                          className="text-xs"
                        />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="steps" 
                          stroke={theme.primary} 
                          fill={theme.primary}
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-foreground/60">
                      Недостаточно данных для отображения
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* WORKOUTS TAB */}
          <TabsContent value="workouts" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {(['strength', 'cardio', 'hiit', 'yoga', 'running', 'cycling', 'swimming', 'sports'] as WorkoutType[]).map((type) => (
                <motion.div key={type} variants={itemVariants}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleStartWorkout(type)}
                  >
                    <span className="text-2xl">{getWorkoutTypeIcon(type)}</span>
                    <span className="text-sm capitalize">{getWorkoutTypeLabel(type)}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>История тренировок</CardTitle>
                  <Badge variant="secondary">{workouts.length} всего</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {workouts.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {workouts.map((workout) => (
                        <WorkoutItem key={workout.id} workout={workout} detailed />
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                    <p className="text-foreground/60">Пока нет тренировок</p>
                    <Button 
                      className="mt-4" 
                      style={{ backgroundColor: theme.primary }}
                      onClick={() => handleStartWorkout('strength')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Начать первую
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EXERCISES TAB */}
          <TabsContent value="exercises" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                      <Input
                        placeholder="Поиск упражнений..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                  <ScrollArea className="w-full">
                    <div className="flex gap-2 pb-2">
                      {['all', 'strength', 'cardio', 'flexibility', 'mobility'].map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedCategory === cat ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(cat)}
                          style={selectedCategory === cat ? { backgroundColor: theme.primary } : {}}
                        >
                          {cat === 'all' ? 'Все' : 
                           cat === 'strength' ? 'Сила' :
                           cat === 'cardio' ? 'Кардио' :
                           cat === 'flexibility' ? 'Гибкость' : 'Мобильность'}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ExerciseCard exercise={exercise} />
                    </motion.div>
                  ))}
                </div>
                {filteredExercises.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                    <p className="text-foreground/60">Упражнения не найдены</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROGRESS TAB */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Время тренировок"
                value={formatDuration(totalWeekDuration)}
                subtext="За неделю"
                color={theme.primary}
              />
              <StatCard
                icon={<Flame className="w-5 h-5" />}
                label="Калории"
                value={totalWeekCalories.toLocaleString()}
                subtext="За неделю"
                color="#ef4444"
              />
              <StatCard
                icon={<Target className="w-5 h-5" />}
                label="Тренировок"
                value={weekWorkouts.length.toString()}
                subtext="За неделю"
                color="#22c55e"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Недельная активность</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill={theme.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Workout Logger Dialog */}
      <Dialog open={showWorkoutLogger} onOpenChange={setShowWorkoutLogger}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{getWorkoutTypeIcon(selectedWorkoutType)}</span>
              {getWorkoutTypeLabel(selectedWorkoutType)}
            </DialogTitle>
          </DialogHeader>
          <WorkoutLogger 
            onComplete={() => {
              setShowWorkoutLogger(false);
              setActiveTab('overview');
            }}
            onCancel={() => setShowWorkoutLogger(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function ActivityRings({ 
  steps, stepsGoal, 
  calories, caloriesGoal, 
  activeMinutes, activeMinutesGoal 
}: { 
  steps: number; stepsGoal: number;
  calories: number; caloriesGoal: number;
  activeMinutes: number; activeMinutesGoal: number;
}) {
  const rings = [
    { value: steps / stepsGoal, color: theme.primary, size: 160, stroke: 12 },
    { value: calories / caloriesGoal, color: '#ef4444', size: 130, stroke: 10 },
    { value: activeMinutes / activeMinutesGoal, color: '#22c55e', size: 100, stroke: 8 },
  ];

  return (
    <div className="relative w-40 h-40">
      {rings.map((ring, index) => {
        const radius = (ring.size - ring.stroke) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - Math.min(ring.value, 1));

        return (
          <svg
            key={index}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
            width={ring.size}
            height={ring.size}
          >
            <circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={ring.stroke}
            />
            <motion.circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
            />
          </svg>
        );
      })}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Footprints className="w-6 h-6 mb-1" style={{ color: theme.primary }} />
        <span className="text-2xl font-bold">{Math.round((steps / stepsGoal) * 100)}%</span>
      </div>
    </div>
  );
}

function ActivityStat({ icon, label, value, goal, color, percentage }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  goal: string;
  color: string;
  percentage: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs text-foreground/60">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <Progress value={percentage} className="h-1.5" />
      <p className="text-xs text-foreground/40">Цель: {goal}</p>
    </div>
  );
}

function QuickStartButton({ icon, label, onClick, color }: {
  icon: string;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3 h-auto py-3"
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <Play className="w-4 h-4" style={{ color }} />
    </Button>
  );
}

function WorkoutItem({ workout, detailed = false }: { workout: any; detailed?: boolean }) {
  const { formatDuration, getWorkoutTypeIcon } = useMovementStore();
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: theme.bg }}
      >
        {getWorkoutTypeIcon(workout.workout_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{workout.name || getWorkoutTypeLabel(workout.workout_type)}</p>
        <p className="text-sm text-foreground/60">
          {new Date(workout.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          {' • '}
          {formatDuration(workout.duration_seconds || 0)}
        </p>
      </div>
      {detailed && workout.calories_burned && (
        <Badge variant="secondary">
          <Flame className="w-3 h-3 mr-1" />
          {workout.calories_burned}
        </Badge>
      )}
    </div>
  );
}

function PlannedWorkoutItem({ workout }: { workout: any }) {
  const { getWorkoutTypeIcon } = useMovementStore();
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-slate-50/50">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: theme.bg }}
      >
        {getWorkoutTypeIcon(workout.workout_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{workout.name}</p>
        <p className="text-sm text-foreground/60">
          {new Date(workout.scheduled_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          {workout.scheduled_time && ` в ${workout.scheduled_time.slice(0, 5)}`}
        </p>
      </div>
      <Button variant="ghost" size="sm">
        <Play className="w-4 h-4" style={{ color: theme.primary }} />
      </Button>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { getMuscleGroupColor } = useMovementStore();
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: theme.bg }}
          >
            {exercise.category === 'strength' && <Dumbbell className="w-6 h-6" style={{ color: theme.primary }} />}
            {exercise.category === 'cardio' && <Activity className="w-6 h-6" style={{ color: '#3b82f6' }} />}
            {exercise.category === 'flexibility' && <span className="text-2xl">🧘</span>}
            {exercise.category === 'mobility' && <span className="text-2xl">🤸</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{exercise.name_ru || exercise.name}</h3>
            <p className="text-sm text-foreground/60 capitalize">{exercise.category}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {exercise.muscle_groups?.slice(0, 3).map((group) => (
                <Badge 
                  key={group} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${getMuscleGroupColor(group)}20`,
                    color: getMuscleGroupColor(group)
                  }}
                >
                  {group}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ icon, label, value, subtext, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <span className="text-sm text-foreground/60">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-foreground/40">{subtext}</p>
      </CardContent>
    </Card>
  );
}

// ============================================
// SKELETON LOADING
// ============================================

function MovementModuleSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 pt-16 md:pt-20">
      <div className="container max-w-7xl px-4 py-6 md:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="w-32 h-8 mb-1" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>

        <Skeleton className="w-full h-10 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-64" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getWorkoutTypeLabel(type: WorkoutType): string {
  const labels: Record<WorkoutType, string> = {
    cardio: 'Кардио',
    strength: 'Силовая',
    hiit: 'HIIT',
    yoga: 'Йога',
    pilates: 'Пилатес',
    running: 'Бег',
    cycling: 'Велосипед',
    swimming: 'Плавание',
    walking: 'Ходьба',
    hiking: 'Треккинг',
    sports: 'Спорт',
    martial_arts: 'Единоборства',
    dance: 'Танцы',
    other: 'Другое',
  };
  return labels[type] || 'Тренировка';
}
