import { format, addDays, differenceInDays, isBefore, isAfter, parseISO } from 'date-fns';

// Format date to display (e.g., "Oct 2, 2023")
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatStr);
};

// Format date and time (e.g., "Oct 2, 2023, 2:30 PM")
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy, h:mm a');
};

// Calculate number of nights between two dates
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return differenceInDays(new Date(checkOut), new Date(checkIn));
};

// Calculate total price based on room rate and number of nights
export const calculateTotal = (rate, checkIn, checkOut) => {
  const nights = calculateNights(checkIn, checkOut);
  return rate * nights;
};

// Format currency (e.g., "$129.00")
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Generate array of dates between two dates
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

// Check if a date is within a date range
export const isDateInRange = (date, startDate, endDate) => {
  const currentDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return currentDate >= start && currentDate <= end;
};

// Format guest count (e.g., "1 guest" or "2 guests")
export const formatGuests = (adults, children = 0) => {
  const total = adults + children;
  return `${total} ${total === 1 ? 'guest' : 'guests'}`;
};

// Format room type name (e.g., "single_suite" -> "Single Suite")
export const formatRoomType = (type) => {
  if (!type) return '';
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substr(0, maxLength)}...`;
};

// Validate email address
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Format phone number (e.g., "1234567890" -> "(123) 456-7890")
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

// Calculate average rating from an array of reviews
export const calculateAverageRating = (reviews) => {
  if (!reviews || !reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

// Generate star rating display
export const renderStarRating = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push('★');
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push('½');
    } else {
      stars.push('☆');
    }
  }
  
  return stars.join('');
};

// Parse URL parameters
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
