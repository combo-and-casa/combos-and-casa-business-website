import { supabase } from "@/lib/supabase/client";

export interface Membership {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  amount_paid: number;
  user_id?: string;
  payment_reference?: string;
}

export async function getUserMemberships(userId: string): Promise<Membership[]> {
  const { data: membershipsData, error: membershipsError } = await supabase
    .from('fitness_memberships')
    .select(`
      id,
      start_date,
      end_date,
      status,
      payment_reference,
      user_id,
      fitness_plans (
        name,
        price
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (membershipsError || !membershipsData) {
    console.error('Error fetching memberships:', membershipsError);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return membershipsData.map((membership: any) => ({
    id: membership.id,
    plan_name: membership.fitness_plans?.name || 'Unknown Plan',
    status: membership.status,
    start_date: membership.start_date,
    end_date: membership.end_date,
    amount_paid: membership.fitness_plans?.price || 0,
    user_id: membership.user_id,
    payment_reference: membership.payment_reference
  }));
}

export async function getAllMemberships(): Promise<Membership[]> {
  const { data: membershipsData, error: membershipsError } = await supabase
    .from('fitness_memberships')
    .select(`
      id,
      start_date,
      end_date,
      status,
      payment_reference,
      user_id,
      fitness_plans (
        name,
        price
      )
    `)
    .order('created_at', { ascending: false });

  if (membershipsError || !membershipsData) {
    console.error('Error fetching all memberships:', membershipsError);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return membershipsData.map((membership: any) => ({
    id: membership.id,
    plan_name: membership.fitness_plans?.name || 'Unknown Plan',
    status: membership.status,
    start_date: membership.start_date,
    end_date: membership.end_date,
    amount_paid: membership.fitness_plans?.price || 0,
    user_id: membership.user_id,
    payment_reference: membership.payment_reference
  }));
}
