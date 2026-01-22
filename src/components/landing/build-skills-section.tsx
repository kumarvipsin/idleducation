'use client';

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

const localSlides = [
  {
    id: "local-1",
    imageUrl: "/banner.jpg",
    alt: "IDL Education Banner",
  },
  {
    id: "local-2",
    imageUrl: "/bannerr.jpg",
    alt: "IDL Education Banner Alternate",
  },
];

export function BuildSkillsSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  return (
    <section className="relative w-full">
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {localSlides.map((slide, index) => (
                <div key={slide.id} className="relative flex-shrink-0 flex-grow-0 basis-full min-w-0 aspect-[16/6] md:aspect-[16/5]">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
        </div>
    </section>
  );
}
