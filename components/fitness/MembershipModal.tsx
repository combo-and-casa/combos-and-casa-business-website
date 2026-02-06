import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Loader2, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MembershipModal({ plan, onClose, onSuccess }: { plan: any; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState("details"); // details, payment, success
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);

    const startDate = new Date();
    const endDate = new Date();
    
    if (plan.duration === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.duration === "quarterly") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (plan.duration === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // await base44.entities.Membership.create({
    //   plan_id: plan.id,
    //   plan_name: plan.name,
    //   start_date: startDate.toISOString().split('T')[0],
    //   end_date: endDate.toISOString().split('T')[0],
    //   status: "active",
    //   amount_paid: plan.price
    // });

    setIsProcessing(false);
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
              <h3 className="text-2xl font-bold mb-4">Welcome to the Team!</h3>
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

              <div className="mb-6 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#D4AF37]">GHS {plan.price}</span>
                  <span className="text-white/50">/{plan.duration}</span>
                </div>
                <p className="text-white/60 text-sm">Billed {plan.duration}ly</p>
              </div>

              <div className="space-y-4 mb-6">
                <RadioGroup defaultValue="">
                  <div className="flex items-center gap-2">
                      <RadioGroupItem value="momo" id="momo" />
                      <label className=" flex items-center gap-2 text-sm text-white/60">
                        Mobile Money
                        <CreditCard className="w-4 h-4 text-white/40" />
                      </label>    
                  </div>
                  {/* <div className="flex items-center gap-2">
                      <RadioGroupItem value="telecel-cash" id="telecel-cash" />
                        <label className=" flex items-center gap-2 text-sm text-white/60">
                          Telecel Cash
                          <CreditCard className="w-4 h-4 text-white/40" />
                        </label>  
                  </div>
                  <div className="flex items-center gap-2">
                      <RadioGroupItem value="at-cash" id="at-cash" />
                        <label className=" flex items-center gap-2 text-sm text-white/60">
                          AT Cash
                          <CreditCard className="w-4 h-4 text-white/40" />
                        </label>
                  </div> */}
                  <div className="flex items-center gap-2">
                      <RadioGroupItem value="card" id="card" />
                        <label className=" flex items-center gap-2 text-sm text-white/60">
                          Debit/Credit Card
                          <CreditCard className="w-4 h-4 text-white/40" />
                        </label>
                  </div>
                </RadioGroup>
                {/* <div className="grid grid-cols-2 gap-4">
                </div> */}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full py-4 gradient-gold text-black font-semibold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Proceed to pay GHS${plan.price}`
                )}
              </button>

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