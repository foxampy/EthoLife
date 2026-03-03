import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQ() {
  const { t, locale } = useI18n();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: locale === 'en'
        ? 'What is EthosLife?'
        : 'Что такое EthosLife?',
      answer: locale === 'en'
        ? 'EthosLife is a comprehensive health ecosystem that helps you track and improve all aspects of your wellbeing through 7 interconnected health modules, AI-powered planning, and access to certified specialists.'
        : 'EthosLife — это комплексная экосистема здоровья, которая помогает отслеживать и улучшать все аспекты вашего благополучия через 7 взаимосвязанных модулей здоровья, ИИ-планирование и доступ к сертифицированным специалистам.',
    },
    {
      question: locale === 'en'
        ? 'Is EthosLife free to use?'
        : 'Можно ли использовать EthosLife бесплатно?',
      answer: locale === 'en'
        ? 'Yes! EthosLife offers a free tier with access to basic features. Premium plans unlock all 7 health modules, unlimited AI chat, and priority support.'
        : 'Да! EthosLife предлагает бесплатный тариф с доступом к базовым функциям. Премиум планы открывают все 7 модулей здоровья, безлимитный ИИ-чат и приоритетную поддержку.',
    },
    {
      question: locale === 'en'
        ? 'What are UNITY tokens?'
        : 'Что такое токены UNITY?',
      answer: locale === 'en'
        ? 'UNITY is our internal currency that you can earn for healthy activities and spend on subscriptions with a 15% discount. You can also stake UNITY tokens to participate in our investment program.'
        : 'UNITY — это наша внутренняя валюта, которую вы можете зарабатывать за здоровые активности и тратить на подписки со скидкой 15%. Вы также можете стейкать токены UNITY для участия в нашей инвестиционной программе.',
    },
    {
      question: locale === 'en'
        ? 'Can I cancel my subscription anytime?'
        : 'Могу ли я отменить подписку в любое время?',
      answer: locale === 'en'
        ? 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.'
        : 'Да, вы можете отменить подписку в любое время. Ваш доступ продолжится до конца расчетного периода.',
    },
    {
      question: locale === 'en'
        ? 'How does the annual subscription discount work?'
        : 'Как работает скидка на годовую подписку?',
      answer: locale === 'en'
        ? 'With an annual subscription, you get 50% off and lifetime access to the Standard tier. You also receive FREE individual sessions with specialists for each health module.'
        : 'С годовой подпиской вы получаете скидку 50% и пожизненный доступ к Стандартному тарифу. Вы также получаете БЕСПЛАТНЫЕ индивидуальные сессии со специалистами по каждому модулю здоровья.',
    },
    {
      question: locale === 'en'
        ? 'What devices does EthosLife support?'
        : 'Какие устройства поддерживает EthosLife?',
      answer: locale === 'en'
        ? 'EthosLife works on all devices - iOS, Android, and web browsers. Your data syncs automatically across all platforms.'
        : 'EthosLife работает на всех устройствах - iOS, Android и веб-браузерах. Ваши данные автоматически синхронизируются на всех платформах.',
    },
    {
      question: locale === 'en'
        ? 'Is my health data secure?'
        : 'Безопасны ли мои данные о здоровье?',
      answer: locale === 'en'
        ? 'Absolutely. We use bank-level encryption and comply with international health data protection standards. Your data is yours alone.'
        : 'Абсолютно. Мы используем шифрование банковского уровня и соответствуем международным стандартам защиты данных о здоровье. Ваши данные принадлежат только вам.',
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
            <h1 className="ml-4 text-xl font-bold text-gray-900">{t('footer.faq')}</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('footer.faq')}
          </h2>
          <p className="text-xl text-gray-600">
            {locale === 'en'
              ? 'Find answers to common questions'
              : 'Найдите ответы на распространенные вопросы'
            }
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? "Didn't find your answer?" : "Не нашли ответ?"}
          </h3>
          <p className="text-gray-600 mb-8">
            {locale === 'en'
              ? "Contact our support team for personalized help"
              : "Свяжитесь с нашей командой поддержки для персональной помощи"
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
