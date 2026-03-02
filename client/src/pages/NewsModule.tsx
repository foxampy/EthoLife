/**
 * News Module - Новости и обновления платформы
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  User,
  Clock,
  TrendingUp,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
  Tag,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewsModule() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const news = [
    {
      id: 1,
      title: 'Запуск модуля Питание с полной интеграцией USDA',
      excerpt: 'Теперь вы можете отслеживать питание с нашей новой базой из 8000+ продуктов...',
      category: 'product',
      author: 'Команда EthoLife',
      date: '2026-03-02',
      readTime: '3 мин',
      image: '/news/nutrition-launch.jpg',
      tags: ['Питание', 'Обновление', 'База продуктов'],
      likes: 234,
      comments: 45,
      featured: true,
    },
    {
      id: 2,
      title: 'Добавлены групповые челленджи в модуле Привычки',
      excerpt: 'Соревнуйтесь с друзьями и зарабатывайте UNITY токены вместе...',
      category: 'feature',
      author: 'Команда EthoLife',
      date: '2026-03-01',
      readTime: '2 мин',
      image: '/news/challenges.jpg',
      tags: ['Привычки', 'Челленджи', 'Социальное'],
      likes: 189,
      comments: 32,
      featured: false,
    },
    {
      id: 3,
      title: 'Интеграция с Apple Health и Google Fit',
      excerpt: 'Синхронизируйте данные о активности автоматически...',
      category: 'integration',
      author: 'Команда EthoLife',
      date: '2026-02-28',
      readTime: '4 мин',
      image: '/news/integrations.jpg',
      tags: ['Интеграции', 'Apple Health', 'Google Fit'],
      likes: 456,
      comments: 78,
      featured: true,
    },
    {
      id: 4,
      title: 'UNITY токен: новая система вознаграждений',
      excerpt: 'Зарабатывайте токены за здоровые привычки и обменивайте на подписки...',
      category: 'tokenomics',
      author: 'Команда EthoLife',
      date: '2026-02-25',
      readTime: '5 мин',
      image: '/news/unity-token.jpg',
      tags: ['UNITY', 'Токены', 'Вознаграждения'],
      likes: 567,
      comments: 123,
      featured: true,
    },
    {
      id: 5,
      title: 'Модуль Сон: новые звуки и программы',
      excerpt: '50+ новых звуков для сна и медитаций от профессиональных инструкторов...',
      category: 'content',
      author: 'Команда EthoLife',
      date: '2026-02-20',
      readTime: '3 мин',
      image: '/news/sleep-sounds.jpg',
      tags: ['Сон', 'Медитации', 'Контент'],
      likes: 345,
      comments: 56,
      featured: false,
    },
  ];

  const categories = [
    { id: 'all', label: 'Все', count: 45 },
    { id: 'product', label: 'Продукт', count: 12 },
    { id: 'feature', label: 'Функции', count: 18 },
    { id: 'integration', label: 'Интеграции', count: 8 },
    { id: 'tokenomics', label: 'Токеномика', count: 5 },
    { id: 'content', label: 'Контент', count: 15 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Новости</h1>
                <p className="text-sm text-gray-500">Обновления платформы</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Фильтр
          </Button>
        </div>

        {/* Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                {cat.label}
                <Badge variant="outline" className="text-xs">
                  {cat.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-6">
              {/* Featured News */}
              {news.filter(n => n.featured).map((item) => (
                <FeaturedNewsCard key={item.id} news={item} />
              ))}

              {/* Regular News */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.filter(n => !n.featured).map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ============================================================================
# NEWS CARDS
# ============================================================================

function FeaturedNewsCard({ news }: any) {
  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="h-64 md:h-auto bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
          <Newspaper className="w-24 h-24 text-white/50" />
        </div>
        <CardContent className="p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-blue-500">Featured</Badge>
            <Badge variant="outline">{news.category}</Badge>
          </div>
          <h2 className="text-2xl font-bold mb-3">{news.title}</h2>
          <p className="text-gray-600 mb-4">{news.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{news.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{news.readTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {news.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                {news.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                {news.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
              </Button>
            </div>
            <Button>
              Читать
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function NewsCard({ news }: any) {
  return (
    <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        <Newspaper className="w-16 h-16 text-gray-400" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">{news.category}</Badge>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{news.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{news.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{news.readTime}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8">
              <Heart className="w-3 h-3 mr-1" />
              {news.likes}
            </Button>
            <Button variant="ghost" size="sm" className="h-8">
              <MessageCircle className="w-3 h-3 mr-1" />
              {news.comments}
            </Button>
          </div>
          <Button size="sm" variant="outline">
            Читать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Сегодня';
  if (days === 1) return 'Вчера';
  if (days < 7) return `${days} дн. назад`;
  if (days < 30) return `${Math.floor(days / 7)} нед. назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}
