import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Calendar, Clock, CheckCircle2, Circle, Zap,
  TrendingUp, Activity, Heart, Plus, Settings,
  ChevronRight, Sparkles, BarChart3, Target, FileText,
  Apple, Dumbbell, Moon as MoonIcon, Smile, Stethoscope, Users, Sprout,
  ArrowRight, Bell, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';

const modules = [
  { id: 'movement', label: 'Движение', icon: Dumbbell, color: '#3B82F6', bg: 'bg-blue-50', description: 'Шаги, тренировки, активность' },
  { id: 'nutrition', label: 'Питание', icon: Apple, color: '#10B981', bg: 'bg-green-50', description: 'Калории, макросы, вода' },
  { id: 'sleep', label: 'Сон', icon: MoonIcon, color: '#8B5CF6', bg: 'bg-purple-50', description: 'Качество, фазы, восстановление' },
  { id: 'psychology', label: 'Психология', icon: Smile, color: '#F59E0B', bg: 'bg-amber-50', description: 'Настроение, стресс, журнал' },
  { id: 'medicine', label: 'Медицина', icon: Stethoscope, color: '#EF4444', bg: 'bg-red-50', description: 'Анализы, приемы, медикаменты' },
  { id: 'relationships', label: 'Отношения', icon: Users, color: '#EC4899', bg: 'bg-pink-50', description: 'Социальные связи, общение' },
  { id: 'habits', label: 'Привычки', icon: Sprout, color: '#06B6D4', bg: 'bg-cyan-50', description: 'Трекер, streaks, цели' },
];

export default function HealthCenter() {
  const { user, token } = useAuth();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [todayPlans, setTodayPlans] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [moduleScores, setModuleScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userId = user.id.toString();
        const today = new Date().toISOString().split('T')[0];

        // Load plans
        const plansResponse = await fetch(`/api/users/${userId}/plans?date=${today}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setTodayPlans(plansData.plans || []);

          const planReminders = (plansData.plans || [])
            .filter((p: any) => !p.completed && p.time)
            .slice(0, 5)
            .map((p: any) => ({
              id: `plan-${p.id}`,
              title: p.title,
              time: p.time,
              type: 'plan',
              completed: false,
            }));
          setReminders(planReminders);
        }

        // Load metrics
        const metricsResponse = await fetch(`/api/users/${userId}/metrics?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData.metrics || []);
        }

        // Load goals
        const goalsResponse = await fetch(`/api/users/${userId}/goals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          setGoals(goalsData.goals || []);
        }

        // Load module scores
        const scoresPromises = modules.map(async (module) => {
          try {
            const res = await fetch(`/api/users/${userId}/metrics?metric_type=${module.id}&limit=1`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              const metric = data.metrics?.[0];
              const score = calculateScore(module.id, metric?.value);
              setModuleScores(prev => ({ ...prev, [module.id]: score }));
            }
          } catch (e) {
            console.error(`Error loading ${module.id}:`, e);
          }
        });

        await Promise.all(scoresPromises);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, token]);

  const calculateScore = (moduleId: string, value: number): number => {
    if (!value || value === 0) return 0;
    
    const targets: Record<string, number> = {
      movement: 10000,
      nutrition: 2000,
      sleep: 8,
      psychology: 100,
      medicine: 10,
      relationships: 100,
      habits: 30,
    };
    
    const target = targets[moduleId] || 100;
    return Math.min(100, Math.round((value / target) * 100));
  };

  const completedPlans = todayPlans.filter(p => p.completed).length;
  const totalPlans = todayPlans.length;
  const progressPercent = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-100';
    if (score >= 60) return 'text-yellow-500 bg-yellow-100';
    if (score > 0) return 'text-red-500 bg-red-100';
    return 'text-gray-500 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center pt-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600 font-medium">Загрузка данных...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pt-14 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-emerald-500" />
              Центр здоровья
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Все модули здоровья в одном месте
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/settings')}
            className="shrink-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Overall Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Общий индекс здоровья</p>
                  <div className="text-4xl font-bold">
                    {Object.keys(moduleScores).length > 0
                      ? Math.round(Object.values(moduleScores).reduce((a, b) => a + b, 0) / Object.values(moduleScores).length)
                      : '--'
                    }
                    <span className="text-2xl ml-1">%</span>
                  </div>
                  <p className="text-emerald-100 text-xs mt-2">
                    На основе {Object.keys(moduleScores).length} модулей
                  </p>
                </div>
                <div className="text-right">
                  <Award className="w-16 h-16 text-emerald-300 opacity-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <CardTitle className="text-base">План на сегодня</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {completedPlans}/{totalPlans} выполнено
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {totalPlans > 0 ? (
                <div className="space-y-3">
                  <Progress value={progressPercent} className="h-2" />
                  
                  <ScrollArea className="h-[180px]">
                    <div className="space-y-2">
                      {todayPlans.map((plan, idx) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx }}
                          className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                            plan.completed
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {plan.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              plan.completed ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}>
                              {plan.title}
                            </p>
                            {plan.time && (
                              <p className="text-xs text-gray-500 font-mono">{plan.time}</p>
                            )}
                          </div>
                          {plan.category && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {modules.find(m => m.id === plan.category)?.label || plan.category}
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-3">Нет задач на сегодня</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocation('/dashboard')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить задачу
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Модули здоровья</h2>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/health')}>
              Все данные <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              const score = moduleScores[module.id] || 0;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card 
                    className="border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                    onClick={() => setLocation(`/health/${module.id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-14 h-14 rounded-2xl ${module.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7" style={{ color: module.color }} />
                        </div>
                        <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${getScoreColor(score)}`}>
                          {score > 0 ? `${score}%` : '—'}
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg mb-1">{module.label}</h3>
                      <p className="text-sm text-gray-500 mb-4">{module.description}</p>

                      <div className="flex items-center justify-between">
                        <Progress value={score} className="h-1.5 flex-1 mr-3" />
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 bg-gray-50 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/health/${module.id}/new`);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Добавить данные
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-11">
            <TabsTrigger value="metrics" className="text-sm">
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Метрики
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-sm">
              <Target className="w-4 h-4 mr-1.5" />
              Цели
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-sm">
              <FileText className="w-4 h-4 mr-1.5" />
              Отчёты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {metrics.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {metrics.slice(0, 6).map((metric, idx) => (
                      <div key={idx} className="p-4 rounded-xl border bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1 capitalize">
                          {metric.metric_type}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {metric.value}
                          <span className="text-xs font-normal text-gray-500 ml-1">
                            {metric.unit || ''}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(metric.recorded_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Нет данных метрик</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                {goals.length > 0 ? (
                  <div className="space-y-2">
                    {goals.map((goal: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border bg-gray-50 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{goal.title}</p>
                          {goal.description && (
                            <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
                          )}
                        </div>
                        <Badge className={goal.completed ? 'bg-green-500' : 'bg-gray-200'}>
                          {goal.completed ? 'Выполнено' : 'В процессе'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Нет активных целей</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => setLocation('/habits')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Создать цель
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Отчёты в разработке</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Скоро здесь появятся детальные отчёты по всем модулям здоровья
                </p>
                <Button variant="outline" onClick={() => setLocation('/dashboard')}>
                  Вернуться на дашборд
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
