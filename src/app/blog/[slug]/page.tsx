'use client';

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Calendar, ArrowLeft, BookOpen, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts } from "@/app/actions/blog";
import type { TBlogPost } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
      // Disable Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }
      // Disable Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        toast({
          variant: "destructive",
          title: "Printing Restricted",
          description: "This document cannot be printed.",
        });
      }
      // Notify on PrintScreen (limited effectiveness but good deterrent)
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
      <div className="container mx-auto py-12 px-4 md:px-6 space-y-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
        <div className="container mx-auto py-24 text-center">
            <h1 className="text-2xl font-bold">Post not found.</h1>
            <Button asChild className="mt-4" variant="outline">
                <Link href="/blog">Back to Blog</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 select-none print:hidden">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print-hidden">
          <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]">
              <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Discover</Link>
          </Button>
      </div>
      
      <article className="max-w-4xl mx-auto" id="blog-printable-content">
        <header className="mb-12 space-y-8">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-none border-none bg-muted">
              {post.imageUrl ? (
                  <GcsImage 
                      filePath={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                  />
              ) : (
                  <Image 
                      src="https://picsum.photos/seed/article/1200/600"
                      alt={post.title}
                      fill
                      className="object-cover"
                  />
              )}
          </div>

          <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  {post.category}
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                {post.title}
              </h1>
          </div>

           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-muted-foreground py-2">
            <div className="flex items-center gap-2">
              <UserCircle className="h-3.5 w-3.5 text-primary" />
              <span>Written by <span className="text-foreground font-bold">{post.author}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Published on <span className="text-foreground font-bold">{post.date}</span></span>
            </div>
          </div>
        </header>
        
        <div className="prose dark:prose-invert max-w-none">
          <BlogContentRenderer content={post.content} />
        </div>

        <div className="mt-16 mb-12 text-center animate-fade-in-up">
            <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground/30 border-t border-muted-foreground/5 pt-8 inline-block px-12">
                Thank You
            </p>
        </div>

        {otherPosts.length > 0 && (
            <div className="mt-16 space-y-10 print-hidden">
                <div className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 bg-muted/30 dark:bg-primary/5 rounded-xl border border-primary/10 overflow-hidden transition-all duration-500 hover:shadow-xl hover:bg-muted/40">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110">
                        <BookOpen className="w-32 h-32 -rotate-12" />
                    </div>
                    
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="p-4 rounded-full bg-white dark:bg-gray-900 text-primary shadow-xl border border-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground leading-tight">
                                Explore More
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-tight opacity-80">
                                Discover more insights from our experts
                            </p>
                        </div>
                    </div>
                    
                    <Button asChild className="relative z-10 w-full md:w-auto h-12 px-8 rounded-xl font-semibold text-xs shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 group/btn">
                        <Link href="/blog" className="flex items-center justify-center gap-2">
                            View All Articles 
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                </div>
                
                <div className="relative">
                    <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {otherPosts.map((other) => (
                            <Link key={other.id} href={`/blog/${other.slug}`} className="group block flex-shrink-0 w-52 md:w-auto h-full">
                                <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 h-full bg-white dark:bg-card rounded-2xl flex flex-col">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <GcsImage 
                                            filePath={other.imageUrl} 
                                            alt={other.title} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-3 md:p-5 space-y-2 md:space-y-3 flex-grow flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[7px] md:text-[8px] font-black uppercase tracking-widest bg-primary/5 text-primary border-none">{other.category}</Badge>
                                        </div>
                                        <h4 className="font-bold text-xs md:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-grow">
                                            {other.title}
                                        </h4>
                                        <div className="flex items-center justify-between pt-2 border-t border-muted-foreground/5 mt-auto">
                                            <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                                                <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary/40" />
                                                {other.date}
                                            </div>
                                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-primary/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </article>
    </div>
  );
}
