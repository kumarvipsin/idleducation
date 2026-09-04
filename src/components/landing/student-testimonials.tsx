
'use client';

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { PlayCircle, Star } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  return (
    <Dialog>
      <Card
        className="h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-card text-foreground rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-border/60 group/card"
      >
          <CardContent className="p-3.5 sm:p-4 flex flex-col text-left items-start h-full">
              <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-slate-100 dark:bg-muted flex items-center justify-center border border-slate-100 dark:border-border/30">
                  <GcsImage
                      filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                      alt={testimonial.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  {testimonial.videoId && (
                    <DialogTrigger asChild>
                       <button className="absolute bottom-2.5 right-2.5 transition-all duration-200 active:scale-95 group-hover/card:scale-110 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white">
                          <PlayCircle className="w-8 h-8 sm:w-9 sm:h-9" />
                      </button>
                    </DialogTrigger>
                  )}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight mb-1">{testimonial.name}</h3>
              <div className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-primary/10 text-[#1F4FA3] dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2.5 border border-blue-100/80 dark:border-primary/20">
                  {testimonial.achievement}
              </div>
              <div className="relative w-full flex-grow">
                  <blockquote className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed text-left line-clamp-4">
                      “{testimonial.testimonial}”
                  </blockquote>
              </div>
          </CardContent>
      </Card>
      {testimonial.videoId && (
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-none">
            <DialogHeader className="sr-only">
                <DialogTitle>{testimonial.name} - Success Story</DialogTitle>
                <DialogDescription>Video success story from a student.</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-black">
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0`}
                title={`YouTube video player for ${testimonial.name}'s testimonial`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
            </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export function StudentTestimonials({ testimonials }: { testimonials: TTestimonial[] }) {
  const [loading, setLoading] = useState(!testimonials);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
 
  useEffect(() => {
    if (!api) {
      return;
    }
 
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );
  
  useEffect(() => {
    if (testimonials) {
      setLoading(false);
    }
  }, [testimonials]);

  return (
    <section id="testimonials" className="w-full pt-8 sm:pt-10 md:pt-14 pb-12 sm:pb-16 md:pb-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col">
              <div className="text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      IDL{' '}
                      <span className="relative inline-block">
                          <span className="relative z-10">Stars</span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[85%] h-2 z-0 pointer-events-none">
                              <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="w-full h-full text-[#102A68] dark:text-blue-400 fill-none stroke-current stroke-[6] opacity-75">
                                  <path d="M2,10 Q50,2 98,10" />
                              </svg>
                          </div>
                      </span>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal max-w-[700px] mx-auto text-center px-4 leading-relaxed">
                     Discover how our personalized approach is transforming academic journeys and building confidence through excellence.
                  </p>
              </div>

              {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[20px]" />)}
                 </div>
              ) : testimonials && testimonials.length > 0 ? (
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
                              delay: 3500,
                              stopOnInteraction: false,
                          }),
                      ]}
                      className="w-full"
                  >
                      <CarouselContent className="-ml-3 sm:-ml-4">
                          {testimonials.map((testimonial, index) => (
                              <CarouselItem key={index} className="pl-3 sm:pl-4 basis-[78%] xs:basis-[75%] sm:basis-[48%] md:basis-[33%] lg:basis-[31%]">
                                  <div className="p-0.5 h-full">
                                      <TestimonialCard testimonial={testimonial} />
                                  </div>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                  </Carousel>
                  
                  <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
                      {testimonials.map((_, i) => (
                          <button
                              key={i}
                              onClick={() => scrollTo(i)}
                              className={cn(
                                  "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                  current === i ? "w-6 sm:w-8 bg-[#0A225C] dark:bg-primary" : "w-1.5 sm:w-2 bg-slate-200 dark:bg-muted-foreground/30 hover:bg-slate-300"
                              )}
                              aria-label={`Go to slide ${i + 1}`}
                          />
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground italic font-bold">New success stories coming soon!</p>
              )}
          </div>
        </div>
    </section>
  );
}
