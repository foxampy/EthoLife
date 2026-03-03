import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft, CheckCircle, Zap, Shield, Brain, Heart, Activity, Users, Sparkles } from 'lucide-react';

export default function Features() {
  const { t, locale } = useI18n();

  const features = [
    {
      icon: Heart,
      title: t('health.modules.medicine'),
      description: t('health.modules.medicineDesc'),
      color: 'bg-red-500',
    },
    {
      icon: Activity,
      title: t('health.modules.movement'),
      description: t('health.modules.movementDesc'),
      color: 'bg-blue-500',
    },
    {
      icon: Brain,
      title: t('health.modules.psychology'),
      description: t('health.modules.psychologyDesc'),
      color: 'bg-purple-500',
    },
    {
      icon: Users,
      title: t('health.modules.relationships'),
      description: t('health.modules.relationshipsDesc'),
      color: 'bg-pink-500',
    },
    {
      icon: Sparkles,
      title: t('health.modules.habits'),
      description: t('health.modules.habitsDesc'),
      color: 'bg-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">{t('nav.home')}</span>
              </button>
            </Link>
            <h1 className="ml-4 text-xl font-bold text-gray-900">{t('footer.features')}</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('footer.features')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('app.description')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('app.tagline')}
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            {t('staking.description')}
          </p>
          <Link href="/register">
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors shadow-lg">
              {t('pricing.getStarted')}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
