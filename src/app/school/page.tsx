
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    { title: 'Mathematics - Class 8', description: 'Advanced topics for middle school.' },
    { title: 'Science - Class 8', description: 'Understanding scientific principles.' },
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
  const [activeClass, setActiveClass] = useState('Class 6');
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              Language <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Hindi</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Power Batch</Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Newly Launched</Button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course, index) => (
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
          ))
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
