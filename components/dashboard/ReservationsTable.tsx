'use client';

import { format } from "date-fns";
import { Reservation } from "@/app/api/restuarant/reservations";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface ReservationsTableProps {
  reservations: Reservation[];
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    confirmed: "bg-green-500/10 text-green-500 border-green-500/30",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  };

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: AlertCircle,
    completed: CheckCircle,
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
        <p className="text-white/50">No reservations found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full" style={{ minWidth: '850px' }}>
        <thead className="bg-[#1A1A1A] border-b border-white/5">
          <tr>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">ID</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Customer</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Date</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Time</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Party Size</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {reservations.map((reservation) => {
            const StatusIcon = statusIcons[reservation.status] || Clock;
            
            return (
              <tr key={reservation.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-right">
                  <span className="font-mono text-sm text-[#D4AF37]">
                    #{reservation.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm">
                    <p className="font-medium text-white">{reservation.name}</p>
                    <p className="text-white/50 text-xs">{reservation.email}</p>
                    <p className="text-white/50 text-xs">{reservation.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {format(new Date(reservation.reservation_date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {reservation.reservation_time}
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[reservation.status]}`}>
                    <StatusIcon className="w-3 h-3" />
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/50">
                  {format(new Date(reservation.created_at), "MMM d, yyyy")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
