
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

const TestimonialCard = ({ testimonial, onSelect, isActive }: { testimonial: TTopperTestimonial, onSelect: () => void, isActive: boolean }) => {
  return (
    <button onClick={onSelect} className={`w-full text-left rounded-lg transition-all duration-300 ${isActive ? '' : 'hover:bg-muted'}`}>
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
        <div className="text-center mb-12 px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">Topper's </span> <span style={{ color: '#adb5bd' }}>Testimonials</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="w-full lg:w-4/5 mx-auto">
            <Card className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 group bg-card h-full">
                <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative w-full" style={{ paddingBottom: '45%' /* 16:9 aspect ratio, 20% height reduction -> 9 * 0.8 / 16 = 0.45 */ }}>
                        {activeTestimonial ? (
                            <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${activeTestimonial.videoId}?autoplay=1&rel=0`}
                            title={`YouTube video player for ${activeTestimonial.studentName}'s testimonial`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="absolute top-0 left-0 w-full h-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">Select a testimonial to watch.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-center">Watch More Toppers</h3>
            <div className="relative w-full overflow-hidden">
                <div className="marquee-container flex gap-3">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                       <div key={index} className="flex-shrink-0 w-[300px]">
                         <TestimonialCard 
                            testimonial={testimonial}
                            onSelect={() => setActiveTestimonial(testimonial)}
                            isActive={activeTestimonial?.id === testimonial.id}
                        />
                       </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}
