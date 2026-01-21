'use client';

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

export function BuildSkillsSection() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  return (
    <section className="w-full bg-white dark:bg-black py-2">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel ref={emblaRef} className="w-full">
            <CarouselContent>
                <CarouselItem>
                    <div className="relative w-full aspect-video md:aspect-[16/6] rounded-2xl overflow-hidden">
                        <Image 
                            src="/banner.jpg"
                            alt="IDL Education Banner"
                            data-ai-hint="education banner"
                            fill
                            className="object-cover"
                        />
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="relative w-full aspect-video md:aspect-[16/6] rounded-2xl overflow-hidden">
                        <Image 
                            src="/banner.jpg"
                            alt="IDL Education Banner"
                            data-ai-hint="education banner"
                            fill
                            className="object-cover"
                        />
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
