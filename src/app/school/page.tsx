
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

const coursesByCategory: { [key: string]: any[] } = {
  'Class 6': [
    {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "empty classroom",
      title: "Foundation Batch for Class 6",
      tags: ["NEW", "English"],
      target: "For Class 6 Students (All Boards)",
      startDate: "15 Jun, 2025",
      endDate: "28 Feb, 2026",
      price: "2,500",
      originalPrice: "3,000",
      discount: "17% applied",
      features: { text: "Full Year Curriculum", badge: "PRO" },
    },
  ],
  'Class 7': [
     {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "student with books",
      title: "Achiever Batch for Class 7",
      tags: ["POPULAR", "Hinglish"],
      target: "For Class 7 CBSE/ICSE",
      startDate: "20 Jun, 2025",
      endDate: "10 Mar, 2026",
      price: "2,800",
      originalPrice: "3,200",
      discount: "12% applied",
      features: { text: "Weekly Tests Included", badge: "PRO" },
    },
  ],
  'Class 8': [
        {
          mode: "ONLINE",
          modeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "teacher with students",
          title: "Umang 2.0 2026 (Class 8th)",
          tags: ["NEW", "Hinglish"],
          target: "Targeted Batch for Class 8th",
          startDate: "7 Jul, 2025",
          endDate: "31 Mar, 2026",
          price: "3,000",
          originalPrice: "3,500",
          discount: "14% applied",
          features: { text: "New Batch Plans included", badge: "PRO" },
        },
        {
          mode: "ONLINE",
          modeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "students learning",
          title: "RISER 2026 (Class 8th)",
          tags: ["NEW", "Hinglish"],
          target: "For Class 8th ICSE Students",
          startDate: "12 May, 2025",
          endDate: "31 Mar, 2026",
          price: "4,300",
          originalPrice: "4,900",
          discount: "12% applied",
          features: { text: "Premium Features Included", badge: "INFINITY" },
        },
  ],
  'Class 9': [
    {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "person coding",
      title: "Catalyst Batch for Class 9",
      tags: ["NEW", "Hinglish"],
      target: "For Class 9 Board Exams",
      startDate: "10 May, 2025",
      endDate: "20 Mar, 2026",
      price: "3,200",
      originalPrice: "4,000",
      discount: "20% applied",
      features: { text: "DPPs & Video Solutions", badge: "PRO" },
    },
  ],
  'Class 10': [
    {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1491841550275-5b462bf483cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "student studying",
      title: "Apex Batch for Class 10 Boards",
      tags: ["BESTSELLER", "Hinglish"],
      target: "Targeted Batch for Class 10",
      startDate: "1 Apr, 2025",
      endDate: "15 Feb, 2026",
      price: "3,500",
      originalPrice: "4,500",
      discount: "22% applied",
      features: { text: "Includes Test Series", badge: "INFINITY" },
    },
  ],
  'Class 11': [
    {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "people working on laptops",
      title: "Pinnacle Batch for Class 11",
      tags: ["SCIENCE", "English"],
      target: "For JEE/NEET Foundation",
      startDate: "15 Apr, 2025",
      endDate: "31 Mar, 2026",
      price: "4,500",
      originalPrice: "5,500",
      discount: "18% applied",
      features: { text: "Competitive Exam Focus", badge: "PRO" },
    },
     {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1554224155-8d04421a141a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "person writing on calculator",
      title: "Commerce Core Class 11",
      tags: ["COMMERCE", "English"],
      target: "For Class 11 Commerce",
      startDate: "1 May, 2025",
      endDate: "28 Feb, 2026",
      price: "4,000",
      originalPrice: "4,800",
      discount: "17% applied",
      features: { text: "Accounts & Economics Focus", badge: "PRO" },
    },
  ],
  'Class 12': [
    {
      mode: "ONLINE",
      modeColor: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1610484826912-c2834b17e2c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "science lab",
      title: "Ignite Batch for Class 12 Science",
      tags: ["BOARDS", "Hinglish"],
      target: "Targeted Batch for Class 12 Boards",
      startDate: "1 Apr, 2025",
      endDate: "15 Jan, 2026",
      price: "5,000",
      originalPrice: "6,000",
      discount: "17% applied",
      features: { text: "Practical Exam Prep", badge: "INFINITY" },
    },
  ],
};

// Flatten all courses for 'All Batches'
coursesByCategory['All Batches'] = Object.values(coursesByCategory).flat();


export default function SchoolPage() {
  const [activeClass, setActiveClass] = useState('Class 8');
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
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course, index) => {
            if (course.powerBatch) {
                return (
                    <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow group bg-[#fdf3e6] border-[#f4a261]">
                        <CardContent className="p-4 flex flex-col flex-grow items-center text-center">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="destructive" className="bg-orange-500 text-white">Hinglish</Badge>
                                <Badge className="bg-black text-white gap-1"><Zap className="w-4 h-4"/> POWER BATCH</Badge>
                            </div>
                            <p className="text-sm text-gray-600 font-semibold mt-2">#ExamReadyWithPowerBatch</p>
                            <h3 className="text-xl font-bold text-gray-800 mt-1">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.target}</p>
                            <div className="my-4">
                                <p className="text-xs text-gray-700">GET UP TO</p>
                                <p className="text-7xl font-extrabold text-orange-500 leading-none">
                                    {course.discount}<span className="text-5xl">%</span> <span className="text-5xl align-top">OFF</span>
                                </p>
                            </div>
                            <div className="flex justify-around w-full text-xs text-gray-700 mb-4">
                                {course.features.map((feature: any, idx: number) => (
                                    <div key={idx} className="flex flex-col items-center gap-1">
                                        {feature.icon}
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                             <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg">Enroll Now!</Button>
                             <p className="text-xs text-gray-500 mt-1">Learn Today, Lead Tomorrow.</p>
                             <p className="text-xs text-gray-500 mt-1">📞 9513392724</p>
                        </CardContent>
                         <div className="grid grid-cols-2 gap-0 mt-auto">
                            <Button variant="outline" className="rounded-none rounded-bl-lg">Explore Now</Button>
                            <Button className="rounded-none rounded-br-lg">Buy Now</Button>
                        </div>
                    </Card>
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
          <div className="md:col-span-2 lg:col-span-3 text-center">
             <Card className="p-8">
                <p className="text-muted-foreground">No courses available for this class yet. Please check back later!</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
