
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
    { title: 'Mathematics - Class 6', description: 'Foundational concepts in mathematics.' },
    { title: 'Science - Class 6', description: 'Introduction to physics, chemistry, and biology.' },
  ],
  'Class 7': [
    { title: 'Mathematics - Class 7', description: 'Building on foundational concepts.' },
    { title: 'Science - Class 7', description: 'Exploring the world of science.' },
    { title: 'History - Class 7', description: 'Journey through medieval history.' },
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
        {
          powerBatch: true,
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "students collaborating",
          title: "UMANG POWER BATCH",
          target: "TARGET 2026 | For Class 8",
          discount: 30,
          features: [
            { icon: <Tv />, text: "Interactive Live Learning" },
            { icon: <MessageCircle />, text: "One-on-One Doubt Solving" },
            { icon: <UserCheck />, text: "Personal Academic Mentor" },
          ],
        },
  ],
  'Class 9': [
    { title: 'Mathematics - Class 9', description: 'Preparing for higher-level math.' },
    { title: 'Science - Class 9', description: 'In-depth study of key scientific theories.' },
    { title: 'Social Studies - Class 9', description: 'Understanding modern India and the world.' },
  ],
  'Class 10': [
    { title: 'Mathematics - Class 10', description: 'Master the board syllabus with in-depth lessons.' },
    { title: 'Science - Class 10', description: 'Comprehensive coverage of board syllabus.' },
  ],
  'Class 11': [
    { title: 'Physics - Class 11', description: 'Mechanics, thermodynamics, and waves.' },
    { title: 'Chemistry - Class 11', description: 'Fundamental concepts of chemistry.' },
    { title: 'Biology - Class 11', description: 'Exploring the diversity of life.' },
  ],
  'Class 12': [
    { title: 'Physics - Class 12', description: 'Electromagnetism, optics, and modern physics.' },
    { title: 'Chemistry - Class 12', description: 'Advanced topics in chemistry.' },
    { title: 'Biology - Class 12', description: 'Genetics, evolution, and biotechnology.' },
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
