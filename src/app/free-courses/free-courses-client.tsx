'use client';

import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, Tag, ArrowRight, BookOpen, Info, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFreeCourse, TFreeCourseVideo } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Component for an individual video item in the course list.
 * Clicking it opens a dedicated video player popup.
 */
const VideoItem = ({ video, chapterName }: { video: TFreeCourseVideo, chapterName: string }) => {
    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full text-left flex items-center gap-3 p-2 rounded-xl border bg-background/40 hover:bg-background/60 backdrop-blur-sm transition-all duration-200 group border-white/10">
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden shrink-0 shadow-inner bg-muted">
                        <Image
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <PlayCircle className="w-4 h-4 text-white/90 drop-shadow-md" />
                        </div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-[11px] font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                    </div>
                    <div className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-3 h-3" />
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl aspect-video p-0 overflow-hidden bg-black border-none ring-offset-0 focus:ring-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>{video.title}</DialogTitle>
                    <DialogDescription>Playing lesson from {chapterName}</DialogDescription>
                </DialogHeader>
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </DialogContent>
        </Dialog>
    );
};

/**
 * Dialog component to display the course chapter and video list with a glassmorphism look.
 */
const CourseContentDialog = ({ course }: { course: TFreeCourse }) => {
    return (
        <DialogContent className="max-w-[340px] h-[65vh] flex flex-col p-0 overflow-hidden rounded-[2rem] border-white/20 shadow-2xl bg-background/70 backdrop-blur-xl">
            <DialogHeader className="p-5 border-b border-white/10 shrink-0 space-y-1">
                <div className="flex items-center gap-2 text-primary">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Course Curriculum</span>
                </div>
                <DialogTitle className="text-base font-black tracking-tight leading-tight">{course.title}</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1">
                <div className="p-5 space-y-6">
                    {course.chapters && course.chapters.length > 0 ? (
                        course.chapters.map((chapter, cIdx) => (
                            <div key={`chapter-${cIdx}`} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shadow-lg shadow-primary/20">
                                        {cIdx + 1}
                                    </div>
                                    <h4 className="font-bold text-xs tracking-tight text-foreground/90">{chapter.name}</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-2 pl-3 border-l border-primary/20 ml-2.5">
                                    {chapter.videos.map((video, vIdx) => (
                                        <VideoItem 
                                            key={`video-${cIdx}-${vIdx}`} 
                                            video={video} 
                                            chapterName={chapter.name} 
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                            <div className="p-3 bg-muted/50 rounded-full">
                                <PlayCircle className="w-8 h-8 text-muted-foreground opacity-20" />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">No lessons available yet.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            <div className="p-3 bg-white/5 border-t border-white/10 text-center shrink-0">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Powered by IDL Education</p>
            </div>
        </DialogContent>
    );
};

/**
 * Main client component for listing free courses.
 */
export function FreeCoursesClient({ courses }: { courses: TFreeCourse[] }) {
  const [groupedCourses, setGroupedCourses] = useState<{[key: string]: TFreeCourse[]}>({});

  useEffect(() => {
    const grouped = courses.reduce((acc, course) => {
      const key = `${course.class} ${course.board}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(course);
      return acc;
    }, {} as {[key: string]: TFreeCourse[]});
    setGroupedCourses(grouped);
  }, [courses]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {Object.entries(groupedCourses).length > 0 ? (
        Object.entries(groupedCourses).map(([groupTitle, groupCourses]) => (
            <section key={groupTitle} className="mb-16">
              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
                  <span className="relative">
                      {groupTitle}
                      <span className="absolute -bottom-1 left-0 w-full h-2 z-[-1] bg-yellow-400/30" />
                  </span>
                </h2>
              </div>
    
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupCourses.map((course) => (
                  <Card key={course.id} className="rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col bg-card border-none ring-1 ring-border group/card relative">
                    <div className="relative overflow-hidden aspect-[4/3]">
                        <GcsImage
                            filePath={course.coverImageUrl || "https://picsum.photos/seed/default/800/600"}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>
                    
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <CardTitleUI className="text-lg font-black text-foreground leading-tight mb-3 line-clamp-2 h-12 group-hover/card:text-primary transition-colors">{course.title}</CardTitleUI>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="secondary" className="rounded-full bg-primary/5 text-primary border-none font-bold uppercase text-[9px] tracking-widest">{course.batchName}</Badge>
                            <Badge variant="outline" className="rounded-full border-muted-foreground/20 text-muted-foreground text-[9px] tracking-widest font-bold uppercase">{course.medium}</Badge>
                        </div>

                        <div className="text-[10px] text-muted-foreground mt-1 space-y-1.5 font-bold uppercase tracking-tight">
                          <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Validity: <span className="text-foreground">{course.validity}</span></p>
                          <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Subject: <span className="text-foreground">{course.subject}</span></p>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                                <p className="text-2xl font-black text-primary">₹{course.price}</p>
                                {course.originalPrice > 0 && <p className="text-xs text-muted-foreground line-through opacity-50 font-bold">₹{course.originalPrice}</p>}
                            </div>
                            <div className="bg-green-500/10 text-green-600 text-[9px] font-black px-2 py-1 rounded-full mt-1.5 border border-green-500/20 uppercase tracking-tighter">
                                100% OFF
                            </div>
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary hover:text-white transition-all h-9 w-9">
                                    <Info className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-5 rounded-2xl bg-background/80 backdrop-blur-xl border-white/20 shadow-2xl" align="end">
                                <h4 className="font-black text-sm mb-2 text-primary uppercase tracking-widest">About this course</h4>
                                <ScrollArea className="max-h-40">
                                    <p className="text-[11px] text-foreground font-medium leading-relaxed whitespace-pre-wrap opacity-80">
                                        {course.description}
                                    </p>
                                </ScrollArea>
                                <div className="mt-4 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-600">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Lifetime Access to Materials</span>
                                    </div>
                                </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                    </CardContent>

                    <div className="p-6 pt-0 mt-auto">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn text-xs tracking-widest">
                                    <PlayCircle className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                                    VIEW LESSONS
                                </Button>
                            </DialogTrigger>
                            <CourseContentDialog course={course} />
                        </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))
      ) : (
        <div className="text-center py-32 space-y-4">
            <div className="p-6 bg-muted/50 rounded-full w-fit mx-auto">
                <BookOpen className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <h2 className="text-2xl font-black text-foreground/40 tracking-tighter">No courses found</h2>
            <p className="text-sm text-muted-foreground font-bold">New learning material is coming soon!</p>
        </div>
      )}
    </div>
  );
}
