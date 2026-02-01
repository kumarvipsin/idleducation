'use client';

import { useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, PlayCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const EventVideo = ({ videoId, title }: { videoId: string, title: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-full aspect-video group cursor-pointer focus:outline-none rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
                <DialogHeader className="p-4">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export function Events() {
    const autoplayPlugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
      );
    const events = [
        { videoId: "MILdOtfez8U", title: "IDL Foundation Event Highlights" },
        { videoId: "r9s-s4-N9A8", title: "Community Skill Training Workshop" },
        { videoId: "dQw4w9WgXcQ", title: "Annual Charity Gala" },
        { videoId: "xvFZjo5PgG0", title: "Tree Plantation Drive" },
        { videoId: "3JZ_D3p_L4A", title: "Women Empowerment Seminar" },
    ];
    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Events & Highlights</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Watch highlights from our recent events and see the impact we're making together.
                    </p>
                </div>
                <Carousel
                    plugins={[autoplayPlugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {events.map((event, index) => (
                        <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <EventVideo videoId={event.videoId} title={event.title} />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-[-1rem] md:-left-4" />
                    <CarouselNext className="right-[-1rem] md:-right-4" />
                </Carousel>
            </div>
        </section>
    );
}
