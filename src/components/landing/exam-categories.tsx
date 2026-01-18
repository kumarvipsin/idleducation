
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Academic Programs",
    subtitle: "Class 6 - 12",
    href: "/school",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "students in classroom"
  },
  {
    title: "For Medical & Non Medical",
    subtitle: "Take the First Step towards becoming a Doctor/Engineer",
    href: "/category/iit-jee",
    imageUrl: "https://cdn1.byjus.com/wp-content/uploads/2024/02/Aakash_JEE_NEET.webp",
    imageHint: "student studying"
  },
  {
    title: "For Competitive Exams",
    subtitle: "CUET | SSC | DELHI POLICE & OTHER EXAM",
    href: "/examcat",
    imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "professionals meeting"
  },
  {
    title: "For Open School Programs",
    subtitle: "NIOS | IGNOU | DU SOL",
    href: "/new-work",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "students outdoors"
  },
];

export function ExamCategories() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );
  
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 text-2xl mr-2">•</span>
              <h2 className="text-lg font-semibold text-blue-600">Exam Categories</h2>
            </div>
          <h3 className="text-2xl md:text-3xl font-black text-muted-foreground tracking-tight mt-2">
            Find the perfect program to help you achieve your academic and career goals.
          </h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore a wide range of courses designed to provide comprehensive knowledge and skills, ensuring you are well-prepared for any challenge ahead.
          </p>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {categories.map((category, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                    <Link href={category.href} className="block h-full group">
                        <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    src={category.imageUrl}
                                    alt={category.title}
                                    data-ai-hint={category.imageHint}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-8 flex flex-col items-start bg-gradient-to-t from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 flex-grow">
                                <h3 className="text-2xl font-black text-foreground text-left">{category.title}</h3>
                                <p className="text-sm mt-2 text-muted-foreground min-h-[5rem]">{category.subtitle}</p>
                                <div className="mt-auto pt-2">
                                    <div className="text-primary font-semibold flex items-center group-hover:underline text-sm">
                                        Explore Category
                                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center gap-2 mt-8">
            {categories.map((_, i) => (
                <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all duration-300",
                        current === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                    )}
                />
            ))}
        </div>
      </div>
    </section>
  );
}
