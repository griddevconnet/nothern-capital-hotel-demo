import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default user preferences
const DEFAULT_PREFERENCES = {
  // Display preferences
  theme: 'light', // 'light', 'dark', 'system'
  fontSize: 'medium', // 'small', 'medium', 'large'
  highContrast: false,
  reduceAnimations: false,
  
  // Notification preferences
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  
  // Privacy preferences
  analytics: true,
  personalizedAds: false,
  locationServices: false,
  
  // Accessibility preferences
  screenReader: false,
  keyboardNavigation: false,
  
  // Last updated timestamp
  lastUpdated: null,
};

// Create the user preferences context
const UserPreferencesContext = createContext();

// Create a provider component
export const UserPreferencesProvider = ({ children, initialPreferences = {} }) => {
  const [preferences, setPreferences] = useState({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          const parsedPreferences = JSON.parse(savedPreferences);
          setPreferences(prev => ({
            ...prev,
            ...parsedPreferences,
          }));
        }
      } catch (err) {
        console.error('Failed to load user preferences:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    if (isLoading) return;
    
    const savePreferences = () => {
      try {
        localStorage.setItem('userPreferences', JSON.stringify({
          ...preferences,
          lastUpdated: new Date().toISOString(),
        }));
      } catch (err) {
        console.error('Failed to save user preferences:', err);
        setError(err);
      }
    };
    
    savePreferences();
  }, [preferences, isLoading]);
  
  // Update a single preference
  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);  
  
  // Update multiple preferences at once
  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);
  
  // Reset preferences to defaults
  const resetPreferences = useCallback(() => {
    setPreferences({
      ...DEFAULT_PREFERENCES,
      lastUpdated: new Date().toISOString(),
    });
  }, []);
  
  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('theme-light', 'theme-dark');
      
      // Determine the effective theme
      let effectiveTheme = preferences.theme;
      
      if (preferences.theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
      }
      
      // Apply the theme class
      root.classList.add(`theme-${effectiveTheme}`);
      
      // Apply high contrast if enabled
      if (preferences.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
      
      // Apply reduced motion if enabled
      if (preferences.reduceAnimations) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
      
      // Apply font size
      root.style.setProperty('--font-size-base', getFontSizeValue(preferences.fontSize));
    };
    
    applyTheme();
    
    // Listen for system theme changes if using system theme
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      
      return () => {
        mediaQuery.removeEventListener('change', applyTheme);
      };
    }
  }, [preferences.theme, preferences.highContrast, preferences.reduceAnimations, preferences.fontSize]);
  
  // Helper function to get font size value
  const getFontSizeValue = (size) => {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      case 'medium':
      default:
        return '16px';
    }
  };
  
  // Toggle boolean preference
  const togglePreference = useCallback((key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);
  
  // Get a preference value
  const getPreference = useCallback((key, defaultValue = null) => {
    return preferences[key] !== undefined ? preferences[key] : defaultValue;
  }, [preferences]);
  
  // Check if a preference is enabled
  const isPreferenceEnabled = useCallback((key) => {
    return !!preferences[key];
  }, [preferences]);
  
  // Context value
  const value = {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
    togglePreference,
    getPreference,
    isPreferenceEnabled,
    isLoading,
    error,
  };
  
  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook to use the user preferences context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export default UserPreferencesContext;
