import {
    FaHotel,
    FaCalendarAlt,
    FaUser,
    FaMapMarkerAlt,
    FaPhone,
  } from 'react-icons/fa';
  import { useMutation, useQuery } from '@tanstack/react-query';
  import { toast } from 'react-hot-toast';
  import { Link } from 'react-router-dom';
  import { bookingsAPI } from '../services/api.js';
  import { useAuth } from '../context/AuthContext.jsx';
  
  const MyBookings = () => {
    const { isAuthenticated } = useAuth();

    const { data, isLoading, isError, refetch } = useQuery({
      queryKey: ['bookings', 'me'],
      enabled: isAuthenticated,
      queryFn: async () => {
        const res = await bookingsAPI.getMyBookings();
        return res.data;
      },
    });

    const bookings = Array.isArray(data) ? data : [];

    const cancelMutation = useMutation({
      mutationFn: async (id) => bookingsAPI.cancelBooking(id),
      onSuccess: () => {
        toast.success('Booking cancelled');
        refetch();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err?.message || 'Failed to cancel booking');
      },
    });
  
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadgeClass = (status) => {
      if (status === 'CONFIRMED' || status === 'CHECKED_IN' || status === 'CHECKED_OUT') {
        return 'bg-green-100 text-green-800';
      }
      if (status === 'CANCELLED') return 'bg-red-100 text-red-800';
      return 'bg-yellow-100 text-yellow-800';
    };

    const getImageForRoom = (roomName) => {
      const name = (roomName || '').toLowerCase();
      if (name.includes('single')) return '/src/assets/images/single1.jpeg';
      if (name.includes('standard')) return '/src/assets/images/standard1.jpeg';
      return '/src/assets/images/executive1.jpeg';
    };
  
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-72 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                My Bookings
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                View and manage your upcoming and past reservations
              </p>
            </div>
          </div>
        </div>
  
        {/* Bookings Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {!isAuthenticated && (
            <div className="text-center py-20">
              <FaHotel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Please sign in</h3>
              <p className="mt-2 text-gray-500">You need an account to view your bookings.</p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow transition"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}

          {isAuthenticated && isLoading && (
            <div className="text-center py-20 text-gray-600">Loading your bookings...</div>
          )}

          {isAuthenticated && isError && (
            <div className="text-center py-20 text-gray-600">
              Failed to load bookings.
              <button
                onClick={() => refetch()}
                className="ml-3 px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                Retry
              </button>
            </div>
          )}

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="h-56 w-full overflow-hidden">
                    <img
                      src={getImageForRoom(booking.room?.name)}
                      alt={booking.room?.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
  
                  {/* Content */}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.room?.name}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          getStatusBadgeClass(booking.status)
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
  
                    <p className="text-gray-600 mb-4 flex items-center">
                      <FaHotel className="mr-2 text-blue-600" />
                      Northern Capital Hotel
                    </p>
  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                      <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-600" />
                        {formatDate(booking.check_in)}
                      </p>
                      <p className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-600" />
                        {formatDate(booking.check_out)}
                      </p>
                      <p className="flex items-center">
                        <FaUser className="mr-2 text-blue-600" />
                        {(booking.adults + booking.children)}{' '}
                        {(booking.adults + booking.children) === 1 ? 'Guest' : 'Guests'}
                      </p>
                      <p className="font-semibold text-gray-900">
                        Total: ${((booking.room?.price || 0) * Math.max(1, Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24)))).toFixed(2)}
                      </p>
                    </div>
  
                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <button
                          disabled={cancelMutation.isPending}
                          onClick={() => cancelMutation.mutate(booking.id)}
                          className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaHotel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No bookings found
              </h3>
              <p className="mt-2 text-gray-500">
                You don’t have any upcoming or past bookings.
              </p>
              <div className="mt-6">
                <a
                  href="/rooms"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow transition"
                >
                  <FaHotel className="mr-2" />
                  Book a Room
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default MyBookings;
  