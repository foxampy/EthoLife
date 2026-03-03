import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft, Heart, Target, Users, Globe } from 'lucide-react';

export default function About() {
  const { t, locale } = useI18n();

  const values = [
    {
      icon: Heart,
      title: locale === 'en' ? 'Health First' : 'Здоровье прежде всего',
      description: locale === 'en' 
        ? 'Your health is our top priority in everything we do.'
        : 'Ваше здоровье - наш главный приоритет во всем, что мы делаем.',
    },
    {
      icon: Target,
      title: locale === 'en' ? 'Science-Based' : 'Научный подход',
      description: locale === 'en'
        ? 'All recommendations are backed by scientific research.'
        : 'Все рекомендации основаны на научных исследованиях.',
    },
    {
      icon: Users,
      title: locale === 'en' ? 'Community Driven' : 'Сообщество',
      description: locale === 'en'
        ? 'Built by and for people who care about their wellbeing.'
        : 'Создано людьми и для людей, которые заботятся о своем благополучии.',
    },
    {
      icon: Globe,
      title: locale === 'en' ? 'Global Vision' : 'Глобальное видение',
      description: locale === 'en'
        ? 'Making quality healthcare accessible worldwide.'
        : 'Делаем качественное здравоохранение доступным по всему миру.',
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
            <h1 className="ml-4 text-xl font-bold text-gray-900">{t('footer.about')}</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('footer.about')} EthosLife
          </h2>
          <p className="text-xl text-gray-600">
            {locale === 'en'
              ? 'We are building the future of personalized health and wellness.'
              : 'Мы создаем будущее персонализированного здоровья и благополучия.'
            }
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {locale === 'en' ? 'Our Mission' : 'Наша миссия'}
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {locale === 'en'
              ? 'At EthosLife, we believe that health is not just the absence of disease, but a state of complete physical, mental, and social well-being. Our mission is to empower individuals with the tools, knowledge, and support they need to live healthier, happier lives.'
              : 'В EthosLife мы верим, что здоровье — это не просто отсутствие болезней, а состояние полного физического, психического и социального благополучия. Наша миссия — предоставить людям инструменты, знания и поддержку, необходимые для более здоровой и счастливой жизни.'
            }
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            {locale === 'en' ? 'Our Values' : 'Наши ценности'}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
