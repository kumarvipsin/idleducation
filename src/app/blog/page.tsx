'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getBlogPosts } from "@/app/actions/blog";
import type { TBlogPost } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";

export default function BlogPage() {
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const result = await getBlogPosts();
      if (result.success && result.data) {
        setPosts(result.data as TBlogPost[]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map(p => p.category)))], [posts]);
  
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, posts]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full rounded-2xl" />
        ))}
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-12 space-y-8 animate-fade-in-up">
             {/* Premium Search Bar - Responsive */}
             <div className="relative mx-auto max-w-5xl bg-white border border-gray-300 rounded-sm flex items-center h-12 md:h-16 shadow-none transition-all focus-within:border-primary/50">
                <div className="pl-3 md:pl-5 pr-2 md:pr-3">
                    <Search className="h-5 w-5 md:h-7 md:w-7 text-black" strokeWidth={2.5} />
                </div>
                <Input
                    type="text"
                    placeholder="Search the IDL Blog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-lg placeholder:text-gray-400 placeholder:font-light bg-transparent h-full"
                />
                <Separator orientation="vertical" className="h-8 md:h-10 mx-2 hidden sm:block bg-gray-300" />
                <Button variant="ghost" className="hidden sm:flex flex-col h-full rounded-none px-4 md:px-8 items-center justify-center gap-0.5 hover:bg-gray-50 transition-colors">
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-black" strokeWidth={1.5} />
                    <span className="text-[8px] md:text-[9px] font-bold text-gray-600 uppercase tracking-tight">Search blog</span>
                </Button>
            </div>

             {/* Minimal Category Navigation */}
             <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-8 whitespace-nowrap px-4 sm:px-0">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 pb-2 border-b-2 outline-none focus:outline-none",
                                selectedCategory === category 
                                ? 'text-primary border-primary' 
                                : 'text-muted-foreground/60 border-transparent hover:text-foreground hover:border-muted-foreground/20'
                            )}
                            >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {loading ? renderSkeleton() : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="overflow-hidden shadow-none border-none transition-all duration-300 animate-fade-in-up flex flex-col h-full group bg-card">
                    <div className="relative w-full aspect-video">
                    {post.imageUrl ? (
                        <GcsImage 
                            filePath={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <Image 
                            src="https://picsum.photos/seed/blog/800/600"
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute top-2 left-2 bg-background/80 text-foreground text-xs font-bold px-2 py-1 rounded-full">{post.category}</div>
                    </div>
                    <CardHeader>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors h-14">{post.title}</CardTitle>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                    </p>
                    </CardContent>
                    <div className="p-4 pt-0">
                        <span className="font-semibold text-primary text-sm flex items-center group-hover:underline">
                            Read More <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </div>
                </Card>
                </Link>
            ))}
            </div>
        )}

        {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-16 col-span-full">
                 <p className="text-muted-foreground font-bold">No blog posts found for your criteria.</p>
            </div>
        )}
    </div>
  );
}