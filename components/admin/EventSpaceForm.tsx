'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

type EventSpaceFormProps = {
  eventSpace?: {
    id: string;
    name: string;
    description: string;
    capacity: number;
    price_per_hour: number;
    features: string[];
    image_url?: string;
    is_active: boolean;
  };
};

export default function EventSpaceForm({ eventSpace }: EventSpaceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: eventSpace?.name || '',
    description: eventSpace?.description || '',
    capacity: eventSpace?.capacity || 0,
    price_per_hour: eventSpace?.price_per_hour || 0,
    features: eventSpace?.features || [],
    image_url: eventSpace?.image_url || '',
    is_active: eventSpace?.is_active ?? true,
  });

  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = eventSpace
        ? `/api/admin/event-spaces/${eventSpace.id}`
        : '/api/admin/event-spaces';
      
      const method = eventSpace ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save event space');
      }

      router.push('/admin/event-spaces');
      router.refresh();
    } catch (error) {
      console.error('Error saving event space:', error);
      alert('Failed to save event space. Please try again.');
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
            Space Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-white/5 border-white/10 text-white"
            placeholder="e.g., Grand Ballroom"
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
            placeholder="Describe the event space..."
          />
        </div>

        {/* Capacity & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="capacity" className="text-white mb-2">
              Capacity (people) *
            </Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              required
              min="1"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <Label htmlFor="price_per_hour" className="text-white mb-2">
              Price per Hour (₵) *
            </Label>
            <Input
              id="price_per_hour"
              type="number"
              value={formData.price_per_hour}
              onChange={(e) => setFormData({ ...formData, price_per_hour: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <Label htmlFor="image_url" className="text-white mb-2">
            Image URL
          </Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Features */}
        <div>
          <Label className="text-white mb-2">Features</Label>
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
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white rounded-full text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-5 h-5 accent-[#D4AF37]"
          />
          <Label htmlFor="is_active" className="text-white cursor-pointer">
            Mark as active and available for booking
          </Label>
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
            {isSubmitting ? 'Saving...' : eventSpace ? 'Update Event Space' : 'Create Event Space'}
          </Button>
        </div>
      </div>
    </form>
  );
}
