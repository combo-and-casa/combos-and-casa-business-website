'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Package, MapPin, Phone, Mail } from 'lucide-react';
import StatusBadge from "./StatusBadge";
import ActionDropdown from './ActionDropdown';

type OrderItem = {
  id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  menu_items: {
    name: string;
  }[] | null;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup';
  delivery_address?: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
};

type OrdersTableProps = {
  orders: Order[];
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return `₵${amount.toLocaleString()}`;
  };

  if (orders.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
        <p className="text-white/60">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-4 py-4 text-left"></th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Order ID</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Customer</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Type</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Status</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Total</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Date</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              
              return (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="text-white/60 hover:text-white transition"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-white/80">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-white/40 text-sm">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-white/70 text-xs font-medium capitalize">
                        {order.order_type === 'delivery' ? (
                          <MapPin className="w-3 h-3" />
                        ) : (
                          <Package className="w-3 h-3" />
                        )}
                        {order.order_type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white font-semibold">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white/60 text-sm">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <ActionDropdown orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>

                  {/* Expanded Row - Order Details */}
                  {isExpanded && (
                    <tr className="bg-white/2">
                      <td colSpan={8} className="px-4 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ml-9">
                          {/* Order Items */}
                          <div className="lg:col-span-2">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Order Items ({order.order_items.length})
                            </h4>
                            <div className="space-y-2">
                              {order.order_items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className="text-white font-medium">
                                      {item.menu_items?.[0]?.name || 'Unknown Item'}
                                    </p>
                                    <p className="text-white/40 text-sm">Quantity: {item.quantity}</p>
                                  </div>
                                  <span className="text-white/70 font-semibold">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Customer Details */}
                          <div>
                            <h4 className="text-white font-semibold mb-3">Customer Details</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-white/40 mt-1" />
                                <div>
                                  <p className="text-white/40 text-xs">Phone</p>
                                  <p className="text-white text-sm">{order.customer_phone}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-white/40 mt-1" />
                                <div>
                                  <p className="text-white/40 text-xs">Email</p>
                                  <p className="text-white text-sm">{order.customer_email}</p>
                                </div>
                              </div>
                              {order.order_type === 'delivery' && order.delivery_address && (
                                <div className="flex items-start gap-3">
                                  <MapPin className="w-4 h-4 text-white/40 mt-1" />
                                  <div>
                                    <p className="text-white/40 text-xs">Delivery Address</p>
                                    <p className="text-white text-sm">{order.delivery_address}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
