
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileQuestion, MessageSquarePlus, Building, Users } from "lucide-react";
import { useEffect, useState, useRef } from 'react';

const features = [
  {
    icon: <GraduationCap className="w-10 h-10 text-white" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
  },
  {
    icon: <BookUp className="w-10 h-10 text-white" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
  },
  {
    icon: <FileQuestion className="w-10 h-10 text-white" />,
    title: "1000+",
    subtitle: "Tests, sample papers & notes",
  },
  {
    icon: <Users className="w-10 h-10 text-white" />,
    title: "100+",
    subtitle: "Expert Teachers",
  },
  {
    icon: <MessageSquarePlus className="w-10 h-10 text-white" />,
    title: "24 x 7",
    subtitle: "Doubt solving sessions",
  },
  {
    icon: <Building className="w-10 h-10 text-white" />,
    title: "5 +",
    subtitle: "Offline centres",
  },
];

export function OurFeatures() {
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
    <section ref={sectionRef} className="w-full py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-12 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-primary ${isVisible ? 'animate-fade-in-up' : ''}`}>Our Features</h2>
          <p className={`text-muted-foreground mt-2 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            Discover the key features that make our platform the best choice for your learning needs.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 bg-gradient-to-br from-primary via-primary to-accent ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="p-4 bg-white/20 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-foreground/80">{feature.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
