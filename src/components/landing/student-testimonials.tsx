
'use client';

import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import { getTestimonials, getSignedUrlForPdf } from "@/app/actions";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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
    <div className="p-2 h-full">
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-xl overflow-hidden"
      >
        <CardContent className="p-6 flex-1 flex flex-col text-center">
          <div className="relative w-full aspect-square mb-4">
            {loadingAvatar ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={testimonial.name}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
               <Image
                src="https://picsum.photos/seed/5/400/400"
                alt="Placeholder for testimonial author"
                data-ai-hint="person student"
                fill
                className="object-cover rounded-lg"
              />
            )}
          </div>
          <h3 className="font-bold text-lg">{testimonial.name}</h3>
          <p className="text-xs text-primary font-semibold mb-2">{testimonial.achievement}</p>
          <div className="relative h-24">
            <span className="absolute -top-2 left-0 text-6xl text-primary/10 font-serif">“</span>
            <ScrollArea className="h-full w-full px-6">
              <blockquote className="text-xs text-muted-foreground italic">
                {fullText}
              </blockquote>
            </ScrollArea>
            <span className="absolute -bottom-4 right-0 text-6xl text-primary/10 font-serif">”</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function StudentTestimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<TTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

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
      <div className="container mx-auto px-4 md:px-[10%]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">What Our </span>
            <span className="text-gray-400">Students Say</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className="relative w-full mx-auto" style={{ animationDelay: '0.2s' }}>
          {loading ? (
             <div className="flex justify-center gap-4">
                <Skeleton className="h-96 w-72 rounded-xl" />
                <Skeleton className="h-96 w-72 rounded-xl hidden md:block" />
                <Skeleton className="h-96 w-72 rounded-xl hidden lg:block" />
             </div>
          ) : (
            <Carousel
                opts={{
                align: "start",
                loop: testimonials.length > 1,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full"
            >
                <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <TestimonialCard testimonial={testimonial} />
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
