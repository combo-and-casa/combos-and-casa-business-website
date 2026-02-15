type StatusBadgeProps = {
  status: 'pending' | 'processing' | 'delivered' | 'cancelled' | 'active' | 'expired' | 'confirmed' | 'approved';
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      label: 'Pending',
    },
    processing: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      label: 'Processing',
    },
    delivered: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      label: 'Delivered',
    },
    cancelled: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      label: 'Cancelled',
    },
    active: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      label: 'Active',
    },
    expired: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      label: 'Expired',
    },
    confirmed: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      label: 'Confirmed',
    },
    approved: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      label: 'Approved',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${config.bg} ${config.text} text-xs font-medium`}>
      {config.label}
    </span>
  );
}
