
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, Home, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getGalleryImages } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

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
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-12 space-y-8">
             {/* Premium Search Bar */}
             <div className="relative mx-auto max-w-5xl bg-white border border-gray-300 rounded-sm flex items-center h-16 shadow-none transition-all focus-within:border-primary/50">
                <div className="pl-5 pr-3">
                    <Search className="h-7 w-7 text-black" strokeWidth={2.5} />
                </div>
                <Input
                    type="text"
                    placeholder="Search the largest collection of Indian images"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border-0 shadow-none focus-visible:ring-0 text-lg placeholder:text-gray-400 placeholder:font-light bg-transparent h-full"
                />
                <Separator orientation="vertical" className="h-10 mx-2 hidden sm:block bg-gray-300" />
                <Button variant="ghost" className="hidden sm:flex flex-col h-full rounded-none px-8 items-center justify-center gap-0.5 hover:bg-gray-50 transition-colors">
                    <ImagePlus className="h-6 w-6 text-black" strokeWidth={1.5} />
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">Search by image</span>
                </Button>
            </div>

             {/* Minimal Category Navigation */}
             <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-8 whitespace-nowrap px-4 sm:px-0">
                    {galleryCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 pb-2 border-b-2",
                                selectedCategory === category 
                                ? 'text-primary border-primary' 
                                : 'text-muted-foreground/60 border-transparent hover:text-foreground hover:border-muted-foreground/20'
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
                        <div 
                            key={image.id}
                            className={cn(
                                "group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up",
                                image.className
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
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
                        </div>
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
  );
}

export default function GalleryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GalleryPageContent />
        </Suspense>
    )
}
