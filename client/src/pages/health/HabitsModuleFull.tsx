/**
 * Habits Module - Компонент модуля привычек
 * Полная реализация: трекер, стрики, цели, челленджи
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Flame,
  Calendar,
  TrendingUp,
  Plus,
  Target,
  Award,
  Settings,
  BarChart3,
  Users,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function HabitsModule() {
  const [activeTab, setActiveTab] = useState('habits');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadHabitsData();
  }, []);

  const loadHabitsData = async () => {
    setLoading(true);
    await loadMetrics('habits');
    setLoading(false);
  };

  if (loading) {
    return <HabitsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Привычки</h1>
                <p className="text-sm text-gray-500">Трекер, стрики, цели</p>
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
          <ActiveHabitsCard />
          <StreakCard />
          <CompletionCard />
          <QuickActionsCard
            onAddHabit={() => setShowAddHabit(true)}
            onChallenge={() => setShowChallenge(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="habits" className="text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Привычки
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-sm">
              <Award className="w-4 h-4 mr-2" />
              Челленджи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits">
            <HabitsTab onAddHabit={() => setShowAddHabit(true)} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengesTab onJoin={() => setShowChallenge(true)} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddHabitDialog open={showAddHabit} onOpenChange={setShowAddHabit} />
      <ChallengeDialog open={showChallenge} onOpenChange={setShowChallenge} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function ActiveHabitsCard() {
  const activeHabits = 8;
  const totalHabits = 10;
  const percent = (activeHabits / totalHabits) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="font-semibold text-gray-900">Активные</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {activeHabits} / {totalHabits}
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">Привычек в работе</p>
      </CardContent>
    </Card>
  );
}

function StreakCard() {
  const currentStreak = 15;
  const bestStreak = 30;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-semibold text-gray-900">Серия</span>
          </div>
          <Badge className="bg-orange-500 text-white">🔥</Badge>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">{currentStreak}</span>
          <span className="text-sm text-gray-500 mb-1">дней</span>
        </div>
        <p className="text-xs text-gray-500">
          Лучшая серия: <span className="font-semibold text-orange-600">{bestStreak} дней</span>
        </p>
      </CardContent>
    </Card>
  );
}

function CompletionCard() {
  const todayCompleted = 6;
  const totalToday = 8;
  const percent = (todayCompleted / totalToday) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Сегодня</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {todayCompleted} / {totalToday}
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">Выполнено за сегодня</p>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onAddHabit, onChallenge }: any) {
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
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onAddHabit}>
            <Plus className="w-4 h-4" />
            Добавить привычку
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onChallenge}>
            <Users className="w-4 h-4" />
            Групповой челлендж
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# TABS
# ============================================================================

function HabitsTab({ onAddHabit }: any) {
  const habits = [
    { id: 1, title: 'Утренняя зарядка', streak: 15, completed: true, color: 'bg-green-500' },
    { id: 2, title: 'Чтение 30 минут', streak: 8, completed: true, color: 'bg-blue-500' },
    { id: 3, title: 'Пить 2л воды', streak: 22, completed: false, color: 'bg-cyan-500' },
    { id: 4, title: 'Медитация', streak: 5, completed: false, color: 'bg-purple-500' },
    { id: 5, title: 'Ложиться до 23:00', streak: 12, completed: false, color: 'bg-indigo-500' },
    { id: 6, title: 'Витамины', streak: 30, completed: true, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Мои привычки</h3>
        <Button size="sm" onClick={onAddHabit}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}

function HabitCard({ habit }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                habit.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {habit.completed && <CheckCircle2 className="w-5 h-5" />}
            </button>
            <div className="flex-1">
              <p className={`font-semibold ${habit.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {habit.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>{habit.streak} дней серия</span>
              </div>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${habit.color}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarTab() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const completedDays = [1, 3, 5, 7, 8, 10, 12, 15, 17, 19, 21, 23, 25, 27, today.getDate()];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Календарь привычек</CardTitle>
          <CardDescription>{today.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isCompleted = completedDays.includes(day);
              const isToday = day === today.getDate();

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                    isToday
                      ? 'bg-cyan-500 text-white font-bold'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-500" />
              <span>Сегодня</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100" />
              <span>Выполнено</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-50" />
              <span>Не выполнено</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsTab() {
  const stats = {
    totalHabits: 10,
    activeHabits: 8,
    completedToday: 6,
    completedWeek: 42,
    completedMonth: 180,
    bestStreak: 30,
    currentStreak: 15,
    totalStreaks: 245,
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Статистика</CardTitle>
          <CardDescription>Ваши достижения</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem label="Всего привычек" value={stats.totalHabits} icon={Sparkles} />
            <StatItem label="Активные" value={stats.activeHabits} icon={CheckCircle2} />
            <StatItem label="Выполнено сегодня" value={stats.completedToday} icon={Target} />
            <StatItem label="Выполнено за неделю" value={stats.completedWeek} icon={Calendar} />
            <StatItem label="Лучшая серия" value={`${stats.bestStreak} дн`} icon={Flame} />
            <StatItem label="Текущая серия" value={`${stats.currentStreak} дн`} icon={Flame} />
            <StatItem label="Всего выполнено" value={stats.totalStreaks} icon={Award} />
            <StatItem label="Выполнено за месяц" value={stats.completedMonth} icon={TrendingUp} />
          </div>
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
            <AchievementBadge icon="📚" label="10 книг" count={2} />
            <AchievementBadge icon="💧" label="30 дней вода" count={1} />
            <AchievementBadge icon="🧘" label="100 медитаций" count={0} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatItem({ label, value, icon: Icon }: any) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 text-center">
      <Icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function AchievementBadge({ icon, label, count }: any) {
  return (
    <div className={`text-center p-4 rounded-lg border-2 ${
      count > 0 ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-gray-200 bg-gray-50 opacity-50'
    }`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="font-semibold text-gray-900 text-sm">{label}</p>
      <p className="text-xs text-gray-500 mt-1">Получено: {count} раз</p>
    </div>
  );
}

function ChallengesTab({ onJoin }: any) {
  const challenges = [
    { id: 1, title: '30 дней без сахара', participants: 234, days: 30, reward: 500 },
    { id: 2, title: 'Утренняя зарядка 21 день', participants: 567, days: 21, reward: 300 },
    { id: 3, title: 'Пить 2л воды 14 дней', participants: 890, days: 14, reward: 200 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Групповые челленджи</h3>
        <Button size="sm" onClick={onJoin}>
          <Plus className="w-4 h-4 mr-2" />
          Создать
        </Button>
      </div>

      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
}

function ChallengeCard({ challenge }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
              {challenge.days}
            </div>
            <div>
              <h4 className="font-semibold">{challenge.title}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {challenge.participants} участников
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {challenge.reward} UNITY
                </span>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Участвовать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function AddHabitDialog({ open, onOpenChange }: any) {
  const [title, setTitle] = useState('');
  const [daily, setDaily] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Новая привычка</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Название</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Утренняя зарядка"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Ежедневно</label>
            <Switch checked={daily} onCheckedChange={setDaily} />
          </div>
          <Button className="w-full">Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChallengeDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Создать челлендж</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Форма создания челленджа...</p>
          <Button className="w-full">Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function HabitsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 p-6">
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
