
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';

const resources = [
  {
    image: "https://images.unsplash.com/photo-1543165262-32942a88c15a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZWZlcmVuY2UlMjBib29rc3xlbnwwfHx8fDE3NTYyODA1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "reference books",
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    href: "/resources/reference-books",
  },
  {
    image: "https://images.unsplash.com/photo-1596495578065-450763f0d420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcmVjZWl2aW5nJTIwYXdhcmR8ZW58MHx8fHwxNzU2MjY5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "student award",
    title: "NCERT Solutions",
    description: "Unlock academic excellence with Physics Wallah's NCERT Solutions which provides you step-by-step solutions",
    href: "/resources/ncert-solutions",
  },
  {
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMG5vdGVzfGVufDB8fHx8MTc1NjI4MDU3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "study notes",
    title: "Notes",
    description: "Use Physics Wallah's detailed study materials that simplify complex ideas into easily understandable language.",
    href: "/resources/notes",
  },
  {
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8ZWR1Y2F0aW9ufGVufDB8fHx8MTc1NjI3ODk4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "education classroom",
    title: "Previous Year Questions",
    description: "Practice with past exam papers to understand patterns and improve your time management for the actual exams.",
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
          <h2 className={`text-2xl md:text-3xl font-bold text-primary ${isVisible ? 'animate-fade-in-up' : ''}`}>Study Resources</h2>
          <p className={`text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
             <Link href={resource.href} key={index} className="block h-full group">
                <Card 
                  className={`relative overflow-hidden shadow-md h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-primary/10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-extrabold mb-2 text-primary">{resource.title}</h3>
                    <p className="text-sm mb-4 flex-grow text-foreground/80">{resource.description}</p>
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
