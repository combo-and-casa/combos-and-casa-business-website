'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { 
  ShoppingBag, 
  Dumbbell, 
  Calendar, 
  User,
  Package,
  CreditCard,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import OrdersTable from "@/components/dashboard/OrdersTable";
import MembershipsTable from "@/components/dashboard/MembershipsTable";
import BookingsTable from "@/components/dashboard/BookingsTable";
import ReservationsTable from "@/components/dashboard/ReservationsTable";
import { getUserOrders, Order } from "@/app/api/restuarant/orders";
import { getUserMemberships, Membership } from "@/app/api/fitness/memberships";
import { getUserBookings, Booking } from "@/app/api/event-spaces/bookings";
import { getUserReservations, Reservation } from "@/app/api/restuarant/reservations";

interface User {
  full_name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and load data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Check authentication first
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          router.push('/auth/signin');
          return;
        }

        // Set user data from auth metadata
        setUser({
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || ''
        });

        // Fetch data using API functions
        const [ordersData, membershipsData, bookingsData, reservationsData] = await Promise.all([
          getUserOrders(authUser.id),
          getUserMemberships(authUser.id),
          getUserBookings(authUser.id),
          getUserReservations(authUser.email || '')
        ]);

        setOrders(ordersData);
        setMemberships(membershipsData);
        setBookings(bookingsData);
        setReservations(reservationsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-[#0A0A0A] pt-20 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, <span className="text-[#D4AF37]">{user?.full_name.split(' ')[0] || "Member"}</span>!
          </h1>
          <p className="text-white/50 text-sm">Manage your orders, memberships, and bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#1A1A1A] rounded-xl px-4 md:px-6 py-3 md:py-4 border border-white/5">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-white/50 text-xs md:text-sm mb-1">Total Orders</p>
            <p className="text-2xl md:text-3xl font-bold">{orders.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#1A1A1A] rounded-xl px-4 md:px-6 py-3 md:py-4 border border-white/5">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-white/50 text-xs md:text-sm mb-1">Active Memberships</p>
            <p className="text-2xl md:text-3xl font-bold">
              {memberships.filter(m => m.status === "active").length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#1A1A1A] rounded-xl px-4 md:px-6 py-3 md:py-4 border border-white/5">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-white/50 text-xs md:text-sm mb-1">Event Bookings</p>
            <p className="text-2xl md:text-3xl font-bold">{bookings.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#1A1A1A] rounded-xl px-4 md:px-6 py-3 md:py-4 border border-white/5">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
              </div>
            </div>
            <p className="text-white/50 text-xs md:text-sm mb-1">Total Spent</p>
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
              ${(orders.reduce((sum, o) => sum + o.total, 0) + 
                 memberships.reduce((sum, m) => sum + m.amount_paid, 0)).toFixed(2)}
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Link href="/nankwaase-bar-and-restaurant/menu">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1A1A] rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer text-center">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
              <p className="font-semibold text-xs md:text-sm">Order Food</p>
            </motion.div>
          </Link>

          <Link href="/fresh&fit">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1A1A] rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer text-center">
              <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
              <p className="font-semibold text-xs md:text-sm">Join Gym</p>
            </motion.div>
          </Link>

          <Link href="/event-space">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1A1A] rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer text-center">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
              <p className="font-semibold text-xs md:text-sm">Book Event</p>
            </motion.div>
          </Link>

          <Link href="/contact">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1A1A] rounded-xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 border border-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer text-center">
              <User className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
              <p className="font-semibold text-xs md:text-sm">Contact Us</p>
            </motion.div>
          </Link>
        </div>

        {/* Tabs with Tables */}
        <div className="w-95 md:w-full lg:w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-auto bg-[#1A1A1A] rounded-2xl border border-white/5 p-4 md:p-6">
            <Tabs defaultValue="orders" className="w-full flex flex-col justify-center">
              <div className="flex justify-start md:justify-end mb-4 md:mb-6 overflow-x-auto pb-2">
                <TabsList className="bg-none flex-nowrap w-full md:w-auto justify-start md:justify-end">
                  <TabsTrigger
                    value="orders"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black mr-2 text-xs md:text-sm whitespace-nowrap">
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="memberships"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black mr-2 text-xs md:text-sm whitespace-nowrap">
                    <Dumbbell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Memberships
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black mr-2 text-xs md:text-sm whitespace-nowrap">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Event Bookings
                  </TabsTrigger>
                  <TabsTrigger
                    value="reservations"
                    className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-xs md:text-sm whitespace-nowrap">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Reservations
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="orders">
                <OrdersTable orders={orders} />
              </TabsContent>

              <TabsContent value="memberships">
                <MembershipsTable memberships={memberships} />
              </TabsContent>

              <TabsContent value="bookings">
                <BookingsTable bookings={bookings} />
              </TabsContent>

              <TabsContent value="reservations">
                <ReservationsTable reservations={reservations} />
              </TabsContent>
            </Tabs>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
