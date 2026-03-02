import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  LayoutDashboard,
  Bot,
  Menu,
  X,
  LogOut,
  User,
  Wallet,
  Settings,
  Calendar,
  BookOpen,
  Sparkles,
  Map,
  Users,
  Newspaper,
  ShoppingBag,
  Stethoscope,
  Activity,
  Moon,
  Smile,
  Apple,
  Dumbbell,
  Sprout,
  Home,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useI18n();

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  // Основная навигация - только 3 ключевые точки
  const mainNavItems = [
    { path: '/health-center', icon: Heart, label: 'Здоровье' },
    { path: '/ai-chat', icon: Bot, label: 'AI' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  ];

  // Модули здоровья для быстрого доступа
  const healthModules = [
    { path: '/health/movement', icon: Dumbbell, label: 'Движение', color: 'text-blue-500' },
    { path: '/health/nutrition', icon: Apple, label: 'Питание', color: 'text-green-500' },
    { path: '/health/sleep', icon: Moon, label: 'Сон', color: 'text-purple-500' },
    { path: '/health/psychology', icon: Smile, label: 'Психология', color: 'text-amber-500' },
    { path: '/health/medicine', icon: Stethoscope, label: 'Медицина', color: 'text-red-500' },
    { path: '/health/habits', icon: Sparkles, label: 'Привычки', color: 'text-cyan-500' },
  ];

  // Полное меню
  const fullMenuSections = [
    {
      title: 'Основное',
      items: [
        { path: '/', label: 'Главная', icon: Home },
        { path: '/health-center', label: 'Центр здоровья', icon: Heart },
        { path: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
        { path: '/ai-chat', label: 'AI помощник', icon: Bot },
        { path: '/calendar', label: 'Календарь', icon: Calendar },
      ],
    },
    {
      title: 'Здоровье',
      items: healthModules,
    },
    {
      title: 'Платформа',
      items: [
        { path: '/wallet', label: 'Кошелёк', icon: Wallet },
        { path: '/specialists', label: 'Специалисты', icon: Users },
        { path: '/map', label: 'Карта', icon: Map },
        { path: '/shop', label: 'Магазин', icon: ShoppingBag },
        { path: '/news', label: 'Новости', icon: Newspaper },
      ],
    },
    {
      title: 'Инструменты',
      items: [
        { path: '/habits', label: 'Привычки', icon: Sparkles },
        { path: '/journal', label: 'Журнал', icon: BookOpen },
        { path: '/library', label: 'Библиотека', icon: BookOpen },
        { path: '/posture', label: 'Осанка', icon: Activity },
      ],
    },
    {
      title: 'Информация',
      items: [
        { path: '/landings', label: 'Лендинги', icon: Menu },
        { path: '/roadmap', label: 'Дорожная карта', icon: Map },
        { path: '/pricing', label: 'Тарифы', icon: Wallet },
        { path: '/whitepaper', label: 'Whitepaper', icon: BookOpen },
      ],
    },
  ];

  return (
    <>
      {/* Bottom Navigation - только 3 основные кнопки */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div
          className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        />

        <div className="relative flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link key={item.path} href={item.path}>
                <button className="relative flex flex-col items-center justify-center min-w-[80px] h-14 group">
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-0.5 w-12 h-1 bg-emerald-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200",
                    active 
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-110" 
                      : "text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-50"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Label */}
                  <span className={cn(
                    "text-[10px] mt-0.5 font-medium transition-colors",
                    active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                  )}>
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="relative flex flex-col items-center justify-center min-w-[80px] h-14 group"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-50">
              <Menu className="w-6 h-6" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium text-gray-400 group-hover:text-gray-600">
              Меню
            </span>
          </button>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[340px] bg-white z-50 overflow-hidden flex flex-col shadow-2xl"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Ethos</span>
                    <span className="font-bold text-emerald-600">Life</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/80 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated && user && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 border-2 border-emerald-500">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500 truncate">{user.role}</p>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Токены</p>
                      <p className="text-sm font-bold text-emerald-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Серия</p>
                      <p className="text-sm font-bold text-orange-600">0</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Цели</p>
                      <p className="text-sm font-bold text-blue-600">0</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Content */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Quick Health Modules Access */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                      Быстрый доступ
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {healthModules.map((module) => {
                        const Icon = module.icon;
                        return (
                          <Link key={module.path} href={module.path}>
                            <button
                              onClick={() => setIsMenuOpen(false)}
                              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                <Icon className={cn("w-5 h-5", module.color)} />
                              </div>
                              <span className="text-[10px] text-gray-600">{module.label}</span>
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Menu Sections */}
                  {fullMenuSections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const ItemIcon = item.icon;
                          const active = isActive(item.path);
                          
                          return (
                            <Link key={item.path} href={item.path}>
                              <button
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                                  active
                                    ? "bg-emerald-50 text-emerald-700 font-medium"
                                    : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center",
                                  active ? "bg-emerald-100" : "bg-gray-100"
                                )}>
                                  <ItemIcon className={cn(
                                    "w-5 h-5",
                                    active ? "text-emerald-600" : "text-gray-500"
                                  )} />
                                </div>
                                <span className="flex-1 text-left text-sm">{item.label}</span>
                                {active && <ChevronRight className="w-4 h-4 text-emerald-600" />}
                              </button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              {!isAuthenticated ? (
                <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full rounded-xl h-11">
                      Войти
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11">
                      Регистрация
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
                  <Link href="/profile">
                    <Button variant="outline" className="w-full rounded-xl h-11 gap-2">
                      <User className="w-4 h-4" />
                      Профиль
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full rounded-xl h-11 gap-2">
                      <Settings className="w-4 h-4" />
                      Настройки
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-11 text-red-600 hover:bg-red-50 gap-2"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
