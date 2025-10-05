
'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, ArrowRight, Calendar, Users, MessageSquare, Tag, Tv, Zap, UserCheck, Home, BookCopy, BookCheck as BookCheckIcon, ClipboardEdit, FileText, PlayCircle, Eye, Download } from 'lucide-react';
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
import { getExamCategories, getTeachers, getSignedUrlForPdf } from '@/app/actions';
import type { TExamCategory, VideoLesson, SyllabusItem } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
  socialLinks?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
  };
}

const SyllabusActionButtons = ({ pdfUrl }: { pdfUrl?: string }) => {
    const { toast } = useToast();

    const handleAction = async () => {
        if (!pdfUrl) {
            toast({ variant: 'destructive', title: 'Not Available', description: 'The syllabus PDF is not yet available for this subject.' });
            return;
        }
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            window.open(result.url, '_blank');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAction}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAction}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
            </Button>
        </div>
    )
}

function SchoolPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const classParam = searchParams.get('class');
  const [activeClass, setActiveClass] = useState('');
  const [classes, setClasses] = useState<TExamCategory[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const { toast } = useToast();
  
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
  
    const handleAction = async (pdfUrl: string) => {
        if (!pdfUrl) {
            toast({ variant: 'destructive', title: 'Not Available', description: 'The syllabus PDF is not yet available for this subject.' });
            return;
        }
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            window.open(result.url, '_blank');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };
  
  const activeCategory = classes.find(c => c.name === activeClass);
  const activeTeachers = activeCategory?.teacherIds
    ? teachers.filter(t => activeCategory.teacherIds?.includes(t.id))
    : [];
    
  const videoLessons: VideoLesson[] = activeCategory?.videoLessons || [];
  const syllabusItems: SyllabusItem[] = activeCategory?.syllabus || [];

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
        </div>

        <div className="w-full">
          {activeTeachers.length > 0 && (
            <section key={animationKey} className="w-full pb-12 md:pb-24 animate-fade-in-up">
              <div className="container mx-auto px-4 md:px-[10%]">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="text-primary">Know Your </span>
                    <span style={{ color: '#adb5bd' }}>Teachers</span>
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Our dedicated team of educators is here to guide you on your learning journey.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                        {activeTeachers.map((member) => (
                            <div key={member.id} className="block flex-shrink-0 w-60 h-80">
                                <TeacherCard 
                                    name={member.name}
                                    designation={member.designation || 'Teacher'}
                                    experience={member.experience || 'Experienced'}
                                    avatar={member.photoURL || ''}
                                    avatarHint={`${member.name} photo`}
                                    biography={member.biography}
                                    socialLinks={member.socialLinks}
                                />
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </section>
            )}
           
          {videoLessons.length > 0 && (
            <section className="w-full my-8">
                <div className="relative">
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                        {videoLessons.map((lesson, index) => {
                            const videoId = lesson.youtubeLink.split('v=')[1]?.split('&')[0];
                            return (
                                <Dialog key={index}>
                                    <DialogTrigger asChild>
                                        <div className="block flex-shrink-0 w-60 h-80 cursor-pointer">
                                            <Card className="group overflow-hidden h-full rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                                <CardContent className="p-0">
                                                    <div className="relative aspect-[9/12]">
                                                        <Image
                                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                            alt={`${lesson.subject} video lesson`}
                                                            data-ai-hint={`${lesson.subject} lesson poster`}
                                                            fill
                                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <button className="bg-white/80 backdrop-blur-sm rounded-full h-14 w-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                                                    <PlayCircle className="w-8 h-8 text-primary/80" />
                                                                </button>
                                                            </div>
                                                            <h3 className="text-white text-xl font-bold">{lesson.subject}</h3>
                                                            <div className="text-xs text-white/80 mt-1 flex items-center gap-4">
                                                                <span>By {lesson.teacher}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </DialogTrigger>
                                     <DialogContent className="max-w-3xl p-0">
                                        <DialogHeader className="p-4">
                                            <DialogTitle>{lesson.subject} by {lesson.teacher}</DialogTitle>
                                        </DialogHeader>
                                        <div className="aspect-video">
                                            <iframe
                                                className="w-full h-full"
                                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                                title={`YouTube video player for ${lesson.subject}`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                        )})}
                    </div>
                </div>
                </div>
            </section>
          )}

          <section className="w-full pb-12 md:pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="container mx-auto px-4 md:px-[10%]">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                      {`${activeClass} Online Coaching 2025-2026`}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Everything you need to know about the curriculum, exams, and resources.
                    </p>
                </div>
                <Card className="shadow-lg">
                    <CardContent className="p-6 space-y-8">
                        {syllabusItems.length > 0 && (
                            <div>
                                <h3 className="font-bold text-xl mb-2 text-primary">Syllabus</h3>
                                <p className="text-muted-foreground mb-4">The following table provides the subject-wise {activeClass} Syllabus NCERT Links. Students can use them to access the FREE PDF for the Syllabus of all subjects in NCERT {activeClass}.</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="w-[100px] text-white font-bold">S.No.</TableHead>
                                            <TableHead className="text-white font-bold">Subject-Wise Links CBSE | {activeClass} | Syllabus 2025-26</TableHead>
                                            <TableHead className="text-right text-white font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {syllabusItems.map((item) => (
                                            <TableRow key={item.sno}>
                                                <TableCell className="font-medium">{item.sno}</TableCell>
                                                <TableCell><span className="text-blue-600 font-medium hover:underline cursor-pointer" onClick={() => { if(item.pdfUrl) handleAction(item.pdfUrl) }}>{item.name}</span></TableCell>
                                                <TableCell className="text-right">
                                                    <SyllabusActionButtons pdfUrl={item.pdfUrl} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        
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
