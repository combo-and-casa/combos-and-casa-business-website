'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type UpcomingEvent = {
  id?: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
};

export type UpcomingEventFormProps = {
  isOpen: boolean;
  onClose: () => void;
  event?: UpcomingEvent;
  eventCount: number;
};

export default function UpcomingEventForm({ isOpen, onClose, event, eventCount }: UpcomingEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpcomingEvent>({
    title: '',
    description: '',
    event_date: '',
    image_url: '',
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        description: '',
        event_date: '',
        image_url: '',
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if we're at max capacity when adding new
      if (!event?.id && eventCount >= 3) {
        alert('Maximum of 3 upcoming events allowed. Please delete an event first.');
        setIsLoading(false);
        return;
      }

      const url = '/api/admin/upcoming-events';
      const method = event?.id ? 'PUT' : 'POST';
      const body = event?.id ? { ...formData, id: event.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save event');
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error instanceof Error ? error.message : 'Failed to save event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {event?.id ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Warning for max events */}
          {!event?.id && eventCount >= 3 && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                You&apos;ve reached the maximum of 3 upcoming events. Please delete an event before adding a new one.
              </p>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
              placeholder="e.g., Wine Tasting Evening"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Brief description of the event"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
              placeholder="https://example.com/event-image.jpg"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-gold text-black font-semibold"
              disabled={isLoading || (!event?.id && eventCount >= 3)}
            >
              {isLoading ? 'Saving...' : event?.id ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
