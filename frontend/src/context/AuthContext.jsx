import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from '../services/api/auth';

// Create the auth context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultRouteForUser = (u) => {
    const roles = u?.roles || (u?.role ? [u.role] : []);
    if (roles.includes('ADMIN')) return '/admin';
    if (roles.includes('RECEPTIONIST')) return '/reception';
    return '/my-bookings';
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const { token, user: userData } = await loginApi(credentials);
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Redirect to the dashboard or the previous page
      const from = location.state?.from?.pathname || getDefaultRouteForUser(userData);
      navigate(from, { replace: true });
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const { token, user: newUser } = await registerApi(userData);
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Redirect to the dashboard
      navigate(getDefaultRouteForUser(newUser), { replace: true });
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    logoutApi();
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    navigate('/login');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData
    }));
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => roles.includes(role));
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has all the specified permissions
  const hasAllPermissions = (permissions) => {
    if (!user || !user.permissions) return false;
    return permissions.every(perm => user.permissions.includes(perm));
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions) return false;
    return user.permissions.some(perm => permissions.includes(perm));
  };

  // Value to be provided by the context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getDefaultRouteForUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
