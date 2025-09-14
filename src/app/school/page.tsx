
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

const class9Courses = [
    {
        title: "CLASS-IX",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-maths" }],
    },
    {
        title: "CLASS-IX",
        description: "Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-science" }],
    },
    {
        title: "CLASS-IX",
        description: "Social Studies",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-social" }],
    },
];

const topCourses = [
    {
        title: "CLASS-X",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-maths" }],
    },
    {
        title: "CLASS-X",
        description: "Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
    },
    {
        title: "CLASS-X",
        description: "Social Studies",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-social" }],
    },
];

const class5Courses = [
    {
        title: "CLASS-V",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-maths" }],
    },
    {
        title: "CLASS-V",
        description: "Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-science" }],
    },
    {
        title: "CLASS-V",
        description: "Social Studies",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-social" }],
    },
];

const class6Courses = [
    {
        title: "CLASS-VI",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-maths" }],
    },
    {
        title: "CLASS-VI",
        description: "Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-science" }],
    },
    {
        title: "CLASS-VI",
        description: "Social Studies",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-social" }],
    },
];

const class7Courses = [
    {
        title: "CLASS-VII",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-maths" }],
    },
    {
        title: "CLASS-VII",
        description: "Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-science" }],
    },
    {
        title: "CLASS-VII",
        description: "Social Studies",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-social" }],
    },
];

const class8Courses = [
    {
        title: "CLASS-VIII",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-maths" }],
    },
    {
        title: "CLASS-VIII",
        description: "Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-science" }],
    },
    {
        title: "CLASS-VIII",
        description: "Social Studies",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-social" }],
    },
];

const class11Courses = [
    {
        title: "CLASS XI",
        description: "Political Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-polsci" }],
    },
    {
        title: "CLASS XI",
        description: "History",
        language: "ENGLISH | HINDI",
        gradient: "from-red-500 to-rose-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-history" }],
    },
    {
        title: "CLASS XI",
        description: "Geography",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-geography" }],
    },
     {
        title: "CLASS XI",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-maths" }],
    },
    {
        title: "CLASS XI",
        description: "Physics",
        language: "ENGLISH | HINDI",
        gradient: "from-sky-500 to-cyan-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-physics" }],
    },
    {
        title: "CLASS XI",
        description: "Chemistry",
        language: "ENGLISH | HINDI",
        gradient: "from-purple-500 to-violet-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-chemistry" }],
    },
    {
        title: "CLASS XI",
        description: "Biology",
        language: "ENGLISH | HINDI",
        gradient: "from-lime-500 to-green-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-biology" }],
    },
    {
        title: "CLASS XI",
        description: "Economics",
        language: "ENGLISH | HINDI",
        gradient: "from-pink-500 to-rose-500",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-economics" }],
    },
]

const class12Courses = [
     {
        title: "CLASS XII",
        description: "Political Science",
        language: "ENGLISH | HINDI",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/political-science-details" }],
    },
    {
        title: "CLASS XII",
        description: "History",
        language: "ENGLISH | HINDI",
        gradient: "from-red-500 to-rose-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-history" }],
    },
    {
        title: "CLASS XII",
        description: "Geography",
        language: "ENGLISH | HINDI",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-geography" }],
    },
    {
        title: "CLASS XII",
        description: "Maths",
        language: "ENGLISH | HINDI",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-maths" }],
    },
    {
        title: "CLASS XII",
        description: "Physics",
        language: "ENGLISH | HINDI",
        gradient: "from-sky-500 to-cyan-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-physics" }],
    },
    {
        title: "CLASS XII",
        description: "Chemistry",
        language: "ENGLISH | HINDI",
        gradient: "from-purple-500 to-violet-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-chemistry" }],
    },
    {
        title: "CLASS XII",
        description: "Biology",
        language: "ENGLISH | HINDI",
        gradient: "from-lime-500 to-green-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-biology" }],
    },
    {
        title: "CLASS XII",
        description: "Economics",
        language: "ENGLISH | HINDI",
        gradient: "from-pink-500 to-rose-500",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-economics" }],
    },
]

const coursesByCategory: { [key: string]: any[] } = {
  'Class 5': class5Courses,
  'Class 6': class6Courses,
  'Class 7': class7Courses,
  'Class 8': class8Courses,
  'Class 9': class9Courses,
  'Class 10': topCourses,
  'Class 11': class11Courses,
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
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
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
            <Card key={index} className={`flex flex-col text-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${course.gradient}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-6 flex flex-col flex-grow items-start">
                    <div className="mb-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">{course.title}</Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 flex-grow">{course.description}</h3>
                    <p className="text-xs font-light opacity-80 mb-6">{course.language}</p>
                    <Button asChild variant="secondary" className="mt-auto bg-white/90 text-black hover:bg-white w-full">
                        <Link href={course.buttons[0].href}>
                            {course.buttons[0].text} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
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
