'use client';

import { useState } from 'react';
import { MoreVertical, Check, Clock, Package, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal';

type ActionDropdownProps = {
  orderId: string;
  currentStatus: string;
};

export default function ActionDropdown({ orderId, currentStatus }: ActionDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Mark as Pending', icon: Clock, color: 'text-yellow-400' },
    { value: 'processing', label: 'Mark as Processing', icon: Package, color: 'text-blue-400' },
    { value: 'delivered', label: 'Mark as Delivered', icon: Check, color: 'text-green-400' },
    { value: 'cancelled', label: 'Cancel Order', icon: XCircle, color: 'text-red-400' },
  ];

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setShowConfirm(true);
    setIsOpen(false);
  };

  const updateOrderStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      router.refresh();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition"
        >
          <MoreVertical className="w-5 h-5 text-white/60" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
              {statusOptions
                .filter((option) => option.value !== currentStatus)
                .map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusClick(option.value)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition text-left"
                    >
                      <Icon className={`w-4 h-4 ${option.color}`} />
                      <span className="text-white text-sm">{option.label}</span>
                    </button>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Update Order Status"
          message={`Are you sure you want to change this order's status to ${selectedStatus}?`}
          confirmLabel="Update Status"
          onConfirm={updateOrderStatus}
          onCancel={() => setShowConfirm(false)}
          isLoading={isUpdating}
        />
      )}
    </>
  );
}
