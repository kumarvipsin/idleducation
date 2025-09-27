
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCropped: (croppedImage: File) => void;
  imageSrc: string | null;
  aspectRatio?: number; // e.g., 1 for square, 16/9 for landscape
}

export function ImageCropper({
  isOpen,
  onClose,
  onImageCropped,
  imageSrc,
  aspectRatio = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspectRatio, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  const handleCrop = async () => {
    if (!crop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    
    ctx.drawImage(
      image,
      cropX,
      cropY,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(blob => {
        if (blob) {
            const croppedFile = new File([blob], "cropped_image.jpeg", { type: "image/jpeg" });
            onImageCropped(croppedFile);
            onClose();
        }
    }, 'image/jpeg', 0.95);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        {imageSrc && (
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={aspectRatio}
              className="max-h-[70vh]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                onLoad={onImageLoad}
                alt="Crop preview"
              />
            </ReactCrop>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCrop}>Crop and Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
