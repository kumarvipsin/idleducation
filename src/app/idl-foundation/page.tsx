'use client';

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const foundationSlides = [
    {
        src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Happy students celebrating",
        hint: "students celebrating",
        title: "Winds of Change 2019",
        subtitle: "In the winds of change, we find our true direction.",
    },
    {
        src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Students in a classroom",
        hint: "students classroom",
        title: "Empowering Futures",
        subtitle: "Providing opportunities for every student to succeed.",
    },
    {
        src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Graduation ceremony",
        hint: "student graduation",
        title: "Building a Brighter Tomorrow",
        subtitle: "Our commitment to accessible education for all.",
    },
];

export default function IDLFoundationPage() {
    const autoplayPlugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden">
            <Link href="/" className="absolute top-4 right-4 z-20">
                <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40">
                    <Home className="h-6 w-6" />
                    <span className="sr-only">Home</span>
                </Button>
            </Link>

            <Carousel
                plugins={[autoplayPlugin.current]}
                opts={{ loop: true }}
                className="w-full h-screen"
            >
                <CarouselContent>
                    {foundationSlides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full h-screen">
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    data-ai-hint={slide.hint}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                                <div className="absolute bottom-10 left-10 right-10 text-white z-10 p-4 rounded-lg bg-black/30 backdrop-blur-sm text-center">
                                    <h1 className="text-2xl md:text-4xl font-bold">{slide.title}</h1>
                                    <p className="text-sm md:text-lg mt-2 opacity-90">{slide.subtitle}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white border-white/50 hover:bg-black/50" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white border-white/50 hover:bg-black/50" />
            </Carousel>
        </div>
    );
}
