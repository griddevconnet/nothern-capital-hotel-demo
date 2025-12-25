import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';

// Import translations
import enMessages from '../locales/en.json';
import esMessages from '../locales/es.json';
import frMessages from '../locales/fr.json';

// Available languages
const LOCALES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    messages: enMessages,
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    messages: esMessages,
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    messages: frMessages,
  },
};

// Default locale
const DEFAULT_LOCALE = 'en';

// Create the locale context
const LocaleContext = createContext();

// Create a provider component
export const LocaleProvider = ({ children }) => {
  const router = useRouter();
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [messages, setMessages] = useState(LOCALES[DEFAULT_LOCALE].messages);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved locale from localStorage or browser settings
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    const browserLocale = navigator.language.split('-')[0];
    
    // Check if the saved/browser locale is supported
    const initialLocale = 
      (savedLocale && LOCALES[savedLocale]) || 
      (LOCALES[browserLocale] && browserLocale) || 
      DEFAULT_LOCALE;
    
    setLocale(initialLocale);
    setMessages(LOCALES[initialLocale].messages);
  }, []);

  // Update HTML lang attribute when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Change locale
  const changeLocale = useCallback(async (newLocale) => {
    if (!LOCALES[newLocale] || newLocale === locale) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, you might load translations dynamically here
      // const messages = await import(`../locales/${newLocale}.json`);
      
      setLocale(newLocale);
      setMessages(LOCALES[newLocale].messages);
      localStorage.setItem('locale', newLocale);
      
      // Update URL if using Next.js router
      if (router) {
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: newLocale });
      }
      
      // Dispatch event that locale has changed
      window.dispatchEvent(new Event('localeChange'));
      
    } catch (error) {
      console.error('Failed to load locale:', error);
    } finally {
      setIsLoading(false);
    }
  }, [locale, router]);

  // Format currency based on locale
  const formatCurrency = useCallback((amount, currency = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  }, [locale]);

  // Format date based on locale
  const formatDate = useCallback((date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(
      date instanceof Date ? date : new Date(date)
    );
  }, [locale]);

  // Format time based on locale
  const formatTime = useCallback((date, options = {}) => {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(
      date instanceof Date ? date : new Date(date)
    );
  }, [locale]);

  // Get available locales
  const availableLocales = Object.values(LOCALES);

  // Value to be provided by the context
  const value = {
    locale,
    locales: availableLocales,
    messages,
    isLoading,
    changeLocale,
    formatCurrency,
    formatDate,
    formatTime,
    LOCALES,
  };

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

// Custom hook to use the locale context
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export default LocaleContext;
