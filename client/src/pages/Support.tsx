import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import { ChevronLeft, Mail, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Support() {
  const { t, locale } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <h1 className="ml-4 text-xl font-bold text-gray-900">{t('footer.support')}</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('footer.support')}
          </h2>
          <p className="text-xl text-gray-600">
            {locale === 'en'
              ? 'We are here to help you 24/7'
              : 'Мы здесь, чтобы помочь вам 24/7'
            }
          </p>
        </div>
      </section>

      {/* Support Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <Mail className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                {locale === 'en' ? 'Email Support' : 'Поддержка по Email'}
              </h3>
              <p className="text-gray-600">support@ethoslife.com</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <Clock className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                {locale === 'en' ? 'Response Time' : 'Время ответа'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' ? 'Within 24 hours' : 'В течение 24 часов'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                {locale === 'en' ? 'Languages' : 'Языки'}
              </h3>
              <p className="text-gray-600">English, Русский</p>
            </div>
          </div>

          {/* Support Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {locale === 'en' ? 'Message Sent!' : 'Сообщение отправлено!'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'en'
                    ? "We'll get back to you within 24 hours"
                    : 'Мы ответим вам в течение 24 часов'
                  }
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {locale === 'en' ? 'Send us a message' : 'Отправьте нам сообщение'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'First Name' : 'Имя'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        placeholder={locale === 'en' ? 'John' : 'Иван'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'en' ? 'Last Name' : 'Фамилия'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        placeholder={locale === 'en' ? 'Doe' : 'Иванов'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Subject' : 'Тема'}
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white"
                    >
                      <option value="">
                        {locale === 'en' ? 'Select a topic' : 'Выберите тему'}
                      </option>
                      <option value="technical">
                        {locale === 'en' ? 'Technical Issue' : 'Техническая проблема'}
                      </option>
                      <option value="billing">
                        {locale === 'en' ? 'Billing Question' : 'Вопрос по оплате'}
                      </option>
                      <option value="account">
                        {locale === 'en' ? 'Account Issue' : 'Проблема с аккаунтом'}
                      </option>
                      <option value="feature">
                        {locale === 'en' ? 'Feature Request' : 'Запрос функции'}
                      </option>
                      <option value="other">
                        {locale === 'en' ? 'Other' : 'Другое'}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'en' ? 'Message' : 'Сообщение'}
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none resize-none"
                      placeholder={locale === 'en'
                        ? 'Describe your issue in detail...'
                        : 'Опишите вашу проблему подробно...'
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold transition-colors"
                  >
                    {locale === 'en' ? 'Send Message' : 'Отправить сообщение'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
