import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { PlanCardProps } from "@/utils/types";

export default function PlanCard({ plan, onSelect, index }: PlanCardProps) {
  const isPopular = plan.is_popular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-[#1A1A1A] rounded-3xl p-8 border transition-all duration-500 ${
        isPopular
          ? "border-[#D4AF37] scale-105 shadow-2xl shadow-[#D4AF37]/20"
          : "border-white/5 hover:border-white/20"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="gradient-gold px-4 py-2 rounded-full flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            <span className="text-black font-semibold text-sm">Most Popular</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[#D4AF37]">GHS {plan.price}</span>
          <span className="text-white/50">/{plan.duration}</span>
        </div>
        {plan.duration === "yearly" && (
          <p className="text-sm text-green-400 mt-1">Save 20% annually</p>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features?.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-[#D4AF37]" />
            </div>
            <span className="text-white/70">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
          isPopular
            ? "gradient-gold text-black hover:scale-[1.02]"
            : "bg-white/5 hover:bg-white/10 text-white"
        }`}
      >
        Choose Plan
      </button>
    </motion.div>
  );
}