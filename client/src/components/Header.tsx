import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Heart,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: User },
    { path: '/wallet', label: t('nav.wallet'), icon: Wallet },
    { path: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all pt-[env(safe-area-inset-top)]',
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        )}
      >
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 max-w-7xl mx-auto">
          {/* Logo - с фиксированной шириной чтобы не сжимался */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg truncate">
              Ethos<span className="text-emerald-600">Life</span>
            </span>
          </Link>

          {/* Right Side - с ограничением ширины */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <LanguageSwitcher />

            {user ? (
              <>
                {/* Desktop Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-1.5 gap-1 hidden sm:flex">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-[10px]">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-2 border-b">
                      <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {menuItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link href={item.path} className="cursor-pointer flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Avatar Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="sm:hidden w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-transparent text-emerald-700 text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-8 text-xs px-2 sm:px-3 hidden sm:flex">
                    {t('auth.loginButton')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-8 text-xs px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
                    {t('auth.registerButton')}
                  </Button>
                </Link>
                {/* Mobile Login Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="sm:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <User className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[280px] bg-white z-50 overflow-hidden flex flex-col shadow-2xl"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">Ethos<span className="text-emerald-600">Life</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-emerald-200 text-emerald-700 text-lg font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user.name || t('common.user')}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <Link key={item.path} href={item.path}>
                          <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="font-medium text-gray-700">{item.label}</span>
                          </button>
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 transition-colors mt-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium text-red-600">{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl h-12"
                          size="lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('auth.loginButton')}
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12"
                          size="lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('auth.registerButton')}
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  © 2026 EthoLife
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
