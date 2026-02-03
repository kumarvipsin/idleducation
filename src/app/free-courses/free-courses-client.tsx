'use client';

import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFreeCourse } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Dialog component to display a course playlist and video player.
 */
const PlaylistDialog = ({ course }: { course: TFreeCourse }) => {
    const allVideos = useMemo(() => course.chapters?.flatMap(chapter => 
        chapter.videos.map(video => ({ ...video, chapterName: chapter.name }))
    ) || [], [course.chapters]);

    const [selectedVideo, setSelectedVideo] = useState(allVideos[0] || null);

    useEffect(() => {
        if (!selectedVideo && allVideos.length > 0) {
            setSelectedVideo(allVideos[0]);
        }
    }, [allVideos, selectedVideo]);

    const selectedVideoId = selectedVideo?.youtubeLink.split('v=')[1]?.split('&')[0];

    return (
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col md:flex-row p-0 overflow-hidden">
            <DialogHeader className="sr-only">
                <DialogTitle>{course.title} - Video Playlist</DialogTitle>
                <DialogDescription>Watch free video lessons for {course.title}</DialogDescription>
            </DialogHeader>
            
            {/* Left side: Video Player */}
            <div className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col">
                <div className="w-full aspect-video bg-black shrink-0 relative">
                    {selectedVideoId ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                            title={selectedVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black p-8 text-center">
                            <PlayCircle className="w-16 h-16 opacity-20 mb-4" />
                            <p>No video selected or available.</p>
                        </div>
                    )}
                </div>
                <div className="p-6 border-b md:border-b-0 md:border-t overflow-y-auto flex-grow bg-card">
                    <h2 className="text-2xl font-bold tracking-tight">{selectedVideo?.title || course.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">{selectedVideo?.chapterName || course.batchName}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{course.description}</p>
                </div>
            </div>
            
            {/* Right side: Playlist */}
            <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col overflow-hidden border-l bg-muted/10">
                <div className="p-4 border-b bg-card">
                    <h3 className="font-bold text-lg">Course Content</h3>
                    <p className="text-xs text-muted-foreground">{allVideos.length} Lessons available</p>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {course.chapters?.map((chapter, cIdx) => (
                            <div key={`chapter-${cIdx}`} className="mb-4">
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground p-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b mb-2">{chapter.name}</h4>
                                {chapter.videos.map((video, vIdx) => {
                                    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
                                    if (!videoId) return null;
                                    return (
                                        <button 
                                            key={`video-${cIdx}-${vIdx}`} 
                                            onClick={() => setSelectedVideo({...video, chapterName: chapter.name})}
                                            className={cn(
                                                "w-full text-left flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-all duration-200 group/item",
                                                selectedVideo?.youtubeLink === video.youtubeLink && "bg-muted shadow-sm"
                                            )}
                                        >
                                            <div className="relative h-16 w-28 rounded-md overflow-hidden shrink-0 shadow-sm">
                                                <Image
                                                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover group-hover/item:scale-105 transition-transform"
                                                />
                                                {selectedVideo?.youtubeLink === video.youtubeLink && (
                                                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                                                        <PlayCircle className="w-6 h-6 text-white animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className={cn(
                                                    "text-sm font-semibold leading-tight line-clamp-2",
                                                    selectedVideo?.youtubeLink === video.youtubeLink ? "text-primary" : "text-foreground"
                                                )}>{video.title}</p>
                                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                                                    <PlayCircle className="w-3 h-3" />
                                                    <span>Watch Lesson</span>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
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
      {Object.entries(groupedCourses).map(([groupTitle, groupCourses]) => (
        <section key={groupTitle} className="mb-16">
          <div className="mb-12 text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="relative inline-block">
                  <span className="relative z-10">{groupTitle}</span>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-11/12 h-2.5 z-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-full">
                          <path d="M0,4 C25,0,75,8,100,4" stroke="#fcd34d" strokeWidth="4" fill="none" />
                      </svg>
                  </span>
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupCourses.map((course) => (
              <Card key={course.id} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-card border-none ring-1 ring-border">
                <div className="relative group overflow-hidden">
                    <div className="relative w-full aspect-video">
                        <GcsImage
                            filePath={course.coverImageUrl || "https://picsum.photos/seed/default/800/450"}
                            alt={course.subject}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                         <div className="absolute top-3 left-3">
                            <Badge className="bg-primary hover:bg-primary text-white font-bold px-3 py-1 rounded-full shadow-lg">FREE COURSE</Badge>
                         </div>
                    </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                    <CardTitleUI className="text-xl font-bold text-foreground leading-tight mb-3 line-clamp-2 h-14">{course.title}</CardTitleUI>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="secondary" className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-none font-semibold uppercase text-[10px] tracking-wider">{course.batchName}</Badge>
                        <Badge variant="outline" className="rounded-full border-muted-foreground/20 text-muted-foreground text-[10px] tracking-wider uppercase">{course.medium}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Validity: <strong>{course.validity}</strong></p>
                      <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Subject: <strong>{course.subject}</strong></p>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black text-primary">₹{course.price}</p>
                        {course.originalPrice > 0 && <p className="text-sm text-muted-foreground line-through decoration-destructive/50">₹{course.originalPrice}</p>}
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full mt-2 flex items-center gap-1.5 w-fit border border-green-100 dark:border-green-900/30">
                          <Tag className="w-3 h-3" />
                          <span>100% DISCOUNT APPLIED</span>
                      </div>
                       <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-xs p-0 h-auto mt-4 text-muted-foreground hover:text-primary transition-colors">Course Overview & Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">{course.title}</DialogTitle>
                                <DialogDescription className="mt-4 text-sm text-muted-foreground leading-relaxed">
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
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                <PlayCircle className="w-5 h-5 mr-2" />
                                VIEW COURSE
                            </Button>
                        </DialogTrigger>
                        <PlaylistDialog course={course} />
                    </Dialog>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
