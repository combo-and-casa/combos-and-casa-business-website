'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Mail, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Select } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import {toast} from "sonner";

interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number
  specialRequests: string;
  status?: string;
}

export default function Reservations() {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
    status: "pending"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading('Submitting your reservation...');
    
    // Save reservation to Supabase
    const { data:reservationInsert, error: reservationError } = await supabase
      .from('restaurant_reservations')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        guests: formData.guests,
        special_requests: formData.specialRequests,
        status: formData.status
      });

      toast.dismiss();
      toast.success('Reservation submitted successfully!');


    if (reservationError) {
      console.error('Error saving reservation:', reservationError);
      toast.error('Failed to submit reservation. Please try again.');
      setIsSubmitting(false);
      return;
    }

    console.log('Reservation saved:', reservationInsert);
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        specialRequests: "",
        status: "pending"
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium tracking-wider mb-4"
          >
            RESERVE YOUR TABLE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Make a <span className="text-[#D4AF37]">Reservation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Book your table for an unforgettable dining experience at Nankwaase Bar & Restaurant
          </motion.p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 md:p-12"
          >
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Reservation Confirmed!</h3>
                <p className="text-white/60">
                  We&apos;ve received your reservation request. A confirmation email will be sent to you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      Full Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-[#0A0A0A] border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="bg-[#0A0A0A] border-white/10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="bg-[#0A0A0A] border-white/10"
                  />
                </div>

                {/* Date, Time, Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      Date
                    </label>
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="bg-[#0A0A0A] border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Time
                    </label>
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="bg-[#0A0A0A] border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-[#0A0A0A] border border-white/10 rounded-lg text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Requests (Optional)</label>
                  <Textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any dietary restrictions, allergies, or special occasions?"
                    rows={4}
                    className="bg-[#0A0A0A] border-white/10"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Reservation"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center"
          >
            <p className="text-white/60 mb-4">
              For immediate assistance or large party reservations, please call us
            </p>
            <a
              href="tel:+1234567890"
              className="text-[#D4AF37] font-semibold hover:underline text-lg"
            >
              +1 (234) 567-890
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
