import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default translations
const DEFAULT_TRANSLATIONS = {
  en: {
    // Common
    'app.name': 'Northern Capital Hotel',
    'app.loading': 'Loading...',
    'app.error': 'An error occurred',
    'app.retry': 'Retry',
    'app.cancel': 'Cancel',
    'app.confirm': 'Confirm',
    'app.save': 'Save',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.close': 'Close',
    'app.back': 'Back',
    'app.next': 'Next',
    'app.previous': 'Previous',
    'app.submit': 'Submit',
    'app.search': 'Search',
    'app.clear': 'Clear',
    'app.required': 'Required',
    'app.invalid': 'Invalid',
    'app.success': 'Success',
    'app.failed': 'Failed',
    
    // Navigation
    'nav.home': 'Home',
    'nav.rooms': 'Rooms',
    'nav.amenities': 'Amenities',
    'nav.gallery': 'Gallery',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.booking': 'Book Now',
    'nav.account': 'My Account',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Booking
    'booking.title': 'Book Your Stay',
    'booking.checkIn': 'Check-in',
    'booking.checkOut': 'Check-out',
    'booking.adults': 'Adults',
    'booking.children': 'Children',
    'booking.roomType': 'Room Type',
    'booking.selectRoom': 'Select Room',
    'booking.guestInfo': 'Guest Information',
    'booking.payment': 'Payment',
    'booking.confirmation': 'Confirmation',
    'booking.bookNow': 'Book Now',
    'booking.total': 'Total',
    'booking.nights': 'nights',
    'booking.pricePerNight': 'per night',
    'booking.tax': 'Tax',
    'booking.serviceCharge': 'Service Charge',
    'booking.grandTotal': 'Grand Total',
    'booking.specialRequests': 'Special Requests',
    'booking.requestsPlaceholder': 'Any special requests or requirements',
    'booking.terms': 'I agree to the terms and conditions',
    'booking.requiredFields': 'Fields marked with * are required',
    'booking.success': 'Booking Confirmed!',
    'booking.reference': 'Reference Number',
    'booking.thankYou': 'Thank you for your booking!',
    'booking.emailSent': 'A confirmation email has been sent to',
    'booking.print': 'Print Confirmation',
    'booking.newBooking': 'New Booking',
    
    // Room Types
    'room.standard': 'Standard Room',
    'room.deluxe': 'Deluxe Room',
    'room.suite': 'Suite',
    'room.executive': 'Executive Suite',
    'room.presidential': 'Presidential Suite',
    'room.view': 'View Details',
    'room.amenities': 'Room Amenities',
    'room.size': 'Room Size',
    'room.beds': 'Beds',
    'room.maxOccupancy': 'Max Occupancy',
    'room.available': 'Available',
    'room.notAvailable': 'Not Available',
    'room.select': 'Select Room',
    'room.selected': 'Selected',
    'room.unavailable': 'Unavailable',
    
    // Form Fields
    'form.firstName': 'First Name',
    'form.lastName': 'Last Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.country': 'Country',
    'form.city': 'City',
    'form.address': 'Address',
    'form.postalCode': 'Postal Code',
    'form.paymentMethod': 'Payment Method',
    'form.cardNumber': 'Card Number',
    'form.cardName': 'Name on Card',
    'form.expiryDate': 'Expiry Date',
    'form.cvv': 'CVV',
    'form.payNow': 'Pay Now',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.phone': 'Please enter a valid phone number',
    'validation.cardNumber': 'Please enter a valid card number',
    'validation.expiryDate': 'Please enter a valid expiry date',
    'validation.cvv': 'Please enter a valid CVV',
    
    // Months
    'month.jan': 'January',
    'month.feb': 'February',
    'month.mar': 'March',
    'month.apr': 'April',
    'month.may': 'May',
    'month.jun': 'June',
    'month.jul': 'July',
    'month.aug': 'August',
    'month.sep': 'September',
    'month.oct': 'October',
    'month.nov': 'November',
    'month.dec': 'December',
    
    // Days
    'day.mon': 'Monday',
    'day.tue': 'Tuesday',
    'day.wed': 'Wednesday',
    'day.thu': 'Thursday',
    'day.fri': 'Friday',
    'day.sat': 'Saturday',
    'day.sun': 'Sunday',
    
    // Short days
    'dayShort.mon': 'Mon',
    'dayShort.tue': 'Tue',
    'dayShort.wed': 'Wed',
    'dayShort.thu': 'Thu',
    'dayShort.fri': 'Fri',
    'dayShort.sat': 'Sat',
    'dayShort.sun': 'Sun',
  },
  // Add more languages as needed
  // es: { ... },
  // fr: { ... },
};

