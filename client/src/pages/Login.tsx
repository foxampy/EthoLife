import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  MessageCircle,
  Loader2,
  AlertCircle,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      toast.success('Успешный вход!', {
        description: 'Добро пожаловать обратно!',
      });
      setLocation('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
      toast.error('Ошибка входа', {
        description: err instanceof Error ? err.message : 'Проверьте email и пароль',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your-google-client-id') {
      setError('Google OAuth не настроен. Обратитесь к администратору.');
      toast.error('Ошибка', {
        description: 'Google OAuth не настроен',
      });
      return;
    }

    const scope = 'openid email profile';
    const state = btoa(JSON.stringify({ redirect: '/dashboard', timestamp: Date.now() }));

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  const handleTelegramLogin = () => {
    const botUsername = 'etholife_bot';
    const telegramUrl = `https://t.me/${botUsername}?startapp=auth`;

    window.open(telegramUrl, '_blank');
    
    toast.info('Telegram', {
      description: 'Откройте бота и нажмите /app или Start',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 overflow-hidden">
          {/* Header с логотипом */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">EthosLife</h1>
            <p className="text-white/80 text-sm mt-1">Ваша экосистема здоровья</p>
          </div>

          <CardContent className="p-6 space-y-4">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setLocation('/forgot-password')}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Забыли пароль?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Войти
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">или войдите через</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium"
                onClick={handleGoogleLogin}
              >
                <Chrome className="mr-2 w-5 h-5 text-red-500" />
                Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                onClick={handleTelegramLogin}
              >
                <MessageCircle className="mr-2 w-5 h-5 text-blue-500" />
                Telegram
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Нет аккаунта?{' '}
                <button
                  onClick={() => setLocation('/register')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>

            <button
              onClick={() => setLocation('/')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 pt-2"
            >
              ← На главную
            </button>
          </CardContent>
        </Card>

        {/* Footer с преимуществами */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-500">Безопасно</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-500">Быстро</p>
          </div>
          <div>
            <div className="text-2xl mb-1">💚</div>
            <p className="text-xs text-gray-500">Бесплатно</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
