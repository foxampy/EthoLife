import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import {
  CheckCircle,
  Clock,
  Circle,
  AlertTriangle,
  Zap,
  Shield,
  Heart,
  Brain,
  Activity,
  Moon,
  Apple,
  Dumbbell,
  Smile,
  Stethoscope,
  Users,
  Sparkles,
  FileText,
  Settings,
  MessageCircle,
  Award,
  Bell,
  Map,
  ShoppingBag,
  Building,
  Menu,
  Newspaper,
  BookOpen,
  Calendar,
  Wallet,
  User,
  Home,
  LayoutDashboard,
  Bot,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Status = 'completed' | 'in-progress' | 'pending' | 'blocked';

interface Feature {
  name: string;
  path?: string;
  status: Status;
  description: string;
  icon: any;
}

interface Section {
  title: string;
  features: Feature[];
}

export default function ProjectStatus() {
  const { t, locale } = useI18n();

  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections: Section[] = [
    {
      title: locale === 'en' ? 'Core Navigation' : 'Основная навигация',
      features: [
        { name: 'Home', path: '/', status: 'completed', description: 'Главная страница', icon: Home },
        { name: 'Dashboard', path: '/dashboard', status: 'completed', description: 'Личный кабинет', icon: LayoutDashboard },
        { name: 'Health Center', path: '/health-center', status: 'completed', description: 'Центр здоровья', icon: Heart },
        { name: 'AI Chat', path: '/ai-chat', status: 'completed', description: 'ИИ-ассистент', icon: Bot },
        { name: 'Calendar', path: '/calendar', status: 'completed', description: 'Календарь', icon: Calendar },
      ],
    },
    {
      title: locale === 'en' ? 'Health Modules' : 'Модули здоровья',
      features: [
        { name: 'Movement', path: '/health/movement', status: 'completed', description: 'Движение и активность', icon: Dumbbell },
        { name: 'Nutrition', path: '/health/nutrition', status: 'completed', description: 'Питание и диета', icon: Apple },
        { name: 'Sleep', path: '/health/sleep', status: 'completed', description: 'Сон и восстановление', icon: Moon },
        { name: 'Psychology', path: '/health/psychology', status: 'completed', description: 'Психология и настроение', icon: Smile },
        { name: 'Medicine', path: '/health/medicine', status: 'completed', description: 'Медицина и анализы', icon: Stethoscope },
        { name: 'Habits', path: '/health/habits', status: 'completed', description: 'Привычки и цели', icon: Sparkles },
      ],
    },
    {
      title: locale === 'en' ? 'Platform Features' : 'Функции платформы',
      features: [
        { name: 'Wallet', path: '/wallet', status: 'completed', description: 'Кошелёк и токены', icon: Wallet },
        { name: 'Subscriptions & NFT', path: '/subscriptions', status: 'completed', description: 'Абонементы и сертификаты', icon: Award },
        { name: 'Daily Assistant', path: '/daily-assistant', status: 'completed', description: 'Ежедневные напоминания', icon: Bell },
        { name: 'Messages', path: '/messages', status: 'pending', description: 'Сообщения и чаты', icon: MessageCircle },
        { name: 'Profile', path: '/profile', status: 'in-progress', description: 'Профиль пользователя', icon: User },
        { name: 'Settings', path: '/settings', status: 'completed', description: 'Настройки', icon: Settings },
      ],
    },
    {
      title: locale === 'en' ? 'Business & Services' : 'Бизнес и услуги',
      features: [
        { name: 'Specialists', path: '/specialists', status: 'pending', description: 'Каталог специалистов', icon: Users },
        { name: 'Centers', path: '/centers', status: 'pending', description: 'Медицинские центры', icon: Building },
        { name: 'Shop', path: '/shop', status: 'pending', description: 'Магазин товаров', icon: ShoppingBag },
        { name: 'Map', path: '/map', status: 'pending', description: 'Карта услуг', icon: Map },
        { name: 'Verification', path: '/certification', status: 'completed', description: 'Верификация', icon: Shield },
      ],
    },
    {
      title: locale === 'en' ? 'Information Pages' : 'Информационные страницы',
      features: [
        { name: 'Whitepaper', path: '/whitepaper', status: 'completed', description: 'Документация экосистемы', icon: BookOpen },
        { name: 'Roadmap', path: '/roadmap', status: 'completed', description: 'Дорожная карта', icon: Map },
        { name: 'Pricing', path: '/pricing', status: 'completed', description: 'Тарифы и цены', icon: Wallet },
        { name: 'Projects & Products', path: '/projects', status: 'completed', description: 'Голосование за функции', icon: Zap },
        { name: 'News', path: '/news', status: 'completed', description: 'Новости проекта', icon: Newspaper },
        { name: 'Landings', path: '/landings', status: 'pending', description: 'Версии лендингов', icon: Menu },
      ],
    },
    {
      title: locale === 'en' ? 'Landing Pages' : 'Лендинги',
      features: [
        { name: 'Main Landing', path: '/', status: 'completed', description: 'Главная лендинг страница', icon: Home },
        { name: 'Features', path: '/features', status: 'completed', description: 'Возможности', icon: Zap },
        { name: 'About', path: '/about', status: 'completed', description: 'О компании', icon: FileText },
        { name: 'Contact', path: '/contact', status: 'completed', description: 'Контакты', icon: MessageCircle },
        { name: 'Help', path: '/help', status: 'completed', description: 'Помощь', icon: AlertTriangle },
        { name: 'FAQ', path: '/faq', status: 'completed', description: 'Частые вопросы', icon: AlertTriangle },
        { name: 'Support', path: '/support', status: 'completed', description: 'Поддержка', icon: Heart },
        { name: 'Privacy', path: '/privacy', status: 'completed', description: 'Приватность', icon: Shield },
      ],
    },
  ];

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'blocked': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'pending': return Circle;
      case 'blocked': return AlertTriangle;
    }
  };

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case 'completed': return locale === 'en' ? 'Completed' : 'Готово';
      case 'in-progress': return locale === 'en' ? 'In Progress' : 'В работе';
      case 'pending': return locale === 'en' ? 'Pending' : 'Ожидает';
      case 'blocked': return locale === 'en' ? 'Blocked' : 'Заблокировано';
    }
  };

  const totalFeatures = sections.reduce((acc, section) => acc + section.features.length, 0);
  const completedFeatures = sections.reduce((acc, section) => 
    acc + section.features.filter(f => f.status === 'completed').length, 0
  );
  const progress = Math.round((completedFeatures / totalFeatures) * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Activity className="w-5 h-5" />
                <span className="font-medium">
                  {locale === 'en' ? 'Project Status' : 'Статус Проекта'}
                </span>
              </button>
            </Link>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              {locale === 'en' ? 'Refresh' : 'Обновить'}
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {locale === 'en' ? 'Development Progress' : 'Прогресс Разработки'}
                </h2>
                <p className="text-sm text-gray-500">
                  {locale === 'en'
                    ? `${completedFeatures} of ${totalFeatures} features completed`
                    : `${completedFeatures} из ${totalFeatures} функций готово`
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{progress}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {sections.reduce((acc, s) => acc + s.features.filter(f => f.status === 'completed').length, 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Done' : 'Готово'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {sections.reduce((acc, s) => acc + s.features.filter(f => f.status === 'in-progress').length, 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'In Progress' : 'В работе'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {sections.reduce((acc, s) => acc + s.features.filter(f => f.status === 'pending').length, 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Pending' : 'Ожидает'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {sections.reduce((acc, s) => acc + s.features.filter(f => f.status === 'blocked').length, 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {locale === 'en' ? 'Blocked' : 'Заблокировано'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <Card key={sectionIndex}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-bold text-gray-900">{section.title}</h3>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {section.features.filter(f => f.status === 'completed').length}/{section.features.length}
                      </Badge>
                      <ChevronRight className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        expandedSection === sectionIndex && "rotate-90"
                      )} />
                    </div>
                  </button>

                  {expandedSection === sectionIndex && (
                    <div className="border-t">
                      {section.features.map((feature, featureIndex) => {
                        const StatusIcon = getStatusIcon(feature.status);
                        return (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-t last:border-b-0"
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              feature.status === 'completed' ? 'bg-emerald-100' :
                              feature.status === 'in-progress' ? 'bg-blue-100' :
                              'bg-gray-100'
                            )}>
                              <feature.icon className={cn(
                                "w-5 h-5",
                                feature.status === 'completed' ? 'text-emerald-600' :
                                feature.status === 'in-progress' ? 'text-blue-600' :
                                'text-gray-600'
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{feature.name}</p>
                                <Badge className={cn("text-xs", getStatusColor(feature.status))}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {getStatusLabel(feature.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                            {feature.path && feature.status === 'completed' && (
                              <Link href={feature.path}>
                                <Button size="sm" variant="outline" className="h-8">
                                  {locale === 'en' ? 'Open' : 'Открыть'}
                                </Button>
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">
                {locale === 'en' ? 'Status Legend' : 'Легенда Статусов'}
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'Completed - Ready to use' : 'Готово - Можно использовать'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'In Progress - Being developed' : 'В работе - Разрабатывается'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'Pending - Planned' : 'Ожидает - Запланировано'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">
                    {locale === 'en' ? 'Blocked - Needs attention' : 'Заблокировано - Требует внимания'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
