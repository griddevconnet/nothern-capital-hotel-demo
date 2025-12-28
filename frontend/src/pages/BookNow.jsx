import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, CreditCard, User } from 'react-feather';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-fix.css'; // z-index fix for calendar popup

import { bookingsAPI, roomsAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

import Executive1 from '../assets/images/executive1.jpeg';

const BookNow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await roomsAPI.getAllRooms();
      return res.data;
    },
  });

  const fallbackRooms = [
    { id: 1, name: 'Deluxe Room', price: 199, image: Executive1 },
    { id: 2, name: 'Executive Suite', price: 299, image: Executive1 },
    { id: 3, name: 'Presidential Suite', price: 499, image: Executive1 },
  ];

  const rooms = useMemo(() => {
    const list = Array.isArray(roomsData) && roomsData.length ? roomsData : fallbackRooms;
    return list.map((r) => ({
      ...r,
      image: r.image || Executive1,
    }));
  }, [roomsData]);

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (!roomId) return;
    const idNum = Number(roomId);
    if (!Number.isFinite(idNum)) return;

    const match = rooms.find((r) => Number(r.id) === idNum);
    if (match) {
      setSelectedRoom(match);
      if (step < 2) setStep(2);
    }
  }, [rooms, searchParams, step]);

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const diffTime = Math.abs(checkOutDate - checkInDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    if (selectedRoom) {
      return selectedRoom.price * calculateNights();
    }
    return 0;
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place a booking');
      navigate('/login', { state: { from: { pathname: '/book-now' } } });
      return;
    }

    if (!selectedRoom) {
      toast.error('Please select a room');
      return;
    }
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const fullName = (data.fullName || '').trim();
    const [firstName, ...rest] = fullName.split(' ');
    const lastName = rest.join(' ');

    try {
      const payload = {
        roomId: selectedRoom.id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        adults,
        children,
        specialRequests: data.specialRequest || '',
        guestInfo: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: '',
          city: '',
          country: 'Ghana',
          postalCode: '',
        },
      };

      const res = await bookingsAPI.createBooking(payload);
      toast.success(`Booking created: ${res.data?.reference || ''}`.trim());
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to create booking');
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Dates
        return (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-white">Select Your Dates</h2>
            {/* Date Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Check-in Date</label>
                <div className="relative">
                  <DatePicker
                    selected={checkInDate}
                    onChange={date => setCheckInDate(date)}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={new Date()}
                    className="w-full p-2 border rounded-md"
                    placeholderText="Select check-in date"
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Check-out Date</label>
                <div className="relative">
                  <DatePicker
                    selected={checkOutDate}
                    onChange={date => setCheckOutDate(date)}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={checkInDate || new Date()}
                    className="w-full p-2 border rounded-md"
                    placeholderText="Select check-out date"
                  />
                  <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
            </div>
            {/* Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Adults</label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button type="button" onClick={() => setAdults(p => Math.max(1, p - 1))}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white">-</button>
                  <span className="flex-1 text-center text-white">{adults}</span>
                  <button type="button" onClick={() => setAdults(p => p + 1)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Children</label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button type="button" onClick={() => setChildren(p => Math.max(0, p - 1))}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white">-</button>
                  <span className="flex-1 text-center text-white">{children}</span>
                  <button type="button" onClick={() => setChildren(p => p + 1)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white">+</button>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <motion.button
                type="button"
                onClick={() => setStep(2)}
                disabled={!checkInDate || !checkOutDate}
                whileHover={{ scale: 1.05 }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-600"
              >
                Select Room
              </motion.button>
            </div>
          </motion.div>
        );

      case 2: // Room Selection
        return (
          <motion.div key="step2" initial="hidden" animate="visible" exit="exit" variants={stepVariants} transition={{ duration: 0.4 }} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Select Your Room</h2>
            <div className="space-y-4">
              {rooms.map(room => (
                <motion.div
                  key={room.id}
                  whileHover={{ scale: 1.02 }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedRoom?.id === room.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex items-start">
                    <img src={room.image} alt={room.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-white">{room.name}</h3>
                      <p className="text-gray-400 text-sm">${room.price} per night</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>Free cancellation</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-4 flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded-md hover:bg-gray-700 text-white">Back</button>
              <motion.button
                type="button"
                onClick={() => setStep(3)}
                disabled={!selectedRoom}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600"
              >
                Continue to Guest Info
              </motion.button>
            </div>
          </motion.div>
        );

      case 3: // Guest Info
        return (
          <motion.div key="step3" initial="hidden" animate="visible" exit="exit" variants={stepVariants} transition={{ duration: 0.4 }} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center"><User className="mr-2" /> Guest Information</h2>
            <div className="space-y-4">
              <input {...register("fullName", { required: true })} placeholder="Full Name" className="w-full p-2 border rounded-md text-black" />
              {errors.fullName && <p className="text-red-500 text-sm">Full name is required</p>}
              <input {...register("email", { required: true })} type="email" placeholder="Email Address" className="w-full p-2 border rounded-md text-black" />
              <input {...register("phone", { required: true })} type="tel" placeholder="Phone Number" className="w-full p-2 border rounded-md text-black" />
              <textarea {...register("specialRequest")} placeholder="Special Requests (optional)" className="w-full p-2 border rounded-md text-black" rows="3"></textarea>
            </div>
            <div className="pt-4 flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="px-4 py-2 border rounded-md hover:bg-gray-700 text-white">Back</button>
              <motion.button
                type="button"
                onClick={() => setStep(4)}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue to Payment
              </motion.button>
            </div>
          </motion.div>
        );

      case 4: // Payment
        return (
          <motion.div key="step4" initial="hidden" animate="visible" exit="exit" variants={stepVariants} transition={{ duration: 0.4 }} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center"><CreditCard className="mr-2" /> Payment</h2>
            <p className="text-gray-400">Total Amount: <span className="text-white font-bold">${calculateTotal()}</span></p>
            <div className="space-y-4">
              <input {...register("cardNumber", { required: true })} placeholder="Card Number" className="w-full p-2 border rounded-md text-black" />
              <div className="grid grid-cols-2 gap-4">
                <input {...register("expiry", { required: true })} placeholder="MM/YY" className="w-full p-2 border rounded-md text-black" />
                <input {...register("cvc", { required: true })} placeholder="CVC" className="w-full p-2 border rounded-md text-black" />
              </div>
              <input {...register("cardName", { required: true })} placeholder="Cardholder Name" className="w-full p-2 border rounded-md text-black" />
            </div>
            <div className="pt-4 flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="px-4 py-2 border rounded-md hover:bg-gray-700 text-white">Back</button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Booking
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero (navbar height) */}
      <div className="h-16 bg-gray-900"></div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Book Your Stay</h1>
          <p className="mt-2 text-gray-400">Complete your reservation in just a few simple steps</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg">
          {/* Step Progress */}
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((stepNum) => (
                <motion.div
                  key={stepNum}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stepNum * 0.1 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      stepNum < step
                        ? 'bg-green-500 text-white'
                        : stepNum === step
                        ? 'bg-blue-600 text-white scale-110 shadow-md'
                        : 'bg-gray-500 text-gray-300'
                    }`}
                  >
                    {stepNum < step ? '✓' : stepNum}
                  </div>
                  <span className={`text-xs mt-2 ${stepNum <= step ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {stepNum === 1 && 'Dates'}
                    {stepNum === 2 && 'Room'}
                    {stepNum === 3 && 'Guest Info'}
                    {stepNum === 4 && 'Payment'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 text-gray-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Need help? Call us at{' '}
            <a href="tel:+1234567890" className="text-blue-400 hover:underline">
              +1 (234) 567-890
            </a>
          </p>
          <p className="mt-1">Our customer service is available 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
