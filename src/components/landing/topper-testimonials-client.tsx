
'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const TopperCard = ({ testimonial, onCardClick }: { testimonial: TTopperTestimonial, onCardClick: () => void }) => (
    <DialogTrigger asChild>
        <button onClick={onCardClick} className="w-full h-full text-left group focus:outline-none">
            <Card className="relative overflow-hidden h-full shadow-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <Image
                    src={`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`}
                    alt={`Testimonial from ${testimonial.studentName}`}
                    data-ai-hint="student photo"
                    width={1280}
                    height={720}
                    className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="w-16 h-16 text-white/80" />
                </div>
                 <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-white text-lg">{testimonial.studentName}</h3>
                    <p className="text-sm text-white/90">{testimonial.studentClass} | {testimonial.studentPlace}</p>
                </div>
            </Card>
        </button>
    </DialogTrigger>
);

export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<TTopperTestimonial | null>(null);
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedVideo(null);
      setSelectedTestimonial(null);
    }
  };

  const handleCardClick = (testimonial: TTopperTestimonial) => {
    setSelectedVideo(testimonial.videoId);
    setSelectedTestimonial(testimonial);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
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
        
            {testimonials.length > 0 ? (
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[autoplayPlugin.current]}
                    className="w-full"
                    onMouseEnter={() => autoplayPlugin.current.stop()}
                    onMouseLeave={() => autoplayPlugin.current.play()}
                >
                    <CarouselContent className="-ml-4">
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                 <TopperCard testimonial={testimonial} onCardClick={() => handleCardClick(testimonial)} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            ) : (
                <p className="text-center text-muted-foreground">No testimonials available yet.</p>
            )}
        </div>
      </section>

      {selectedVideo && selectedTestimonial && (
        <DialogContent className="max-w-4xl w-[90vw] p-0 border-0 rounded-xl overflow-hidden shadow-2xl bg-black aspect-video">
            <DialogHeader className="sr-only">
              <DialogTitle>Video: {selectedTestimonial.studentName}'s Testimonial</DialogTitle>
            </DialogHeader>
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                title={`YouTube video player for ${selectedTestimonial.studentName}'s testimonial`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </DialogContent>
      )}
    </Dialog>
  );
}
