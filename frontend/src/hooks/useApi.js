import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  authAPI,
  roomsAPI,
  bookingsAPI,
  reviewsAPI,
  facilitiesAPI,
  contactAPI,
} from '../services/api';

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation(authAPI.login, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries(['auth']);
      toast.success('Login successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  return useMutation(authAPI.register, {
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useAuth = () => {
  return useQuery(['auth'], authAPI.getMe, {
    retry: false,
    onError: () => {
      localStorage.removeItem('token');
    },
  });
};

// Rooms hooks
export const useRooms = (params = {}) => {
  return useQuery(['rooms', params], () => roomsAPI.getAllRooms(params));
};

export const useRoom = (id) => {
  return useQuery(['room', id], () => roomsAPI.getRoomById(id), {
    enabled: !!id,
  });
};

export const useCheckAvailability = () => {
  return useMutation(roomsAPI.checkAvailability, {
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to check availability');
    },
  });
};

// Bookings hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(bookingsAPI.createBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      toast.success('Booking created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    },
  });
};

export const useMyBookings = () => {
  return useQuery(['bookings', 'me'], bookingsAPI.getMyBookings, {
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to load bookings');
    },
  });
};

// Reviews hooks
export const useRoomReviews = (roomId) => {
  return useQuery(['reviews', roomId], () => reviewsAPI.getRoomReviews(roomId), {
    enabled: !!roomId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation(reviewsAPI.createReview, {
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries(['reviews', roomId]);
      toast.success('Review submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};

// Facilities hooks
export const useFacilities = () => {
  return useQuery(['facilities'], facilitiesAPI.getAllFacilities);
};

export const useFacility = (id) => {
  return useQuery(['facility', id], () => facilitiesAPI.getFacilityById(id), {
    enabled: !!id,
  });
};

// Contact hooks
export const useSendMessage = () => {
  return useMutation(contactAPI.sendMessage, {
    onSuccess: () => {
      toast.success('Message sent successfully! We will get back to you soon.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    },
  });
};

// Admin hooks
export const useAdminBookings = () => {
  return useQuery(['admin', 'bookings'], bookingsAPI.getAdminBookings);
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, status }) => bookingsAPI.updateBookingStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin', 'bookings']);
        toast.success('Booking status updated');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update booking status');
      },
    }
  );
};

export const useAdminMessages = () => {
  return useQuery(['admin', 'messages'], contactAPI.getMessages);
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation(contactAPI.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'messages']);
    },
  });
};
