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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';
import { useI18n } from '@/i18n';

export default function Login() {
  const [, setLocation] = useLocation();
  const { refreshUser } = useUser();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || (window as any).GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === 'your-google-client-id') {
      setConfigError(t('errors.serverError'));
    }
  }, [t]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.user.id.toString());
        await refreshUser();
        setLocation('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('auth.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || (window as any).GOOGLE_CLIENT_ID || '';
    
    if (!clientId || clientId === 'your-google-client-id') {
      setError(t('errors.serverError'));
      console.error('VITE_GOOGLE_CLIENT_ID not configured');
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
    const authUrl = `${window.location.origin}/auth/callback`;
    
    const telegramUrl = `https://t.me/${botUsername}?start=auth_${btoa(JSON.stringify({
      redirect: authUrl,
      timestamp: Date.now()
    })).replace(/[+\/=]/g, '')}`;
    
    window.open(telegramUrl, '_blank');
    
    setError(t('auth.telegramLogin'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">EL</span>
            </div>
            <CardTitle className="text-2xl font-bold">{t('auth.loginTitle')}</CardTitle>
            <CardDescription>
              {t('auth.noAccount')} {t('nav.register')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {configError && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-sm">
                  {configError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('auth.loginButton')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">{t('auth.or')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium"
                onClick={handleGoogleLogin}
              >
                <Chrome className="mr-2 w-5 h-5 text-red-500" />
                {t('auth.googleLogin')}
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-blue-200 hover:bg-blue-50"
                onClick={handleTelegramLogin}
              >
                <MessageCircle className="mr-2 w-5 h-5 text-blue-500" />
                {t('auth.telegramLogin')}
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-slate-600">
                {t('auth.noAccount')}{' '}
                <button
                  onClick={() => setLocation('/register')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('nav.register')}
                </button>
              </p>
            </div>

            <button
              onClick={() => setLocation('/')}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-600 pt-2"
            >
              ← {t('common.back')}
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
