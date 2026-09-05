
'use client';

import * as React from "react";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";
import { PlayCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

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
        <VideoModalDialogContent className="w-[min(calc(100vw-2.5rem),calc((84dvh)*9/16),420px)] aspect-[9/16] h-auto">
            <DialogHeader className="sr-only">
                <DialogTitle>{testimonial.studentName} Testimonial</DialogTitle>
                <DialogDescription>Video testimonial from a top performing student.</DialogDescription>
            </DialogHeader>
            <div className="relative w-full h-full overflow-hidden">
              <iframe
                  className="block w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`YouTube video player for ${testimonial.studentName}'s testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
              ></iframe>
            </div>
        </VideoModalDialogContent>
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
    <section className="relative w-full pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 bg-white dark:bg-background overflow-hidden">
        {/* Subtle ambient depth glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[960px] h-[340px] sm:h-[420px] bg-blue-500/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-[10%] w-[320px] sm:w-[480px] h-[260px] bg-amber-500/[0.015] rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="flex flex-col">
                <div className="text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-7 md:mb-8">
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
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
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto">
                        Discover the inspiring journeys and success stories shared by our top-ranking students and their families.
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
                    
                    <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-7">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-xs",
                                    current === i ? "w-8 bg-[#0A225C] dark:bg-primary" : "w-1.5 sm:w-2 bg-slate-200 dark:bg-muted-foreground/30 hover:bg-slate-300"
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
