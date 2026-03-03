import { Footer } from '@/components/Footer';
import { useI18n } from '@/i18n';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

interface InfoPageProps {
  title: string;
  content: React.ReactNode;
}

export default function InfoPage({ title, content }: InfoPageProps) {
  const { t } = useI18n();

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
            <h1 className="ml-4 text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          {content}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
