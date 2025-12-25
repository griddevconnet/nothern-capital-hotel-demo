import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ANALYTICS_SETTINGS = {
  enabled: true,
  trackPageViews: true,
  trackEvents: true,
  trackErrors: true,
  debug: false,
  userId: null,
  sessionId: null,
  firstVisit: null,
  lastVisit: null,
  pageCount: 0,
};

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children, config = {} }) => {
  const [settings, setSettings] = useState({ ...DEFAULT_ANALYTICS_SETTINGS, ...config });
  const [eventsQueue, setEventsQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize analytics
  const initialize = useCallback(() => {
    if (isInitialized) return;

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('analyticsSettings');
    if (savedSettings) {
      setSettings(prev => ({
        ...prev,
        ...JSON.parse(savedSettings),
        lastUpdated: new Date().toISOString(),
      }));
    }

    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsInitialized(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInitialized]);

  // Track page view
  const trackPageView = useCallback((path = window.location.pathname, title = document.title) => {
    if (!settings.enabled || !settings.trackPageViews) return;

    const event = {
      type: 'pageview',
      path,
      title,
      timestamp: new Date().toISOString(),
      userId: settings.userId,
      sessionId: settings.sessionId,
    };

    if (isOnline) {
      console.log('[Analytics] Page view:', event);
      // In a real app: sendEventToServer(event);
    } else {
      setEventsQueue(prev => [...prev, event]);
    }
  }, [isOnline, settings]);

  // Track custom event
  const trackEvent = useCallback((category, action, label = null, value = null, customData = {}) => {
    if (!settings.enabled || !settings.trackEvents) return;

    const event = {
      type: 'event',
      category,
      action,
      label,
      value,
      ...customData,
      timestamp: new Date().toISOString(),
      userId: settings.userId,
      sessionId: settings.sessionId,
    };

    if (isOnline) {
      console.log('[Analytics] Event:', event);
      // In a real app: sendEventToServer(event);
    } else {
      setEventsQueue(prev => [...prev, event]);
    }
  }, [isOnline, settings]);

  // Track error
  const trackError = useCallback((error, fatal = false, extra = {}) => {
    if (!settings.enabled || !settings.trackErrors) return;

    const event = {
      type: 'error',
      name: error.name,
      message: error.message,
      stack: error.stack,
      fatal,
      ...extra,
      timestamp: new Date().toISOString(),
      userId: settings.userId,
      sessionId: settings.sessionId,
    };

    if (isOnline) {
      console.error('[Analytics] Error:', event);
      // In a real app: sendEventToServer(event);
    } else {
      setEventsQueue(prev => [...prev, event]);
    }
  }, [isOnline, settings]);

  // Set user ID
  const setUserId = useCallback((userId) => {
    const newSettings = {
      ...settings,
      userId,
      lastUpdated: new Date().toISOString(),
    };
    
    setSettings(newSettings);
    localStorage.setItem('analyticsSettings', JSON.stringify(newSettings));
  }, [settings]);

  // Initialize on mount
  useEffect(() => {
    const cleanup = initialize();
    return () => cleanup && cleanup();
  }, [initialize]);

  // Process queued events when coming back online
  useEffect(() => {
    if (isOnline && eventsQueue.length > 0) {
      // In a real app: processEventsQueue();
      console.log(`[Analytics] ${eventsQueue.length} events in queue`);
      setEventsQueue([]);
    }
  }, [isOnline, eventsQueue.length]);

  return (
    <AnalyticsContext.Provider
      value={{
        ...settings,
        trackPageView,
        trackEvent,
        trackError,
        setUserId,
        isOnline,
        isInitialized,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;
