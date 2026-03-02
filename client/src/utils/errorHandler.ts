/**
 * Централизованная обработка ошибок
 * Единая точка для всех ошибок приложения
 */

import { ERROR_MESSAGES } from '@/config';

export type ErrorCode = 
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_TOKEN_INVALID'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_FORBIDDEN'
  | 'NETWORK_TIMEOUT'
  | 'NETWORK_OFFLINE'
  | 'NETWORK_SERVER_ERROR'
  | 'NETWORK_INVALID_RESPONSE'
  | 'VALIDATION_REQUIRED'
  | 'VALIDATION_INVALID_EMAIL'
  | 'VALIDATION_INVALID_PHONE'
  | 'VALIDATION_PASSWORD_TOO_SHORT'
  | 'VALIDATION_PASSWORDS_MISMATCH'
  | 'GENERIC_UNKNOWN'
  | string;

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  timestamp: string;
  url?: string;
}

/**
 * Создание стандартизированной ошибки
 */
export function createError(
  code: ErrorCode,
  customMessage?: string,
  details?: any
): AppError {
  const defaultMessage = getErrorMessage(code);
  
  return {
    code,
    message: customMessage || defaultMessage,
    details,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };
}

/**
 * Получение сообщения об ошибке по коду
 */
export function getErrorMessage(code: ErrorCode): string {
  // Auth errors
  if (code.startsWith('AUTH_')) {
    const authCode = code as keyof typeof ERROR_MESSAGES.AUTH;
    return ERROR_MESSAGES.AUTH[authCode] || ERROR_MESSAGES.GENERIC.UNKNOWN;
  }
  
  // Network errors
  if (code.startsWith('NETWORK_')) {
    const networkCode = code as keyof typeof ERROR_MESSAGES.NETWORK;
    return ERROR_MESSAGES.NETWORK[networkCode] || ERROR_MESSAGES.GENERIC.UNKNOWN;
  }
  
  // Validation errors
  if (code.startsWith('VALIDATION_')) {
    const validationCode = code as keyof typeof ERROR_MESSAGES.VALIDATION;
    return ERROR_MESSAGES.VALIDATION[validationCode] || ERROR_MESSAGES.GENERIC.UNKNOWN;
  }
  
  // Generic errors
  const genericCode = code as keyof typeof ERROR_MESSAGES.GENERIC;
  return ERROR_MESSAGES.GENERIC[genericCode] || ERROR_MESSAGES.GENERIC.UNKNOWN;
}

/**
 * Обработка fetch ошибок
 */
export async function handleFetchError(response: Response): Promise<AppError> {
  const status = response.status;
  
  try {
    const data = await response.json();
    
    if (status === 401) {
      return createError('AUTH_UNAUTHORIZED', data.error);
    }
    
    if (status === 403) {
      return createError('AUTH_FORBIDDEN', data.error);
    }
    
    if (status === 400) {
      return createError('VALIDATION_REQUIRED', data.error);
    }
    
    if (status >= 500) {
      return createError('NETWORK_SERVER_ERROR', data.error);
    }
    
    return createError('GENERIC_UNKNOWN', data.error);
  } catch {
    return createError('NETWORK_INVALID_RESPONSE', `HTTP ${status}`);
  }
}

/**
 * Обработка сетевых ошибок
 */
export function handleNetworkError(error: unknown): AppError {
  if (error instanceof TypeError) {
    if (error.message.includes('fetch')) {
      return createError('NETWORK_OFFLINE', 'Нет подключения к интернету');
    }
    if (error.message.includes('timeout')) {
      return createError('NETWORK_TIMEOUT', 'Превышено время ожидания');
    }
  }
  
  return createError('GENERIC_UNKNOWN', error instanceof Error ? error.message : 'Неизвестная ошибка');
}

/**
 * Валидация email
 */
export function validateEmail(email: string): AppError | null {
  if (!email || !email.trim()) {
    return createError('VALIDATION_REQUIRED', 'Email обязателен');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return createError('VALIDATION_INVALID_EMAIL', 'Неверный формат email');
  }
  
  return null;
}

/**
 * Валидация пароля
 */
export function validatePassword(password: string, confirmPassword?: string): AppError | null {
  if (!password || !password.trim()) {
    return createError('VALIDATION_REQUIRED', 'Пароль обязателен');
  }
  
  if (password.length < 6) {
    return createError('VALIDATION_PASSWORD_TOO_SHORT', 'Пароль должен быть не менее 6 символов');
  }
  
  if (confirmPassword && password !== confirmPassword) {
    return createError('VALIDATION_PASSWORDS_MISMATCH', 'Пароли не совпадают');
  }
  
  return null;
}

/**
 * Логгер ошибок (для разработки)
 */
export function logError(error: AppError | unknown, context?: string) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  console.group(`❌ Error${context ? `: ${context}` : ''}`);
  
  if (error instanceof AppError || (error as AppError).code) {
    const appError = error as AppError;
    console.log('Code:', appError.code);
    console.log('Message:', appError.message);
    console.log('Details:', appError.details);
    console.log('Timestamp:', appError.timestamp);
    console.log('URL:', appError.url);
  } else if (error instanceof Error) {
    console.log('Name:', error.name);
    console.log('Message:', error.message);
    console.log('Stack:', error.stack);
  } else {
    console.log('Error:', error);
  }
  
  console.groupEnd();
}

/**
 * Toast уведомления для ошибок
 */
export function showErrorToast(error: AppError | string, toastFn?: (opts: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void) {
  if (!toastFn) {
    console.error('Toast function not provided');
    return;
  }
  
  const message = typeof error === 'string' ? error : error.message;
  const title = typeof error === 'string' ? 'Ошибка' : getErrorTitle(error.code);
  
  toastFn({
    title,
    description: message,
    variant: 'destructive',
  });
}

/**
 * Получение заголовка для ошибки
 */
function getErrorTitle(code: ErrorCode): string {
  if (code.startsWith('AUTH_')) return 'Ошибка авторизации';
  if (code.startsWith('NETWORK_')) return 'Ошибка сети';
  if (code.startsWith('VALIDATION_')) return 'Ошибка валидации';
  return 'Ошибка';
}

/**
 * Retry logic для API запросов
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw handleNetworkError(error);
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

/**
 * Проверка онлайн статуса
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Wait for online status
 */
export function waitForOnline(timeout: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (navigator.onLine) {
      resolve();
      return;
    }
    
    const onOnline = () => {
      cleanup();
      resolve();
    };
    
    const onTimeout = () => {
      cleanup();
      reject(createError('NETWORK_OFFLINE', 'Превышено время ожидания подключения'));
    };
    
    const cleanup = () => {
      window.removeEventListener('online', onOnline);
      clearTimeout(timeoutId);
    };
    
    const timeoutId = setTimeout(onTimeout, timeout);
    window.addEventListener('online', onOnline, { once: true });
  });
}

export default {
  createError,
  getErrorMessage,
  handleFetchError,
  handleNetworkError,
  validateEmail,
  validatePassword,
  logError,
  showErrorToast,
  retryRequest,
  isOnline,
  waitForOnline,
};
