import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  FaBed,
  FaCheck,
  FaClipboardList,
  FaClock,
  FaEdit,
  FaExclamationCircle,
  FaMobileAlt,
  FaMoneyBillWave,
  FaPlus,
  FaSave,
  FaSignInAlt,
  FaSyncAlt,
  FaTimes,
  FaTrash,
  FaUndo,
} from 'react-icons/fa';
import { bookingsAPI, roomsAPI } from '../services/api.js';

const AdminDashboard = () => {
  const [tab, setTab] = useState('bookings');
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    maxOccupancy: 1,
    amenitiesText: '',
  });

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErrorObj,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const res = await bookingsAPI.getAdminBookings();
      return res.data;
    },
  });

  const {
    data: roomsData,
    isLoading: roomsLoading,
    isError: roomsError,
    error: roomsErrorObj,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ['admin', 'rooms'],
    queryFn: async () => {
      const res = await roomsAPI.getAllRooms();
      return res.data;
    },
  });

  const bookings = bookingsData || [];
  const rooms = roomsData || [];

  const bookingPatchMutation = useMutation({
    mutationFn: ({ id, patch }) => bookingsAPI.updateAdminBooking(id, patch),
    onSuccess: () => {
      toast.success('Updated');
      refetchBookings();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed');
    },
  });

  const roomSaveMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      if (id) return roomsAPI.updateRoom(id, payload);
      return roomsAPI.createRoom(payload);
    },
    onSuccess: () => {
      toast.success('Room saved');
      setEditingRoomId(null);
      setRoomForm({ name: '', description: '', price: '', size: '', maxOccupancy: 1, amenitiesText: '' });
      refetchRooms();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save room');
    },
  });

  const roomDeleteMutation = useMutation({
    mutationFn: (id) => roomsAPI.deleteRoom(id),
    onSuccess: () => {
      toast.success('Room deleted');
      refetchRooms();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete room');
    },
  });

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const checkedIn = bookings.filter((b) => b.status === 'CHECKED_IN').length;
    const unpaid = bookings.filter((b) => b.payment_status === 'UNPAID').length;
    return { total, pending, confirmed, checkedIn, unpaid };
  }, [bookings]);

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 ring-blue-200';
      case 'CHECKED_IN':
        return 'bg-blue-50 text-blue-700 ring-blue-200';
      case 'CHECKED_OUT':
        return 'bg-gray-50 text-gray-700 ring-gray-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 ring-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-200';
    }
  };

  const paymentBadgeClass = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-blue-50 text-blue-700 ring-blue-200';
      case 'UNPAID':
        return 'bg-amber-50 text-amber-700 ring-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-200';
    }
  };

  const isLoading = bookingsLoading || roomsLoading;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-gray-700">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (bookingsError || roomsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-white border border-red-200 rounded-lg p-4">
            <div className="font-semibold text-red-700">Failed to load dashboard</div>
            <div className="text-sm text-red-600 mt-1">{bookingsErrorObj?.message || roomsErrorObj?.message || 'Unknown error'}</div>
            <button
              onClick={() => {
                refetchBookings();
                refetchRooms();
              }}
              className="mt-3 px-4 py-2 rounded-md bg-red-600 text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const setStatus = (id, status) => bookingPatchMutation.mutate({ id, patch: { status } });
  const markPaidCash = (id) => bookingPatchMutation.mutate({ id, patch: { payment_status: 'PAID', payment_method: 'CASH' } });
  const markPaidMomo = (id) => bookingPatchMutation.mutate({ id, patch: { payment_status: 'PAID', payment_method: 'MOMO' } });
  const markUnpaid = (id) =>
    bookingPatchMutation.mutate({ id, patch: { payment_status: 'UNPAID', payment_method: 'UNSPECIFIED', amount_paid: 0 } });

  const startEditRoom = (r) => {
    setEditingRoomId(r.id);
    setRoomForm({
      name: r.name || '',
      description: r.description || '',
      price: r.price ?? '',
      size: r.size ?? '',
      maxOccupancy: r.maxOccupancy ?? r.max_occupancy ?? 1,
      amenitiesText: Array.isArray(r.amenities) ? r.amenities.join(', ') : '',
    });
    setTab('rooms');
  };

  const clearRoomForm = () => {
    setEditingRoomId(null);
    setRoomForm({ name: '', description: '', price: '', size: '', maxOccupancy: 1, amenitiesText: '' });
  };

  const saveRoom = () => {
    if (!roomForm.name.trim()) {
      toast.error('Room name is required');
      return;
    }
    if (roomForm.price === '' || Number.isNaN(Number(roomForm.price))) {
      toast.error('Valid price is required');
      return;
    }
    const amenities = (roomForm.amenitiesText || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: roomForm.name,
      description: roomForm.description,
      price: roomForm.price,
      size: roomForm.size,
      maxOccupancy: Number(roomForm.maxOccupancy || 1),
      amenities,
      isActive: true,
    };
    roomSaveMutation.mutate({ id: editingRoomId, payload });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 nch-animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of bookings and hotel operations.</p>
          </div>
          <button
            onClick={() => {
              refetchBookings();
              refetchRooms();
            }}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            <span className="inline-flex items-center gap-2">
              <FaSyncAlt className="h-4 w-4" />
              Refresh
            </span>
          </button>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-white border rounded-lg mb-6">
          <button
            onClick={() => setTab('bookings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'bookings' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-900 hover:bg-blue-50'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <FaClipboardList className="h-4 w-4" />
              Bookings
            </span>
          </button>
          <button
            onClick={() => setTab('rooms')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'rooms' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-900 hover:bg-blue-50'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <FaBed className="h-4 w-4" />
              Rooms
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 nch-animate-fade-in-up transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <FaClipboardList className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 nch-animate-fade-in-up transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '40ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <FaClock className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 nch-animate-fade-in-up transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '80ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Confirmed</div>
                <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <FaCheck className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 nch-animate-fade-in-up transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Checked In</div>
                <div className="text-2xl font-bold text-gray-900">{stats.checkedIn}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                <FaSignInAlt className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 nch-animate-fade-in-up transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: '160ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Unpaid</div>
                <div className="text-2xl font-bold text-gray-900">{stats.unpaid}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <FaExclamationCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {tab === 'bookings' && (
          <div className="bg-white border rounded-lg overflow-hidden nch-animate-fade-in-up">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="font-semibold text-gray-900">Bookings</div>
              <div className="text-sm text-gray-500">{bookings.length} records</div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Ref</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Guest</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Room</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Dates</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Payment</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{b.reference}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.guest_first_name} {b.guest_last_name}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.room?.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{b.check_in} → {b.check_out}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusBadgeClass(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${paymentBadgeClass(
                            b.payment_status,
                          )}`}
                        >
                          {b.payment_status} / {b.payment_method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            disabled={bookingPatchMutation.isPending}
                            onClick={() => setStatus(b.id, 'CONFIRMED')}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            <span className="inline-flex items-center gap-2">
                              <FaCheck className="h-3.5 w-3.5" />
                              Confirm
                            </span>
                          </button>
                          <button
                            disabled={bookingPatchMutation.isPending}
                            onClick={() => markPaidCash(b.id)}
                            className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            <span className="inline-flex items-center gap-2">
                              <FaMoneyBillWave className="h-3.5 w-3.5" />
                              Paid (Cash)
                            </span>
                          </button>
                          <button
                            disabled={bookingPatchMutation.isPending}
                            onClick={() => markPaidMomo(b.id)}
                            className="px-3 py-1 rounded-md bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
                          >
                            <span className="inline-flex items-center gap-2">
                              <FaMobileAlt className="h-3.5 w-3.5" />
                              Paid (MoMo)
                            </span>
                          </button>
                          <button
                            disabled={bookingPatchMutation.isPending}
                            onClick={() => markUnpaid(b.id)}
                            className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
                          >
                            <span className="inline-flex items-center gap-2">
                              <FaUndo className="h-3.5 w-3.5" />
                              Mark Unpaid
                            </span>
                          </button>
                          <button
                            disabled={bookingPatchMutation.isPending}
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
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-500">No bookings yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 nch-animate-fade-in-up">
            <div className="bg-white border rounded-lg p-4 lg:col-span-2" key={editingRoomId || 'new'}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="font-semibold text-gray-900">{editingRoomId ? 'Edit Room' : 'Create Room'}</div>
                <div className="flex items-center gap-2">
                  {editingRoomId && (
                    <button onClick={clearRoomForm} className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-900 hover:bg-blue-100">
                      <span className="inline-flex items-center gap-2">
                        <FaPlus className="h-3.5 w-3.5" />
                        New Room
                      </span>
                    </button>
                  )}
                  <button
                    disabled={roomSaveMutation.isPending}
                    onClick={saveRoom}
                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-800 disabled:opacity-50"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FaSave className="h-3.5 w-3.5" />
                      Save
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Name</label>
                  <input
                    value={roomForm.name}
                    onChange={(e) => setRoomForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Deluxe Suite"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    min={0}
                    value={roomForm.price}
                    onChange={(e) => setRoomForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="e.g. 250"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Size</label>
                  <input
                    value={roomForm.size}
                    onChange={(e) => setRoomForm((p) => ({ ...p, size: e.target.value }))}
                    placeholder="e.g. 40sqm"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Occupancy</label>
                  <input
                    type="number"
                    min={1}
                    value={roomForm.maxOccupancy}
                    onChange={(e) => setRoomForm((p) => ({ ...p, maxOccupancy: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={roomForm.description}
                    onChange={(e) => setRoomForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Amenities (comma separated)</label>
                  <input
                    value={roomForm.amenitiesText}
                    onChange={(e) => setRoomForm((p) => ({ ...p, amenitiesText: e.target.value }))}
                    placeholder="e.g. WiFi, TV, Air Conditioning"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden lg:col-span-3">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <div className="font-semibold text-gray-900">Rooms</div>
                <div className="text-sm text-gray-500">{rooms.length} records</div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Max</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rooms.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.name}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.price}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.maxOccupancy ?? r.max_occupancy}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditRoom(r)}
                              className="px-3 py-1 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200"
                            >
                              <span className="inline-flex items-center gap-2">
                                <FaEdit className="h-3.5 w-3.5" />
                                Edit
                              </span>
                            </button>
                            <button
                              disabled={roomDeleteMutation.isPending}
                              onClick={() => {
                                const ok = window.confirm(`Delete room "${r.name}"?`);
                                if (!ok) return;
                                roomDeleteMutation.mutate(r.id);
                              }}
                              className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              <span className="inline-flex items-center gap-2">
                                <FaTrash className="h-3.5 w-3.5" />
                                Delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {rooms.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-gray-500">No rooms yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
