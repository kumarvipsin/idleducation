
'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const videoTestimonials = [
  {
    title: "Success Story: Aditya Srivastava, Rank 1",
    embedUrl: "https://www.youtube.com/embed/natYsNb2QBM",
  },
  {
    title: "Journey to Excellence: Animesh Pradhan, Rank 2",
    embedUrl: "https://www.youtube.com/embed/ss3o_iY3IVk",
  },
  {
    title: "Achieving Dreams: Donuru Ananya Reddy, Rank 3",
    embedUrl: "https://www.youtube.com/embed/Q4g_4y5_ayY",
  },
  {
    title: "Student Spotlight: Ruhani, Rank 5",
    embedUrl: "https://www.youtube.com/embed/xJkOSFf0-b8",
  },
  {
    title: "Overcoming Challenges: Srishti Dabas, Rank 6",
    embedUrl: "https://www.youtube.com/embed/6IDuTnHG2dM",
  },
];

export function ToppersTestimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Topper's Testimonials</h2>
          <p className="text-accent mt-2 max-w-2xl mx-auto">
            They dreamed, they dared, they conquered — now it’s your turn! Hear how our toppers made it happen!
          </p>
        </div>
        <div className="relative w-full max-w-6xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {videoTestimonials.map((video, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={video.embedUrl}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                <CarouselPrevious className="static translate-y-0 text-primary hover:bg-primary hover:text-primary-foreground" />
                <CarouselNext className="static translate-y-0 text-primary hover:bg-primary hover:text-primary-foreground" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
