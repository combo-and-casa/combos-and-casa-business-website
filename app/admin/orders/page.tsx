import { createSupabaseServerClient } from '@/lib/supabase/server';
import OrdersTable from '@/components/admin/OrdersTable';
import OrdersFilters from '@/components/admin/OrdersFilters';
import Pagination from '@/components/admin/Pagination';

interface SearchParams {
  status?: string;
  orderType?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
}

async function getOrders(searchParams: SearchParams) {
  const supabase = await createSupabaseServerClient();
  const page = parseInt(searchParams.page || '1');
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from('orders')
    .select(`
      id,
      customer_name,
      customer_email,
      customer_phone,
      order_type,
      delivery_address,
      pickup_time,
      total_amount,
      status,
      payment_reference,
      created_at,
      order_items (
        id,
        menu_item_id,
        quantity,
        price,
        menu_items (
          name
        )
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply filters
  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams.orderType) {
    query = query.eq('order_type', searchParams.orderType);
  }

  if (searchParams.startDate) {
    query = query.gte('created_at', searchParams.startDate);
  }

  if (searchParams.endDate) {
    const endDateTime = new Date(searchParams.endDate);
    endDateTime.setDate(endDateTime.getDate() + 1);
    query = query.lt('created_at', endDateTime.toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], totalCount: 0, currentPage: page, totalPages: 0 };
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0;

  return {
    orders: data || [],
    totalCount: count || 0,
    currentPage: page,
    totalPages,
  };
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { orders, totalCount, currentPage, totalPages } = await getOrders(params);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-white/60">Manage all restaurant orders</p>
        </div>
        <div className="text-white/60 text-sm">
          Total: {totalCount} orders
        </div>
      </div>

      {/* Filters */}
      <OrdersFilters />

      {/* Orders Table */}
      <OrdersTable orders={orders} />

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
