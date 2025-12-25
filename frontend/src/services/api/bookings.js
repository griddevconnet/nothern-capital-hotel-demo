import apiClient from './config';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user's bookings
export const getUserBookings = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}/bookings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking
export const updateBooking = async (bookingId, updateData) => {
  try {
    const response = await apiClient.put(`/bookings/${bookingId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await apiClient.delete(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check room availability for booking
export const checkBookingAvailability = async (roomId, checkIn, checkOut) => {
  try {
    const response = await apiClient.post('/bookings/check-availability', {
      roomId,
      checkIn,
      checkOut,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking invoice
export const getBookingInvoice = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}/invoice`, {
      responseType: 'blob', // For file download
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Apply promo code to booking
export const applyPromoCode = async (bookingId, promoCode) => {
  try {
    const response = await apiClient.post(`/bookings/${bookingId}/apply-promo`, {
      promoCode,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking cancellation policy
export const getCancellationPolicy = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}/cancellation-policy`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/bookings/payment-methods');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Process payment for booking
export const processPayment = async (bookingId, paymentData) => {
  try {
    const response = await apiClient.post(
      `/bookings/${bookingId}/process-payment`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send booking confirmation email
export const sendConfirmationEmail = async (bookingId) => {
  try {
    const response = await apiClient.post(`/bookings/${bookingId}/send-confirmation`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking status
export const getBookingStatus = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}/status`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking timeline
export const getBookingTimeline = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}/timeline`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
