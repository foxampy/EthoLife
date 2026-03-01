import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import {
  Heart, Activity, Brain, Moon, Users, Star, Zap, Shield,
  ChevronRight, CheckCircle, ArrowRight, Play, Smartphone,
  Sparkles, Award, TrendingUp, Clock, Globe, Menu, X,
  ChevronLeft, Apple, Dumbbell, Smile, Stethoscope, Sprout, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Types
interface OnboardingData {
  mood: number;
  goals: string[];
  challenges: string[];
  activity: string;
  sleep: string;
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
    { label: t('landing.nav.features'), href: '#features' },
    { label: t('landing.nav.modules'), href: '#modules' },
    { label: t('landing.nav.pricing'), href: '#pricing' },
    { label: t('landing.nav.specialists'), href: '#specialists' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
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
          <div className="flex items-center gap-3">
            <LandingLanguageSwitcher />
            
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {t('landing.nav.dashboard')}
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className={isScrolled ? 'text-gray-700' : 'text-white'}
                >
                  {t('landing.nav.login')}
                </Button>
                <Button
                  onClick={onStartClick}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {t('landing.cta.startFree')}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
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
            className="md:hidden bg-white border-t"
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
              <hr />
              {!user && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    {t('landing.nav.login')}
                  </Button>
                  <Button
                    onClick={onStartClick}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                  >
                    {t('landing.cta.startFree')}
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Bonus Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium mb-8"
        >
          <Gift className="w-4 h-4" />
          <span>{t('landing.bonus.title')}</span>
          <span className="font-bold">
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
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {t('landing.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                {t('landing.hero.subtitle')}
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              {t('landing.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={onStartClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
              >
                {t('landing.cta.startFree')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                <Play className="mr-2 w-5 h-5" />
                {t('landing.cta.watchDemo')}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{t('landing.trust.freeStart')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{t('landing.trust.noCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{t('landing.trust.cancelAnytime')}</span>
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/dashboard-preview.jpg"
                alt="EthosLife Dashboard"
                className="w-full"
              />
              {/* Floating Cards */}
              <motion.div
                className="absolute -left-6 top-1/4 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('landing.preview.steps')}</p>
                    <p className="text-xl font-bold text-gray-900">8,432</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-6 bottom-1/3 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('landing.preview.mood')}</p>
                    <p className="text-xl font-bold text-gray-900">{t('landing.preview.great')}</p>
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
  const { t } = useI18n();

  const stats = [
    { value: '100K+', label: t('landing.stats.users') },
    { value: '4.9', label: t('landing.stats.rating') },
    { value: '500+', label: t('landing.stats.specialists') },
    { value: '95%', label: t('landing.stats.satisfaction') },
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
  const { t } = useI18n();

  const problems = [
    { icon: '📱', text: t('landing.problems.apps') },
    { icon: '🔌', text: t('landing.problems.disconnected') },
    { icon: '🤖', text: t('landing.problems.ai') },
    { icon: '💰', text: t('landing.problems.expensive') },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.problem.title')}
          </h2>
          <p className="text-xl text-gray-600">{t('landing.problem.subtitle')}</p>
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
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {t('landing.solution.title')}
          </h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            {t('landing.solution.description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Features Grid (7 Modules)
function FeaturesGrid() {
  const { t } = useI18n();

  const modules = [
    { icon: Apple, color: 'bg-green-500', title: t('landing.modules.nutrition'), desc: t('landing.modules.nutritionDesc') },
    { icon: Dumbbell, color: 'bg-blue-500', title: t('landing.modules.movement'), desc: t('landing.modules.movementDesc') },
    { icon: Moon, color: 'bg-purple-500', title: t('landing.modules.sleep'), desc: t('landing.modules.sleepDesc') },
    { icon: Smile, color: 'bg-pink-500', title: t('landing.modules.psychology'), desc: t('landing.modules.psychologyDesc') },
    { icon: Stethoscope, color: 'bg-red-500', title: t('landing.modules.medicine'), desc: t('landing.modules.medicineDesc') },
    { icon: Users, color: 'bg-orange-500', title: t('landing.modules.social'), desc: t('landing.modules.socialDesc') },
    { icon: Sprout, color: 'bg-teal-500', title: t('landing.modules.habits'), desc: t('landing.modules.habitsDesc') },
  ];

  return (
    <section id="modules" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.modules.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('landing.modules.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <module.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600">{module.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section with Offer
function CTASection({ onStartClick }: { onStartClick: () => void }) {
  const { t } = useI18n();
  const [bonusesLeft, setBonusesLeft] = useState(47);

  useEffect(() => {
    // Simulate decreasing bonuses
    const interval = setInterval(() => {
      setBonusesLeft((prev) => (prev > 3 ? prev - 1 : prev));
    }, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const specialists = [
    t('landing.specialists.mentor'),
    t('landing.specialists.doctor'),
    t('landing.specialists.trainer'),
    t('landing.specialists.nutritionist'),
    t('landing.specialists.psychologist'),
    t('landing.specialists.coach'),
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
            <Gift className="w-4 h-4" />
            <span>{t('landing.offer.limited')}</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.offer.title')}
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            {t('landing.offer.description')}
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4">{t('landing.offer.includes')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>{t('landing.offer.bonus1')}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>{t('landing.offer.bonus2')}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>{t('landing.offer.bonus3')}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>{t('landing.offer.bonus4')}</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t">
              <p className="font-medium text-gray-900 mb-3">{t('landing.offer.team')}:</p>
              <div className="flex flex-wrap gap-2">
                {specialists.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={onStartClick}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
          >
            {t('landing.offer.cta')}
          </Button>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">{t('landing.offer.left')}</p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${bonusesLeft}%` }}
              />
            </div>
            <p className="text-sm font-bold text-gray-900 mt-2">
              {bonusesLeft} {t('landing.offer.of')} 100
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Heart className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold">Ethos<span className="text-emerald-500">Life</span></span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 EthoLife. {t('landing.footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

// 5-Step Onboarding Flow
function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { t } = useI18n();
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
        {t('onboarding.mood.title')}
      </h2>
      <p className="text-gray-600 mb-8">{t('onboarding.mood.subtitle')}</p>

      <div className="flex justify-center gap-4 flex-wrap">
        {[1, 2, 3, 4, 5].map((mood) => (
          <button
            key={mood}
            onClick={() => {
              setData({ ...data, mood });
              setTimeout(handleNext, 300);
            }}
            className={`w-16 h-16 rounded-2xl text-3xl transition-all hover:scale-110 ${
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

      <div className="flex justify-between text-sm text-gray-500 mt-4">
        <span>{t('onboarding.mood.terrible')}</span>
        <span>{t('onboarding.mood.excellent')}</span>
      </div>
    </div>
  );

  // Step 2: Goals
  const GoalsStep = () => {
    const goals = [
      { id: 'weight', label: t('onboarding.goals.weight'), icon: '⚖️' },
      { id: 'energy', label: t('onboarding.goals.energy'), icon: '⚡' },
      { id: 'sleep', label: t('onboarding.goals.sleep'), icon: '😴' },
      { id: 'stress', label: t('onboarding.goals.stress'), icon: '🧘' },
      { id: 'fitness', label: t('onboarding.goals.fitness'), icon: '💪' },
      { id: 'nutrition', label: t('onboarding.goals.nutrition'), icon: '🥗' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.goals.title')}
        </h2>
        <p className="text-gray-600 mb-8">{t('onboarding.goals.subtitle')}</p>

        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
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
              <p className="font-medium text-gray-900 mt-1">{goal.label}</p>
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={data.goals.length === 0}
          className="mt-8 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
        >
          {t('onboarding.next')}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  };

  // Step 3: Activity Level
  const ActivityStep = () => {
    const activities = [
      { id: 'sedentary', label: t('onboarding.activity.sedentary'), desc: t('onboarding.activity.sedentaryDesc'), icon: '🪑' },
      { id: 'light', label: t('onboarding.activity.light'), desc: t('onboarding.activity.lightDesc'), icon: '🚶' },
      { id: 'moderate', label: t('onboarding.activity.moderate'), desc: t('onboarding.activity.moderateDesc'), icon: '🏃' },
      { id: 'active', label: t('onboarding.activity.active'), desc: t('onboarding.activity.activeDesc'), icon: '💪' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.activity.title')}
        </h2>
        <p className="text-gray-600 mb-8">{t('onboarding.activity.subtitle')}</p>

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
      { id: 'less-5', label: t('onboarding.sleep.less5'), hours: '< 5' },
      { id: '5-6', label: t('onboarding.sleep.5-6'), hours: '5-6' },
      { id: '7-8', label: t('onboarding.sleep.7-8'), hours: '7-8' },
      { id: 'more-8', label: t('onboarding.sleep.more8'), hours: '8+' },
    ];

    return (
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.sleep.title')}
        </h2>
        <p className="text-gray-600 mb-8">{t('onboarding.sleep.subtitle')}</p>

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
        {t('onboarding.plan.title')}
      </h2>
      <p className="text-gray-600 mb-8">{t('onboarding.plan.subtitle')}</p>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 max-w-md mx-auto text-left mb-8">
        <h3 className="font-bold text-gray-900 mb-4">{t('onboarding.plan.program')}</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{t('onboarding.plan.week1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{t('onboarding.plan.week2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{t('onboarding.plan.week3')}</span>
          </li>
        </ul>

        <div className="mt-6 pt-6 border-t border-emerald-200">
          <p className="text-sm text-gray-600 mb-2">{t('onboarding.plan.aiTitle')}</p>
          <p className="text-emerald-800 font-medium">{t('onboarding.plan.aiTip')}</p>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleNext}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/25"
      >
        {t('onboarding.plan.activate')}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      <p className="text-sm text-gray-500 mt-4">
        {t('onboarding.plan.time')}
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
            <span>{t('onboarding.step')} {step + 1} {t('onboarding.of')} {totalSteps}</span>
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
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
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
            {t('onboarding.back')}
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
    // Save onboarding data and redirect to registration
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
      <CTASection onStartClick={startOnboarding} />
      <Footer />
    </div>
  );
}
