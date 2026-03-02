import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Activity,
  Utensils,
  Moon,
  Brain,
  Heart,
  Users,
  Sparkles,
  TrendingUp,
  Calendar,
  Flame,
  Droplets,
  Footprints,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Bell,
  Target,
  Zap,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  MoreVertical,
  BarChart3,
  Award,
  Timer,
  Coffee,
  BookOpen,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Stories } from "@/components/Stories";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardData {
  healthScore: number;
  activeModules: string[];
  todayStats: {
    steps: number;
    water: number;
    sleep: number;
    calories: number;
  };
  weeklyData: any[];
  recentEntries: any[];
  streaks: {
    current: number;
    longest: number;
  };
}

interface DailyPlan {
  id: number;
  title: string;
  description?: string;
  time?: string;
  completed: boolean;
  category?: string;
  module?: string;
}

interface ModuleMetric {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  lastEntry: string;
  score: number;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: 'water' | 'medication' | 'exercise' | 'meal' | 'sleep' | 'meditation';
  enabled: boolean;
  module?: string;
}

const modules = [
  { id: 'movement', name: 'Движение', icon: Activity, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', description: 'Шаги, тренировки, активность' },
  { id: 'nutrition', name: 'Питание', icon: Utensils, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', description: 'Калории, макросы, вода' },
  { id: 'sleep', name: 'Сон', icon: Moon, color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50', description: 'Часы, качество, фазы' },
  { id: 'psychology', name: 'Психология', icon: Brain, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', description: 'Настроение, стресс, журнал' },
  { id: 'medicine', name: 'Медицина', icon: Heart, color: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', description: 'Анализы, приемы, медикаменты' },
  { id: 'relationships', name: 'Отношения', icon: Users, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-50', description: 'Социальные связи' },
  { id: 'habits', name: 'Привычки', icon: Sparkles, color: 'from-cyan-500 to-teal-500', bgColor: 'bg-cyan-50', description: 'Трекер, streaks, цели' },
];

const defaultReminders: Reminder[] = [
  { id: '1', title: 'Пить воду', time: '09:00', type: 'water', enabled: true },
  { id: '2', title: 'Пить воду', time: '12:00', type: 'water', enabled: true },
  { id: '3', title: 'Пить воду', time: '15:00', type: 'water', enabled: true },
  { id: '4', title: 'Обед', time: '13:00', type: 'meal', enabled: true },
  { id: '5', title: 'Прогулка', time: '18:00', type: 'exercise', enabled: false },
  { id: '6', title: 'Медитация', time: '21:00', type: 'meditation', enabled: false },
  { id: '7', title: 'Подготовка ко сну', time: '22:00', type: 'sleep', enabled: true },
];

export default function DashboardV2() {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [moduleMetrics, setModuleMetrics] = useState<ModuleMetric[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanTime, setNewPlanTime] = useState('');
  const [newPlanModule, setNewPlanModule] = useState('');
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      loadDashboardData();
      loadDailyPlans();
      loadModuleMetrics();
    }
  }, [token, selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/dashboard?period=${selectedPeriod}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyPlans = async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/users/${user.id}/plans?date=${today}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDailyPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Plans load error:', error);
    }
  };

  const loadModuleMetrics = async () => {
    if (!user?.id) return;

    try {
      const userId = user.id.toString();

      const metricsPromises = modules.map(async (module) => {
        try {
          const res = await fetch(`/api/users/${userId}/metrics?metric_type=${module.id}&limit=1`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            const metric = data.metrics?.[0];

            return {
              id: module.id,
              name: module.name,
              icon: module.icon,
              color: module.color,
              bgColor: module.bgColor,
              value: metric?.value || 0,
              unit: getUnitForModule(module.id),
              trend: 'neutral' as const,
              lastEntry: metric?.recorded_at ? new Date(metric.recorded_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) : 'Нет данных',
              score: calculateModuleScore(module.id, metric?.value),
            };
          }
        } catch (e) {
          console.error(`Error loading ${module.id} metrics:`, e);
        }

        return {
          id: module.id,
          name: module.name,
          icon: module.icon,
          color: module.color,
          bgColor: module.bgColor,
          value: 0,
          unit: getUnitForModule(module.id),
          trend: 'neutral' as const,
          lastEntry: 'Нет данных',
          score: 0,
        };
      });

      const loadedMetrics = await Promise.all(metricsPromises);
      setModuleMetrics(loadedMetrics);
    } catch (error) {
      console.error('Module metrics load error:', error);
    }
  };

  const getUnitForModule = (moduleId: string) => {
    const units: Record<string, string> = {
      movement: 'шагов',
      nutrition: 'ккал',
      sleep: 'часов',
      psychology: 'баллов',
      medicine: 'записей',
      relationships: 'баллов',
      habits: 'дней',
    };
    return units[moduleId] || '';
  };

  const calculateModuleScore = (moduleId: string, value: number): number => {
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

  const togglePlan = async (planId: number, completed: boolean) => {
    try {
      const res = await fetch(`/api/users/${user?.id}/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed }),
      });

      if (res.ok) {
        setDailyPlans(prev => prev.map(p =>
          p.id === planId ? { ...p, completed } : p
        ));

        toast({
          title: completed ? 'Выполнено! ✅' : 'Отменено',
          description: completed ? 'Отличная работа!' : 'Задача помечена как невыполненная',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive',
      });
    }
  };

  const deletePlan = async (planId: number) => {
    try {
      const res = await fetch(`/api/users/${user?.id}/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        setDailyPlans(prev => prev.filter(p => p.id !== planId));
        toast({
          title: 'Удалено',
          description: 'Задача удалена',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить задачу',
        variant: 'destructive',
      });
    }
  };

  const addNewPlan = async () => {
    if (!newPlanTitle.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название задачи',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch(`/api/users/${user?.id}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPlanTitle,
          time: newPlanTime || null,
          category: newPlanModule || 'general',
          completed: false,
        }),
      });

      if (res.ok) {
        const newPlan = await res.json();
        setDailyPlans(prev => [...prev, newPlan]);
        setNewPlanTitle('');
        setNewPlanTime('');
        setNewPlanModule('');
        setShowAddPlan(false);
        toast({
          title: 'Добавлено',
          description: 'Задача добавлена на сегодня',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить задачу',
        variant: 'destructive',
      });
    }
  };

  const toggleReminder = (reminderId: string) => {
    setReminders(prev => prev.map(r =>
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    ));
    toast({
      title: 'Обновлено',
      description: 'Напоминание обновлено',
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'water': return Droplets;
      case 'medication': return Heart;
      case 'exercise': return Activity;
      case 'meal': return Utensils;
      case 'sleep': return Moon;
      case 'meditation': return Brain;
      default: return Bell;
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'water': return 'bg-blue-50 text-blue-600';
      case 'medication': return 'bg-red-50 text-red-600';
      case 'exercise': return 'bg-green-50 text-green-600';
      case 'meal': return 'bg-orange-50 text-orange-600';
      case 'sleep': return 'bg-purple-50 text-purple-600';
      case 'meditation': return 'bg-pink-50 text-pink-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const completedPlans = dailyPlans.filter(p => p.completed).length;
  const totalPlans = dailyPlans.length;
  const progressPercent = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Войдите для просмотра дашборда</p>
          <Button onClick={() => setLocation("/login")}>Войти</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Stories Bar */}
      <Stories />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header with Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome & Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-500 text-sm">Добро пожаловать,</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.full_name || user.username}</h1>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date().toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {data && (
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold bg-gradient-to-r ${getHealthScoreGradient(data.healthScore)} bg-clip-text text-transparent`}>
                          {data.healthScore}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Здоровье</p>
                      </div>
                      <div className="w-20 h-20 relative">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-200"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${(data.healthScore / 100) * 226.2} 226.2`}
                            className={`text-transparent bg-gradient-to-r ${getHealthScoreGradient(data.healthScore)}`}
                            style={{
                              stroke: `url(#gradient-${data.healthScore})`
                            }}
                          />
                          <defs>
                            <linearGradient id={`gradient-${data.healthScore}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={data.healthScore >= 80 ? '#22c55e' : data.healthScore >= 60 ? '#eab308' : '#ef4444'} />
                              <stop offset="100%" stopColor={data.healthScore >= 80 ? '#10b981' : data.healthScore >= 60 ? '#f97316' : '#f43f5e'} />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-5 h-5" />
                      <span className="text-orange-100 text-sm">Серия</span>
                    </div>
                    <div className="text-3xl font-bold">
                      {data?.streaks?.current || 0} дней
                    </div>
                    <p className="text-sm text-orange-100 mt-1">
                      Рекорд: {data?.streaks?.longest || 0} дней
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl">🔥</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Daily Plans & Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold">План на сегодня</h2>
              {totalPlans > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {completedPlans}/{totalPlans}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setLocation('/calendar')}>
                Календарь <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="sm" onClick={() => setShowAddPlan(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Задача
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Plans - Expanded */}
            <Card className="md:col-span-2 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Задачи
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-1">
                      {progressPercent}% выполнено
                    </p>
                  </div>
                  <Progress value={progressPercent} className="w-24 h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {dailyPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 mb-3">Нет задач на сегодня</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddPlan(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Добавить задачу
                    </Button>
                  </div>
                ) : (
                  dailyPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-lg border transition-all ${
                        plan.completed 
                          ? 'bg-green-50/50 border-green-200' 
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <button
                          onClick={() => togglePlan(plan.id, !plan.completed)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            plan.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-slate-300 hover:border-emerald-500'
                          }`}
                        >
                          {plan.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium truncate ${
                              plan.completed ? 'line-through text-slate-400' : 'text-gray-900'
                            }`}>
                              {plan.title}
                            </p>
                            {plan.module && (
                              <Badge variant="outline" className="text-xs">
                                {modules.find(m => m.id === plan.module)?.name || plan.module}
                              </Badge>
                            )}
                          </div>
                          {plan.description && (
                            <p className={`text-xs mt-1 ${
                              plan.completed ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {plan.description}
                            </p>
                          )}
                          {plan.time && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-500 font-mono">{plan.time}</span>
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deletePlan(plan.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Expanded Edit Form */}
                      {expandedPlan === plan.id && (
                        <div className="border-t p-3 bg-slate-50">
                          <Input
                            defaultValue={plan.title}
                            className="mb-2"
                            placeholder="Название задачи"
                          />
                          <div className="flex gap-2">
                            <Input
                              type="time"
                              defaultValue={plan.time}
                              className="flex-1"
                            />
                            <Select defaultValue={plan.category}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Модуль" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">Общее</SelectItem>
                                {modules.map(m => (
                                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => setExpandedPlan(null)}>
                              Сохранить
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setExpandedPlan(null)}>
                              Отмена
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Reminders */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Напоминания
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {reminders.filter(r => r.enabled).slice(0, 5).map((reminder) => {
                  const Icon = getReminderIcon(reminder.type);
                  return (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${
                        getReminderColor(reminder.type)
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{reminder.title}</p>
                        <p className="text-xs opacity-70 font-mono">{reminder.time}</p>
                      </div>
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="text-xs opacity-60 hover:opacity-100"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setLocation('/settings')}
                >
                  Настроить напоминания
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Module Metrics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold">Модули здоровья</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/health-center')}>
              Все модули <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moduleMetrics.map((module, index) => {
              const Icon = module.icon;
              const moduleConfig = modules.find(m => m.id === module.id);

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card 
                    className={`${module.bgColor} border-0 hover:shadow-lg transition-all cursor-pointer group overflow-hidden`}
                    onClick={() => setLocation(`/health/${module.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            module.score >= 80 ? 'bg-green-100 text-green-700' :
                            module.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {module.score}%
                          </div>
                        </div>
                      </div>

                      <h3 className="font-semibold text-slate-800">{module.name}</h3>
                      <p className="text-xs text-slate-500 mb-3">{moduleConfig?.description}</p>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-slate-700">
                            {module.value > 0 ? module.value.toLocaleString() : '—'}
                          </p>
                          <p className="text-xs text-slate-400">{module.unit}</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <Progress value={module.score} className="h-1.5 mt-3" />

                      {/* Quick Add Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 bg-white/70 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/health/${module.id}/new`);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Добавить
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Today's Stats */}
        {data?.todayStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-lg font-semibold mb-4">Сегодня</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Footprints className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.todayStats.steps.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">шагов</p>
                    </div>
                  </div>
                  <Progress value={Math.min(100, (data.todayStats.steps / 10000) * 100)} className="h-1.5 mt-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.todayStats.water}L</p>
                      <p className="text-xs text-slate-500">воды</p>
                    </div>
                  </div>
                  <Progress value={Math.min(100, (data.todayStats.water / 2) * 100)} className="h-1.5 mt-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Moon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.todayStats.sleep}ч</p>
                      <p className="text-xs text-slate-500">сна</p>
                    </div>
                  </div>
                  <Progress value={Math.min(100, (data.todayStats.sleep / 8) * 100)} className="h-1.5 mt-2" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Flame className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.todayStats.calories}</p>
                      <p className="text-xs text-slate-500">ккал</p>
                    </div>
                  </div>
                  <Progress value={Math.min(100, (data.todayStats.calories / 2000) * 100)} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Активность</CardTitle>
                  <div className="flex gap-1">
                    {(['day', 'week', 'month'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedPeriod === period
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {period === 'day' ? 'День' : period === 'week' ? 'Неделя' : 'Месяц'}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.weeklyData || []}>
                      <defs>
                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { weekday: 'short' })}
                      />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="steps"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        fill="url(#colorSteps)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sleep Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Качество сна</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.weeklyData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { weekday: 'short' })}
                      />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200"
            onClick={() => setLocation('/create-post')}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm">Запись</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200"
            onClick={() => setLocation('/journal')}
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm">Журнал</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
            onClick={() => setLocation('/ai-chat')}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm">AI-чат</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200"
            onClick={() => setLocation('/social/friends')}
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm">Друзья</span>
          </Button>
        </motion.div>
      </main>

      {/* Add Plan Dialog */}
      <Dialog open={showAddPlan} onOpenChange={setShowAddPlan}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Новая задача</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                placeholder="Например: Утренняя пробежка"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Время (необязательно)</Label>
              <Input
                id="time"
                type="time"
                value={newPlanTime}
                onChange={(e) => setNewPlanTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module">Модуль</Label>
              <Select value={newPlanModule} onValueChange={setNewPlanModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите модуль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Общее</SelectItem>
                  {modules.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={addNewPlan} className="flex-1">
                Добавить
              </Button>
              <Button variant="outline" onClick={() => setShowAddPlan(false)} className="flex-1">
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
