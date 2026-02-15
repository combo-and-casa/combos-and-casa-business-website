import { createSupabaseServerClient } from '@/lib/supabase/server';
import ReservationsTable from '@/components/admin/ReservationsTable';
import ReservationsFilters from '@/components/admin/ReservationsFilters';
import Pagination from '@/components/admin/Pagination';

interface SearchParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
}

async function getReservations(searchParams: SearchParams) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page || '1');
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('restaurant_reservations')
    .select('*', { count: 'exact' })
    .order('reservation_date', { ascending: false })
    .range(from, to);

  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams.startDate) {
    query = query.gte('reservation_date', searchParams.startDate);
  }

  if (searchParams.endDate) {
    const endDateTime = new Date(searchParams.endDate);
    endDateTime.setDate(endDateTime.getDate() + 1);
    query = query.lt('reservation_date', endDateTime.toISOString().split('T')[0]);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching reservations:', error);
    return { reservations: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0;

  return {
    reservations: data || [],
    totalCount: count || 0,
    currentPage: page,
    totalPages,
  };
}

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { reservations, totalCount, currentPage, totalPages } = await getReservations(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reservations Management</h1>
          <p className="text-white/60">Manage restaurant table reservations</p>
        </div>
        <div className="text-white/60 text-sm">
          Total: {totalCount} reservations
        </div>
      </div>

      {/* Filters */}
      <ReservationsFilters />

      {/* Reservations Table */}
      <ReservationsTable reservations={reservations} />

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
