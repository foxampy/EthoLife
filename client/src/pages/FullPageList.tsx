import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Home, LayoutDashboard, Heart, Users, Wallet, 
  FileText, Map, ShoppingCart, MessageSquare, Calendar,
  Sparkles, Settings, User, Bell, Search, Filter,
  CheckCircle2, XCircle, AlertCircle, ExternalLink,
  ChevronDown, ChevronUp, Trash2, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface PageInfo {
  path: string;
  name: string;
  category: string;
  status: 'active' | 'deprecated' | 'hidden' | 'broken';
  inNav: boolean;
  description: string;
  issues?: string[];
}

const allPages: PageInfo[] = [
  // Landing & Marketing
  { path: '/', name: 'LandingPage (NEW)', category: 'Landing', status: 'active', inNav: true, description: 'Новый главный лендинг с онбордингом' },
  { path: '/home', name: 'Home (OLD)', category: 'Landing', status: 'deprecated', inNav: false, description: 'Старый Home - УДАЛИТЬ' },
  { path: '/landing', name: 'Landing (OLD)', category: 'Landing', status: 'deprecated', inNav: false, description: 'Оригинальный лендинг - УДАЛИТЬ' },
  { path: '/v2', name: 'LandingV2', category: 'Landing', status: 'deprecated', inNav: false, description: 'Лендинг V2 - УДАЛИТЬ' },
  { path: '/newstyle', name: 'NewStyleLanding', category: 'Landing', status: 'deprecated', inNav: false, description: 'NewStyle лендинг - УДАЛИТЬ' },
  { path: '/presentation', name: 'Presentation', category: 'Landing', status: 'active', inNav: true, description: 'Интерактивная презентация' },
  
  // Documentation
  { path: '/whitepaper', name: 'Whitepaper', category: 'Documentation', status: 'active', inNav: true, description: 'Полный whitepaper проекта' },
  { path: '/roadmap', name: 'Roadmap', category: 'Documentation', status: 'active', inNav: true, description: 'Дорожная карта' },
  { path: '/tokenomics', name: 'Tokenomics', category: 'Documentation', status: 'active', inNav: true, description: 'Токеномика UNITY' },
  { path: '/economic-model', name: 'EconomicModel', category: 'Documentation', status: 'active', inNav: true, description: 'Экономическая модель' },
  { path: '/investment', name: 'InvestmentProposal', category: 'Documentation', status: 'active', inNav: true, description: 'Инвестиционное предложение' },
  { path: '/documents', name: 'Documents', category: 'Documentation', status: 'active', inNav: true, description: 'Центр документов' },
  
  // Auth
  { path: '/login', name: 'Login', category: 'Auth', status: 'active', inNav: true, description: 'Вход в систему' },
  { path: '/register', name: 'Register', category: 'Auth', status: 'active', inNav: true, description: 'Регистрация' },
  { path: '/onboarding', name: 'Onboarding', category: 'Auth', status: 'active', inNav: false, description: 'Онбординг нового пользователя' },
  { path: '/auth/callback', name: 'GoogleCallback', category: 'Auth', status: 'active', inNav: false, description: 'Google OAuth callback' },
  { path: '/telegram-auth', name: 'TelegramAuth', category: 'Auth', status: 'active', inNav: false, description: 'Telegram OAuth' },
  
  // Dashboards
  { path: '/dashboard', name: 'DashboardV2', category: 'Dashboard', status: 'active', inNav: true, description: 'Основной дашборд v2' },
  { path: '/dashboard-v1', name: 'Dashboard (OLD)', category: 'Dashboard', status: 'deprecated', inNav: false, description: 'Старый дашборд - УДАЛИТЬ' },
  { path: '/health-center', name: 'HealthCenter', category: 'Dashboard', status: 'active', inNav: true, description: 'Центр здоровья' },
  { path: '/dashboard/maria', name: 'MariaDashboard', category: 'Dashboard', status: 'active', inNav: false, description: 'Специальный дашборд Марии' },
  
  // Health Modules (NEW)
  { path: '/health/movement', name: 'MovementHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль движения (новый)' },
  { path: '/health/nutrition', name: 'NutritionHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль питания (новый)' },
  { path: '/health/sleep', name: 'SleepHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль сна (новый)' },
  { path: '/health/psychology', name: 'PsychologyHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль психологии (новый)' },
  { path: '/health/medicine', name: 'MedicineHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль медицины (новый)' },
  { path: '/health/relationships', name: 'RelationshipsHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль отношений (новый)' },
  { path: '/health/habits', name: 'HabitsHealth', category: 'Health', status: 'active', inNav: true, description: 'Модуль привычек (новый)' },
  { path: '/health/:moduleId', name: 'HealthModules', category: 'Health', status: 'active', inNav: false, description: 'Универсальный модуль (fallback)' },
  
  // Health Modules (OLD - REMOVE)
  { path: '/medicine', name: 'Medicine (OLD)', category: 'Health (Deprecated)', status: 'deprecated', inNav: false, description: 'Старый модуль - УДАЛИТЬ', issues: ['Duplicate identifier Upload'] },
  { path: '/nutrition', name: 'Nutrition (OLD)', category: 'Health (Deprecated)', status: 'deprecated', inNav: false, description: 'Старый модуль - УДАЛИТЬ' },
  { path: '/movement', name: 'Movement (OLD)', category: 'Health (Deprecated)', status: 'deprecated', inNav: false, description: 'Старый модуль - УДАЛИТЬ' },
  { path: '/psychology', name: 'Psychology (OLD)', category: 'Health (Deprecated)', status: 'deprecated', inNav: false, description: 'Старый модуль - УДАЛИТЬ' },
  { path: '/sleep', name: 'Sleep (OLD)', category: 'Health (Deprecated)', status: 'deprecated', inNav: false, description: 'Старый модуль - УДАЛИТЬ' },
  { path: '/relationships', name: 'Relationships (OLD)', category: 'Health (Deprecated)', status: 'deprecated', inNav: false, description: 'Старый модуль - УДАЛИТЬ' },
  
  // Additional Health Pages (Hidden)
  { path: '/habits', name: 'Habits', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Отдельная страница привычек' },
  { path: '/journal', name: 'Journal', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Дневник' },
  { path: '/physical-health', name: 'PhysicalHealth', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Физическое здоровье - НЕТ В РОУТЕРЕ' },
  { path: '/cognitive-health', name: 'CognitiveHealth', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Когнитивное здоровье - НЕТ В РОУТЕРЕ' },
  { path: '/psycho-emotional', name: 'PsychoEmotional', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Психо-эмоциональное - НЕТ В РОУТЕРЕ' },
  { path: '/social-health', name: 'SocialHealth', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Социальное здоровье - НЕТ В РОУТЕРЕ' },
  { path: '/prevention', name: 'Prevention', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Профилактика - НЕТ В РОУТЕРЕ' },
  { path: '/sleep-recovery', name: 'SleepRecovery', category: 'Health (Hidden)', status: 'hidden', inNav: false, description: 'Восстановление сна - НЕТ В РОУТЕРЕ' },
  
  // Social
  { path: '/social/friends', name: 'Friends', category: 'Social', status: 'active', inNav: true, description: 'Друзья' },
  { path: '/social/messages', name: 'Messages', category: 'Social', status: 'active', inNav: true, description: 'Сообщения' },
  { path: '/social/specialists', name: 'SpecialistsCatalog (NEW)', category: 'Social', status: 'active', inNav: true, description: 'Каталог специалистов' },
  { path: '/specialists', name: 'SpecialistsCatalog', category: 'Social', status: 'active', inNav: true, description: 'Редирект на /social/specialists' },
  { path: '/specialist/:username', name: 'SpecialistProfile', category: 'Social', status: 'active', inNav: false, description: 'Профиль специалиста' },
  { path: '/specialist/:username/book', name: 'Booking', category: 'Social', status: 'active', inNav: false, description: 'Бронирование' },
  { path: '/specialists-old', name: 'Specialists (OLD)', category: 'Social', status: 'deprecated', inNav: false, description: 'Старый каталог - УДАЛИТЬ' },
  { path: '/u/:username', name: 'UserProfile', category: 'Social', status: 'active', inNav: false, description: 'Профиль пользователя' },
  { path: '/create-post', name: 'CreatePost', category: 'Social', status: 'active', inNav: false, description: 'Создание поста' },
  { path: '/create-story', name: 'CreateStory', category: 'Social', status: 'active', inNav: false, description: 'Создание истории' },
  
  // Centers & Offers
  { path: '/centers', name: 'Centers', category: 'Centers', status: 'active', inNav: true, description: 'Каталог центров' },
  { path: '/map', name: 'Map', category: 'Centers', status: 'active', inNav: true, description: 'Карта центров' },
  { path: '/center/crm', name: 'CenterCRM', category: 'Centers', status: 'active', inNav: false, description: 'CRM для центров' },
  { path: '/specialist-offer', name: 'SpecialistOffer', category: 'Centers', status: 'active', inNav: true, description: 'Оффер для специалистов' },
  { path: '/center-offer', name: 'CenterOffer', category: 'Centers', status: 'active', inNav: true, description: 'Оффер для центров' },
  
  // Finance
  { path: '/pricing', name: 'Pricing', category: 'Finance', status: 'active', inNav: true, description: 'Тарифы' },
  { path: '/checkout', name: 'Checkout', category: 'Finance', status: 'active', inNav: false, description: 'Оформление покупки' },
  { path: '/wallet', name: 'Wallet', category: 'Finance', status: 'active', inNav: true, description: 'Кошелёк UNITY' },
  { path: '/payment/crypto/:planId', name: 'CryptoPayment', category: 'Finance', status: 'active', inNav: false, description: 'Крипто-оплата' },
  { path: '/shop', name: 'Shop', category: 'Finance', status: 'active', inNav: true, description: 'Магазин' },
  
  // AI
  { path: '/ai-chat', name: 'AIChat', category: 'AI', status: 'active', inNav: true, description: 'AI ассистент' },
  { path: '/ai-planner', name: 'AiPlanner', category: 'AI', status: 'active', inNav: true, description: 'AI планировщик' },
  { path: '/interactive-demo', name: 'InteractiveDemo', category: 'AI', status: 'active', inNav: false, description: 'Интерактивная демо' },
  
  // Tools
  { path: '/calendar', name: 'Calendar', category: 'Tools', status: 'active', inNav: true, description: 'Календарь' },
  { path: '/news', name: 'News', category: 'Tools', status: 'active', inNav: true, description: 'Новости' },
  { path: '/environment', name: 'Environment', category: 'Tools', status: 'active', inNav: false, description: 'Окружение (заглушка)' },
  
  // Profile
  { path: '/profile', name: 'Profile', category: 'Profile', status: 'active', inNav: true, description: 'Профиль' },
  { path: '/account', name: 'Account', category: 'Profile', status: 'active', inNav: true, description: 'Настройки аккаунта' },
  { path: '/settings', name: 'Settings', category: 'Profile', status: 'active', inNav: true, description: 'Редирект на /account' },
  
  // Special Features
  { path: '/library', name: 'Library', category: 'Library', status: 'active', inNav: true, description: 'Научная библиотека (PubMed API + локальная БД)' },
  { path: '/posture', name: 'Posture', category: 'Health', status: 'active', inNav: true, description: 'AI трекер осанки с камерой (MediaPipe)' },
  { path: '/integrations', name: 'Integrations', category: 'Settings', status: 'active', inNav: true, description: '70+ интеграций (UI только, не подключены)' },
  { path: '/researchers', name: 'Researchers', category: 'Library', status: 'active', inNav: true, description: 'Программа для исследователей и вознаграждения' },
  { path: '/full', name: 'FullPageList', category: 'Admin', status: 'active', inNav: true, description: 'Список всех страниц (эта страница)' },
  
  // System
  { path: '/404', name: 'NotFound', category: 'System', status: 'active', inNav: false, description: '404 ошибка' },
];

const categories = Array.from(new Set(allPages.map(p => p.category)));

const statusIcons = {
  active: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  deprecated: <Trash2 className="w-4 h-4 text-red-500" />,
  hidden: <EyeOff className="w-4 h-4 text-amber-500" />,
  broken: <XCircle className="w-4 h-4 text-red-600" />
};

const statusColors = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  deprecated: 'bg-red-100 text-red-800 border-red-200',
  hidden: 'bg-amber-100 text-amber-800 border-amber-200',
  broken: 'bg-red-200 text-red-900 border-red-300'
};

export default function FullPageList() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  const filteredPages = allPages.filter(page => {
    const matchesSearch = page.name.toLowerCase().includes(search.toLowerCase()) ||
                         page.path.toLowerCase().includes(search.toLowerCase()) ||
                         page.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || page.category === selectedCategory;
    const matchesIssues = !showOnlyIssues || (page.issues && page.issues.length > 0);
    return matchesSearch && matchesCategory && matchesIssues;
  });

  const groupedPages = filteredPages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = [];
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, PageInfo[]>);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const stats = {
    total: allPages.length,
    active: allPages.filter(p => p.status === 'active').length,
    deprecated: allPages.filter(p => p.status === 'deprecated').length,
    hidden: allPages.filter(p => p.status === 'hidden').length,
    inNav: allPages.filter(p => p.inNav).length,
    withIssues: allPages.filter(p => p.issues && p.issues.length > 0).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Полный аудит страниц EthoLife
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Административная панель для аудита всех страниц платформы
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500">Всего страниц</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              <p className="text-xs text-gray-500">Активных</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-600">{stats.deprecated}</p>
              <p className="text-xs text-gray-500">Устаревших</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-amber-600">{stats.hidden}</p>
              <p className="text-xs text-gray-500">Скрытых</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.inNav}</p>
              <p className="text-xs text-gray-500">В навигации</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-purple-600">{stats.withIssues}</p>
              <p className="text-xs text-gray-500">С проблемами</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск страниц..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Все
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyIssues}
                  onChange={(e) => setShowOnlyIssues(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Показать только с проблемами
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Page List */}
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {Object.entries(groupedPages).map(([category, pages]) => (
              <Card key={category}>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {category}
                      <Badge variant="secondary">{pages.length}</Badge>
                    </CardTitle>
                    {expandedCategories.includes(category) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {expandedCategories.includes(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <CardContent className="pt-0">
                        <div className="divide-y">
                          {pages.map((page) => (
                            <div 
                              key={page.path}
                              className="py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 -mx-4 px-4 transition-colors"
                            >
                              <div className="mt-1">
                                {statusIcons[page.status]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link 
                                    href={page.path}
                                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                  >
                                    {page.name}
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                  <Badge className={statusColors[page.status]}>
                                    {page.status}
                                  </Badge>
                                  {page.inNav && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                                      В меню
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  <code className="bg-gray-100 dark:bg-slate-800 px-1 rounded text-xs">
                                    {page.path}
                                  </code>
                                  {' • '}{page.description}
                                </p>
                                {page.issues && page.issues.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {page.issues.map((issue, idx) => (
                                      <div 
                                        key={idx}
                                        className="flex items-center gap-1 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                                      >
                                        <AlertCircle className="w-3 h-3" />
                                        {issue}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Легенда</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Active - Работает и используется</span>
              </div>
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>Deprecated - Устарел, нужно удалить</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-amber-500" />
                <span>Hidden - Существует но не в навигации</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Broken - Есть ошибки</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
