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
import useEmblaCarousel from "embla-carousel-react";

const localSlides = [
  { 
    id: "local-1",
    imageUrl: "/banner.jpg", 
    alt: "IDL Education Banner", 
  },
  { 
    id: "local-2",
    imageUrl: "/bannerr.jpg", 
    alt: "IDL Education Banner Alternate",
  },
];

export function BuildSkillsSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
  
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
                  {localSlides.map((slide, index) => (
                    <div key={slide.id} className="relative flex-shrink-0 flex-grow-0 basis-full min-w-0 aspect-video">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
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
