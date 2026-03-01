import { useState } from 'react';
import { 
  Watch, Smartphone, Activity, Heart, Scale, Moon, 
  Utensils, Brain, Dumbbell, Stethoscope, Apple, 
  CheckCircle2, XCircle, Link2, ExternalLink, 
  Search, Filter, Plus, Settings, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  status: 'connected' | 'available' | 'coming_soon';
  features: string[];
  url?: string;
  authType: 'oauth' | 'api_key' | 'manual' | 'native';
}

const integrations: Integration[] = [
  // Wearables - Fitness Trackers
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    category: 'wearables',
    description: 'Интеграция с Apple Watch для отслеживания активности, сердечного ритма, сна и ЭКГ',
    icon: 'watch',
    status: 'coming_soon',
    features: ['Активность', 'Heart Rate', 'ECG', 'Blood Oxygen', 'Sleep'],
    authType: 'oauth'
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    category: 'wearables',
    description: 'Профессиональные спортивные часы и трекеры. Детальная аналитика тренировок',
    icon: 'activity',
    status: 'coming_soon',
    features: ['GPS треки', 'VO2 Max', 'Training Load', 'Recovery', 'Sleep Score'],
    authType: 'oauth'
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    category: 'wearables',
    description: 'Популярные фитнес-трекеры с отслеживанием шагов, сна и активности',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Steps', 'Sleep Stages', 'Heart Rate Zones', 'Stress Score'],
    authType: 'oauth'
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    category: 'wearables',
    description: 'Умное кольцо для отслеживания сна, готовности и активности',
    icon: 'moon',
    status: 'coming_soon',
    features: ['Sleep Score', 'Readiness', 'HRV', 'Temperature'],
    authType: 'oauth'
  },
  {
    id: 'whoop',
    name: 'WHOOP',
    category: 'wearables',
    description: 'Профессиональный трекер восстановления и strain для атлетов',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Strain', 'Recovery', 'Sleep Performance', 'HRV'],
    authType: 'oauth'
  },
  {
    id: 'polar',
    name: 'Polar',
    category: 'wearables',
    description: 'Спортивные часы и пульсометры для серьезных атлетов',
    icon: 'heart',
    status: 'coming_soon',
    features: ['Training Load Pro', 'Recovery Pro', 'Running Power', 'Swimming Metrics'],
    authType: 'oauth'
  },
  {
    id: 'samsung-health',
    name: 'Samsung Health',
    category: 'wearables',
    description: 'Экосистема Samsung для отслеживания здоровья и Galaxy Watch',
    icon: 'smartphone',
    status: 'coming_soon',
    features: ['Activity', 'Sleep', 'Heart Rate', 'Stress', 'Body Composition'],
    authType: 'oauth'
  },
  {
    id: 'xiaomi-mi-band',
    name: 'Xiaomi Mi Band',
    category: 'wearables',
    description: 'Доступный фитнес-трекер с базовыми функциями отслеживания',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Steps', 'Sleep', 'Heart Rate', 'SpO2'],
    authType: 'oauth'
  },
  {
    id: 'amazfit',
    name: 'Amazfit',
    category: 'wearables',
    description: 'Бюджетные умные часы с длительным временем работы',
    icon: 'watch',
    status: 'coming_soon',
    features: ['Activity', 'Sleep', 'PAI Score', 'Stress'],
    authType: 'oauth'
  },
  {
    id: 'coros',
    name: 'COROS',
    category: 'wearables',
    description: 'Спортивные часы для бегунов и триатлетов с длительной автономностью',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Training Load', 'Recovery Timer', 'Running Metrics', 'Navigation'],
    authType: 'oauth'
  },

  // Health Platforms
  {
    id: 'apple-health',
    name: 'Apple Health',
    category: 'health_platforms',
    description: 'Централизованное хранилище данных здоровья на iOS',
    icon: 'heart',
    status: 'coming_soon',
    features: ['Health Records', 'Activity', 'Vitals', 'Lab Results'],
    authType: 'native'
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    category: 'health_platforms',
    description: 'Платформа Google для отслеживания фитнеса и здоровья на Android',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Heart Points', 'Move Minutes', 'Vitals', 'Sleep'],
    authType: 'oauth'
  },
  {
    id: 'samsung-health-platform',
    name: 'Samsung Health Platform',
    category: 'health_platforms',
    description: 'Платформа для разработчиков интеграции с Samsung Health',
    icon: 'smartphone',
    status: 'coming_soon',
    features: ['Vitals', 'Exercise', 'Sleep', 'Body Composition'],
    authType: 'oauth'
  },
  {
    id: 'huawei-health',
    name: 'Huawei Health',
    category: 'health_platforms',
    description: 'Экосистема Huawei для умных часов и трекеров',
    icon: 'heart',
    status: 'coming_soon',
    features: ['TruSleep', 'TruRelax', 'SpO2', 'Activity'],
    authType: 'oauth'
  },

  // Smart Scales
  {
    id: 'withings',
    name: 'Withings',
    category: 'scales',
    description: 'Умные весы и анализаторы состава тела от Nokia',
    icon: 'scale',
    status: 'coming_soon',
    features: ['Weight', 'Body Fat', 'Muscle Mass', 'Bone Mass', 'Heart Rate'],
    authType: 'oauth'
  },
  {
    id: 'xiaomi-scale',
    name: 'Xiaomi Mi Scale',
    category: 'scales',
    description: 'Доступные умные весы с анализом состава тела',
    icon: 'scale',
    status: 'coming_soon',
    features: ['Weight', 'BMI', 'Body Fat', 'Muscle'],
    authType: 'api_key'
  },
  {
    id: 'eufy-scale',
    name: 'Eufy Smart Scale',
    category: 'scales',
    description: 'Умные весы с 12 метриками состава тела',
    icon: 'scale',
    status: 'coming_soon',
    features: ['Weight', 'Body Fat', 'BMR', 'Visceral Fat', 'Body Age'],
    authType: 'api_key'
  },
  {
    id: 'fitindex',
    name: 'FITINDEX',
    category: 'scales',
    description: 'Бюджетные умные весы с приложением для анализа',
    icon: 'scale',
    status: 'coming_soon',
    features: ['Weight', 'Body Fat', 'BMI', 'Muscle Mass'],
    authType: 'api_key'
  },
  {
    id: 'qardio',
    name: 'Qardio',
    category: 'scales',
    description: 'Премиальные умные весы и тонометры',
    icon: 'scale',
    status: 'coming_soon',
    features: ['Weight', 'Body Composition', 'Trends', 'Family Mode'],
    authType: 'oauth'
  },

  // Blood Pressure
  {
    id: 'omron',
    name: 'Omron HeartAdvisor',
    category: 'bp_monitors',
    description: 'Профессиональные тонометры с приложением',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Blood Pressure', 'Irregular Heartbeat', 'Morning Hypertension'],
    authType: 'oauth'
  },
  {
    id: 'qardio-bp',
    name: 'QardioArm',
    category: 'bp_monitors',
    description: 'Умный тонометр с интеграцией Apple Health',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Blood Pressure', 'Heart Rate', 'Irregular Heartbeat', 'Geo-tracking'],
    authType: 'oauth'
  },
  {
    id: 'withings-bp',
    name: 'Withings BPM Connect',
    category: 'bp_monitors',
    description: 'Компактный тонометр с Wi-Fi синхронизацией',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Blood Pressure', 'Heart Rate', 'Share with Doctor'],
    authType: 'oauth'
  },

  // Glucose Monitors
  {
    id: 'dexcom',
    name: 'Dexcom G6/G7',
    category: 'glucose',
    description: 'Непрерывный мониторинг глюкозы (CGM) для диабетиков',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Real-time Glucose', 'Alerts', 'Trend Arrows', 'Clarity Reports'],
    authType: 'oauth'
  },
  {
    id: 'freestyle-libre',
    name: 'FreeStyle Libre',
    category: 'glucose',
    description: 'CGM от Abbott без пальцевых проколов',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Glucose Readings', 'Patterns', 'LibreView Reports'],
    authType: 'oauth'
  },
  {
    id: 'medtronic',
    name: 'Medtronic Guardian',
    category: 'glucose',
    description: 'CGM с интеграцией с инсулиновыми помпами',
    icon: 'activity',
    status: 'coming_soon',
    features: ['CGM', 'Predictive Alerts', 'CareLink'],
    authType: 'oauth'
  },

  // Nutrition Apps
  {
    id: 'myfitnesspal',
    name: 'MyFitnessPal',
    category: 'nutrition',
    description: 'Крупнейшая база продуктов и счетчик калорий',
    icon: 'utensils',
    status: 'coming_soon',
    features: ['Food Diary', 'Barcode Scanner', 'Recipes', 'Nutrition Facts'],
    authType: 'oauth'
  },
  {
    id: 'yazio',
    name: 'Yazio',
    category: 'nutrition',
    description: 'Европейский трекер питания с персонализированными планами',
    icon: 'utensils',
    status: 'coming_soon',
    features: ['Calorie Counter', 'Intermittent Fasting', 'Recipes', 'Progress'],
    authType: 'oauth'
  },
  {
    id: 'cronometer',
    name: 'Cronometer',
    category: 'nutrition',
    description: 'Детальный трекер микронутриентов и витаминов',
    icon: 'utensils',
    status: 'coming_soon',
    features: ['Micronutrients', 'Biometric Tracking', 'Fasting Timer', 'Gold Features'],
    authType: 'oauth'
  },
  {
    id: 'fatsecret',
    name: 'FatSecret',
    category: 'nutrition',
    description: 'Бесплатный дневник питания с огромной базой продуктов',
    icon: 'utensils',
    status: 'coming_soon',
    features: ['Food Diary', 'Barcode Scanner', 'Community', 'Challenges'],
    authType: 'oauth'
  },
  {
    id: 'lifesum',
    name: 'Lifesum',
    category: 'nutrition',
    description: 'Шведское приложение для здорового питания с диетами',
    icon: 'utensils',
    status: 'coming_soon',
    features: ['Diet Plans', 'Recipes', 'Water Tracker', 'Macros'],
    authType: 'oauth'
  },
  {
    id: 'lose-it',
    name: 'Lose It!',
    category: 'nutrition',
    description: 'Популярный счетчик калорий в США',
    icon: 'utensils',
    status: 'coming_soon',
    features: ['Calorie Budget', 'Barcode Scanner', 'Challenges', 'Insights'],
    authType: 'oauth'
  },

  // Fitness Apps
  {
    id: 'strava',
    name: 'Strava',
    category: 'fitness',
    description: 'Социальная сеть для бегунов и велосипедистов',
    icon: 'activity',
    status: 'coming_soon',
    features: ['GPS Tracking', 'Segments', 'Kudos', 'Training Log', 'Beacon'],
    authType: 'oauth'
  },
  {
    id: 'nike-run',
    name: 'Nike Run Club',
    category: 'fitness',
    description: 'Беговое приложение от Nike с тренировками',
    icon: 'dumbbell',
    status: 'coming_soon',
    features: ['GPS Runs', 'Guided Runs', 'Challenges', 'Shoe Tracking'],
    authType: 'oauth'
  },
  {
    id: 'adidas-running',
    name: 'adidas Running',
    category: 'fitness',
    description: 'Беговое приложение от Adidas (ранее Runtastic)',
    icon: 'dumbbell',
    status: 'coming_soon',
    features: ['GPS Tracking', 'Training Plans', 'Shoe Tracker', 'Community'],
    authType: 'oauth'
  },
  {
    id: 'komoot',
    name: 'Komoot',
    category: 'fitness',
    description: 'Навигация для хайкинга, велоспорта и trail running',
    icon: 'activity',
    status: 'coming_soon',
    features: ['Route Planning', 'Offline Maps', 'Turn-by-turn', 'Highlights'],
    authType: 'oauth'
  },
  {
    id: 'peloton',
    name: 'Peloton',
    category: 'fitness',
    description: 'Платформа для домашних тренировок с инструкторами',
    icon: 'dumbbell',
    status: 'coming_soon',
    features: ['Cycling', 'Running', 'Strength', 'Yoga', 'Meditation'],
    authType: 'oauth'
  },
  {
    id: 'freeletics',
    name: 'Freeletics',
    category: 'fitness',
    description: 'AI-powered персональные тренировки без оборудования',
    icon: 'dumbbell',
    status: 'coming_soon',
    features: ['AI Coach', 'Bodyweight', 'Running', 'Gym', 'Nutrition'],
    authType: 'oauth'
  },
  {
    id: 'nike-training',
    name: 'Nike Training Club',
    category: 'fitness',
    description: 'Библиотека тренировок от Nike с видео',
    icon: 'dumbbell',
    status: 'coming_soon',
    features: ['Workouts', 'Programs', 'Equipment-free', 'Recovery'],
    authType: 'oauth'
  },

  // Sleep Trackers
  {
    id: 'sleep-cycle',
    name: 'Sleep Cycle',
    category: 'sleep',
    description: 'Умный будильник с анализом фаз сна',
    icon: 'moon',
    status: 'coming_soon',
    features: ['Sleep Analysis', 'Smart Alarm', 'Snore Detection', 'Sleep Aid'],
    authType: 'oauth'
  },
  {
    id: 'pillow',
    name: 'Pillow',
    category: 'sleep',
    description: 'Трекер сна для iOS и Apple Watch',
    icon: 'moon',
    status: 'coming_soon',
    features: ['Sleep Stages', 'Heart Rate', 'Audio Recordings', 'Nap Modes'],
    authType: 'oauth'
  },
  {
    id: 'autosleep',
    name: 'AutoSleep',
    category: 'sleep',
    description: 'Автоматический трекер сна для Apple Watch',
    icon: 'moon',
    status: 'coming_soon',
    features: ['Automatic Tracking', 'Sleep Bank', 'Smart Alarm', 'Readiness'],
    authType: 'native'
  },
  {
    id: 'sleepscore',
    name: 'SleepScore',
    category: 'sleep',
    description: 'Научный подход к анализу сна от ResMed',
    icon: 'moon',
    status: 'coming_soon',
    features: ['SleepScore', 'Smart Alarm', 'Sleep History', 'Coaching'],
    authType: 'oauth'
  },

  // Mental Health
  {
    id: 'headspace',
    name: 'Headspace',
    category: 'mental',
    description: 'Медитации и осознанность с гайдами',
    icon: 'brain',
    status: 'coming_soon',
    features: ['Meditations', 'Sleepcasts', 'Focus', 'Move Mode'],
    authType: 'oauth'
  },
  {
    id: 'calm',
    name: 'Calm',
    category: 'mental',
    description: 'Медитации, сказки для сна и музыка для фокуса',
    icon: 'brain',
    status: 'coming_soon',
    features: ['Meditations', 'Sleep Stories', 'Breathing', 'Masterclasses'],
    authType: 'oauth'
  },
  {
    id: 'insight-timer',
    name: 'Insight Timer',
    category: 'mental',
    description: 'Бесплатная библиотека медитаций от учителей со всего мира',
    icon: 'brain',
    status: 'coming_soon',
    features: ['Meditations', 'Music', 'Courses', 'Timer', 'Community'],
    authType: 'oauth'
  },
  {
    id: 'waking-up',
    name: 'Waking Up',
    category: 'mental',
    description: 'Медитации от Сэма Харриса с теорией осознанности',
    icon: 'brain',
    status: 'coming_soon',
    features: ['Daily Meditation', 'Theory', 'Lessons', 'Conversations'],
    authType: 'oauth'
  },

  // Medical Records
  {
    id: 'epic-my-chart',
    name: 'Epic MyChart',
    category: 'medical',
    description: 'Доступ к медицинским картам больниц использующих Epic',
    icon: 'stethoscope',
    status: 'coming_soon',
    features: ['Lab Results', 'Appointments', 'Messages', 'Prescriptions'],
    authType: 'oauth'
  },
  {
    id: 'cerner',
    name: 'Cerner Health',
    category: 'medical',
    description: 'Портал пациента для систем на базе Cerner',
    icon: 'stethoscope',
    status: 'coming_soon',
    features: ['Health Records', 'Appointments', 'Messaging', 'Bill Pay'],
    authType: 'oauth'
  },
  {
    id: '1uphealth',
    name: '1upHealth',
    category: 'medical',
    description: 'Агрегатор медицинских данных из разных источников',
    icon: 'stethoscope',
    status: 'coming_soon',
    features: ['Health Records', 'FHIR API', 'Provider Networks'],
    authType: 'oauth'
  },
  {
    id: 'human-api',
    name: 'Human API',
    category: 'medical',
    description: 'Платформа для доступа к медицинским данным пациентов',
    icon: 'stethoscope',
    status: 'coming_soon',
    features: ['EHR Data', 'Labs', 'Pharmacy', 'Vitals'],
    authType: 'oauth'
  }
];

