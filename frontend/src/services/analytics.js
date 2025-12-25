// Google Analytics measurement ID (replace with your actual ID)
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName) => {
  trackEvent('form_submit', 'engagement', `${formName} form submitted`);
};

// Track button clicks
export const trackButtonClick = (buttonName) => {
  trackEvent('button_click', 'engagement', `${buttonName} button clicked`);
};

// Track booking events
export const trackBookingEvent = (step, data = {}) => {
  trackEvent('booking_step', 'booking', `Booking step: ${step}`, data);
};

// Track search events
export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent('search', 'engagement', 'Search performed', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};
