import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useBooking } from '../context/BookingContext';
import BookingForm from '../components/booking/BookingForm';
import GuestInformation from '../components/booking/GuestInformation';
import Payment from '../components/booking/Payment';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { getRoomById } from '../services/api/rooms';

const Booking = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { step, room, updateBookingData, resetBooking } = useBooking();

  // Fetch room details
  const { data: roomData, isLoading, isError, error } = useQuery(
    ['room', roomId],
    () => getRoomById(roomId),
    {
      enabled: !!roomId && !room,
      onSuccess: (data) => {
        if (data && !room) updateBookingData({ room: data });
      },
      onError: (err) => {
        toast.error('Failed to load room details');
        console.error('Room fetch error:', err);
      }
    }
  );

  // Reset booking state on unmount (except confirmation)
  useEffect(() => {
    return () => {
      if (step !== 4) {
        // resetBooking();
      }
    };
  }, [step, resetBooking]);

  // Redirect if no room selected
  useEffect(() => {
    if (!roomId && !room) {
      toast.error('Please select a room first');
      navigate('/rooms');
    }
  }, [roomId, room, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading room details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load the room details. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (roomId && !room && !isLoading) return null;

  // Step title
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Dates & Guests';
      case 2: return 'Guest Information';
      case 3: return 'Payment';
      case 4: return 'Booking Confirmation';
      default: return 'Book Your Stay';
    }
  };

  // Step rendering
  const renderStep = () => {
    switch (step) {
      case 1: return <BookingForm />;
      case 2: return <GuestInformation />;
      case 3: return <Payment />;
      case 4: return <BookingConfirmation />;
      default: return <BookingForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-72 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {getStepTitle()}
          </h1>
        </div>
      </div>

      {/* Booking Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Steps */}
        {step < 4 && (
          <div className="mb-12">
            <div className="flex justify-center items-center space-x-12">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold shadow-md transition
                      ${
                        step === stepNumber
                          ? 'bg-blue-600 text-white'
                          : step > stepNumber
                          ? 'bg-green-100 text-green-600'
                          : 'bg-white border-2 border-gray-300 text-gray-500'
                      }`}
                  >
                    {step > stepNumber ? '✓' : stepNumber}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step >= stepNumber ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {stepNumber === 1 ? 'Dates' : stepNumber === 2 ? 'Guest Info' : 'Payment'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          {renderStep()}
        </div>

        {/* Help Section */}
        {step < 4 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 border border-gray-200 bg-white rounded-full shadow-sm">
              <svg
                className="h-5 w-5 text-blue-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Need help? Call us at{' '}
                <a href="tel:+233302123456" className="text-blue-600 hover:text-blue-500">
                  +233 30 212 3456
                </a>{' '}
                or
                <a
                  href="mailto:reservations@northerncapitalhotel.com"
                  className="ml-1 text-blue-600 hover:text-blue-500"
                >
                  email us
                </a>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
