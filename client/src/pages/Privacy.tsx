import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function Privacy() {
  const { t, locale } = useI18n();

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
            <h1 className="ml-4 text-xl font-bold text-gray-900">{t('footer.privacy')}</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'Introduction' : 'Введение'}
            </h2>
            <p className="text-gray-700">
              {locale === 'en'
                ? 'At EthosLife, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.'
                : 'В EthosLife мы серьезно относимся к вашей конфиденциальности. Эта Политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и защищаем вашу информацию при использовании наших услуг.'
              }
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'Information We Collect' : 'Информация, которую мы собираем'}
            </h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === 'en' ? 'Personal Information' : 'Персональная информация'}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>{locale === 'en' ? 'Name and email address' : 'Имя и адрес электронной почты'}</li>
              <li>{locale === 'en' ? 'Health and fitness data you choose to share' : 'Данные о здоровье и фитнесе, которыми вы делитесь'}</li>
              <li>{locale === 'en' ? 'Payment information' : 'Платежная информация'}</li>
              <li>{locale === 'en' ? 'Communication preferences' : 'Предпочтения по коммуникации'}</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {locale === 'en' ? 'Automatically Collected Information' : 'Автоматически собираемая информация'}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{locale === 'en' ? 'Device information and identifiers' : 'Информация об устройстве и идентификаторы'}</li>
              <li>{locale === 'en' ? 'Usage data and analytics' : 'Данные об использовании и аналитика'}</li>
              <li>{locale === 'en' ? 'IP address and browser type' : 'IP-адрес и тип браузера'}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'How We Use Your Information' : 'Как мы используем вашу информацию'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{locale === 'en' ? 'To provide and maintain our services' : 'Для предоставления и поддержки наших услуг'}</li>
              <li>{locale === 'en' ? 'To personalize your experience' : 'Для персонализации вашего опыта'}</li>
              <li>{locale === 'en' ? 'To communicate with you about updates and offers' : 'Для связи с вами об обновлениях и предложениях'}</li>
              <li>{locale === 'en' ? 'To improve our services and develop new features' : 'Для улучшения наших услуг и разработки новых функций'}</li>
              <li>{locale === 'en' ? 'To ensure security and prevent fraud' : 'Для обеспечения безопасности и предотвращения мошенничества'}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'Data Security' : 'Безопасность данных'}
            </h2>
            <p className="text-gray-700">
              {locale === 'en'
                ? 'We implement industry-standard security measures to protect your personal information. Your health data is encrypted both in transit and at rest using bank-level encryption.'
                : 'Мы внедряем стандартные меры безопасности для защиты вашей персональной информации. Ваши данные о здоровье шифруются как при передаче, так и при хранении с использованием шифрования банковского уровня.'
              }
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'Your Rights' : 'Ваши права'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>{locale === 'en' ? 'Access your personal data' : 'Доступ к вашим персональным данным'}</li>
              <li>{locale === 'en' ? 'Correct inaccurate data' : 'Исправление неточных данных'}</li>
              <li>{locale === 'en' ? 'Request deletion of your data' : 'Запрос на удаление ваших данных'}</li>
              <li>{locale === 'en' ? 'Export your data' : 'Экспорт ваших данных'}</li>
              <li>{locale === 'en' ? 'Opt-out of marketing communications' : 'Отказ от маркетинговых коммуникаций'}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'en' ? 'Contact Us' : 'Свяжитесь с нами'}
            </h2>
            <p className="text-gray-700">
              {locale === 'en'
                ? 'If you have any questions about this Privacy Policy, please contact us at:'
                : 'Если у вас есть вопросы по этой Политике конфиденциальности, свяжитесь с нами:'
              }
            </p>
            <p className="text-gray-700 mt-2">
              Email: support@ethoslife.com
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {locale === 'en'
                ? 'Last updated: March 2026'
                : 'Последнее обновление: Март 2026'
              }
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
