import { useState, useEffect } from 'react';
import { 
  BookOpen, Search, ExternalLink, Download, 
  FileText, Beaker, Heart, Brain, Activity, Leaf,
  Star, Bookmark, Share2, Eye, CheckCircle2, AlertCircle,
  Loader2, Database, Filter, Plus, Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Verified research databases with working URLs
const verifiedDatabases = [
  {
    id: 'pubmed',
    name: 'PubMed / MEDLINE',
    description: 'Наибольшая база данных медицинских исследований от NCBI. Более 35 миллионов цитирований биомедицинской литературы.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    category: 'medical',
    papersCount: '35M+',
    isFree: true,
    verified: true,
    features: ['Поиск по МеШ терминам', 'Фильтры по дате', 'Бесплатный доступ к PMC'],
    apiAvailable: true,
    apiUrl: 'https://www.ncbi.nlm.nih.gov/home/develop/api/'
  },
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    description: 'Поисковая система для научной литературы всех дисциплин. Индексирует статьи, диссертации, книги.',
    url: 'https://scholar.google.com/',
    category: 'general',
    papersCount: '200M+',
    isFree: true,
    verified: true,
    features: ['Цитирования', 'Похожие статьи', 'Алерты на email'],
    apiAvailable: false
  },
  {
    id: 'pubmed-central',
    name: 'PubMed Central (PMC)',
    description: 'Бесплатный полнотекстовый архив биомедицинских и научных журнальных статей. 8+ миллионов статей.',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/',
    category: 'general',
    papersCount: '8M+',
    isFree: true,
    verified: true,
    features: ['Полнотекстовый доступ', 'Open Access', 'Архив NIH'],
    apiAvailable: true
  },
  {
    id: 'cochrane',
    name: 'Cochrane Library',
    description: 'Золотой стандарт систематических обзоров и мета-анализов в медицине. Высочайшее качество доказательств.',
    url: 'https://www.cochranelibrary.com/',
    category: 'medical',
    papersCount: '10K+ обзоров',
    isFree: false,
    verified: true,
    features: ['Систематические обзоры', 'Мета-анализы', 'Протоколы'],
    apiAvailable: false,
    note: 'Некоторые обзоры доступны бесплатно'
  },
  {
    id: 'clinicaltrials',
    name: 'ClinicalTrials.gov',
    description: 'Реестр клинических испытаний от NIH. 400,000+ исследований из 220 стран.',
    url: 'https://clinicaltrials.gov/',
    category: 'medical',
    papersCount: '400K+',
    isFree: true,
    verified: true,
    features: ['Поиск по болезням', 'Результаты исследований', 'API доступ'],
    apiAvailable: true,
    apiUrl: 'https://clinicaltrials.gov/data-api/api'
  },
  {
    id: 'who-iris',
    name: 'WHO IRIS',
    description: 'Институциональный репозиторий ВОЗ. Публикации, отчеты, рекомендации ВОЗ.',
    url: 'https://iris.who.int/',
    category: 'medical',
    papersCount: '100K+',
    isFree: true,
    verified: true,
    features: ['Рекомендации ВОЗ', 'Отчеты', 'Глобальная статистика'],
    apiAvailable: false
  },
  {
    id: 'usda-fooddata',
    name: 'USDA FoodData Central',
    description: 'Национальная база данных питательных веществ USDA. Подробная информация о 350,000+ продуктах.',
    url: 'https://fdc.nal.usda.gov/',
    category: 'nutrition',
    papersCount: '350K+',
    isFree: true,
    verified: true,
    features: ['API доступ', 'Полный состав', 'Порции'],
    apiAvailable: true,
    apiUrl: 'https://fdc.nal.usda.gov/api-guide.html'
  },
  {
    id: 'nutrition-reviews',
    name: 'Nutrition Reviews',
    description: 'Рецензируемый журнал с обзорами исследований в области питания. Высокий импакт-фактор.',
    url: 'https://academic.oup.com/nutritionreviews',
    category: 'nutrition',
    papersCount: '3K+',
    isFree: false,
    verified: true,
    features: ['Обзоры питания', 'Научные обоснования', 'PDF доступ'],
    apiAvailable: false
  },
  {
    id: 'bjsm',
    name: 'British Journal of Sports Medicine',
    description: 'Ведущий журнал по спортивной медицине. Импакт-фактор 18.4.',
    url: 'https://bjsm.bmj.com/',
    category: 'sports',
    papersCount: '15K+',
    isFree: false,
    verified: true,
    features: ['Open Access статьи', 'Руководства', 'Исследования'],
    apiAvailable: false,
    note: 'Некоторые статьи Open Access'
  },
  {
    id: 'pubmed-sports',
    name: 'PubMed - Sports Medicine',
    description: 'Фильтр PubMed по спортивной медицине и физической активности.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sports+medicine',
    category: 'sports',
    papersCount: '500K+',
    isFree: true,
    verified: true,
    features: ['Фильтр по спорту', 'Бесплатный доступ', 'Цитирования'],
    apiAvailable: true
  },
  {
    id: 'apa-psycnet',
    name: 'APA PsycNet',
    description: 'База данных психологических исследований от Американской психологической ассоциации.',
    url: 'https://psycnet.apa.org/',
    category: 'psychology',
    papersCount: '5M+',
    isFree: false,
    verified: true,
    features: ['PsycINFO', 'PsycARTICLES', 'PsycTESTS'],
    apiAvailable: false
  },
  {
    id: 'nimh',
    name: 'NIMH - National Institute of Mental Health',
    description: 'Исследования Национального института психического здоровья США.',
    url: 'https://www.nimh.nih.gov/research',
    category: 'psychology',
    papersCount: '50K+',
    isFree: true,
    verified: true,
    features: ['Депрессия', 'Тревога', 'PTSD', 'Биполярное расстройство'],
    apiAvailable: false
  },
  {
    id: 'sleep-journal',
    name: 'Sleep Journal',
    description: 'Официальный журнал Sleep Research Society. Ведущее издание по исследованиям сна.',
    url: 'https://academic.oup.com/sleep',
    category: 'sleep',
    papersCount: '12K+',
    isFree: false,
    verified: true,
    features: ['Исследования сна', 'Нарушения сна', 'Циркадные ритмы'],
    apiAvailable: false
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    description: 'Открытый архив электронных препринтов научных статей. Физика, математика, биология.',
    url: 'https://arxiv.org/',
    category: 'general',
    papersCount: '2M+',
    isFree: true,
    verified: true,
    features: ['Препринты', 'Бесплатный доступ', 'API'],
    apiAvailable: true,
    apiUrl: 'https://arxiv.org/help/api/index'
  },
  {
    id: 'ssrn',
    name: 'SSRN',
    description: 'Социальная научная исследовательская сеть. Препринты и ранние исследования.',
    url: 'https://www.ssrn.com/',
    category: 'general',
    papersCount: '1M+',
    isFree: true,
    verified: true,
    features: ['Рабочие материалы', 'Бесплатный доступ', 'Elsevier'],
    apiAvailable: false
  }
];

