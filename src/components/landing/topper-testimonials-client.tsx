
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { PlayCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const TestimonialCard = ({ testimonial, onSelect, isActive }: { testimonial: TTopperTestimonial, onSelect: () => void, isActive: boolean }) => {
  return (
    <button onClick={onSelect} className={`w-full text-left rounded-lg transition-all duration-300 ${isActive ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}>
      <Card className={`overflow-hidden border-0 ${isActive ? 'bg-transparent' : 'bg-card'}`}>
        <CardContent className="p-3 flex items-center gap-4">
            <div className="relative aspect-video w-24 shrink-0">
              <Image
                src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                alt={`Testimonial from ${testimonial.studentName}`}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground truncate">{testimonial.studentName}</p>
              <div className="flex flex-col text-xs text-muted-foreground mt-1">
                <span>{testimonial.studentClass}</span>
                <span>{testimonial.studentPlace}</span>
              </div>
            </div>
        </CardContent>
      </Card>
    </button>
  );
};


export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [activeTestimonial, setActiveTestimonial] = React.useState<TTopperTestimonial | null>(testimonials?.[0] || null);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 group bg-card h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative aspect-video w-full">
                            {activeTestimonial ? (
                                <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${activeTestimonial.videoId}?autoplay=1&rel=0`}
                                title={`YouTube video player for ${activeTestimonial.studentName}'s testimonial`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <p className="text-muted-foreground">Select a testimonial to watch.</p>
                                </div>
                            )}
                        </div>
                         {activeTestimonial && (
                            <div className="p-4 bg-muted/50">
                                <p className="font-bold text-lg text-foreground truncate">{activeTestimonial.studentName}</p>
                                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                    <span>{activeTestimonial.studentClass}</span>
                                    <span>{activeTestimonial.studentPlace}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <h3 className="text-xl font-bold mb-4">More Toppers</h3>
                <ScrollArea className="h-96 pr-4">
                    <div className="space-y-3">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard 
                            key={testimonial.id} 
                            testimonial={testimonial}
                            onSelect={() => setActiveTestimonial(testimonial)}
                            isActive={activeTestimonial?.id === testimonial.id}
                        />
                    ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
      </div>
    </section>
  );
}

