import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft, Book, MessageCircle, FileText, Video } from 'lucide-react';

export default function Help() {
  const { t, locale } = useI18n();

  const helpCategories = [
    {
      icon: Book,
      title: locale === 'en' ? 'Getting Started' : 'Начало работы',
      description: locale === 'en'
        ? 'Learn the basics of using EthosLife'
        : 'Изучите основы использования EthosLife',
      href: '/help/getting-started',
    },
    {
      icon: FileText,
      title: locale === 'en' ? 'Health Modules' : 'Модули здоровья',
      description: locale === 'en'
        ? 'How to track your health metrics'
        : 'Как отслеживать показатели здоровья',
      href: '/help/health-modules',
    },
    {
      icon: MessageCircle,
      title: locale === 'en' ? 'AI Assistant' : 'ИИ-ассистент',
      description: locale === 'en'
        ? 'Get the most from AI features'
        : 'Получите максимум от ИИ-функций',
      href: '/help/ai-assistant',
    },
    {
      icon: Video,
      title: locale === 'en' ? 'Video Tutorials' : 'Видеоуроки',
      description: locale === 'en'
        ? 'Watch step-by-step guides'
        : 'Смотрите пошаговые руководства',
      href: '/help/tutorials',
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
            <h1 className="ml-4 text-xl font-bold text-gray-900">{t('footer.help')}</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('footer.help')} {locale === 'en' ? 'Center' : 'Центр'}
          </h2>
          <p className="text-xl text-gray-600">
            {locale === 'en'
              ? 'Find answers, guides, and tutorials'
              : 'Найдите ответы, руководства и уроки'
            }
          </p>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {helpCategories.map((category, index) => (
              <a
                key={index}
                href={category.href}
                className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? "Still need help?" : "Все еще нужна помощь?"}
          </h3>
          <p className="text-gray-600 mb-8">
            {locale === 'en'
              ? "Our support team is here to assist you"
              : "Наша команда поддержки готова помочь вам"
            }
          </p>
          <Link href="/support">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
              {t('footer.support')}
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
