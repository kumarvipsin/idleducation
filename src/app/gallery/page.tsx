
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, Plus } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const galleryCategories = [
  'All',
  'Annual Function',
  'Result Day',
  'Sports Day',
  'Science Fair',
  'Events'
];

const galleryImages = [
  {
    id: '101',
    src: 'https://picsum.photos/seed/g1/800/600',
    alt: 'Annual Day 2024',
    title: 'Annual Day 2024',
    hint: 'students event',
    category: 'Annual Function',
    className: 'col-span-2 row-span-2'
  },
  {
    id: '102',
    src: 'https://picsum.photos/seed/g2/400/600',
    alt: 'Graduation Ceremony',
    title: 'Graduation Ceremony',
    hint: 'students graduation',
    category: 'Result Day',
  },
  {
    id: '103',
    src: 'https://picsum.photos/seed/g3/400/400',
    alt: 'Science Fair',
    title: 'Science Fair',
    hint: 'student science',
    category: 'Science Fair'
  },
  {
    id: '104',
    src: 'https://picsum.photos/seed/g4/800/400',
    alt: 'Sports Day',
    title: 'Sports Day',
    hint: 'sports competition',
    category: 'Sports Day',
    className: 'col-span-2'
  },
  {
    id: '105',
    src: 'https://picsum.photos/seed/g5/400/400',
    alt: 'Art Exhibition',
    title: 'Art Exhibition',
    hint: 'art exhibition',
    category: 'Events'
  },
  {
    id: '106',
    src: 'https://picsum.photos/seed/g6/400/600',
    alt: 'Music Fest',
    title: 'Music Fest',
    hint: 'music concert',
    category: 'Events',
  },
   {
    id: '107',
    src: 'https://picsum.photos/seed/g7/800/600',
    alt: 'Guest Lecture Series',
    title: 'Guest Lecture Series',
    hint: 'students classroom',
    category: 'Events',
    className: 'col-span-2 row-span-2'
  },
  {
    id: '108',
    src: 'https://picsum.photos/seed/g8/400/400',
    alt: 'Inter-School Athletics',
    title: 'Inter-School Athletics',
    hint: 'running race',
    category: 'Sports Day',
  }
];

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredImages = galleryImages.filter(image =>
    (selectedCategory === 'All' || image.category === selectedCategory) &&
    (image.id.toLowerCase().includes(searchTerm.toLowerCase()) || image.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Dialog>
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="mb-8 space-y-4">
                 <div className="relative mx-auto max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by ID or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full rounded-full h-10"
                    />
                </div>
                 <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[10%]">
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
                {filteredImages.length > 0 ? (
                     <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                        {filteredImages.map((image, index) => (
                            <DialogTrigger asChild key={image.id}>
                                <div 
                                    className={cn(
                                        "group relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300",
                                        image.className
                                    )}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        data-ai-hint={image.hint}
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

        {selectedImage && (
             <DialogContent className="sm:max-w-3xl p-2">
                <DialogHeader>
                    <DialogTitle className="sr-only">{selectedImage.title}</DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video">
                    <Image
                        src={selectedImage.src}
                        alt={selectedImage.alt}
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="p-4 bg-muted/50 rounded-b-lg">
                    <h3 className="font-bold text-lg">{selectedImage.title}</h3>
                    <p className="text-sm text-muted-foreground font-mono">ID: {selectedImage.id}</p>
                </div>
            </DialogContent>
        )}
    </Dialog>
  );
}
