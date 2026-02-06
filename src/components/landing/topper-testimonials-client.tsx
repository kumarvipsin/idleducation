
'use client';

import * as React from "react";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const TestimonialCard = ({ testimonial }: { testimonial: TTopperTestimonial}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
      <DialogTrigger asChild>
        <button
          onClick={() => setIsPlaying(true)}
          className="relative aspect-video w-full group focus:outline-none rounded-2xl overflow-hidden shadow-lg border border-muted-foreground/10"
        >
            <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover transition-transform duration-500"
            />
            {/* Removed the full-frame dark overlay to keep the video 100% visual */}
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-14 h-14 text-white transition-transform duration-300 drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left bg-gradient-to-t from-black/60 to-transparent">
              <p className="font-bold text-xs text-white uppercase tracking-tight drop-shadow-md">{testimonial.studentName}</p>
              <p className="text-[9px] text-white/90 font-bold uppercase tracking-tight drop-shadow-md">{testimonial.studentClass}</p>
            </div>
        </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-lg border-none">
            <DialogHeader className="sr-only">
                <DialogTitle>{testimonial.studentName} Testimonial</DialogTitle>
                <DialogDescription>Video testimonial from a top performing student.</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-black">
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
    <section className="w-full py-6 md:py-10 bg-white dark:bg-background">
        <div className="text-center mb-8 px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800 dark:text-white">
            Topper's{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Talk</span>
              <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                    <path d="M0,15 Q50,5 100,15" />
                </svg>
              </div>
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto font-medium">
             What our high achievers & parents say about us
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
                <CarouselContent className="-ml-4">
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="pl-4 basis-[80%] md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex justify-center gap-1.5 mt-6">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={cn(
                            "h-1 w-1 rounded-full transition-all duration-300",
                            current === i ? "w-4 bg-primary" : "bg-muted-foreground/30"
                        )}
                    />
                ))}
            </div>
        </div>
    </section>
  );
}
