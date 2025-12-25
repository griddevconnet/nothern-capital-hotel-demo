import { createContext, useContext, useState, useCallback, useRef } from 'react';

// Create the app context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalConfig, setModalConfig] = useState({});
  const loadingCount = useRef(0);

  // Show loading indicator
  const showLoading = useCallback((message = 'Loading...') => {
    loadingCount.current += 1;
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  // Hide loading indicator
  const hideLoading = useCallback(() => {
    loadingCount.current = Math.max(0, loadingCount.current - 1);
    if (loadingCount.current === 0) {
      setIsLoading(false);
    }
  }, []);

  // Reset loading state
  const resetLoading = useCallback(() => {
    loadingCount.current = 0;
    setIsLoading(false);
  }, []);

  // Open modal with content
  const openModal = useCallback((content, config = {}) => {
    setModalContent(content);
    setModalConfig({
      onClose: () => {},
      closeOnOverlayClick: true,
      closeOnEsc: true,
      showCloseButton: true,
      maxWidth: 'md',
      ...config,
    });
    setIsModalOpen(true);
    
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    // Call the onClose callback if provided
    if (typeof modalConfig.onClose === 'function') {
      modalConfig.onClose();
    }
    
    setIsModalOpen(false);
    setModalContent(null);
    
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
    
    // Small delay to allow animations to complete
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }, [modalConfig]);

  // Handle overlay click
  const handleOverlayClick = useCallback(() => {
    if (modalConfig.closeOnOverlayClick) {
      closeModal();
    }
  }, [modalConfig.closeOnOverlayClick, closeModal]);

  // Handle escape key press
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isModalOpen && modalConfig.closeOnEsc) {
        closeModal();
      }
    },
    [isModalOpen, modalConfig.closeOnEsc, closeModal]
  );

  // Add event listener for escape key
  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, handleKeyDown]);

  // Confirm dialog
  const confirm = useCallback(
    (message, title = 'Confirm', confirmText = 'Confirm', cancelText = 'Cancel') => {
      return new Promise((resolve) => {
        const handleConfirm = () => {
          closeModal().then(() => resolve(true));
        };
        
        const handleCancel = () => {
          closeModal().then(() => resolve(false));
        };
        
        openModal(
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {confirmText}
              </button>
            </div>
          </div>,
          {
            closeOnOverlayClick: false,
            closeOnEsc: true,
            showCloseButton: false,
            maxWidth: 'sm',
          }
        );
      });
    },
    [openModal, closeModal]
  );

  // Alert dialog
  const alert = useCallback(
    (message, title = 'Alert', buttonText = 'OK') => {
      return new Promise((resolve) => {
        const handleClose = () => {
          closeModal().then(() => resolve());
        };
        
        openModal(
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {buttonText}
              </button>
            </div>
          </div>,
          {
            closeOnOverlayClick: false,
            closeOnEsc: true,
            showCloseButton: false,
            maxWidth: 'sm',
          }
        );
      });
    },
    [openModal, closeModal]
  );

  // Value to be provided by the context
  const value = {
    // Loading state
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    resetLoading,
    
    // Modal state
    isModalOpen,
    modalContent,
    modalConfig,
    openModal,
    closeModal,
    handleOverlayClick,
    
    // Helper methods
    confirm,
    alert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
