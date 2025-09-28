
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
      
      if (filePath.startsWith('http') || filePath.startsWith('blob:') || filePath.startsWith('data:')) {
        setImageUrl(filePath);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const result = await getSignedUrlForPdf(filePath);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        console.error("Failed to get signed URL for:", filePath, "because:", result.message);
        setImageUrl(null); 
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
  
  return (
    <div className={cn('flex items-center justify-center bg-muted/30 text-muted-foreground', className)}>
       <Skeleton className={cn('h-full w-full', className)} />
    </div>
  );
}
