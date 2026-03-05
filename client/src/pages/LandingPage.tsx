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
import { Footer as NewFooter } from '@/components/Footer';

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Ethos<span className="text-emerald-500">Life</span>
            </span>
          </motion.div>

          {/* Right Side - only language switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LandingLanguageSwitcher />
          </div>
        </div>
      </div>
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
          <span>First 100 users get a personal program FREE!</span>
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
              Your Health &
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Longevity Ecosystem
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl">
              7 health modules, AI planner, and a team of specialists to achieve your goals. Start free in 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={onStartClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
              >
                Start Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Special Offer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-white/20 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm mb-1">
                    🎁 6+6 Months Premium
                  </h3>
                  <ul className="text-xs text-white/90 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>6 months + 6 free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Specialist consultation for each module</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Lifetime PRO status</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span className="font-bold">"Be First" achievement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
                    <p className="text-xs text-gray-500">Steps today</p>
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
                    <p className="text-xs text-gray-500">Mood</p>
                    <p className="text-xl font-bold text-gray-900">Excellent!</p>
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

// Problem Section
function ProblemSection() {
  const problems = [
    { icon: '📱', text: 'Fragmented apps' },
    { icon: '🔌', text: 'No connection between health aspects' },
    { icon: '🤖', text: 'Complex AI without context' },
    { icon: '💰', text: 'Expensive specialists without system' },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sound familiar?
          </h2>
          <p className="text-xl text-gray-600">We created a solution that unites everything</p>
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
            EthoLife — the first holistic health ecosystem
          </h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            7 interconnected modules, AI planner, and access to specialists in one app
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Features Grid (7 Modules)
function FeaturesGrid() {
  const modules = [
    { icon: Apple, color: 'bg-green-500', title: 'Nutrition', desc: 'Calories, macros, water, personal plans' },
    { icon: Dumbbell, color: 'bg-blue-500', title: 'Movement', desc: 'Workouts, steps, activity, progress' },
    { icon: Moon, color: 'bg-purple-500', title: 'Sleep', desc: 'Sleep phases, quality, recovery' },
    { icon: Smile, color: 'bg-pink-500', title: 'Psychology', desc: 'Mood, stress, meditation' },
    { icon: Stethoscope, color: 'bg-red-500', title: 'Medicine', desc: 'Tests, appointments, medications' },
    { icon: Users, color: 'bg-orange-500', title: 'Relationships', desc: 'Social connections, communication' },
    { icon: Sprout, color: 'bg-teal-500', title: 'Habits', desc: 'Habit tracker, goals, streaks' },
  ];

  return (
    <section id="modules" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            7 Health Modules
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Each module collects data, analyzes it, and provides personalized recommendations
          </p>
        </div>

        {/* Mobile: compact horizontal scroll, Desktop: grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer"
            >
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${module.color} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                <module.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{module.title}</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{module.desc}</p>
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
      title: 'Set Your Goals',
      desc: 'Take a 5-minute onboarding and get a personalized program',
      color: 'bg-blue-500',
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      desc: 'Enter data in health modules and watch your improvements',
      color: 'bg-emerald-500',
    },
    {
      icon: Award,
      title: 'Achieve Results',
      desc: 'AI analyzes data and adjusts the plan for maximum effect',
      color: 'bg-purple-500',
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">Three simple steps to health</p>
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

// Staking & Annual Benefits Section
function StakingSection({ onStartClick }: { onStartClick: () => void }) {
  const { t, locale } = useI18n();

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            UNITY Token Rewards
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn tokens for healthy habits and stake them for additional rewards
          </p>
        </div>

        {/* Staking Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Token Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">U</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">UNITY Token</h3>
                <p className="text-gray-500">Utility token for the ecosystem</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                <p className="text-lg font-bold text-gray-900">1 USD = 20 UNITY</p>
              </div>
              <p className="text-gray-600">
                Minimum purchase: 500 UNITY ($25)
              </p>
            </div>
          </motion.div>

          {/* Annual Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-xl text-white"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Annual Benefits</h3>
                <p className="text-emerald-100">Exclusive rewards for holders</p>
              </div>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="font-bold text-yellow-300">15% Discount</p>
                  <p className="text-emerald-100 text-sm">On all subscriptions</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="font-bold text-yellow-300">Free Sessions</p>
                  <p className="text-emerald-100 text-sm">With specialists every month</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onStartClick}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
          >
            Learn More
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection({ onStartClick }: { onStartClick: () => void }) {
  const { t, locale } = useI18n();
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'To get started',
      features: [
        '1 health module',
        'Basic statistics',
        'Limited AI chat',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Premium',
      price: annual ? '19' : '29',
      period: 'per month',
      description: 'Full access to all features',
      features: [
        'All 7 health modules',
        'AI planner',
        'Personal recommendations',
        'Priority support',
        'Early access to features',
      ],
      cta: 'Try 7 days free',
      popular: true,
    },
    {
      name: 'Family',
      price: annual ? '39' : '49',
      period: 'per month',
      description: 'For the whole family',
      features: [
        'Everything from Premium',
        'Up to 5 accounts',
        'Family goals',
        'Joint challenges',
        'Family statistics',
      ],
      cta: 'Start Family Access',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start free, pay for advanced features
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
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
              Annually <span className="text-emerald-500 font-bold">
                {annual ? '-35%' : ''}
              </span>
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
                      Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  {annual && plan.price !== '0' && (
                    <p className="text-sm text-emerald-600 mb-4">
                      Billed annually
                    </p>
                  )}
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
            <span>Limited time offer</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start your health journey today
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            First 100 users get a personal program and 7 days Premium FREE
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4">Free start includes:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Access to 1 health module</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Basic statistics and tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>AI chat for consultations</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Personal weekly program</span>
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={onStartClick}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
          >
            Start Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Bonus spots remaining:</p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${bonusesLeft}%` }}
              />
            </div>
            <p className="text-sm font-bold text-gray-900 mt-2">
              {bonusesLeft} of 100
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return <NewFooter />;
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
        How are you feeling today?
      </h2>
      <p className="text-gray-600 mb-8">This helps us understand your current state</p>

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
        <span>Terrible</span>
        <span>Excellent</span>
      </div>
    </div>
  );

  // Step 2: Goals
  const GoalsStep = () => {
    const goals = [
      { id: 'weight', label: 'Weight', icon: '⚖️' },
      { id: 'energy', label: 'Energy', icon: '⚡' },
      { id: 'sleep', label: 'Sleep', icon: '😴' },
      { id: 'stress', label: 'Stress', icon: '🧘' },
      { id: 'fitness', label: 'Fitness', icon: '💪' },
      { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          What goals are priorities for you?
        </h2>
        <p className="text-gray-600 mb-8">Choose 1-3 goals</p>

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
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  };

  // Step 3: Activity Level
  const ActivityStep = () => {
    const activities = [
      { id: 'sedentary', label: 'Sedentary', desc: 'Little movement', icon: '🪑' },
      { id: 'light', label: 'Light', desc: 'Walks 1-2 times a week', icon: '🚶' },
      { id: 'moderate', label: 'Moderate', desc: 'Exercise 3-4 times a week', icon: '🏃' },
      { id: 'active', label: 'Active', desc: 'Sports 5+ times a week', icon: '💪' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          What is your activity level?
        </h2>
        <p className="text-gray-600 mb-8">Be honest — this helps create a realistic plan</p>

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
      { id: 'less-5', label: '< 5 hours', hours: '< 5' },
      { id: '5-6', label: '5-6 hours', hours: '5-6' },
      { id: '7-8', label: '7-8 hours', hours: '7-8' },
      { id: 'more-8', label: '8+ hours', hours: '8+' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          How much do you sleep?
        </h2>
        <p className="text-gray-600 mb-8">Sleep is the foundation of health</p>

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
        Your personal program is ready!
      </h2>
      <p className="text-gray-600 mb-8">We created a plan based on your answers</p>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 max-w-md mx-auto text-left mb-8">
        <h3 className="font-bold text-gray-900 mb-4">What awaits you:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Personalized nutrition recommendations</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Workout plan for your level</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Sleep improvement program</span>
          </li>
        </ul>

        <div className="mt-6 pt-6 border-t border-emerald-200">
          <p className="text-sm text-gray-600 mb-2">💡 AI Tip:</p>
          <p className="text-emerald-800 font-medium">
            Start small — first 7 days we focus on {data.goals[0] || 'your goals'}
          </p>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleNext}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25 w-full sm:w-auto"
      >
        Activate Program
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      <p className="text-sm text-gray-500 mt-4">
        This takes 2 minutes
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
            <span>Step {step + 1} of {totalSteps}</span>
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
            Back
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
      <ProblemSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <StakingSection onStartClick={startOnboarding} />
      <PricingSection onStartClick={startOnboarding} />
      <CTASection onStartClick={startOnboarding} />
      <Footer />
    </div>
  );
}
