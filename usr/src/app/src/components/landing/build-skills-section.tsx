'use client';

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const defaultSlides = [
  { 
    id: "default-1",
    imageUrl: "https://picsum.photos/seed/build-skills/1920/1080", 
    alt: "Students with backpacks looking towards the sky", 
    hint: "students future skills",
    title: "",
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    order: 1,
  },
];

export function BuildSkillsSection({ slides: initialSlides }: { slides: THeroSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
  
  return (
    <section className="relative w-full py-12 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900/50 dark:to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-primary">
                    Build Skills That Shape Your Future.
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                    Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button asChild size="lg">
                        <Link href="/admission">
                            Enroll Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/contact">Contact Us</Link>
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <div className="overflow-hidden rounded-2xl shadow-2xl" ref={emblaRef}>
                <div className="flex">
                  {(initialSlides.length > 0 ? initialSlides : defaultSlides).map((slide) => (
                    <div key={slide.id} className="relative flex-shrink-0 flex-grow-0 basis-full min-w-0 aspect-square">
                      <GcsImage
                        filePath={slide.imageUrl}
                        alt={slide.title || 'Hero Image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
