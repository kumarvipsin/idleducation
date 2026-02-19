
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
          className="relative aspect-[9/16] w-full group focus:outline-none rounded-2xl overflow-hidden bg-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-none border-none"
        >
            <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/maxresdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`;
                }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left space-y-0.5">
              <p className="font-black text-[10px] sm:text-xs text-white uppercase tracking-tight drop-shadow-md line-clamp-1">{testimonial.studentName}</p>
              <p className="text-[8px] sm:text-[9px] text-white/80 font-bold uppercase tracking-widest drop-shadow-md line-clamp-1">{testimonial.studentClass}</p>
            </div>
        </button>
        </DialogTrigger>
        <DialogContent className="max-w-[285px] p-0 overflow-hidden rounded-2xl border-none shadow-none bg-black">
            <DialogHeader className="sr-only">
                <DialogTitle>{testimonial.studentName} Testimonial</DialogTitle>
                <DialogDescription>Video testimonial from a top performing student.</DialogDescription>
            </DialogHeader>
            <div className="aspect-[9/16] w-full bg-black">
              <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0&modestbranding=1`}
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
    <section className="w-full py-12 md:py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
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
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto">
                        What our high achievers & parents say about us
                    </p>
                </div>
                
                <div className="relative">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                            dragFree: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 2000,
                                stopOnInteraction: false,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-4 basis-[47.5%] sm:basis-[45%] md:basis-[30%] lg:basis-[20%]">
                                    <div className="p-1">
                                        <TestimonialCard testimonial={testimonial} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    current === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
