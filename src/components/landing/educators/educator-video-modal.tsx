'use client';

import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";

interface EducatorVideoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacherName: string;
  videoId: string | null;
}

export function EducatorVideoModal({
  isOpen,
  onOpenChange,
  teacherName,
  videoId,
}: EducatorVideoModalProps) {
  if (!videoId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <VideoModalDialogContent className="w-[min(calc(100vw-2.5rem),calc((84dvh)*16/9),720px)] aspect-video h-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{teacherName} - Faculty Introduction</DialogTitle>
          <DialogDescription>Introduction video for {teacherName}</DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-full overflow-hidden bg-black">
          <iframe
            className="block w-full h-full border-0"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
            title={`Introduction video for ${teacherName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </VideoModalDialogContent>
    </Dialog>
  );
}
