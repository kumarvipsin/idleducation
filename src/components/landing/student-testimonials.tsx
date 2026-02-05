'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { PlayCircle } from "lucide-react";

const TestimonialCard = ({ testimonial, language }: { testimonial: TTestimonial, language: 'en' | 'hi' }) => {
  const fullText = language === 'hi' && testimonial.testimonial_hi ? testimonial.testimonial_hi : testimonial.testimonial;

  return (
    <Dialog>
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-xl overflow-hidden"
      >
          <CardContent className="p-3 flex flex-col text-center items-center">
              <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden group cursor-pointer">
                  <GcsImage
                      filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                  />
                  {testimonial.videoId && (
                    <DialogTrigger asChild>
                       <button className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full h-8 w-8 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                          <PlayCircle className="w-5 h-5 text-primary/80" />
                      </button>
                    </DialogTrigger>
                  )}
              </div>
              <h3 className="font-bold text-base">{testimonial.name}</h3>
              <p className="text-[10px] text-primary font-semibold mb-3 uppercase tracking-wider">{testimonial.achievement}</p>
              <div className="relative h-24">
                  <span className="absolute top-0 left-0 text-4xl text-primary/20 font-serif -translate-y-2 -translate-x-1">“</span>
                  <ScrollArea className="h-full w-full px-2">
                      <blockquote className="text-xs text-muted-foreground italic leading-relaxed">
                      {fullText}
                      </blockquote>
                  </ScrollArea>
                  <span className="absolute bottom-0 right-0 text-4xl text-primary/20 font-serif translate-y-4 translate-x-1">”</span>
              </div>
          </CardContent>
      </Card>
      {testimonial.videoId && (
        <DialogContent className="max-w-3xl p-0">
            <DialogHeader className="p-4">
                <DialogTitle>{testimonial.name}'s Testimonial</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
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
  const language = 'en';
 
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
    <section id="testimonials" className="w-full py-4 md:py-8 bg-white dark:bg-background">
      <div className="text-center mb-10 px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          IDL{' '}
          <span className="relative inline-block">
            <span className="relative z-10">Stars</span>
            <span className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-300 z-0"></span>
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-2xl mx-auto font-medium">
          Uncover the Journey to Rise and Shine
        </p>
      </div>
      <div className="container mx-auto px-4 md:px-6">
          {loading ? (
             <div className="flex justify-center gap-6">
                <Skeleton className="h-80 w-full max-w-sm rounded-xl" />
                <Skeleton className="h-80 w-full max-w-sm rounded-xl hidden md:block" />
                <Skeleton className="h-80 w-full max-w-sm rounded-xl hidden lg:block" />
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
                                  <TestimonialCard testimonial={testimonial} language={language} />
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
            <p className="text-center text-xs text-muted-foreground">No testimonials available at the moment.</p>
          )}
        </div>
    </section>
  );
}
