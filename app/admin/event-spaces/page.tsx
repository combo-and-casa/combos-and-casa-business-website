import { createSupabaseServerClient } from '@/lib/supabase/server';
import EventSpacesTable from '@/components/admin/EventSpacesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getEventSpaces() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('event_spaces')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching event spaces:', error);
    return [];
  }

  return data || [];
}

export default async function EventSpacesPage() {
  const eventSpaces = await getEventSpaces();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Spaces Management</h1>
          <p className="text-white/60">Create, edit, and manage event spaces</p>
        </div>
        <Link href="/admin/event-spaces/create">
          <Button className="gradient-gold text-black font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Event Space
          </Button>
        </Link>
      </div>

      {/* Event Spaces Table */}
      <EventSpacesTable eventSpaces={eventSpaces} />
    </div>
  );
}
