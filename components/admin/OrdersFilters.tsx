'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

export default function OrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [orderType, setOrderType] = useState(searchParams.get('orderType') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (orderType) params.set('orderType', orderType);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    router.push(`/admin/orders?${params.toString()}`);
  };

  const clearFilters = () => {
    setStatus('');
    setOrderType('');
    setStartDate('');
    setEndDate('');
    router.push('/admin/orders');
  };

  const hasFilters = status || orderType || startDate || endDate;

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-white/60" />
        <h2 className="text-lg font-semibold text-white">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Type Filter */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Order Type</label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm text-white/60 mb-2">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
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
