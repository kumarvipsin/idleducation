
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
      
      // If the path is already a full URL (e.g., from a preview or already public), use it directly.
      if (filePath.startsWith('http') || filePath.startsWith('blob:') || filePath.startsWith('data:')) {
        setImageUrl(filePath);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      // It's a path, so we need to get a signed URL
      const result = await getSignedUrlForPdf(filePath);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        console.error("Failed to get signed URL for:", filePath, "because:", result.message);
        setImageUrl(null); // Set to null on failure
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
  
  // Render a placeholder for failed loads or empty paths
  return (
    <div className={cn('flex items-center justify-center bg-muted/30 text-muted-foreground', className)}>
       <Skeleton className={cn('h-full w-full', className)} />
    </div>
  );
}
