'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const blogPosts = [
  {
    slug: "power-of-personalized-learning",
    title: "The Power of Personalized Learning",
    category: "Education",
    excerpt: "Discover how tailoring education to individual student needs can unlock unprecedented potential and foster a lifelong love for learning.",
    author: "Dr. Jane Doe",
    date: "July 15, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student personalized learning"
  },
  {
    slug: "future-of-stem-education",
    title: "The Future of STEM: Preparing for Tomorrow",
    category: "STEM",
    excerpt: "STEM fields are evolving at a rapid pace. This post delves into how we can adapt our teaching methods to equip students with the skills needed.",
    author: "John Smith",
    date: "July 10, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "science technology"
  },
  {
    slug: "importance-of-arts-in-education",
    title: "Why Arts & Humanities are Crucial",
    category: "Humanities",
    excerpt: "While technology is important, the arts and humanities cultivate critical thinking, empathy, and creativity. Learn why a balanced education is key.",
    author: "Emily White",
    date: "July 5, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "art painting"
  },
  {
    slug: "mastering-exam-preparation",
    title: "Mastering Exam Preparation",
    category: "Exams",
    excerpt: "Exams can be stressful, but they don't have to be. We share proven strategies to help students study smarter and manage their time effectively.",
    author: "Amod Sharma",
    date: "July 1, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student studying"
  },
  {
    slug: "jee-main-2026-admit-cards",
    title: "JEE Main 2026 Session 1 Admit Cards Released",
    category: "Exams",
    excerpt: "Aspirants can Download the Admit Cards from jeemain.nta.nic.in...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student exam preparation",
    author: "IDL Team",
    date: "July 20, 2024",
  },
  {
    slug: "know-which-college-forms-to-fill-after-jee-main-2026",
    title: "Know Which College Forms to Fill After JEE Main 2026",
    category: "Exams",
    excerpt: "Here's a Complete Guide About India's Premium Private, Researc...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student thinking future",
    author: "IDL Team",
    date: "July 19, 2024",
  },
  {
    slug: "shepherds-son-from-rajasthan-to-become-villages-first-doctor",
    title: "A Shepherd's Son from ALLEN Kota to Become Village's First Doctor",
    category: "Stories",
    excerpt: "Gordhanram from Barmer's Beriwala Tala village gets...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "father son",
    author: "IDL Team",
    date: "July 18, 2024",
  },
  {
    slug: "nta-revises-jee-main-2026-session-1-exam-schedule",
    title: "NTA Revises JEE Main 2026 Session 1 Exam Schedule",
    category: "Exams",
    excerpt: "Check the Revised Exam Dates Here The National Testing Agenc...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student exam schedule",
    author: "IDL Team",
    date: "July 17, 2024",
  }
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(blogPosts.map(p => p.category)))], []);
  
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
                IDL <span className="text-orange-500">Blog</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-semibold">
                Insights, tips, and stories from the world of education.
            </p>
        </div>

        <div className="mb-8 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative mx-auto max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full rounded-full h-10"
                />
            </div>
            <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(`py-2 px-4 text-sm font-medium transition-colors border rounded-full`,
                                selectedCategory === category 
                                ? 'border-primary text-primary bg-primary/10' 
                                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                            >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up flex flex-col h-full group bg-card">
                <div className="relative w-full aspect-video">
                  <Image 
                    src={post.imageUrl}
                    alt={post.title}
                    data-ai-hint={post.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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

        {filteredPosts.length === 0 && (
            <div className="text-center py-16 col-span-full">
                 <p className="text-muted-foreground">No blog posts found for your criteria.</p>
            </div>
        )}
    </div>
  );
}
