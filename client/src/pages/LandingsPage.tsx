import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Heart,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  Monitor,
  Smartphone,
  Palette,
  CheckCircle2,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LandingOption {
  id: string;
  name: string;
  path: string;
  description: string;
  features: string[];
  bestFor: string;
  status: 'stable' | 'beta' | 'deprecated';
  preview?: string;
}

const landingOptions: LandingOption[] = [
  {
    id: 'new',
    name: 'EthoLife 2026 (Новый)',
    path: '/landing-new',
    description: 'Современный лендинг с полноценной воронкой, онбордингом и конверсией',
    features: [
      '5-шаговый онбординг',
      'Таймер обратного отсчёта',
      'Социальные доказательства',
      '7 модулей здоровья',
      'Тарифы с переключателем',
      'Отзывы пользователей',
      'Финальный CTA с прогрессом',
    ],
    bestFor: 'Основной лендинг для новых пользователей',
    status: 'stable',
  },
  {
    id: 'v2',
    name: 'Landing V2',
    path: '/v2',
    description: 'Альтернативная версия с акцентом на экосистему',
    features: [
      'Демонстрация экосистемы',
      'Интерактивные элементы',
      'Анимации',
      'Адаптивный дизайн',
    ],
    bestFor: 'Тестирование альтернативного подхода',
    status: 'stable',
  },
  {
    id: 'original',
    name: 'Original Landing',
    path: '/landing',
    description: 'Первая версия лендинга',
    features: [
      'Классический дизайн',
      'Базовая структура',
      'Проверен временем',
    ],
    bestFor: 'Сравнение и тестирование',
    status: 'deprecated',
  },
  {
    id: 'newstyle',
    name: 'New Style',
    path: '/newstyle',
    description: 'Экспериментальный дизайн с новым стилем',
    features: [
      'Уникальный визуальный стиль',
      'Современные эффекты',
      'Инновационный UX',
    ],
    bestFor: 'Тестирование нового дизайна',
    status: 'beta',
  },
  {
    id: 'presentation',
    name: 'Presentation',
    path: '/presentation',
    description: 'Презентация проекта для инвесторов и партнёров',
    features: [
      'Информация о проекте',
      'Экономическая модель',
      'Дорожная карта',
      'Команда',
    ],
    bestFor: 'Инвесторы и партнёры',
    status: 'stable',
  },
];

export default function LandingsPage() {
  const [, setLocation] = useLocation();
  const [selectedLanding, setSelectedLanding] = useState<LandingOption | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'beta':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deprecated':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'stable':
        return 'Стабильно';
      case 'beta':
        return 'Бета';
      case 'deprecated':
        return 'Устарело';
      default:
        return status;
    }
  };

  const handleOpenLanding = (landing: LandingOption) => {
    setLocation(landing.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EthoLife</h1>
                <p className="text-xs text-gray-500">Выбор лендинга</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Выберите версию лендинга
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Просмотрите все доступные версии лендингов и выберите оптимальную для ваших задач
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{landingOptions.length}</span>
            </div>
            <p className="text-sm text-gray-600">Версий лендинга</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {landingOptions.filter(l => l.status === 'stable').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Стабильных версий</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {landingOptions.filter(l => l.status === 'beta').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Бета-версий</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {landingOptions.filter(l => l.status === 'deprecated').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Устаревших версий</p>
          </motion.div>
        </div>

        {/* Landing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingOptions.map((landing, index) => (
            <motion.div
              key={landing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                      {landing.id === 'new' && <Sparkles className="w-6 h-6" />}
                      {landing.id === 'v2' && <LayoutDashboard className="w-6 h-6" />}
                      {landing.id === 'original' && <Monitor className="w-6 h-6" />}
                      {landing.id === 'newstyle' && <Palette className="w-6 h-6" />}
                      {landing.id === 'presentation' && <ExternalLink className="w-6 h-6" />}
                    </div>
                    <Badge className={getStatusColor(landing.status)}>
                      {getStatusLabel(landing.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{landing.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {landing.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Особенности
                    </p>
                    <ul className="space-y-1">
                      {landing.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {landing.features.length > 4 && (
                        <li className="text-sm text-gray-500">
                          +{landing.features.length - 4} ещё
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-semibold">Лучше для:</span> {landing.bestFor}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                      onClick={() => handleOpenLanding(landing)}
                    >
                      Открыть
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLanding(landing);
                        setShowPreview(true);
                      }}
                    >
                      Детали
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              💡 Рекомендация
            </h3>
            <p className="text-lg text-emerald-100 mb-6">
              Для основного использования рекомендуем <strong>EthoLife 2026 (Новый)</strong> — 
              это самая современная версия с полноценной воронкой, онбордингом и максимальной конверсией.
            </p>
            <Button
              className="bg-white text-emerald-600 hover:bg-emerald-50"
              size="lg"
              onClick={() => handleOpenLanding(landingOptions[0])}
            >
              Использовать рекомендуемый
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedLanding?.id === 'new' && <Sparkles className="w-6 h-6 text-emerald-500" />}
              {selectedLanding?.id === 'v2' && <LayoutDashboard className="w-6 h-6 text-blue-500" />}
              {selectedLanding?.id === 'original' && <Monitor className="w-6 h-6 text-gray-500" />}
              {selectedLanding?.id === 'newstyle' && <Palette className="w-6 h-6 text-purple-500" />}
              {selectedLanding?.id === 'presentation' && <ExternalLink className="w-6 h-6 text-orange-500" />}
              {selectedLanding?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedLanding?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedLanding && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Статус</h4>
                <Badge className={getStatusColor(selectedLanding.status)}>
                  {getStatusLabel(selectedLanding.status)}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Все особенности</h4>
                <ul className="space-y-2">
                  {selectedLanding.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Лучше для</h4>
                <p className="text-sm text-gray-600">{selectedLanding.bestFor}</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      handleOpenLanding(selectedLanding);
                      setShowPreview(false);
                    }}
                  >
                    Открыть лендинг
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>EthoLife Health Ecosystem • 2026</p>
          <p className="mt-1">
            Все версии лендингов доступны для тестирования и сравнения
          </p>
        </div>
      </footer>
    </div>
  );
}
