'use client';

import { useState } from 'react';
import { Users, Calendar, Mail, Phone, CreditCard, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';

type Membership = {
  id: string;
  user_id: string;
  fitness_plan_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  payment_status: 'pending' | 'paid';
  payment_reference?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  fitness_plans?: {
    name: string;
    price: number;
    duration_months: number;
  };
};

type MembershipsTableProps = {
  memberships: Membership[];
};

export default function MembershipsTable({ memberships }: MembershipsTableProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₵${amount.toLocaleString()}`;
  };

  const handleActivate = (membershipId: string) => {
    setSelectedMembership(membershipId);
    setShowConfirm(true);
  };

  const activateMembership = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/memberships/${selectedMembership}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid', status: 'active' }),
      });

      if (!response.ok) {
        throw new Error('Failed to activate membership');
      }

      router.refresh();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error activating membership:', error);
      alert('Failed to activate membership. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (memberships.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No memberships found</h3>
        <p className="text-white/60">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Member</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Plan</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Duration</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Amount</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Payment</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-white font-medium">{membership.customer_name}</p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {membership.customer_email}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {membership.customer_phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-white font-medium">{membership.fitness_plans?.name || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="text-sm">{formatDate(membership.start_date)}</span>
                      </div>
                      <span className="text-white/60 text-xs pl-6">to {formatDate(membership.end_date)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-white font-semibold">
                      {formatCurrency(membership.fitness_plans?.price || 0)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={membership.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge 
                        status={membership.payment_status === 'paid' ? 'confirmed' : 'pending'} 
                      />
                      {membership.payment_reference && (
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {membership.payment_reference.slice(0, 12)}...
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {membership.payment_status === 'pending' && (
                      <Button
                        onClick={() => handleActivate(membership.id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    {membership.payment_status === 'paid' && (
                      <span className="text-white/40 text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Activate Membership"
          message="Are you sure you want to activate this membership? This will mark it as paid and active."
          confirmLabel="Activate"
          onConfirm={activateMembership}
          onCancel={() => setShowConfirm(false)}
          isLoading={isUpdating}
        />
      )}
    </>
  );
}
