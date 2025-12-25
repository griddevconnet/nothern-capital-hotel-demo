import apiClient from './config';

// Get all rooms with optional filters
export const getRooms = async (filters = {}) => {
  try {
    const response = await apiClient.get('/rooms', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get room by ID
export const getRoomById = async (id) => {
  try {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check room availability
export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
  try {
    const response = await apiClient.post('/rooms/check-availability', {
      roomId,
      checkIn,
      checkOut,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get room amenities
export const getRoomAmenities = async () => {
  try {
    const response = await apiClient.get('/rooms/amenities');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get room types
export const getRoomTypes = async () => {
  try {
    const response = await apiClient.get('/rooms/types');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get room reviews
export const getRoomReviews = async (roomId) => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}/reviews`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit a room review
export const submitRoomReview = async (roomId, reviewData) => {
  try {
    const response = await apiClient.post(`/rooms/${roomId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get featured rooms
export const getFeaturedRooms = async () => {
  try {
    const response = await apiClient.get('/rooms/featured');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get room images
export const getRoomImages = async (roomId) => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}/images`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get similar rooms
export const getSimilarRooms = async (roomId) => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}/similar`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get room rates
export const getRoomRates = async (roomId, startDate, endDate) => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}/rates`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
