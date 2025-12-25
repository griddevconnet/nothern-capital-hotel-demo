import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default appearance settings
const DEFAULT_APPEARANCE = {
  theme: 'light', // 'light' | 'dark' | 'system'
  primaryColor: '#1a365d', // Primary brand color
  secondaryColor: '#d4af37', // Secondary/accent color
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 'base', // 'sm', 'base', 'lg'
  borderRadius: 'md', // 'none', 'sm', 'md', 'lg', 'full'
  density: 'normal', // 'compact', 'normal', 'comfortable'
  motion: 'reduced', // 'reduced', 'normal'
  highContrast: false,
  reducedTransparency: false,
  textSize: 'normal', // 'small', 'normal', 'large', 'xlarge'
  colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'
  darkModeSchedule: 'system', // 'system', 'sunsetToSunrise', 'custom', 'alwaysOn', 'alwaysOff'
  customDarkModeStart: '18:00', // 24h format
  customDarkModeEnd: '07:00', // 24h format
  lastUpdated: null,
};

// Create the appearance context
const AppearanceContext = createContext();

// Create a provider component
export const AppearanceProvider = ({ children }) => {
  const [appearance, setAppearance] = useState(DEFAULT_APPEARANCE);
  const [isLoading, setIsLoading] = useState(true);
  const [systemDarkMode, setSystemDarkMode] = useState(false);
  
  // Load appearance settings from localStorage
  const loadAppearance = useCallback(() => {
    try {
      const savedAppearance = localStorage.getItem('appearanceSettings');
      if (savedAppearance) {
        setAppearance(JSON.parse(savedAppearance));
      }
    } catch (error) {
      console.error('Failed to load appearance settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Save appearance settings to localStorage
  const saveAppearance = useCallback((settings) => {
    try {
      localStorage.setItem('appearanceSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save appearance settings:', error);
    }
  }, []);
  
  // Update appearance settings
  const updateAppearance = useCallback((updates) => {
    setAppearance(prev => {
      const newAppearance = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      saveAppearance(newAppearance);
      applyAppearance(newAppearance);
      return newAppearance;
    });
  }, [saveAppearance]);
  
  // Reset appearance to default settings
  const resetAppearance = useCallback(() => {
    setAppearance(DEFAULT_APPEARANCE);
    saveAppearance(DEFAULT_APPEARANCE);
    applyAppearance(DEFAULT_APPEARANCE);
  }, [saveAppearance]);
  
  // Apply appearance settings to the document
  const applyAppearance = useCallback((settings) => {
    const root = document.documentElement;
    
    // Apply theme
    const isDarkMode = getEffectiveDarkMode(settings);
    document.body.classList.toggle('dark', isDarkMode);
    
    // Apply CSS custom properties
    root.style.setProperty('--primary', settings.primaryColor);
    root.style.setProperty('--secondary', settings.secondaryColor);
    root.style.setProperty('--font-family', settings.fontFamily);
    
    // Apply color blind mode
    applyColorBlindMode(settings.colorBlindMode);
    
    // Apply reduced motion
    if (settings.motion === 'reduced') {
      document.documentElement.style.setProperty('--motion-safe', 'none');
    } else {
      document.documentElement.style.removeProperty('--motion-safe');
    }
    
    // Apply high contrast
    document.body.classList.toggle('high-contrast', settings.highContrast);
    
    // Apply reduced transparency
    document.body.classList.toggle('reduced-transparency', settings.reducedTransparency);
    
    // Apply text size
    const textSizeMap = {
      'small': '14px',
      'normal': '16px',
      'large': '18px',
      'xlarge': '20px',
    };
    root.style.setProperty('--text-base', textSizeMap[settings.textSize] || '16px');
    
  }, []);
  
  // Get effective dark mode based on schedule
  const getEffectiveDarkMode = useCallback((settings) => {
    if (settings.darkModeSchedule === 'alwaysOn') return true;
    if (settings.darkModeSchedule === 'alwaysOff') return false;
    if (settings.darkModeSchedule === 'system') return systemDarkMode;
    
    if (settings.darkModeSchedule === 'sunsetToSunrise') {
      // This would use a sunset/sunrise API in a real app
      const hours = new Date().getHours();
      return hours < 7 || hours >= 18; // Simplified for demo
    }
    
    if (settings.darkModeSchedule === 'custom') {
      const [startHour, startMinute] = settings.customDarkModeStart.split(':').map(Number);
      const [endHour, endMinute] = settings.customDarkModeEnd.split(':').map(Number);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const currentTime = currentHour * 60 + currentMinute;
      
      // Handle overnight range (e.g., 18:00 to 07:00)
      if (startTime > endTime) {
        return currentTime >= startTime || currentTime < endTime;
      }
      
      // Handle same-day range
      return currentTime >= startTime && currentTime < endTime;
    }
    
    return false;
  }, [systemDarkMode]);
  
  // Apply color blind mode filters
  const applyColorBlindMode = useCallback((mode) => {
    const root = document.documentElement;
    
    // Remove any existing filters
    root.style.filter = '';
    
    // Apply appropriate filter based on color blindness type
    const filters = {
      none: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)',
      achromatopsia: 'url(#achromatopsia)',
    };
    
    if (mode && mode !== 'none') {
      root.style.filter = filters[mode] || 'none';
    }
  }, []);
  
  // Watch for system color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      setSystemDarkMode(e.matches);
    };
    
    // Set initial value
    setSystemDarkMode(mediaQuery.matches);
    
    // Add listener
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);
  
  // Apply appearance settings on mount and when they change
  useEffect(() => {
    if (!isLoading) {
      applyAppearance(appearance);
    }
  }, [appearance, isLoading, applyAppearance]);
  
  // Load appearance settings on mount
  useEffect(() => {
    loadAppearance();
  }, [loadAppearance]);
  
  // Value to be provided by the context
  const value = {
    ...appearance,
    isLoading,
    systemDarkMode,
    isDarkMode: getEffectiveDarkMode(appearance),
    updateAppearance,
    resetAppearance,
    getEffectiveDarkMode,
  };
  
  return (
    <AppearanceContext.Provider value={value}>
      {/* Add SVG filters for color blind modes */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="protanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
          <filter id="achromatopsia" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>
      {children}
    </AppearanceContext.Provider>
  );
};

// Custom hook to use the appearance context
export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};

export default AppearanceContext;