// Default configuration
const DEFAULT_CONFIG = {
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  storageKey: 'i18n_language',
  loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to load translations
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    prefix: '{{',
    suffix: '}}',
  },
};

const I18nContext = createContext();

export const I18nProvider = ({ children, translations = {}, config = {} }) => {
  const [language, setLanguage] = useState(DEFAULT_CONFIG.defaultLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [resources, setResources] = useState({
    ...DEFAULT_TRANSLATIONS,
    ...translations,
  });
  
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  // Load language from storage or use default
  const loadLanguage = useCallback(() => {
    try {
      const savedLanguage = localStorage.getItem(finalConfig.storageKey);
      if (savedLanguage && finalConfig.supportedLanguages.includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } catch (err) {
      console.error('Failed to load language from storage:', err);
    }
  }, [finalConfig.storageKey, finalConfig.supportedLanguages]);

  // Save language to storage
  const saveLanguage = useCallback((lang) => {
    try {
      localStorage.setItem(finalConfig.storageKey, lang);
    } catch (err) {
      console.error('Failed to save language to storage:', err);
    }
  }, [finalConfig.storageKey]);

  // Change language
  const changeLanguage = useCallback(async (newLanguage) => {
    if (!finalConfig.supportedLanguages.includes(newLanguage)) {
      console.warn(`Language "${newLanguage}" is not supported`);
      return false;
    }

    if (newLanguage === language) return true;

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, you would load translations from an API or file
      // await loadTranslations(newLanguage);
      
      setLanguage(newLanguage);
      saveLanguage(newLanguage);
      
      // Update HTML lang attribute
      document.documentElement.lang = newLanguage;
      
      if (finalConfig.debug) {
        console.log(`[i18n] Language changed to: ${newLanguage}`);
      }
      
      return true;
    } catch (err) {
      console.error(`Failed to change language to ${newLanguage}:`, err);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [language, saveLanguage, finalConfig.supportedLanguages, finalConfig.debug]);

  // Translate function
  const t = useCallback((key, variables = {}) => {
    if (!key) return '';
    
    let translation = key
      .split('.')
      .reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), resources[language]);
    
    // Fallback to default language if translation not found
    if (translation === undefined && language !== finalConfig.fallbackLng) {
      translation = key
        .split('.')
        .reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : key), resources[finalConfig.fallbackLng]);
    }
    
    // If still no translation, return the key
    if (translation === undefined) {
      if (finalConfig.debug) {
        console.warn(`[i18n] Missing translation for key: ${key}`);
      }
      return key;
    }
    
    // Replace variables in the translation
    if (variables && typeof variables === 'object') {
      Object.keys(variables).forEach((varName) => {
        const varValue = variables[varName];
        const regex = new RegExp(`\\{\\{${varName}\\}}`, 'g');
        translation = translation.replace(regex, varValue);
      });
    }
    
    return translation;
  }, [language, resources, finalConfig.fallbackLng, finalConfig.debug]);

  // Format number
  const formatNumber = useCallback((value, options) => {
    return new Intl.NumberFormat(language, options).format(value);
  }, [language]);

  // Format date
  const formatDate = useCallback((date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(language, defaultOptions);
  }, [language]);

  // Format time
  const formatTime = useCallback((date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    };
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString(language, defaultOptions);
  }, [language]);

  // Format currency
  const formatCurrency = useCallback((amount, currency = 'USD', options = {}) => {
    const defaultOptions = {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    };
    
    return new Intl.NumberFormat(language, defaultOptions).format(amount);
  }, [language]);

  // Initialize
  useEffect(() => {
    if (initialized) return;
    
    loadLanguage();
    setInitialized(true);
    
    // Set HTML lang attribute
    document.documentElement.lang = language;
    
    if (finalConfig.debug) {
      console.log('[i18n] Initialized with language:', language);
    }
  }, [initialized, language, loadLanguage, finalConfig.debug]);

  // Context value
  const contextValue = {
    t,
    language,
    languages: finalConfig.supportedLanguages,
    changeLanguage,
    formatNumber,
    formatDate,
    formatTime,
    formatCurrency,
    isLoading,
    error,
    initialized,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default I18nContext;
