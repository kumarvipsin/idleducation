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
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-2xl overflow-hidden border-muted-foreground/10"
      >
          <CardContent className="p-4 flex flex-col text-left items-start">
              <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden group cursor-pointer border-4 border-primary/5">
                  <GcsImage
                      filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                  />
                  {testimonial.videoId && (
                    <DialogTrigger asChild>
                       <button className="absolute bottom-3 right-3 transition-all duration-300 active:scale-95 group-hover:scale-110">
                          <PlayCircle className="w-10 h-10 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                      </button>
                    </DialogTrigger>
                  )}
              </div>
              <h3 className="font-extrabold text-base tracking-tight mb-1">{testimonial.name}</h3>
              <div className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider mb-4">
                  {testimonial.achievement}
              </div>
              <div className="relative h-24 w-full">
                  <div className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <blockquote className="text-xs text-muted-foreground font-bold leading-relaxed text-left">
                      {testimonial.testimonial}
                      </blockquote>
                  </div>
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
    <section id="testimonials" className="w-full py-12 md:py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-4 text-left">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                              <Star className="w-5 h-5 text-white fill-current" />
                          </div>
                          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase italic">What our students &amp; parents say</h2>
                      </div>
                      <p className="text-sm text-muted-foreground font-bold max-w-xl">
                         Uncover the Journey to Rise and Shine
                      </p>
                  </div>
                  
                  <div className="hidden md:flex gap-2">
                      {testimonials && testimonials.map((_, i) => (
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
                          loop: (testimonials || []).length > 3,
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
                </>
              ) : (
                <p className="text-center text-xs text-muted-foreground italic font-bold">New success stories coming soon!</p>
              )}
          </div>
        </div>
    </section>
  );
}