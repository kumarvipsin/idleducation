
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
        return (
          <Image 
            src={imageUrl} 
            alt={alt} 
            fill 
            className={className} 
            unoptimized 
          />
        );
    }
    return (
      <Image 
        src={imageUrl} 
        alt={alt} 
        width={width} 
        height={height} 
        className={className} 
        unoptimized 
      />
    );
  }
  
  // Render placeholder if image is missing or failed
  if (fill) {
    return (
      <div className={cn('h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400', className)}>
        <Image src="/idllogo.png" alt={alt} width={80} height={80} className="opacity-30 object-contain" />
      </div>
    );
  }
  return (
    <div className={cn('bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400', className)} style={{ width: width || 400, height: height || 250 }}>
      <Image src="/idllogo.png" alt={alt} width={80} height={80} className="opacity-30 object-contain" />
    </div>
  );
}
