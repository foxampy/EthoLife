import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import {
  Award,
  Shield,
  Clock,
  CheckCircle,
  QrCode,
  CreditCard,
  Download,
  Share2,
  Eye,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Subscription {
  id: string;
  type: 'premium' | 'family' | 'specialist';
  status: 'active' | 'expired' | 'pending';
  validUntil: string;
  autoRenew: boolean;
}

interface Certificate {
  id: string;
  title: string;
  type: 'nft' | 'achievement' | 'completion';
  issuedAt: string;
  imageUrl: string;
  verified: boolean;
}

export default function SubscriptionsCertificates() {
  const { t, locale } = useI18n();

  const [subscriptions] = useState<Subscription[]>([
    {
      id: '1',
      type: 'premium',
      status: 'active',
      validUntil: '2026-09-15',
      autoRenew: true,
    },
    {
      id: '2',
      type: 'specialist',
      status: 'pending',
      validUntil: '-',
      autoRenew: false,
    },
  ]);

  const [certificates] = useState<Certificate[]>([
    {
      id: '1',
      title: locale === 'en' ? 'Health Pioneer' : 'Пионер Здоровья',
      type: 'achievement',
      issuedAt: '2026-02-20',
      imageUrl: '',
      verified: true,
    },
    {
      id: '2',
      title: locale === 'en' ? '30-Day Streak' : '30 Дней Подряд',
      type: 'achievement',
      issuedAt: '2026-03-01',
      imageUrl: '',
      verified: true,
    },
    {
      id: '3',
      title: locale === 'en' ? 'Nutrition Master' : 'Мастер Питания',
      type: 'completion',
      issuedAt: '2026-02-15',
      imageUrl: '',
      verified: true,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return locale === 'en' ? 'Active' : 'Активен';
      case 'expired': return locale === 'en' ? 'Expired' : 'Истек';
      case 'pending': return locale === 'en' ? 'Pending' : 'На проверке';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Award className="w-5 h-5" />
                <span className="font-medium">
                  {locale === 'en' ? 'Subscriptions & NFT' : 'Абонементы и NFT'}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Active Subscription Banner */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Premium</h2>
                  <p className="text-sm text-emerald-100">
                    {locale === 'en' ? 'All features unlocked' : 'Все функции разблокированы'}
                  </p>
                </div>
              </div>
              <Badge className="bg-white text-emerald-600">
                {getStatusLabel('active')}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm text-emerald-100">
                <Clock className="w-4 h-4" />
                <span>
                  {locale === 'en'
                    ? 'Valid until Sep 15, 2026'
                    : 'Действителен до 15 сен 2026'
                  }
                </span>
              </div>
              <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                {locale === 'en' ? 'Manage' : 'Управление'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Subscriptions List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'My Subscriptions' : 'Мои Подписки'}
          </h2>

          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        sub.type === 'premium' ? 'bg-purple-100 text-purple-600' :
                        sub.type === 'family' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      )}>
                        {sub.type === 'premium' ? <Star className="w-6 h-6" /> :
                         sub.type === 'family' ? <Shield className="w-6 h-6" /> :
                         <Award className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {sub.type}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {sub.validUntil !== '-'
                            ? (locale === 'en' ? `Until ${sub.validUntil}` : `До ${sub.validUntil}`)
                            : (locale === 'en' ? 'Processing...' : 'Обработка...')
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(sub.status)}>
                        {getStatusLabel(sub.status)}
                      </Badge>
                      {sub.autoRenew && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Auto
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NFT & Certificates */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {locale === 'en' ? 'NFT & Certificates' : 'NFT и Сертификаты'}
            </h2>
            <Button size="sm" variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              {locale === 'en' ? 'Verify' : 'Проверить'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Certificate Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative">
                      <Award className="w-16 h-16 text-emerald-600/50" />
                      {cert.verified && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {cert.issuedAt}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          {locale === 'en' ? 'View' : 'Просмотр'}
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add New Certificate Placeholder */}
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                  <Award className="w-12 h-12 mb-2" />
                  <span className="text-xs text-center px-4">
                    {locale === 'en'
                      ? 'Complete achievements to earn certificates'
                      : 'Выполняйте достижения для получения сертификатов'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {locale === 'en'
                      ? 'Limited Offer: 6+6 Months Premium'
                      : 'Ограниченное Предложение: 6+6 Месяцев Premium'
                    }
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {locale === 'en'
                      ? 'Get 6 months of Premium + 6 months FREE. Includes lifetime PRO badge and priority support.'
                      : 'Получите 6 месяцев Premium + 6 месяцев БЕСПЛАТНО. Включает пожизненный PRO бейдж и приоритетную поддержку.'
                    }
                  </p>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    {locale === 'en' ? 'Claim Offer' : 'Получить Предложение'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
