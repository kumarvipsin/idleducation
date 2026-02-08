'use client';

import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, Home, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getGalleryImages } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="w-full h-full rounded-lg" />)}
                    </div>
                ) : filteredImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                        {filteredImages.map((image, index) => (
                            <div 
                                key={image.id}
                                onClick={() => setSelectedImage(image)}
                                className={cn(
                                    "group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up cursor-pointer",
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

                <DialogContent className="max-w-[90vw] md:max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none [&>button]:hidden">
                    {selectedImage && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center group/popup">
                            <DialogHeader className="sr-only">
                                <DialogTitle>{selectedImage.title}</DialogTitle>
                                <DialogDescription>
                                    View full size image of {selectedImage.title} from the {selectedImage.category} collection.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="relative max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-2xl">
                                <GcsImage 
                                    filePath={selectedImage.imageUrl} 
                                    alt={selectedImage.alt} 
                                    width={1600} 
                                    height={1200} 
                                    className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" 
                                />
                            </div>
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full h-10 w-10 z-50 backdrop-blur-md transition-all opacity-0 group-hover/popup:opacity-100 scale-90 group-hover/popup:scale-100"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                            
                            <div className="mt-4 w-full max-w-2xl px-6 py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-white opacity-0 group-hover/popup:opacity-100 transition-all transform translate-y-4 group-hover/popup:translate-y-0 shadow-2xl">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight uppercase">{selectedImage.title}</h3>
                                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-1">{selectedImage.category}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" className="h-8 rounded-full text-[10px] font-black uppercase tracking-wider px-4">
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
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