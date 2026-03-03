import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import {
  Bell,
  Plus,
  Check,
  Trash2,
  Settings,
  Clock,
  Calendar,
  Pill,
  Droplets,
  Heart,
  Brain,
  Dumbbell,
  Moon,
  Apple,
  Send,
  Smartphone,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'water' | 'habit' | 'appointment' | 'exercise' | 'sleep';
  time: string;
  enabled: boolean;
  completed?: boolean;
  recurring: boolean;
  days?: string[];
}

export default function DailyAssistant() {
  const { t, locale } = useI18n();

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: locale === 'en' ? 'Morning Medication' : 'Утренние лекарства',
      type: 'medication',
      time: '08:00',
      enabled: true,
      completed: false,
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    {
      id: '2',
      title: locale === 'en' ? 'Drink Water' : 'Выпить воды',
      type: 'water',
      time: '09:00',
      enabled: true,
      completed: false,
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: '3',
      title: locale === 'en' ? 'Evening Walk' : 'Вечерняя прогулка',
      type: 'exercise',
      time: '19:00',
      enabled: true,
      completed: false,
      recurring: true,
      days: ['Mon', 'Wed', 'Fri'],
    },
    {
      id: '4',
      title: locale === 'en' ? 'Bedtime Routine' : 'Время сна',
      type: 'sleep',
      time: '22:30',
      enabled: true,
      completed: false,
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return Pill;
      case 'water': return Droplets;
      case 'habit': return Heart;
      case 'appointment': return Calendar;
      case 'exercise': return Dumbbell;
      case 'sleep': return Moon;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'text-red-500 bg-red-50';
      case 'water': return 'text-blue-500 bg-blue-50';
      case 'habit': return 'text-emerald-500 bg-emerald-50';
      case 'appointment': return 'text-purple-500 bg-purple-50';
      case 'exercise': return 'text-orange-500 bg-orange-50';
      case 'sleep': return 'text-indigo-500 bg-indigo-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const completeReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const completedCount = reminders.filter(r => r.completed).length;
  const totalCount = reminders.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="font-medium">
                  {locale === 'en' ? 'Daily Assistant' : 'Ежедневный Ассистент'}
                </span>
              </button>
            </Link>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {locale === 'en' ? "Today's Progress" : 'Прогресс за сегодня'}
                </h2>
                <p className="text-sm text-gray-500">
                  {locale === 'en'
                    ? `${completedCount} of ${totalCount} reminders completed`
                    : `${completedCount} из ${totalCount} напоминаний выполнено`
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Telegram Integration */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {locale === 'en' ? 'Telegram Notifications' : 'Telegram Уведомления'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {locale === 'en'
                        ? 'Get reminders in Telegram'
                        : 'Получайте напоминания в Telegram'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTelegramConnected(!telegramConnected)}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-gray-600">
                    {telegramConnected
                      ? (locale === 'en' ? 'Connected' : 'Подключено')
                      : (locale === 'en' ? 'Connect' : 'Подключить')
                    }
                  </span>
                  {telegramConnected ? (
                    <ToggleRight className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </div>
              {telegramConnected && (
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {locale === 'en'
                        ? '@EthosLifeBot connected to your account'
                        : '@EthosLifeBot подключен к вашему аккаунту'
                      }
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reminders List */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {locale === 'en' ? 'Reminders' : 'Напоминания'}
            </h2>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              {locale === 'en' ? 'Add' : 'Добавить'}
            </Button>
          </div>

          <div className="space-y-3">
            {reminders.map((reminder) => {
              const Icon = getTypeIcon(reminder.type);
              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className={cn(
                    'transition-all',
                    reminder.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center',
                          getTypeColor(reminder.type)
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            'font-semibold text-gray-900 truncate',
                            reminder.completed && 'line-through text-gray-500'
                          )}>
                            {reminder.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{reminder.time}</span>
                            </div>
                            {reminder.recurring && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>{reminder.days?.length}x/week</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => completeReminder(reminder.id)}
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                              reminder.completed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-emerald-100'
                            )}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-blue-100 transition-colors"
                          >
                            {reminder.enabled ? (
                              <Bell className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {locale === 'en' ? 'New Reminder' : 'Новое напоминание'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Title' : 'Название'}
                </label>
                <Input placeholder={locale === 'en' ? 'Enter title' : 'Введите название'} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Type' : 'Тип'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'medication', icon: Pill, label: locale === 'en' ? 'Meds' : 'Лекарства' },
                    { value: 'water', icon: Droplets, label: locale === 'en' ? 'Water' : 'Вода' },
                    { value: 'exercise', icon: Dumbbell, label: locale === 'en' ? 'Exercise' : 'Спорт' },
                    { value: 'habit', icon: Heart, label: locale === 'en' ? 'Habit' : 'Привычка' },
                    { value: 'appointment', icon: Calendar, label: locale === 'en' ? 'Appt' : 'Встреча' },
                    { value: 'sleep', icon: Moon, label: locale === 'en' ? 'Sleep' : 'Сон' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                    >
                      <type.icon className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-600">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Time' : 'Время'}
                </label>
                <Input type="time" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {locale === 'en' ? 'Repeat' : 'Повторять'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {locale === 'en' ? 'Daily reminder' : 'Ежедневное напоминание'}
                  </p>
                </div>
                <Switch />
              </div>

              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowAddModal(false)}
              >
                {locale === 'en' ? 'Create Reminder' : 'Создать напоминание'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
