import { createSupabaseServerClient } from '@/lib/supabase/server';
import EventBookingsTable from '@/components/admin/EventBookingsTable';
import EventBookingsFilters from '@/components/admin/EventBookingsFilters';
import Pagination from '@/components/admin/Pagination';

interface SearchParams {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
}

async function getEventBookings(searchParams: SearchParams) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page || '1');
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('event_bookings')
    .select(`
      *,
      event_spaces (
        name,
        capacity,
        price
      )
    `, { count: 'exact' })
    .order('event_date', { ascending: false })
    .range(from, to);

  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams.paymentStatus && searchParams.paymentStatus !== 'all') {
    query = query.eq('payment_status', searchParams.paymentStatus);
  }

  if (searchParams.startDate) {
    query = query.gte('event_date', searchParams.startDate);
  }

  if (searchParams.endDate) {
    const endDateTime = new Date(searchParams.endDate);
    endDateTime.setDate(endDateTime.getDate() + 1);
    query = query.lt('event_date', endDateTime.toISOString().split('T')[0]);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching event bookings:', JSON.stringify(error, null, 2));
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return { bookings: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0;

  return {
    bookings: data || [],
    totalCount: count || 0,
    currentPage: page,
    totalPages,
  };
}

export default async function EventBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { bookings, totalCount, currentPage, totalPages } = await getEventBookings(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Bookings Management</h1>
          <p className="text-white/60">Manage event space bookings and approvals</p>
        </div>
        <div className="text-white/60 text-sm">
          Total: {totalCount} bookings
        </div>
      </div>

      {/* Filters */}
      <EventBookingsFilters />

      {/* Bookings Table */}
      <EventBookingsTable bookings={bookings} />

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
