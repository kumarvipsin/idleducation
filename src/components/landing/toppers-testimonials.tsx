'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const videoTestimonials = [
  {
    title: "Anju, Rank 60 - UPSC Topper",
    embedUrl: "https://www.youtube.com/embed/fm-b-L-p7J4",
  },
  {
    title: "Ishika Singh - UPSC Result 2024",
    embedUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
  },
  {
    title: "Teshukant - UPSC CSE 2024 Topper",
    embedUrl: "https://www.youtube.com/embed/ZU9T1-p_iA4",
  },
  {
    title: "Student Success Story 1",
    embedUrl: "https://www.youtube.com/embed/l-gQLqv9f4o",
  },
  {
    title: "Student Success Story 2",
    embedUrl: "https://www.youtube.com/embed/Q4-j5X-4C6M",
  },
];

export function ToppersTestimonials() {
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
