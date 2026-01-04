
'use client';

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const offerSlides = [
    {
        src: "https://picsum.photos/seed/offer1/1200/400",
        alt: "Special offer on textbooks",
        hint: "textbooks sale",
    },
    {
        src: "https://picsum.photos/seed/offer2/1200/400",
        alt: "Discount on science kits",
        hint: "science kit discount",
    },
    {
        src: "https://picsum.photos/seed/offer3/1200/400",
        alt: "Free shipping on all orders",
        hint: "free shipping",
    },
];

export function StoreOfferSlider() {
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
                    {offerSlides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full aspect-[16/4] rounded-lg overflow-hidden">
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    data-ai-hint={slide.hint}
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
