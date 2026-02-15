import { createSupabaseServerClient } from '@/lib/supabase/server';
import EventSpaceForm from '@/components/admin/EventSpaceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getEventSpace(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('event_spaces')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function EditEventSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventSpace = await getEventSpace(id);

  if (!eventSpace) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/event-spaces"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Spaces
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Event Space</h1>
        <p className="text-white/60">Update {eventSpace.name} details</p>
      </div>

      {/* Form */}
      <EventSpaceForm eventSpace={eventSpace} />
    </div>
  );
}
