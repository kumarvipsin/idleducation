
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Book, FileText, BookCheck, StickyNote, Library, PencilRuler, NotebookText, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';

const resources = [
  {
    icon: <Library className="w-8 h-8 text-primary" />,
    title: "Reference Books",
    description: "Explore a curated collection of reference books offering in-depth knowledge and insights to supplement your learning.",
    href: "/resources/reference-books",
    color: "bg-blue-100 dark:bg-blue-900/20",
    shadow: "shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30",
  },
  {
    icon: <NotebookText className="w-8 h-8 text-green-500" />,
    title: "NCERT Solutions",
    description: "Access detailed, step-by-step solutions for all your NCERT textbook questions, making complex concepts easier to understand.",
    href: "/resources/ncert-solutions",
     color: "bg-green-100 dark:bg-green-900/20",
     shadow: "shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30",
  },
  {
    icon: <PencilRuler className="w-8 h-8 text-yellow-500" />,
    title: "Notes",
    description: "Find concise and well-structured notes designed for quick revision, helping you grasp key topics effectively before exams.",
    href: "/resources/notes",
     color: "bg-yellow-100 dark:bg-yellow-900/20",
     shadow: "shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30",
  },
  {
    icon: <History className="w-8 h-8 text-red-500" />,
    title: "Previous Year Questions",
    description: "Sharpen your skills and get exam-ready by practicing with a vast repository of previous year question papers.",
    href: "/resources/previous-year-questions",
     color: "bg-red-100 dark:bg-red-900/20",
     shadow: "shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30",
  },
]

export function StudyResources() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-8 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-10 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold ${isVisible ? 'animate-fade-in-up' : ''}`}>
            <span className="text-black dark:text-white">Study</span> <span style={{ color: '#adb5bd' }}>Resources</span>
          </h2>
          <p className={`text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
             <Link href={resource.href} key={index} className="block h-full group">
                <Card 
                  className={`overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 bg-card p-0 flex flex-col ${resource.shadow} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                    <div className={`p-6 flex items-center justify-center ${resource.color}`}>
                        {resource.icon}
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow" style={{ backgroundColor: '#f8f9fa' }}>
                        <h3 className="text-lg font-bold mb-2 text-foreground">{resource.title}</h3>
                        <p className="text-sm mb-4 flex-grow text-muted-foreground">{resource.description}</p>
                        <div className="mt-auto flex justify-start items-center font-semibold text-primary group-hover:underline underline-offset-4">
                            <span className="text-sm">Explore</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
