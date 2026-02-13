import { supabase } from "@/lib/supabase/client";

export interface Booking {
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
  user_id?: string;
  customer_email?: string;
  customer_phone?: string;
  space_name?: string;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data: bookingsData, error: bookingsError } = await supabase
    .from('event_bookings')
    .select(`
      id,
      event_date,
      start_time,
      end_time,
      guests,
      purpose,
      special_requests,
      status,
      customer_name,
      customer_email,
      customer_phone,
      user_id,
      event_spaces (
        name,
        price
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (bookingsError || !bookingsData) {
    console.error('Error fetching bookings:', bookingsError);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return bookingsData.map((booking: any) => ({
    id: booking.id,
    event_type: booking.purpose || 'Event',
    status: booking.status,
    event_date: booking.event_date,
    start_time: booking.start_time,
    end_time: booking.end_time,
    guest_count: booking.guests || 0,
    contact_name: booking.customer_name,
    estimated_cost: booking.event_spaces?.price || 0,
    special_requests: booking.special_requests || undefined,
    user_id: booking.user_id,
    customer_email: booking.customer_email,
    customer_phone: booking.customer_phone,
    space_name: booking.event_spaces?.name
  }));
}

export async function getAllBookings(): Promise<Booking[]> {
  const { data: bookingsData, error: bookingsError } = await supabase
    .from('event_bookings')
    .select(`
      id,
      event_date,
      start_time,
      end_time,
      guests,
      purpose,
      special_requests,
      status,
      customer_name,
      customer_email,
      customer_phone,
      user_id,
      event_spaces (
        name,
        price
      )
    `)
    .order('created_at', { ascending: false });

  if (bookingsError || !bookingsData) {
    console.error('Error fetching all bookings:', bookingsError);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return bookingsData.map((booking: any) => ({
    id: booking.id,
    event_type: booking.purpose || 'Event',
    status: booking.status,
    event_date: booking.event_date,
    start_time: booking.start_time,
    end_time: booking.end_time,
    guest_count: booking.guests || 0,
    contact_name: booking.customer_name,
    estimated_cost: booking.event_spaces?.price || 0,
    special_requests: booking.special_requests || undefined,
    user_id: booking.user_id,
    customer_email: booking.customer_email,
    customer_phone: booking.customer_phone,
    space_name: booking.event_spaces?.name
  }));
}
