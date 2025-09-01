
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, ArrowRight, Calendar, Users, MessageCircle, Tag, Tv, Zap, UserCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const classes = [
  'All Batches', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const topCourses = [
    {
        title: "UPSC Foundation Course (Online)",
        bgColor: "bg-[#f4a261]",
        textColor: "text-white",
        buttons: [
        { text: "ENGLISH", href: "#" },
        { text: "हिन्दी", href: "#" },
        ],
    },
    {
        title: "UPSC Civil Services: Prelims Test Series",
        bgColor: "bg-[#2a9d8f]",
        textColor: "text-white",
        buttons: [
        { text: "ENGLISH", href: "#" },
        { text: "हिन्दी", href: "#" },
        ],
    },
    {
        title: "Drishti Publications' books and magazines on Amazon",
        bgColor: "bg-[#8367c7]",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
    {
        title: "हिंदी साहित्य (वैकल्पिक): ऑनलाइन कोर्स",
        bgColor: "bg-[#f4a261]",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
    {
        title: "Advanced Mathematics Course",
        bgColor: "bg-teal-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    }
];

const coursesByCategory: { [key: string]: any[] } = {
  'All Batches': topCourses,
  'Class 6': [],
  'Class 7': [],
  'Class 8': [],
  'Class 9': [],
  'Class 10': [],
  'Class 11': [],
  'Class 12': [],
};

export default function SchoolPage() {
  const [activeClass, setActiveClass] = useState('All Batches');
  const courses = coursesByCategory[activeClass] || [];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      
       <div className="flex items-center overflow-x-auto space-x-4 mb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Button variant="outline" className="rounded-full whitespace-nowrap">Online</Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Offline</Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Power Batch</Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Newly Launched</Button>
      </div>
       <h2 className="text-2xl font-bold mb-6">{activeClass} Courses</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.length > 0 ? (
          courses.map((course, index) => {
            if (course.bgColor) {
                return (
                    <div key={index} className="p-1 h-full">
                        <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${course.bgColor}`}>
                            <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                            <h3 className={`text-xl font-semibold mb-8 min-h-[6rem] flex items-center ${course.textColor}`}>
                                {course.title}
                            </h3>
                            <div className="flex items-center justify-center gap-2 mt-auto">
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
                <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
                <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
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
