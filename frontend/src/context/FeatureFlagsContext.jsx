import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default feature flags
const DEFAULT_FEATURE_FLAGS = {
  // UI/UX Features
  darkMode: true,
  newNavigation: false,
  enhancedSearch: true,
  
  // Booking Features
  instantBooking: true,
  splitStays: false,
  longTermStays: true,
  
  // Payment Features
  applePay: true,
  googlePay: true,
  cryptoPayments: false,
  
  // Loyalty & Membership
  loyaltyProgram: true,
  membershipTiers: false,
  
  // Experimental Features
  virtualTours: false,
  arRoomView: false,
  
  // Integration Features
  whatsappSupport: true,
  chatSupport: true,
  
  // Last fetched timestamp
  lastFetched: null,
};

// Create the feature flags context
const FeatureFlagsContext = createContext();

// Create a provider component
export const FeatureFlagsProvider = ({ children }) => {
  const [flags, setFlags] = useState(DEFAULT_FEATURE_FLAGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load feature flags from the server
  const fetchFeatureFlags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would fetch from your feature flag service
      // const response = await fetch('/api/feature-flags');
      // const data = await response.json();
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, we'll just use the defaults
      const data = DEFAULT_FEATURE_FLAGS;
      
      setFlags({
        ...DEFAULT_FEATURE_FLAGS,
        ...data,
        lastFetched: new Date().toISOString(),
      });
      
      return data;
    } catch (err) {
      console.error('Failed to fetch feature flags:', err);
      setError(err.message);
      // Fall back to default flags if fetch fails
      setFlags(DEFAULT_FEATURE_FLAGS);
      return DEFAULT_FEATURE_FLAGS;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load feature flags on mount
  useEffect(() => {
    fetchFeatureFlags();
    
    // Set up refresh interval (e.g., every 5 minutes)
    const intervalId = setInterval(fetchFeatureFlags, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchFeatureFlags]);
  
  // Check if a feature is enabled
  const isFeatureEnabled = useCallback((featureKey) => {
    return !!flags[featureKey];
  }, [flags]);
  
  // Check if all specified features are enabled
  const areFeaturesEnabled = useCallback((...featureKeys) => {
    return featureKeys.every(key => flags[key] === true);
  }, [flags]);
  
  // Check if any of the specified features are enabled
  const isAnyFeatureEnabled = useCallback((...featureKeys) => {
    return featureKeys.some(key => flags[key] === true);
  }, [flags]);
  
  // Get a variant for A/B testing
  const getVariant = useCallback((experimentKey, userId = null) => {
    // In a real app, you would use a consistent hashing algorithm
    // to assign users to variants based on the experiment key and user ID
    const variants = ['control', 'variantA', 'variantB'];
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }, []);
  
  // Manually override a feature flag (for testing)
  const overrideFlag = useCallback((key, value) => {
    setFlags(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // In a real app, you might want to persist this override
    localStorage.setItem(`featureFlag:${key}`, JSON.stringify(value));
  }, []);
  
  // Reset all feature flags to their default values
  const resetFlags = useCallback(() => {
    setFlags(DEFAULT_FEATURE_FLAGS);
    
    // Clear any local overrides
    Object.keys(DEFAULT_FEATURE_FLAGS).forEach(key => {
      localStorage.removeItem(`featureFlag:${key}`);
    });
  }, []);
  
  // Load local overrides from localStorage
  useEffect(() => {
    const overrides = {};
    let hasOverrides = false;
    
    Object.keys(DEFAULT_FEATURE_FLAGS).forEach(key => {
      const storedValue = localStorage.getItem(`featureFlag:${key}`);
      if (storedValue !== null) {
        try {
          overrides[key] = JSON.parse(storedValue);
          hasOverrides = true;
        } catch (e) {
          console.error(`Failed to parse feature flag override for ${key}:`, e);
        }
      }
    });
    
    if (hasOverrides) {
      setFlags(prev => ({
        ...prev,
        ...overrides,
      }));
    }
  }, []);
  
  // Value to be provided by the context
  const value = {
    flags,
    isLoading,
    error,
    isFeatureEnabled,
    areFeaturesEnabled,
    isAnyFeatureEnabled,
    getVariant,
    overrideFlag,
    resetFlags,
    refreshFlags: fetchFeatureFlags,
  };
  
  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

// Custom hook to use the feature flags context
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

// Higher-Order Component for feature gating
export const withFeatureFlag = (featureKey, FallbackComponent = null) => (WrappedComponent) => {
  return function WithFeatureFlag(props) {
    const { isFeatureEnabled } = useFeatureFlags();
    
    if (!isFeatureEnabled(featureKey)) {
      return FallbackComponent ? <FallbackComponent {...props} /> : null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default FeatureFlagsContext;
