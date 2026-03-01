import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  ChevronDown, 
  User, 
  Settings, 
  LogOut,
  Heart,
  Wallet,
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

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-30 transition-all',
        isScrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white'
      )}
    >
      <div className="flex items-center justify-between h-10 px-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-base">
            Ethos<span className="text-emerald-600">Life</span>
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-1.5 gap-1">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-[10px]">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <div className="px-2 py-1">
                  <p className="text-xs font-medium truncate">{user.name || user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer text-xs">
                    <User className="w-3.5 h-3.5 mr-2" />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="cursor-pointer text-xs">
                    <Wallet className="w-3.5 h-3.5 mr-2" />
                    {t('nav.wallet')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer text-xs">
                    <Settings className="w-3.5 h-3.5 mr-2" />
                    {t('nav.settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer text-xs">
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-7 text-xs px-2 bg-emerald-600 hover:bg-emerald-700">
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
