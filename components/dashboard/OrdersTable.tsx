'use client';

import { format } from "date-fns";
import { Order } from "@/app/api/restuarant/orders";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  showUserInfo?: boolean;
}

export default function OrdersTable({ orders, showUserInfo = false }: OrdersTableProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    completed: "bg-green-500/10 text-green-500 border-green-500/30",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    confirmed: CheckCircle,
    completed: CheckCircle,
    cancelled: AlertCircle,
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
        <p className="text-white/50">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full" style={{ minWidth: '800px' }}>
        <thead className="bg-[#1A1A1A] border-b border-white/5">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Order ID</th>
            {showUserInfo && <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Customer</th>}
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Items</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Total</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Type</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            
            return (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-left">
                  <span className="font-mono text-sm text-[#D4AF37]">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                {showUserInfo && (
                  <td className="px-6 py-4 text-left">
                    <div className="text-sm">
                      <p className="font-medium text-white">{order.customer_name || 'N/A'}</p>
                      <p className="text-white/50 text-xs">{order.customer_email}</p>
                      <p className="text-white/50 text-xs">{order.customer_phone}</p>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 text-left">
                  <div className="text-sm text-white/70">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <span className="font-semibold text-[#D4AF37]">
                    ${order.total.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <span className="text-sm text-white/70 capitalize">
                    {order.order_type || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-left text-sm text-white/50">
                  {format(new Date(order.created_date), "MMM d, yyyy")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
