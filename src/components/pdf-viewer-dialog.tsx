
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PdfViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pdfSrc: string | null;
  isLoading: boolean;
  title: string;
}

export function PdfViewerDialog({
  isOpen,
  onOpenChange,
  pdfSrc,
  isLoading,
  title,
}: PdfViewerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-2 border-b">
          <DialogTitle className="truncate text-sm font-semibold">{title}</DialogTitle>
        </DialogHeader>
        {isLoading || !pdfSrc ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading PDF...</p>
          </div>
        ) : (
          <iframe src={pdfSrc} className="w-full h-full rounded-b-md" />
        )}
      </DialogContent>
    </Dialog>
  );
}
