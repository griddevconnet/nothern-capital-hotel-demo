// Keyboard navigation
const KeyCodes = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
};

// Focus management
let focusableElements = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
  '[role="button"]:not([disabled])',
  '[role="link"]:not([disabled])',
];

export const trapFocus = (element) => {
  if (!element) return;
  
  const focusable = Array.from(element.querySelectorAll(focusableElements.join(',')));
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];
  
  const handleKeyDown = (e) => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === KeyCodes.TAB;
    
    if (!isTabPressed) return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// ARIA helpers
export const setLiveRegion = (message, mode = 'polite') => {
  let liveRegion = document.getElementById('a11y-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }
  
  liveRegion.setAttribute('aria-live', mode);
  liveRegion.textContent = message;
};

// Skip to main content link component
export const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:border-2 focus:border-blue-600 focus:rounded"
  >
    Skip to main content
  </a>
);

// Add focus styles for keyboard navigation
export const initFocusVisible = () => {
  const style = document.createElement('style');
  style.textContent = `
    .focus-visible:focus:not(:focus-visible) {
      outline: none;
    }
    
    .focus-visible:focus-visible {
      outline: 3px solid #2563eb;
      outline-offset: 2px;
    }
  `;
  
  document.head.appendChild(style);
  
  // Add keyboard focus class
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-focus-visible');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-focus-visible');
  });
};

// Image lazy loading with fallback
export const getImageProps = (src, alt, { className = '', ...rest } = {}) => ({
  src,
  alt,
  className: `lazy ${className}`,
  loading: 'lazy',
  'data-src': src,
  'aria-hidden': alt ? 'false' : 'true',
  onError: (e) => {
    e.target.onerror = null;
    e.target.src = '/images/placeholder.jpg'; // Fallback image
  },
  ...rest
});

// Format currency accessibly
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date accessibly
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', options);
  const timeAgo = getTimeAgo(date);
  
  return {
    full: formattedDate,
    timeAgo,
    datetime: date.toISOString(),
    year: date.getFullYear(),
    month: date.toLocaleString('default', { month: 'long' }),
    day: date.getDate(),
    weekday: date.toLocaleString('default', { weekday: 'long' })
  };
};

// Get time ago string
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago` 
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'Just now';
};
