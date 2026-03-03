import { Link } from 'wouter';
import { useI18n } from '@/i18n';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();

  const footerLinks = {
    product: [
      { label: t('footer.features'), path: '/features' },
      { label: t('footer.pricing'), path: '/pricing' },
      { label: t('footer.roadmap'), path: '/roadmap' },
      { label: t('footer.tokenomics'), path: '/tokenomics' },
    ],
    company: [
      { label: t('footer.about'), path: '/about' },
      { label: t('footer.contact'), path: '/contact' },
      { label: t('footer.careers'), path: '/careers' },
      { label: t('footer.press'), path: '/press' },
    ],
    support: [
      { label: t('footer.help'), path: '/help' },
      { label: t('footer.faq'), path: '/faq' },
      { label: t('footer.support'), path: '/support' },
      { label: t('footer.privacy'), path: '/privacy' },
    ],
    legal: [
      { label: t('footer.terms'), path: '/terms' },
      { label: t('footer.privacy'), path: '/privacy' },
      { label: t('footer.cookies'), path: '/cookies' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Ethos<span className="text-emerald-400">Life</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              {t('app.tagline')}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@ethoslife.com" className="hover:text-emerald-400 transition-colors">
                  support@ethoslife.com
                </a>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.product')}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>
                    <button className="text-sm text-gray-300 hover:text-emerald-400 transition-colors">
                      {link.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>
                    <button className="text-sm text-gray-300 hover:text-emerald-400 transition-colors">
                      {link.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>
                    <button className="text-sm text-gray-300 hover:text-emerald-400 transition-colors">
                      {link.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>
                    <button className="text-sm text-gray-300 hover:text-emerald-400 transition-colors">
                      {link.label}
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 EthosLife. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/terms">
              <button className="hover:text-emerald-400 transition-colors">
                {t('footer.terms')}
              </button>
            </Link>
            <Link href="/privacy">
              <button className="hover:text-emerald-400 transition-colors">
                {t('footer.privacy')}
              </button>
            </Link>
            <Link href="/cookies">
              <button className="hover:text-emerald-400 transition-colors">
                {t('footer.cookies')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
