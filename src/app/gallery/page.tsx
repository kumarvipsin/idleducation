
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const galleryImages = [
  {
    id: '101',
    src: 'https://picsum.photos/400/400',
    alt: 'Annual Day 2024',
    title: 'Annual Day 2024',
    hint: 'students event'
  },
  {
    id: '102',
    src: 'https://picsum.photos/400/401',
    alt: 'Graduation Ceremony',
    title: 'Graduation Ceremony',
    hint: 'students graduation'
  },
  {
    id: '103',
    src: 'https://picsum.photos/401/400',
    alt: 'Science Fair',
    title: 'Science Fair',
    hint: 'student science'
  },
  {
    id: '104',
    src: 'https://picsum.photos/401/401',
    alt: 'Sports Day',
    title: 'Sports Day',
    hint: 'sports competition'
  },
  {
    id: '105',
    src: 'https://picsum.photos/400/402',
    alt: 'Art Exhibition',
    title: 'Art Exhibition',
    hint: 'art exhibition'
  },
  {
    id: '106',
    src: 'https://picsum.photos/402/400',
    alt: 'Music Fest',
    title: 'Music Fest',
    hint: 'music concert'
  },
   {
    id: '107',
    src: 'https://picsum.photos/401/402',
    alt: 'Guest Lecture Series',
    title: 'Guest Lecture Series',
    hint: 'students classroom'
  },
  {
    id: '108',
    src: 'https://picsum.photos/402/401',
    alt: 'Inter-School Athletics',
    title: 'Inter-School Athletics',
    hint: 'running race'
  }
];

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null);

  const filteredImages = galleryImages.filter(image =>
    image.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
        <div className="container mx-auto py-12 px-4 md:px-6">
            
            <div className="relative mb-8 max-w-[10rem]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-full h-10"
                />
            </div>
            
            {filteredImages.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
