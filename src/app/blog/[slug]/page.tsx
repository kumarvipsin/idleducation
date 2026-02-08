
'use client';

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug } from "@/app/actions/blog";
import type { TBlogPost } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";

export default function BlogPostPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [post, setPost] = useState<TBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const result = await getBlogPostBySlug(params.slug);
      if (result.success && result.data) {
        setPost(result.data as TBlogPost);
      }
      setLoading(false);
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 space-y-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-64 w-full" />
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
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
          <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]">
              <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Discover</Link>
          </Button>
      </div>
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
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
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      {post.category}
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-lg">
                    {post.title}
                  </h1>
               </div>
          </div>
           <div className="mt-8 flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 bg-muted/20 p-4 rounded-xl border border-muted-foreground/5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>WRITTEN BY <span className="text-foreground">{post.author}</span></span>
            </div>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>PUBLISHED ON <span className="text-foreground">{post.date}</span></span>
            </div>
          </div>
        </header>
        <div className="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:font-medium prose-p:leading-relaxed text-foreground/80">
          <div className="whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
