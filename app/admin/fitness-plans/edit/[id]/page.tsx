import { createSupabaseServerClient } from '@/lib/supabase/server';
import FitnessPlanForm from '@/components/admin/FitnessPlanForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getFitnessPlan(id: string) {
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
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function EditFitnessPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fitnessPlan = await getFitnessPlan(id);

  if (!fitnessPlan) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/fitness-plans"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fitness Plans
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Fitness Plan</h1>
        <p className="text-white/60">Update {fitnessPlan.name} details</p>
      </div>

      {/* Form */}
      <FitnessPlanForm fitnessPlan={fitnessPlan} />
    </div>
  );
}
