
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useEmblaCarousel, { type CarouselApi } from 'embla-carousel-react';
import Autoplay from "embla-carousel-autoplay";
import { Separator } from "../ui/separator";

const TestimonialCard = ({ testimonial }: { testimonial: TTopperTestimonial}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPlaying(true);
  };
  
  const handleClose = () => {
    setIsPlaying(false);
  }

  return (
    <Card className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 group bg-card h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
          <DialogTrigger asChild>
            <button
              onClick={handlePlayClick}
              className="w-full h-full group focus:outline-none relative aspect-video"
            >
                <Image
                    src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                    alt={`Testimonial from ${testimonial.studentName}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0" onInteractOutside={handleClose}>
                <DialogHeader className="p-4">
                  <DialogTitle>{testimonial.studentName} - Topper Testimonial</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
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

        <div className="p-2 flex-grow flex flex-col">
          <p className="font-bold text-xs text-foreground truncate">{testimonial.studentName}</p>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
            <span>{testimonial.studentClass}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }
    if (playingVideoId) {
      if (api.plugins().autoplay) {
        api.plugins().autoplay.stop();
      }
    } else {
       if (api.plugins().autoplay) {
          api.plugins().autoplay.play();
       }
    }
  }, [playingVideoId, api]);

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
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">Topper's </span> <span style={{ color: '#adb5bd' }}>Testimonials</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        
        <Separator className="w-1/2 mx-auto h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative mt-12">
          <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 px-4 md:pl-[10%]">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                    <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  );
}
