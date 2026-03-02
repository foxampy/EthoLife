/**
 * Telegram WebApp Auto-Authentication
 * Автоматическая аутентификация через Telegram WebApp
 */

import { createError } from '@/utils/errorHandler';
import { API_CONFIG, ENDPOINTS } from '@/config';

/**
 * Проверка, запущено ли приложение в Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).Telegram !== 'undefined' && 
         typeof (window as any).Telegram.WebApp !== 'undefined';
}

/**
 * Инициализация Telegram WebApp
 */
export function initializeTelegramWebApp(): void {
  if (!isTelegramWebApp()) return;

  const tg = (window as any).Telegram.WebApp;
  
  // Разворачиваем на весь экран
  tg.expand();
  
  // Настраиваем цвета под тему Telegram
  tg.setHeaderColor(getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim() || '#ffffff');
  
  // Готово
  tg.ready();
}

/**
 * Получение данных пользователя из Telegram
 */
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export function getTelegramUser(): TelegramUser | null {
  if (!isTelegramWebApp()) return null;

  const tg = (window as any).Telegram.WebApp;
  const user = tg.initDataUnsafe?.user;

  if (!user) return null;

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    language_code: user.language_code,
    photo_url: user.photo_url,
  };
}

/**
 * Валидация Telegram initData через backend
 * Это критически важно для безопасности!
 */
export async function validateTelegramInitData(initData: string): Promise<{
  valid: boolean;
  user?: TelegramUser;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.TELEGRAM}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Validation failed' }));
      return { valid: false, error: error.error };
    }

    const data = await response.json();
    return {
      valid: true,
      user: data.user,
    };
  } catch (error) {
    console.error('Telegram validation error:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Автоматическая аутентификация через Telegram
 * 1. Получаем initData
 * 2. Валидируем через backend
 * 3. Сохраняем токен
 * 4. Возвращаем пользователя
 */
export async function authenticateWithTelegram(): Promise<{
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
  isNewUser?: boolean;
}> {
  try {
    if (!isTelegramWebApp()) {
      return {
        success: false,
        error: 'Not running in Telegram WebApp',
      };
    }

    const tg = (window as any).Telegram.WebApp;
    const initData = tg.initData;

    if (!initData) {
      return {
        success: false,
        error: 'No initData from Telegram',
      };
    }

    // Валидация и аутентификация через backend
    const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.TELEGRAM}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Auth failed' }));
      return {
        success: false,
        error: error.error || 'Authentication failed',
      };
    }

    const data = await response.json();
    
    // Сохраняем токен
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
      isNewUser: data.isNewUser || false,
    };
  } catch (error) {
    console.error('Telegram auth error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Auto-auth flow для Telegram
 * Используется в App.tsx или специальном роутере
 */
export async function handleTelegramAutoAuth(
  onAuthenticated: (user: any, isNewUser: boolean) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    // Проверяем, в Telegram ли мы
    if (!isTelegramWebApp()) {
      onError('Not in Telegram WebApp');
      return;
    }

    // Инициализируем
    initializeTelegramWebApp();

    // Проверяем, есть ли уже токен
    const existingToken = localStorage.getItem('auth_token');
    if (existingToken) {
      // Токен есть, пробуем войти автоматически
      const result = await authenticateWithTelegram();
      if (result.success && result.user) {
        onAuthenticated(result.user, result.isNewUser || false);
        return;
      }
      // Токен невалиден, продолжаем аутентификацию
    }

    // Аутентифицируемся через Telegram
    const result = await authenticateWithTelegram();
    
    if (result.success && result.user) {
      onAuthenticated(result.user, result.isNewUser || false);
    } else {
      onError(result.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('Auto auth error:', error);
    onError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Share invite link через Telegram
 */
export async function shareInviteLink(inviteUrl: string): Promise<boolean> {
  if (!isTelegramWebApp()) {
    // Открываем в новом окне
    window.open(inviteUrl, '_blank');
    return true;
  }

  const tg = (window as any).Telegram.WebApp;
  
  try {
    // Используем Telegram Share
    tg.switchInlineQuery(inviteUrl);
    return true;
  } catch (error) {
    console.error('Share error:', error);
    window.open(inviteUrl, '_blank');
    return true;
  }
}

/**
 * Закрытие Telegram WebApp
 */
export function closeTelegramApp(): void {
  if (isTelegramWebApp()) {
    (window as any).Telegram.WebApp.close();
  }
}

/**
 * Показываем подтверждение в Telegram
 */
export function showTelegramConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isTelegramWebApp()) {
      resolve(window.confirm(message));
      return;
    }

    const tg = (window as any).Telegram.WebApp;
    tg.showConfirm(message, resolve);
  });
}

/**
 * Показываем alert в Telegram
 */
export function showTelegramAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    if (!isTelegramWebApp()) {
      alert(message);
      resolve();
      return;
    }

    const tg = (window as any).Telegram.WebApp;
    tg.showAlert(message, resolve);
  });
}

export default {
  isTelegramWebApp,
  initializeTelegramWebApp,
  getTelegramUser,
  validateTelegramInitData,
  authenticateWithTelegram,
  handleTelegramAutoAuth,
  shareInviteLink,
  closeTelegramApp,
  showTelegramConfirm,
  showTelegramAlert,
};
