'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookingModalProps {
  onClose: () => void;
  onSuccess: () => void;
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

export default function BookingModal({ onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    event_type: "",
    event_date: "",
    start_time: "",
    end_time: "",
    guest_count: "",
    contact_name: "",
    contact_phone: "",
    special_requests: ""
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setStep("success");

    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1A1A1A] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-white/10"
        >
          {step === "success" ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-black" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Booking Request Submitted!</h3>
              <p className="text-white/60">
                Our events team will contact you within 24 hours to confirm your booking.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Book Your Event</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Event Type */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Event Type *</label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value: string) => setFormData({ ...formData, event_type: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private_party">Private Party</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday Celebration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                      <Calendar className="w-4 h-4" />
                      Event Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="bg-white/5 border-white/10 text-white h-12"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                      <Clock className="w-4 h-4" />
                      Start Time *
                    </label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="bg-white/5 border-white/10 text-white h-12"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                      <Clock className="w-4 h-4" />
                      End Time *
                    </label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <Users className="w-4 h-4" />
                    Expected Guest Count *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.guest_count}
                    onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                    placeholder="50"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Contact Name *</label>
                    <Input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Special Requests</label>
                  <Textarea
                    value={formData.special_requests}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, special_requests: e.target.value })}
                    placeholder="Any specific requirements, dietary restrictions, or special arrangements..."
                    className="bg-white/5 border-white/10 text-white min-h-25"
                  />
                </div>

                {/* Estimated Cost */}
                {formData.guest_count && (
                  <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Estimated Cost</p>
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      ${(parseInt(formData.guest_count) * 75).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      Based on ${75} per guest (final price may vary)
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.event_type || !formData.event_date || !formData.contact_name}
                  className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}