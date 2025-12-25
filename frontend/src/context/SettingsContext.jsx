import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default settings
const DEFAULT_SETTINGS = {
  // Theme settings
  theme: 'light', // 'light' or 'dark'
  primaryColor: '#1a365d', // Primary brand color
  secondaryColor: '#d4af37', // Secondary/accent color
  
  // Layout settings
  layout: 'default', // 'default', 'compact', 'comfortable'
  navbarPosition: 'top', // 'top' or 'side'
  footerVisible: true,
  
  // Notification settings
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  
  // Privacy settings
  analytics: true,
  personalizedAds: false,
  
  // Currency and units
  currency: 'USD',
  temperatureUnit: 'celsius', // 'celsius' or 'fahrenheit'
  distanceUnit: 'metric', // 'metric' or 'imperial'
  
  // Accessibility
  fontSize: 'medium', // 'small', 'medium', 'large'
  highContrast: false,
  reduceMotion: false,
  
  // Language and region
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timeFormat: '12h', // '12h' or '24h'
  dateFormat: 'MM/DD/YYYY',
  
  // Last updated timestamp
  updatedAt: new Date().toISOString(),
};

// Create the settings context
const SettingsContext = createContext();

// Create a provider component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Merge with defaults to ensure all settings exist
        setSettings(prev => ({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
          // Don't override the updatedAt from saved settings
          updatedAt: parsedSettings.updatedAt || prev.updatedAt,
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Save settings to localStorage and apply them
  useEffect(() => {
    if (isLoading) return; // Skip initial render
    
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      applySettings(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings, isLoading]);
  
  // Apply settings to the document
  const applySettings = useCallback((newSettings) => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', newSettings.theme);
    
    // Apply primary and secondary colors as CSS variables
    document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', newSettings.secondaryColor);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    document.documentElement.style.fontSize = fontSizeMap[newSettings.fontSize] || '16px';
    
    // Apply high contrast
    if (newSettings.highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
    
    // Apply reduced motion
    if (newSettings.reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduce-motion');
    }
    
    // Notify other components that settings have changed
    window.dispatchEvent(new Event('appSettingsChanged'));
  }, []);
  
  // Update a specific setting
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  }, []);
  
  // Update multiple settings at once
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }));
  }, []);
  
  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings({
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString(),
    });
  }, []);
  
  // Toggle a boolean setting
  const toggleSetting = useCallback((key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
      updatedAt: new Date().toISOString(),
    }));
  }, []);
  
  // Save settings to the server (in a real app)
  const saveSettingsToServer = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      // In a real app, you would make an API call here
      // await api.put('/user/settings', settings);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings to server:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSaving(false);
    }
  }, [settings, isSaving]);
  
  // Value to be provided by the context
  const value = {
    settings,
    isLoading,
    isSaving,
    updateSetting,
    updateSettings,
    resetSettings,
    toggleSetting,
    saveSettingsToServer,
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
