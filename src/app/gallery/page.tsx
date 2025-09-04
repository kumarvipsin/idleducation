'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const galleryImages = [
  {
    id: 'evt-001',
    src: '/gallery/1.jpg',
    alt: 'Annual Day 2024',
    title: 'Annual Day 2024',
    hint: 'students event'
  },
  {
    id: 'evt-002',
    src: '/gallery/2.jpg',
    alt: 'Graduation Ceremony',
    title: 'Graduation Ceremony',
    hint: 'students graduation'
  },
  {
    id: 'sci-001',
    src: '/gallery/3.jpg',
    alt: 'Science Fair',
    title: 'Science Fair',
    hint: 'student science'
  },
  {
    id: 'spt-001',
    src: '/gallery/4.jpg',
    alt: 'Sports Day',
    title: 'Sports Day',
    hint: 'sports competition'
  },
  {
    id: 'art-001',
    src: '/gallery/5.jpg',
    alt: 'Art Exhibition',
    title: 'Art Exhibition',
    hint: 'art exhibition'
  },
  {
    id: 'mus-001',
    src: '/gallery/6.jpg',
    alt: 'Music Fest',
    title: 'Music Fest',
    hint: 'music concert'
  },
   {
    id: 'evt-003',
    src: '/gallery/7.jpg',
    alt: 'Guest Lecture Series',
    title: 'Guest Lecture Series',
    hint: 'students classroom'
  },
  {
    id: 'spt-002',
    src: '/gallery/8.jpg',
    alt: 'Inter-School Athletics',
    title: 'Inter-School Athletics',
    hint: 'running race'
  }
];

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null);

  const filteredImages = galleryImages.filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Gallery</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
                A glimpse into the vibrant life at our institution. Explore photos from our events, achievements, and daily activities.
                </p>
            </section>
            
            <div className="relative mb-8 max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by title or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full rounded-full h-12 text-lg"
                />
            </div>
            
            {filteredImages.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((image, index) => (
                        <DialogTrigger asChild key={image.id}>
                            <Card 
                                className="overflow-hidden group cursor-pointer animate-fade-in-up" 
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="aspect-square overflow-hidden">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        data-ai-hint={image.hint}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <CardContent className="p-3">
                                    <h3 className="font-semibold text-sm truncate">{image.title}</h3>
                                    <p className="text-xs text-muted-foreground font-mono">ID: {image.id}</p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Images Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your search for "{searchTerm}" did not return any results.
                    </p>
                </div>
            )}
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
