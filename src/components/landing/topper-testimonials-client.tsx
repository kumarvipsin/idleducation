'use client';

import * as React from "react";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle, Video } from "lucide-react";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const TestimonialCard = ({ testimonial }: { testimonial: TTopperTestimonial}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPlaying(true);
  };
  
  const handleClose = () => {
    setIsPlaying(false);
  }

  return (
    <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
      <DialogTrigger asChild>
        <button
          onClick={handlePlayClick}
          className="relative aspect-video w-full group focus:outline-none rounded-lg overflow-hidden shadow-lg"
        >
            <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/70 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute bottom-2 left-2 text-left">
              <p className="font-bold text-sm text-white drop-shadow-md">{testimonial.studentName}</p>
              <p className="text-xs text-white/80 drop-shadow-md">{testimonial.studentClass}</p>
            </div>
        </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-0" onInteractOutside={handleClose}>
            <DialogHeader className="p-4">
              <DialogTitle>{testimonial.studentName} - Topper Testimonial</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0`}
                  title={`YouTube video player for ${testimonial.studentName}'s testimonial`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
              ></iframe>
            </div>
        </DialogContent>
    </Dialog>
  );
};

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
 
  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
        <div className="text-center mb-12 px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Topper's{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Talk</span>
              <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 z-0"></span>
            </span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
             What our students & parents say about us
          </p>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: testimonials.length > 3,
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                        stopOnInteraction: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={cn(
                            "h-1.5 w-1.5 rounded-full transition-all duration-300",
                            current === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                        )}
                    />
                ))}
            </div>
        </div>
    </section>
  );
}
