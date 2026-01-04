
'use client';

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface Slide {
    imageUrl: string;
    imageHint: string;
    title: string;
}

export function ImageSlider({ slides }: { slides: Slide[] }) {
    return (
        <div className="mb-12">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                opts={{
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full aspect-[16/4] rounded-lg overflow-hidden">
                                <Image
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    data-ai-hint={slide.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
