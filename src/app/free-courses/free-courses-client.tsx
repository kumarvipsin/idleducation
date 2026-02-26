'use client';

import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, BookOpen, Info, CheckCircle2, Search, Filter, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFreeCourse, TFreeCourseVideo } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VideoItem = ({
    video,
    chapterName,
    isActive,
    onSelect
}: {
    video: TFreeCourseVideo,
    chapterName: string,
    isActive: boolean,
    onSelect: () => void
}) => {
    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full text-left flex items-center gap-3 py-3 px-4 transition-all duration-200 group border-b border-black/[0.03]",
                isActive
                    ? "bg-slate-50 border-l-[3px] border-l-primary"
                    : "hover:bg-slate-100"
            )}
        >
            <div className="relative h-12 w-20 rounded-md overflow-hidden shrink-0 bg-zinc-200 shadow-sm border border-border/50">
                <Image
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <PlayCircle className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>
            <div className="flex-grow min-w-0">
                <p className={cn(
                    "text-[13px] font-black leading-tight line-clamp-2 transition-colors",
                    isActive ? "text-primary" : "text-slate-700"
                )}>{chapterName}</p>
                {isActive && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] text-primary font-black uppercase tracking-widest">Now Playing</span>
                    </div>
                )}
            </div>
        </button>
    );
};

