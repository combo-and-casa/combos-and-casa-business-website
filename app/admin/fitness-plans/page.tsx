import { createSupabaseServerClient } from '@/lib/supabase/server';
import FitnessPlansTable from '@/components/admin/FitnessPlansTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getFitnessPlans() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('fitness_plans')
    .select(`
      *,
      fitness_plan_features (
        id,
        feature
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching fitness plans:', error);
    return [];
  }

  return data || [];
}

export default async function FitnessPlansPage() {
  const fitnessPlans = await getFitnessPlans();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Fitness Plans Management</h1>
          <p className="text-white/60">Create, edit, and manage gym membership plans</p>
        </div>
        <Link href="/admin/fitness-plans/create">
          <Button className="gradient-gold text-black font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Fitness Plan
          </Button>
        </Link>
      </div>

      {/* Fitness Plans Table */}
      <FitnessPlansTable fitnessPlans={fitnessPlans} />
    </div>
  );
}