const categoryLabels: Record<string, string> = {
  wearables: 'Носимые устройства',
  health_platforms: 'Платформы здоровья',
  scales: 'Умные весы',
  bp_monitors: 'Тонометры',
  glucose: 'Глюкометры',
  nutrition: 'Питание',
  fitness: 'Фитнес',
  sleep: 'Сон',
  mental: 'Ментальное здоровье',
  medical: 'Медицинские записи'
};

const categoryIcons: Record<string, React.ReactNode> = {
  wearables: <Watch className="w-5 h-5" />,
  health_platforms: <Heart className="w-5 h-5" />,
  scales: <Scale className="w-5 h-5" />,
  bp_monitors: <Activity className="w-5 h-5" />,
  glucose: <Activity className="w-5 h-5" />,
  nutrition: <Utensils className="w-5 h-5" />,
  fitness: <Dumbbell className="w-5 h-5" />,
  sleep: <Moon className="w-5 h-5" />,
  mental: <Brain className="w-5 h-5" />,
  medical: <Stethoscope className="w-5 h-5" />
};

export default function Integrations() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  const filteredIntegrations = integrations.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(search.toLowerCase()) ||
                         int.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || int.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedIntegrations = filteredIntegrations.reduce((acc, int) => {
    if (!acc[int.category]) acc[int.category] = [];
    acc[int.category].push(int);
    return acc;
  }, {} as Record<string, Integration[]>);

  const toggleConnection = (id: string) => {
    setConnectedIntegrations(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    toast.success('Настройка сохранена');
  };

  const stats = {
    total: integrations.length,
    connected: connectedIntegrations.length,
    comingSoon: integrations.filter(i => i.status === 'coming_soon').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Интеграции и устройства
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Подключите свои устройства и приложения для создания единого центра здоровья. 
            EthoLife интегрируется с 70+ сервисами.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-emerald-600">{stats.total}</p>
              <p className="text-sm text-gray-500">Интеграций</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.connected}</p>
              <p className="text-sm text-gray-500">Подключено</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-amber-600">{stats.comingSoon}</p>
              <p className="text-sm text-gray-500">В разработке</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Поиск интеграций..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-emerald-600' : ''}
              >
                Все
              </Button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(key === selectedCategory ? null : key)}
                  className={selectedCategory === key ? 'bg-emerald-600' : ''}
                >
                  {categoryIcons[key]}
                  <span className="ml-2 hidden md:inline">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations List */}
        <div className="space-y-6">
          {Object.entries(groupedIntegrations).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {categoryIcons[category]}
                {categoryLabels[category]}
                <Badge variant="secondary">{items.length}</Badge>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((integration) => (
                  <Card key={integration.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                            {categoryIcons[integration.category]}
                          </div>
                          <div>
                            <CardTitle className="text-base">{integration.name}</CardTitle>
                            <div className="flex items-center gap-1 mt-1">
                              {integration.status === 'connected' ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Подключено
                                </Badge>
                              ) : integration.status === 'coming_soon' ? (
                                <Badge variant="outline" className="text-amber-600">
                                  Скоро
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Доступно</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {integration.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {integration.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {integration.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{integration.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant={connectedIntegrations.includes(integration.id) ? 'secondary' : 'default'}
                        className="w-full"
                        onClick={() => toggleConnection(integration.id)}
                        disabled={integration.status === 'coming_soon'}
                      >
                        {connectedIntegrations.includes(integration.id) ? (
                          <><Settings className="w-4 h-4 mr-2" /> Настроить</>
                        ) : (
                          <><Link2 className="w-4 h-4 mr-2" /> Подключить</>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">О интеграциях</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  EthoLife стремится стать единым центром всех ваших данных о здоровье. 
                  Мы поддерживаем интеграцию через OAuth, API keys и нативные протоколы 
                  (Apple Health, Google Fit).
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">OAuth 2.0</Badge>
                  <Badge variant="outline">FHIR</Badge>
                  <Badge variant="outline">REST API</Badge>
                  <Badge variant="outline">HealthKit</Badge>
                  <Badge variant="outline">Google Fit SDK</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
