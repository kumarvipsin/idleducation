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
        // Filter out the current post and show 3 recent ones
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

           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-muted-foreground py-2 border-b border-muted-foreground/5">
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

        {/* Explore More Section */}
        {otherPosts.length > 0 && (
            <div className="mt-20 space-y-10 print-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-primary pl-6">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-primary" /> Explore More
                        </h3>
                        <p className="text-xs text-muted-foreground font-bold mt-1">Discover more insights and strategies from our experts</p>
                    </div>
                    <Button asChild variant="ghost" className="w-fit text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5">
                        <Link href="/blog">View All Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {otherPosts.map((other) => (
                        <Link key={other.id} href={`/blog/${other.slug}`} className="group block h-full">
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
                                <div className="p-5 space-y-3 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest bg-primary/5 text-primary border-none">{other.category}</Badge>
                                    </div>
                                    <h4 className="font-bold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-grow">
                                        {other.title}
                                    </h4>
                                    <div className="flex items-center justify-between pt-2 border-t border-muted-foreground/5 mt-auto">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                                            <Calendar className="w-3 h-3 text-primary/40" />
                                            {other.date}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-primary/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </article>
    </div>
  );
}
