
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, BookCopy, FileText, BookCheck as BookCheckIcon, ClipboardEdit, PlayCircle, Eye, Download, Trophy, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TeacherCard } from "@/components/landing/teacher-card";
import { useState } from "react";
import type { TExamCategory, VideoLesson, SyllabusItem } from "@/app/actions/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSignedUrlForPdf } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PdfViewerDialog } from '@/components/pdf-viewer-dialog';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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

export function CategoryContent({ data, slug, competitiveExams, foundationExams, teachers }: { data: TExamCategory, slug: string, competitiveExams: TExamCategory[], foundationExams: TExamCategory[], teachers: Teacher[] }) {
  const { toast } = useToast();
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("PDF Viewer");
  
  const handleViewPdf = async (pdfUrl: string, title?: string) => {
    if (!pdfUrl) {
        toast({ variant: 'destructive', title: 'Not Available', description: 'The syllabus PDF is not yet available for this subject.' });
        return;
    }
    setIsLoadingPdf(true);
    setIsPdfDialogOpen(true);
    if (title) setDialogTitle(title);
    
    const result = await getSignedUrlForPdf(pdfUrl);
    if (result.success && result.url) {
        setPdfSrc(result.url);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
        setIsPdfDialogOpen(false);
    }
    setIsLoadingPdf(false);
  };

  const isNeetPage = slug === 'neet';
  
  const neetTopperSlides = [
    { imageUrl: "https://www.aakash.ac.in/blog/wp-content/uploads/2023/06/Post-Blog-Banner-1.jpg", alt: "Aritro Ray", title: "Aritro Ray - AIR 50" },
    { imageUrl: "https://www.pw.live/version14/assets/img/neet-toppers-2023/pranjal-agarwal.png", alt: "Pranjal Aggarwal", title: "Pranjal Aggarwal - AIR 4" },
    { imageUrl: "https://www.pw.live/version14/assets/img/neet-toppers-2023/dhruv-advani.png", alt: "Dhruv Advani", title: "Dhruv Advani - AIR 5" },
  ];

  return (
    <div>
      {isNeetPage ? (
        <section className="bg-[#F0F8FF] dark:bg-gray-900 pt-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Online Coaching for <span className="text-blue-600">NEET</span></h1>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Trophy className="h-8 w-8 text-blue-500 mt-1" />
                                <p className="text-gray-600 dark:text-gray-300">NEET Online Coaching by IDL Online helps you secure <span className="font-bold text-blue-500">top ranks in NEET.</span></p>
                            </div>
                             <div className="flex items-start gap-4">
                                <Award className="h-8 w-8 text-blue-500 mt-1" />
                                <p className="text-gray-600 dark:text-gray-300">With 36 years of expertise, live classes from our expert faculty, and the best study materials, IDL Online sets you up for <span className="font-bold text-blue-500">NEET success.</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-full">Download App</Button>
                            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">Talk to us</Button>
                        </div>
                    </div>
                    <div>
                        <Carousel
                            plugins={[ Autoplay({ delay: 3000, stopOnInteraction: true }) ]}
                            className="w-full max-w-lg mx-auto"
                            opts={{ loop: true }}
                        >
                            <CarouselContent>
                                {neetTopperSlides.map((slide, index) => (
                                    <CarouselItem key={index}>
                                        <Card className="overflow-hidden rounded-2xl shadow-2xl">
                                            <div className="relative aspect-[16/9] w-full">
                                                <Image src={slide.imageUrl} alt={slide.alt} fill className="object-cover" data-ai-hint="student headshot"/>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <h3 className="text-xl font-bold">{slide.title}</h3>
                                                </div>
                                            </div>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
      ) : (
        <>
            {['cuet', 'govt-job-exams', 'iit-jee', 'defence', 'gate', 'ssc', 'delhi-police'].includes(slug) && (
                <section className="container mx-auto px-4 md:px-6 pt-8">
                    <Card className="overflow-hidden shadow-lg">
                        <div className="relative w-full aspect-[16/5]">
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
            )}
            <div className="container mx-auto py-12 px-4 md:px-6">
                <section className="w-full pb-12 md:pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="container mx-auto px-4 md:px-[10%]">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-primary">
                                {`${data.name} Online Coaching 2025-2026`}
                            </h2>
                            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                                Everything you need to know about the curriculum, exams, and resources.
                            </p>
                        </div>
                        <Card className="shadow-lg">
                            <CardContent className="p-6 space-y-8">
                                {data.syllabus && data.syllabus.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Syllabus</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">S.No.</TableHead>
                                                    <TableHead>Subject</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.syllabus.map((item: SyllabusItem, index: number) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">{item.sno}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell className="text-right">
                                                            {item.pdfUrl ? (
                                                                <Button variant="ghost" size="sm" onClick={() => handleViewPdf(item.pdfUrl!, item.name)}>
                                                                    <Eye className="mr-2 h-4 w-4" /> View PDF
                                                                </Button>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">Not Available</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                                {teachers && teachers.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-xl mb-4 text-primary border-b pb-2">Our Expert Teachers</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {teachers.map((teacher: any) => (
                                                <TeacherCard 
                                                    key={teacher.id} 
                                                    name={teacher.name}
                                                    designation={teacher.designation}
                                                    experience={teacher.experience}
                                                    biography={teacher.biography}
                                                    avatar={teacher.photoURL}
                                                    avatarHint={`${teacher.name} photo`}
                                                    socialLinks={teacher.socialLinks}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.videoLessons && data.videoLessons.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-xl mb-4 text-primary border-b pb-2">Free Video Lessons</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {data.videoLessons.map((lesson: VideoLesson, index: number) => {
                                                const videoId = lesson.youtubeLink.split('v=')[1]?.split('&')[0];
                                                return (
                                                    <Dialog key={index}>
                                                        <DialogTrigger asChild>
                                                            <div className="block cursor-pointer">
                                                                <Card className="group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                                                    <CardContent className="p-0">
                                                                        <div className="relative aspect-video">
                                                                            <Image
                                                                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                                                alt={`${lesson.subject} video lesson`}
                                                                                data-ai-hint={`${lesson.subject} lesson poster`}
                                                                                fill
                                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                            />
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                    <button className="bg-white/80 backdrop-blur-sm rounded-full h-12 w-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                                                                        <PlayCircle className="w-8 h-8 text-primary/80" />
                                                                                    </button>
                                                                                </div>
                                                                                <h3 className="text-white text-lg font-bold">{lesson.subject}</h3>
                                                                                <p className="text-xs text-white/80 mt-1">By {lesson.teacher}</p>
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
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-xl mb-4 text-primary border-b pb-2">Study Resources</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {resourceLinks.map(link => (
                                            <Button asChild variant="outline" key={link.href} className="justify-start rounded-full">
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
        </>
      )}
      <PdfViewerDialog
        isOpen={isPdfDialogOpen}
        onOpenChange={setIsPdfDialogOpen}
        pdfSrc={pdfSrc}
        isLoading={isLoadingPdf}
        title={dialogTitle}
      />
    </div>
  );
}
