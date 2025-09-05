
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
  'All Batches', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const topCourses = [
    {
        title: "Maths",
        description: "Ncert Besd",
        language: "English Medium | Hindi Medium",
        bgColor: "bg-sky-500",
        textColor: "text-white",
        buttons: [
        { text: "ENGLISH", href: "#" },
        { text: "हिन्दी", href: "#" },
        ],
    },
    {
        title: "Science",
        description: "Ncert Besd",
        language: "English Medium | Hindi Medium",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [
        { text: "ENGLISH", href: "#" },
        { text: "हिन्दी", href: "#" },
        ],
    },
    {
        title: "Maths",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
    {
        title: "Science",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-indigo-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
];

const coursesByCategory: { [key: string]: any[] } = {
  'Class 5': topCourses,
  'Class 6': topCourses,
  'Class 7': topCourses,
  'Class 8': topCourses,
  'Class 9': topCourses,
  'Class 10': topCourses,
  'Class 11': topCourses,
  'Class 12': topCourses,
};
coursesByCategory['All Batches'] = Object.values(coursesByCategory).flat();

function SchoolPageContent() {
  const searchParams = useSearchParams();
  const classParam = searchParams.get('class');
  const [activeClass, setActiveClass] = useState('All Batches');
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
      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setActiveClass(className)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium rounded-full transition-colors
                ${activeClass === className 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>
      
       {activeClass !== 'All Batches' && (
        <section key={`teacher-section-${animationKey}`} className="w-full pb-12 md:pb-24 animate-fade-in-up">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Your <span className="text-red-600">Online</span> Teacher</h2>
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
        {courses.length > 0 ? (
          courses.map((course, index) => {
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
                                {course.buttons.map((button: any) => (
                                <Button key={button.text} asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                                    <Link href={button.href}>{button.text}</Link>
                                </Button>
                                ))}
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
            return (
                <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow group" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="relative">
                        <div className={`absolute top-0 left-0 text-white text-xs font-bold uppercase px-3 py-1 ${course.modeColor} rounded-br-lg z-10`}>
                            {course.mode}
                        </div>
                        <Image
                            src={course.image}
                            alt={course.title}
                            data-ai-hint={course.imageHint}
                            width={600}
                            height={400}
                            className="w-full object-cover aspect-video"
                        />
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold flex-grow truncate">{course.title}</h3>
                            {course.tags.map((tag: string) => (
                                <Badge key={tag} variant={tag === 'NEW' ? 'default' : 'secondary'} className="whitespace-nowrap">{tag}</Badge>
                            ))}
                            <MessageCircle className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Users className="w-4 h-4" />
                            <p className="truncate">{course.target}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Calendar className="w-4 h-4" />
                            <p className="truncate">Starts on {course.startDate} <span className="mx-1">·</span> Ends on {course.endDate}</p>
                        </div>
                        
                        {course.features && course.features.text && (
                        <div className="bg-gray-800 text-white rounded-md p-2 flex justify-between items-center text-sm mb-4">
                            <span>{course.features.text}</span>
                            <span className="bg-yellow-500 text-gray-900 font-bold text-xs px-2 py-0.5 rounded-sm">{course.features.badge}</span>
                        </div>
                        )}


                        <div className="mt-auto pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="text-2xl font-bold">₹{course.price}</p>
                                    {course.originalPrice && <p className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</p>}
                                </div>
                                {course.discount && (
                                    <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-xs">
                                        <Tag className="w-3 h-3"/>
                                        <span>{course.discount}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {course.originalPrice ? '(FOR FULL BATCH)' : '(BOOK A SEAT)'}
                            </p>
                        </div>
                    </CardContent>
                    <div className="grid grid-cols-2 gap-0 mt-auto">
                        <Button variant="outline" className="rounded-none rounded-bl-lg">Explore</Button>
                        <Button className="rounded-none rounded-br-lg">Buy Now</Button>
                    </div>
                </Card>
            );
          })
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
