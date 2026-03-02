import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import {
  Heart, Activity, Brain, Moon, Users, Star, Zap, Shield,
  ChevronRight, CheckCircle, ArrowRight, Play, Smartphone,
  Sparkles, Award, TrendingUp, Clock, Globe, Menu, X,
  ChevronLeft, Apple, Dumbbell, Smile, Stethoscope, Sprout, Gift,
  Target, Calendar, BarChart3, Lock, CheckCircle2, Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Types
interface OnboardingData {
  mood: number;
  goals: string[];
  challenges: string[];
  activity: string;
  sleep: string;
  name?: string;
  email?: string;
}

// Language selector component for landing
function LandingLanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    const newLang = locale === 'en' ? 'ru' : 'en';
    setLocale(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
    >
      <Globe className="w-4 h-4" />
      <span>{locale === 'en' ? 'EN' : 'RU'}</span>
    </button>
  );
}

// Header Component
function Header({ onStartClick }: { onStartClick: () => void }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Возможности', href: '#features' },
    { label: 'Модули', href: '#modules' },
    { label: 'Тарифы', href: '#pricing' },
    { label: 'Отзывы', href: '#testimonials' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Ethos<span className="text-emerald-500">Life</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium transition-colors hover:text-emerald-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LandingLanguageSwitcher />

            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 sm:px-4 shadow-lg"
                size="sm"
              >
                Дашборд
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className={isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}
                >
                  Войти
                </Button>
                <Button
                  size="sm"
                  onClick={onStartClick}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                >
                  Начать бесплатно
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2"
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-gray-700 hover:text-emerald-500"
                >
                  {item.label}
                </button>
              ))}
              <hr className="my-3" />
              {!user && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Войти
                  </Button>
                  <Button
                    onClick={onStartClick}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    Начать бесплатно
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Hero Section
function HeroSection({ onStartClick }: { onStartClick: () => void }) {
  const { t } = useI18n();
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-teal-400 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Bonus Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium mb-8 shadow-lg"
        >
          <Gift className="w-4 h-4" />
          <span>Первым 100 пользователям — персональная программа в подарок!</span>
          <span className="font-bold tabular-nums">
            {String(countdown.hours).padStart(2, '0')}:
            {String(countdown.minutes).padStart(2, '0')}:
            {String(countdown.seconds).padStart(2, '0')}
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Ваша экосистема
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                здоровья и долголетия
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
              7 модулей здоровья, AI-планировщик и команда специалистов для достижения ваших целей. Начните бесплатно за 2 минуты.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={onStartClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
              >
                Начать бесплатно
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                Смотреть демо
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Бесплатный старт</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Карта не требуется</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Отмена в любой момент</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - App Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop"
                alt="EthosLife Dashboard"
                className="w-full h-[400px] sm:h-[500px] object-cover opacity-80"
              />
              {/* Floating Cards */}
              <motion.div
                className="absolute -left-4 sm:-left-6 top-1/4 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Шаги сегодня</p>
                    <p className="text-xl font-bold text-gray-900">8,432</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-4 sm:-right-6 bottom-1/3 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Настроение</p>
                    <p className="text-xl font-bold text-gray-900">Отличное!</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Social Proof Section
function SocialProofSection() {
  const stats = [
    { value: '100K+', label: 'Пользователей' },
    { value: '4.9', label: 'Рейтинг в App Store' },
    { value: '500+', label: 'Специалистов' },
    { value: '95%', label: 'Довольных клиентов' },
  ];

  return (
    <section className="py-16 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-emerald-500">{stat.value}</p>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Problem Section
function ProblemSection() {
  const problems = [
    { icon: '📱', text: 'Разрозненные приложения' },
    { icon: '🔌', text: 'Нет связи между аспектами здоровья' },
    { icon: '🤖', text: 'Сложные AI без понимания контекста' },
    { icon: '💰', text: 'Дорогие специалисты без системы' },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Знакомые проблемы?
          </h2>
          <p className="text-xl text-gray-600">Мы создали решение, которое объединяет всё</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm text-center"
            >
              <div className="text-4xl mb-3">{problem.icon}</div>
              <p className="text-gray-700">{problem.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            EthoLife — первая целостная экосистема здоровья
          </h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            7 взаимосвязанных модулей, AI-планировщик и доступ к специалистам в одном приложении
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Features Grid (7 Modules)
function FeaturesGrid() {
  const modules = [
    { icon: Apple, color: 'bg-green-500', title: 'Питание', desc: 'Калории, макросы, вода, персональные планы' },
    { icon: Dumbbell, color: 'bg-blue-500', title: 'Движение', desc: 'Тренировки, шаги, активность, прогресс' },
    { icon: Moon, color: 'bg-purple-500', title: 'Сон', desc: 'Фазы сна, качество, восстановление' },
    { icon: Smile, color: 'bg-pink-500', title: 'Психология', desc: 'Настроение, стресс, медитации' },
    { icon: Stethoscope, color: 'bg-red-500', title: 'Медицина', desc: 'Анализы, приемы, медикаменты' },
    { icon: Users, color: 'bg-orange-500', title: 'Отношения', desc: 'Социальные связи, общение' },
    { icon: Sprout, color: 'bg-teal-500', title: 'Привычки', desc: 'Трекер привычек, цели, streaks' },
  ];

  return (
    <section id="modules" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            7 модулей здоровья
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Каждый модуль собирает данные, анализирует и дает персональные рекомендации
          </p>
        </div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex-shrink-0 w-[280px] md:w-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer snap-start"
            >
              <div className={`w-14 h-14 rounded-2xl ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <module.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600">{module.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      icon: Target,
      title: 'Определите цели',
      desc: 'Пройдите 5-минутный онбординг и получите персональную программу',
      color: 'bg-blue-500',
    },
    {
      icon: BarChart3,
      title: 'Отслеживайте прогресс',
      desc: 'Вносите данные в модули здоровья и наблюдайте за улучшениями',
      color: 'bg-emerald-500',
    },
    {
      icon: Award,
      title: 'Достигайте результатов',
      desc: 'AI анализирует данные и корректирует план для максимального эффекта',
      color: 'bg-purple-500',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Как это работает
          </h2>
          <p className="text-xl text-gray-600">Три простых шага к здоровью</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className="text-center p-8 h-full">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection({ onStartClick }: { onStartClick: () => void }) {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Базовый',
      price: annual ? '0' : '0',
      period: 'навсегда',
      description: 'Для знакомства с экосистемой',
      features: [
        '1 модуль здоровья',
        'Базовая статистика',
        'AI-чат ограничено',
      ],
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      name: 'Премиум',
      price: annual ? '490' : '690',
      period: 'в месяц',
      description: 'Полный доступ ко всем функциям',
      features: [
        'Все 7 модулей здоровья',
        'AI-планировщик',
        'Персональные рекомендации',
        'Приоритетная поддержка',
        'Ранний доступ к функциям',
      ],
      cta: 'Попробовать 7 дней бесплатно',
      popular: true,
    },
    {
      name: 'Семейный',
      price: annual ? '890' : '1190',
      period: 'в месяц',
      description: 'Для всей семьи',
      features: [
        'Всё из Премиум',
        'До 5 аккаунтов',
        'Семейные цели',
        'Совместные челленджи',
        'Семейная статистика',
      ],
      cta: 'Начать семейный доступ',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Простые тарифы
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Начните бесплатно, платите за расширенные функции
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Ежемесячно
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                annual ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  annual ? 'left-8' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Ежегодно <span className="text-emerald-500 font-bold">-30%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${
                plan.popular ? 'border-emerald-500 border-2 shadow-xl' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white px-4 py-1">
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">₽{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={onStartClick}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Анна, 34 года',
      role: 'Предприниматель',
      content: 'За 3 месяца я наконец-то наладила сон и питание. AI-планировщик реально работает!',
      avatar: '👩',
    },
    {
      name: 'Михаил, 42 года',
      role: 'IT-директор',
      content: 'Наконец-то все модули здоровья в одном месте. Экономлю кучу времени на анализах.',
      avatar: '👨',
    },
    {
      name: 'Елена, 28 лет',
      role: 'Фитнес-тренер',
      content: 'Использую для клиентов. Видно прогресс по всем аспектам здоровья. Супер!',
      avatar: '👩‍🦰',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Отзывы пользователей
          </h2>
          <p className="text-xl text-gray-600">Истории тех, кто уже изменил свою жизнь</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section with Offer
function CTASection({ onStartClick }: { onStartClick: () => void }) {
  const [bonusesLeft, setBonusesLeft] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setBonusesLeft((prev) => (prev > 3 ? prev - 1 : prev));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
            <Gift className="w-4 h-4" />
            <span>Ограниченное предложение</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Начните путь к здоровью сегодня
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Первые 100 пользователей получают персональную программу и 7 дней Премиум бесплатно
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Включено в бесплатный старт:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Доступ к 1 модулю здоровья</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Базовая статистика и трекинг</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>AI-чат для консультаций</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Персональная программа на неделю</span>
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={onStartClick}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
          >
            Начать бесплатно
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Осталось бонусных мест:</p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${bonusesLeft}%` }}
              />
            </div>
            <p className="text-sm font-bold text-gray-900 mt-2">
              {bonusesLeft} из 100
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold">Ethos<span className="text-emerald-500">Life</span></span>
            </div>
            <p className="text-gray-400 text-sm">
              Экосистема здоровья и долголетия
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Продукт</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Тарифы</button></li>
              <li><button onClick={() => navigate('/features')} className="hover:text-white">Возможности</button></li>
              <li><button onClick={() => navigate('/roadmap')} className="hover:text-white">Дорожная карта</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Компания</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/about')} className="hover:text-white">О нас</button></li>
              <li><button onClick={() => navigate('/contact')} className="hover:text-white">Контакты</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:text-white">Приватность</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Поддержка</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => navigate('/help')} className="hover:text-white">Помощь</button></li>
              <li><button onClick={() => navigate('/faq')} className="hover:text-white">FAQ</button></li>
              <li><button onClick={() => navigate('/support')} className="hover:text-white">Support</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 EthoLife. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}

// 5-Step Onboarding Flow
function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mood: 3,
    goals: [],
    challenges: [],
    activity: 'moderate',
    sleep: '7-8',
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Step 1: Current Mood
  const MoodStep = () => (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Как вы себя чувствуете сегодня?
      </h2>
      <p className="text-gray-600 mb-8">Это поможет нам понять вашу текущую форму</p>

      <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
        {[1, 2, 3, 4, 5].map((mood) => (
          <button
            key={mood}
            onClick={() => {
              setData({ ...data, mood });
              setTimeout(handleNext, 300);
            }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-3xl transition-all hover:scale-110 ${
              data.mood === mood ? 'bg-emerald-500 shadow-lg scale-110' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {mood === 1 && '😞'}
            {mood === 2 && '😕'}
            {mood === 3 && '😐'}
            {mood === 4 && '🙂'}
            {mood === 5 && '🤩'}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-500 mt-4 px-4">
        <span>Ужасно</span>
        <span>Отлично</span>
      </div>
    </div>
  );

  // Step 2: Goals
  const GoalsStep = () => {
    const goals = [
      { id: 'weight', label: 'Вес', icon: '⚖️' },
      { id: 'energy', label: 'Энергия', icon: '⚡' },
      { id: 'sleep', label: 'Сон', icon: '😴' },
      { id: 'stress', label: 'Стресс', icon: '🧘' },
      { id: 'fitness', label: 'Фитнес', icon: '💪' },
      { id: 'nutrition', label: 'Питание', icon: '🥗' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Какие цели для вас приоритетны?
        </h2>
        <p className="text-gray-600 mb-8">Выберите 1-3 цели</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                const newGoals = data.goals.includes(goal.id)
                  ? data.goals.filter((g) => g !== goal.id)
                  : [...data.goals, goal.id];
                setData({ ...data, goals: newGoals });
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.goals.includes(goal.id)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <p className="font-medium text-gray-900 mt-1 text-sm">{goal.label}</p>
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={data.goals.length === 0}
          className="mt-8 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
        >
          Далее
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  };

  // Step 3: Activity Level
  const ActivityStep = () => {
    const activities = [
      { id: 'sedentary', label: 'Сидячий', desc: 'Мало движения', icon: '🪑' },
      { id: 'light', label: 'Легкий', desc: 'Прогулки 1-2 раза в неделю', icon: '🚶' },
      { id: 'moderate', label: 'Умеренный', desc: 'Тренировки 3-4 раза в неделю', icon: '🏃' },
      { id: 'active', label: 'Активный', desc: 'Спорт 5+ раз в неделю', icon: '💪' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Ваш уровень активности?
        </h2>
        <p className="text-gray-600 mb-8">Честно — это поможет создать реалистичный план</p>

        <div className="space-y-3 max-w-md mx-auto">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => {
                setData({ ...data, activity: activity.id });
                setTimeout(handleNext, 300);
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                data.activity === activity.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl">{activity.icon}</span>
              <div className="text-left">
                <p className="font-medium text-gray-900">{activity.label}</p>
                <p className="text-sm text-gray-500">{activity.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Step 4: Sleep
  const SleepStep = () => {
    const sleepOptions = [
      { id: 'less-5', label: '< 5 часов', hours: '< 5' },
      { id: '5-6', label: '5-6 часов', hours: '5-6' },
      { id: '7-8', label: '7-8 часов', hours: '7-8' },
      { id: 'more-8', label: '8+ часов', hours: '8+' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Сколько вы спите?
        </h2>
        <p className="text-gray-600 mb-8">Сон — основа здоровья</p>

        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {sleepOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setData({ ...data, sleep: option.id });
                setTimeout(handleNext, 300);
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                data.sleep === option.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className={`w-8 h-8 mx-auto mb-2 ${
                data.sleep === option.id ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <p className="font-medium text-gray-900">{option.hours}</p>
              <p className="text-sm text-gray-500">{option.label}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Step 5: Personal Plan Preview
  const PlanStep = () => (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-6"
      >
        <Sparkles className="w-10 h-10" />
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Ваша персональная программа готова!
      </h2>
      <p className="text-gray-600 mb-8">Мы создали план на основе ваших ответов</p>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 max-w-md mx-auto text-left mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Что вас ждет:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Персональные рекомендации по питанию</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">План тренировок под ваш уровень</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Программа улучшения сна</span>
          </li>
        </ul>

        <div className="mt-6 pt-6 border-t border-emerald-200">
          <p className="text-sm text-gray-600 mb-2">💡 AI-совет:</p>
          <p className="text-emerald-800 font-medium">
            Начните с малого — первые 7 дней фокусируемся на {data.goals[0] || 'целях'}
          </p>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleNext}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25 w-full sm:w-auto"
      >
        Активировать программу
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      <p className="text-sm text-gray-500 mt-4">
        Это займет 2 минуты
      </p>
    </div>
  );

  const steps = [
    <MoodStep key="mood" />,
    <GoalsStep key="goals" />,
    <ActivityStep key="activity" />,
    <SleepStep key="sleep" />,
    <PlanStep key="plan" />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Шаг {step + 1} из {totalSteps}</span>
            <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-12"
        >
          {steps[step]}
        </motion.div>

        {/* Back Button */}
        {step > 0 && (
          <button
            onClick={handleBack}
            className="mt-6 text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </button>
        )}
      </div>
    </div>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const [, navigate] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const startOnboarding = () => {
    setShowOnboarding(true);
    window.scrollTo(0, 0);
  };

  const completeOnboarding = () => {
    navigate('/register?from=onboarding');
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onStartClick={startOnboarding} />
      <HeroSection onStartClick={startOnboarding} />
      <SocialProofSection />
      <ProblemSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection onStartClick={startOnboarding} />
      <CTASection onStartClick={startOnboarding} />
      <Footer />
    </div>
  );
}
