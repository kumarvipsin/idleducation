
'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import { getTestimonials, getSignedUrlForPdf } from "@/app/actions";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const { language } = useLanguage();
  const fullText = language === 'hi' && testimonial.testimonial_hi ? testimonial.testimonial_hi : testimonial.testimonial;

  return (
    <Card
      className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-xl overflow-hidden"
    >
        <CardContent className="p-4 flex flex-col text-center items-center">
            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                <GcsImage
                    filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                />
            </div>
            <h3 className="font-bold text-lg">{testimonial.name}</h3>
            <p className="text-xs text-primary font-semibold mb-4">{testimonial.achievement}</p>
            <div className="relative h-28">
                <span className="absolute top-0 left-0 text-5xl text-primary/20 font-serif -translate-y-2 -translate-x-2">“</span>
                <ScrollArea className="h-full w-full px-2">
                    <blockquote className="text-sm text-muted-foreground italic">
                    {fullText}
                    </blockquote>
                </ScrollArea>
                <span className="absolute bottom-0 right-0 text-5xl text-primary/20 font-serif translate-y-5 translate-x-2">”</span>
            </div>
        </CardContent>
    </Card>
  );
};

export function StudentTestimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<TTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const result = await getTestimonials();
      if (result.success && result.data) {
        setTestimonials(result.data as TTestimonial[]);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-background">
      <div className="text-center mb-12 px-4 md:px-6">
        <div className="flex items-center justify-center">
          <span className="text-blue-600 text-2xl mr-2">•</span>
          <h2 className="text-lg font-semibold text-blue-600">What Our Students Say</h2>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t('testimonials.subtitle')}
        </p>
      </div>
      <div className="relative">
          {loading ? (
             <div className="flex justify-center gap-6 px-4 md:px-[10%]">
                <Skeleton className="h-96 w-full max-w-sm rounded-xl" />
                <Skeleton className="h-96 w-full max-w-sm rounded-xl hidden md:block" />
                <Skeleton className="h-96 w-full max-w-sm rounded-xl hidden lg:block" />
             </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-6 px-4 md:pl-[10%]">
                    {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                        <TestimonialCard testimonial={testimonial} />
                    </div>
                    ))}
                </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No testimonials available at the moment.</p>
          )}
        </div>
    </section>
  );
}
