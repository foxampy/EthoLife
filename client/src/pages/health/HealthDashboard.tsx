import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Apple, 
  Activity, 
  Moon, 
  Brain, 
  Pill, 
  Users, 
  Target,
  Flame,
  ChevronRight,
  Plus,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useHealthStore, HealthModule } from '@/stores/healthStore';
import { ModuleCard, ModuleCardCompact } from '@/components/health/ModuleCard';
import { DailyScoreRing, ScoreBadge } from '@/components/health/DailyScoreRing';
import { AIInsightCard, AIInsightList } from '@/components/health/AIInsightCard';
import { useI18n } from '@/i18n';

const moduleOrder: HealthModule[] = [
  'nutrition',
  'movement',
  'sleep',
  'psychology',
  'medicine',
  'relationships',
  'habits',
];

export default function HealthDashboard() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const {
    profile,
    todaySnapshot,
    weekSnapshots,
    isInitialized,
    initialize,
    getModuleScore,
    getStreak,
  } = useHealthStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initialize();
      setIsLoading(false);
    };
    loadData();
  }, [initialize]);

  // Mock AI insights (will be replaced with real data)
  const aiInsights = [
    {
      id: '1',
      title: 'Отличный сон!',
      description: 'Ты спал 7.5 часов с хорошим качеством. Используй эту энергию для тренировки сегодня.',
      type: 'tip' as const,
      relatedModules: ['sleep', 'movement'] as HealthModule[],
      action: { 
        label: 'Запланировать тренировку', 
        onClick: () => setLocation('/health/movement') 
      },
    },
    {
      id: '2',
      title: 'Недостаток белка',
      description: 'Сегодня только 45г белка из 100г цели. Добавь курицу или рыбу на ужин.',
      type: 'warning' as const,
      relatedModules: ['nutrition'] as HealthModule[],
    },
  ];

  const overallStreak = profile?.current_overall_streak || 0;

  if (isLoading || !isInitialized) {
    return <DashboardSkeleton />;
  }

  const overallScore = todaySnapshot?.overall_score || 0;
  const moduleScores = todaySnapshot?.module_scores || {
    nutrition: 0,
    movement: 0,
    sleep: 0,
    psychology: 0,
    medicine: 0,
    relationships: 0,
    habits: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Health Hub</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {overallStreak > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600">
                  {overallStreak}
                </span>
              </div>
            )}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Daily Score Ring */}
        <section className="flex flex-col items-center">
          <DailyScoreRing
            overallScore={overallScore}
            moduleScores={moduleScores}
            size="md"
            showModules={true}
          />
        </section>

        {/* AI Insights */}
        <AIInsightList 
          insights={aiInsights}
          maxItems={2}
        />

        {/* Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Быстрые действия</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setLocation('/health/habits')}
            >
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium">Чек-ин привычек</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => setLocation('/health/psychology')}
            >
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-600" />
              </div>
              <span className="text-sm font-medium">Настроение</span>
            </Button>
          </div>
        </section>

        {/* Modules Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Модули здоровья</h2>
            <Button variant="ghost" size="sm" className="text-gray-500">
              Все <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {moduleOrder.map((module) => (
              <ModuleCard
                key={module}
                module={module}
                score={moduleScores[module]}
                streak={getStreak(module)}
                onClick={() => setLocation(`/health/${module}`)}
                quickStats={getQuickStats(module, todaySnapshot?.key_metrics)}
              />
            ))}
          </div>
        </section>

        {/* Weekly Progress */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Недельный прогресс</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Средний score</span>
                <span className="text-2xl font-bold text-gray-900">
                  {weekSnapshots.length > 0 
                    ? Math.round(weekSnapshots.reduce((acc, s) => acc + s.overall_score, 0) / weekSnapshots.length)
                    : 0}
                </span>
              </div>
              
              {/* Week days */}
              <div className="flex justify-between">
                {getWeekDays().map((day, idx) => {
                  const snapshot = weekSnapshots.find(s => s.date === day.fullDate);
                  const score = snapshot?.overall_score || 0;
                  const isToday = day.isToday;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-gray-400">{day.label}</span>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                          ${isToday ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                        `}
                        style={{
                          backgroundColor: score > 0 ? getScoreColor(score) + '30' : '#f3f4f6',
                          color: score > 0 ? getScoreColor(score) : '#9ca3af',
                        }}
                      >
                        {score > 0 ? score : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* FAB for Quick Add */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
        onClick={() => setLocation('/health/quick-add')}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}

// Helper functions
function getQuickStats(module: HealthModule, metrics?: Record<string, any>): any[] {
  if (!metrics) return [];
  
  switch (module) {
    case 'nutrition':
      return [
        { label: 'Ккал', value: metrics.calories_consumed?.toString() || '0', target: '2,000' },
        { label: 'Белки', value: metrics.protein_g?.toString() || '0', target: '100г' },
      ];
    case 'movement':
      return [
        { label: 'Шаги', value: metrics.steps?.toLocaleString() || '0', target: '10K' },
        { label: 'Ккал', value: metrics.calories_burned?.toString() || '0' },
      ];
    case 'sleep':
      return [
        { label: 'Сон', value: metrics.sleep_hours ? `${metrics.sleep_hours}ч` : '-', target: '8ч' },
      ];
    case 'psychology':
      return [
        { label: 'Настроение', value: metrics.mood_score ? `${metrics.mood_score}/10` : '-' },
      ];
    default:
      return [];
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getWeekDays(): Array<{ label: string; fullDate: string; isToday: boolean }> {
  const days = [];
  const today = new Date();
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push({
      label: dayNames[date.getDay()],
      fullDate: date.toISOString().split('T')[0],
      isToday: i === 0,
    });
  }
  
  return days;
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
      </header>
      
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
        
        <Skeleton className="h-24 w-full" />
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </main>
    </div>
  );
}
