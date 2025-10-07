
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    slug: "power-of-personalized-learning",
    title: "The Power of Personalized Learning in Today's Education",
    excerpt: "Discover how tailoring education to individual student needs can unlock unprecedented potential and foster a lifelong love for learning. We explore the tools and techniques making it a reality.",
    author: "Dr. Jane Doe",
    date: "July 15, 2024",
    imageUrl: "https://picsum.photos/seed/blog1/800/600",
    imageHint: "student personalized learning"
  },
  {
    slug: "future-of-stem-education",
    title: "The Future of STEM: Preparing Students for Tomorrow's Careers",
    excerpt: "STEM fields are evolving at a rapid pace. This post delves into how we can adapt our teaching methods to equip students with the skills needed for the jobs of the future.",
    author: "John Smith",
    date: "July 10, 2024",
    imageUrl: "https://picsum.photos/seed/blog2/800/600",
    imageHint: "science technology"
  },
  {
    slug: "importance-of-arts-in-education",
    title: "Why Arts and Humanities are Crucial in a Tech-Driven World",
    excerpt: "While technology is important, the arts and humanities cultivate critical thinking, empathy, and creativity. Learn why a balanced education is more important than ever.",
    author: "Emily White",
    date: "July 5, 2024",
    imageUrl: "https://picsum.photos/seed/blog3/800/600",
    imageHint: "art painting"
  },
    {
    slug: "mastering-exam-preparation",
    title: "Mastering Exam Preparation: Tips for Less Stress and More Success",
    excerpt: "Exams can be stressful, but they don't have to be. We share proven strategies to help students study smarter, manage their time effectively, and approach exams with confidence.",
    author: "Amod Sharma",
    date: "July 1, 2024",
    imageUrl: "https://picsum.photos/seed/blog4/800/600",
    imageHint: "student studying"
  },
];

export default function BlogPage() {
  return (
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon">
              <Home className="h-6 w-6 text-primary" />
              <span className="sr-only">Home</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 px-4 md:px-[10%]">
          <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                  IDL Education Blog
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Insights, tips, and stories from the world of education.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up flex flex-col h-full group">
                  <div className="relative w-full aspect-video">
                    <Image 
                      src={post.imageUrl}
                      alt={post.title}
                      data-ai-hint={post.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl h-16">{post.title}</CardTitle>
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
                  <CardContent className="flex-grow h-32 overflow-y-auto">
                    <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
      </div>
    </div>
  );
}
