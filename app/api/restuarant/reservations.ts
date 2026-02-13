import { supabase } from "@/lib/supabase/client";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  status: string;
  special_requests?: string;
  created_at: string;
}

export async function getAllReservations(): Promise<Reservation[]> {
  const { data: reservationsData, error: reservationsError } = await supabase
    .from('restaurant_reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (reservationsError || !reservationsData) {
    console.error('Error fetching reservations:', reservationsError);
    return [];
  }

  return reservationsData as Reservation[];
}

export async function getUserReservations(userEmail: string): Promise<Reservation[]> {
  const { data: reservationsData, error: reservationsError } = await supabase
    .from('restaurant_reservations')
    .select('*')
    .eq('email', userEmail)
    .order('created_at', { ascending: false });

  if (reservationsError || !reservationsData) {
    console.error('Error fetching user reservations:', reservationsError);
    return [];
  }

  return reservationsData as Reservation[];
}
