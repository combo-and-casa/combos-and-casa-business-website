'use client';

import { format } from "date-fns";
import { Booking } from "@/app/api/event-spaces/bookings";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface BookingsTableProps {
  bookings: Booking[];
  showUserInfo?: boolean;
}

export default function BookingsTable({ bookings, showUserInfo = false }: BookingsTableProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    approved: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    paid: "bg-green-500/10 text-green-500 border-green-500/30",
    completed: "bg-green-500/10 text-green-500 border-green-500/30",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    approved: CheckCircle,
    paid: CheckCircle,
    completed: CheckCircle,
    cancelled: AlertCircle,
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
        <p className="text-white/50">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full" style={{ minWidth: '1000px' }}>
        <thead className="bg-[#1A1A1A] border-b border-white/5">
          <tr>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Booking ID</th>
            {showUserInfo && <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Customer</th>}
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Event Type</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Space</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Guests</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Date</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Time</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Cost</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-x divide-white/5">
          {bookings.map((booking) => {
            const StatusIcon = statusIcons[booking.status] || Clock;
            
            return (
              <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-right">
                  <span className="font-mono text-sm text-[#D4AF37]">
                    #{booking.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                {showUserInfo && (
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm">
                      <p className="font-medium text-white">{booking.contact_name}</p>
                      <p className="text-white/50 text-xs">{booking.customer_email}</p>
                      <p className="text-white/50 text-xs">{booking.customer_phone}</p>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-white capitalize">{booking.event_type}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-white/70">{booking.space_name || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-white/70">{booking.guest_count}</span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {format(new Date(booking.event_date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {booking.start_time} - {booking.end_time}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-[#D4AF37]">
                    ${booking.estimated_cost.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}>
                    <StatusIcon className="w-3 h-3" />
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
