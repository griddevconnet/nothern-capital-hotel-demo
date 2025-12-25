import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateDate,
  validateFutureDate,
  validateBookingForm,
  validateContactForm
} from './validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user@sub.domain.com')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missingusername.com')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('user@domain..com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('returns true for valid phone numbers', () => {
      expect(validatePhone('+1 (555) 123-4567')).toBe(true);
      expect(validatePhone('+44 20 1234 5678')).toBe(true);
      expect(validatePhone('0123456789')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
    });

    it('returns false for invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('123-abc-4567')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('returns true for non-empty strings', () => {
      expect(validateRequired('text')).toBe(true);
      expect(validateRequired('  text  ')).toBe(true);
      expect(validateRequired('0')).toBe(true);
    });

    it('returns false for empty or whitespace strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('validateDate', () => {
    it('returns true for valid date strings', () => {
      expect(validateDate('2023-01-01')).toBe(true);
      expect(validateDate(new Date().toISOString())).toBe(true);
    });

    it('returns false for invalid date strings', () => {
      expect(validateDate('invalid-date')).toBe(false);
      expect(validateDate('2023-13-01')).toBe(false);
      expect(validateDate('')).toBe(false);
      expect(validateDate(null)).toBe(false);
    });
  });

  describe('validateFutureDate', () => {
    beforeEach(() => {
      // Mock the current date to 2023-01-01
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date(2023, 0, 1));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns true for future dates', () => {
      expect(validateFutureDate('2023-01-02')).toBe(true);
      expect(validateFutureDate('2024-12-31')).toBe(true);
    });

    it('returns false for past dates', () => {
      expect(validateFutureDate('2022-12-31')).toBe(false);
      expect(validateFutureDate('2020-01-01')).toBe(false);
    });

    it('returns true for current date', () => {
      expect(validateFutureDate('2023-01-01')).toBe(true);
    });
  });

  describe('validateBookingForm', () => {
    const validForm = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      checkIn: '2023-12-25',
      checkOut: '2023-12-31',
      adults: 2,
      children: 1
    };

    it('returns valid for a complete form', () => {
      const result = validateBookingForm(validForm);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('validates required fields', () => {
      const result = validateBookingForm({ ...validForm, firstName: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.firstName).toBe('First name is required');
    });

    it('validates email format', () => {
      const result = validateBookingForm({ ...validForm, email: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    it('validates phone format', () => {
      const result = validateBookingForm({ ...validForm, phone: 'abc' });
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe('Please enter a valid phone number');
    });

    it('validates check-out is after check-in', () => {
      const result = validateBookingForm({
        ...validForm,
        checkIn: '2023-12-31',
        checkOut: '2023-12-25'
      });
      
      expect(result.isValid).toBe(false);
      expect(result.errors.checkOut).toBe('Check-out date must be after check-in date');
    });

    it('validates at least one adult', () => {
      const result = validateBookingForm({ ...validForm, adults: 0 });
      expect(result.isValid).toBe(false);
      expect(result.errors.adults).toBe('At least one adult is required');
    });
  });

  describe('validateContactForm', () => {
    const validForm = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message.'
    };

    it('returns valid for a complete form', () => {
      const result = validateContactForm(validForm);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('validates required fields', () => {
      const result = validateContactForm({ ...validForm, name: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
    });

    it('validates email format', () => {
      const result = validateContactForm({ ...validForm, email: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    it('validates minimum message length', () => {
      const result = validateContactForm({ ...validForm, message: 'short' });
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('Message should be at least 10 characters long');
    });
  });
});
