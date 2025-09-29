
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [activeTestimonial, setActiveTestimonial] = React.useState<TTopperTestimonial | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [animationKey, setAnimationKey] = React.useState(0);

  React.useEffect(() => {
    if (testimonials && testimonials.length > 0 && !activeTestimonial) {
      setActiveTestimonial(testimonials[0]);
    }
  }, [testimonials, activeTestimonial]);
  
  const handleThumbnailClick = (testimonial: TTopperTestimonial) => {
    setActiveTestimonial(testimonial);
    setIsPlaying(false);
    setAnimationKey(prev => prev + 1); // Trigger animation
  };

  const handlePlayClick = () => {
    if (activeTestimonial) {
      setIsPlaying(true);
    }
  };

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
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-primary">Topper's </span> <span style={{ color: '#adb5bd' }}>Testimonials</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover how our top students achieved their goals. Watch their success stories and get inspired.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {activeTestimonial && (
                <div key={animationKey} className="relative w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 animate-fade-in-up">
                  <div className="aspect-[16/9]">
                    {isPlaying ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${activeTestimonial.videoId}?autoplay=1&rel=0`}
                        title={`YouTube video player for ${activeTestimonial.studentName}'s testimonial`}
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
                          src={`https://img.youtube.com/vi/${activeTestimonial.videoId}/hqdefault.jpg`}
                          alt={`Testimonial from ${activeTestimonial.studentName}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-primary">More Toppers</h3>
              <div className="h-[400px] overflow-hidden relative">
                <div className="animate-marquee-vertical space-y-3 hover:[animation-play-state:paused]">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <button
                        key={`${testimonial.id}-${index}`}
                        onClick={() => handleThumbnailClick(testimonial)}
                        className={cn(
                            "w-full text-left p-2 rounded-lg transition-all duration-200 flex items-center gap-4",
                            activeTestimonial?.id === testimonial.id
                            ? "bg-primary/10 border border-primary"
                            : "bg-muted/50 border border-transparent hover:bg-muted"
                        )}
                        >
                        <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0">
                            <Image
                                src={`https://img.youtube.com/vi/${testimonial.videoId}/mqdefault.jpg`}
                                alt={testimonial.studentName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-foreground truncate">{testimonial.studentName}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.studentClass}</p>
                        </div>
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
