import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ChevronLeft,
  Heart,
  Phone,
  MessageCircle,
  Calendar,
  Plus,
  TrendingUp,
  Bell,
  Gift,
  AlertCircle,
  Sparkles,
  PhoneCall,
  Video,
  Mail,
  Clock,
  Search,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { moduleColors } from '@/stores/healthStore';
import { useRelationshipsStore, Contact, PlannedInteraction } from '@/stores/modules/relationshipsStore';
import ContactCard from '@/components/health/ContactCard';
import InteractionLogger from '@/components/health/InteractionLogger';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const RELATIONSHIPS_COLOR = moduleColors.relationships.primary; // #ec4899
const RELATIONSHIPS_BG = moduleColors.relationships.bg;
const RELATIONSHIPS_SECONDARY = moduleColors.relationships.secondary;

export default function RelationshipsModule() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInteractionLogger, setShowInteractionLogger] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  const {
    contacts,
    interactions,
    plannedInteractions,
    aiInsights,
    initialize,
    getTodayReminders,
    getUpcomingBirthdays,
    getContactsNeedingAttention,
    getSocialBalance,
    getRecentInteractions,
    getRelationshipStreak,
    getAverageQuality,
    getUnreadInsights,
  } = useRelationshipsStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initialize();
      setIsLoading(false);
    };
    loadData();
  }, [initialize]);

  const todayReminders = getTodayReminders();
  const upcomingBirthdays = getUpcomingBirthdays(30);
  const needsAttention = getContactsNeedingAttention();
  const socialBalance = getSocialBalance(30);
  const recentInteractions = getRecentInteractions(5);
  const relationshipStreak = getRelationshipStreak();
  const averageQuality = getAverageQuality(7);
  const unreadInsights = getUnreadInsights();

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.relationship_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogInteraction = (contact: Contact) => {
    setSelectedContact(contact);
    setShowInteractionLogger(true);
  };

  const handleInteractionSaved = () => {
    setShowInteractionLogger(false);
    setSelectedContact(null);
    toast({
      title: 'Сохранено! 💕',
      description: 'Взаимодействие записано',
    });
  };

  if (isLoading) {
    return <RelationshipsSkeleton />;
  }

  // Prepare chart data
  const relationshipTypeData = contacts.reduce((acc, contact) => {
    const type = contact.relationship_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(relationshipTypeData).map(([type, count]) => ({
    name: getRelationshipTypeLabel(type),
    value: count,
    type,
  }));

  const energyData = Object.entries(socialBalance.byCategory).map(([type, data]) => ({
    name: getRelationshipTypeLabel(type),
    balance: data.balance,
    give: data.give,
    receive: data.receive,
  }));

  const COLORS = ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3', '#fdf2f8'];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#fafafa' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 text-white"
        style={{ backgroundColor: RELATIONSHIPS_COLOR }}
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setLocation('/health')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Отношения
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 relative"
              onClick={() => setSelectedTab('insights')}
            >
              <Bell className="w-5 h-5" />
              {unreadInsights.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-yellow-900 text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadInsights.length}
                </span>
              )}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="text-sm opacity-90 mb-1">Активных контактов</div>
              <div className="text-3xl font-bold">{contacts.length}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Серия</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                {relationshipStreak}
                <span className="text-lg">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск контактов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="balance">Баланс</TabsTrigger>
            <TabsTrigger value="insights">Инсайты</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Today's Reminders */}
            {(todayReminders.length > 0 || upcomingBirthdays.length > 0) && (
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5" style={{ color: RELATIONSHIPS_COLOR }} />
                  Сегодня
                </h3>
                <div className="space-y-3">
                  {todayReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onLog={() => reminder.contact && handleLogInteraction(reminder.contact)}
                    />
                  ))}
                  {upcomingBirthdays.slice(0, 2).map((contact) => (
                    <BirthdayCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </section>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Качество (7 дн)</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {averageQuality > 0 ? `${averageQuality}/10` : '—'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Энергия</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ 
                    color: socialBalance.balance >= 0 ? '#22c55e' : '#ef4444' 
                  }}>
                    {socialBalance.balance > 0 ? '+' : ''}{socialBalance.balance}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Needs Attention */}
            {needsAttention.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Требуют внимания
                </h3>
                <div className="space-y-3">
                  {needsAttention.slice(0, 3).map((contact) => (
                    <Card key={contact.id} className="border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-lg">👤</span>
                            </div>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-orange-600">
                                Не связаны {contact.days_since_contact} дней
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-300 text-orange-700"
                            onClick={() => handleLogInteraction(contact)}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Звонок
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Interactions */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                Недавние взаимодействия
              </h3>
              <div className="space-y-3">
                {recentInteractions.length > 0 ? (
                  recentInteractions.map((interaction) => (
                    <Card key={interaction.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: RELATIONSHIPS_BG }}
                          >
                            {getInteractionIcon(interaction.interaction_type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{interaction.contact?.name}</p>
                            <p className="text-sm text-gray-500">
                              {getInteractionLabel(interaction.interaction_type)} • {getTimeAgo(interaction.start_time)}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: getQualityColor(interaction.quality_rating),
                                color: 'white',
                              }}
                            >
                              {interaction.quality_rating}/10
                            </Badge>
                            {interaction.energy_change !== 0 && (
                              <p className={`text-xs mt-1 ${interaction.energy_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {interaction.energy_change > 0 ? '+' : ''}{interaction.energy_change} ⚡
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Нет записей</p>
                      <p className="text-sm">Запишите первое взаимодействие</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Все контакты</h3>
              <Button
                size="sm"
                style={{ backgroundColor: RELATIONSHIPS_COLOR }}
                onClick={() => setShowAddContact(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </Button>
            </div>
            
            <div className="space-y-3">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onLogInteraction={() => handleLogInteraction(contact)}
                    onViewDetails={() => setLocation(`/health/relationships/contact/${contact.id}`)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Контакты не найдены</p>
                    {searchQuery && (
                      <Button
                        variant="link"
                        onClick={() => setSearchQuery('')}
                        className="mt-2"
                      >
                        Очистить поиск
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Balance Tab */}
          <TabsContent value="balance" className="space-y-4 mt-4">
            {/* Energy Balance Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Баланс энергии
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-red-500">-{socialBalance.totalGive}</p>
                    <p className="text-xs text-gray-500">Отдаю</p>
                  </div>
                  <div className="text-2xl text-gray-300">⚖️</div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-green-500">+{socialBalance.totalReceive}</p>
                    <p className="text-xs text-gray-500">Получаю</p>
                  </div>
                </div>
                
                {socialBalance.balance < 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    ⚠️ Дисбаланс: вы отдаете больше энергии, чем получаете
                  </div>
                )}
                {socialBalance.balance > 5 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                    ✨ Отличный баланс! Отношения вас заряжают
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Relationship Distribution */}
            {pieChartData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Распределение контактов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          nameKey="name"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {pieChartData.map((entry, index) => (
                      <div key={entry.type} className="flex items-center gap-1 text-xs">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Energy by Category */}
            {energyData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Энергия по категориям</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={energyData}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="balance" fill={RELATIONSHIPS_COLOR} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Energy Drains/Sources */}
            {socialBalance.byContact.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">По контактам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {socialBalance.byContact.slice(0, 5).map((item) => (
                      <div key={item.contactId} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className={`font-bold ${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.balance > 0 ? '+' : ''}{item.balance}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4 mt-4">
            {aiInsights.length > 0 ? (
              aiInsights.map((insight) => (
                <Card
                  key={insight.id}
                  className={insight.is_read ? 'opacity-70' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: getInsightColor(insight.insight_type) }}
                      >
                        {getInsightIcon(insight.insight_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          {insight.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">Важно</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                        {insight.suggested_action && (
                          <p className="text-sm text-gray-500 mt-2">
                            💡 {insight.suggested_action}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Пока нет инсайтов</p>
                  <p className="text-sm">Продолжайте записывать взаимодействия</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Interaction Logger Modal */}
      <AnimatePresence>
        {showInteractionLogger && (
          <InteractionLogger
            contact={selectedContact}
            onSave={handleInteractionSaved}
            onCancel={() => {
              setShowInteractionLogger(false);
              setSelectedContact(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: RELATIONSHIPS_COLOR }}
        onClick={() => setShowInteractionLogger(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}

// Sub-components
function ReminderCard({ reminder, onLog }: { reminder: PlannedInteraction; onLog: () => void }) {
  return (
    <Card className="border-pink-200" style={{ backgroundColor: RELATIONSHIPS_BG }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Calendar className="w-5 h-5" style={{ color: RELATIONSHIPS_COLOR }} />
            </div>
            <div>
              <p className="font-medium">{reminder.contact?.name}</p>
              <p className="text-sm text-gray-600">
                {reminder.occasion || getPlannedTypeLabel(reminder.planned_type)}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            style={{ backgroundColor: RELATIONSHIPS_COLOR }}
            onClick={onLog}
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            Выполнено
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BirthdayCard({ contact }: { contact: Contact }) {
  const today = new Date();
  const birthday = new Date(contact.birthday!);
  const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  const isToday = thisYearBirthday.toDateString() === today.toDateString();
  
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center">
              <Gift className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-yellow-700">
                {isToday ? '🎉 Сегодня день рождения!' : `🎂 ${birthday.toLocaleDateString('ru-RU')}`}
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700">
            <MessageCircle className="w-4 h-4 mr-1" />
            Поздравить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Helper functions
function getRelationshipTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    family: 'Семья',
    partner: 'Партнер',
    friend: 'Друзья',
    colleague: 'Коллеги',
    mentor: 'Наставник',
    acquaintance: 'Знакомые',
    other: 'Другое',
  };
  return labels[type] || type;
}

function getInteractionIcon(type: InteractionType) {
  const props = { className: "w-5 h-5", style: { color: RELATIONSHIPS_COLOR } };
  switch (type) {
    case 'call': return <PhoneCall {...props} />;
    case 'video_call': return <Video {...props} />;
    case 'text_message': return <MessageCircle {...props} />;
    case 'email': return <Mail {...props} />;
    default: return <Users {...props} />;
  }
}

function getInteractionLabel(type: InteractionType): string {
  const labels: Record<InteractionType, string> = {
    call: 'Звонок',
    video_call: 'Видеозвонок',
    text_message: 'Сообщение',
    voice_message: 'Голосовое',
    in_person: 'Встреча',
    social_media: 'Соцсети',
    email: 'Письмо',
    letter: 'Письмо',
    other: 'Другое',
  };
  return labels[type];
}

function getPlannedTypeLabel(type: PlannedType): string {
  const labels: Record<PlannedType, string> = {
    call: 'Позвонить',
    meet: 'Встретиться',
    celebrate: 'Поздравить',
    gift: 'Подарок',
    support: 'Поддержать',
    other: 'Другое',
  };
  return labels[type];
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return 'вчера';
  return `${diffDays} дней назад`;
}

function getQualityColor(rating: number): string {
  if (rating >= 8) return '#22c55e';
  if (rating >= 6) return '#84cc16';
  if (rating >= 4) return '#eab308';
  return '#ef4444';
}

function getInsightColor(type: InsightType): string {
  switch (type) {
    case 'warning':
    case 'balance_alert':
      return '#fef2f2';
    case 'celebration':
      return '#f0fdf4';
    case 'recommendation':
      return '#eff6ff';
    default:
      return RELATIONSHIPS_BG;
  }
}

function getInsightIcon(type: InsightType) {
  const className = "w-5 h-5";
  switch (type) {
    case 'warning':
      return <AlertCircle className={className} style={{ color: '#ef4444' }} />;
    case 'celebration':
      return <Sparkles className={className} style={{ color: '#22c55e' }} />;
    case 'recommendation':
      return <TrendingUp className={className} style={{ color: '#3b82f6' }} />;
    default:
      return <Users className={className} style={{ color: RELATIONSHIPS_COLOR }} />;
  }
}

// Loading skeleton
function RelationshipsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-40" style={{ backgroundColor: RELATIONSHIPS_COLOR }} />
      <div className="max-w-lg mx-auto px-4 -mt-8 space-y-4">
        <Skeleton className="h-24" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </div>
  );
}
