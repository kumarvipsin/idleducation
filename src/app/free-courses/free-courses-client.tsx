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
            <DialogTitle className="sr-only">{course.title} - Video Playlist</DialogTitle>
            <DialogDescription className="sr-only">Watch free video lessons for {course.title}</DialogDescription>
            
            {/* Left side: Video Player */}
            <div className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col">
                <div className="w-full aspect-video bg-black shrink-0">
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
                        <div className="w-full h-full flex items-center justify-center text-white bg-black">
                            <p>No video selected or available.</p>
                        </div>
                    )}
                </div>
                <div className="p-4 border-b md:border-b-0 md:border-t overflow-y-auto flex-grow">
                    <h2 className="text-xl font-bold">{selectedVideo?.title || course.title}</h2>
                    <p className="text-sm text-muted-foreground mt-2">{selectedVideo?.chapterName || course.description}</p>
                </div>
            </div>
            
            {/* Right side: Playlist */}
            <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col overflow-hidden border-l">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="font-bold">Course Content</h3>
                    <p className="text-xs text-muted-foreground">{allVideos.length} Lessons</p>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {course.chapters?.map((chapter, cIdx) => (
                            <div key={`chapter-${cIdx}`}>
                                <h4 className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground p-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10">{chapter.name}</h4>
                                {chapter.videos.map((video, vIdx) => {
                                    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
                                    if (!videoId) return null;
                                    return (
                                        <button 
                                            key={`video-${cIdx}-${vIdx}`} 
                                            onClick={() => setSelectedVideo({...video, chapterName: chapter.name})}
                                            className={cn(
                                                "w-full text-left flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors",
                                                selectedVideo?.youtubeLink === video.youtubeLink && "bg-muted"
                                            )}
                                        >
                                            <div className="relative h-16 w-28 rounded-md overflow-hidden shrink-0">
                                                <Image
                                                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {selectedVideo?.youtubeLink === video.youtubeLink && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <PlayCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className={cn(
                                                    "text-sm font-semibold leading-tight line-clamp-2",
                                                    selectedVideo?.youtubeLink === video.youtubeLink ? "text-primary" : "text-foreground"
                                                )}>{video.title}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">{chapter.name}</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupCourses.map((course) => (
              <Card key={course.id} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
                <div className="relative group">
                    <div className="relative w-full aspect-video">
                        <GcsImage
                            filePath={course.coverImageUrl || "https://picsum.photos/seed/default/800/450"}
                            alt={course.subject}
                            fill
                            className="object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                </div>
                <CardContent className="p-3 flex flex-col flex-grow">
                    <CardTitleUI className="text-base font-bold text-foreground leading-tight mb-2">{course.subject} for {course.class}</CardTitleUI>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{course.batchName}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                      <p>Validity: {course.validity}</p>
                      <p>Medium: {course.medium}</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-primary">₹{course.price}</p>
                        {course.originalPrice > 0 && <p className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</p>}
                      </div>
                      <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mt-1 flex items-center gap-1 w-fit">
                          <Tag className="w-3 h-3" />
                          <span>Discount of {course.originalPrice > 0 ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 100}% applied</span>
                      </div>
                       <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-xs p-0 h-auto mt-1 text-muted-foreground hover:text-primary">View Full Course Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{course.class} {course.subject} – Free Complete Chapter Offline Course</DialogTitle>
                                <DialogDescription>
                                    <div className="space-y-2 mt-2 text-sm text-left text-muted-foreground">
                                        <p>{course.description}</p>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                </CardContent>
                <div className="p-3 pt-0 mt-auto">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-primary hover:bg-primary/90">View Course</Button>
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
