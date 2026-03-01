import { useState } from 'react';
import { 
  BookOpen, Award, Users, Building2, DollarSign, 
  CheckCircle2, Star, TrendingUp, FileText, 
  ExternalLink, Mail, Globe, ChevronRight, Info,
  BadgeCheck, Trophy, Wallet, Clock, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const rewardTasks = [
  {
    id: 'article-review',
    title: 'Рецензирование статьи',
    description: 'Проверка научной статьи на релевантность, качество и достоверность данных',
    reward: '50-200 UNITY',
    time: '30-60 мин',
    requirements: ['Научная степень или опыт публикаций', 'Знание предметной области'],
    icon: FileText
  },
  {
    id: 'data-verification',
    title: 'Верификация данных',
    description: 'Проверка и подтверждение метаданных, ссылок и научных фактов',
    reward: '20-100 UNITY',
    time: '15-30 мин',
    requirements: ['Внимательность к деталям', 'Умение работать с источниками'],
    icon: CheckCircle2
  },
  {
    id: 'metadata-enrichment',
    title: 'Обогащение метаданных',
    description: 'Добавление ключевых слов, категорий, тегов и связей между статьями',
    reward: '30-150 UNITY',
    time: '20-40 мин',
    requirements: ['Знание предметной области', 'Умение структурировать информацию'],
    icon: Target
  },
  {
    id: 'translation',
    title: 'Перевод abstract',
    description: 'Перевод аннотаций статей на другие языки (русский, английский)',
    reward: '10-50 UNITY',
    time: '10-20 мин',
    requirements: ['Владение языками', 'Научный стиль речи'],
    icon: Globe
  },
  {
    id: 'new-discovery',
    title: 'Новое открытие/исследование',
    description: 'Проведение оригинального исследования с публикацией в библиотеке',
    reward: '1000-10000 UNITY + грант',
    time: '1-12 месяцев',
    requirements: ['Научная степень', 'Опыт исследований', 'Публикации в Scopus/WoS'],
    icon: Trophy
  },
  {
    id: 'institution-verification',
    title: 'Верификация институтом',
    description: 'Официальное подтверждение данных от научного учреждения',
    reward: '500-2000 UNITY',
    time: '1-2 недели',
    requirements: ['Статус исследовательского института', 'Официальное письмо'],
    icon: Building2
  }
];

const badgeLevels = [
  { 
    name: 'Bronze', 
    minScore: 0, 
    color: 'bg-amber-600',
    benefits: ['Доступ к базовым задачам', 'Выплаты в UNITY'],
    icon: Award
  },
  { 
    name: 'Silver', 
    minScore: 1000, 
    color: 'bg-gray-400',
    benefits: ['Премиум задачи', 'Ускоренные выплаты', 'Бонус +10%'],
    icon: Star
  },
  { 
    name: 'Gold', 
    minScore: 5000, 
    color: 'bg-yellow-500',
    benefits: ['Эксклюзивные задачи', 'Персональный менеджер', 'Бонус +25%', 'Участие в совете'],
    icon: Trophy
  },
  { 
    name: 'Platinum', 
    minScore: 20000, 
    color: 'bg-purple-500',
    benefits: ['Все привилегии Gold', 'Долевое участие в проекте', 'Бонус +50%', 'Право голоса в стратегии'],
    icon: BadgeCheck
  }
];

const stats = {
  totalResearchers: 156,
  totalArticles: 45280,
  verifiedByResearchers: 12850,
  totalRewardsPaid: '2.5M UNITY',
  activeInstitutions: 23
};

export default function Researchers() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleApply = () => {
    toast.success('Заявка отправлена! Мы свяжемся с вами в течение 3-5 рабочих дней.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <Badge className="bg-white/20 text-white mb-4">Научная программа</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                EthoLife Research Program
              </h1>
              <p className="text-xl text-emerald-100 max-w-2xl mb-6">
                Создаём крупнейшую децентрализованную библиотеку здоровья. 
                Присоединяйтесь к сообществу исследователей и получайте вознаграждение 
                за вклад в науку.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100" onClick={handleApply}>
                  <Users className="w-5 h-5 mr-2" />
                  Стать исследователем
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Building2 className="w-5 h-5 mr-2" />
                  Институциональное партнерство
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <p className="text-3xl font-bold">{stats.totalResearchers}</p>
                  <p className="text-sm text-emerald-100">Исследователей</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <p className="text-3xl font-bold">{stats.totalArticles.toLocaleString()}</p>
                  <p className="text-sm text-emerald-100">Статей в библиотеке</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <p className="text-3xl font-bold">{stats.totalRewardsPaid}</p>
                  <p className="text-sm text-emerald-100">Выплачено</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4">
                  <p className="text-3xl font-bold">{stats.activeInstitutions}</p>
                  <p className="text-sm text-emerald-100">Института-партнера</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="rewards">Вознаграждения</TabsTrigger>
            <TabsTrigger value="badges">Уровни</TabsTrigger>
            <TabsTrigger value="partners">Партнерство</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  Наша миссия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  EthoLife строит <strong>открытую децентрализованную библиотеку здоровья</strong>, 
                  где каждый научный факт верифицирован сообществом экспертов. 
                  Мы объединяем исследователей, врачей и институты для создания 
                  надежного источника знаний о здоровье.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Верификация</h4>
                    <p className="text-sm text-gray-600">
                      Каждая статья проверяется экспертами перед включением в рекомендации
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Открытость</h4>
                    <p className="text-sm text-gray-600">
                      Все данные доступны для исследований и проверки сообществом
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Вознаграждение</h4>
                    <p className="text-sm text-gray-600">
                      Fair compensation за вклад в науку через токены UNITY
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle>Как это работает</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { step: 1, title: 'Подайте заявку', desc: 'Заполните анкету с вашим опытом и квалификацией' },
                    { step: 2, title: 'Верификация', desc: 'Мы проверяем вашу квалификацию (1-5 дней)' },
                    { step: 3, title: 'Выберите задачи', desc: 'Доступны задачи по верификации, рецензированию, исследованиям' },
                    { step: 4, title: 'Получайте вознаграждение', desc: 'Выплаты в токенах UNITY еженедельно' }
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 font-bold flex items-center justify-center mx-auto mb-3">
                        {item.step}
                      </div>
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewardTasks.map((task) => (
                <Card key={task.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                        <task.icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">
                        <Wallet className="w-3 h-3 mr-1" />
                        {task.reward}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.time}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Требования:</p>
                      {task.requirements.map((req, idx) => (
                        <p key={idx} className="text-xs text-gray-600">• {req}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Система уровней</CardTitle>
                <CardDescription>
                  Накапливайте репутацию за качественный вклад и получайте привилегии
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badgeLevels.map((badge) => (
                    <div key={badge.name} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center text-white`}>
                        <badge.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{badge.name}</h4>
                          <Badge variant="outline">от {badge.minScore} очков</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {badge.benefits.map((benefit, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Институциональное партнерство</CardTitle>
                <CardDescription>
                  Университеты, исследовательские центры и больницы — присоединяйтесь к сети верифицированных институтов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Преимущества партнерства
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Доступ к базе из 45,000+ верифицированных статей',
                        'Инструменты для исследований и аналитики',
                        'Возможность публикации открытых данных',
                        'Гранты на исследования в области здоровья',
                        'Совместные публикации с EthoLife',
                        'Приоритетный доступ к новым данным'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      Финансирование
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">Ежегодный грант</p>
                        <p className="text-sm text-gray-600">До 500,000 UNITY на исследования</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">За верификацию данных</p>
                        <p className="text-sm text-gray-600">500-2000 UNITY за пакет статей</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="font-medium">За оригинальные исследования</p>
                        <p className="text-sm text-gray-600">До 10,000 UNITY + публикация</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" onClick={handleApply}>
                    <Mail className="w-4 h-4 mr-2" />
                    Подать заявку на партнерство
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Скачать презентацию
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">Свяжитесь с нами</h4>
                    <p className="text-sm text-gray-600">
                      Email: research@ethoslife.app | Telegram: @ethoslife_research
                    </p>
                  </div>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Написать
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
