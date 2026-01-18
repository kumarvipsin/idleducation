
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, Calendar, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';

const blogPosts = [
  {
    slug: "power-of-personalized-learning",
    title: "The Power of Personalized Learning in Today's Education",
    excerpt: "Discover how tailoring education to individual student needs can unlock unprecedented potential and foster a lifelong love for learning. We explore the tools and techniques making it a reality. In this post, we'll dive deep into adaptive learning technologies, the role of AI in creating customized study plans, and how data analytics can provide insights into a student's progress. We also discuss the challenges and benefits of implementing personalized learning in traditional classroom settings, and share success stories from schools that have embraced this innovative approach. Learn how this educational revolution is preparing students not just for exams, but for a lifetime of curiosity and growth.",
    author: "Dr. Jane Doe",
    date: "July 15, 2024",
    imageUrl: "https://picsum.photos/seed/blog1/1200/600",
    imageHint: "student personalized learning"
  },
  {
    slug: "future-of-stem-education",
    title: "The Future of STEM: Preparing Students for Tomorrow's Careers",
    excerpt: "STEM fields are evolving at a rapid pace. This post delves into how we can adapt our teaching methods to equip students with the skills needed for the jobs of the future. We'll examine the importance of interdisciplinary projects, hands-on experiments, and coding literacy from an early age. Furthermore, we explore the integration of robotics, artificial intelligence, and data science into the K-12 curriculum. Find out how educators can inspire the next generation of innovators and problem-solvers who will tackle the world's most pressing challenges.",
    author: "John Smith",
    date: "July 10, 2024",
    imageUrl: "https://picsum.photos/seed/blog2/1200/600",
    imageHint: "science technology"
  },
  {
    slug: "importance-of-arts-in-education",
    title: "Why Arts and Humanities are Crucial in a Tech-Driven World",
    excerpt: "While technology is important, the arts and humanities cultivate critical thinking, empathy, and creativity. Learn why a balanced education is more important than ever. This article makes a case for the arts by showing how they improve communication skills, foster cultural understanding, and encourage out-of-the-box thinking. We'll share practical tips for integrating arts into any subject, from history to mathematics, and showcase how students who engage with humanities are often better equipped to navigate complex social and ethical issues in their personal and professional lives.",
    author: "Emily White",
    date: "July 5, 2024",
    imageUrl: "https://picsum.photos/seed/blog3/1200/600",
    imageHint: "art painting"
  },
  {
    slug: "mastering-exam-preparation",
    title: "Mastering Exam Preparation: Tips for Less Stress and More Success",
    excerpt: "Exams can be stressful, but they don't have to be. We share proven strategies to help students study smarter, manage their time effectively, and approach exams with confidence. This guide covers everything from creating a realistic study schedule to using active recall techniques like flashcards and practice tests. We also address the importance of a healthy lifestyle, including proper sleep, nutrition, and exercise, in boosting cognitive performance. Learn how to conquer exam anxiety and walk into the test hall feeling prepared and self-assured.",
    author: "Amod Sharma",
    date: "July 1, 2024",
    imageUrl: "https://picsum.photos/seed/blog4/1200/600",
    imageHint: "student studying"
  },
   {
    slug: "jee-main-2026-admit-cards",
    title: "JEE Main 2026 Session 1 Admit Cards Released",
    excerpt: "Aspirants can Download the Admit Cards from jeemain.nta.nic.in...",
    imageUrl: "https://picsum.photos/seed/blog-jee1/1200/600",
    imageHint: "student exam preparation",
    author: "IDL Team",
    date: "July 20, 2024",
  },
  {
    slug: "know-which-college-forms-to-fill-after-jee-main-2026",
    title: "Know Which College Forms to Fill After JEE Main 2026",
    excerpt: "Here's a Complete Guide About India's Premium Private, Researc...",
    imageUrl: "https://picsum.photos/seed/blog-jee2/1200/600",
    imageHint: "student thinking future",
    author: "IDL Team",
    date: "July 19, 2024",
  },
  {
    slug: "shepherds-son-from-rajasthan-to-become-villages-first-doctor",
    title: "A Shepherd's Son from ALLEN Kota to Become Village's First...",
    excerpt: "Gordhanram from Barmer's Beriwala Tala village gets...",
    imageUrl: "https://picsum.photos/seed/blog-doctor/1200/600",
    imageHint: "father son",
    author: "IDL Team",
    date: "July 18, 2024",
  },
  {
    slug: "nta-revises-jee-main-2026-session-1-exam-schedule",
    title: "NTA Revises JEE Main 2026 Session 1 Exam Schedule",
    excerpt: "Check the Revised Exam Dates Here The National Testing Agenc...",
    imageUrl: "https://picsum.photos/seed/blog-jee3/1200/600",
    imageHint: "student exam schedule",
    author: "IDL Team",
    date: "July 17, 2024",
  }
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-gray-900 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="outline" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 px-4 md:px-[10%]">
        <article>
          <header className="mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
                <Image 
                    src={post.imageUrl}
                    alt={post.title}
                    data-ai-hint={post.imageHint}
                    fill
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
                      {post.title}
                    </h1>
                 </div>
            </div>
             <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
            </div>
          </header>
          <div className="prose dark:prose-invert max-w-none">
            <p>{post.excerpt}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
