'use client';

import { Card } from "@/components/ui/card";
import { ArrowRight, Book, FileText, BookCheck, StickyNote } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';

const resources = [
  {
    icon: <Book className="w-8 h-8 text-primary" />,
    title: "Reference Books",
    description: "Curated books offering in-depth knowledge to supplement your learning.",
    href: "/resources/reference-books",
  },
  {
    icon: <BookCheck className="w-8 h-8 text-primary" />,
    title: "NCERT Solutions",
    description: "Detailed, step-by-step solutions for all NCERT textbook questions.",
    href: "/resources/ncert-solutions",
  },
  {
    icon: <StickyNote className="w-8 h-8 text-primary" />,
    title: "Notes",
    description: "Concise and organized study notes for quick revision and better understanding.",
    href: "/resources/notes",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Previous Year Questions",
    description: "Practice with past exam papers to master question patterns and time management.",
    href: "/resources/previous-year-questions",
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
                  className={`relative overflow-hidden shadow-md h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white text-foreground p-6 flex flex-col ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                    <div className="mb-4">
                        {resource.icon}
                    </div>
                    <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-bold mb-2 text-primary">{resource.title}</h3>
                        <p className={`text-sm mb-4 flex-grow text-muted-foreground`}>{resource.description}</p>
                        <div className="mt-auto flex justify-start items-center font-semibold text-primary group-hover:underline underline-offset-4">
                            <span className="text-sm">Explore</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
