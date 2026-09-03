'use client';

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Calendar, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts } from "@/app/actions/blog";
import type { TBlogPost } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import { useToast } from "@/hooks/use-toast";

function BlogCardImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Image src="/idllogo.png" alt={alt} width={80} height={80} className="opacity-30 object-contain" />
      </div>
    );
  }

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

  return (
    <GcsImage
      filePath={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [post, setPost] = useState<TBlogPost | null>(null);
  const [otherPosts, setOtherPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    // 2. Disable Copying
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({
        variant: "destructive",
        title: "Copying Restricted",
        description: "Content protection is active for this article.",
      });
    };

    // 3. Disable Print/Screenshot Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        toast({
          variant: "destructive",
          title: "Printing Restricted",
          description: "This document cannot be printed.",
        });
      }
      if (e.key === 'PrintScreen') {
        toast({
          variant: "destructive",
          title: "Security Alert",
          description: "Screenshots are discouraged to protect copyrighted content.",
        });
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toast]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [postResult, allPostsResult] = await Promise.all([
        getBlogPostBySlug(params.slug),
        getBlogPosts()
      ]);

      if (postResult.success && postResult.data) {
        setPost(postResult.data as TBlogPost);
      }
      
      if (allPostsResult.success && allPostsResult.data) {
        const filtered = (allPostsResult.data as TBlogPost[])
          .filter(p => p.slug !== params.slug)
          .slice(0, 3);
        setOtherPosts(filtered);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 space-y-8 max-w-4xl">
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
        <div className="container mx-auto py-24 text-center">
            <h1 className="text-2xl font-bold text-foreground">Article Not Found</h1>
            <p className="text-sm text-muted-foreground mt-2">The requested blog post could not be located.</p>
            <Button asChild className="mt-6 rounded-full text-xs font-bold" variant="outline">
                <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Articles</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background min-h-screen py-10 px-4 md:px-6 select-none print:hidden">
      
      {/* Top Breadcrumb Nav */}
      <div className="container mx-auto max-w-4xl mb-6">
          <Button asChild variant="ghost" className="text-slate-600 hover:text-primary font-bold text-xs hover:bg-transparent p-0">
              <Link href="/blog" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Articles
              </Link>
          </Button>
      </div>

      {/* Article Body Container */}
      <article className="max-w-4xl mx-auto p-6 md:p-10 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden" id="blog-printable-content">
        <header className="mb-10 space-y-6">
          
          {/* Cover Image Header */}
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
              <BlogCardImage src={post.imageUrl} alt={post.title} />
          </div>

          <div className="space-y-3">
              {post.category && (
                <div className="inline-block px-3 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider">
                    {post.category}
                </div>
              )}
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-snug text-foreground">
                {post.title}
              </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-muted-foreground border-y border-border/50 py-3">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>By <span className="text-foreground font-bold">{post.author}</span></span>
              </div>
            )}
            {post.date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground/70" />
                <span>Published on <span className="text-foreground font-bold">{post.date}</span></span>
              </div>
            )}
          </div>
        </header>
        
        {/* Article Body Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          <BlogContentRenderer content={post.content} />
        </div>

      </article>

      {/* Related Articles Section (Reconstructed for Consistency) */}
      {otherPosts.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto pt-8 border-t border-slate-200/80 dark:border-slate-800 print-hidden">
              
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div className="text-left">
                      <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                        Related{' '}
                        <span className="relative inline-block">
                          <span className="relative z-10 text-blue-600">Articles</span>
                          <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                              <path d="M0,15 Q50,5 100,15" />
                            </svg>
                          </div>
                        </span>
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">
                        Explore more insights and guides from our academic team.
                      </p>
                  </div>

                  <Link href="/blog" className="relative inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors pb-1 group shrink-0">
                      View All <ArrowRight className="h-3.5 w-3.5" />
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {otherPosts.map((other) => (
                      <Link key={other.id || other.slug} href={`/blog/${other.slug}`} className="group block h-full">
                          <Card className="h-full rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col group-hover:-translate-y-1">
                              
                              {/* Image */}
                              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                  <BlogCardImage src={other.imageUrl} alt={other.title} />
                                  {other.category && (
                                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border border-primary/20 shadow-sm">
                                      {other.category}
                                    </div>
                                  )}
                              </div>

                              {/* Body */}
                              <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                                  <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                          {other.date && (
                                            <span className="flex items-center gap-1">
                                              <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                                              {other.date}
                                            </span>
                                          )}
                                      </div>
                                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                          {other.title}
                                      </h4>
                                  </div>

                                  <div className="pt-2 flex items-center justify-between border-t border-border/50 text-xs font-bold text-primary">
                                      <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                          Read Article
                                      </span>
                                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                  </div>
                              </div>
                          </Card>
                      </Link>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
