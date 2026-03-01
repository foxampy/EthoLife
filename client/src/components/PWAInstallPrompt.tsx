import { useEffect, useState } from 'react';
import { Download, X, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTooltip, setShowIOSTooltip] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle install prompt for Android/Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show prompt after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        const hasSeenIOSPrompt = localStorage.getItem('ethoslife-ios-prompt');
        if (!hasSeenIOSPrompt) {
          setIsVisible(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSTooltip(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
      setIsInstalled(true);
    } else {
      console.log('User dismissed PWA install');
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (isIOS) {
      localStorage.setItem('ethoslife-ios-prompt', 'true');
    }
  };

  if (isInstalled || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-100 dark:border-emerald-900 p-4 z-50"
      >
        {/* iOS Install Tooltip */}
        {showIOSTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 text-white p-3 rounded-xl text-sm"
          >
            <p className="font-medium mb-1">To install on iOS:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>Tap the Share button <span className="inline-block">⎋</span></li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-slate-800" />
          </motion.div>
        )}

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
            {isIOS ? (
              <Smartphone className="w-6 h-6 text-white" />
            ) : (
              <Download className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {isIOS ? 'Add EthoLife to Home Screen' : 'Install EthoLife App'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {isIOS 
                ? 'Get quick access and use offline mode'
                : 'Install for quick access, offline mode & better experience'
              }
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <Button 
                size="sm" 
                onClick={handleInstall}
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 text-xs"
              >
                {isIOS ? 'Show Me How' : 'Install'}
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 text-xs"
              >
                Later
              </Button>
            </div>

            {!isIOS && (
              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Offline
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Fast
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  No stores
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to detect if running as PWA
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
      setIsPWA(isStandalone);
    };

    checkPWA();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);
    
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkPWA);
    };
  }, []);

  return isPWA;
}

// Hook to detect online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
