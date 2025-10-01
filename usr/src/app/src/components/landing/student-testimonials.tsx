
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

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const { language } = useLanguage();
  const fullText = language === 'hi' && testimonial.testimonial_hi ? testimonial.testimonial_hi : testimonial.testimonial;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      setLoadingAvatar(true);
      if (testimonial.avatarUrl) {
        const result = await getSignedUrlForPdf(testimonial.avatarUrl);
        if (result.success && result.url) {
          setAvatarUrl(result.url);
        }
      }
      setLoadingAvatar(false);
    };
    fetchAvatarUrl();
  }, [testimonial.avatarUrl]);

  return (
    <Card
      className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-xl overflow-hidden"
    >
        <CardContent className="p-4 flex flex-col text-center items-center">
            <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                {loadingAvatar ? (
                    <Skeleton className="w-full h-full" />
                ) : avatarUrl ? (
                    <Image
                    src={avatarUrl}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    />
                ) : (
                    <Image
                    src="https://picsum.photos/seed/5/400/400"
                    alt="Placeholder for testimonial author"
                    data-ai-hint="person student"
                    fill
                    className="object-cover"
                    />
                )}
            </div>
            <h3 className="font-bold text-lg">{testimonial.name}</h3>
            <p className="text-xs text-primary font-semibold mb-4">{testimonial.achievement}</p>
            <div className="relative h-36">
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
        <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">
          What Our Students Say
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t('testimonials.subtitle')}
        </p>
      </div>
      <div className="relative w-full">
          {loading ? (
             <div className="flex justify-center gap-6 px-4 md:px-[10%]">
                <Skeleton className="h-96 w-full max-w-sm rounded-xl" />
                <Skeleton className="h-96 w-full max-w-sm rounded-xl hidden md:block" />
                <Skeleton className="h-96 w-full max-w-sm rounded-xl hidden lg:block" />
             </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-6 px-4 md:px-[10%]">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No testimonials available at the moment.</p>
          )}
        </div>
    </section>
  );
}
