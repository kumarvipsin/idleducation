
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Briefcase, Facebook, Twitter, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function ExpertTeam() {
  const { t } = useLanguage();
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
      { threshold: 0.1 } // Trigger when 10% of the section is visible
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

  const teamMembers = [
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "/vijay.jpg",
        avatarHint: "Vijay Verma"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "/manish.jpg",
        avatarHint: "Manish Sharma"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "/vidhi.jpg",
        avatarHint: "Vidhi Sharma"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "/chandu.jpg",
        avatarHint: "Chandra Prakesh"
    },
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "/amod.jpg",
        avatarHint: "Amod Sharma"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "https://images.unsplash.com/flagged/photo-1559475555-b26777ed3ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYWxlJTIwdGVhY2hlcnxlbnwwfHx8fDE3NTYyMDAyODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: "male teacher"
    }
  ];

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className={`group text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-background ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-muted/30 pt-8 pb-4 flex justify-center items-center">
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 rounded-full bg-blue-500 transform transition-transform duration-300 group-hover:scale-105"></div>
                         <Image
                            src={member.avatar}
                            alt={member.name}
                            data-ai-hint={member.avatarHint}
                            width={160}
                            height={160}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[148px] h-[148px] object-cover rounded-full border-4 border-background shadow-md transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-foreground">{member.name}</h3>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">{member.designation}</p>
                    <p className="text-sm text-muted-foreground mt-4 h-16">
                        {member.experience}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                       <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="w-5 h-5"/></Link>
                       <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5"/></Link>
                       <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="w-5 h-5"/></Link>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </section>
  );
}
