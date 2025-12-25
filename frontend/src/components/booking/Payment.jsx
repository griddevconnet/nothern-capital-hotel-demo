import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'react-hot-toast';
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from 'react-icons/fa';

import { bookingsAPI } from '../../services/api.js';

const Payment = () => {
  const { 
    room,
    checkIn,
    checkOut,
    adults,
    children,
    guestInfo,
    specialRequests,
    paymentInfo,
    updateBookingData,
    nextStep,
    prevStep,
    getBookingSummary,
    calculateTotal
  } = useBooking();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize form with existing data if available
  useEffect(() => {
    if (paymentInfo) {
      setFormData(prev => ({
        ...prev,
        ...paymentInfo
      }));
    }
  }, [paymentInfo]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number (add space after every 4 digits)
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s+/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19); // 16 digits + 3 spaces
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } 
    // Format expiry date (MM/YY)
    else if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .slice(0, 5); // MM/YY
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } 
    // Format CVV (only numbers, max 4 digits)
    else if (name === 'cvv') {
      setFormData(prev => ({
        ...prev,
        [name]: value.replace(/\D/g, '').slice(0, 4)
      }));
    } 
    // For other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'creditCard') {
      // Remove all non-digit characters for validation
      const cardNumber = formData.cardNumber.replace(/\s+/g, '');
      
      if (!cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardNumber.length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else {
        // Check if the expiry date is in the future
        const [month, year] = formData.expiryDate.split('/');
        if (month && year) {
          const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const now = new Date();
          const currentMonth = now.getMonth() + 1;
          const currentYear = now.getFullYear() % 100;
          
          if (parseInt(year) < currentYear || 
              (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            newErrors.expiryDate = 'Card has expired';
          }
        } else {
          newErrors.expiryDate = 'Invalid expiry date';
        }
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const createBooking = async (method) => {
    if (!room?.id || !checkIn || !checkOut) {
      toast.error('Missing booking details. Please go back and try again.');
      return false;
    }

    const payload = {
      roomId: room.id,
      checkIn,
      checkOut,
      adults,
      children,
      specialRequests: specialRequests || '',
      guestInfo: {
        firstName: guestInfo?.firstName || '',
        lastName: guestInfo?.lastName || '',
        email: guestInfo?.email || '',
        phone: guestInfo?.phone || '',
        address: guestInfo?.address || '',
        city: guestInfo?.city || '',
        country: guestInfo?.country || '',
        postalCode: guestInfo?.postalCode || '',
      },
    };

    const res = await bookingsAPI.createBooking(payload);
    const created = res?.data;
    updateBookingData({
      paymentInfo: formData,
      paymentMethod: method,
      createdBooking: created,
    });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      try {
        const ok = await createBooking(paymentMethod);
        if (!ok) return;
        toast.success('Booking created successfully');
        nextStep();
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || 'Booking failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };
  
  const bookingSummary = getBookingSummary();
  const total = calculateTotal();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Information</h2>
        
        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('creditCard')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'creditCard'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                  paymentMethod === 'creditCard' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-400'
                }`}>
                  {paymentMethod === 'creditCard' && (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">Credit / Debit Card</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                  paymentMethod === 'paypal' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-400'
                }`}>
                  {paymentMethod === 'paypal' && (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">PayPal</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('mobileMoney')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'mobileMoney'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                  paymentMethod === 'mobileMoney' 
                    ? 'border-primary-500 bg-primary-500' 
                    : 'border-gray-400'
                }`}>
                  {paymentMethod === 'mobileMoney' && (
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">Mobile Money</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Credit Card Form */}
        {paymentMethod === 'creditCard' && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Card Number */}
              <div className="relative">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                    maxLength="19"
                  />
                  <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>
              
              {/* Card Name */}
              <div className="relative">
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.cardName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.cardName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expiry Date */}
                <div className="relative">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      maxLength="5"
                    />
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
                
                {/* CVV */}
                <div className="relative">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      maxLength="4"
                    />
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>
              
              {/* Accept Cards */}
              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="accept-terms"
                    name="accept-terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="accept-terms" className="font-medium text-gray-700">
                    I agree to the <a href="/terms" className="text-primary-600 hover:text-primary-500">Terms and Conditions</a> and 
                    <a href="/privacy" className="text-primary-600 hover:text-primary-500"> Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="mr-2 -ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Booking
                      <svg
                        className="ml-2 -mr-1 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
        
        {/* PayPal Payment */}
        {paymentMethod === 'paypal' && (
          <div className="text-center py-8">
            <p className="mb-6">You will be redirected to PayPal to complete your payment securely.</p>
            <button
              type="button"
              onClick={async () => {
                try {
                  setIsProcessing(true);
                  const ok = await createBooking('paypal');
                  if (!ok) return;
                  toast.success('Booking created successfully');
                  nextStep();
                } catch (error) {
                  toast.error(error?.response?.data?.message || error?.message || 'Booking failed. Please try again.');
                } finally {
                  setIsProcessing(false);
                }
              }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <img 
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-medium.png" 
                alt="Check out with PayPal" 
                className="h-8"
              />
            </button>
            <div className="mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                &larr; Back to other payment methods
              </button>
            </div>
          </div>
        )}
        
        {/* Mobile Money Payment */}
        {paymentMethod === 'mobileMoney' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Mobile Money payments are processed securely. You will receive a prompt on your mobile device to confirm the payment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mobileNetwork" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Network *
                </label>
                <select
                  id="mobileNetwork"
                  name="mobileNetwork"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select Network</option>
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="vodafone">Vodafone Cash</option>
                  <option value="airteltigo">AirtelTigo Money</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="e.g. 0244 123 4567"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">You will be charged:</p>
              <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Including all taxes and fees</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center h-5">
                <input
                  id="accept-mobile-terms"
                  name="accept-mobile-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="accept-mobile-terms" className="font-medium text-gray-700">
                  I agree to the <a href="/terms" className="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={() => {
                  (async () => {
                    try {
                      setIsProcessing(true);
                      const ok = await createBooking('mobileMoney');
                      if (!ok) return;
                      toast.success('Booking created successfully');
                      nextStep();
                    } catch (error) {
                      toast.error(error?.response?.data?.message || error?.message || 'Booking failed. Please try again.');
                    } finally {
                      setIsProcessing(false);
                    }
                  })();
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Pay with Mobile Money
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Booking Summary Sidebar */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Booking</h3>
        
        {bookingSummary.room && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Room</p>
              <p className="text-sm font-medium text-gray-900">{bookingSummary.room.name}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Check-in</p>
              <p className="text-sm text-gray-900">{bookingSummary.checkIn}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="text-sm text-gray-900">{bookingSummary.checkOut}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Guests</p>
              <p className="text-sm text-gray-900">
                {bookingSummary.adults} {bookingSummary.adults === 1 ? 'Adult' : 'Adults'}
                {bookingSummary.children > 0 && 
                  `, ${bookingSummary.children} ${bookingSummary.children === 1 ? 'Child' : 'Children'}`}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-xl font-bold text-primary-600">
                  ${total.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-1">
                    for {bookingSummary.nights} {bookingSummary.nights === 1 ? 'night' : 'nights'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
