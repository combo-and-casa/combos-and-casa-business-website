'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, Users, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from './ConfirmModal';
import Link from 'next/link';

export type EventSpace = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price_per_hour: number;
  features: string[];
  image_url?: string;
  is_active: boolean;
  created_at: string;
};

export type EventSpacesTableProps = {
  eventSpaces: EventSpace[];
};

export default function EventSpacesTable({ eventSpaces }: EventSpacesTableProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '₵0';
    return `₵${amount.toLocaleString()}`;
  };

  const handleDelete = (spaceId: string) => {
    setSelectedSpace(spaceId);
    setShowDeleteConfirm(true);
  };

  const deleteEventSpace = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/event-spaces/${selectedSpace}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event space');
      }

      router.refresh();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting event space:', error);
      alert('Failed to delete event space. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (eventSpaces.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Building2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No event spaces found</h3>
        <p className="text-white/60">Create your first event space to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventSpaces.map((space) => (
          <div
            key={space.id}
            className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition"
          >
            {/* Image */}
            {space.image_url && (
              <div className="h-48 w-full overflow-hidden relative">
                <Image
                  src={space.image_url}
                  alt={space.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white">{space.name}</h3>
                <div className="flex items-center gap-1.5">
                  {space.is_active ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`text-sm ${space.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {space.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-4 line-clamp-2">{space.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4 text-white/40" />
                  <span className="text-sm">Capacity: {space.capacity} people</span>
                </div>
                <div className="text-white/80">
                  <span className="text-sm">Price: {formatCurrency(space.price_per_hour)}/hour</span>
                </div>
              </div>

              {/* Features */}
              {space.features && space.features.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {space.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {space.features.length > 3 && (
                      <span className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded-full">
                        +{space.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5">
                <Link href={`/admin/event-spaces/edit/${space.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  onClick={() => handleDelete(space.id)}
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
          title="Delete Event Space"
          message="Are you sure you want to delete this event space? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={deleteEventSpace}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </>
  );
}
