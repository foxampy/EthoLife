/**
 * Relationships Module - Компонент модуля отношений
 * Полная реализация: социальные связи, семья, партнер, общение
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  MessageCircle,
  Calendar,
  Home,
  Plus,
  TrendingUp,
  Settings,
  BarChart3,
  Gift,
  Clock,
  Star,
  Sparkles,
  Baby,
  Utensils,
  Film,
  Car,
  ShoppingBag,
  Bed,
  Smile,
  Flame,
  HandHeart,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function RelationshipsModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [showFamilyEvent, setShowFamilyEvent] = useState(false);
  const [showPartnerMetric, setShowPartnerMetric] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadRelationshipsData();
  }, []);

  const loadRelationshipsData = async () => {
    setLoading(true);
    await loadMetrics('relationships');
    setLoading(false);
  };

  if (loading) {
    return <RelationshipsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Отношения</h1>
                <p className="text-sm text-gray-500">Семья, партнер, друзья</p>
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
          <SocialScoreCard />
          <ConnectionsCard />
          <FamilyCard />
          <QuickActionsCard
            onAddConnection={() => setShowAddConnection(true)}
            onFamilyEvent={() => setShowFamilyEvent(true)}
            onPartnerMetric={() => setShowPartnerMetric(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-12">
            <TabsTrigger value="overview" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-sm">
              <Users className="w-4 h-4 mr-2" />
              Связи
            </TabsTrigger>
            <TabsTrigger value="family" className="text-sm">
              <Home className="w-4 h-4 mr-2" />
              Семья
            </TabsTrigger>
            <TabsTrigger value="partner" className="text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Партнер
            </TabsTrigger>
            <TabsTrigger value="social" className="text-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Общение
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="connections">
            <ConnectionsTab onAdd={() => setShowAddConnection(true)} />
          </TabsContent>

          <TabsContent value="family">
            <FamilyTab onAddEvent={() => setShowFamilyEvent(true)} />
          </TabsContent>

          <TabsContent value="partner">
            <PartnerTab onAddMetric={() => setShowPartnerMetric(true)} />
          </TabsContent>

          <TabsContent value="social">
            <SocialTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddConnectionDialog open={showAddConnection} onOpenChange={setShowAddConnection} />
      <FamilyEventDialog open={showFamilyEvent} onOpenChange={setShowFamilyEvent} />
      <PartnerMetricDialog open={showPartnerMetric} onOpenChange={setShowPartnerMetric} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function SocialScoreCard() {
  const score = 82;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-pink-600" />
            </div>
            <span className="font-semibold text-gray-900">Социум</span>
          </div>
          <Badge className="bg-pink-500 text-white">{grade}</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{score}</div>
        <p className="text-xs text-gray-500">Качество отношений</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>+8% к прошлому месяцу</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectionsCard() {
  const totalConnections = 45;
  const closeConnections = 12;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Связи</span>
          </div>
          <Badge variant="outline">{closeConnections} близких</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{totalConnections}</div>
        <p className="text-xs text-gray-500">Всего контактов</p>
        <div className="mt-2 text-xs text-gray-400">
          Семья: 8 • Друзья: 15 • Коллеги: 22
        </div>
      </CardContent>
    </Card>
  );
}

function FamilyCard() {
  const familyMembers = 4;
  const upcomingEvents = 2;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Семья</span>
          </div>
          <Badge className="bg-green-500 text-white">{upcomingEvents} события</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{familyMembers}</div>
        <p className="text-xs text-gray-500">Членов семьи</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-pink-600">
          <Heart className="w-3 h-3" />
          <span>Семейный вечер сегодня</span>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onAddConnection, onFamilyEvent, onPartnerMetric }: any) {
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
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onAddConnection}>
            <Users className="w-4 h-4" />
            Добавить связь
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onFamilyEvent}>
            <Calendar className="w-4 h-4" />
            Семейное событие
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onPartnerMetric}>
            <Heart className="w-4 h-4" />
            Метрика партнера
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
  const today = {
    socialScore: 82,
    interactions: 8,
    familyTime: '2ч 30м',
    partnerMood: 8,
    upcomingEvents: 2,
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Сегодня</CardTitle>
          <CardDescription>Ваши социальные взаимодействия</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <OverviewStat icon={Star} label="Социум" value={`${today.socialScore}%`} />
            <OverviewStat icon={MessageCircle} label="Общения" value={today.interactions} />
            <OverviewStat icon={Clock} label="С семьей" value={today.familyTime} />
            <OverviewStat icon={Smile} label="Настроение партнера" value={`${today.partnerMood}/10`} />
            <OverviewStat icon={Calendar} label="События" value={today.upcomingEvents} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Ближайшие события</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <EventItem icon={Film} title="Семейный вечер" time="Сегодня, 19:00" participants="4 человека" />
            <EventItem icon={Utensils} title="Обед с родителями" time="Завтра, 13:00" participants="6 человек" />
          </div>
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

function EventItem({ icon: Icon, title, time, participants }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-pink-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-gray-500">{time} • {participants}</p>
      </div>
      <Badge variant="outline">Напоминание</Badge>
    </div>
  );
}

function ConnectionsTab({ onAdd }: any) {
  const connections = [
    { id: 1, name: 'Мама', type: 'family', closeness: 95, lastContact: 'Сегодня' },
    { id: 2, name: 'Папа', type: 'family', closeness: 90, lastContact: 'Вчера' },
    { id: 3, name: 'Алексей', type: 'friend', closeness: 85, lastContact: '2 дня назад' },
    { id: 4, name: 'Мария', type: 'friend', closeness: 80, lastContact: 'Неделю назад' },
    { id: 5, name: 'Коллега Иван', type: 'colleague', closeness: 60, lastContact: 'Сегодня' },
  ];

  const typeIcons: Record<string, string> = {
    family: '👨‍👩‍👧‍👦',
    friend: '👥',
    colleague: '💼',
    partner: '💕',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Социальные связи</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} icon={typeIcons[connection.type]} />
        ))}
      </div>
    </div>
  );
}

function ConnectionCard({ connection, icon }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-semibold">{connection.name}</p>
              <p className="text-xs text-gray-500">{connection.lastContact}</p>
            </div>
          </div>
          <Badge variant={connection.closeness >= 80 ? 'default' : 'outline'}>
            {connection.closeness}%
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <Progress value={connection.closeness} className="h-2 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

function FamilyTab({ onAddEvent }: any) {
  const familyMembers = [
    { id: 1, name: 'Супруг(а)', mood: 8, loveLanguage: 'Качественное время', lastDate: 'Вчера' },
    { id: 2, name: 'Ребенок 1', mood: 9, loveLanguage: 'Слова поощрения', lastDate: 'Сегодня' },
    { id: 3, name: 'Ребенок 2', mood: 7, loveLanguage: 'Подарки', lastDate: '2 дня назад' },
  ];

  const householdTasks = [
    { id: 1, task: 'Купить продукты', assigned: 'Супруг(а)', due: 'Сегодня', completed: false },
    { id: 2, task: 'Уборка', assigned: 'Я', due: 'Завтра', completed: false },
    { id: 3, task: 'Приготовить ужин', assigned: 'По очереди', due: 'Сегодня', completed: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Семья</h3>
        <Button size="sm" onClick={onAddEvent}>
          <Plus className="w-4 h-4 mr-2" />
          Событие
        </Button>
      </div>

      {/* Family Members */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Члены семьи</CardTitle>
          <CardDescription>Настроение и язык любви</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <FamilyMemberCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Household Tasks */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Бытовые задачи</CardTitle>
          <CardDescription>Распределение обязанностей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {householdTasks.map((task) => (
              <HouseholdTaskCard key={task.id} task={task} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family Recommendations */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Запланируйте семейный вечер на этой неделе - это укрепит связь</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Уделите больше внимания ребенку 2 - язык любви "Подарки"</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Поблагодарите супруга(у) за помощь с продуктами</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function FamilyMemberCard({ member }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
          {member.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{member.name}</p>
          <p className="text-xs text-gray-500">Язык любви: {member.loveLanguage}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-green-500" />
          <span className="font-semibold">{member.mood}/10</span>
        </div>
        <p className="text-xs text-gray-400">Внимание: {member.lastDate}</p>
      </div>
    </div>
  );
}

function HouseholdTaskCard({ task }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          task.completed ? 'bg-green-500' : 'bg-gray-200'
        }`}>
          {task.completed && <Star className="w-4 h-4 text-white" />}
        </div>
        <div>
          <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.task}
          </p>
          <p className="text-xs text-gray-500">{task.assigned} • {task.due}</p>
        </div>
      </div>
      {!task.completed && (
        <Button size="sm" variant="outline">
          Выполнено
        </Button>
      )}
    </div>
  );
}

function PartnerTab({ onAddMetric }: any) {
  const partnerMetrics = {
    mood: 8,
    stress: 4,
    energy: 7,
    intimacy: 7,
    qualityTime: 6,
    gifts: 8,
    wordsOfAffirmation: 9,
    actsOfService: 7,
    physicalTouch: 8,
  };

  const intimacyHistory = [
    { date: 'Сегодня', rating: 8, notes: 'Отличный вечер' },
    { date: '3 дня назад', rating: 7, notes: 'Хорошо' },
    { date: 'Неделю назад', rating: 9, notes: 'Прекрасно' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Партнер</h3>
        <Button size="sm" onClick={onAddMetric}>
          <Plus className="w-4 h-4 mr-2" />
          Метрика
        </Button>
      </div>

      {/* Partner Mood & Metrics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Состояние партнера</CardTitle>
          <CardDescription>Текущие показатели</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <PartnerMetric icon={Smile} label="Настроение" value={partnerMetrics.mood} max={10} color="text-green-500" />
            <PartnerMetric icon={Zap} label="Стресс" value={partnerMetrics.stress} max={10} color="text-blue-500" />
            <PartnerMetric icon={Heart} label="Энергия" value={partnerMetrics.energy} max={10} color="text-pink-500" />
            <PartnerMetric icon={Flame} label="Интим" value={partnerMetrics.intimacy} max={10} color="text-red-500" />
            <PartnerMetric icon={Clock} label="Время вместе" value={partnerMetrics.qualityTime} max={10} color="text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Love Languages */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Языки любви</CardTitle>
          <CardDescription>Как партнер чувствует любовь</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <LoveLanguageBar label="Слова поощрения" value={partnerMetrics.wordsOfAffirmation} icon={MessageCircle} />
            <LoveLanguageBar label="Качественное время" value={partnerMetrics.qualityTime} icon={Clock} />
            <LoveLanguageBar label="Подарки" value={partnerMetrics.gifts} icon={Gift} />
            <LoveLanguageBar label="Помощь" value={partnerMetrics.actsOfService} icon={HandHeart} />
            <LoveLanguageBar label="Прикосновения" value={partnerMetrics.physicalTouch} icon={Heart} />
          </div>
        </CardContent>
      </Card>

      {/* Intimacy History */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Интимность</CardTitle>
          <CardDescription>История близости</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {intimacyHistory.map((item, index) => (
              <IntimacyItem key={index} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partner Recommendations */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Рекомендации для партнера
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Устройте романтический вечер - язык любви "Качественное время"</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Скажите несколько теплых слов - "Слова поощрения" на высоте</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Небольшой подарок без повода порадует партнера</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function PartnerMetric({ icon: Icon, label, value, max, color }: any) {
  return (
    <div className="text-center p-3 rounded-lg bg-gray-50">
      <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}/{max}</p>
    </div>
  );
}

function LoveLanguageBar({ label, value, icon: Icon }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-gray-500">{value}/10</span>
      </div>
      <Progress value={value * 10} className="h-2" />
    </div>
  );
}

function IntimacyItem({ item }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50">
      <div>
        <p className="font-semibold">{item.date}</p>
        <p className="text-xs text-gray-500">{item.notes}</p>
      </div>
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-pink-500" />
        <span className="font-semibold">{item.rating}/10</span>
      </div>
    </div>
  );
}

function SocialTab() {
  const interactions = [
    { id: 1, person: 'Мама', type: 'call', duration: '25 мин', date: 'Сегодня, 10:00' },
    { id: 2, person: 'Алексей', type: 'message', duration: '15 сообщений', date: 'Сегодня, 14:00' },
    { id: 3, person: 'Коллеги', type: 'meeting', duration: '2 часа', date: 'Вчера, 15:00' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Социальные взаимодействия</h3>
      {interactions.map((interaction) => (
        <InteractionCard key={interaction.id} interaction={interaction} />
      ))}
    </div>
  );
}

function InteractionCard({ interaction }: any) {
  const typeIcons: Record<string, any> = {
    call: MessageCircle,
    message: MessageCircle,
    meeting: Users,
  };
  const Icon = typeIcons[interaction.type];

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">{interaction.person}</p>
              <p className="text-xs text-gray-500">{interaction.date}</p>
            </div>
          </div>
          <Badge variant="outline">{interaction.duration}</Badge>
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
          <CardTitle>Аналитика отношений</CardTitle>
          <CardDescription>Тренды и инсайты</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Графики и статистика...</p>
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
              <span>Увеличьте время с семьей на 20% для лучшего качества отношений</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Позвоните родителям - давно не было контакта</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-500 mt-0.5" />
              <span>Запланируйте свидание с партнером на этой неделе</span>
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

function AddConnectionDialog({ open, onOpenChange }: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('friend');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить связь</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Имя</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя контакта" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Тип</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="family">Семья</option>
              <option value="friend">Друг</option>
              <option value="colleague">Коллега</option>
              <option value="partner">Партнер</option>
            </select>
          </div>
          <Button className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FamilyEventDialog({ open, onOpenChange }: any) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState([]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Семейное событие</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Название</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Семейный вечер" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Дата и время</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Участники</label>
            <div className="space-y-2">
              {['Супруг(а)', 'Ребенок 1', 'Ребенок 2'].map((member) => (
                <div key={member} className="flex items-center justify-between">
                  <label className="text-sm">{member}</label>
                  <Switch />
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full">Создать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PartnerMetricDialog({ open, onOpenChange }: any) {
  const [mood, setMood] = useState([8]);
  const [stress, setStress] = useState([4]);
  const [intimacy, setIntimacy] = useState([7]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Метрика партнера</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Настроение: {mood[0]}/10</label>
            <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Стресс: {stress[0]}/10</label>
            <Slider value={stress} onValueChange={setStress} min={1} max={10} step={1} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Интимность: {intimacy[0]}/10</label>
            <Slider value={intimacy} onValueChange={setIntimacy} min={1} max={10} step={1} />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Заметки</label>
            <Textarea placeholder="Ваши наблюдения..." className="w-full min-h-[80px]" />
          </div>
          <Button className="w-full">Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper components
function Textarea({ value, onChange, placeholder, className }: any) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

function Zap({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function RelationshipsSkeleton() {
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
