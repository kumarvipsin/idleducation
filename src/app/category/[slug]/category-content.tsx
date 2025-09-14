
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, BookCopy, FileText, BookCheck as BookCheckIcon, ClipboardEdit } from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { TeacherCard } from "@/components/landing/teacher-card";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";

const resourceLinks = [
  { href: '/resources/reference-books', label: 'Reference Books', icon: <BookCopy /> },
  { href: '/resources/previous-year-questions', label: 'Previous Year Question Paper', icon: <FileText /> },
  { href: '/resources/ncert-solutions', label: 'NCERT Solutions', icon: <BookCheckIcon /> },
  { href: '/resources/notes', label: 'Notes', icon: <ClipboardEdit /> },
];

export function CategoryContent({ data, slug, subCategories }: { data: any, slug: string, subCategories: string[] }) {
  const { t } = useLanguage();
  const [activeSubCategory, setActiveSubCategory] = useState(subCategories && subCategories.length > 0 ? subCategories[0] : '');
  const [animationKey, setAnimationKey] = useState(0);
  const isMobile = useIsMobile();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeSubCategory]);
  
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
        avatarHint: "CHANDRA PRAKASH"
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
        avatar: "/vikash.jpg",
        avatarHint: "male teacher"
    }
  ];

  return (
    <div>
      <section className="bg-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{data.name} Online Coaching, Complete Course for {data.name} Preparation</h1>
              <p className="text-base md:text-lg text-foreground/80">
                  {data.name} Online Coaching 2025 provides study material for the required sections. Students can solve mock tests and evaluate their performance in our {data.name} Online Coaching Class.
              </p>
          </div>
      </section>
      <div className="container mx-auto py-12 px-4 md:px-6">
        
        {slug !== 'nios' && (
          <section key={animationKey} className="w-full pb-12 md:pb-24 animate-fade-in-up">
            <div className="container mx-auto px-4 md:px-[10%]">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="text-black dark:text-white">Know Your </span>
                  <span style={{ color: '#ced4da' }}>Teachers</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Our dedicated team of educators is here to guide you on your learning journey.
                </p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent className="-ml-4">
                  {teamMembers.map((member, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <TeacherCard {...member} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        )}

        <section className="w-full pb-12 md:pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="container mx-auto px-4 md:px-[10%]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                {`${data.name} Online Coaching 2025-2026`}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Everything you need to know about the curriculum, exams, and resources.
              </p>
            </div>
            <Card className="shadow-lg">
                <CardContent className="p-6 space-y-8">
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Syllabus & Study Strategy</h3>
                        <p className="text-muted-foreground">Detailed syllabus and study strategies for {data.name} will be updated here soon. Our curriculum is designed to cover all topics comprehensively, ensuring you are well-prepared for your exams. We focus on building a strong conceptual foundation and provide ample practice through assignments and tests.</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Exam Pattern & Key Dates</h3>
                        <p className="text-muted-foreground">Information about the exam pattern, marking scheme, and important dates for {data.name} will be made available here. Stay tuned for updates on registration deadlines, admit card availability, and exam schedules.</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-bold text-xl mb-4 text-primary border-b pb-2">Essential Resources</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {resourceLinks.map(link => (
                                <Button asChild variant="outline" key={link.href} className="justify-start">
                                    <Link href={link.href}>
                                        {link.icon}
                                        <span className="ml-2">{link.label}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
        </section>

      </div>
  </div>
  );
}
