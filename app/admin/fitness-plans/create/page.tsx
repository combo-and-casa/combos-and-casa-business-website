import FitnessPlanForm from '@/components/admin/FitnessPlanForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateFitnessPlanPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Create Fitness Plan</h1>
        <p className="text-white/60">Add a new gym membership plan</p>
      </div>

      {/* Form */}
      <FitnessPlanForm />
    </div>
  );
}
