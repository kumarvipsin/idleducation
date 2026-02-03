'use client';

import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, Tag, ArrowRight, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFreeCourse, TFreeCourseVideo } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

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
                <button className="w-full text-left flex items-center gap-4 p-3 rounded-xl border bg-card hover:bg-muted/50 transition-all duration-200 group shadow-sm hover:shadow-md border-border/50">
                    <div className="relative h-16 w-28 rounded-lg overflow-hidden shrink-0 shadow-inner bg-muted">
                        <Image
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={video.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-white/90 drop-shadow-md" />
                        </div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{chapterName}</span>
                        </div>
                    </div>
                    <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
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
 * Dialog component to display only the course chapter and video list.
 */
const CourseContentDialog = ({ course }: { course: TFreeCourse }) => {
    return (
        <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
            <DialogHeader className="p-6 border-b bg-card shrink-0 space-y-1">
                <div className="flex items-center gap-2 text-primary">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Course Content</span>
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight">{course.title}</DialogTitle>
                <DialogDescription className="text-sm line-clamp-1">Explore all lessons and chapters available in this course.</DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 bg-muted/5">
                <div className="p-6 space-y-8">
                    {course.chapters && course.chapters.length > 0 ? (
                        course.chapters.map((chapter, cIdx) => (
                            <div key={`chapter-${cIdx}`} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {cIdx + 1}
                                    </div>
                                    <h4 className="font-extrabold text-lg tracking-tight text-foreground/90">{chapter.name}</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pl-2 sm:pl-11 border-l-2 border-primary/10 ml-4">
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
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                <PlayCircle className="w-12 h-12 text-muted-foreground opacity-20" />
                            </div>
                            <p className="text-muted-foreground font-medium">No videos available for this course yet.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            <div className="p-4 bg-card border-t text-center shrink-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Free Course by IDL Education</p>
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
              <div className="mb-12 text-left">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground/90">
                  <span className="relative inline-block">
                      <span className="relative z-10">{groupTitle}</span>
                      <span className="absolute -bottom-1.5 left-0 w-full h-2.5 z-0 bg-yellow-300 opacity-50" />
                  </span>
                </h1>
              </div>
    
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupCourses.map((course) => (
                  <Card key={course.id} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-card border-none ring-1 ring-border group/card">
                    <div className="relative overflow-hidden aspect-video">
                        <GcsImage
                            filePath={course.coverImageUrl || "https://picsum.photos/seed/default/800/450"}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                         <div className="absolute top-3 left-3">
                            <Badge className="bg-primary/90 backdrop-blur-sm hover:bg-primary text-white font-bold px-3 py-1 rounded-full shadow-lg border-none">FREE COURSE</Badge>
                         </div>
                    </div>
                    
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <CardTitleUI className="text-xl font-black text-foreground leading-tight mb-3 line-clamp-2 h-14 group-hover/card:text-primary transition-colors">{course.title}</CardTitleUI>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="secondary" className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-none font-bold uppercase text-[10px] tracking-wider">{course.batchName}</Badge>
                            <Badge variant="outline" className="rounded-full border-muted-foreground/20 text-muted-foreground text-[10px] tracking-widest font-bold uppercase">{course.medium}</Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-2 space-y-1.5">
                          <p className="flex items-center gap-2 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Validity: <span className="text-foreground font-bold">{course.validity}</span></p>
                          <p className="flex items-center gap-2 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Subject: <span className="text-foreground font-bold">{course.subject}</span></p>
                        </div>
                        <div className="mt-6">
                          <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-primary">₹{course.price}</p>
                            {course.originalPrice > 0 && <p className="text-sm text-muted-foreground line-through decoration-destructive/50">₹{course.originalPrice}</p>}
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black px-3 py-1.5 rounded-full mt-2 flex items-center gap-1.5 w-fit border border-green-100 dark:border-green-900/30">
                              <Tag className="w-3 h-3" />
                              <span>100% DISCOUNT APPLIED</span>
                          </div>
                           <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="text-xs p-0 h-auto mt-4 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-tighter">View Full Course Details</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black">{course.title}</DialogTitle>
                                    <DialogDescription className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {course.description}
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn">
                                    <PlayCircle className="w-5 h-5 mr-2 transition-transform group-hover/btn:scale-110" />
                                    VIEW COURSE
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
            <div className="p-6 bg-muted rounded-full w-fit mx-auto">
                <BookOpen className="w-12 h-12 text-muted-foreground opacity-20" />
            </div>
            <h2 className="text-2xl font-bold text-foreground/50">No free courses found</h2>
            <p className="text-muted-foreground">Check back later for exciting new free content!</p>
        </div>
      )}
    </div>
  );
}
