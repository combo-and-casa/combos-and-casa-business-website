'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'danger';
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl ${variant === 'danger' ? 'bg-red-500/10' : 'bg-[#D4AF37]/10'}`}>
            <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-400' : 'text-[#D4AF37]'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-white/60">{message}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-white/10 text-white hover:bg-white/5"
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 ${
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'gradient-gold text-black'
            } font-semibold`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
