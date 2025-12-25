import apiClient from './config';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  // Remove token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put('/auth/me', userData);
    // Update user in localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot password request
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user preferences
export const updatePreferences = async (preferences) => {
  try {
    const response = await apiClient.put('/auth/me/preferences', { preferences });
    // Update user in localStorage
    if (response.data) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.preferences = response.data.preferences;
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (password) => {
  try {
    const response = await apiClient.post('/auth/delete-account', { password });
    // Remove token and user data from localStorage if account was deleted
    if (response.data.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
