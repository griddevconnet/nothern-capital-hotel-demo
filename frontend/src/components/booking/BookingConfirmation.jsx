import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { FaCheckCircle, FaHotel, FaCalendarAlt, FaUser, FaUserFriends, FaMapMarkerAlt, FaEnvelope, FaPhone, FaPrint, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { 
    createdBooking,
    room, 
    checkIn, 
    checkOut, 
    adults, 
    children, 
    guestInfo, 
    paymentInfo,
    resetBooking,
    getBookingSummary
  } = useBooking();
  
  const bookingSummary = getBookingSummary();
  
  // Generate a random booking reference
  const bookingRef = createdBooking?.reference || `NCH-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Format dates
  const formattedCheckIn = checkIn ? format(new Date(checkIn), 'EEEE, MMMM d, yyyy') : '';
  const formattedCheckOut = checkOut ? format(new Date(checkOut), 'EEEE, MMMM d, yyyy') : '';
  
  // Calculate nights
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };
  
  // Handle download as PDF functionality
  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF
    alert('Downloading booking confirmation as PDF...');
  };
  
  // Handle back to home
  const handleBackToHome = () => {
    resetBooking();
    navigate('/');
  };
  
  // Redirect to home if booking data is missing
  useEffect(() => {
    if (!room || !checkIn || !checkOut) {
      navigate('/');
    }
    
    // In a real app, you would send a confirmation email here
    // and save the booking to the database
    
    // Cleanup function to reset booking state when component unmounts
    return () => {
      // Reset booking state after a delay to allow printing/downloading
      const timer = setTimeout(() => {
        // resetBooking();
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    };
  }, [room, checkIn, checkOut, navigate]);
  
  if (!room || !checkIn || !checkOut) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden print:shadow-none">
      <div className="p-6 print:p-0">
        {/* Header */}
        <div className="text-center mb-8 print:mb-4">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <FaCheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you, {guestInfo?.firstName || 'Guest'}, your booking is confirmed.
          </p>
          <p className="text-gray-600">
            Your booking reference: <span className="font-semibold">{bookingRef}</span>
          </p>
        </div>
        
        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 print:mb-4 print:p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Booking Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaHotel className="mr-2 text-primary-600" />
                Room Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Room Type:</span> {room.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Max Occupancy:</span> {room.maxOccupancy} {room.maxOccupancy === 1 ? 'Guest' : 'Guests'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Room Size:</span> {room.size} m²
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Rate:</span> ${room.price} per night
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-primary-600" />
                Stay Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Check-in:</span> {formattedCheckIn} from 2:00 PM
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Check-out:</span> {formattedCheckOut} by 12:00 PM
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Duration:</span> {nights} {nights === 1 ? 'Night' : 'Nights'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Guests:</span> {adults} {adults === 1 ? 'Adult' : 'Adults'}
                  {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Guest Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 print:mb-4 print:p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Guest Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaUser className="mr-2 text-primary-600" />
                Primary Guest
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {guestInfo?.firstName} {guestInfo?.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {guestInfo?.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> {guestInfo?.phone}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-600" />
                Billing Address
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">{guestInfo?.address}</p>
                <p className="text-gray-700">
                  {guestInfo?.city}, {guestInfo?.country} {guestInfo?.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 print:mb-4 print:p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Payment Summary
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {room.name} × {nights} {nights === 1 ? 'Night' : 'Nights'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${(room.price * nights).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Taxes and Fees
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    $0.00
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total Amount
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    ${(room.price * nights).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Payment Method
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    Credit Card ending in {paymentInfo?.cardNumber?.slice(-4) || '****'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Payment Status
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Hotel Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 print:mb-4 print:p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Hotel Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Northern Capital Hotel
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  123 Luxury Street, Airport Residential Area
                </p>
                <p className="text-gray-700">
                  Accra, Ghana
                </p>
                <p className="text-gray-700">
                  <a href="tel:+233302123456" className="text-primary-600 hover:text-primary-500">
                    <FaPhone className="inline mr-2" />
                    +233 30 212 3456
                  </a>
                </p>
                <p className="text-gray-700">
                  <a href="mailto:reservations@northerncapitalhotel.com" className="text-primary-600 hover:text-primary-500">
                    <FaEnvelope className="inline mr-2" />
                    reservations@northerncapitalhotel.com
                  </a>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Check-in Instructions
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Please present a valid ID and this confirmation upon arrival</li>
                <li>Check-in time is from 2:00 PM</li>
                <li>Early check-in is subject to availability</li>
                <li>Contact us for any special requests or assistance</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaPrint className="mr-2 -ml-1 h-5 w-5" />
            Print Confirmation
          </button>
          
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaDownload className="mr-2 -ml-1 h-5 w-5" />
            Download as PDF
          </button>
          
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Home
          </button>
        </div>
        
        {/* Thank You Message */}
        <div className="mt-12 text-center print:mt-6">
          <p className="text-gray-600">
            Thank you for choosing Northern Capital Hotel. We look forward to serving you!
          </p>
          <p className="mt-2 text-sm text-gray-500">
            For any questions or special requests, please contact our reservations team.
          </p>
        </div>
      </div>
      
      {/* Print-Only Footer */}
      <div className="hidden print:block border-t border-gray-200 mt-8 pt-4 text-center text-xs text-gray-500">
        <p>Northern Capital Hotel | 123 Luxury Street, Accra, Ghana | +233 30 212 3456</p>
        <p>www.northerncapitalhotel.com | reservations@northerncapitalhotel.com</p>
        <p className="mt-2">Booking Reference: {bookingRef} | Confirmation Date: {format(new Date(), 'MMMM d, yyyy h:mm a')}</p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
