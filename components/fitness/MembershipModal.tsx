'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useApp } from "@/lib/context/AppContext";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { planProps } from "@/utils/types";

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

interface MembershipModalProps {
  plan: planProps;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MembershipModal({ plan, onClose, onSuccess }: MembershipModalProps) {
  const [step, setStep] = useState("details"); // details, success
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const { user } = useApp();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!user) {
    toast.error('Please sign in to purchase a membership');
    router.push('/auth/signin');
    onClose();
    return null;
  }

  // Calculate dates
  const calculateEndDate = () => {
    const startDate = new Date();
    const endDate = new Date();
    
    if (plan.duration === "month" || plan.duration === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.duration === "quarter" || plan.duration === "quarterly") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (plan.duration === "year" || plan.duration === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    return { startDate, endDate };
  };

  // Paystack configuration
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  const currency = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY || 'GHS';
  
  const paystackConfig = {
    reference: `MEM-${new Date().getTime()}-${crypto.randomUUID().slice(0, 8)}`,
    email: user.email || '',
    amount: Math.round(plan.price * 100), // Amount in pesewas
    publicKey,
    currency,
    metadata: {
      custom_fields: [
        {
          display_name: 'Plan Name',
          variable_name: 'plan_name',
          value: plan.name
        },
        {
          display_name: 'Plan Duration',
          variable_name: 'plan_duration',
          value: plan.duration
        },
        {
          display_name: 'Payment Method',
          variable_name: 'payment_method',
          value: paymentMethod
        }
      ]
    }
  };

  const handlePaystackSuccess = async (reference: { reference: string }) => {
    try {
      toast.loading('Verifying payment...');
      setIsProcessing(true);
      
      // Verify payment with backend
      const verifyResponse = await fetch(`/api/payments/verify?reference=${reference.reference}`);
      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        toast.dismiss();
        toast.error('Payment verification failed. Please contact support.');
        setIsProcessing(false);
        return;
      }

      toast.dismiss();
      toast.success('Payment verified successfully!');

      // Calculate membership dates
      const { startDate, endDate } = calculateEndDate();

      // Save membership to database
      const { data: membership, error: membershipError } = await supabase
        .from('fitness_memberships')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          payment_reference: reference.reference,
          payment_method: paymentMethod,
          payment_status: 'paid'
        })
        .select()
        .single();

      if (membershipError) {
        console.error('Membership save error:', membershipError);
        toast.error(`Membership could not be saved: ${membershipError.message}. Please contact support with reference: ${reference.reference}`);
        setIsProcessing(false);
        return;
      }

      console.log('Membership created:', membership);
      toast.success('Membership activated successfully!');
      
      setStep("success");
      setIsProcessing(false);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Membership processing error:', error);
      toast.error('An error occurred. Please contact support.');
      setIsProcessing(false);
    }
  };

  const handlePaystackClose = () => {
    toast.error('Payment cancelled');
    setIsProcessing(false);
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
          className="bg-[#1A1A1A] rounded-3xl max-w-lg w-full p-8 border border-white/10"
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
              <h3 className="text-2xl font-bold mb-4">Welcome to {plan.name}!</h3>
              <p className="text-white/60">
                Your membership is now active. Check your dashboard to view details.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Join {plan.name}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!user && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-500 mb-1">Authentication Required</p>
                    <p className="text-sm text-white/60">
                      Please sign in or create an account to purchase a membership.
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#D4AF37]">
                    {currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : currency === 'ZAR' ? 'R' : '$'}{plan.price}
                  </span>
                  <span className="text-white/50">/{plan.duration}</span>
                </div>
                <p className="text-white/60 text-sm">Billed {plan.duration}ly</p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50 mb-2">What&apos;s included:</p>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-white/70 flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <Label className="text-white/70">Payment Method *</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-2">
                      Mobile Money
                      <CreditCard className="w-4 h-4 text-white/40" />
                    </Label>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                      Debit/Credit Card
                      <CreditCard className="w-4 h-4 text-white/40" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {publicKey && user ? (
                <PaystackButton
                  reference={paystackConfig.reference}
                  email={paystackConfig.email}
                  amount={paystackConfig.amount}
                  publicKey={paystackConfig.publicKey}
                  currency={paystackConfig.currency}
                  metadata={paystackConfig.metadata}
                  text={isProcessing ? 'Processing...' : `Pay ${currency === 'GHS' ? '₵' : currency === 'NGN' ? '₦' : currency === 'ZAR' ? 'R' : '$'}${plan.price}`}
                  onSuccess={handlePaystackSuccess}
                  onClose={handlePaystackClose}
                  disabled={isProcessing}
                  className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                />
              ) : (
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform"
                >
                  Sign In to Continue
                </button>
              )}

              <p className="text-center text-white/40 text-xs mt-4">
                Secure payment powered by PayStack
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}