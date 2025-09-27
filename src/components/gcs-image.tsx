
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
      const result = await getSignedUrlForPdf(filePath);
      if (result.success && result.url) {
        setImageUrl(result.url);
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
        return <Image src={imageUrl} alt={alt} fill className={className} />;
    }
    return <Image src={imageUrl} alt={alt} width={width} height={height} className={className} />;
  }
  
  // Render a placeholder or nothing if there's no image URL
  return null;
}
