import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Layout from './components/layout/Layout.jsx';
import ErrorFallback from './components/errors/ErrorFallback.jsx';
import ErrorBoundary from './components/errors/ErrorBoundary.jsx';
import Seo from './components/seo/Seo.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { initAnalytics, trackPageView } from './services/analytics';
import { useEffect } from 'react';
import { initFocusVisible } from './utils/a11y';
import { 
  Home,
  Rooms,
  RoomDetail,
  Facilities,
  About,
  Contact,
  Booking,
  MyBookings,
  Gallery,
  Dining,
  Login,
  NotFound,
  BookNow,
  Dashboard,
  AdminDashboard,
  ReceptionDashboard,
} from './pages';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error?.response?.status === 404) return false;
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      retryDelay: 1000,
    },
  },
});

// Initialize analytics
if (typeof window !== 'undefined') {
  initAnalytics();
  initFocusVisible();
}

// Track page views
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Seo />
      <PageTracker />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('App Error Boundary caught an error:', error, errorInfo);
          // Log to error reporting service
        }}
      >
        <NotificationProvider>
          <AuthProvider>
            <BookingProvider>
<ErrorBoundary>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="rooms" element={<Rooms />} />
      <Route path="rooms/:id" element={<RoomDetail />} />
      <Route
        path="booking/:id"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route path="facilities" element={<Facilities />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="/book-now" element={<BookNow />} />
      <Route path="my-bookings" element={<MyBookings />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="dining" element={<Dining />} />
      <Route path="login" element={<Login />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="reception"
        element={
          <ProtectedRoute roles={["ADMIN", "RECEPTIONIST"]}>
            <ReceptionDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</ErrorBoundary>
            </BookingProvider>
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
