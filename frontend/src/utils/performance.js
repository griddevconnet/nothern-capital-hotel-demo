// Image optimization helper
export const getOptimizedImage = (src, { width = 800, quality = 80, format = 'webp' } = {}) => {
  if (!src) return '';
  
  // If it's an external URL, return as is
  if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) {
    return src;
  }
  
  // Remove leading slash if present
  const cleanPath = src.startsWith('/') ? src.substring(1) : src;
  
  // For local images, use a service like Cloudinary or Imgix
  // This is a placeholder - replace with your actual image optimization service
  return `https://res.cloudinary.com/your-account/image/upload/w_${width},q_${quality},f_${format}/${cleanPath}`;
};

// Lazy load components with Suspense
export const lazyLoad = (importFunc) => {
  return React.lazy(() => {
    return Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, 300)) // Minimum delay for better UX
    ]).then(([moduleExports]) => moduleExports);
  });
};

// Memoize expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Debounce function for resize/scroll events
export const debounce = (func, wait = 100) => {
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

// Throttle function for scroll/resize events
export const throttle = (func, limit = 100) => {
  let inThrottle;
  
  return function() {
    const args = arguments;
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };
  
  if (typeof window === 'undefined') {
    return { observe: () => {}, disconnect: () => {} };
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
  
  return {
    observe: (element) => observer.observe(element),
    disconnect: () => observer.disconnect()
  };
};

// Preload critical resources
export const preloadResources = (resources) => {
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    
    if (as) link.as = as;
    if (type) link.type = type;
    
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Optimize images with WebP support
export const getOptimizedImageSrc = (src, options = {}) => {
  if (!src) return '';
  
  const {
    width,
    height,
    quality = 75,
    format = 'auto',
    crop = 'scale'
  } = options;
  
  // If it's an external URL, return as is
  if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) {
    return src;
  }
  
  // For local images, use a service like Cloudinary or Imgix
  // This is a placeholder - replace with your actual image optimization service
  let optimizedSrc = `https://res.cloudinary.com/your-account/image/upload/`;
  
  // Add transformations
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  if (transformations.length > 0) {
    optimizedSrc += `${transformations.join(',')}/`;
  }
  
  return optimizedSrc + src;
};

// Get image dimensions
const getImageDimensions = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

// Lazy load background images
export const lazyLoadBackground = (element) => {
  if (!element) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bgImage = entry.target.getAttribute('data-bg');
        if (bgImage) {
          entry.target.style.backgroundImage = `url(${bgImage})`;
          entry.target.removeAttribute('data-bg');
          observer.unobserve(entry.target);
        }
      }
    });
  });
  
  observer.observe(element);
  
  return () => observer.disconnect();
};
