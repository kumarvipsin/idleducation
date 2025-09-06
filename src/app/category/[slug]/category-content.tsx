
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { TeacherCard } from "@/components/landing/teacher-card";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";

export function CategoryContent({ data, slug, subCategories }: { data: any, slug: string, subCategories: string[] }) {
  const { t } = useLanguage();
  const [activeSubCategory, setActiveSubCategory] = useState(subCategories[0] || '');
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
        <div className="border-b mb-8">
            <div className="flex items-center justify-between overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center space-x-8">
                    {subCategories.map((sub, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveSubCategory(sub)}
                            className={`whitespace-nowrap pb-2 border-b-2 font-medium ${activeSubCategory === sub ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                            {sub}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        {slug !== 'nios' && (
          <section key={`teacher-section-${animationKey}`} className="w-full pb-12 md:pb-24 animate-fade-in-up">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Know Your <span className="text-red-600">Teachers</span></h2>
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

        <div key={`course-section-${animationKey}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up">
          {data.courses?.map((course: any, index: number) => {
            if (course.bgColor) {
                return (
                    <div key={index} className="p-1 h-full" style={{ animationDelay: `${index * 0.05}s` }}>
                        <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${course.bgColor}`}>
                            <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                            <h3 className={`text-xl font-semibold mb-2 ${course.textColor}`}>
                                {course.title}
                            </h3>
                             {course.description && <p className={`text-sm mb-2 ${course.textColor}`}>{course.description}</p>}
                             {course.language && <p className={`text-xs ${course.textColor}`}>{course.language}</p>}
                            <div className="flex items-center justify-center gap-2 mt-auto pt-4">
                                <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                                    <Link href="#">VIEW MORE</Link>
                                </Button>
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            }
            if (course.title && course.description) {
              return (
                <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardHeader>
                      <BookOpen className="w-10 h-10 text-primary mb-2" />
                      <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{course.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href="#">
                        View Course <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            }
          })}
        </div>
      </div>
  </div>
  );
}
