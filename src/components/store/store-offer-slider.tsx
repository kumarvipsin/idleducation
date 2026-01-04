
'use client';

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const offerSlides = [
    {
        src: "https://www.crossword.in/cdn/shop/files/Website_banners_1600_x_450_px_d9ef9aa3-d81b-41fc-ae41-804d9c86b27b.webp?v=1765520789&width=3000",
        alt: "Special offer on textbooks",
        hint: "textbooks sale",
    },
    {
        src: "https://www.crossword.in/cdn/shop/files/Website_banners_1600_x_450_px_d9ef9aa3-d81b-41fc-ae41-804d9c86b27b.webp?v=1765520789&width=3000",
        alt: "Discount on science kits",
        hint: "science kit discount",
    },
    {
        src: "https://www.crossword.in/cdn/shop/files/Website_banners_1600_x_450_px_d9ef9aa3-d81b-41fc-ae41-804d9c86b27b.webp?v=1765520789&width=3000",
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
