'use client';

import { motion } from "framer-motion";
import { format } from "date-fns";
import { PartyPopper, Calendar, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

interface Booking {
  id: string;
  event_type: string;
  status: string;
  event_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  contact_name: string;
  estimated_cost: number;
  special_requests?: string;
}

interface BookingsTabProps {
  bookings: Booking[];
  isLoading: boolean;
}

const statusConfig: Record<string, StatusConfig> = {
  pending: { label: "Pending Review", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  confirmed: { label: "Confirmed", color: "text-green-500", bg: "bg-green-500/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-500/10" }
};

const eventTypeLabels: Record<string, string> = {
  private_party: "Private Party",
  corporate: "Corporate Event",
  wedding: "Wedding Reception",
  birthday: "Birthday Celebration",
  other: "Other Event"
};

export default function BookingsTab({ bookings, isLoading }: BookingsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#1A1A1A] rounded-2xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <PartyPopper className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/50 mb-4">No event bookings yet</p>
        <Link
          href="/event-space"
          className="inline-block px-6 py-3 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
        >
          Book an Event
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => {
        const status = statusConfig[booking.status] || statusConfig.pending;

        return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {eventTypeLabels[booking.event_type] || booking.event_type}
                </h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${status.bg} ${status.color}`}>
                  {booking.status === "confirmed" ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : booking.status === "cancelled" ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {status.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>{format(new Date(booking.event_date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{booking.start_time} - {booking.end_time}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span>{booking.guest_count} guests</span>
              </div>
            </div>

            {booking.special_requests && (
              <p className="mt-4 text-sm text-white/40 italic">
                &quot;{booking.special_requests}&quot;
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}