import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'wouter';
import { 
  Calendar, Clock, CheckCircle2, Circle, Zap, 
  TrendingUp, Activity, Heart, Plus, Settings, 
  ChevronRight, Sparkles, BarChart3, Target, FileText
} from 'lucide-react';
import SketchIcon from '@/components/SketchIcon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18n } from '@/i18n';

export default function HealthCenter() {
  const { user } = useUser();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [todayPlans, setTodayPlans] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);

  const quickActions = [
    { id: 'movement', label: t('health.modules.movement'), icon: 'movement', color: '#3B82F6', path: '/health/movement' },
    { id: 'nutrition', label: t('health.modules.nutrition'), icon: 'nutrition', color: '#10B981', path: '/health/nutrition' },
    { id: 'sleep', label: t('health.modules.sleep'), icon: 'sleep', color: '#8B5CF6', path: '/health/sleep' },
    { id: 'psychology', label: t('health.modules.psychology'), icon: 'psychology', color: '#F59E0B', path: '/health/psychology' },
    { id: 'medicine', label: t('health.modules.medicine'), icon: 'medicine', color: '#EF4444', path: '/health/medicine' },
    { id: 'relationships', label: t('health.modules.relationships'), icon: 'relationships', color: '#EC4899', path: '/health/relationships' },
    { id: 'habits', label: t('health.modules.habits'), icon: 'spirituality', color: '#06B6D4', path: '/health/habits' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userId = user.id.toString();
        const today = new Date().toISOString().split('T')[0];

        const plansResponse = await fetch(`/api/users/${userId}/plans?date=${today}`);
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

        const metricsResponse = await fetch(`/api/users/${userId}/metrics?limit=5`);
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData.metrics || []);
        }

        const goalsResponse = await fetch(`/api/users/${userId}/goals`);
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          setGoals(goalsData.goals || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const completedPlans = todayPlans.filter(p => p.completed).length;
  const totalPlans = todayPlans.length;
  const progressPercent = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-foreground/60">{t('common.loading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-10 pb-16">
      <div className="w-full max-w-7xl mx-auto px-3 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                {t('healthCenter.title')}
              </h1>
              <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
                {t('healthCenter.subtitle')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/settings')}
              className="h-8 px-2 shrink-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-primary" />
                  {t('healthCenter.quickAccess')}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {quickActions.length} {t('healthCenter.modules')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => setLocation(action.path)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: action.color + '20' }}
                    >
                      <SketchIcon icon={action.icon as any} size={18} style={{ color: action.color }} />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {t('healthCenter.today')}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {completedPlans}/{totalPlans} {t('healthCenter.done')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {totalPlans > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground/60">{t('healthCenter.progress')}</span>
                        <span className="text-xs font-semibold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                    </div>

                    <ScrollArea className="h-[200px]">
                      <div className="space-y-1">
                        {todayPlans.map((plan, idx) => (
                          <motion.div
                            key={plan.id || idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${
                              plan.completed 
                                ? 'bg-green-50/50 border-green-200' 
                                : 'bg-card border-border'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-foreground/60 shrink-0" />
                            <span className="font-mono text-xs text-foreground/70 shrink-0">
                              {plan.time || '00:00'}
                            </span>
                            <span className="flex-1 truncate">{plan.title}</span>
                            {plan.category && (
                              <SketchIcon icon={plan.category as any} size={14} className="text-primary shrink-0" />
                            )}
                            {plan.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-foreground/30 shrink-0" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-10 h-10 text-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60 mb-2">{t('healthCenter.noPlans')}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation('/calendar')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t('healthCenter.createPlan')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Reminders */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('healthCenter.reminders')}</CardTitle>
              </CardHeader>
              <CardContent>
                {reminders.length > 0 ? (
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {reminders.map((reminder, idx) => (
                        <div
                          key={reminder.id}
                          className="p-2 rounded-lg border border-border bg-card text-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{reminder.title}</span>
                            <span className="text-xs text-foreground/60 shrink-0">{reminder.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-6 text-sm text-foreground/60">
                    {t('healthCenter.noReminders')}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              {t('healthCenter.overview')}
            </TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">
              <Activity className="w-3.5 h-3.5 mr-1" />
              {t('healthCenter.metrics')}
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-xs">
              <Target className="w-3.5 h-3.5 mr-1" />
              {t('healthCenter.goals')}
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">
              <FileText className="w-3.5 h-3.5 mr-1" />
              {t('healthCenter.reports')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickActions.map((direction) => {
                    const directionPlans = todayPlans.filter(p => p.category === direction.id);
                    const completed = directionPlans.filter(p => p.completed).length;
                    const total = directionPlans.length;
                    
                    return (
                      <div
                        key={direction.id}
                        onClick={() => setLocation(direction.path)}
                        className="p-3 rounded-lg border hover:border-primary/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center"
                            style={{ backgroundColor: direction.color + '20' }}
                          >
                            <SketchIcon icon={direction.icon as any} size={16} style={{ color: direction.color }} />
                          </div>
                          <ChevronRight className="w-4 h-4 text-foreground/40 ml-auto" />
                        </div>
                        <h3 className="font-semibold text-sm">{direction.label}</h3>
                        {total > 0 ? (
                          <div className="text-xs text-foreground/60">
                            {completed}/{total} {t('healthCenter.done')}
                          </div>
                        ) : (
                          <div className="text-xs text-foreground/40">{t('dashboard.noData')}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {metrics.map((metric, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-card">
                      <div className="text-xs text-foreground/60 mb-1">
                        {metric.metric_type}
                      </div>
                      <div className="text-lg font-bold">
                        {metric.value} <span className="text-xs font-normal text-foreground/60">{metric.unit || ''}</span>
                      </div>
                    </div>
                  ))}
                  {metrics.length === 0 && (
                    <div className="col-span-full text-center py-8 text-sm text-foreground/60">
                      {t('dashboard.noData')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardContent className="p-4">
                {goals.length > 0 ? (
                  <div className="space-y-2">
                    {goals.map((goal, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{goal.title}</span>
                          {goal.completed ? (
                            <Badge className="bg-green-500 text-xs">{t('dashboard.completed')}</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">{t('dashboard.pending')}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-10 h-10 text-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60">{t('healthCenter.noGoals')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-4 text-center text-sm text-foreground/60">
                {t('healthCenter.reportsSoon')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
