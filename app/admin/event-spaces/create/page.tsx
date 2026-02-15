import EventSpaceForm from '@/components/admin/EventSpaceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventSpacePage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Create Event Space</h1>
        <p className="text-white/60">Add a new event space to your venue</p>
      </div>

      {/* Form */}
      <EventSpaceForm />
    </div>
  );
}
