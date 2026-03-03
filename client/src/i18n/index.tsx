import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import en from './locales/en.json';
import ru from './locales/ru.json';

export type Locale = 'en' | 'ru';

const locales: Record<Locale, Record<string, any>> = {
  en,
  ru,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // English is default (primary) language
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale') as Locale;
    // Always default to English if not set
    const initialLocale = saved || 'en';
    document.documentElement.lang = initialLocale;
    return initialLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value = locales[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (value === undefined) {
      // Fallback to English
      value = locales.en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    
    if (typeof value !== 'string') return key;
    
    // Replace parameters
    if (params) {
      return Object.entries(params).reduce(
        (acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), String(val)),
        value
      );
    }
    
    return value;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// Hook for translations only
export function useTranslation() {
  const { t, locale } = useI18n();
  return { t, locale };
}
