'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from './ConfirmModal';

export type UpcomingEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  image_url: string | null;
  created_at: string;
};

export type UpcomingEventsTableProps = {
  events: UpcomingEvent[];
  onEdit: (event: UpcomingEvent) => void;
  onAdd: () => void;
};

export default function UpcomingEventsTable({ events, onEdit, onAdd }: UpcomingEventsTableProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  const handleDelete = (eventId: string) => {
    setSelectedEvent(eventId);
    setShowDeleteConfirm(true);
  };

  const deleteEvent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/upcoming-events?id=${selectedEvent}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      router.refresh();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const canAddMore = events.length < 3;

  if (events.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No upcoming events</h3>
        <p className="text-white/60 mb-6">Create your first event to get started. Maximum 3 events allowed.</p>
        <Button onClick={onAdd} className="gradient-gold text-black font-semibold">
          Add Event
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/60 text-sm">
          {events.length} of 3 events {!canAddMore && '(Maximum reached)'}
        </p>
        {canAddMore && (
          <Button onClick={onAdd} className="gradient-gold text-black font-semibold" size="sm">
            Add Event
          </Button>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => {
          const { month, day } = getDisplayDate(event.event_date);
          return (
            <div
              key={event.id}
              className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 hover:border-[#D4AF37]/30 transition-all"
            >
              <div className="flex items-center gap-6">
                {/* Date Badge */}
                <div className="w-24 h-24 rounded-xl gradient-gold flex items-center justify-center flex-col shrink-0">
                  <span className="text-black font-bold text-2xl">{day}</span>
                  <span className="text-black text-sm font-semibold">{month}</span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-white/60 mb-2">{event.description}</p>
                  )}
                  <p className="text-white/40 text-sm">
                    {formatDate(event.event_date)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => onEdit(event)}
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-red-400 hover:text-red-300 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={deleteEvent}
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone."
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </>
  );
}
