'use client';

import { AdmissionFormClient } from '@/components/admission-form-client';

interface AdmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdmissionModal({ isOpen, onOpenChange }: AdmissionModalProps) {
  return (
    <AdmissionFormClient
      variant="modal"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  );
}
