
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { PlayCircle } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: TTopperTestimonial }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPlaying(true);
  };

  return (
    <Card className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 group bg-card h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative aspect-video w-full">
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
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">Topper's </span> <span style={{ color: '#adb5bd' }}>Testimonials</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
        </div>
      </div>
    </section>
  );
}
