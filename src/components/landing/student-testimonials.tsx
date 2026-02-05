'use client';

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PlayCircle } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  return (
    <Dialog>
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-2xl overflow-hidden border-muted-foreground/10"
      >
          <CardContent className="p-4 flex flex-col text-center items-center">
              <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden group cursor-pointer">
                  <GcsImage
                      filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                  />
                  {testimonial.videoId && (
                    <DialogTrigger asChild>
                       <button className="absolute inset-0 flex items-center justify-center transition-transform active:scale-95">
                          <PlayCircle className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]" />
                      </button>
                    </DialogTrigger>
                  )}
              </div>
              <h3 className="font-black text-base tracking-tight">{testimonial.name}</h3>
              <p className="text-[10px] text-primary font-black mb-4 uppercase tracking-[0.15em]">{testimonial.achievement}</p>
              <div className="relative h-24 w-full">
                  <span className="absolute top-0 left-0 text-4xl text-primary/10 font-serif -translate-y-2 -translate-x-1">“</span>
                  <ScrollArea className="h-full w-full px-2">
                      <blockquote className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                      {testimonial.testimonial}
                      </blockquote>
                  </ScrollArea>
                  <span className="absolute bottom-0 right-0 text-4xl text-primary/10 font-serif translate-y-4 translate-x-1">”</span>
              </div>
          </CardContent>
      </Card>
      {testimonial.videoId && (
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl border-none">
            <DialogHeader className="p-4 bg-background">
                <DialogTitle className="font-black tracking-tight">{testimonial.name}'s Story</DialogTitle>
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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
 
  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

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
    <section id="testimonials" className="w-full py-6 md:py-10 bg-white dark:bg-background">
      <div className="text-center mb-8 px-4">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-800 dark:text-white uppercase">
          IDL{' '}
          <span className="relative inline-block">
            <span className="relative z-10">Stars</span>
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-300 z-0"></span>
          </span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto font-medium">
          Uncover the Journey to Rise and Shine
        </p>
      </div>
      <div className="container mx-auto px-4 md:px-6">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
             </div>
          ) : testimonials && testimonials.length > 0 ? (
            <>
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
                              <div className="p-1 h-full">
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
            </>
          ) : (
            <p className="text-center text-xs text-muted-foreground italic">New success stories coming soon!</p>
          )}
        </div>
    </section>
  );
}