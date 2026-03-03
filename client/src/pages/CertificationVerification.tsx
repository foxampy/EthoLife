import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';
import { Link } from 'wouter';
import {
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Award,
  Building,
  Stethoscope,
  ShoppingBag,
  Upload,
  Eye,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type EntityType = 'specialist' | 'center' | 'business' | 'shop';

interface Application {
  id: string;
  entity: EntityType;
  name: string;
  status: 'pending' | 'in-review' | 'verified' | 'rejected';
  submittedAt: string;
  documents: number;
}

export default function CertificationVerification() {
  const { t, locale } = useI18n();

  const [selectedType, setSelectedType] = useState<EntityType | null>(null);

  const [applications] = useState<Application[]>([
    {
      id: '1',
      entity: 'specialist',
      name: 'Dr. Anna Smith - Nutritionist',
      status: 'verified',
      submittedAt: '2026-01-15',
      documents: 5,
    },
    {
      id: '2',
      entity: 'center',
      name: 'Wellness Center Moscow',
      status: 'in-review',
      submittedAt: '2026-02-20',
      documents: 8,
    },
    {
      id: '3',
      entity: 'business',
      name: 'Organic Food Store',
      status: 'pending',
      submittedAt: '2026-03-01',
      documents: 3,
    },
  ]);

  const entityTypes = [
    {
      type: 'specialist' as EntityType,
      icon: Stethoscope,
      title: locale === 'en' ? 'Specialist' : 'Специалист',
      description: locale === 'en'
        ? 'Doctors, nutritionists, trainers, psychologists'
        : 'Врачи, нутрициологи, тренеры, психологи',
      requirements: [
        locale === 'en' ? 'Professional license' : 'Профессиональная лицензия',
        locale === 'en' ? 'Education certificates' : 'Дипломы об образовании',
        locale === 'en' ? 'Work experience proof' : 'Подтверждение опыта работы',
        locale === 'en' ? 'Identity verification' : 'Верификация личности',
      ],
      color: 'text-blue-500 bg-blue-50',
    },
    {
      type: 'center' as EntityType,
      icon: Building,
      title: locale === 'en' ? 'Health Center' : 'Медицинский Центр',
      description: locale === 'en'
        ? 'Clinics, wellness centers, rehabilitation facilities'
        : 'Клиники, wellness-центры, реабилитационные центры',
      requirements: [
        locale === 'en' ? 'Business license' : 'Лицензия на деятельность',
        locale === 'en' ? 'Facility certificates' : 'Сертификаты помещения',
        locale === 'en' ? 'Staff qualifications' : 'Квалификация персонала',
        locale === 'en' ? 'Insurance documents' : 'Страховые документы',
      ],
      color: 'text-purple-500 bg-purple-50',
    },
    {
      type: 'business' as EntityType,
      icon: Award,
      title: locale === 'en' ? 'Business' : 'Бизнес',
      description: locale === 'en'
        ? 'Health-related businesses and services'
        : 'Бизнесы и услуги, связанные со здоровьем',
      requirements: [
        locale === 'en' ? 'Business registration' : 'Регистрация бизнеса',
        locale === 'en' ? 'Tax documents' : 'Налоговые документы',
        locale === 'en' ? 'Product certificates' : 'Сертификаты продукции',
      ],
      color: 'text-orange-500 bg-orange-50',
    },
    {
      type: 'shop' as EntityType,
      icon: ShoppingBag,
      title: locale === 'en' ? 'Shop' : 'Магазин',
      description: locale === 'en'
        ? 'Health products, supplements, equipment'
        : 'Товары для здоровья, БАДы, оборудование',
      requirements: [
        locale === 'en' ? 'Retail license' : 'Лицензия на торговлю',
        locale === 'en' ? 'Product quality certs' : 'Сертификаты качества',
        locale === 'en' ? 'Supplier agreements' : 'Договоры с поставщиками',
      ],
      color: 'text-green-500 bg-green-50',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-100 text-emerald-700';
      case 'in-review': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return locale === 'en' ? 'Verified' : 'Верифицировано';
      case 'in-review': return locale === 'en' ? 'In Review' : 'На проверке';
      case 'pending': return locale === 'en' ? 'Pending' : 'Ожидает';
      case 'rejected': return locale === 'en' ? 'Rejected' : 'Отклонено';
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
                <Shield className="w-5 h-5" />
                <span className="font-medium">
                  {locale === 'en' ? 'Certification & Verification' : 'Сертификация и Верификация'}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {locale === 'en'
              ? 'Get Verified on EthosLife'
              : 'Получите Верификацию в EthosLife'
            }
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {locale === 'en'
              ? 'Build trust with verified status. Show your credentials to attract more clients.'
              : 'Повысьте доверие с верифицированным статусом. Покажите своиcredentials для привлечения клиентов.'
            }
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-emerald-600">2.4K</p>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Verified' : 'Верифицировано'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-blue-600">48h</p>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Avg. Review' : 'Сред. проверка'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold text-purple-600">98%</p>
              <p className="text-sm text-gray-500">
                {locale === 'en' ? 'Approval Rate' : 'Одобрение'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Entity Types */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {locale === 'en'
              ? 'Choose Your Verification Type'
              : 'Выберите Тип Верификации'
            }
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {entityTypes.map((entity) => (
              <motion.div
                key={entity.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-emerald-200"
                  onClick={() => setSelectedType(entity.type)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center',
                        entity.color
                      )}>
                        <entity.icon className="w-7 h-7" />
                      </div>
                      {selectedType === entity.type && (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {entity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {entity.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {entity.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={selectedType === entity.type ? 'default' : 'outline'}
                    >
                      {locale === 'en' ? 'Apply Now' : 'Подать заявку'}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* My Applications */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === 'en' ? 'My Applications' : 'Мои Заявки'}
          </h2>

          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        app.entity === 'specialist' ? 'text-blue-500 bg-blue-50' :
                        app.entity === 'center' ? 'text-purple-500 bg-purple-50' :
                        app.entity === 'business' ? 'text-orange-500 bg-orange-50' :
                        'text-green-500 bg-green-50'
                      )}>
                        {app.entity === 'specialist' ? <Stethoscope className="w-6 h-6" /> :
                         app.entity === 'center' ? <Building className="w-6 h-6" /> :
                         app.entity === 'business' ? <Award className="w-6 h-6" /> :
                         <ShoppingBag className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {app.submittedAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {app.documents} {locale === 'en' ? 'docs' : 'док.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusLabel(app.status)}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {locale === 'en' ? 'Verification Process' : 'Процесс Верификации'}
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: locale === 'en' ? 'Submit' : 'Подача',
                desc: locale === 'en' ? 'Fill application form' : 'Заполнить заявку',
              },
              {
                step: 2,
                title: locale === 'en' ? 'Review' : 'Проверка',
                desc: locale === 'en' ? 'Document verification' : 'Проверка документов',
              },
              {
                step: 3,
                title: locale === 'en' ? 'Approval' : 'Одобрение',
                desc: locale === 'en' ? 'Get verified badge' : 'Получить бейдж',
              },
              {
                step: 4,
                title: locale === 'en' ? 'Benefits' : 'Преимущества',
                desc: locale === 'en' ? 'Access premium features' : 'Доступ к функциям',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                {locale === 'en' ? 'Why Get Verified?' : 'Зачем Верифицироваться?'}
              </h3>
              <p className="text-sm text-blue-700">
                {locale === 'en'
                  ? 'Verified specialists and businesses get 3x more visibility, access to premium features, and higher trust from clients. Verification is free and takes 24-48 hours.'
                  : 'Верифицированные специалисты и бизнесы получают в 3 раза больше видимости, доступ к премиум-функциям и повышенное доверие клиентов. Верификация бесплатна и занимает 24-48 часов.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
