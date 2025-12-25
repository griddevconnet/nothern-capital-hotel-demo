import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default notification duration (in milliseconds)
const DEFAULT_DURATION = 5000;

// Create the notification context
const NotificationContext = createContext();

// Create a provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeouts = useRef({});

  // Clear a notification after its duration
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
    // Clear the timeout if it exists
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
  }, []);

  // Add a new notification
  const addNotification = useCallback(
    (message, type = NOTIFICATION_TYPES.INFO, duration = DEFAULT_DURATION) => {
      const id = uuidv4();
      const notification = { id, message, type };
      
      setNotifications((prev) => [...prev, notification]);
      
      // Set auto-dismiss timer if duration is greater than 0
      if (duration > 0) {
        timeouts.current[id] = setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
      
      return id;
    },
    [removeNotification]
  );

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    // Clear all timeouts
    Object.values(timeouts.current).forEach(clearTimeout);
    timeouts.current = {};
    
    // Clear notifications
    setNotifications([]);
  }, []); 

  // Add specific notification type helpers
  const notifySuccess = useCallback(
    (message, duration = DEFAULT_DURATION) => 
      addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration),
    [addNotification]
  );

  const notifyError = useCallback(
    (message, duration = DEFAULT_DURATION) => 
      addNotification(message, NOTIFICATION_TYPES.ERROR, duration),
    [addNotification]
  );

  const notifyWarning = useCallback(
    (message, duration = DEFAULT_DURATION) => 
      addNotification(message, NOTIFICATION_TYPES.WARNING, duration),
    [addNotification]
  );

  const notifyInfo = useCallback(
    (message, duration = DEFAULT_DURATION) => 
      addNotification(message, NOTIFICATION_TYPES.INFO, duration),
    [addNotification]
  );

  // Clean up timeouts when the component unmounts
  useEffect(() => {
    return () => {
      // Clear all timeouts on unmount
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  // Value to be provided by the context
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    NOTIFICATION_TYPES,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
