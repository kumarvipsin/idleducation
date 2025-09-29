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

const QuoteIcon = () => (
    <div className="absolute top-0 left-0 text-[8rem] leading-none font-bold text-primary/10 dark:text-primary/20 opacity-50 z-0">
        “
    </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const { language } = useLanguage();
  const fullText = language === 'hi' && testimonial.testimonial_hi ? testimonial.testimonial_hi : testimonial.testimonial;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (testimonial.avatarUrl) {
        const result = await getSignedUrlForPdf(testimonial.avatarUrl); // Reusing this action as it generates a readable signed URL
        if (result.success && result.url) {
          setAvatarUrl(result.url);
        }
      }
    };
    fetchAvatarUrl();
  }, [testimonial.avatarUrl]);


  return (
    <div className="p-2 h-full">
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground"
      >
        <CardContent className="p-6 flex-1 flex flex-col relative">
          <QuoteIcon />
          <div className="relative z-10 flex-1 flex flex-col">
            <ScrollArea className="h-32 flex-grow mb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <blockquote className="text-sm text-foreground/80 pr-4 mt-8">
                {fullText}
                </blockquote>
            </ScrollArea>

            <div className="flex items-center gap-4 mt-auto">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarImage src={avatarUrl ?? undefined} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                <p className="font-bold text-base">{testimonial.name}</p>
                <p className="text-xs text-primary font-semibold">{testimonial.achievement}</p>
                </div>
            </div>
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
    <section id="testimonials" className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:from-background dark:via-blue-900/10 dark:to-background">
      <div className="container mx-auto px-4 md:px-[10%]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">What Our </span>
            <span className="text-gray-300">Students Say</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className="relative w-full mx-auto" style={{ animationDelay: '0.2s' }}>
          {loading ? (
             <div className="flex justify-center gap-4">
                <Skeleton className="h-64 w-80 rounded-lg" />
                <Skeleton className="h-64 w-80 rounded-lg hidden md:block" />
                <Skeleton className="h-64 w-80 rounded-lg hidden lg:block" />
             </div>
          ) : (
            <Carousel
                opts={{
                align: "start",
                loop: true,
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
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
