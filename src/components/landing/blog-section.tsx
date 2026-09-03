
'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { getBlogPosts } from "@/app/actions/blog";
import type { TBlogPost } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";

const fallbackPosts: TBlogPost[] = [
  {
    id: "1",
    slug: "jee-main-2026-admit-cards",
    title: "JEE Main 2026 Session 1 Admit Cards Released — Key Guidelines for Students",
    excerpt: "Essential updates and exam day instructions for aspirants appearing for JEE Main Session 1.",
    category: "JEE Main",
    author: "IDL Academic Team",
    date: "Jan 18, 2026",
    imageUrl: "/idlbranch.png"
  },
  {
    id: "2",
    slug: "know-which-college-forms-to-fill-after-jee-main-2026",
    title: "Top Engineering Colleges & Application Forms to Fill After JEE Main",
    excerpt: "A complete guide to top central, state, and private university admissions following JEE Main ranks.",
    category: "Career Guidance",
    author: "Amod Sir",
    date: "Jan 15, 2026",
    imageUrl: "/idlbranch1.png"
  },
  {
    id: "3",
    slug: "power-of-personalized-learning",
    title: "The Power of Personalized Guidance & Doubt Resolution in Student Growth",
    excerpt: "How structured 1-on-1 mentorship and immediate doubt support transform student exam performance.",
    category: "Learning Strategy",
    author: "IDL Faculty",
    date: "Jan 10, 2026",
    imageUrl: "/idlbranch.png"
  },
  {
    id: "4",
    slug: "nta-revises-jee-main-2026-session-1-exam-schedule",
    title: "NTA Updates Exam Guidelines & Pattern Details for Upcoming Sessions",
    excerpt: "Stay informed about recent pattern updates and shift timings issued by NTA.",
    category: "Exam Updates",
    author: "IDL News Desk",
    date: "Jan 05, 2026",
    imageUrl: "/idlbranch1.png"
  }
];

function BlogCardImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Image src="/idllogo.png" alt={alt} width={80} height={80} className="opacity-30 object-contain" />
      </div>
    );
  }

  // If it's a local static asset (like /teacher.png) or non-GCS external HTTP URL
  if ((src.startsWith('/') || src.startsWith('http')) && !src.includes('storage.googleapis.com')) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        unoptimized={src.startsWith('http')}
      />
    );
  }

  // Google Cloud Storage image (path or GCS URL) -> must get signed URL via GcsImage
  return (
    <GcsImage
      filePath={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export function BlogSection() {
  const [posts, setPosts] = useState<TBlogPost[]>(fallbackPosts);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await getBlogPosts();
        if (res.success && res.data && res.data.length > 0) {
          setPosts(res.data as TBlogPost[]);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      }
    }
    loadPosts();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="w-full py-12 md:py-16 bg-slate-50/50 dark:bg-background border-y border-slate-200/60 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section - Matched to Offline Centers page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="text-left max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
              IDL Education{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">Blogs</span>
                <div className="absolute -bottom-1 left-0 w-full h-2.5 z-0">
                  <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                    <path d="M0,15 Q50,5 100,15" />
                  </svg>
                </div>
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-3 font-medium leading-relaxed">
              Stay ahead with expert study tips, exam announcements, career guidance, and academic strategies.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => api?.scrollPrev()}
              className="h-9 w-9 rounded-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 cursor-pointer"
              aria-label="Previous Post"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => api?.scrollNext()}
              className="h-9 w-9 rounded-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              aria-label="Next Post"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Blog Carousel Grid */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {posts.map((post, index) => (
              <CarouselItem key={post.id || index} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                <div className="h-full py-1">
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <Card className="h-full rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col group-hover:-translate-y-1">
                      
                      {/* Image Thumbnail Container */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <BlogCardImage src={post.imageUrl} alt={post.title} />
                        
                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border border-primary/20 shadow-sm">
                            {post.category}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                        <div className="space-y-2">
                          {/* Metadata row */}
                          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                            {post.author && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-primary" />
                                {post.author}
                              </span>
                            )}
                            {post.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                                {post.date}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-xs text-muted-foreground font-normal line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        {/* Read More link */}
                        <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs font-bold text-primary">
                          <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Read Article
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>

                      </div>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Bottom Pagination Dots & View All Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="flex items-center gap-1.5">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  current === i ? "w-6 bg-primary" : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <Link href="/blog" className="relative inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors pb-1 group">
              View All <ArrowRight className="h-3.5 w-3.5" />
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        </div>

      </div>
    </section>
  );
}
