
'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { PlayCircle } from "lucide-react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TestimonialCard = ({ testimonial, isPlaying, onPlayClick }: { testimonial: TTopperTestimonial, isPlaying: boolean, onPlayClick: () => void }) => {

  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onPlayClick();
  };

  return (
    <Card className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 group bg-card h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative aspect-[9/16] w-full">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0`}
              title={`YouTube video player for ${testimonial.studentName}'s testimonial`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <button
              onClick={handlePlayClick}
              className="w-full h-full group focus:outline-none"
            >
              <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/80 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </button>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <p className="font-bold text-lg text-foreground truncate">{testimonial.studentName}</p>
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
            <span>{testimonial.studentClass}</span>
            <span>{testimonial.studentPlace}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);

    const autoplayPlugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
    );
    
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

    const handlePlay = (videoId: string) => {
        setPlayingVideoId(videoId);
    };

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">No testimonials available yet.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
        <div className="text-center mb-12 px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">
            Topper's Testimonials
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        
        <div className="w-full pr-[10%]">
            <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full"
            >
                <CarouselContent className="-ml-6">
                {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="pl-6 basis-[80%] sm:basis-1/2 md:basis-[40%] lg:basis-1/4">
                        <TestimonialCard 
                            testimonial={testimonial} 
                            isPlaying={playingVideoId === testimonial.id}
                            onPlayClick={() => handlePlay(testimonial.id)}
                        />
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
                          "h-2 w-2 rounded-full transition-all",
                          current === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                      )}
                    />
                ))}
            </div>
        </div>
    </section>
  );
}
