'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Edit, Trash2, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from './ConfirmModal';
import Link from 'next/link';

type FitnessPlanFeature = {
  id: string;
  feature: string;
};

type FitnessPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  fitness_plan_features: FitnessPlanFeature[];
};

type FitnessPlansTableProps = {
  fitnessPlans: FitnessPlan[];
};

export default function FitnessPlansTable({ fitnessPlans }: FitnessPlansTableProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₵${amount.toLocaleString()}`;
  };

  const handleDelete = (planId: string) => {
    setSelectedPlan(planId);
    setShowDeleteConfirm(true);
  };

  const deleteFitnessPlan = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/fitness-plans/${selectedPlan}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete fitness plan');
      }

      router.refresh();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting fitness plan:', error);
      alert('Failed to delete fitness plan. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (fitnessPlans.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Dumbbell className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No fitness plans found</h3>
        <p className="text-white/60">Create your first fitness plan to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fitnessPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition relative"
          >
            {/* Popular Badge */}
            {plan.is_popular && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-[#D4AF37] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-black fill-black" />
                  <span className="text-xs font-semibold text-black">Popular</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white pr-20">{plan.name}</h3>
                <div className="flex items-center gap-1.5">
                  {plan.is_active ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>

              <p className="text-white/60 text-sm mb-4 line-clamp-2">{plan.description}</p>

              {/* Price & Duration */}
              <div className="mb-4 p-4 bg-white/5 rounded-xl">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {formatCurrency(plan.price)}
                  </p>
                  <p className="text-white/60 text-sm">
                    {plan.duration_months} {plan.duration_months === 1 ? 'month' : 'months'}
                  </p>
                </div>
              </div>

              {/* Features */}
              {plan.fitness_plan_features && plan.fitness_plan_features.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Features:</p>
                  <div className="space-y-1.5">
                    {plan.fitness_plan_features.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                        <span className="text-white/70 text-sm">{feature.feature}</span>
                      </div>
                    ))}
                    {plan.fitness_plan_features.length > 4 && (
                      <p className="text-white/40 text-xs pl-6">
                        +{plan.fitness_plan_features.length - 4} more features
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5">
                <Link href={`/admin/fitness-plans/edit/${plan.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  onClick={() => handleDelete(plan.id)}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Fitness Plan"
          message="Are you sure you want to delete this fitness plan? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={deleteFitnessPlan}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </>
  );
}
