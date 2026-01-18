
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    slug: "jee-main-2026-admit-cards",
    title: "JEE Main 2026 Session 1 Admit Cards Released",
    excerpt: "Aspirants can Download the Admit Cards from jeemain.nta.nic.in...",
    imageUrl: "https://picsum.photos/seed/blog-jee1/800/600",
    imageHint: "student exam preparation"
  },
  {
    slug: "know-which-college-forms-to-fill-after-jee-main-2026",
    title: "Know Which College Forms to Fill After JEE Main 2026",
    excerpt: "Here's a Complete Guide About India's Premium Private, Researc...",
    imageUrl: "https://picsum.photos/seed/blog-jee2/800/600",
    imageHint: "student thinking future"
  },
  {
    slug: "shepherds-son-from-rajasthan-to-become-villages-first-doctor",
    title: "A Shepherd's Son from ALLEN Kota to Become Village's First...",
    excerpt: "Gordhanram from Barmer's Beriwala Tala village gets...",
    imageUrl: "https://picsum.photos/seed/blog-doctor/800/600",
    imageHint: "father son"
  },
  {
    slug: "nta-revises-jee-main-2026-session-1-exam-schedule",
    title: "NTA Revises JEE Main 2026 Session 1 Exam Schedule",
    excerpt: "Check the Revised Exam Dates Here The National Testing Agenc...",
    imageUrl: "https://picsum.photos/seed/blog-jee3/800/600",
    imageHint: "student exam schedule"
  },
  {
    slug: "power-of-personalized-learning",
    title: "The Power of Personalized Learning in Today's Education",
    excerpt: "Discover how tailoring education to individual student needs can unlock potential.",
    imageUrl: "https://picsum.photos/seed/blog-learning/800/600",
    imageHint: "personalized learning"
  }
];

export function BlogSection() {
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
          <h1 className="text-2xl md:text-3xl font-black text-accent">IDL Blogs</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Stay updated with the latest trends and insights in education.
          </p>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {blogPosts.map((post, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <Card className="h-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col bg-card">
                      <div className="relative w-full aspect-video">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          data-ai-hint={post.imageHint}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base font-semibold h-12">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{post.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center gap-2 mt-4">
            {blogPosts.map((_, i) => (
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
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/blog">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