const categoryIcons: Record<string, React.ReactNode> = {
  medical: <Heart className="w-5 h-5" />,
  nutrition: <Leaf className="w-5 h-5" />,
  sports: <Activity className="w-5 h-5" />,
  psychology: <Brain className="w-5 h-5" />,
  sleep: <BookOpen className="w-5 h-5" />,
  general: <Beaker className="w-5 h-5" />
};

const categoryLabels: Record<string, string> = {
  medical: 'Медицина',
  nutrition: 'Питание',
  sports: 'Спорт',
  psychology: 'Психология',
  sleep: 'Сон',
  general: 'Общие'
};

interface UserLibraryItem {
  id: string;
  databaseId: string;
  title: string;
  url: string;
  notes?: string;
  addedAt: string;
  category: string;
}

export default function Library() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLibrary, setUserLibrary] = useState<UserLibraryItem[]>([]);
  const [selectedDb, setSelectedDb] = useState<typeof verifiedDatabases[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load user's library from localStorage or API
  useEffect(() => {
    const saved = localStorage.getItem('ethoslife-library');
    if (saved) {
      setUserLibrary(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ethoslife-library', JSON.stringify(userLibrary));
  }, [userLibrary]);

  const addToLibrary = (db: typeof verifiedDatabases[0]) => {
    const newItem: UserLibraryItem = {
      id: Date.now().toString(),
      databaseId: db.id,
      title: db.name,
      url: db.url,
      addedAt: new Date().toISOString(),
      category: db.category
    };
    
    setUserLibrary(prev => [...prev, newItem]);
    toast.success(`${db.name} добавлена в вашу библиотеку`);
  };

  const removeFromLibrary = (id: string) => {
    setUserLibrary(prev => prev.filter(item => item.id !== id));
    toast.success('Удалено из библиотеки');
  };

  const isInLibrary = (dbId: string) => {
    return userLibrary.some(item => item.databaseId === dbId);
  };

  const filteredDatabases = verifiedDatabases.filter(db => {
    const matchesSearch = db.name.toLowerCase().includes(search.toLowerCase()) ||
                         db.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || db.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openDatabase = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Научная библиотека
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl">
            Проверенные базы данных медицинских и научных исследований. 
            Все ссылки актуальны и проверены. Добавляйте к себе для быстрого доступа.
          </p>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>{verifiedDatabases.filter(d => d.verified).length} проверенных баз</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <Database className="w-5 h-5" />
              <span>250M+ статей</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="databases" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="databases" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Базы данных
            </TabsTrigger>
            <TabsTrigger value="my-library" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Моя библиотека
              {userLibrary.length > 0 && (
                <Badge variant="secondary" className="ml-1">{userLibrary.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="databases" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Поиск по названию или описанию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Все категории
              </Button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(key === selectedCategory ? null : key)}
                  className={selectedCategory === key ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {categoryIcons[key]}
                  <span className="ml-2">{label}</span>
                </Button>
              ))}
            </div>

            {/* Databases Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDatabases.map((db) => (
                <Card key={db.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                          {categoryIcons[db.category]}
                        </div>
                        <div>
                          <CardTitle className="text-base">{db.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {categoryLabels[db.category]}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {db.verified && (
                          <Badge className="bg-green-100 text-green-800" title="Ссылка проверена">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Проверено
                          </Badge>
                        )}
                        {db.isFree ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                            Free
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Paid</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {db.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {db.papersCount}
                      </span>
                      {db.apiAvailable && (
                        <Badge variant="outline" className="text-blue-600">
                          API
                        </Badge>
                      )}
                    </div>
                    {db.note && (
                      <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        {db.note}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openDatabase(db.url)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Открыть
                    </Button>
                    <Button
                      variant={isInLibrary(db.id) ? 'secondary' : 'default'}
                      onClick={() => isInLibrary(db.id) ? null : addToLibrary(db)}
                      disabled={isInLibrary(db.id)}
                      className={isInLibrary(db.id) ? '' : 'bg-emerald-600 hover:bg-emerald-700'}
                    >
                      {isInLibrary(db.id) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-library" className="space-y-6">
            {userLibrary.length === 0 ? (
              <Card className="p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ваша библиотека пуста
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Добавляйте базы данных для быстрого доступа
                </p>
                <Button onClick={() => document.querySelector('[data-value="databases"]')?.click()}>
                  Перейти к базам данных
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userLibrary.map((item) => {
                  const db = verifiedDatabases.find(d => d.id === item.databaseId);
                  return (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                              {categoryIcons[item.category]}
                            </div>
                            <div>
                              <CardTitle className="text-base">{item.title}</CardTitle>
                              <CardDescription className="text-xs">
                                {categoryLabels[item.category]}
                              </CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromLibrary(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-500 mb-2">
                          Добавлено: {new Date(item.addedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full"
                          onClick={() => openDatabase(item.url)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Открыть базу
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* API Integration Info */}
        <Card className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">API интеграция</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Некоторые базы данных предоставляют API для прямой интеграции. 
                  Мы работаем над автоматическим поиском и рекомендациями на основе вашего профиля.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">PubMed API</Badge>
                  <Badge variant="outline">ClinicalTrials API</Badge>
                  <Badge variant="outline">USDA FoodData API</Badge>
                  <Badge variant="outline">arXiv API</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
