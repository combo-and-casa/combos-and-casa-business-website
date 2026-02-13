import { supabase } from "@/lib/supabase/client";

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  notes?: string | null;
  status: string;
  created_date: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  order_type?: string;
  user_id?: string;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      additional_note,
      status,
      created_at,
      customer_name,
      customer_email,
      customer_phone,
      order_type,
      user_id,
      order_items (
        menu_item_id,
        quantity,
        price
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ordersError || !ordersData) {
    console.error('Error fetching orders:', ordersError);
    return [];
  }

  return ordersData.map(order => ({
    id: order.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: order.order_items?.map((item: any) => ({
      menu_item_id: item.menu_item_id,
      name: `Item ${item.menu_item_id}`,
      quantity: item.quantity,
      price: item.price
    })) || [],
    total: order.total_amount,
    notes: order.additional_note,
    status: order.status,
    created_date: order.created_at,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    order_type: order.order_type,
    user_id: order.user_id
  }));
}

export async function getAllOrders(): Promise<Order[]> {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      additional_note,
      status,
      created_at,
      customer_name,
      customer_email,
      customer_phone,
      order_type,
      user_id,
      order_items (
        menu_item_id,
        quantity,
        price
      )
    `)
    .order('created_at', { ascending: false });

  if (ordersError || !ordersData) {
    console.error('Error fetching all orders:', ordersError);
    return [];
  }

  return ordersData.map(order => ({
    id: order.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: order.order_items?.map((item: any) => ({
      menu_item_id: item.menu_item_id,
      name: `Item ${item.menu_item_id}`,
      quantity: item.quantity,
      price: item.price
    })) || [],
    total: order.total_amount,
    notes: order.additional_note,
    status: order.status,
    created_date: order.created_at,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    order_type: order.order_type,
    user_id: order.user_id
  }));
}
