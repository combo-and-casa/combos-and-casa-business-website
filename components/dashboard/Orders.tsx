'use client';

import { motion } from "framer-motion";
import { format } from "date-fns";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  notes?: string;
  status: string;
  created_date: string;
}

interface OrdersTabProps {
  orders: Order[];
  isLoading: boolean;
}

const statusConfig: Record<string, StatusConfig> = {
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  confirmed: { icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  preparing: { icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ready: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  completed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" }
};

export default function OrdersTab({ orders, isLoading }: OrdersTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#1A1A1A] rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/50">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const status = statusConfig[order.status] || statusConfig.pending;
        const StatusIcon = status.icon;

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
                <p className="text-white/50 text-sm">
                  {format(new Date(order.created_date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <span className="text-xl font-bold text-[#D4AF37]">
                ${order.total?.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/70">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-white/50">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {order.notes && (
              <p className="mt-4 text-sm text-white/40 italic">
                Note: {order.notes}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}