import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useI18n } from '@/i18n';

export default function Home() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const isTelegram = typeof window !== 'undefined' && (
    window.location.search.includes('tgWebAppStartParam') ||
    window.location.search.includes('tgWebAppData')
  );

  useEffect(() => {
    if (isTelegram) {
      setLocation('/telegram-auth');
    }
  }, [isTelegram, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-10 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

        <div className="relative px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-8 h-8" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('landing.hero.title')}
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-2">
              {t('landing.hero.subtitle')}
            </p>
            <p className="text-sm text-white/80 mb-6">
              {t('landing.hero.description')}
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {user ? (
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-white/90"
                  onClick={() => setLocation('/dashboard')}
                >
                  {t('nav.dashboard')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-emerald-700 hover:bg-white/90"
                    onClick={() => setLocation('/register')}
                  >
                    {t('landing.hero.ctaPrimary')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => setLocation('/login')}
                  >
                    {t('auth.loginButton')}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {t('landing.modules.title')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('landing.modules.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: t('health.modules.medicine'),
              desc: t('health.modules.medicineDesc'),
              icon: '🏥',
            },
            {
              title: t('health.modules.movement'),
              desc: t('health.modules.movementDesc'),
              icon: '🏃',
            },
            {
              title: t('health.modules.nutrition'),
              desc: t('health.modules.nutritionDesc'),
              icon: '🥗',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="text-xl font-bold mb-2">{t('landing.offer.title')}</h2>
          <p className="text-sm text-white/90 mb-4">
            {t('app.description')}
          </p>
          <Button
            className="bg-white text-emerald-700 hover:bg-white/90"
            onClick={() => setLocation(user ? '/dashboard' : '/register')}
          >
            {user ? t('nav.dashboard') : t('landing.hero.ctaPrimary')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
