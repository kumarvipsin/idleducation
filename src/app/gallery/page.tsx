
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, Plus, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getGalleryImages } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type GalleryImage = {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  category: string;
  className?: string;
};

function GalleryPageContent() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const result = await getGalleryImages();
      if (result.success && result.data) {
        setImages(result.data as GalleryImage[]);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);
  
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const galleryCategories = ['All', ...Array.from(new Set(images.map(img => img.category)))];

  const filteredImages = images.filter(image =>
    (selectedCategory === 'All' || image.category === selectedCategory) &&
    (image.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Dialog>
      <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-8">
            <div className="mb-8 space-y-4">
                 <div className="relative mx-auto max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full rounded-full h-10"
                    />
                </div>
                 <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                        {galleryCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={cn(`py-2 px-4 text-sm font-medium transition-colors border rounded-md`,
                                    selectedCategory === category 
                                    ? 'border-primary text-primary bg-primary/10' 
                                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                                )}
                                >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <main>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="w-full h-full rounded-lg" />)}
                    </div>
                ) : filteredImages.length > 0 ? (
                     <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                        {filteredImages.map((image, index) => (
                            <DialogTrigger asChild key={image.id}>
                                <div 
                                    className={cn(
                                        "group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up",
                                        image.className
                                    )}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <GcsImage
                                        filePath={image.imageUrl}
                                        alt={image.alt}
                                        fill
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 p-4 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                                        <h3 className="text-white font-bold text-lg">{image.title}</h3>
                                        <p className="text-white/80 text-sm">{image.category}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Plus className="w-4 h-4 text-foreground" />
                                    </div>
                                </div>
                            </DialogTrigger>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Images Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your search for "{searchTerm}" in "{selectedCategory}" did not return any results.
                        </p>
                    </div>
                )}
            </main>
        </div>
        </div>

        {selectedImage && (
             <DialogContent className="sm:max-w-3xl p-2">
                <DialogHeader>
                    <DialogTitle className="sr-only">{selectedImage.title}</DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video">
                    <GcsImage
                        filePath={selectedImage.imageUrl}
                        alt={selectedImage.alt}
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="p-4 bg-muted/50 rounded-b-lg">
                    <h3 className="font-bold text-lg">{selectedImage.title}</h3>
                </div>
            </DialogContent>
        )}
    </Dialog>
  );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GalleryPageContent />
        </Suspense>
    )
}
