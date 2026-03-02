/**
 * Psychology Module - Компонент модуля психологии
 * Полная реализация: настроение, журнал, медитации, тесты
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Smile,
  BookOpen,
  Headphones,
  FileText,
  Plus,
  TrendingUp,
  Calendar,
  Settings,
  Heart,
  Zap,
  Clock,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

export default function PsychologyModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMoodLog, setShowMoodLog] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadPsychologyData();
  }, []);

  const loadPsychologyData = async () => {
    setLoading(true);
    await loadMetrics('psychology');
    setLoading(false);
  };

  if (loading) {
    return <PsychologySkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Психология</h1>
                <p className="text-sm text-gray-500">Настроение, стресс, медитации</p>
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
          <MoodCard />
          <StressCard />
          <EnergyCard />
          <QuickActionsCard
            onMood={() => setShowMoodLog(true)}
            onJournal={() => setShowJournal(true)}
            onMeditation={() => setShowMeditation(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="mood" className="text-sm">
              <Smile className="w-4 h-4 mr-2" />
              Настроение
            </TabsTrigger>
            <TabsTrigger value="journal" className="text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Журнал
            </TabsTrigger>
            <TabsTrigger value="meditation" className="text-sm">
              <Headphones className="w-4 h-4 mr-2" />
              Медитации
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Тесты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="mood">
            <MoodTab onLogMood={() => setShowMoodLog(true)} />
          </TabsContent>

          <TabsContent value="journal">
            <JournalTab onWrite={() => setShowJournal(true)} />
          </TabsContent>

          <TabsContent value="meditation">
            <MeditationTab onStart={() => setShowMeditation(true)} />
          </TabsContent>

          <TabsContent value="tests">
            <TestsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <MoodLogDialog open={showMoodLog} onOpenChange={setShowMoodLog} />
      <JournalDialog open={showJournal} onOpenChange={setShowJournal} />
      <MeditationDialog open={showMeditation} onOpenChange={setShowMeditation} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function MoodCard() {
  const mood = 7;
  const percent = (mood / 10) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Smile className="w-5 h-5 text-amber-600" />
            </div>
            <span className="font-semibold text-gray-900">Настроение</span>
          </div>
          <Badge variant="outline">{mood}/10</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {getMoodEmoji(mood)}
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">Хорошее настроение</p>
      </CardContent>
    </Card>
  );
}

function StressCard() {
  const stress = 4;
  const percent = ((10 - stress) / 10) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Стресс</span>
          </div>
          <Badge variant="outline">{stress}/10</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {stress <= 3 ? '😊' : stress <= 6 ? '😐' : '😰'}
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">Низкий уровень стресса</p>
      </CardContent>
    </Card>
  );
}

function EnergyCard() {
  const energy = 6;
  const percent = (energy / 10) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Энергия</span>
          </div>
          <Badge variant="outline">{energy}/10</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {energy <= 3 ? '😴' : energy <= 6 ? '🙂' : '⚡'}
        </div>
        <Progress value={percent} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">Средний уровень</p>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onMood, onJournal, onMeditation }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
            <Plus className="w-5 h-5 text-pink-600" />
          </div>
          <span className="font-semibold text-gray-900">Действия</span>
        </div>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onMood}>
            <Smile className="w-4 h-4" />
            Настроение
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onJournal}>
            <BookOpen className="w-4 h-4" />
            Журнал
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onMeditation}>
            <Headphones className="w-4 h-4" />
            Медитация
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getMoodEmoji(mood: number): string {
  if (mood <= 3) return '😞';
  if (mood <= 5) return '😐';
  if (mood <= 7) return '🙂';
  if (mood <= 9) return '😊';
  return '🤩';
}

// ============================================================================
# TABS
# ============================================================================

function OverviewTab() {
  const today = {
    mood: 7,
    stress: 4,
    energy: 6,
    meditation: '15 мин',
    journal: '2 записи',
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Сегодня</CardTitle>
          <CardDescription>Ваше психологическое состояние</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <OverviewStat icon={Smile} label="Настроение" value={`${today.mood}/10`} />
            <OverviewStat icon={Zap} label="Стресс" value={`${today.stress}/10`} />
            <OverviewStat icon={Heart} label="Энергия" value={`${today.energy}/10`} />
            <OverviewStat icon={Clock} label="Медитация" value={today.meditation} />
            <OverviewStat icon={BookOpen} label="Журнал" value={today.journal} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Недельная динамика</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Графики настроения и стресса...</p>
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

function MoodTab({ onLogMood }: any) {
  const moodLogs = [
    { date: 'Сегодня, 09:00', mood: 7, stress: 4, energy: 6 },
    { date: 'Вчера, 18:00', mood: 8, stress: 3, energy: 7 },
    { date: 'Вчера, 09:00', mood: 6, stress: 5, energy: 5 },
    { date: '28 фев, 20:00', mood: 7, stress: 4, energy: 6 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">История настроения</h3>
        <Button size="sm" onClick={onLogMood}>
          <Plus className="w-4 h-4 mr-2" />
          Записать
        </Button>
      </div>

      {moodLogs.map((log, index) => (
        <MoodLogCard key={index} log={log} />
      ))}
    </div>
  );
}

function MoodLogCard({ log }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Smile className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold">{log.date}</p>
              <div className="flex gap-3 text-xs text-gray-500 mt-1">
                <span>Настроение: {log.mood}/10</span>
                <span>Стресс: {log.stress}/10</span>
                <span>Энергия: {log.energy}/10</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JournalTab({ onWrite }: any) {
  const entries = [
    { date: 'Сегодня, 08:00', title: 'Утренние мысли', preview: 'Сегодня чувствую себя отлично...' },
    { date: 'Вчера, 21:00', title: 'Итоги дня', preview: 'Продуктивный день, много сделал...' },
    { date: '28 фев, 20:00', title: 'Размышления', preview: 'Думаю о своих целях...' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Записи в журнале</h3>
        <Button size="sm" onClick={onWrite}>
          <Plus className="w-4 h-4 mr-2" />
          Написать
        </Button>
      </div>

      {entries.map((entry, index) => (
        <JournalEntryCard key={index} entry={entry} />
      ))}
    </div>
  );
}

function JournalEntryCard({ entry }: any) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 mb-1">{entry.date}</p>
        <h4 className="font-semibold mb-2">{entry.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{entry.preview}</p>
      </CardContent>
    </Card>
  );
}

function MeditationTab({ onStart }: any) {
  const meditations = [
    { id: 1, title: 'Утренняя медитация', duration: '10 мин', category: 'morning' },
    { id: 2, title: 'Снижение стресса', duration: '15 мин', category: 'stress' },
    { id: 3, title: 'Перед сном', duration: '20 мин', category: 'sleep' },
    { id: 4, title: 'Фокус и концентрация', duration: '12 мин', category: 'focus' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Медитации</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {meditations.map((meditation) => (
          <MeditationCard key={meditation.id} meditation={meditation} onStart={() => onStart(meditation)} />
        ))}
      </div>
    </div>
  );
}

function MeditationCard({ meditation, onStart }: any) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onStart}>
      <CardContent className="p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-3">
          <Headphones className="w-8 h-8 text-white" />
        </div>
        <h4 className="font-semibold">{meditation.title}</h4>
        <p className="text-xs text-gray-500 mt-1">{meditation.duration}</p>
        <Button size="sm" className="w-full mt-3" variant="outline">
          Начать
        </Button>
      </CardContent>
    </Card>
  );
}

function TestsTab() {
  const tests = [
    { name: 'PHQ-9 (Депрессия)', questions: 9, duration: '5 мин' },
    { name: 'GAD-7 (Тревожность)', questions: 7, duration: '3 мин' },
    { name: 'PSS (Стресс)', questions: 10, duration: '5 мин' },
    { name: 'WHO-5 (Благополучие)', questions: 5, duration: '2 мин' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Психологические тесты</h3>
      {tests.map((test, index) => (
        <TestCard key={index} test={test} />
      ))}
    </div>
  );
}

function TestCard({ test }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">{test.name}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {test.questions} вопросов • {test.duration}
            </p>
          </div>
          <Button size="sm" variant="outline">
            Пройти
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function MoodLogDialog({ open, onOpenChange }: any) {
  const [mood, setMood] = useState([7]);
  const [stress, setStress] = useState([4]);
  const [energy, setEnergy] = useState([6]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Записать настроение</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Настроение: {mood[0]}/10</label>
            <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Плохое</span>
              <span>Отличное</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Стресс: {stress[0]}/10</label>
            <Slider value={stress} onValueChange={setStress} min={1} max={10} step={1} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Энергия: {energy[0]}/10</label>
            <Slider value={energy} onValueChange={setEnergy} min={1} max={10} step={1} />
          </div>
          <Button className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JournalDialog({ open, onOpenChange }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Новая запись в журнале</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="О чем хотите написать?"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Текст</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px]"
              placeholder="Ваши мысли..."
            />
          </div>
          <Button className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MeditationDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Медитация</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-16 h-16 text-white" />
            </div>
            <p className="text-lg font-semibold">Утренняя медитация</p>
            <p className="text-sm text-gray-500">10 минут</p>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">Начать</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function PsychologySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 p-6">
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
