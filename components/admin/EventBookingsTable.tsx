'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, Mail, Phone, Check, X, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';

type EventBooking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_space_id: string;
  event_date: string;
  start_time: string;
  end_time: string;
  number_of_guests: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_method?: string;
  special_requests?: string;
  created_at: string;
  event_spaces?: {
    name: string;
    capacity: number;
    price_per_hour: number;
  };
};

type EventBookingsTableProps = {
  bookings: EventBooking[];
};

export default function EventBookingsTable({ bookings }: EventBookingsTableProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<'approve' | 'cancel' | 'mark-paid'>('approve');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === undefined || amount === null) return '₵0';
    return `₵${amount.toLocaleString()}`;
  };

  const handleAction = (bookingId: string, action: 'approve' | 'cancel' | 'mark-paid') => {
    setSelectedBooking(bookingId);
    setSelectedAction(action);
    setShowConfirm(true);
  };

  const updateBooking = async () => {
    setIsUpdating(true);
    try {
      let updateData = {};
      
      if (selectedAction === 'approve') {
        updateData = { status: 'approved' };
      } else if (selectedAction === 'cancel') {
        updateData = { status: 'cancelled' };
      } else if (selectedAction === 'mark-paid') {
        updateData = { payment_status: 'paid' };
      }

      const response = await fetch(`/api/admin/event-bookings/${selectedBooking}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      router.refresh();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No event bookings found</h3>
        <p className="text-white/60">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Customer</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Event Space</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Date & Time</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Guests</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Amount</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Payment</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-white font-medium">{booking.customer_name}</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {booking.customer_email}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {booking.customer_phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{booking.event_spaces?.name || 'N/A'}</p>
                    <p className="text-white/40 text-xs">Capacity: {booking.event_spaces?.capacity || 0}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-sm">{formatDate(booking.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm">{booking.start_time} - {booking.end_time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white/40" />
                      <span className="text-white">{booking.number_of_guests}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-white font-semibold">
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge 
                        status={booking.payment_status === 'paid' ? 'confirmed' : booking.payment_status === 'refunded' ? 'cancelled' : 'pending'} 
                      />
                      {booking.payment_method && (
                        <span className="text-white/40 text-xs capitalize">{booking.payment_method}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAction(booking.id, 'approve')}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleAction(booking.id, 'cancel')}
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                      {booking.payment_status === 'pending' && booking.status === 'approved' && (
                        <Button
                          onClick={() => handleAction(booking.id, 'mark-paid')}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      {(booking.status !== 'pending' && booking.payment_status !== 'pending') && (
                        <span className="text-white/40 text-sm">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title={
            selectedAction === 'approve' 
              ? 'Approve Booking' 
              : selectedAction === 'cancel'
              ? 'Cancel Booking'
              : 'Mark as Paid'
          }
          message={
            selectedAction === 'approve'
              ? 'Are you sure you want to approve this booking?'
              : selectedAction === 'cancel'
              ? 'Are you sure you want to cancel this booking?'
              : 'Are you sure you want to mark this booking as paid?'
          }
          confirmLabel={
            selectedAction === 'approve'
              ? 'Approve'
              : selectedAction === 'cancel'
              ? 'Cancel Booking'
              : 'Mark as Paid'
          }
          onConfirm={updateBooking}
          onCancel={() => setShowConfirm(false)}
          isLoading={isUpdating}
          variant={selectedAction === 'cancel' ? 'danger' : 'default'}
        />
      )}
    </>
  );
}
