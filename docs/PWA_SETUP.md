# PWA Setup для EthoLife (Alpha версия)

**Дата:** 01.03.2026
**Цель:** Быстрый запуск без App Store / Google Play

---

## ✅ Преимущества PWA для Alpha

| Фича | Доступно |
|------|----------|
| Установка на домашний экран | ✅ |
| Push-уведомления | ✅ (Android), ⚠️ (iOS - только через Safari) |
| Офлайн работа | ✅ (с Service Worker) |
| Камера | ✅ |
| Геолокация | ✅ |
| LocalStorage / IndexedDB | ✅ |
| Apple HealthKit | ❌ (только нативное) |
| Google Fit | ⚠️ (ограниченно) |
| Фоновая синхронизация | ⚠️ (Android лучше) |

---

## 🚀 Быстрая настройка PWA (15 минут)

### 1. Установка зависимостей

```bash
npm install -D vite-plugin-pwa
```

### 2. Конфигурация vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'EthoLife - Health Ecosystem',
        short_name: 'EthoLife',
        description: 'Your personal health companion with AI insights',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['health', 'fitness', 'lifestyle'],
        screenshots: [
          {
            src: '/screenshot-1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/screenshot-2.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View your health dashboard',
            url: '/dashboard',
            icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'AI Chat',
            short_name: 'AI Chat',
            description: 'Chat with AI assistant',
            url: '/ai-chat',
            icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
          }
        ],
        related_applications: [
          {
            platform: 'webapp',
            url: 'https://ethoslife.app/manifest.json'
          }
        ],
        prefer_related_applications: false
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /api/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
});
```

### 3. Создать иконки

Создай папку `client/public/` и добавь иконки:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- apple-touch-icon.png (180x180)
- favicon.ico

**Генератор иконок:** https://pwa-asset-generator.nicepkg.cn/

### 4. HTML meta-теги (index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#10B981" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="EthoLife" />
    <meta name="description" content="Your personal health companion with AI insights" />
    <meta name="format-detection" content="telephone=no" />
    
    <!-- Icons -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
    <link rel="mask-icon" href="/mask-icon.svg" color="#10B981" />
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Splash Screens (iOS) -->
    <link rel="apple-touch-startup-image" href="/splash-2048x2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
    <link rel="apple-touch-startup-image" href="/splash-1668x2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
    <link rel="apple-touch-startup-image" href="/splash-1536x2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
    <link rel="apple-touch-startup-image" href="/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
    <link rel="apple-touch-startup-image" href="/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
    
    <title>EthoLife - Health Ecosystem</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 5. Service Worker регистрация (main.tsx)

```typescript
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { I18nProvider } from "./i18n";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// Check for PWA install prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show install button in your UI
  console.log('PWA install available');
});

// Detect if app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
});

// Check if running as standalone PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
```

### 6. PWA Install Button Component

```tsx
// client/src/components/PWAInstallButton.tsx
import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted PWA install');
    } else {
      console.log('User dismissed PWA install');
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-xl p-4 z-50 border border-emerald-100">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">Install EthoLife</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add to your home screen for quick access and offline mode
          </p>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Install
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsVisible(false)}
            >
              Later
            </Button>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### 7. Использование в App.tsx

```tsx
import { PWAInstallButton } from '@/components/PWAInstallButton';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Header />
              <Router />
              <BottomNavigation />
              <PWAInstallButton /> {/* Add this */}
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

---

## 📱 Как пользователи устанавливают PWA

### iOS (Safari)
1. Открыть сайт в Safari
2. Нажать "Share" (квадрат со стрелкой)
3. Выбрать "Add to Home Screen"
4. Нажать "Add"

### Android (Chrome)
1. Открыть сайт в Chrome
2. Нажать "⋮" (меню)
3. Выбрать "Add to Home Screen" или "Install App"
4. Нажать "Install"

### Desktop (Chrome/Edge)
1. Открыть сайт
2. В адресной строке появится иконка установки
3. Нажать "Install EthoLife"

---

## ⚠️ Ограничения PWA (Alpha версия)

| Фича | Статус | Обходной путь |
|------|--------|---------------|
| Apple HealthKit | ❌ | Ручной ввод данных |
| Google Fit | ⚠️ | REST API (ограниченно) |
| Фоновые уведомления iOS | ⚠️ | Только при открытом Safari |
| Bluetooth | ❌ | Не доступно |
| NFC | ❌ | Не доступно |

---

## 🧪 Тестирование PWA

### Локально:
```bash
npm run build
npm run preview
```

### Chrome DevTools:
1. F12 → Application → Manifest
2. Проверить все иконки
3. Application → Service Workers → Check "Offline"

### Lighthouse:
```bash
# В Chrome DevTools → Lighthouse → PWA
# Должно быть 100% по PWA категории
```

---

## 🚀 Деплой

После билда:
```bash
npm run build
```

Все файлы PWA будут в `dist/`:
- sw.js (Service Worker)
- manifest.json
- workbox-*.js

Деплой на Vercel/Netlify обычный - PWA работает автоматически!

---

**Итого:** PWA готов за 15 минут, пользователи могут "установить" приложение без маркетов! 🎉
