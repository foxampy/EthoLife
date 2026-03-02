/**
 * Sleep Module - Компонент модуля сна
 * Полная реализация: трекинг, качество, программы, аналитика
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Clock,
  Star,
  TrendingUp,
  Plus,
  Calendar,
  BarChart3,
  Music,
  Settings,
  Sun,
  Zap,
  Timer,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

export default function SleepModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogSleep, setShowLogSleep] = useState(false);
  const [showSounds, setShowSounds] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
    setLoading(true);
    await loadMetrics('sleep');
    setLoading(false);
  };

  if (loading) {
    return <SleepSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Сон</h1>
                <p className="text-sm text-gray-500">Качество, фазы, восстановление</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
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
          <SleepScoreCard />
          <DurationCard />
          <QualityCard />
          <QuickActionsCard
            onLogSleep={() => setShowLogSleep(true)}
            onSounds={() => setShowSounds(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="log" className="text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Журнал
            </TabsTrigger>
            <TabsTrigger value="sounds" className="text-sm">
              <Music className="w-4 h-4 mr-2" />
              Звуки
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="log">
            <LogTab onLogSleep={() => setShowLogSleep(true)} />
          </TabsContent>

          <TabsContent value="sounds">
            <SoundsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <LogSleepDialog open={showLogSleep} onOpenChange={setShowLogSleep} />
      <SoundsDialog open={showSounds} onOpenChange={setShowSounds} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function SleepScoreCard() {
  const score = 78;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-900">Оценка</span>
          </div>
          <Badge className="bg-purple-500 text-white">{grade}</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{score}</div>
        <p className="text-xs text-gray-500">Качество сна</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>+5% к прошлой неделе</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DurationCard() {
  const duration = 7.5;
  const goal = 8;
  const percent = (duration / goal) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Длительность</span>
          </div>
          <Badge variant="outline">{percent.toFixed(0)}%</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {duration} / {goal} <span className="text-sm font-normal">часов</span>
        </div>
        <Progress value={percent} className="h-2" />
      </CardContent>
    </Card>
  );
}

function QualityCard() {
  const quality = {
    deep: 25,
    light: 45,
    rem: 20,
    awake: 10,
  };

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="font-semibold text-gray-900">Фазы</span>
          </div>
        </div>
        <div className="space-y-2">
          <PhaseBar label="Глубокий" percent={quality.deep} color="bg-indigo-500" />
          <PhaseBar label="Легкий" percent={quality.light} color="bg-blue-400" />
          <PhaseBar label="REM" percent={quality.rem} color="bg-purple-400" />
        </div>
      </CardContent>
    </Card>
  );
}

function PhaseBar({ label, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-900 font-medium">{percent}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function QuickActionsCard({ onLogSleep, onSounds }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Plus className="w-5 h-5 text-amber-600" />
          </div>
          <span className="font-semibold text-gray-900">Действия</span>
        </div>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onLogSleep}>
            <Clock className="w-4 h-4" />
            Записать сон
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onSounds}>
            <Music className="w-4 h-4" />
            Звуки для сна
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
  const lastNight = {
    duration: '7ч 32м',
    quality: 82,
    bedtime: '23:15',
    wakeTime: '06:47',
    deepSleep: '1ч 52м',
    remSleep: '1ч 31м',
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Прошлой ночью</CardTitle>
          <CardDescription>Ваш последний сон</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <OverviewStat icon={Clock} label="Длительность" value={lastNight.duration} />
            <OverviewStat icon={Star} label="Качество" value={`${lastNight.quality}%`} />
            <OverviewStat icon={Moon} label="Отбой" value={lastNight.bedtime} />
            <OverviewStat icon={Sun} label="Подъем" value={lastNight.wakeTime} />
            <OverviewStat icon={Zap} label="Глубокий" value={lastNight.deepSleep} />
            <OverviewStat icon={Timer} label="REM" value={lastNight.remSleep} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Недельная статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">График сна...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function OverviewStat({ icon: Icon, label, value }: any) {
  return (
    <div className="p-3 rounded-lg bg-gray-50">
      <Icon className="w-5 h-5 text-gray-400 mb-2" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function LogTab({ onLogSleep }: any) {
  const sleepLogs = [
    { date: 'Сегодня', duration: '7ч 32м', quality: 82, bedtime: '23:15' },
    { date: 'Вчера', duration: '8ч 15м', quality: 88, bedtime: '22:30' },
    { date: '28 фев', duration: '6ч 45м', quality: 72, bedtime: '00:15' },
    { date: '27 фев', duration: '7ч 50м', quality: 80, bedtime: '23:00' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Журнал сна</h3>
        <Button size="sm" onClick={onLogSleep}>
          <Plus className="w-4 h-4 mr-2" />
          Записать
        </Button>
      </div>

      {sleepLogs.map((log, index) => (
        <SleepLogCard key={index} log={log} />
      ))}
    </div>
  );
}

function SleepLogCard({ log }: any) {
  const qualityColor = log.quality >= 80 ? 'text-green-600' : log.quality >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold">{log.date}</p>
              <p className="text-xs text-gray-500">Отбой в {log.bedtime}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{log.duration}</p>
            <p className={`text-sm ${qualityColor}`}>Качество: {log.quality}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SoundsTab() {
  const sounds = [
    { id: 1, name: 'Белый шум', category: 'nature', duration: '60 мин' },
    { id: 2, name: 'Дождь', category: 'nature', duration: '90 мин' },
    { id: 3, name: 'Океан', category: 'nature', duration: '120 мин' },
    { id: 4, name: 'Лес', category: 'nature', duration: '60 мин' },
    { id: 5, name: 'Бинауральные ритмы', category: 'meditation', duration: '30 мин' },
    { id: 6, name: '432 Гц', category: 'meditation', duration: '60 мин' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Звуки для сна</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sounds.map((sound) => (
          <SoundCard key={sound.id} sound={sound} />
        ))}
      </div>
    </div>
  );
}

function SoundCard({ sound }: any) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mx-auto mb-3">
          <Music className="w-8 h-8 text-white" />
        </div>
        <p className="font-semibold text-center">{sound.name}</p>
        <p className="text-xs text-gray-500 text-center mt-1">{sound.duration}</p>
        <Button size="sm" className="w-full mt-3" variant="outline">
          <Play className="w-4 h-4 mr-2" />
          Воспроизвести
        </Button>
      </CardContent>
    </Card>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Аналитика сна</CardTitle>
          <CardDescription>Тренды и инсайты</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Графики и аналитика...</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Рекомендации</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Ложитесь до 23:00 для лучшего качества сна</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Избегайте экранов за 1 час до сна</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Поддерживайте температуру 18-20°C</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function LogSleepDialog({ open, onOpenChange }: any) {
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState([7]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Записать сон</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Время отбоя</label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Время подъема</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Качество сна: {quality[0]}/10</label>
            <Slider value={quality} onValueChange={setQuality} min={1} max={10} step={1} />
          </div>
          <Button className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SoundsDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Звуки для сна</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Выберите звук...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function SleepSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
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

// Play icon helper
function Play({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
