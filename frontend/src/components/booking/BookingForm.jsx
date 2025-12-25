import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import { FaCalendarAlt, FaUser, FaBed, FaChild } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingForm = () => {
  const navigate = useNavigate();
  const { 
    room, 
    checkIn, 
    checkOut, 
    adults, 
    children, 
    updateBookingData,
    nextStep
  } = useBooking();
  
  const [localCheckIn, setLocalCheckIn] = useState(checkIn ? new Date(checkIn) : null);
  const [localCheckOut, setLocalCheckOut] = useState(checkOut ? new Date(checkOut) : null);
  const [localAdults, setLocalAdults] = useState(adults || 1);
  const [localChildren, setLocalChildren] = useState(children || 0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update local state when context changes
  useEffect(() => {
    if (checkIn) setLocalCheckIn(new Date(checkIn));
    if (checkOut) setLocalCheckOut(new Date(checkOut));
  }, [checkIn, checkOut]);
  
  const today = new Date();
  const maxDate = addDays(today, 365); // 1 year in advance
  
  const handleCheckInChange = (date) => {
    setLocalCheckIn(date);
    // If check-out is before the new check-in, update check-out
    if (localCheckOut && isBefore(localCheckOut, date)) {
      setLocalCheckOut(addDays(date, 1));
    }
  };
  
  const handleCheckOutChange = (date) => {
    setLocalCheckOut(date);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!localCheckIn || !localCheckOut) {
      toast.error('Please select both check-in and check-out dates');
      return;
    }
    
    if (isBefore(localCheckOut, localCheckIn)) {
      toast.error('Check-out date must be after check-in date');
      return;
    }
    
    // Update context with form data
    updateBookingData({
      checkIn: localCheckIn.toISOString(),
      checkOut: localCheckOut.toISOString(),
      adults: localAdults,
      children: localChildren,
    });
    
    // Proceed to next step
    nextStep();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const calculateNights = () => {
    if (!localCheckIn || !localCheckOut) return 0;
    return Math.ceil((localCheckOut - localCheckIn) / (1000 * 60 * 60 * 24));
  };
  
  const nights = calculateNights();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {room ? 'Modify Your Booking' : 'Book Your Stay'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Check-in Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <div className="relative">
              <DatePicker
                selected={localCheckIn}
                onChange={handleCheckInChange}
                selectsStart
                startDate={localCheckIn}
                endDate={localCheckOut}
                minDate={today}
                maxDate={maxDate}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholderText="Check-in date"
                dateFormat="MMM d, yyyy"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Check-out Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <div className="relative">
              <DatePicker
                selected={localCheckOut}
                onChange={handleCheckOutChange}
                selectsEnd
                startDate={localCheckIn}
                endDate={localCheckOut}
                minDate={localCheckIn ? addDays(localCheckIn, 1) : addDays(today, 1)}
                maxDate={maxDate}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholderText="Check-out date"
                dateFormat="MMM d, yyyy"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Adults */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adults
            </label>
            <div className="relative">
              <select
                value={localAdults}
                onChange={(e) => setLocalAdults(parseInt(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={`adults-${num}`} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
              <FaUser className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Children */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Children
            </label>
            <div className="relative">
              <select
                value={localChildren}
                onChange={(e) => setLocalChildren(parseInt(e.target.value))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={`children-${num}`} value={num}>
                    {num} {num === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
              <FaChild className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Summary */}
        {nights > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Booking Summary</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
              <span>{localAdults + localChildren} {localAdults + localChildren === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            {room && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="font-medium">{room.name}</p>
                <p className="text-primary-600 font-semibold">
                  ${room.price * nights} <span className="text-sm text-gray-500">total</span>
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Continue to Guest Information'}
            <svg
              className="ml-2 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
