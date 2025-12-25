import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

// Default notification options
const DEFAULT_OPTIONS = {
  type: NOTIFICATION_TYPES.INFO,
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  pauseOnFocusLoss: true,
  closeButton: true,
  icon: null,
  isLoading: false,
  action: null,
  actionLabel: '',
  onAction: null,
  onClose: null,
  className: '',
  style: {},
  bodyClassName: '',
  bodyStyle: {},
  progressClassName: '',
  progressStyle: {},
  transition: 'bounce',
  rtl: false,
  newestOnTop: true,
};

// Create the notifications context
const NotificationsContext = createContext();

// Create a provider component
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef(null);
  const autoDismissTimeouts = useRef({});
  
  // Create a new notification
  const notify = useCallback((message, options = {}) => {
    const id = options.id || uuidv4();
    const notificationOptions = { ...DEFAULT_OPTIONS, ...options };
    
    const newNotification = {
      id,
      message,
      ...notificationOptions,
      createdAt: Date.now(),
      isVisible: true,
    };
    
    setNotifications(prev => {
      // If notification with this ID already exists, update it
      const exists = prev.some(n => n.id === id);
      if (exists) {
        return prev.map(n => n.id === id ? { ...n, ...newNotification } : n);
      }
      
      // Otherwise, add the new notification
      return notificationOptions.newestOnTop 
        ? [newNotification, ...prev] 
        : [...prev, newNotification];
    });
    
    // Set up auto-dismissal if autoClose is enabled
    if (notificationOptions.autoClose && !notificationOptions.isLoading) {
      clearTimeout(autoDismissTimeouts.current[id]);
      
      autoDismissTimeouts.current[id] = setTimeout(() => {
        if (!paused) {
          dismissNotification(id);
        }
      }, notificationOptions.autoClose);
    }
    
    return id;
  }, [paused]);
  
  // Helper methods for different notification types
  const success = useCallback((message, options = {}) => {
    return notify(message, { ...options, type: NOTIFICATION_TYPES.SUCCESS });
  }, [notify]);
  
  const error = useCallback((message, options = {}) => {
    return notify(message, { ...options, type: NOTIFICATION_TYPES.ERROR });
  }, [notify]);
  
  const warning = useCallback((message, options = {}) => {
    return notify(message, { ...options, type: NOTIFICATION_TYPES.WARNING });
  }, [notify]);
  
  const info = useCallback((message, options = {}) => {
    return notify(message, { ...options, type: NOTIFICATION_TYPES.INFO });
  }, [notify]);
  
  const loading = useCallback((message, options = {}) => {
    return notify(message, { 
      ...options, 
      type: NOTIFICATION_TYPES.LOADING,
      autoClose: false,
      isLoading: true,
    });
  }, [notify]);
  
  // Update an existing notification
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, ...updates, updatedAt: Date.now() } 
          : notification
      )
    );
    
    // If autoClose is being updated, reset the timeout
    if (updates.autoClose !== undefined) {
      clearTimeout(autoDismissTimeouts.current[id]);
      
      if (updates.autoClose && !paused) {
        autoDismissTimeouts.current[id] = setTimeout(() => {
          dismissNotification(id);
        }, updates.autoClose);
      }
    }
  }, [paused]);
  
  // Dismiss a specific notification
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isVisible: false } 
          : notification
      )
    );
    
    // Clean up the notification after the exit animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      clearTimeout(autoDismissTimeouts.current[id]);
      delete autoDismissTimeouts.current[id];
    }, 300); // Match this with your CSS transition duration
  }, []);
  
  // Dismiss all notifications
  const dismissAllNotifications = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.isVisible 
          ? { ...notification, isVisible: false } 
          : notification
      )
    );
    
    // Clean up all notifications after the exit animation
    setTimeout(() => {
      setNotifications([]);
      
      // Clear all timeouts
      Object.keys(autoDismissTimeouts.current).forEach(id => {
        clearTimeout(autoDismissTimeouts.current[id]);
      });
      
      autoDismissTimeouts.current = {};
    }, 300);
  }, []);
  
  // Pause all timeouts when the mouse enters the container
  const pauseNotifications = useCallback(() => {
    setPaused(true);
    
    // Pause all auto-dismiss timeouts
    Object.keys(autoDismissTimeouts.current).forEach(id => {
      const notification = notifications.find(n => n.id === id);
      if (notification) {
        const remainingTime = notification.autoClose - (Date.now() - notification.createdAt);
        clearTimeout(autoDismissTimeouts.current[id]);
        autoDismissTimeouts.current[id] = {
          remainingTime,
          timeoutId: null,
        };
      }
    });
  }, [notifications]);
  
  // Resume all timeouts when the mouse leaves the container
  const resumeNotifications = useCallback(() => {
    setPaused(false);
    
    // Resume all paused timeouts
    Object.keys(autoDismissTimeouts.current).forEach(id => {
      const timeoutData = autoDismissTimeouts.current[id];
      
      if (timeoutData && typeof timeoutData === 'object' && 'remainingTime' in timeoutData) {
        clearTimeout(timeoutData.timeoutId);
        
        autoDismissTimeouts.current[id] = setTimeout(() => {
          dismissNotification(id);
        }, timeoutData.remainingTime);
      }
    });
  }, [dismissNotification]);
  
  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(autoDismissTimeouts.current).forEach(timeoutId => {
        if (timeoutId && typeof timeoutId === 'number') {
          clearTimeout(timeoutId);
        } else if (timeoutId && typeof timeoutId === 'object' && timeoutId.timeoutId) {
          clearTimeout(timeoutId.timeoutId);
        }
      });
    };
  }, []);
  
  // Value to be provided by the context
  const value = {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    loading,
    updateNotification,
    dismissNotification,
    dismissAllNotifications,
    pauseNotifications,
    resumeNotifications,
    isPaused: paused,
    containerRef,
  };
  
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// Export notification types
export { NOTIFICATION_TYPES };

export default NotificationsContext;
