import { createSupabaseServerClient } from '@/lib/supabase/server';
import MembershipsTable from '@/components/admin/MembershipsTable';
import MembershipsFilters from '@/components/admin/MembershipsFilters';
import Pagination from '@/components/admin/Pagination';

interface SearchParams {
  status?: string;
  paymentStatus?: string;
  page?: string;
}

async function getMemberships(searchParams: SearchParams) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page || '1');
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('fitness_memberships')
    .select(`
      *,
      fitness_plans (
        name,
        price,
        duration_months
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply filters
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams.paymentStatus && searchParams.paymentStatus !== 'all') {
    query = query.eq('payment_status', searchParams.paymentStatus);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching memberships:', error);
    return { memberships: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0;

  return {
    memberships: data || [],
    totalCount: count || 0,
    currentPage: page,
    totalPages,
  };
}

export default async function MembershipsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { memberships, totalCount, currentPage, totalPages } = await getMemberships(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Memberships Management</h1>
          <p className="text-white/60">Manage gym membership subscriptions</p>
        </div>
        <div className="text-white/60 text-sm">
          Total: {totalCount} memberships
        </div>
      </div>

      {/* Filters */}
      <MembershipsFilters />

      {/* Memberships Table */}
      <MembershipsTable memberships={memberships} />

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
