export const APP_NAME = 'Northern Capital Hotel';
export const APP_DESCRIPTION = 'Experience luxury and comfort at Northern Capital Hotel';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ROOM_TYPES = {
  SINGLE: 'single',
  STANDARD: 'standard',
  EXECUTIVE: 'executive',
};

export const AMENITIES = [
  { id: 1, name: 'Free WiFi', icon: 'wifi' },
  { id: 2, name: 'Air Conditioning', icon: 'snowflake' },
  { id: 3, name: 'TV', icon: 'tv' },
  { id: 4, name: 'Mini Bar', icon: 'wine-bottle' },
  { id: 5, name: 'Safe', icon: 'shield-alt' },
  { id: 6, name: 'Hair Dryer', icon: 'wind' },
];

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  tripadvisor: 'https://tripadvisor.com',
};

export const CONTACT_INFO = {
  address: '123 Luxury Avenue, City Center, 10001',
  phone: '+1 (555) 123-4567',
  email: 'info@northerncapitalhotel.com',
  workingHours: '24/7',
};
