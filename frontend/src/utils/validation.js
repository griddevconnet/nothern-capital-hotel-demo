export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validateDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const validateFutureDate = (date) => {
  if (!validateDate(date)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
};

export const validateBookingForm = (data) => {
  const errors = {};
  
  if (!validateRequired(data.firstName)) {
    errors.firstName = 'First name is required';
  }
  
  if (!validateRequired(data.lastName)) {
    errors.lastName = 'Last name is required';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  if (!validateFutureDate(data.checkIn)) {
    errors.checkIn = 'Please select a valid check-in date';
  }
  
  if (!validateFutureDate(data.checkOut)) {
    errors.checkOut = 'Please select a valid check-out date';
  } else if (new Date(data.checkOut) <= new Date(data.checkIn)) {
    errors.checkOut = 'Check-out date must be after check-in date';
  }
  
  if (data.adults < 1) {
    errors.adults = 'At least one adult is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateContactForm = (data) => {
  const errors = {};
  
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validateRequired(data.message)) {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message should be at least 10 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
