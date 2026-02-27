'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
// import Image from "next/image";

interface EventType {
  value: string;
  label: string;
}

interface BookingFormProps {
  user?: { 
    full_name?: string;
    email?: string;
  } | null;
}

interface FormData {
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  guest_count: string;
  contact_name: string;
  contact_phone: string;
  special_requests: string;
}

const eventTypes: EventType[] = [
  { value: "private_party", label: "Private Party" },
  { value: "corporate", label: "Corporate Event" },
  { value: "wedding", label: "Wedding Reception" },
  { value: "birthday", label: "Birthday Celebration" },
  { value: "other", label: "Other" }
];

export default function BookingForm({ user }: BookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    event_type: "",
    event_date: "",
    start_time: "",
    end_time: "",
    guest_count: "",
    contact_name: user?.full_name || "",
    contact_phone: "",
    special_requests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading('Submitting your booking request...');

    try {
      // Validate required fields
      if (!formData.event_type || !formData.event_date || !formData.start_time || !formData.end_time || 
          !formData.guest_count || !formData.contact_name || !formData.contact_phone) {
        toast.dismiss();
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Get contact email from user or require it in form
      const contactEmail = user?.email || '';
      if (!contactEmail) {
        toast.dismiss();
        toast.error('Please sign in to submit a booking');
        setIsSubmitting(false);
        return;
      }

      // Save booking to database
      const { data: bookingInsert, error: bookingError } = await supabase
        .from('event_bookings')
        .insert({
          event_type: formData.event_type,
          event_date: formData.event_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          guest_count: parseInt(formData.guest_count),
          contact_name: formData.contact_name,
          contact_email: contactEmail,
          contact_phone: formData.contact_phone,
          special_requests: formData.special_requests || null,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error saving booking:', bookingError);
        toast.dismiss();
        toast.error('Failed to submit booking. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Booking saved:', bookingInsert);

      // Send confirmation emails (non-blocking)
      try {
        const emailResponse = await fetch('/api/send-event-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: bookingInsert.id,
            contactName: formData.contact_name,
            contactEmail: contactEmail,
            contactPhone: formData.contact_phone,
            eventType: formData.event_type,
            eventDate: formData.event_date,
            startTime: formData.start_time,
            endTime: formData.end_time,
            guestCount: formData.guest_count,
            specialRequests: formData.special_requests,
          }),
        });

        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('✅ Confirmation emails sent');
        } else {
          console.warn('⚠️ Email sending failed, but booking is successful');
        }
      } catch (emailError) {
        console.error('⚠️ Email error (booking still successful):', emailError);
      }

      toast.dismiss();
      toast.success('Booking request submitted! Check your email for confirmation.');
      setIsSubmitting(false);
      setSuccess(true);

    } catch (error) {
      console.error('Booking submission error:', error);
      toast.dismiss();
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-black" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Booking Request Sent!</h3>
        <p className="text-white/50 mb-6">
          Our team will review your request and contact you within 24 hours.
        </p>
        <Link
          href="/Dashboard"
          className="inline-block px-6 py-3 gradient-gold text-black font-semibold rounded-full"
        >
          View My Bookings
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Type */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Event Type</label>
        <Select
          value={formData.event_type}
          onValueChange={(value) => setFormData({ ...formData, event_type: value })}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Event Date
          </label>
          <Input
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            className="bg-white/5 border-white/10 text-white h-12"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Start Time
          </label>
          <Input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="bg-white/5 border-white/10 text-white h-12"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            End Time
          </label>
          <Input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="bg-white/5 border-white/10 text-white h-12"
            required
          />
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <label className="block text-sm text-white/60 mb-2">
          <Users className="w-4 h-4 inline mr-2" />
          Number of Guests
        </label>
        <Input
          type="number"
          min="1"
          value={formData.guest_count}
          onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
          placeholder="Expected number of guests"
          className="bg-white/5 border-white/10 text-white h-12"
          required
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-2">Contact Name</label>
          <Input
            type="text"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="Your full name"
            className="bg-white/5 border-white/10 text-white h-12"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Phone Number</label>
          <Input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            placeholder="Your phone number"
            className="bg-white/5 border-white/10 text-white h-12"
            required
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm text-white/60 mb-2">Special Requests</label>
        <Textarea
          value={formData.special_requests}
          onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
          placeholder="Tell us about your vision, catering preferences, or any special requirements..."
          className="bg-white/5 border-white/10 text-white min-h-30"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : user ? (
          "Submit Booking Request"
        ) : (
          "Sign In to Book"
        )}
      </button>
    </form>
  );
}