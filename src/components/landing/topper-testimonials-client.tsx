
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
        <DialogContent className="max-w-[380px] p-0 overflow-hidden rounded-3xl border-none shadow-none bg-black">
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
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                                <PlayCircle className="w-5 h-5 text-white fill-current" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase italic">Topper's Talk</h2>
                        </div>
                        <p className="text-sm text-muted-foreground font-bold max-w-xl">
                           Hear directly from our high achievers and parents about their journey to academic excellence.
                        </p>
                    </div>
                    
                    <div className="hidden md:flex gap-2">
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
                
                <div className="flex justify-center gap-1.5 mt-2 md:hidden">
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
        </div>
    </section>
  );
}
