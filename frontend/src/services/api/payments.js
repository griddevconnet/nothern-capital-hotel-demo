import apiClient from './config';

// Process payment for a booking
export const processPayment = async (bookingId, paymentData) => {
  try {
    const response = await apiClient.post(
      `/payments/process/${bookingId}`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/payments/methods');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment details by ID
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Refund a payment
export const refundPayment = async (paymentId, amount = null) => {
  try {
    const response = await apiClient.post(`/payments/${paymentId}/refund`, {
      amount,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Save payment method
export const savePaymentMethod = async (paymentMethodData) => {
  try {
    const response = await apiClient.post(
      '/payments/methods/save',
      paymentMethodData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user's saved payment methods
export const getSavedPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/payments/methods/saved');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove saved payment method
export const removePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await apiClient.delete(
      `/payments/methods/${paymentMethodId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Set default payment method
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await apiClient.put(
      `/payments/methods/${paymentMethodId}/default`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/payments/history', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify payment status
export const verifyPaymentStatus = async (paymentId) => {
  try {
    const response = await apiClient.get(`/payments/${paymentId}/status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate payment link
export const generatePaymentLink = async (bookingId, returnUrl) => {
  try {
    const response = await apiClient.post('/payments/generate-link', {
      bookingId,
      returnUrl,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Process mobile money payment
export const processMobileMoneyPayment = async (bookingId, mobileData) => {
  try {
    const response = await apiClient.post(
      `/payments/mobile-money/${bookingId}`,
      mobileData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Process PayPal payment
export const processPayPalPayment = async (bookingId, paymentData) => {
  try {
    const response = await apiClient.post(
      `/payments/paypal/${bookingId}`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Process Stripe payment
export const processStripePayment = async (bookingId, paymentMethodId) => {
  try {
    const response = await apiClient.post(`/payments/stripe/${bookingId}`, {
      paymentMethodId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment currencies
export const getPaymentCurrencies = async () => {
  try {
    const response = await apiClient.get('/payments/currencies');
    return response.data;
  } catch (error) {
    throw error;
  }
};
