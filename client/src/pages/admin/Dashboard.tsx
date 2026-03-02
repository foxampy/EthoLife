import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  CreditCard,
  Shield,
  Search,
  Filter,
  Download,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSpecialists: number;
  totalBusinesses: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  subscriptions: {
    active: number;
    cancelled: number;
  };
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Проверка роли админа
    if (!user || user.role !== 'admin') {
      setLocation('/');
      return;
    }

    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      // TODO: Загрузка статистики из API
      const mockStats: AdminStats = {
        totalUsers: 1247,
        activeUsers: 834,
        totalSpecialists: 156,
        totalBusinesses: 89,
        revenue: {
          daily: 12450,
          weekly: 78900,
          monthly: 324500,
        },
        subscriptions: {
          active: 423,
          cancelled: 67,
        },
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Обзор', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'specialists', label: 'Специалисты', icon: Stethoscope },
    { id: 'businesses', label: 'Бизнесы', icon: Building },
    { id: 'analytics', label: 'Аналитика', icon: Activity },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">EthoLife</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="font-bold text-emerald-700">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:bg-red-50"
              onClick={() => {
                logout();
                setLocation('/');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={loadStats}>
                <RefreshCcw className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              {navItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Всего пользователей"
                  value={stats?.totalUsers || 0}
                  icon={Users}
                  trend="+12%"
                  color="blue"
                />
                <StatCard
                  title="Активные пользователи"
                  value={stats?.activeUsers || 0}
                  icon={Activity}
                  trend="+8%"
                  color="green"
                />
                <StatCard
                  title="Специалисты"
                  value={stats?.totalSpecialists || 0}
                  icon={Stethoscope}
                  trend="+5%"
                  color="purple"
                />
                <StatCard
                  title="Бизнесы"
                  value={stats?.totalBusinesses || 0}
                  icon={Building}
                  trend="+3%"
                  color="orange"
                />
              </div>

              {/* Revenue */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Выручка за день</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          ${stats?.revenue.daily.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-green-600">+15% к вчера</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Выручка за неделю</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          ${stats?.revenue.weekly.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-blue-600">+22% к прошлой неделе</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Выручка за месяц</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          ${stats?.revenue.monthly.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-purple-600">+18% к прошлому месяцу</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subscriptions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">Подписки</CardTitle>
                      <CardDescription>Активные и отменённые подписки</CardDescription>
                    </div>
                    <Badge variant={stats?.subscriptions.active! > stats?.subscriptions.cancelled! ? 'default' : 'destructive'}>
                      {stats?.subscriptions.active! > stats?.subscriptions.cancelled! ? 'Рост' : 'Спад'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.subscriptions.active || 0}</p>
                        <p className="text-sm text-gray-500">Активные</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.subscriptions.cancelled || 0}</p>
                        <p className="text-sm text-gray-500">Отменённые</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="specialists">
              <SpecialistsTab />
            </TabsContent>

            <TabsContent value="businesses">
              <BusinessesTab />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value?.toLocaleString() || 0}</div>
        <p className="text-xs text-green-600 mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
}

// Users Tab
function UsersTab() {
  const [search, setSearch] = useState('');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Пользователи</CardTitle>
            <CardDescription>Управление пользователями платформы</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 text-center py-8">
          Список пользователей (в разработке)
        </p>
      </CardContent>
    </Card>
  );
}

// Specialists Tab
function SpecialistsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Специалисты</CardTitle>
        <CardDescription>Модерация и управление специалистами</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 text-center py-8">
          Список специалистов (в разработке)
        </p>
      </CardContent>
    </Card>
  );
}

// Businesses Tab
function BusinessesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Бизнесы</CardTitle>
        <CardDescription>Управление бизнес-аккаунтами</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 text-center py-8">
          Список бизнесов (в разработке)
        </p>
      </CardContent>
    </Card>
  );
}

// Analytics Tab
function AnalyticsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Аналитика</CardTitle>
        <CardDescription>Детальная аналитика платформы</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 text-center py-8">
          Графики и статистика (в разработке)
        </p>
      </CardContent>
    </Card>
  );
}

// Settings Tab
function SettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки</CardTitle>
        <CardDescription>Настройки платформы</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 text-center py-8">
          Настройки админ панели (в разработке)
        </p>
      </CardContent>
    </Card>
  );
}
