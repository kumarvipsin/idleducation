'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";

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
                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <PlayCircle className="w-6 h-6 text-primary/80" />
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

        <div className="p-3">
          <p className="font-bold text-base text-foreground truncate">{testimonial.studentName}</p>
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
            <span>{testimonial.studentClass}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-muted-foreground">No testimonials available yet.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
        <div className="text-center mb-12 px-4 md:px-6">
          <div className="flex items-center justify-center">
            <span className="text-blue-600 text-2xl mr-2">•</span>
            <h2 className="text-lg font-semibold text-blue-600">Topper's Testimonials</h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-muted-foreground tracking-tight mt-2">
            Hear from those who've reached the top.
          </h3>
        </div>
        
        <div className="relative mt-12">
          <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 px-4 md:px-[10%]">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="block flex-shrink-0 w-80 sm:w-96 group">
                    <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  );
}
