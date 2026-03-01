import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ChevronLeft,
  TrendingUp,
  Calendar,
  Heart,
  Wind,
  FileText,
  Target,
  AlertCircle,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { moduleColors } from '@/stores/healthStore';
import {
  usePsychologyStore,
  emotionOptions,
  getEmotionConfig,
} from '@/stores/modules/psychologyStore';
import MoodCheckIn from '@/components/health/MoodCheckIn';
import TechniquePlayer from '@/components/health/TechniquePlayer';

const PSYCHOLOGY_COLOR = moduleColors.psychology.primary;
const PSYCHOLOGY_BG = moduleColors.psychology.bg;

export default function PsychologyModule() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  const {
    moodEntries,
    assessments,
    techniques,
    goals,
    crisisFlags,
    initialize,
    getTodayMood,
    getMoodTrend,
    getAverageMood,
    getMoodStreak,
    getCrisisAlerts,
    getRecommendedTechniques,
    getLastAssessment,
    getMoodColor,
    getMoodEmoji,
    getSeverityColor,
  } = usePsychologyStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initialize();
      setIsLoading(false);
    };
    loadData();
  }, [initialize]);

  const todayMood = getTodayMood();
  const moodTrend = getMoodTrend(7);
  const averageMood = getAverageMood(7);
  const moodStreak = getMoodStreak();
  const crisisAlerts = getCrisisAlerts();
  const recommendedTechniques = getRecommendedTechniques();
  const lastPHQ9 = getLastAssessment('phq9');
  const lastGAD7 = getLastAssessment('gad7');

  const handleMoodLogged = () => {
    setShowMoodCheckIn(false);
    toast({
      title: 'Отлично! ✨',
      description: 'Твое настроение сохранено',
    });
  };

  if (isLoading) {
    return <PsychologySkeleton />;
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 text-white"
        style={{ backgroundColor: PSYCHOLOGY_COLOR }}
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
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Психология
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setLocation('/health/psychology/stats')}
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
          </div>

          {/* Today's Mood Summary */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm opacity-90 mb-1">
                {todayMood ? 'Сегодня' : 'Как ты себя чувствуешь?'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {todayMood ? `${todayMood.overall_mood}/10` : '—'}
                </span>
                {todayMood && (
                  <span className="text-2xl">{getMoodEmoji(todayMood.overall_mood)}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Streak</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                {moodStreak}
                <span className="text-lg">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Crisis Alert Banner */}
      {crisisAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto px-4 mt-4"
        >
          {crisisAlerts.map((alert) => (
            <Card
              key={alert.id}
              className="border-red-200"
              style={{ backgroundColor: '#fef2f2' }}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800">Важное уведомление</h3>
                  <p className="text-sm text-red-600 mt-1">
                    {alert.flag_type === 'low_mood_streak' &&
                      'Мы заметили, что твое настроение ниже обычного последние несколько дней.'}
                    {alert.flag_type === 'high_anxiety' &&
                      'Уровень тревоги выше нормы. Попробуй техники дыхания.'}
                    {alert.flag_type === 'suicidal_ideation' &&
                      'Ты не один(на). Пожалуйста, обратись за помощью.'}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => setLocation('/health/psychology/support')}
                    >
                      Получить помощь
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Quick Mood Check-in */}
        {!showMoodCheckIn ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <button
                onClick={() => setShowMoodCheckIn(true)}
                className="w-full p-6 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: PSYCHOLOGY_BG }}
                    >
                      <Heart className="w-6 h-6" style={{ color: PSYCHOLOGY_COLOR }} />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {todayMood ? 'Обновить настроение' : 'Чек-ин настроения'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {todayMood
                          ? `Последний раз: ${getTimeAgo(todayMood.created_at)}`
                          : 'Как ты себя чувствуешь прямо сейчас?'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </CardContent>
          </Card>
        ) : (
          <MoodCheckIn
            onSave={handleMoodLogged}
            onCancel={() => setShowMoodCheckIn(false)}
          />
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="mood">Настроение</TabsTrigger>
            <TabsTrigger value="techniques">Техники</TabsTrigger>
            <TabsTrigger value="assessments">Тесты</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Среднее (7 дн)</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {averageMood > 0 ? `${averageMood}/10` : '—'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Записей</span>
                  </div>
                  <div className="text-2xl font-bold">{moodEntries.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Techniques */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Рекомендуем сейчас
              </h3>
              <div className="space-y-3">
                {recommendedTechniques.map((technique) => (
                  <Card
                    key={technique.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => setActiveTechnique(technique.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: PSYCHOLOGY_BG }}
                        >
                          {getTechniqueIcon(technique.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {technique.name_ru || technique.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {technique.duration_minutes} мин
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(technique.category)}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Goals */}
            {goals.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Цели
                </h3>
                <div className="space-y-3">
                  {goals.slice(0, 2).map((goal) => (
                    <Card key={goal.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{goal.description}</span>
                          <span className="text-sm text-gray-500">
                            {goal.progress_percent}%
                          </span>
                        </div>
                        <Progress value={goal.progress_percent} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          {/* Mood Tab */}
          <TabsContent value="mood" className="space-y-4 mt-4">
            {/* Mood Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  История настроения
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moodTrend.length > 0 ? (
                  <div className="space-y-2">
                    {moodTrend.slice(-7).map((day) => (
                      <div
                        key={day.date}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="w-16 text-sm text-gray-500">
                          {new Date(day.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getMoodColor(day.avgMood) }}
                            />
                            <span className="font-medium">{day.avgMood}/10</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span style={{ color: '#22c55e' }}>⚡{day.avgEnergy}</span>
                          <span style={{ color: '#ef4444' }}>😰{day.avgStress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Нет записей о настроении</p>
                    <p className="text-sm">Начни отслеживать сегодня!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emotion Summary */}
            {todayMood?.emotions && todayMood.emotions.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Сегодняшние эмоции</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {todayMood.emotions.map((emotion) => {
                      const config = getEmotionConfig(emotion);
                      return (
                        <Badge
                          key={emotion}
                          variant="secondary"
                          className="text-base px-3 py-1"
                        >
                          {config.emoji} {config.label}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Techniques Tab */}
          <TabsContent value="techniques" className="space-y-4 mt-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {['breathing', 'meditation', 'cbt', 'grounding', 'mindfulness', 'relaxation'].map(
                (category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {getCategoryLabel(category as TechniqueCategory)}
                  </Badge>
                )
              )}
            </div>

            {/* All Techniques */}
            <div className="space-y-3">
              {techniques.map((technique) => (
                <Card
                  key={technique.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setActiveTechnique(technique.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: PSYCHOLOGY_BG }}
                      >
                        {getTechniqueIcon(technique.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">
                          {technique.name_ru || technique.name}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {technique.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {technique.duration_minutes} мин
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getDifficultyLabel(technique.difficulty)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4 mt-4">
            {/* PHQ-9 Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">PHQ-9</h3>
                    <p className="text-sm text-gray-500">Опросник депрессии</p>
                  </div>
                  {lastPHQ9 ? (
                    <div className="text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: getSeverityColor(lastPHQ9.severity_level) }}
                      >
                        {lastPHQ9.total_score}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSeverityLabel(lastPHQ9.severity_level)}
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      Пройти
                    </Button>
                  )}
                </div>
                {lastPHQ9 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Последний раз: {new Date(lastPHQ9.taken_at).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* GAD-7 Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">GAD-7</h3>
                    <p className="text-sm text-gray-500">Опросник тревоги</p>
                  </div>
                  {lastGAD7 ? (
                    <div className="text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: getSeverityColor(lastGAD7.severity_level) }}
                      >
                        {lastGAD7.total_score}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getSeverityLabel(lastGAD7.severity_level)}
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      Пройти
                    </Button>
                  )}
                </div>
                {lastGAD7 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Последний раз: {new Date(lastGAD7.taken_at).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-gray-400 text-center">
              Эти опросники помогают отслеживать динамику состояния.
              Рекомендуется проходить раз в 2 недели.
            </p>
          </TabsContent>
        </Tabs>
      </main>

      {/* Technique Player Modal */}
      <AnimatePresence>
        {activeTechnique && (
          <TechniquePlayer
            techniqueId={activeTechnique}
            onClose={() => setActiveTechnique(null)}
          />
        )}
      </AnimatePresence>

      {/* FAB */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: PSYCHOLOGY_COLOR }}
        onClick={() => setLocation('/health/psychology/journal')}
      >
        <BookOpen className="w-6 h-6" />
      </Button>
    </div>
  );
}

// Helper functions
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 5) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  return date.toLocaleDateString('ru-RU');
}

function getTechniqueIcon(category: string) {
  const iconClass = "w-5 h-5";
  switch (category) {
    case 'breathing':
      return <Wind className={iconClass} style={{ color: PSYCHOLOGY_COLOR }} />;
    case 'meditation':
    case 'mindfulness':
      return <Brain className={iconClass} style={{ color: PSYCHOLOGY_COLOR }} />;
    case 'cbt':
    case 'journaling':
      return <FileText className={iconClass} style={{ color: PSYCHOLOGY_COLOR }} />;
    case 'grounding':
      return <Target className={iconClass} style={{ color: PSYCHOLOGY_COLOR }} />;
    case 'gratitude':
      return <Heart className={iconClass} style={{ color: PSYCHOLOGY_COLOR }} />;
    default:
      return <Sparkles className={iconClass} style={{ color: PSYCHOLOGY_COLOR }} />;
  }
}

function getCategoryLabel(category: TechniqueCategory | string): string {
  const labels: Record<string, string> = {
    breathing: 'Дыхание',
    meditation: 'Медитация',
    cbt: 'КПТ',
    grounding: 'Заземление',
    mindfulness: 'Осознанность',
    gratitude: 'Благодарность',
    journaling: 'Дневник',
    visualization: 'Визуализация',
    somatic: 'Соматика',
    relaxation: 'Релаксация',
  };
  return labels[category] || category;
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  };
  return labels[difficulty] || difficulty;
}

function getSeverityLabel(severity: string): string {
  const labels: Record<string, string> = {
    minimal: 'Минимальная',
    mild: 'Легкая',
    moderate: 'Умеренная',
    moderately_severe: 'Умеренно-тяжелая',
    severe: 'Тяжелая',
  };
  return labels[severity] || severity;
}

// Loading skeleton
function PsychologySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-40" style={{ backgroundColor: PSYCHOLOGY_COLOR }} />
      <div className="max-w-lg mx-auto px-4 -mt-8 space-y-4">
        <Skeleton className="h-24" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </div>
  );
}
