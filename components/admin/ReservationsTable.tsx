'use client';

import { useState } from 'react';
import { UtensilsCrossed, Calendar, Clock, Users, Mail, Phone, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';

type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

type ReservationsTableProps = {
  reservations: Reservation[];
};

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<'confirm' | 'cancel'>('confirm');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleAction = (reservationId: string, action: 'confirm' | 'cancel') => {
    setSelectedReservation(reservationId);
    setSelectedAction(action);
    setShowConfirm(true);
  };

  const updateReservationStatus = async () => {
    setIsUpdating(true);
    try {
      const newStatus = selectedAction === 'confirm' ? 'confirmed' : 'cancelled';
      const response = await fetch(`/api/admin/reservations/${selectedReservation}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }

      router.refresh();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <UtensilsCrossed className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No reservations found</h3>
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
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Date & Time</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Guests</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Contact</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Special Requests</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{reservation.customer_name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-sm">{formatDate(reservation.reservation_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm">{reservation.reservation_time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white/40" />
                      <span className="text-white">{reservation.number_of_guests}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Phone className="w-3 h-3" />
                        <span>{reservation.customer_phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Mail className="w-3 h-3" />
                        <span>{reservation.customer_email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white/60 text-sm max-w-xs truncate">
                      {reservation.special_requests || 'None'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {reservation.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction(reservation.id, 'confirm')}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          onClick={() => handleAction(reservation.id, 'cancel')}
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                    {reservation.status !== 'pending' && (
                      <span className="text-white/40 text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title={`${selectedAction === 'confirm' ? 'Confirm' : 'Cancel'} Reservation`}
          message={`Are you sure you want to ${selectedAction} this reservation?`}
          confirmLabel={selectedAction === 'confirm' ? 'Confirm' : 'Cancel Reservation'}
          onConfirm={updateReservationStatus}
          onCancel={() => setShowConfirm(false)}
          isLoading={isUpdating}
          variant={selectedAction === 'cancel' ? 'danger' : 'default'}
        />
      )}
    </>
  );
}
