'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

type FitnessPlanFormProps = {
  fitnessPlan?: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_months: number;
    is_popular: boolean;
    is_active: boolean;
    fitness_plan_features: { id: string; feature: string }[];
  };
};

export default function FitnessPlanForm({ fitnessPlan }: FitnessPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: fitnessPlan?.name || '',
    description: fitnessPlan?.description || '',
    price: fitnessPlan?.price || 0,
    duration_months: fitnessPlan?.duration_months || 1,
    is_popular: fitnessPlan?.is_popular ?? false,
    is_active: fitnessPlan?.is_active ?? true,
    features: fitnessPlan?.fitness_plan_features.map(f => f.feature) || [],
  });

  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = fitnessPlan
        ? `/api/admin/fitness-plans/${fitnessPlan.id}`
        : '/api/admin/fitness-plans';
      
      const method = fitnessPlan ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save fitness plan');
      }

      router.push('/admin/fitness-plans');
      router.refresh();
    } catch (error) {
      console.error('Error saving fitness plan:', error);
      alert('Failed to save fitness plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8">
      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-white mb-2">
            Plan Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-white/5 border-white/10 text-white"
            placeholder="e.g., Premium Membership"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-white mb-2">
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Describe the fitness plan..."
          />
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price" className="text-white mb-2">
              Price (₵) *
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <Label htmlFor="duration_months" className="text-white mb-2">
              Duration (months) *
            </Label>
            <Input
              id="duration_months"
              type="number"
              value={formData.duration_months}
              onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
              required
              min="1"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <Label className="text-white mb-2">Features *</Label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Add a feature..."
            />
            <Button
              type="button"
              onClick={addFeature}
              className="gradient-gold text-black"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
              >
                <span className="text-white">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {formData.features.length === 0 && (
            <p className="text-white/40 text-sm mt-2">No features added yet</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_popular"
              checked={formData.is_popular}
              onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
              className="w-5 h-5 accent-[#D4AF37]"
            />
            <Label htmlFor="is_popular" className="text-white cursor-pointer">
              Mark as popular (will be highlighted)
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 accent-[#D4AF37]"
            />
            <Label htmlFor="is_active" className="text-white cursor-pointer">
              Mark as active and available for purchase
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-6 border-t border-white/5">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="gradient-gold text-black font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : fitnessPlan ? 'Update Fitness Plan' : 'Create Fitness Plan'}
          </Button>
        </div>
      </div>
    </form>
  );
}
