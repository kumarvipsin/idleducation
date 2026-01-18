'use client';

import * as React from "react";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle, Video } from "lucide-react";
import { Button } from "../ui/button";

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
    <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
      <DialogTrigger asChild>
        <button
          onClick={handlePlayClick}
          className="relative aspect-video w-full group focus:outline-none rounded-lg overflow-hidden shadow-lg"
        >
            <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/70 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute bottom-2 left-2 text-left">
              <p className="font-bold text-sm text-white drop-shadow-md">{testimonial.studentName}</p>
              <p className="text-xs text-white/80 drop-shadow-md">{testimonial.studentClass}</p>
            </div>
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
  );
};

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  // Duplicate testimonials for seamless marquee effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="w-full py-12 md:py-24 bg-blue-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">IDL Stars</h2>
            <p className="text-lg text-blue-200 max-w-lg mx-auto lg:mx-0">
              Uncover the Journey to Rise and Shine
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-blue-900 hover:bg-gray-200">
              <Video className="mr-2 h-5 w-5" />
              Watch Videos
            </Button>
          </div>
          <div className="relative h-96 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex flex-col gap-4">
              <div className="flex animate-marquee-scroll gap-4">
                {duplicatedTestimonials.map((testimonial, index) => (
                  <div key={`row1-${index}`} className="w-64 flex-shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
               <div className="flex animate-marquee-scroll-reverse gap-4">
                {duplicatedTestimonials.slice().reverse().map((testimonial, index) => (
                  <div key={`row2-${index}`} className="w-64 flex-shrink-0">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
