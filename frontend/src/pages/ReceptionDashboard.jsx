import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FaCheck, FaClipboardList, FaMobileAlt, FaMoneyBillWave, FaPhoneAlt, FaSyncAlt, FaTimes, FaUndo } from 'react-icons/fa';
import { bookingsAPI, roomsAPI } from '../services/api.js';

const ReceptionDashboard = () => {
  const [updatingId, setUpdatingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [walkIn, setWalkIn] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    autoConfirm: true,
    markPaid: false,
    paymentMethod: 'CASH',
    amountPaid: '',
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reception', 'bookings'],
    queryFn: async () => {
      const res = await bookingsAPI.getAdminBookings();
      return res.data;
    },
  });

  const { data: roomsData } = useQuery({
    queryKey: ['reception', 'rooms'],
    queryFn: async () => {
      const res = await roomsAPI.getAllRooms();
      return res.data;
    },
  });

  const bookings = data || [];
  const rooms = roomsData || [];

  const patch = async (id, body) => {
    try {
      setUpdatingId(id);
      await bookingsAPI.updateAdminBooking(id, body);
      toast.success('Updated');
      refetch();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const setStatus = (id, status) => patch(id, { status });
  const markPaidCash = (id) => patch(id, { payment_status: 'PAID', payment_method: 'CASH' });
  const markPaidMomo = (id) => patch(id, { payment_status: 'PAID', payment_method: 'MOMO' });
  const markUnpaid = (id) => patch(id, { payment_status: 'UNPAID', payment_method: 'UNSPECIFIED', amount_paid: 0 });

  const canSubmitWalkIn = useMemo(() => {
    return Boolean(walkIn.roomId && walkIn.checkIn && walkIn.checkOut && walkIn.firstName && walkIn.lastName && walkIn.phone);
  }, [walkIn]);

  const submitWalkIn = async () => {
    if (!canSubmitWalkIn) {
      toast.error('Please fill required fields (room, dates, name, phone)');
      return;
    }

    if (walkIn.checkOut <= walkIn.checkIn) {
      toast.error('Check-out must be after check-in');
      return;
    }

    const ok = window.confirm('Create this walk-in booking now?');
    if (!ok) return;

    try {
      setCreating(true);

      const payload = {
        roomId: Number(walkIn.roomId),
        checkIn: walkIn.checkIn,
        checkOut: walkIn.checkOut,
        adults: Number(walkIn.adults || 1),
        children: Number(walkIn.children || 0),
        specialRequests: walkIn.specialRequests || '',
        guestInfo: {
          firstName: walkIn.firstName,
          lastName: walkIn.lastName,
          email: walkIn.email || '',
          phone: walkIn.phone,
          address: '',
          city: '',
          country: 'Ghana',
          postalCode: '',
        },
      };

      const res = await bookingsAPI.createBooking(payload);
      const booking = res?.data;
      if (!booking?.id) {
        toast.error('Booking created but missing ID');
        return;
      }

      if (walkIn.autoConfirm) {
        await bookingsAPI.updateAdminBooking(booking.id, { status: 'CONFIRMED' });
      }

      if (walkIn.markPaid) {
        const amountPaid = walkIn.amountPaid === '' ? undefined : Number(walkIn.amountPaid);
        await bookingsAPI.updateAdminBooking(booking.id, {
          payment_status: 'PAID',
          payment_method: walkIn.paymentMethod,
          amount_paid: Number.isFinite(amountPaid) ? amountPaid : undefined,
        });
      }

      toast.success(`Walk-in booking created: ${booking.reference}`);
      setWalkIn({
        roomId: '',
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        autoConfirm: true,
        markPaid: false,
        paymentMethod: 'CASH',
        amountPaid: '',
      });
      refetch();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to create walk-in booking');
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">Loading receptionist dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 nch-animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
            <p className="text-gray-600">Confirm bookings and record payments (cash / momo).</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <span className="inline-flex items-center gap-2">
              <FaSyncAlt className="h-4 w-4" />
              Refresh
            </span>
          </button>
        </div>

        <div className="bg-white border rounded-lg p-4 mb-6 nch-animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-gray-900 inline-flex items-center gap-2">
              <FaPhoneAlt className="h-4 w-4 text-blue-700" />
              Create Walk-in / Phone Booking
            </div>
            <button
              onClick={submitWalkIn}
              disabled={!canSubmitWalkIn || creating}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-800 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <FaClipboardList className="h-4 w-4" />
                {creating ? 'Creating...' : 'Create Booking'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Room *</label>
              <select
                value={walkIn.roomId}
                onChange={(e) => setWalkIn((p) => ({ ...p, roomId: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="">Select a room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} ({r.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Check-in *</label>
              <input
                type="date"
                value={walkIn.checkIn}
                onChange={(e) => setWalkIn((p) => ({ ...p, checkIn: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Check-out *</label>
              <input
                type="date"
                value={walkIn.checkOut}
                onChange={(e) => setWalkIn((p) => ({ ...p, checkOut: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">First name *</label>
              <input
                value={walkIn.firstName}
                onChange={(e) => setWalkIn((p) => ({ ...p, firstName: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Last name *</label>
              <input
                value={walkIn.lastName}
                onChange={(e) => setWalkIn((p) => ({ ...p, lastName: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone *</label>
              <input
                value={walkIn.phone}
                onChange={(e) => setWalkIn((p) => ({ ...p, phone: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={walkIn.email}
                onChange={(e) => setWalkIn((p) => ({ ...p, email: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Adults</label>
              <input
                type="number"
                min={1}
                value={walkIn.adults}
                onChange={(e) => setWalkIn((p) => ({ ...p, adults: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Children</label>
              <input
                type="number"
                min={0}
                value={walkIn.children}
                onChange={(e) => setWalkIn((p) => ({ ...p, children: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm text-gray-700 mb-1">Special Requests</label>
              <input
                value={walkIn.specialRequests}
                onChange={(e) => setWalkIn((p) => ({ ...p, specialRequests: e.target.value }))}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="md:col-span-3 flex flex-wrap gap-6 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={walkIn.autoConfirm}
                  onChange={(e) => setWalkIn((p) => ({ ...p, autoConfirm: e.target.checked }))}
                />
                Auto-confirm
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={walkIn.markPaid}
                  onChange={(e) => setWalkIn((p) => ({ ...p, markPaid: e.target.checked }))}
                />
                Mark as paid
              </label>

              {walkIn.markPaid && (
                <>
                  <select
                    value={walkIn.paymentMethod}
                    onChange={(e) => setWalkIn((p) => ({ ...p, paymentMethod: e.target.value }))}
                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="CASH">Cash</option>
                    <option value="MOMO">MoMo</option>
                  </select>
                  <input
                    placeholder="Amount paid (optional)"
                    value={walkIn.amountPaid}
                    onChange={(e) => setWalkIn((p) => ({ ...p, amountPaid: e.target.value }))}
                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden nch-animate-fade-in-up">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold text-gray-900 inline-flex items-center gap-2">
              <FaClipboardList className="h-4 w-4 text-blue-700" />
              Bookings
            </div>
            <div className="text-sm text-gray-500">{bookings.length} records</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Ref</th>
                  <th className="text-left px-4 py-3">Guest</th>
                  <th className="text-left px-4 py-3">Dates</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-900">{b.reference}</td>
                    <td className="px-4 py-3 text-gray-700">{b.guest_first_name} {b.guest_last_name}</td>
                    <td className="px-4 py-3 text-gray-700">{b.check_in} → {b.check_out}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{b.payment_status} / {b.payment_method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => setStatus(b.id, 'CONFIRMED')}
                          className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FaCheck className="h-3.5 w-3.5" />
                            Confirm
                          </span>
                        </button>
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => markPaidCash(b.id)}
                          className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FaMoneyBillWave className="h-3.5 w-3.5" />
                            Paid (Cash)
                          </span>
                        </button>
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => markPaidMomo(b.id)}
                          className="px-3 py-1 rounded-md bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FaMobileAlt className="h-3.5 w-3.5" />
                            Paid (MoMo)
                          </span>
                        </button>
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => markUnpaid(b.id)}
                          className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FaUndo className="h-3.5 w-3.5" />
                            Mark Unpaid
                          </span>
                        </button>
                        <button
                          disabled={updatingId === b.id}
                          onClick={() => {
                            const ok = window.confirm('Cancel this booking?');
                            if (!ok) return;
                            setStatus(b.id, 'CANCELLED');
                          }}
                          className="px-3 py-1 rounded-md bg-gray-200 text-gray-900 disabled:opacity-50"
                        >
                          <span className="inline-flex items-center gap-2">
                            <FaTimes className="h-3.5 w-3.5" />
                            Cancel
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">No bookings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Tip: "Paid" marks the booking as paid and sets the payment method (cash / momo).
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
