import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Moon, 
  ChevronLeft, 
  Clock, 
  Flame, 
  Settings, 
  Plus, 
  CheckCircle2,
  Circle,
  Brain,
  Wind,
  Thermometer,
  Heart,
  AlertCircle,
  Zap,
  Coffee,
  Utensils,
  Smartphone,
  Lightbulb,
  Sparkles,
  Snowflake,
  VolumeX,
  Calendar,
  TrendingUp,
  Bell,
  Sun,
  Bed,
  Info
} from 'lucide-react';
import { 
  SleepTimeline, 
  SleepRing, 
  SleepQualityIndicator,
  MiniSleepBar 
} from '@/components/health/SleepTimeline';
import { useSleepStore } from '@/stores/modules/sleepStore';
import { useHealthStore, moduleColors } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Module color theme
const theme = moduleColors.sleep;

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
    transition: { duration: 0.4, ease: "easeInOut" as any }
  }
};

export default function SleepModule() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    initialize,
    isLoading,
    isInitialized,
    todaySleep,
    goals,
    weeklyData,
    insights,
    sessions,
    naps,
    updateGoals,
    completeChecklistItem,
    fetchSessions,
    formatDuration,
    getRecommendedBedtime,
  } = useSleepStore();

  const { updateModuleScore } = useHealthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
    fetchSessions(7);
  }, [isInitialized, initialize, fetchSessions]);

  // Update overall health score when sleep score changes
  useEffect(() => {
    if (todaySleep.score > 0) {
      updateModuleScore('sleep', todaySleep.score);
    }
  }, [todaySleep.score, updateModuleScore]);

  const handleToggleSmartAlarm = async (enabled: boolean) => {
    await updateGoals({ is_smart_alarm_enabled: enabled });
  };

  const handleAlarmWindowChange = async (value: number[]) => {
    await updateGoals({ smart_alarm_window_minutes: value[0] });
  };

  if (isLoading && !isInitialized) {
    return <SleepModuleSkeleton />;
  }

  const hasSleepData = !!todaySleep.session;
  const sleepDebt = sessions.reduce((acc, s) => {
    const target = goals?.target_duration_minutes || 480;
    return acc + Math.max(0, target - (s.duration_minutes || 0));
  }, 0);

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
                <Moon className="w-6 h-6" style={{ color: theme.primary }} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Сон</h1>
                <p className="text-sm text-foreground/60">Отслеживание и анализ сна</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {todaySleep.score >= 80 && (
                <Badge 
                  variant="secondary" 
                  className="hidden sm:flex items-center gap-1"
                  style={{ backgroundColor: theme.bg, color: theme.primary }}
                >
                  <Flame className="w-3 h-3" />
                  <span>12 дней streak</span>
                </Badge>
              )}
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
            <TabsTrigger value="timeline">Таймлайн</TabsTrigger>
            <TabsTrigger value="hygiene">Гигиена</TabsTrigger>
            <TabsTrigger value="alarm">Будильник</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Sleep Card */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card 
                  className="overflow-hidden"
                  style={{ borderLeftWidth: '4px', borderLeftColor: theme.primary }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Sleep Ring */}
                      <div className="shrink-0">
                        <SleepRing
                          currentMinutes={todaySleep.session?.duration_minutes || 0}
                          targetMinutes={goals?.target_duration_minutes || 480}
                          qualityScore={todaySleep.score}
                          size="lg"
                        />
                      </div>

                      {/* Sleep Info */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <h2 className="text-xl font-semibold">Прошлая ночь</h2>
                          {hasSleepData && (
                            <SleepQualityIndicator 
                              score={todaySleep.score} 
                              size="sm" 
                              showLabel={false}
                            />
                          )}
                        </div>

                        {hasSleepData ? (
                          <>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4 text-violet-500" />
                                <span className="text-sm text-foreground/60">Отбой:</span>
                                <span className="font-medium">
                                  {formatTime(todaySleep.session?.bedtime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-foreground/60">Подъем:</span>
                                <span className="font-medium">
                                  {todaySleep.session?.wake_time 
                                    ? formatTime(todaySleep.session.wake_time)
                                    : '--:--'
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <StatBadge
                                icon={<Zap className="w-3 h-3" />}
                                label="Эффективность"
                                value={`${Math.round(todaySleep.session?.sleep_efficiency_percent || 0)}%`}
                                color={theme.primary}
                              />
                              <StatBadge
                                icon={<Clock className="w-3 h-3" />}
                                label="Засыпание"
                                value={`${todaySleep.session?.sleep_latency_minutes || 0} мин`}
                                color={theme.primary}
                              />
                              <StatBadge
                                icon={<Brain className="w-3 h-3" />}
                                label="Пробуждений"
                                value={`${Math.round((todaySleep.session?.awake_duration_minutes || 0) / 10)}`}
                                color={theme.primary}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-foreground/60 mb-3">Нет данных о прошлой ночи</p>
                            <Button 
                              size="sm"
                              style={{ backgroundColor: theme.primary }}
                              onClick={() => setActiveTab('timeline')}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Добавить сон
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Phase Breakdown */}
                    {hasSleepData && todaySleep.session?.phases && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-sm font-medium text-foreground/60 mb-3">Фазы сна</h3>
                        <SleepTimeline 
                          phases={todaySleep.session.phases}
                          bedtime={todaySleep.session.bedtime}
                          wakeTime={todaySleep.session.wake_time}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Side Stats */}
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Sleep Debt Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground/60">Долг сна</span>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold">
                      {sleepDebt > 0 ? formatDuration(sleepDebt) : 'Нет'}
                    </p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {sleepDebt > 120 
                        ? 'Рекомендуем раньше лечь сегодня'
                        : sleepDebt > 0 
                          ? 'Небольшой недосып'
                          : 'Вы высыпаетесь!'
                      }
                    </p>
                  </CardContent>
                </Card>

                {/* Recommended Bedtime */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground/60">Рекомендуемый отбой</span>
                      <Bed className="w-4 h-4 text-violet-500" />
                    </div>
                    <p className="text-2xl font-bold">{getRecommendedBedtime()}</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      Для {formatDuration(goals?.target_duration_minutes || 480)} сна
                    </p>
                  </CardContent>
                </Card>

                {/* Chronotype */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground/60">Хронотип</span>
                      <Brain className="w-4 h-4 text-indigo-500" />
                    </div>
                    <p className="text-xl font-bold capitalize">
                      {goals?.chronotype === 'lion' && '🦁 Лев'}
                      {goals?.chronotype === 'bear' && '🐻 Медведь'}
                      {goals?.chronotype === 'wolf' && '🐺 Волк'}
                      {goals?.chronotype === 'dolphin' && '🐬 Дельфин'}
                    </p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {goals?.chronotype === 'lion' && 'Ранний подъем, ранний отбой'}
                      {goals?.chronotype === 'bear' && 'Средний ритм, 7-8 часов сна'}
                      {goals?.chronotype === 'wolf' && 'Поздний подъем, поздний отбой'}
                      {goals?.chronotype === 'dolphin' && 'Чуткий сон, частые пробуждения'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Weekly Trend */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
                    За 7 дней
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weeklyData.length > 0 ? (
                    <div className="space-y-4">
                      {weeklyData.slice(0, 7).map((day, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <span className="w-12 text-sm text-foreground/60">
                            {formatDay(day.date)}
                          </span>
                          <div className="flex-1">
                            <MiniSleepBar phases={sessions.find(s => s.date === day.date)?.phases || []} />
                          </div>
                          <span className="w-20 text-sm text-right font-medium">
                            {formatDurationShort(day.duration_minutes)}
                          </span>
                          <span className={cn(
                            "w-12 text-sm text-right",
                            day.quality_score >= 80 ? "text-emerald-500" : 
                            day.quality_score >= 60 ? "text-yellow-500" : "text-red-500"
                          )}>
                            {day.quality_score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-foreground/60 py-8">
                      Недостаточно данных для отображения тренда
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card style={{ backgroundColor: theme.bg }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="w-5 h-5" style={{ color: theme.primary }} />
                      AI Рекомендации
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.slice(0, 3).map((insight) => (
                        <div 
                          key={insight.id}
                          className="flex items-start gap-3 p-3 bg-white rounded-lg"
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: theme.bg }}
                          >
                            <Info className="w-4 h-4" style={{ color: theme.primary }} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{insight.title}</p>
                            <p className="text-sm text-foreground/60">{insight.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* TIMELINE TAB */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>История сна</CardTitle>
                <CardDescription>Детальный анализ ваших сновидений</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-6">
                    {sessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border hover:border-violet-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">{formatFullDate(session.date)}</p>
                            <p className="text-sm text-foreground/60">
                              {formatTime(session.bedtime)} - {session.wake_time ? formatTime(session.wake_time) : '...'}
                            </p>
                          </div>
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: getScoreColor(session.quality_score || 0),
                              color: 'white'
                            }}
                          >
                            {session.quality_score || 0}%
                          </Badge>
                        </div>
                        
                        {session.phases && session.phases.length > 0 && (
                          <SleepTimeline 
                            phases={session.phases}
                            bedtime={session.bedtime}
                            wakeTime={session.wake_time}
                            compact
                          />
                        )}
                        
                        <div className="flex gap-4 mt-3 text-sm">
                          <span className="text-foreground/60">
                            Длительность: <span className="text-foreground font-medium">
                              {formatDuration(session.duration_minutes || 0)}
                            </span>
                          </span>
                          <span className="text-foreground/60">
                            Эффективность: <span className="text-foreground font-medium">
                              {Math.round(session.sleep_efficiency_percent || 0)}%
                            </span>
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Moon className="w-12 h-12 mx-auto mb-4 text-foreground/20" />
                    <p className="text-foreground/60 mb-4">Пока нет записей о сне</p>
                    <Button style={{ backgroundColor: theme.primary }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить запись
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* HYGIENE TAB */}
          <TabsContent value="hygiene" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: theme.primary }} />
                  Чеклист гигиены сна
                </CardTitle>
                <CardDescription>
                  Выполните эти действия для лучшего качества сна
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ChecklistItem
                    icon={<Coffee className="w-5 h-5" />}
                    label="Нет кофеина после 14:00"
                    description="Последний кофе в 10:30 ✓"
                    checked={todaySleep.routine?.no_caffeine_after_14h || false}
                    onToggle={() => completeChecklistItem('no_caffeine_after_14h')}
                  />
                  <ChecklistItem
                    icon={<Utensils className="w-5 h-5" />}
                    label="Легкий ужин (не позднее 3ч)"
                    description="Установить напоминание 18:30"
                    checked={todaySleep.routine?.no_heavy_meal_3h_before || false}
                    onToggle={() => completeChecklistItem('no_heavy_meal_3h_before')}
                  />
                  <ChecklistItem
                    icon={<Smartphone className="w-5 h-5" />}
                    label="Нет экранов за час до сна"
                    description="21:00 включить серый фильтр"
                    checked={todaySleep.routine?.no_screens_1h_before || false}
                    onToggle={() => completeChecklistItem('no_screens_1h_before')}
                  />
                  <ChecklistItem
                    icon={<Lightbulb className="w-5 h-5" />}
                    label="Приглушенный свет"
                    description="Авто: закат в 20:30"
                    checked={todaySleep.routine?.dimmed_lights || false}
                    onToggle={() => completeChecklistItem('dimmed_lights')}
                  />
                  <ChecklistItem
                    icon={<Sparkles className="w-5 h-5" />}
                    label="Расслабление/медитация"
                    description="Запустить sleep story"
                    checked={todaySleep.routine?.meditation_or_relaxation || false}
                    onToggle={() => completeChecklistItem('meditation_or_relaxation')}
                  />
                  <ChecklistItem
                    icon={<Clock className="w-5 h-5" />}
                    label="Постоянное время отбоя"
                    description="±30 минут от целевого"
                    checked={todaySleep.routine?.consistent_bedtime || false}
                    onToggle={() => completeChecklistItem('consistent_bedtime')}
                  />
                  <ChecklistItem
                    icon={<Snowflake className="w-5 h-5" />}
                    label="Прохладная комната (18-20°)"
                    description="Сейчас: 21° - открыть окно?"
                    checked={todaySleep.routine?.cool_room || false}
                    onToggle={() => completeChecklistItem('cool_room')}
                  />
                  <ChecklistItem
                    icon={<VolumeX className="w-5 h-5" />}
                    label="Темнота и тишина"
                    description="Включить white noise"
                    checked={todaySleep.routine?.darkness_and_silence || false}
                    onToggle={() => completeChecklistItem('darkness_and_silence')}
                  />
                </div>

                {/* Environment Score */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Оценка среды</span>
                    <span className="text-lg font-bold" style={{ color: theme.primary }}>
                      {todaySleep.routine?.environment_score || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={todaySleep.routine?.environment_score || 0} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Optimal Sleep Time Card */}
            <Card style={{ backgroundColor: theme.bg }}>
              <CardContent className="p-6">
                <div className="text-center">
                  <Bed className="w-12 h-12 mx-auto mb-3" style={{ color: theme.primary }} />
                  <h3 className="text-lg font-semibold mb-1">Оптимальное время сна</h3>
                  <p className="text-2xl font-bold mb-2" style={{ color: theme.primary }}>
                    {getRecommendedBedtime()} - {goals?.target_wake_time?.slice(0, 5) || '06:30'}
                  </p>
                  <p className="text-sm text-foreground/60 mb-4">
                    {formatDuration(goals?.target_duration_minutes || 480)} для полного восстановления
                  </p>
                  <Button style={{ backgroundColor: theme.primary }}>
                    <Moon className="w-4 h-4 mr-2" />
                    Заснуть сейчас
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ALARM TAB */}
          <TabsContent value="alarm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" style={{ color: theme.primary }} />
                  Умный будильник
                </CardTitle>
                <CardDescription>
                  Разбудит вас в оптимальной фазе сна
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Smart Alarm Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Умное пробуждение</p>
                    <p className="text-sm text-foreground/60">
                      Будильник сработает в легкой фазе
                    </p>
                  </div>
                  <Switch 
                    checked={goals?.is_smart_alarm_enabled || false}
                    onCheckedChange={handleToggleSmartAlarm}
                  />
                </div>

                {/* Alarm Window */}
                <AnimatePresence>
                  {goals?.is_smart_alarm_enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Окно пробуждения</span>
                          <span className="text-sm" style={{ color: theme.primary }}>
                            {goals?.smart_alarm_window_minutes || 30} мин
                          </span>
                        </div>
                        <Slider
                          value={[goals?.smart_alarm_window_minutes || 30]}
                          onValueChange={handleAlarmWindowChange}
                          min={10}
                          max={60}
                          step={5}
                        />
                        <p className="text-xs text-foreground/60 mt-1">
                          Будильник сработает за {goals?.smart_alarm_window_minutes || 30} минут до установленного времени, 
                          когда вы будете в легкой фазе сна
                        </p>
                      </div>

                      <div className="p-4 bg-violet-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Brain className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Как это работает?</p>
                            <p className="text-sm text-foreground/60 mt-1">
                              Смарт-будильник отслеживает движения и определяет фазы сна. 
                              Если в окно будильника наступает легкая фаза — он разбудит вас тогда, 
                              когда проснуться будет легче всего.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Alarm Schedule */}
                <div className="space-y-3">
                  <p className="font-medium">Расписание</p>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Будни</p>
                        <p className="text-sm text-foreground/60">
                          {goals?.workdays_schedule?.wake_time?.slice(0, 5) || '06:30'}
                        </p>
                      </div>
                    </div>
                    <Switch checked={goals?.workdays_schedule?.is_enabled ?? true} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Выходные</p>
                        <p className="text-sm text-foreground/60">
                          {goals?.weekend_schedule?.wake_time?.slice(0, 5) || '08:00'}
                        </p>
                      </div>
                    </div>
                    <Switch checked={goals?.weekend_schedule?.is_enabled ?? true} />
                  </div>
                </div>

                {/* Sound Selection */}
                <div className="space-y-2">
                  <p className="font-medium">Звук будильника</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['birds', 'ocean', 'rain', 'forest', 'melody', 'classic'].map((sound) => (
                      <Button
                        key={sound}
                        variant={goals?.alarm_sound === sound ? 'default' : 'outline'}
                        size="sm"
                        className="capitalize"
                        style={goals?.alarm_sound === sound ? { backgroundColor: theme.primary } : {}}
                      >
                        {sound === 'birds' && '🐦 Птицы'}
                        {sound === 'ocean' && '🌊 Океан'}
                        {sound === 'rain' && '🌧️ Дождь'}
                        {sound === 'forest' && '🌲 Лес'}
                        {sound === 'melody' && '🎵 Мелодия'}
                        {sound === 'classic' && '🔔 Классика'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function StatBadge({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
      <span style={{ color }}>{icon}</span>
      <div>
        <p className="text-xs text-foreground/60">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

function ChecklistItem({ 
  icon, 
  label, 
  description, 
  checked, 
  onToggle 
}: { 
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
        checked ? "bg-violet-50 border-violet-200" : "hover:bg-slate-50"
      )}
      onClick={onToggle}
    >
      <div className={cn(
        "mt-0.5 transition-colors",
        checked ? "text-violet-500" : "text-slate-300"
      )}>
        {checked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className={cn(
          "font-medium transition-colors",
          checked && "text-violet-900"
        )}>
          {label}
        </p>
        <p className="text-sm text-foreground/60">{description}</p>
      </div>
      <div className={cn(
        "text-violet-500 transition-opacity",
        !checked && "opacity-0"
      )}>
        {icon}
      </div>
    </div>
  );
}

// ============================================
// SKELETON LOADING
// ============================================

function SleepModuleSkeleton() {
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
            <Skeleton className="w-full h-80" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(isoString: string): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDay(dateString: string): string {
  const date = new Date(dateString);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long',
    weekday: 'short'
  });
}

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0ч 0мин';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}мин`;
  if (mins === 0) return `${hours}ч`;
  return `${hours}ч ${mins}мин`;
}

function formatDurationShort(minutes: number): string {
  if (!minutes || minutes <= 0) return '0ч';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}ч`;
  return `${hours}ч ${mins}м`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}
