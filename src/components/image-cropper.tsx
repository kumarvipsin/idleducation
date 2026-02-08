'use client';

import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onImageCropped: (file: File) => void;
  aspectRatio?: number;
}

export function ImageCropper({ isOpen, onClose, imageSrc, onImageCropped, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspectRatio, width, height), width, height));
  }

  async function getCroppedImg() {
    const image = imgRef.current;
    if (!image || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );
    }

    return new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        onImageCropped(file);
        resolve();
      }, 'image/jpeg');
    });
  }

  const handleSave = async () => {
    await getCroppedImg();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adjust Image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center bg-muted/20 p-4 rounded-lg overflow-hidden max-h-[60vh]">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
            >
              <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Crop" className="max-w-full h-auto" />
            </ReactCrop>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Crop & Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
