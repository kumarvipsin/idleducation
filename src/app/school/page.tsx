
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, ArrowRight, Calendar, Users, MessageCircle, Tag, Tv, Zap, UserCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';
import { TeacherCard } from '@/components/landing/teacher-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";


const classes = [
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const class6Courses = [
    {
        title: "CLASS-VI",
        description: "Science",
        language: "ENGLISH | HINDI",
        bgColor: "bg-indigo-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "Maths",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "Social Studies",
        description: "Ncert Besd",
        language: "English Medium | Hindi Medium",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
];

const topCourses = [
    {
        title: "Science",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-indigo-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "Maths",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "Social Studies",
        description: "Ncert Besd",
        language: "English Medium | Hindi Medium",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
];

const class5Courses = [
    {
        title: "CLASS-V",
        description: "SCIENCE",
        language: "ENGLISH | HINDI",
        bgColor: "bg-indigo-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "CLASS-V",
        description: "MATHS",
        language: "ENGLISH | HINDI",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "CLASS-V",
        description: "SOCIAL STUDIES",
        language: "ENGLISH | HINDI",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
];


const class12Courses = [
    {
        title: "Political Science",
        description: "",
        language: "Book-1 | Book-2",
        bgColor: "bg-indigo-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "History",
        description: "",
        language: "Book-1 | Book-2 | Book-3",
        bgColor: "bg-red-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "Geography",
        description: "",
        language: "Book-1 | Book-2",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
]

const coursesByCategory: { [key: string]: any[] } = {
  'Class 5': class5Courses,
  'Class 6': class6Courses,
  'Class 7': topCourses,
  'Class 8': topCourses,
  'Class 9': topCourses,
  'Class 10': topCourses,
  'Class 11': topCourses,
  'Class 12': class12Courses,
};

function SchoolPageContent() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [activeClass, setActiveClass] = useState('Class 5');
  const [animationKey, setAnimationKey] = useState(0);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeClass]);

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

  useEffect(() => {
    if (classParam && classes.includes(classParam)) {
      setActiveClass(classParam);
    }
  }, [classParam]);

  const courses = coursesByCategory[activeClass] || [];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
       <section className="mb-8">
        <Card className="overflow-hidden shadow-lg">
          <div className="relative w-full aspect-[16/4]">
            <Image
              src="/result.jpg"
              alt="Our Toppers"
              data-ai-hint="student success"
              fill
              className="object-cover"
            />
          </div>
        </Card>
      </section>

      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setActiveClass(className)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                ${activeClass === className 
                  ? 'border-primary text-primary bg-primary/10 rounded-md' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>
      
       {activeClass && (
        <section key={animationKey} className="w-full pb-12 md:pb-24 animate-fade-in-up">
            <div className="container mx-auto px-4 md:px-6">
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

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className="p-1 h-full" style={{ animationDelay: `${index * 0.05}s` }}>
                <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${course.bgColor}`}>
                    <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                    <h3 className={`text-2xl font-semibold mb-2 ${course.textColor}`}>
                        {course.title}
                    </h3>
                      {course.description && <p className={`text-sm mb-2 ${course.textColor}`}>{course.description}</p>}
                      {course.language && <p className={`text-xs ${course.textColor}`}>{course.language}</p>}
                    <div className="flex items-center justify-center gap-2 mt-auto pt-4">
                        <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                            <Link href={course.buttons[0].href}>{course.buttons[0].text}</Link>
                        </Button>
                    </div>
                    </CardContent>
                </Card>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-4 text-center">
             <Card className="p-8">
                <p className="text-muted-foreground">No courses available for this class yet. Please check back later!</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchoolPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchoolPageContent />
    </Suspense>
  );
}
