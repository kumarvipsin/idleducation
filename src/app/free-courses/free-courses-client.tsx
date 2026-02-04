'use client';

import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, BookOpen, Info, CheckCircle2, Play, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFreeCourse, TFreeCourseVideo } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

/**
 * Component for an individual video item in the course list.
 */
const VideoItem = ({
    video,
    isActive,
    onSelect
}: {
    video: TFreeCourseVideo,
    isActive: boolean,
    onSelect: () => void
}) => {
    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full text-left flex items-start gap-3 p-3 transition-all duration-200 group border-b border-white/5",
                isActive
                    ? "bg-primary/20 border-l-4 border-l-primary"
                    : "hover:bg-white/5"
            )}
        >
            <div className="relative h-16 w-28 rounded-md overflow-hidden shrink-0 bg-zinc-800 shadow-lg">
                <Image
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <PlayCircle className={cn("w-6 h-6 transition-transform", isActive ? "text-primary scale-110" : "text-white/70 group-hover:scale-110")} />
                </div>
            </div>
            <div className="flex-grow min-w-0 pt-1">
                <p className={cn(
                    "text-xs font-semibold leading-tight line-clamp-2 transition-colors",
                    isActive ? "text-primary" : "text-white/90 group-hover:text-white"
                )}>{video.title}</p>
                {isActive && <span className="text-[10px] text-primary font-bold uppercase mt-1 inline-block">Now Playing</span>}
            </div>
        </button>
    );
};

/**
 * Dialog component to display the course player and playlist.
 */
const CoursePlayerDialog = ({ course }: { course: TFreeCourse }) => {
    const [activeVideo, setActiveVideo] = useState<TFreeCourseVideo | null>(
        course.chapters?.[0]?.videos?.[0] || null
    );

    const activeVideoId = activeVideo?.youtubeLink.split('v=')[1]?.split('&')[0];

    return (
        <DialogContent className="p-0 flex flex-col lg:flex-row max-w-full lg:max-w-[95vw] xl:max-w-[1400px] h-[100dvh] lg:h-[85vh] overflow-hidden rounded-none lg:rounded-2xl border-none lg:border border-white/10 bg-black shadow-2xl transition-all duration-500">
            <DialogHeader className="sr-only">
                <DialogTitle>{course.title}</DialogTitle>
                <DialogDescription>Video course curriculum</DialogDescription>
            </DialogHeader>

            {/* Video Player Area */}
            <div className="flex-grow bg-black flex flex-col relative h-fit lg:h-full">
                <div className="aspect-video w-full h-full relative flex items-center justify-center">
                    {activeVideoId ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                            title={activeVideo?.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-4">
                            <PlayCircle className="w-16 h-16 opacity-20" />
                            <p className="text-sm font-medium">Select a lesson to begin</p>
                        </div>
                    )}
                </div>
                {/* Desktop Video Info Overlay */}
                <div className="p-4 bg-zinc-950/50 backdrop-blur-sm border-t border-white/5 hidden lg:block">
                    <h2 className="text-lg font-bold text-white truncate">{activeVideo?.title || course.title}</h2>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-1">{course.title} • {course.subject}</p>
                </div>
            </div>

            {/* Playlist Panel */}
            <div className="w-full lg:w-[400px] flex flex-col h-[40vh] lg:h-full bg-zinc-900 border-t lg:border-t-0 lg:border-l border-white/10 shrink-0">
                <div className="p-4 border-b border-white/10 bg-zinc-950/80 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black text-white tracking-tight uppercase">Course Contents</h2>
                        <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{course.chapters?.length || 0} Modules Available</p>
                    </div>
                    <Badge variant="outline" className="border-primary/50 text-primary text-[9px] font-bold px-2 py-0">FREE</Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="pb-4">
                        {course.chapters && course.chapters.length > 0 ? (
                            course.chapters.map((chapter, cIdx) => (
                                <div key={`chapter-${cIdx}`} className="mt-2">
                                    <div className="px-4 py-2 bg-white/5 flex items-center gap-2">
                                        <div className="h-5 w-5 rounded-md bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                                            {cIdx + 1}
                                        </div>
                                        <h4 className="font-bold text-[11px] tracking-widest text-zinc-400 uppercase">{chapter.name}</h4>
                                    </div>
                                    <div className="flex flex-col">
                                        {chapter.videos.map((video, vIdx) => (
                                            <VideoItem
                                                key={`video-${cIdx}-${vIdx}`}
                                                video={video}
                                                isActive={activeVideo?.youtubeLink === video.youtubeLink}
                                                onSelect={() => setActiveVideo(video)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-600">
                                <BookOpen className="w-10 h-10 opacity-10 mb-2" />
                                <p className="text-xs font-bold">No content uploaded</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                {/* Branding Footer in Playlist */}
                <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={16} height={16} className="opacity-50" />
                    <span className="text-[9px] font-bold text-zinc-600 tracking-[0.2em] uppercase">Powered by IDL Education</span>
                </div>
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
                  <Card key={course.id} className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col bg-card border group/card relative">
                    <div className="relative overflow-hidden aspect-[16/9]">
                        <GcsImage
                            filePath={course.coverImageUrl || ""}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <CardTitleUI className="text-base font-bold text-foreground leading-tight mb-3 line-clamp-2 group-hover/card:text-primary transition-colors">{course.title}</CardTitleUI>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="secondary" className="rounded-md bg-primary/5 text-primary border-none font-bold uppercase text-[9px] tracking-widest">{course.batchName}</Badge>
                            <Badge variant="outline" className="rounded-md border-muted-foreground/20 text-muted-foreground text-[9px] tracking-widest font-bold uppercase">{course.medium}</Badge>
                        </div>

                        <div className="text-[10px] text-muted-foreground mt-1 space-y-1.5 font-bold uppercase tracking-tight">
                          <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Validity: <span className="text-foreground">{course.validity}</span></p>
                          <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Subject: <span className="text-foreground">{course.subject}</span></p>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                                <p className="text-xl font-black text-primary">₹{course.price}</p>
                                {course.originalPrice > 0 && <p className="text-xs text-muted-foreground line-through opacity-50 font-bold">₹{course.originalPrice}</p>}
                            </div>
                            <div className="bg-green-500/10 text-green-600 text-[9px] font-black px-2 py-1 rounded mt-1.5 border border-green-500/20 uppercase tracking-tighter w-fit">
                                100% OFF
                            </div>
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary hover:text-white transition-all h-8 w-8">
                                    <Info className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-4 rounded-xl bg-background/95 backdrop-blur-xl border-white/20 shadow-2xl" align="end">
                                <h4 className="font-black text-[10px] mb-2 text-primary uppercase tracking-widest">About this course</h4>
                                <ScrollArea className="max-h-40">
                                    <p className="text-[10px] text-foreground font-medium leading-relaxed whitespace-pre-wrap opacity-80">
                                        {course.description}
                                    </p>
                                </ScrollArea>
                                <div className="mt-4 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-green-600">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Lifetime Access</span>
                                    </div>
                                </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                    </CardContent>

                    <div className="p-6 pt-0 mt-auto">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn text-xs tracking-widest">
                                    <PlayCircle className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                                    VIEW LESSONS
                                </Button>
                            </DialogTrigger>
                            <CoursePlayerDialog course={course} />
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
