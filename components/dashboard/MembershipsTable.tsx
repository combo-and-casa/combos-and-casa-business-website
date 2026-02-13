'use client';

import { format } from "date-fns";
import { Membership } from "@/app/api/fitness/memberships";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface MembershipsTableProps {
  memberships: Membership[];
  showUserInfo?: boolean;
}

export default function MembershipsTable({ memberships, showUserInfo = false }: MembershipsTableProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    active: "bg-green-500/10 text-green-500 border-green-500/30",
    expired: "bg-gray-500/10 text-gray-500 border-gray-500/30",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    active: CheckCircle,
    expired: AlertCircle,
    cancelled: AlertCircle,
  };

  if (memberships.length === 0) {
    return (
      <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
        <p className="text-white/50">No memberships found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full" style={{ minWidth: '900px' }}>
        <thead className="bg-[#1A1A1A] border-b border-white/5">
          <tr>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">ID</th>
            {showUserInfo && <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">User ID</th>}
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Plan</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Amount</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Status</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Start Date</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">End Date</th>
            {showUserInfo && <th className="px-6 py-4 text-right text-sm font-semibold text-white/70">Payment Ref</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {memberships.map((membership) => {
            const StatusIcon = statusIcons[membership.status] || Clock;
            
            return (
              <tr key={membership.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-right">
                  <span className="font-mono text-sm text-[#D4AF37]">
                    #{membership.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                {showUserInfo && (
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-xs text-white/50">
                      {membership.user_id?.slice(0, 8)}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-white">{membership.plan_name}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-[#D4AF37]">
                    ${membership.amount_paid.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[membership.status]}`}>
                    <StatusIcon className="w-3 h-3" />
                    {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {format(new Date(membership.start_date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right text-sm text-white/70">
                  {format(new Date(membership.end_date), "MMM d, yyyy")}
                </td>
                {showUserInfo && (
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-xs text-white/50">
                      {membership.payment_reference || 'N/A'}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
