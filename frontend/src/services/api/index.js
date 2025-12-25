// Export all API services for easier imports
export { default as apiClient } from './config';

// Auth services
export * from './auth';

// Room services
export * from './rooms';

// Booking services
export * from './bookings';

// Payment services
export * from './payments';

// Hotel services
export * from './hotel';

// Utility function to handle API errors
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  // Handle network errors
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    };
  }
  
  // Handle server errors with response
  const { status, data } = error.response;
  
  let message = defaultMessage;
  const errors = {};
  
  // Handle validation errors
  if (status === 422 && data.errors) {
    // Transform array of errors to object
    data.errors.forEach((err) => {
      errors[err.field] = err.message;
    });
    message = 'Validation failed';
  } 
  // Handle authentication errors
  else if (status === 401) {
    message = data.message || 'Session expired. Please log in again.';
    // Optionally redirect to login
    // window.location.href = '/login';
  } 
  // Handle other errors
  else {
    message = data.message || defaultMessage;
  }
  
  return {
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : null,
    status,
  };
};

// Utility function to format API response
export const formatApiResponse = (response, defaultMessage = 'Success') => ({
  success: true,
  data: response.data,
  message: response.message || defaultMessage,
  status: response.status,
});

// Utility function to handle file downloads
export const downloadFile = (data, filename, mimeType) => {
  // Create a Blob from the response data
  const blob = new Blob([data], { type: mimeType });
  
  // Create a link element
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.href = url;
  link.download = filename;
  
  // Append to body, click and remove
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
};

// Utility function to handle pagination parameters
export const getPaginationParams = (page = 1, perPage = 10) => ({
  page,
  limit: perPage,
  offset: (page - 1) * perPage,
});

// Utility function to handle API query parameters
export const buildQueryParams = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item));
      } else if (value instanceof Date) {
        queryParams.append(key, value.toISOString());
      } else if (typeof value === 'object') {
        queryParams.append(key, JSON.stringify(value));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  
  return queryParams.toString();
};
