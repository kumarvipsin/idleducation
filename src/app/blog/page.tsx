'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, ArrowRight, BookOpen, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getBlogPosts } from "@/app/actions/blog";
import type { TBlogPost } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";

const defaultPosts: TBlogPost[] = [
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

export default function BlogPage() {
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const result = await getBlogPosts();
      if (result.success && result.data && (result.data as TBlogPost[]).length > 0) {
        setPosts(result.data as TBlogPost[]);
      } else {
        setPosts(defaultPosts);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const list = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];
    return list;
  }, [posts]);
  
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, posts]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[340px] w-full rounded-2xl" />
        ))}
    </div>
  );

  return (
    <div className="relative bg-white dark:bg-background pb-20 min-h-screen">
      
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-2">

        {/* Compact Search & Category Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-border/40 pb-4 mb-6">
          
          {/* Category Filter Pills */}
          <div className="overflow-x-auto pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-4 whitespace-nowrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "relative px-0.5 pb-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer bg-transparent border-none outline-none shadow-none",
                    selectedCategory === category 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {category}
                  {selectedCategory === category && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal Expandable Search Icon */}
          <div className="relative flex items-center justify-end shrink-0">
            <div 
              className={cn(
                "flex items-center transition-all duration-300 ease-in-out rounded-full bg-transparent border-none shadow-none outline-none overflow-hidden",
                isSearchOpen || searchTerm ? "w-56 sm:w-64 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80" : "w-9 h-9 justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shrink-0 p-1 cursor-pointer border-none outline-none shadow-none focus:outline-none focus:ring-0"
                aria-label="Search articles"
              >
                <Search className="h-4 w-4" />
              </button>
              
              {(isSearchOpen || searchTerm) && (
                <Input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => { if (!searchTerm) setIsSearchOpen(false); }}
                  className="flex-1 border-0 shadow-none outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs placeholder:text-muted-foreground/70 bg-transparent h-8 px-2"
                  autoFocus
                />
              )}

              {searchTerm && (
                <button 
                  onClick={() => { setSearchTerm(''); setIsSearchOpen(false); }} 
                  className="text-muted-foreground hover:text-foreground shrink-0 p-1 cursor-pointer border-none outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Grid Content Section */}
      <div className="container mx-auto px-4 md:px-6">
        {loading ? renderSkeleton() : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id || post.slug} href={`/blog/${post.slug}`} className="block group h-full">
                <Card className="h-full rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col group-hover:-translate-y-1">
                  
                  {/* Image Thumbnail */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <BlogCardImage src={post.imageUrl} alt={post.title} />
                    
                    {/* Category Badge */}
                    {post.category && (
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border border-primary/20 shadow-sm">
                        {post.category}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-2">
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

                      <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-muted-foreground font-normal line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs font-bold text-primary">
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read Full Article
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border my-6">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
            <h3 className="text-base font-bold text-foreground">No Blog Articles Found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or selected category filter.</p>
            <Button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
              variant="outline" 
              className="mt-4 rounded-full text-xs font-bold h-9"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}