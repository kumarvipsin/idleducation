'use client';

import { useEffect, useState } from 'react';
import { getSignedUrlForPdf } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface GcsImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  filePath: string;
  alt: string;
}

export function GcsImage({ filePath, alt, className, width, height, fill, ...props }: GcsImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!filePath) {
        setLoading(false);
        return;
      }
      setLoading(true);
      
      const result = await getSignedUrlForPdf(filePath);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        console.error("Failed to get signed URL for:", filePath, "because:", result.message);
      }
      setLoading(false);
    }
    fetchSignedUrl();
  }, [filePath]);

  if (loading) {
    return <Skeleton className={cn('h-full w-full', className)} />;
  }

  if (imageUrl) {
    if (fill) {
        return <Image src={imageUrl} alt={alt} fill className={className} unoptimized {...props} />;
    }
    return <Image src={imageUrl} alt={alt} width={width} height={height} className={className} unoptimized {...props} />;
  }
  
  // Render a placeholder or nothing if there's no image URL
  return <Skeleton className={cn('h-full w-full bg-destructive/20', className)} />;
}
