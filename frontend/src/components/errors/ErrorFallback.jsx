import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  
  const handleReset = () => {
    resetErrorBoundary();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-500 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We're sorry, but an unexpected error occurred. Our team has been notified.
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-left mb-8">
            <p className="text-sm font-mono text-red-700 dark:text-red-300 break-words">
              {error?.message || 'Unknown error occurred'}
            </p>
            {import.meta.env.DEV && error?.stack && (
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                {error.stack}
              </pre>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleReset}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Go to Homepage
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Reload Page
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{' '}
              <a 
                href="mailto:support@northerncapitalhotel.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
