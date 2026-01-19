
'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import { getTestimonials, getSignedUrlForPdf } from "@/app/actions";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { PlayCircle } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const { language } = useLanguage();
  const fullText = language === 'hi' && testimonial.testimonial_hi ? testimonial.testimonial_hi : testimonial.testimonial;

  return (
    <Dialog>
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-xl overflow-hidden"
      >
          <CardContent className="p-4 flex flex-col text-center items-center">
              <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden group cursor-pointer">
                  <GcsImage
                      filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                      alt={testimonial.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {testimonial.videoId && (
                    <DialogTrigger asChild>
                       <button className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                          <PlayCircle className="w-6 h-6 text-primary/80" />
                      </button>
                    </DialogTrigger>
                  )}
              </div>
              <h3 className="font-bold text-xl">{testimonial.name}</h3>
              <p className="text-xs text-primary font-semibold mb-4">{testimonial.achievement}</p>
              <div className="relative h-20">
                  <span className="absolute top-0 left-0 text-5xl text-primary/20 font-serif -translate-y-2 -translate-x-2">“</span>
                  <ScrollArea className="h-full w-full px-2">
                      <blockquote className="text-sm text-muted-foreground italic">
                      {fullText}
                      </blockquote>
                  </ScrollArea>
                  <span className="absolute bottom-0 right-0 text-5xl text-primary/20 font-serif translate-y-5 translate-x-2">”</span>
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

export function StudentTestimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<TTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchTestimonials = async () => {
      setLoading(true);
      const result = await getTestimonials();
      if (result.success && result.data) {
        setTestimonials(result.data as TTestimonial[]);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 bg-white dark:bg-background">
      <div className="text-center mb-12 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-black text-accent">IDL Stars</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Uncover the Journey to Rise and Shine
        </p>
      </div>
      <div className="container mx-auto px-4 md:px-6">
          {loading ? (
             <div className="flex justify-center gap-6">
                <Skeleton className="h-96 w-full max-w-sm rounded-xl" />
                <Skeleton className="h-96 w-full max-w-sm rounded-xl hidden md:block" />
                <Skeleton className="h-96 w-full max-w-sm rounded-xl hidden lg:block" />
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
            </>
          ) : (
            <p className="text-center text-muted-foreground">No testimonials available at the moment.</p>
          )}
        </div>
    </section>
  );
}
