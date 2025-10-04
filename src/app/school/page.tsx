
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, ArrowRight, Calendar, Users, MessageSquare, Tag, Tv, Zap, UserCheck, Home, BookCopy, BookCheck as BookCheckIcon, ClipboardEdit, FileText, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { useSearchParams, useRouter } from 'next/navigation';
import { TeacherCard } from '@/components/landing/teacher-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useLanguage } from '@/context/language-context';
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getExamCategories } from '@/app/actions/data';
import { getTeachers } from '@/app/actions';
import type { TExamCategory, TTopperTestimonial } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { syllabusData } from '@/lib/syllabus-data';

const resourceLinks = [
  { href: '/resources/notes', label: 'Notes', icon: <ClipboardEdit /> },
  { href: '/resources/ncert-solutions', label: 'NCERT Solutions', icon: <BookCheckIcon /> },
  { href: '/resources/previous-year-questions', label: 'Previous Year Questions', icon: <FileText /> },
  { href: '/resources/reference-books', label: 'Reference Books', icon: <BookCopy /> },
];

interface Teacher {
  id: string;
  name: string;
  designation: string;
  experience: string;
  photoURL?: string;
  avatar: string;
  biography?: string;
}

const class6SyllabusLinks = [
    { sno: 1, subject: 'CBSE Syllabus for Class 6 Maths', href: '#' },
    { sno: 2, subject: 'CBSE Syllabus for Class 6 Science', href: '#' },
    { sno: 3, subject: 'CBSE Syllabus for Class 6 English', href: '#' },
    { sno: 4, subject: 'CBSE Syllabus for Class 6 Social Science', href: '#' },
];


function SchoolPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const classParam = searchParams.get('class');
  const [activeClass, setActiveClass] = useState('');
  const [classes, setClasses] = useState<TExamCategory[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [categoriesResult, teachersResult] = await Promise.all([
        getExamCategories(),
        getTeachers(),
      ]);

      if (categoriesResult.success && categoriesResult.data) {
        const schoolExams = (categoriesResult.data as TExamCategory[])
          .filter(cat => cat.group === 'school')
          .sort((a, b) => (a.order || 99) - (b.order || 99));
        setClasses(schoolExams);

        if (schoolExams.length > 0) {
          const initialClass = classParam && schoolExams.some(c => c.name === classParam)
            ? classParam 
            : schoolExams.find(c => c.name.includes('8'))?.name || schoolExams[0].name;
          setActiveClass(initialClass);
        }
      }
      if (teachersResult.success && teachersResult.data) {
        setTeachers(teachersResult.data as Teacher[]);
      }
      setLoading(false);
    };
    fetchData();
  }, [classParam]);


  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeClass]);

  const handleClassChange = (className: string) => {
    setActiveClass(className);
    router.push(`/school?class=${encodeURIComponent(className)}`, { scroll: false });
  };
  
  const activeCategory = classes.find(c => c.name === activeClass);
  const activeTeachers = activeCategory?.teacherIds
    ? teachers.filter(t => activeCategory.teacherIds?.includes(t.id))
    : [];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
    <div className="container mx-auto py-8 px-4 md:px-6">
       <section className="mb-8">
        <Card className="overflow-hidden shadow-lg">
          <div className="relative w-full aspect-[16/4]">
            {loading || !activeCategory?.imageUrl ? (
              <Skeleton className="w-full h-full" />
            ) : (
                <GcsImage
                    filePath={activeCategory.imageUrl}
                    alt={`Banner for ${activeCategory.name}`}
                    fill
                    className="object-cover"
                />
            )}
          </div>
        </Card>
      </section>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
            {loading ? (
              [...Array(8)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
            ) : (
              classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleClassChange(c.name)}
                  className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                    ${activeClass === c.name 
                      ? 'border-primary text-primary bg-primary/10 rounded-md' 
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
                >
                  {c.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
       {activeTeachers.length > 0 && (
        <section key={animationKey} className="w-full pb-12 md:pb-24 animate-fade-in-up">
            <div className="px-4 md:px-[10%]">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  <span className="text-primary">Know Your </span>
                  <span style={{ color: '#adb5bd' }}>Teachers</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Our dedicated team of educators is here to guide you on your learning journey.
                </p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: activeTeachers.length > 3,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent className="-ml-4">
                  {activeTeachers.map((member) => (
                    <CarouselItem key={member.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <TeacherCard 
                        name={member.name}
                        designation={member.designation || 'Teacher'}
                        experience={member.experience || 'Experienced'}
                        avatar={member.photoURL || ''}
                        avatarHint={`${member.name} photo`}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </section>
        )}

      <section className="w-full pb-12 md:pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="container mx-auto px-4 md:px-[10%]">
             <Card>
                <CardHeader>
                    <CardTitle>Subject Video Lessons</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Maths', 'Science', 'English', 'Social Studies'].map((subject) => (
                    <Card key={subject} className="group overflow-hidden">
                        <CardContent className="p-0">
                        <div className="relative aspect-video">
                            <Image
                            src={`https://picsum.photos/seed/${subject}/600/400`}
                            alt={`${subject} video lesson`}
                            data-ai-hint={`${subject} lesson`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-white/70 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold">{subject} Video Lessons</h4>
                            <p className="text-sm text-muted-foreground">By Manish Sharma</p>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </CardContent>
            </Card>
            <div className="text-center my-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  {`${activeClass} Online Coaching 2025-2026`}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Everything you need to know about the curriculum, exams, and resources.
                </p>
            </div>
            <Card className="shadow-lg">
                <CardContent className="p-6 space-y-8">
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Syllabus & Study Strategy</h3>
                        {activeClass === 'Class 6' && (
                            <div className="space-y-8">
                                <Card className="mb-8">
                                    <CardHeader>
                                        <CardTitle className="font-bold text-xl md:text-2xl">CBSE Class 6 Syllabus 2025-26</CardTitle>
                                        <CardDescription className="text-xs md:text-sm">
                                            The following table provides the subject-wise Class 6 Syllabus NCERT Links. Students can use them to access the FREE PDF for the Syllabus of all subjects in NCERT Class 6.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-orange-500 hover:bg-orange-500/90">
                                                    <TableHead className="w-[100px] text-white">S.No.</TableHead>
                                                    <TableHead className="text-white">Subject-Wise Links CBSE | Class 6 | Syllabus 2025-26</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {class6SyllabusLinks.map((item) => (
                                                    <TableRow key={item.sno}>
                                                        <TableCell className="font-medium">{item.sno}</TableCell>
                                                        <TableCell><Link href={item.href} className="text-blue-600 hover:underline">{item.subject}</Link></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        {['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(activeClass) && (
                            <Tabs defaultValue="maths" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="maths">Maths</TabsTrigger>
                                    <TabsTrigger value="science">Science</TabsTrigger>
                                    <TabsTrigger value="social">Social Science</TabsTrigger>
                                    <TabsTrigger value="english">English</TabsTrigger>
                                </TabsList>
                                <TabsContent value="maths" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].maths.description}</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].maths.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="science" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].science.description}</p>
                                     <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].science.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="social" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].social.description}</p>
                                     <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].social.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                 <TabsContent value="english" className="pt-4">
                                    <p className="text-muted-foreground">{syllabusData[activeClass].english.description}</p>
                                     <Table>
                                        <TableHeader>
                                            <TableRow><TableHead>Chapter</TableHead><TableHead>Topics</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {syllabusData[activeClass].english.chapters.map((item: any) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        {item.topics.length > 0 ? (
                                                            <ul className="list-disc pl-5">
                                                                {item.topics.map((topic: string) => <li key={topic}>{topic}</li>)}
                                                            </ul>
                                                        ) : 'Topics will be updated soon.'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                    
                    
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

export default function SchoolPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchoolPageContent />
    </Suspense>
  );
}
