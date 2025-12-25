import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, isBefore } from 'date-fns';
import { toast } from 'react-hot-toast';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    createdBooking: null,
    room: null,
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    specialRequests: '',
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
    paymentInfo: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
    step: 1,
  });

  const navigate = useNavigate();

  // Update booking data
  const updateBookingData = useCallback((data) => {
    setBookingData(prev => ({
      ...prev,
      ...data,
      guestInfo: { ...prev.guestInfo, ...(data.guestInfo || {}) },
      paymentInfo: { ...prev.paymentInfo, ...(data.paymentInfo || {}) },
    }));
  }, []);

  // Set room and navigate to booking
  const selectRoom = useCallback((room) => {
    updateBookingData({ room });
    navigate(`/booking/${room.id}`);
  }, [navigate, updateBookingData]);

  // Set dates and validate
  const setDates = useCallback(({ checkIn, checkOut }) => {
    if (!checkIn || !checkOut) {
      toast.error('Please select both check-in and check-out dates');
      return false;
    }

    if (isBefore(new Date(checkOut), new Date(checkIn))) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    updateBookingData({ checkIn, checkOut });
    return true;
  }, [updateBookingData]);

  // Go to next step
  const nextStep = useCallback(() => {
    if (bookingData.step === 1 && !bookingData.room) {
      toast.error('Please select a room');
      return false;
    }

    if (bookingData.step === 2 && (!bookingData.checkIn || !bookingData.checkOut)) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    setBookingData(prev => ({
      ...prev,
      step: prev.step + 1,
    }));
    
    return true;
  }, [bookingData.step, bookingData.room, bookingData.checkIn, bookingData.checkOut]);

  // Go to previous step
  const prevStep = useCallback(() => {
    setBookingData(prev => ({
      ...prev,
      step: Math.max(1, prev.step - 1),
    }));
  }, []);

  // Reset booking data
  const resetBooking = useCallback(() => {
    setBookingData({
      createdBooking: null,
      room: null,
      checkIn: null,
      checkOut: null,
      adults: 1,
      children: 0,
      specialRequests: '',
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
      },
      paymentInfo: {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
      },
      step: 1,
    });
  }, []);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    if (!bookingData.room || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const nights = Math.ceil(
      (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)
    );
    
    return bookingData.room.price * nights;
  }, [bookingData.room, bookingData.checkIn, bookingData.checkOut]);

  // Get booking summary
  const getBookingSummary = useCallback(() => {
    const { room, checkIn, checkOut, adults, children } = bookingData;
    const nights = checkIn && checkOut 
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
      : 0;
    
    return {
      room,
      checkIn: checkIn ? format(new Date(checkIn), 'MMM d, yyyy') : 'Not set',
      checkOut: checkOut ? format(new Date(checkOut), 'MMM d, yyyy') : 'Not set',
      adults,
      children,
      nights,
      total: room ? room.price * nights : 0,
    };
  }, [bookingData]);

  return (
    <BookingContext.Provider
      value={{
        ...bookingData,
        updateBookingData,
        selectRoom,
        setDates,
        nextStep,
        prevStep,
        resetBooking,
        calculateTotal,
        getBookingSummary,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
