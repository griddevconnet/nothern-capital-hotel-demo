import { initAnalytics, trackPageView, trackEvent, trackFormSubmission, trackButtonClick, trackBookingEvent, trackSearch } from './analytics';

describe('Analytics Service', () => {
  beforeEach(() => {
    // Reset window.gtag between tests
    window.gtag = jest.fn();
  });

  afterEach(() => {
    delete window.gtag;
  });

  describe('initAnalytics', () => {
    it('initializes Google Analytics with the correct parameters', () => {
      process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST12345';
      
      initAnalytics();
      
      expect(window.gtag).toHaveBeenCalledWith('js', expect.any(Date));
      expect(window.gtag).toHaveBeenCalledWith('config', 'G-TEST12345', {
        page_path: window.location.pathname,
      });
    });
  });

  describe('trackPageView', () => {
    it('tracks page views with the correct URL', () => {
      const testUrl = '/test-page';
      trackPageView(testUrl);
      
      expect(window.gtag).toHaveBeenCalledWith('config', 'G-XXXXXXXXXX', {
        page_path: testUrl,
      });
    });
  });

  describe('trackEvent', () => {
    it('tracks custom events with the correct parameters', () => {
      const eventData = {
        action: 'click',
        category: 'button',
        label: 'Book Now',
        value: 1
      };
      
      trackEvent(
        eventData.action,
        eventData.category,
        eventData.label,
        eventData.value
      );
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'button',
        event_label: 'Book Now',
        value: 1,
      });
    });
  });

  describe('trackFormSubmission', () => {
    it('tracks form submission events', () => {
      trackFormSubmission('Contact Form');
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'form_submit', {
        event_category: 'engagement',
        event_label: 'Contact Form form submitted',
      });
    });
  });

  describe('trackButtonClick', () => {
    it('tracks button click events', () => {
      trackButtonClick('Book Now');
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'button_click', {
        event_category: 'engagement',
        event_label: 'Book Now button clicked',
      });
    });
  });

  describe('trackBookingEvent', () => {
    it('tracks booking step events with data', () => {
      const step = 'payment';
      const data = { amount: 199.99, currency: 'USD' };
      
      trackBookingEvent(step, data);
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'booking_step', {
        event_category: 'booking',
        event_label: 'Booking step: payment',
        ...data,
      });
    });
  });

  describe('trackSearch', () => {
    it('tracks search events with term and results count', () => {
      const searchTerm = 'deluxe';
      const resultsCount = 5;
      
      trackSearch(searchTerm, resultsCount);
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'engagement',
        event_label: 'Search performed',
        search_term: 'deluxe',
        results_count: 5,
      });
    });
  });

  describe('when gtag is not defined', () => {
    beforeEach(() => {
      delete window.gtag;
    });

    it('does not throw errors when gtag is not available', () => {
      expect(() => {
        initAnalytics();
        trackPageView('/test');
        trackEvent('click', 'button', 'Test Button');
        trackFormSubmission('Test Form');
        trackButtonClick('Test Button');
        trackBookingEvent('test_step');
        trackSearch('test', 1);
      }).not.toThrow();
    });
  });
});
