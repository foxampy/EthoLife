import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft, Zap, TrendingUp, Plus, ThumbsUp, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'product' | 'tool' | 'integration';
  votes: number;
  comments: number;
  status: 'proposed' | 'in-progress' | 'completed';
  author: string;
  createdAt: string;
}

export default function ProjectsProducts() {
  const { t, locale } = useI18n();

  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: locale === 'en' ? 'Posture Tracking via Webcam' : 'Отслеживание осанки через веб-камеру',
      description: locale === 'en'
        ? 'AI-powered real-time posture monitoring using your device camera. Get instant feedback and daily reports.'
        : 'ИИ-мониторинг осанки в реальном времени с использованием камеры устройства. Мгновенные уведомления и дневные отчеты.',
      category: 'feature',
      votes: 342,
      comments: 28,
      status: 'in-progress',
      author: 'EthosLife Team',
      createdAt: '2026-01-15',
    },
    {
      id: '2',
      title: locale === 'en' ? 'Daily Assistant Module' : 'Модуль Ежедневного Ассистента',
      description: locale === 'en'
        ? 'Smart reminders for medications, habits, water intake, and appointments. Integrates with Telegram bot for notifications.'
        : 'Умные напоминания о лекарствах, привычках, воде и встречах. Интеграция с Telegram-ботом для уведомлений.',
      category: 'feature',
      votes: 289,
      comments: 45,
      status: 'in-progress',
      author: 'EthosLife Team',
      createdAt: '2026-01-10',
    },
    {
      id: '3',
      title: locale === 'en' ? 'Apple Health Integration' : 'Интеграция с Apple Health',
      description: locale === 'en'
        ? 'Sync your health data automatically from Apple Health app including steps, workouts, sleep, and more.'
        : 'Автоматическая синхронизация данных о здоровье из приложения Apple Health: шаги, тренировки, сон и другое.',
      category: 'integration',
      votes: 256,
      comments: 19,
      status: 'proposed',
      author: 'Community',
      createdAt: '2026-02-01',
    },
    {
      id: '4',
      title: locale === 'en' ? 'NFT Health Certificates' : 'NFT Сертификаты Здоровья',
      description: locale === 'en'
        ? 'Mint your health achievements as NFTs. Share verified certificates with employers, insurers, or coaches.'
        : 'Минт достижений здоровья как NFT. Делитесь верифицированными сертификатами с работодателями, страховыми или тренерами.',
      category: 'product',
      votes: 198,
      comments: 67,
      status: 'proposed',
      author: 'DAO Community',
      createdAt: '2026-02-10',
    },
    {
      id: '5',
      title: locale === 'en' ? 'Garmin & Fitbit Sync' : 'Синхронизация Garmin и Fitbit',
      description: locale === 'en'
        ? 'Connect your wearable devices for automatic activity and health metrics tracking.'
        : 'Подключите носимые устройства для автоматического отслеживания активности и показателей здоровья.',
      category: 'integration',
      votes: 187,
      comments: 23,
      status: 'proposed',
      author: 'Community',
      createdAt: '2026-02-15',
    },
    {
      id: '6',
      title: locale === 'en' ? 'Family Health Dashboard' : 'Семейная Панель Здоровья',
      description: locale === 'en'
        ? 'Monitor family members health metrics, set shared goals, and participate in challenges together.'
        : 'Мониторинг показателей здоровья членов семьи, общие цели и совместные челленджи.',
      category: 'feature',
      votes: 156,
      comments: 31,
      status: 'proposed',
      author: 'Community',
      createdAt: '2026-02-20',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'proposed' | 'in-progress'>('all');

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'bg-blue-100 text-blue-700';
      case 'product': return 'bg-purple-100 text-purple-700';
      case 'tool': return 'bg-green-100 text-green-700';
      case 'integration': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">{t('nav.home')}</span>
              </button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Projects & Products</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en'
              ? 'Shape the Future of EthosLife'
              : 'Формируйте Будущее EthosLife'
            }
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {locale === 'en'
              ? 'Vote on features, propose ideas, and stake UNITY tokens to prioritize development'
              : 'Голосуйте за функции, предлагайте идеи и стейкайте UNITY токены для определения приоритетов разработки'
            }
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">24</p>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Active Projects' : 'Активных проектов'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-blue-600">1.2K</p>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Total Votes' : 'Всего голосов'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-purple-600">847</p>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Community Members' : 'Участников сообщества'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Filters */}
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-emerald-600' : ''}
              >
                {locale === 'en' ? 'All' : 'Все'}
              </Button>
              <Button
                variant={filter === 'proposed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('proposed')}
                className={filter === 'proposed' ? 'bg-emerald-600' : ''}
              >
                {locale === 'en' ? 'Proposed' : 'Предложено'}
              </Button>
              <Button
                variant={filter === 'in-progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('in-progress')}
                className={filter === 'in-progress' ? 'bg-emerald-600' : ''}
              >
                {locale === 'en' ? 'In Progress' : 'В работе'}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                {locale === 'en' ? 'Discuss' : 'Обсудить'}
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                {locale === 'en' ? 'Submit Idea' : 'Предложить идею'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getCategoryColor(project.category)}>
                        {project.category}
                      </Badge>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status === 'in-progress'
                          ? (locale === 'en' ? 'In Development' : 'В разработке')
                          : project.status === 'completed'
                          ? (locale === 'en' ? 'Completed' : 'Завершено')
                          : (locale === 'en' ? 'Voting' : 'Голосование')
                        }
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="font-medium">{project.votes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{project.comments}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Staking Info */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {locale === 'en'
              ? 'Stake UNITY Tokens to Boost Your Ideas'
              : 'Стейкайте UNITY Токены для Продвижения Ваших Идей'
            }
          </h2>
          <p className="text-emerald-100 mb-8">
            {locale === 'en'
              ? 'Stake tokens on features you want to see developed. Top voted features get priority in our development roadmap.'
              : 'Стейкайте токены на функциях, которые хотите видеть в разработке. Топ функции получают приоритет в нашей дорожной карте.'
            }
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            {locale === 'en' ? 'Learn About Staking' : 'Узнать о Стейкинге'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
