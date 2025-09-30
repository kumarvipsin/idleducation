
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TestimonialCard = ({ testimonial }: { testimonial: TTopperTestimonial }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <Dialog>
      <DialogTrigger as="div">
        <Card className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 group bg-card h-full cursor-pointer">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3 text-white">
                <p className="font-bold text-sm leading-tight">{testimonial.studentName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="p-0 border-0 max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">{`Testimonial from ${testimonial.studentName}`}</DialogTitle>
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
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 57%, rgba(237, 221, 83, 1) 100%)" }}>
            Topper's Testimonials
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
          </div>
        </div>
    </section>
  );
}
