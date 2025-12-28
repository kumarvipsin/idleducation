
'use client';

import { useEffect, useState } from 'react';
import { getSignedUrlForPdf } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GcsImageProps {
  filePath: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export function GcsImage({ filePath, alt, className, width, height, fill }: GcsImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!filePath) {
        setLoading(false);
        return;
      }
      setLoading(true);

      // Determine if filePath is a full URL or just a path
      const isFullUrl = filePath.startsWith('https://');
      const path = isFullUrl ? filePath : `https://storage.googleapis.com/idlcloud/${filePath}`;
      
      const result = await getSignedUrlForPdf(path);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        console.error("Failed to get signed URL for:", filePath);
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
        return <Image src={imageUrl} alt={alt} fill className={className} unoptimized />;
    }
    return <Image src={imageUrl} alt={alt} width={width} height={height} className={className} unoptimized />;
  }
  
  // Render a placeholder or nothing if there's no image URL
  return null;
}
