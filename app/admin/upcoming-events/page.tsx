'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import UpcomingEventsTable from '@/components/admin/UpcomingEventsTable';
import UpcomingEventForm from '@/components/admin/UpcomingEventForm';
import type { UpcomingEvent } from '@/components/admin/UpcomingEventsTable';

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | undefined>(undefined);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/upcoming-events');

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: UpcomingEvent) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleAdd = () => {
    if (events.length >= 3) {
      alert('Maximum of 3 upcoming events allowed. Please delete an event first.');
      return;
    }
    setSelectedEvent(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEvent(undefined);
    fetchEvents();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Upcoming Events</h1>
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Upcoming Events Management</h1>
            <p className="text-white/60">
              Manage restaurant events (Maximum 3 events displayed on the about page)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-white/60">{events.length} / 3 Events</span>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">About Upcoming Events</h3>
          <ul className="text-white/70 space-y-1 text-sm">
            <li>• Maximum of 3 upcoming events can be displayed at a time</li>
            <li>• Events are shown on the restaurant&apos;s about page</li>
            <li>• Only future events (from today onwards) are displayed to visitors</li>
            <li>• Events are automatically ordered by date</li>
          </ul>
        </div>

        {/* Events Table */}
        <UpcomingEventsTable
          events={events}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
      </div>

      {/* Event Form Modal */}
      <UpcomingEventForm
        isOpen={showForm}
        onClose={handleCloseForm}
        event={selectedEvent}
        eventCount={events.length}
      />
    </>
  );
}
