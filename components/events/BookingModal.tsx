'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Clock, CheckCircle, Loader2, CreditCard, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useApp } from "@/lib/context/AppContext";
import { EventSpaceProps } from "@/utils/types";

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

interface BookingModalProps {
  onClose: () => void;
  onSuccess: () => void;
  spaces: EventSpaceProps[];
}

interface FormData {
  event_space_id: string;
  purpose: string;
  event_date: string;
  start_time: string;
  end_time: string;
  guests: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string;
  payment_method: 'cash' | 'momo' | 'card';
}

export default function BookingModal({ onClose, onSuccess, spaces }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useApp();
  
  // Generate payment reference once on mount
  const [paymentReference] = useState(() => {
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 10);
    return `EVENT-${timestamp}-${randomId}`;
  });
  
  const [formData, setFormData] = useState<FormData>({
    event_space_id: "",
    purpose: "",
    event_date: "",
    start_time: "",
    end_time: "",
    guests: "",
    customer_name: user?.user_metadata?.full_name || "",
    customer_email: user?.email || "",
    customer_phone: "",
    special_requests: "",
    payment_method: "cash"
  });

  const selectedSpace = spaces.find(s => s.id === formData.event_space_id);
  const requiresPayment = formData.payment_method !== 'cash';
  
  // Paystack configuration
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  const currency = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || 'GHS';
  
  const paystackConfig = {
    reference: paymentReference,
    email: formData.customer_email || '',
    amount: selectedSpace ? Math.round(selectedSpace.price * 100) : 0,
    publicKey,
    currency,
    metadata: {
      custom_fields: [
        {
          display_name: 'Event Space',
          variable_name: 'event_space',
          value: selectedSpace?.name || ''
        },
        {
          display_name: 'Event Date',
          variable_name: 'event_date',
          value: formData.event_date
        },
        {
          display_name: 'Payment Method',
          variable_name: 'payment_method',
          value: formData.payment_method
        }
      ]
    }
  };

  const handleCashBooking = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/event-spaces/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || null,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          event_space_id: formData.event_space_id,
          event_date: formData.event_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          guests: parseInt(formData.guests),
          purpose: formData.purpose,
          special_requests: formData.special_requests,
          payment_method: 'cash',
          payment_status: 'pending'
        })
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || 'Booking failed');
        setIsSubmitting(false);
        return;
      }

      toast.success('Booking confirmed! Payment on arrival.');
      setStep("success");
      setIsSubmitting(false);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handlePaystackSuccess = async (reference: { reference: string }) => {
    try {
      toast.loading('Verifying payment...');
      setIsSubmitting(true);
      
      // Verify payment with backend
      const verifyResponse = await fetch(`/api/payments/verify?reference=${reference.reference}`);
      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        toast.dismiss();
        toast.error('Payment verification failed. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      toast.dismiss();
      toast.success('Payment verified successfully!');

      // Create booking with payment reference
      const response = await fetch('/api/event-spaces/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || null,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          event_space_id: formData.event_space_id,
          event_date: formData.event_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          guests: parseInt(formData.guests),
          purpose: formData.purpose,
          special_requests: formData.special_requests,
          payment_method: formData.payment_method,
          payment_reference: reference.reference,
          payment_status: 'paid'
        })
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(`Booking failed: ${data.error}. Reference: ${reference.reference}`);
        setIsSubmitting(false);
        return;
      }

      toast.success('Booking confirmed and paid!');
      setStep("success");
      setIsSubmitting(false);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Booking processing error:', error);
      toast.error('An error occurred. Please contact support.');
      setIsSubmitting(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error('Payment cancelled');
    setIsSubmitting(false);
  };

  const validateForm = () => {
    if (!formData.event_space_id || !formData.event_date || !formData.start_time || 
        !formData.end_time || !formData.customer_name || !formData.customer_phone) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (requiresPayment && !formData.customer_email) {
      toast.error('Email is required for online payments');
      return false;
    }
    return true;
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
              <h3 className="text-2xl font-bold mb-4">Booking Confirmed!</h3>
              <p className="text-white/60">
                {formData.payment_method === 'cash' 
                  ? 'Your booking is confirmed. Payment can be made on arrival.'
                  : 'Your booking is confirmed and payment has been received.'}
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
                {/* Event Space Selection */}
                <div className="">
                  <label className="block text-sm text-white/60 mb-2">Event Space *</label>
                  <Select
                    value={formData.event_space_id}
                    onValueChange={(value: string) => setFormData({ ...formData, event_space_id: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                      <SelectValue placeholder="Select event space" />
                    </SelectTrigger>
                    <SelectContent>
                      {spaces.map(space => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name} - {space.capacity} (
                          {currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : currency === 'ZAR' ? 'R' : '$'}
                          {space.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Purpose */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Event Purpose *</label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value: string) => setFormData({ ...formData, purpose: value })}
                  >
                    <SelectTrigger className="bg-white/5 w-full border-white/10 text-white">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private_party">Private Party</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday Celebration</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
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
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-white/5 border-white/10 text-white"
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
                      className="bg-white/5 border-white/10 text-white"
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
                    Expected Guests *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    placeholder="50"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      placeholder="+233 000 000 000"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Email {requiresPayment && '*'}
                  </label>
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Special Requests</label>
                  <Textarea
                    value={formData.special_requests}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setFormData({ ...formData, special_requests: e.target.value })}
                    placeholder="Any specific requirements or special arrangements..."
                    className="bg-white/5 border-white/10 text-white min-h-25"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-white/70 mb-3 block">Payment Method *</Label>
                  <RadioGroup 
                    value={formData.payment_method} 
                    onValueChange={(value: 'cash' | 'momo' | 'card') => 
                      setFormData({ ...formData, payment_method: value })}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-white/40" />
                        Cash on Arrival
                      </Label>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-white/40" />
                        Mobile Money
                      </Label>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-white/40" />
                        Debit/Credit Card
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Price Display */}
                {selectedSpace && (
                  <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      {currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : currency === 'ZAR' ? 'R' : '$'}
                      {selectedSpace.price.toLocaleString()}
                    </p>
                    {formData.payment_method === 'cash' && (
                      <p className="text-xs text-white/40 mt-1">
                        Payment on arrival
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                {formData.payment_method === 'cash' ? (
                  <button
                    onClick={handleCashBooking}
                    disabled={isSubmitting}
                    className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                ) : publicKey && formData.customer_email ? (
                  <PaystackButton
                    reference={paystackConfig.reference}
                    email={paystackConfig.email}
                    amount={paystackConfig.amount}
                    publicKey={paystackConfig.publicKey}
                    currency={paystackConfig.currency}
                    metadata={paystackConfig.metadata}
                    text={isSubmitting ? 'Processing...' : `Pay ${currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : currency === 'ZAR' ? 'R' : '$'}${selectedSpace?.price || 0}`}
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                    disabled={isSubmitting || !validateForm()}
                    className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                  />
                ) : (
                  <button
                    disabled
                    className="w-full py-4 bg-white/10 text-white/40 font-semibold rounded-xl cursor-not-allowed"
                  >
                    Fill all required fields
                  </button>
                )}

                <p className="text-center text-white/40 text-xs">
                  {requiresPayment ? 'Secure payment powered by PayStack' : 'No payment required now'}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}