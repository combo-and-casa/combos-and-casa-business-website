'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Dumbbell, 
  Calendar, 
  User,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

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

interface Membership {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  amount_paid: number;
}

interface Booking {
  id: string;
  event_type: string;
  status: string;
  event_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  contact_name: string;
  estimated_cost: number;
  special_requests?: string;
}

interface User {
  full_name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      setUser({
        full_name: "John Doe",
        email: "john@example.com"
      });

      // Mock orders data
      setOrders([
        {
          id: "ord-001",
          items: [
            { menu_item_id: "1", name: "Caesar Salad", quantity: 1, price: 12.99 },
            { menu_item_id: "2", name: "Grilled Salmon", quantity: 1, price: 28.99 }
          ],
          total: 41.98,
          notes: "No onions please",
          status: "pending",
          created_date: new Date().toISOString()
        }
      ]);

      // Mock memberships data
      setMemberships([
        {
          id: "mem-001",
          plan_name: "Gold Membership",
          status: "active",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          amount_paid: 99.99
        }
      ]);

      // Mock bookings data
      setBookings([
        {
          id: "book-001",
          event_type: "wedding",
          status: "confirmed",
          event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          start_time: "6:00 PM",
          end_time: "11:00 PM",
          guest_count: 100,
          contact_name: "John Doe",
          estimated_cost: 5000,
          special_requests: "Vegetarian options needed"
        }
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    active: "bg-green-500/10 text-green-500 border-green-500/30",
    completed: "bg-green-500/10 text-green-500 border-green-500/30",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
    expired: "bg-gray-500/10 text-gray-500 border-gray-500/30"
  };

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    confirmed: CheckCircle,
    active: CheckCircle,
    completed: CheckCircle,
    cancelled: AlertCircle,
    expired: AlertCircle
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20 flex items-center justify-center">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="text-[#D4AF37]">{user?.full_name || "Member"}</span>
              </h1>
              <p className="text-white/50">Manage your orders, memberships, and bookings</p>
            </div>
            <button
              onClick={() => {
                // Simulate logout
                console.log("User logged out");
                window.location.href = "/";
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors w-fit"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Active Memberships</p>
                <p className="text-2xl font-bold">
                  {memberships.filter(m => m.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Event Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-[#1A1A1A] border border-white/10 mb-8">
              <TabsTrigger value="orders" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="memberships" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Dumbbell className="w-4 h-4 mr-2" />
                Memberships
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Calendar className="w-4 h-4 mr-2" />
                Event Bookings
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order, index) => {
                    const StatusIcon = statusIcons[order.status] || Clock;
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
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[order.status]}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.status}
                              </span>
                            </div>
                            <p className="text-white/50 text-sm">
                              {format(new Date(order.created_date), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <p className="text-[#D4AF37] font-bold text-xl">${order.total?.toFixed(2)}</p>
                        </div>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-white/70">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <p className="mt-4 pt-4 border-t border-white/5 text-sm text-white/50">
                            Note: {order.notes}
                          </p>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Memberships Tab */}
            <TabsContent value="memberships">
              <div className="space-y-4">
                {memberships.length === 0 ? (
                  <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No active memberships</p>
                  </div>
                ) : (
                  memberships.map((membership, index) => {
                    const StatusIcon = statusIcons[membership.status] || Clock;
                    return (
                      <motion.div
                        key={membership.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{membership.plan_name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[membership.status]}`}>
                                <StatusIcon className="w-3 h-3" />
                                {membership.status}
                              </span>
                            </div>
                            <p className="text-white/50 text-sm">
                              {format(new Date(membership.start_date), "MMM d, yyyy")} - {format(new Date(membership.end_date), "MMM d, yyyy")}
                            </p>
                          </div>
                          <p className="text-[#D4AF37] font-bold text-xl">${membership.amount_paid}</p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-20 bg-[#1A1A1A] rounded-2xl border border-white/5">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No event bookings</p>
                  </div>
                ) : (
                  bookings.map((booking, index) => {
                    const StatusIcon = statusIcons[booking.status] || Clock;
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold capitalize">
                                {booking.event_type.replace(/_/g, " ")}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[booking.status]}`}>
                                <StatusIcon className="w-3 h-3" />
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-white/50 text-sm mb-1">
                              {format(new Date(booking.event_date), "MMMM d, yyyy")} • {booking.start_time} - {booking.end_time}
                            </p>
                            <p className="text-white/70">
                              {booking.guest_count} guests • {booking.contact_name}
                            </p>
                          </div>
                          <p className="text-[#D4AF37] font-bold text-xl">
                            ${booking.estimated_cost?.toLocaleString()}
                          </p>
                        </div>
                        {booking.special_requests && (
                          <p className="mt-4 pt-4 border-t border-white/5 text-sm text-white/50">
                            Special Requests: {booking.special_requests}
                          </p>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}