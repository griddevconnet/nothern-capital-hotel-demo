import apiClient from './config';

// Get all facilities
export const getFacilities = async () => {
  try {
    const response = await apiClient.get('/hotel/facilities');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get facility by ID
export const getFacilityById = async (facilityId) => {
  try {
    const response = await apiClient.get(`/hotel/facilities/${facilityId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel information
export const getHotelInfo = async () => {
  try {
    const response = await apiClient.get('/hotel/info');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel policies
export const getHotelPolicies = async () => {
  try {
    const response = await apiClient.get('/hotel/policies');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel amenities
export const getHotelAmenities = async () => {
  try {
    const response = await apiClient.get('/hotel/amenities');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel gallery
export const getHotelGallery = async () => {
  try {
    const response = await apiClient.get('/hotel/gallery');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel reviews
export const getHotelReviews = async (params = {}) => {
  try {
    const response = await apiClient.get('/hotel/reviews', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit a hotel review
export const submitHotelReview = async (reviewData) => {
  try {
    const response = await apiClient.post('/hotel/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel location
export const getHotelLocation = async () => {
  try {
    const response = await apiClient.get('/hotel/location');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get nearby attractions
export const getNearbyAttractions = async () => {
  try {
    const response = await apiClient.get('/hotel/nearby-attractions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel statistics
export const getHotelStatistics = async () => {
  try {
    const response = await apiClient.get('/hotel/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel team members
export const getHotelTeam = async () => {
  try {
    const response = await apiClient.get('/hotel/team');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit contact form
export const submitContactForm = async (formData) => {
  try {
    const response = await apiClient.post('/contact', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Subscribe to newsletter
export const subscribeNewsletter = async (email) => {
  try {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (email, token) => {
  try {
    const response = await apiClient.post('/newsletter/unsubscribe', { email, token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get FAQ categories
export const getFaqCategories = async () => {
  try {
    const response = await apiClient.get('/faq/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get FAQs by category
export const getFaqsByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(`/faq/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search FAQs
export const searchFaqs = async (query) => {
  try {
    const response = await apiClient.get('/faq/search', { params: { query } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
