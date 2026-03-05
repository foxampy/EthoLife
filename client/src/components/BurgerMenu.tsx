import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  Activity,
  Apple,
  Brain,
  Moon,
  Users,
  Leaf,
  Map,
  FileText,
  MessageSquare,
  Presentation,
  ShoppingBag,
  Building2,
  MapPin,
  Search,
  Heart,
  Globe,
} from 'lucide-react';
import SketchIcon from './SketchIcon';
import { useI18n } from '@/i18n';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BurgerMenu({ isOpen, onClose }: BurgerMenuProps) {
  const [location] = useLocation();
  const { locale, setLocale } = useI18n();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/health-center', icon: LayoutDashboard, label: 'Health Center' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const socialPages = [
    { path: '/social/friends', icon: Users, label: 'Friends' },
    { path: '/social/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/social/specialists', icon: User, label: 'Specialists' },
  ];

  const healthPages = [
    { path: '/health-center', icon: LayoutDashboard, label: 'Health Center' },
    { path: '/health/movement', icon: Activity, label: 'Movement' },
    { path: '/health/nutrition', icon: Apple, label: 'Nutrition' },
    { path: '/health/sleep', icon: Moon, label: 'Sleep' },
    { path: '/health/psychology', icon: Brain, label: 'Psychology' },
    { path: '/health/medicine', icon: Heart, label: 'Medicine' },
  ];

      const otherPages = [
        { path: '/landing', icon: Presentation, label: 'Landing' },
        { path: '/v2', icon: Presentation, label: 'Landing V2' },
        { path: '/newstyle', icon: Presentation, label: 'Landing NewStyle' },
        { path: '/presentation', icon: Presentation, label: 'Presentation' },
        { path: '/tokenomics', icon: FileText, label: 'Tokenomics' },
        { path: '/whitepaper', icon: FileText, label: 'Whitepaper' },
        { path: '/documents', icon: FileText, label: 'Documents' },
        { path: '/journal', icon: FileText, label: 'Journal' },
        { path: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
        { path: '/interactive-demo', icon: FileText, label: 'Interactive Demo' },
        { path: '/project-hub', icon: Globe, label: 'Project HUB' },
      ];

  const handleLinkClick = () => {
    onClose();
  };

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.burger-menu-container')) {
        onClose();
      }
    };

    const handleTouchOutside = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.burger-menu-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            onTouchStart={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="burger-menu-container fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 overflow-y-auto"
            onTouchStart={(e) => {
              // Swipe to close
              const touch = e.touches[0];
              const startX = touch.clientX;
              const startTime = Date.now();
              
              const handleTouchMove = (e: TouchEvent) => {
                if (e.touches.length === 0) return;
                const currentX = e.touches[0].clientX;
                const deltaX = currentX - startX;
                
                // Swipe left to close (more than 100px)
                if (deltaX < -100) {
                  onClose();
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                }
              };
              
              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };
              
              document.addEventListener('touchmove', handleTouchMove, { passive: true });
              document.addEventListener('touchend', handleTouchEnd);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 mb-4">
                <SketchIcon icon="dna" size={32} className="text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">EthosLife</h2>
                  <p className="text-xs text-foreground/60">Экосистема здоровья</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-6">
              {/* Health Directions */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Направления здоровья
                </h3>
                {healthPages.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Main Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Main
                </h3>
                {mainNavItems.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Social Network */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Social Network
                </h3>
                {socialPages.map((item) => {
                  const isActive = location.startsWith(item.path);
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Shop */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Shop
                </h3>
                <Link href="/shop">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                      location.startsWith('/shop')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium">Shop</span>
                  </motion.div>
                </Link>
              </div>

              {/* Centers */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Centers
                </h3>
                <Link href="/centers">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                      location.startsWith('/centers')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">Centers</span>
                  </motion.div>
                </Link>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Map
                </h3>
                <Link href="/map">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                      location.startsWith('/map')
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Map</span>
                  </motion.div>
                </Link>
              </div>

              {/* Other Pages */}
              <div>
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Additional
                </h3>
                {otherPages.map((item) => {
                  const isActive = location.startsWith(item.path);
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer mb-1 ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Language Switcher - at the bottom */}
              <div className="pt-4 mt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 px-3">
                  Language
                </h3>
                <div className="flex items-center gap-2 px-3">
                  <button
                    onClick={() => setLocale('en')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      locale === 'en'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground/70'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLocale('ru')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      locale === 'ru'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground/70'
                    }`}
                  >
                    Русский
                  </button>
                </div>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
