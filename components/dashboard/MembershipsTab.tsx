'use client';

import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { Dumbbell, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Membership {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  amount_paid: number;
}

interface MembershipsTabProps {
  memberships: Membership[];
  isLoading: boolean;
}

export default function MembershipsTab({ memberships, isLoading }: MembershipsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-[#1A1A1A] rounded-2xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <div className="text-center py-16">
        <Dumbbell className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/50 mb-4">No active memberships</p>
        <Link
          href="/fresh&fit"
          className="inline-block px-6 py-3 gradient-gold text-black font-semibold rounded-full hover:scale-105 transition-transform"
        >
          Browse Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {memberships.map((membership, index) => {
        const daysLeft = differenceInDays(new Date(membership.end_date), new Date());
        const isActive = membership.status === "active" && daysLeft > 0;
        const isExpiring = isActive && daysLeft <= 7;

        return (
          <motion.div
            key={membership.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-[#1A1A1A] rounded-2xl p-6 border ${
              isActive ? "border-[#D4AF37]/30" : "border-white/5"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{membership.plan_name}</h3>
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-500">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-red-500/10 text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Expired
                    </span>
                  )}
                  {isExpiring && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-yellow-500/10 text-yellow-500">
                      Expires in {daysLeft} days
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#D4AF37]">
                  ${membership.amount_paid}
                </span>
                <p className="text-white/40 text-sm">paid</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>Started: {format(new Date(membership.start_date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-4 h-4" />
                <span>Ends: {format(new Date(membership.end_date), "MMM d, yyyy")}</span>
              </div>
            </div>

            {isActive && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/50">Membership Progress</span>
                  <span className="text-[#D4AF37]">{Math.max(0, daysLeft)} days left</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((differenceInDays(new Date(), new Date(membership.start_date))) / differenceInDays(new Date(membership.end_date), new Date(membership.start_date))) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full gradient-gold rounded-full"
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}