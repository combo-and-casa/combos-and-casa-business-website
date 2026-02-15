import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ShoppingBag, UtensilsCrossed, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split('T')[0];

  // Get today's orders count
  const { count: todayOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);

  // Get active memberships count
  const { count: activeMemberships } = await supabase
    .from('fitness_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get upcoming event bookings (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const { count: upcomingEvents } = await supabase
    .from('event_bookings')
    .select('*', { count: 'exact', head: true })
    .gte('event_date', today)
    .lte('event_date', thirtyDaysFromNow.toISOString().split('T')[0]);

  // Get pending reservations count
  const { count: pendingReservations } = await supabase
    .from('restaurant_reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, customer_name, total_amount, status, created_at, order_type')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent reservations
  const { data: recentReservations } = await supabase
    .from('restaurant_reservations')
    .select('id, name, reservation_date, reservation_time, guests, status')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    todayOrders: todayOrders || 0,
    activeMemberships: activeMemberships || 0,
    upcomingEvents: upcomingEvents || 0,
    pendingReservations: pendingReservations || 0,
    recentOrders: recentOrders || [],
    recentReservations: recentReservations || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Today\'s Orders',
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/orders'
    },
    {
      title: 'Active Memberships',
      value: stats.activeMemberships,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/admin/memberships'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/admin/event-bookings'
    },
    {
      title: 'Pending Reservations',
      value: stats.pendingReservations,
      icon: UtensilsCrossed,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/reservations'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/60">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-[#D4AF37] text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-white/40 text-sm">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-white">{order.customer_name}</p>
                    <p className="text-sm text-white/60">
                      {order.order_type} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#D4AF37]">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Reservations</h2>
            <Link
              href="/admin/reservations"
              className="text-[#D4AF37] text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentReservations.length === 0 ? (
              <p className="text-white/40 text-sm">No reservations yet</p>
            ) : (
              stats.recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-white">{reservation.name}</p>
                    <p className="text-sm text-white/60">
                      {new Date(reservation.reservation_date).toLocaleDateString()} at {reservation.reservation_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70">{reservation.guests} guests</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reservation.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                      reservation.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
