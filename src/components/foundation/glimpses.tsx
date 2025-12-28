'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageIcon, Plus } from "lucide-react";

const galleryImages = [
    { src: 'https://picsum.photos/seed/gallery1/600/600', alt: 'Community gathering', hint: 'community gathering', title: 'Community Outreach', category: 'IDL Foundation' },
    { src: 'https://picsum.photos/seed/gallery2/600/600', alt: 'Children learning', hint: 'children learning', title: 'Educational Initiatives', category: 'IDL Foundation' },
    { src: 'https://picsum.photos/seed/gallery3/600/600', alt: 'Event presentation', hint: 'event presentation', title: 'Awareness Campaigns', category: 'IDL Foundation' },
    { src: 'https://picsum.photos/seed/gallery4/600/600', alt: 'Group discussion', hint: 'group discussion', title: 'Skill Development', category: 'IDL Foundation' },
];

export function Glimpses() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

    return (
        <Dialog>
            <section className="w-full py-8 bg-white dark:bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Glimpses of Our Work</h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            A visual journey through our impactful initiatives and community engagements.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map((image, index) => (
                            <DialogTrigger asChild key={index}>
                                <div
                                    className="relative aspect-square rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        data-ai-hint={image.hint}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                        <h3 className="text-white font-bold text-lg">{image.title}</h3>
                                    </div>
                                    <div className="absolute top-2 right-2 p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Plus className="w-4 h-4 text-foreground" />
                                    </div>
                                </div>
                            </DialogTrigger>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/gallery?category=IDL Foundation">
                                VIEW ALL
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
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
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}
