'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, Calendar, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    slug: "power-of-personalized-learning",
    title: "The Power of Personalized Learning in Today's Education",
    excerpt: "Discover how tailoring education to individual student needs can unlock unprecedented potential and foster a lifelong love for learning. We explore the tools and techniques making it a reality. In this post, we'll dive deep into adaptive learning technologies, the role of AI in creating customized study plans, and how data analytics can provide insights into a student's progress. We also discuss the challenges and benefits of implementing personalized learning in traditional classroom settings, and share success stories from schools that have embraced this innovative approach. Learn how this educational revolution is preparing students not just for exams, but for a lifetime of curiosity and growth.",
    author: "Dr. Jane Doe",
    date: "July 15, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student personalized learning"
  },
  {
    slug: "future-of-stem-education",
    title: "The Future of STEM: Preparing Students for Tomorrow's Careers",
    excerpt: "STEM fields are evolving at a rapid pace. This post delves into how we can adapt our teaching methods to equip students with the skills needed for the jobs of the future. We'll examine the importance of interdisciplinary projects, hands-on experiments, and coding literacy from an early age. Furthermore, we explore the integration of robotics, artificial intelligence, and data science into the K-12 curriculum. Find out how educators can inspire the next generation of innovators and problem-solvers who will tackle the world's most pressing challenges.",
    author: "John Smith",
    date: "July 10, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "science technology"
  },
  {
    slug: "importance-of-arts-in-education",
    title: "Why Arts and Humanities are Crucial in a Tech-Driven World",
    excerpt: "While technology is important, the arts and humanities cultivate critical thinking, empathy, and creativity. Learn why a balanced education is more important than ever. This article makes a case for the arts by showing how they improve communication skills, foster cultural understanding, and encourage out-of-the-box thinking. We'll share practical tips for integrating arts into any subject, from history to mathematics, and showcase how students who engage with humanities are often better equipped to navigate complex social and ethical issues in their personal and professional lives.",
    author: "Emily White",
    date: "July 5, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "art painting"
  },
    {
    slug: "mastering-exam-preparation",
    title: "Mastering Exam Preparation: Tips for Less Stress and More Success",
    excerpt: "Exams can be stressful, but they don't have to be. We share proven strategies to help students study smarter, manage their time effectively, and approach exams with confidence. This guide covers everything from creating a realistic study schedule to using active recall techniques like flashcards and practice tests. We also address the importance of a healthy lifestyle, including proper sleep, nutrition, and exercise, in boosting cognitive performance. Learn how to conquer exam anxiety and walk into the test hall feeling prepared and self-assured.",
    author: "Amod Sharma",
    date: "July 1, 2024",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student studying"
  },
  {
    slug: "jee-main-2026-admit-cards",
    title: "JEE Main 2026 Session 1 Admit Cards Released",
    excerpt: "Aspirants can Download the Admit Cards from jeemain.nta.nic.in...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student exam preparation",
    author: "IDL Team",
    date: "July 20, 2024",
  },
  {
    slug: "know-which-college-forms-to-fill-after-jee-main-2026",
    title: "Know Which College Forms to Fill After JEE Main 2026",
    excerpt: "Here's a Complete Guide About India's Premium Private, Researc...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student thinking future",
    author: "IDL Team",
    date: "July 19, 2024",
  },
  {
    slug: "shepherds-son-from-rajasthan-to-become-villages-first-doctor",
    title: "A Shepherd's Son from ALLEN Kota to Become Village's First...",
    excerpt: "Gordhanram from Barmer's Beriwala Tala village gets...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "father son",
    author: "IDL Team",
    date: "July 18, 2024",
  },
  {
    slug: "nta-revises-jee-main-2026-session-1-exam-schedule",
    title: "NTA Revises JEE Main 2026 Session 1 Exam Schedule",
    excerpt: "Check the Revised Exam Dates Here The National Testing Agenc...",
    imageUrl: "https://myexam.allen.in/wp-content/uploads/2026/01/Know-Which-College-Forms-to-Fill-After-JEE-Main-2026.webp",
    imageHint: "student exam schedule",
    author: "IDL Team",
    date: "July 17, 2024",
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-[10%]">
        <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                IDL Blog
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
                <CardContent className="flex-grow h-32 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <p className="text-sm text-muted-foreground">
                      {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
    </div>
  );
}
