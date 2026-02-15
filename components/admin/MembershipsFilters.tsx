'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

export default function MembershipsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [paymentStatus, setPaymentStatus] = useState(searchParams.get('paymentStatus') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (paymentStatus) params.set('paymentStatus', paymentStatus);
    
    router.push(`/admin/memberships?${params.toString()}`);
  };

  const clearFilters = () => {
    setStatus('');
    setPaymentStatus('');
    router.push('/admin/memberships');
  };

  const hasFilters = status || paymentStatus;

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-white/60" />
        <h2 className="text-lg font-semibold text-white">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Payment Status</label>
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        <Button
          onClick={applyFilters}
          className="gradient-gold text-black font-semibold"
        >
          Apply Filters
        </Button>
        {hasFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-white/10 text-white/70 hover:bg-white/5"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