const CoursePlayerDialog = ({ course }: { course: TFreeCourse }) => {
    const [activeVideo, setActiveVideo] = useState<TFreeCourseVideo | null>(
        course.chapters?.[0]?.videos?.[0] || null
    );

    const activeVideoId = activeVideo?.youtubeLink.split('v=')[1]?.split('&')[0];

    return (
        <DialogContent className="p-0 flex flex-col lg:flex-row max-w-full lg:max-w-5xl w-full h-full lg:h-fit overflow-hidden rounded-none lg:rounded-2xl border-none lg:border border-border bg-white shadow-2xl transition-all duration-500">
            <DialogHeader className="sr-only">
                <DialogTitle>{course.title}</DialogTitle>
                <DialogDescription>Video course curriculum</DialogDescription>
            </DialogHeader>

            <div className="flex-none lg:flex-grow bg-white flex flex-col relative h-auto">
                <div className="aspect-video w-full relative flex items-center justify-center bg-white">
                    {activeVideoId ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                            title={activeVideo?.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4">
                            <PlayCircle className="w-16 h-16 opacity-20" />
                            <p className="text-sm font-medium">Select a lesson to begin</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 lg:w-[320px] flex flex-col bg-white lg:border-l border-border lg:shrink-0 overflow-hidden min-h-0">
                <ScrollArea className="flex-1">
                    <div className="pb-0">
                        {course.chapters && course.chapters.length > 0 ? (
                            course.chapters.map((chapter, cIdx) => (
                                <div key={`chapter-${cIdx}`} className="mt-0">
                                    <div className="flex flex-col">
                                        {chapter.videos.map((video, vIdx) => (
                                            <VideoItem
                                                key={`video-${cIdx}-${vIdx}`}
                                                video={video}
                                                chapterName={chapter.name}
                                                isActive={activeVideo?.youtubeLink === video.youtubeLink}
                                                onSelect={() => {
                                                    setActiveVideo(video);
                                                    if (window.innerWidth < 1024) {
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
                                <BookOpen className="w-10 h-10 opacity-20 mb-2" />
                                <p className="text-xs font-extrabold">No content available</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                <div className="lg:hidden p-4 border-t bg-slate-50 mt-auto">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full font-black text-[10px] tracking-widest uppercase h-11 rounded-xl shadow-sm border-slate-200">
                            CLOSE PLAYER
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </DialogContent>
    );
};

export function FreeCoursesClient({ courses }: { courses: TFreeCourse[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => setMounted(true), []);

  const availableClasses = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.class))).filter(Boolean).sort();
    return unique;
  }, [courses]);

  const availableSubjects = useMemo(() => {
    const unique = Array.from(new Set(courses.map(c => c.subject))).filter(Boolean).sort();
    return unique;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesClass = selectedClass === "all" || course.class === selectedClass;
      const matchesSubject = selectedSubject === "all" || course.subject === selectedSubject;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesClass && matchesSubject && matchesSearch;
    });
  }, [courses, selectedClass, selectedSubject, searchTerm]);

  const groupedCourses = useMemo(() => {
    const subjectPriority: Record<string, number> = {
      'maths': 1,
      'mathematics': 1,
      'science': 2,
      'social science': 3,
      'social studies': 3,
      'sst': 3,
      'english': 4,
    };

    const getPriority = (subject: string) => {
      const s = subject.toLowerCase().trim();
      for (const [key, priority] of Object.entries(subjectPriority)) {
        if (s.includes(key)) return priority;
      }
      return 99;
    };

    const grouped = filteredCourses.reduce((acc, course) => {
      const rawClass = (course.class || 'Other Courses').trim();
      const existingKey = Object.keys(acc).find(k => k.toLowerCase() === rawClass.toLowerCase());
      const key = existingKey || rawClass;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(course);
      return acc;
    }, {} as {[key: string]: TFreeCourse[]});

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => getPriority(a.subject) - getPriority(b.subject));
    });

    return grouped;
  }, [filteredCourses]);

  const sortedGroupedEntries = useMemo(() => {
    return Object.entries(groupedCourses).sort(([keyA], [keyB]) => {
      const numA = parseInt(keyA.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(keyB.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  }, [groupedCourses]);

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
      
      {/* Filtration Section */}
      <div className="mb-12 space-y-6">
        <Card className="rounded-xl border border-border/40 bg-white/60 backdrop-blur-sm p-3 md:p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Class Filter */}
                <div className="md:col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-500 ml-0.5">Select Class</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="rounded-lg border-slate-200 font-medium text-sm h-10 shadow-none">
                            <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {availableClasses.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Subject Filter */}
                <div className="md:col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-500 ml-0.5">Select Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="rounded-lg border-slate-200 font-medium text-sm h-10 shadow-none">
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {availableSubjects.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Filter */}
                <div className="md:col-span-4 space-y-1">
                    <Label className="text-xs font-medium text-slate-500 ml-0.5">Search Keywords</Label>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="e.g. Algebra, Physics, etc." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 rounded-lg border-slate-200 font-medium text-sm h-10 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Reset Button */}
                <div className="md:col-span-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => { setSelectedClass("all"); setSelectedSubject("all"); setSearchTerm(""); }}
                        className="w-full h-10 rounded-lg font-semibold text-xs hover:bg-slate-100 text-slate-600 transition-all"
                    >
                        Clear All
                    </Button>
                </div>
            </div>
        </Card>
      </div>

      {/* Courses Display */}
      {sortedGroupedEntries.length > 0 ? (
        sortedGroupedEntries.map(([groupTitle, groupCourses]) => {
            const words = groupTitle.split(' ');
            const firstPart = words.slice(0, -1).join(' ');
            const lastWord = words[words.length - 1];

            return (
                <section key={groupTitle} className="mb-12 last:mb-0">
                  <div className="mb-8 text-center sm:text-left">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                        {firstPart}{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">{lastWord}</span>
                            <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h2>
                  </div>
        
                  <div className="relative">
                    <div className="flex overflow-x-auto pb-6 gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {groupCourses.map((course) => (
                        <div key={course.id} className="flex-shrink-0 w-[285px] md:w-full h-full">
                            <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col bg-card border group/card relative h-full">
                                <div className="relative overflow-hidden aspect-[16/9]">
                                    <GcsImage
                                        filePath={course.coverImageUrl || ""}
                                        alt={course.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                </div>
                                
                                <CardContent className="p-4 flex flex-col flex-grow">
                                    <CardTitleUI className="text-sm md:text-base font-extrabold text-foreground leading-tight mb-2 line-clamp-2 group-hover/card:text-primary transition-colors">{course.title}</CardTitleUI>
                                    
                                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                        <Badge variant="secondary" className="rounded-md bg-primary/5 text-primary border-none font-extrabold uppercase text-[8px] tracking-widest h-6 px-3 py-0 flex items-center justify-center">{course.batchName}</Badge>
                                        <Badge variant="outline" className="rounded-md border-muted-foreground/20 text-muted-foreground text-[8px] tracking-widest font-extrabold uppercase h-6 px-3 py-0 flex items-center justify-center">{course.medium}</Badge>
                                    </div>

                                    <div className="text-[11px] text-muted-foreground mt-1 space-y-1 font-extrabold capitalize tracking-tight">
                                        <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Validity: <span className="text-foreground">{course.validity}</span></p>
                                        <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Subject: <span className="text-foreground">{course.subject}</span></p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-baseline gap-1.5">
                                            <p className="text-lg font-extrabold text-primary">₹{course.price}</p>
                                            {course.originalPrice > 0 && <p className="text-[10px] text-muted-foreground line-through opacity-50 font-extrabold">₹{course.originalPrice}</p>}
                                        </div>
                                        <div className="bg-green-500/10 text-green-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded mt-1 border border-green-500/20 uppercase tracking-tighter w-fit">
                                            100% OFF
                                        </div>
                                    </div>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary hover:text-white transition-all h-7 w-7">
                                                <Info className="w-3.5 h-3.5" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72 p-4 rounded-xl bg-background/95 backdrop-blur-xl border-white/20 shadow-2xl" align="end">
                                            <h4 className="font-extrabold text-[9px] mb-2 text-primary uppercase tracking-widest">About this course</h4>
                                            <ScrollArea className="max-h-40">
                                                <p className="text-[10px] text-foreground font-extrabold leading-relaxed whitespace-pre-wrap opacity-80">
                                                    {course.description}
                                                </p>
                                            </ScrollArea>
                                            <div className="mt-4 pt-3 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-[9px] font-extrabold text-green-600">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Lifetime Access</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    </div>
                                </CardContent>

                                <div className="p-4 pt-0 mt-auto">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn text-[10px] tracking-tight">
                                                <PlayCircle className="w-3.5 h-3.5 mr-2 transition-transform group-hover:btn:scale-110" />
                                                VIEW LESSONS
                                            </Button>
                                        </DialogTrigger>
                                        <CoursePlayerDialog course={course} />
                                    </Dialog>
                                </div>
                            </Card>
                        </div>
                        ))}
                    </div>
                  </div>
                </section>
            );
        })
      ) : (
        <div className="text-center py-32 space-y-4">
            <div className="p-6 bg-muted/50 rounded-full w-fit mx-auto">
                <BookOpen className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <h2 className="text-xl font-extrabold text-foreground/40 tracking-tight uppercase">No matching courses found</h2>
            <p className="text-xs text-muted-foreground font-extrabold">Try adjusting your filters or search keywords.</p>
            <Button 
                variant="link" 
                onClick={() => { setSelectedClass("all"); setSelectedSubject("all"); setSearchTerm(""); }}
                className="text-primary font-black uppercase text-[10px] tracking-widest"
            >
                Clear all filters
            </Button>
        </div>
      )}
    </div>
  );
}
