import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Apple,
  Moon,
  Smile,
  Heart,
  Users,
  Sparkles,
  Plus,
  X,
  Settings,
  GripVertical,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Footprints,
  Flame,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

// Типы виджетов
interface Widget {
  id: string;
  type: string;
  title: string;
  icon: string;
  color: string;
  data: any;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

// Доступные виджеты
const AVAILABLE_WIDGETS = [
  { id: 'steps', type: 'steps', title: 'Шаги', icon: 'footprints', color: 'blue' },
  { id: 'water', type: 'water', title: 'Вода', icon: 'droplets', color: 'cyan' },
  { id: 'calories', type: 'calories', title: 'Калории', icon: 'flame', color: 'orange' },
  { id: 'sleep', type: 'sleep', title: 'Сон', icon: 'moon', color: 'purple' },
  { id: 'mood', type: 'mood', title: 'Настроение', icon: 'smile', color: 'amber' },
  { id: 'weight', type: 'weight', title: 'Вес', icon: 'activity', color: 'green' },
  { id: 'workouts', type: 'workouts', title: 'Тренировки', icon: 'dumbbell', color: 'red' },
  { id: 'habits', type: 'habits', title: 'Привычки', icon: 'sparkles', color: 'pink' },
  { id: 'medications', type: 'medications', title: 'Лекарства', icon: 'heart', color: 'rose' },
  { id: 'goals', type: 'goals', title: 'Цели', icon: 'target', color: 'indigo' },
];

// Иконки
const ICONS: Record<string, any> = {
  footprints: Footprints,
  droplets: Droplets,
  flame: Flame,
  moon: Moon,
  smile: Smile,
  activity: Activity,
  dumbbell: Activity,
  sparkles: Sparkles,
  heart: Heart,
  target: Award,
};

// Цвета
const COLORS: Record<string, string> = {
  blue: 'from-blue-500 to-cyan-500',
  cyan: 'from-cyan-500 to-teal-500',
  orange: 'from-orange-500 to-red-500',
  purple: 'from-purple-500 to-violet-500',
  amber: 'from-amber-500 to-yellow-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
  pink: 'from-pink-500 to-rose-500',
  rose: 'from-rose-500 to-red-500',
  indigo: 'from-indigo-500 to-blue-500',
};

export default function DashboardWidgets() {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка виджетов
  useEffect(() => {
    loadWidgets();
  }, [user?.id]);

  const loadWidgets = async () => {
    // TODO: Загрузка из API
    // Для sekarang используем дефолтные
    const defaultWidgets: Widget[] = [
      {
        id: '1',
        type: 'steps',
        title: 'Шаги сегодня',
        icon: 'footprints',
        color: 'blue',
        data: { value: 8432, goal: 10000, unit: 'шагов' },
        visible: true,
        position: 0,
        size: 'medium',
      },
      {
        id: '2',
        type: 'water',
        title: 'Вода',
        icon: 'droplets',
        color: 'cyan',
        data: { value: 1.5, goal: 2, unit: 'л' },
        visible: true,
        position: 1,
        size: 'small',
      },
      {
        id: '3',
        type: 'calories',
        title: 'Калории',
        icon: 'flame',
        color: 'orange',
        data: { value: 1840, goal: 2000, unit: 'ккал' },
        visible: true,
        position: 2,
        size: 'small',
      },
      {
        id: '4',
        type: 'sleep',
        title: 'Сон',
        icon: 'moon',
        color: 'purple',
        data: { value: 7.5, goal: 8, unit: 'часов' },
        visible: true,
        position: 3,
        size: 'medium',
      },
    ];

    setWidgets(defaultWidgets);
    setLoading(false);
  };

  // Добавление виджета
  const addWidget = (widgetType: string) => {
    const widgetConfig = AVAILABLE_WIDGETS.find(w => w.type === widgetType);
    if (!widgetConfig) return;

    const Icon = ICONS[widgetConfig.icon];
    const newWidget: Widget = {
      id: Date.now().toString(),
      type: widgetType,
      title: widgetConfig.title,
      icon: widgetConfig.icon,
      color: widgetConfig.color,
      data: { value: 0, goal: 100, unit: '' },
      visible: true,
      position: widgets.length,
      size: 'small',
    };

    setWidgets([...widgets, newWidget]);
    setShowWidgetPicker(false);
  };

  // Удаление виджета
  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  // Переключение видимости
  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  };

  // Рендер виджета по типу
  const renderWidget = (widget: Widget) => {
    const Icon = ICONS[widget.icon];
    const gradient = COLORS[widget.color];

    return (
      <motion.div
        key={widget.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={widget.size === 'large' ? 'col-span-2' : 'col-span-1'}
      >
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow group">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">{widget.title}</CardTitle>
                <CardDescription className="text-xs">
                  {widget.data.unit}
                </CardDescription>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-600"
                onClick={() => removeWidget(widget.id)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 pt-2">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {typeof widget.data.value === 'number' 
                    ? widget.data.value.toLocaleString() 
                    : widget.data.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  из {widget.data.goal} {widget.data.unit}
                </p>
              </div>
              
              {/* Mini chart or trend */}
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">+12%</span>
              </div>
            </div>

            {/* Progress */}
            <Progress 
              value={(widget.data.value / widget.data.goal) * 100} 
              className="h-1.5 mt-3"
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Загрузка виджетов...</p>
        </div>
      </div>
    );
  }

  const visibleWidgets = widgets.filter(w => w.visible);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Мои виджеты</h2>
          <p className="text-sm text-gray-500">Настройте дашборд под себя</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWidgetPicker(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </Button>
      </div>

      {/* Widgets Grid */}
      {visibleWidgets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleWidgets.map((widget) => renderWidget(widget))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Нет виджетов</h3>
            <p className="text-sm text-gray-500 mb-4">
              Добавьте виджеты для отслеживания показателей
            </p>
            <Button onClick={() => setShowWidgetPicker(true)}>
              Выбрать виджеты
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Widget Picker Dialog */}
      <Dialog open={showWidgetPicker} onOpenChange={setShowWidgetPicker}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить виджет</DialogTitle>
            <DialogDescription>
              Выберите показатели, которые хотите отслеживать
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-2">
              {AVAILABLE_WIDGETS.map((widget) => {
                const Icon = ICONS[widget.icon];
                const gradient = COLORS[widget.color];
                const isAdded = widgets.some(w => w.type === widget.type);

                return (
                  <button
                    key={widget.id}
                    onClick={() => !isAdded && addWidget(widget.type)}
                    disabled={isAdded}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isAdded
                        ? 'border-emerald-200 bg-emerald-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mx-auto mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{widget.title}</p>
                    {isAdded && (
                      <Badge className="mt-2 bg-emerald-500 text-xs">
                        Добавлено
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки виджетов</DialogTitle>
            <DialogDescription>
              Управляйте видимостью виджетов
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium">{widget.title}</span>
                </div>
                <Switch
                  checked={widget.visible}
                  onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
