'use client';

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, ListVideo, Tag, Youtube } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TFreeCourse, TFreeCourseChapter } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
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
        <DialogContent className="max-w-4xl p-0 h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                {/* Video Player & Info */}
                <div className="md:col-span-2 flex flex-col">
                    <div className="aspect-video w-full bg-black">
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
                     <div className="p-4 border-t">
                        <h2 className="text-xl font-bold">{selectedVideo?.title || course.title}</h2>
                        <p className="text-sm text-muted-foreground">{selectedVideo?.chapterName || course.description}</p>
                    </div>
                </div>

                {/* Playlist */}
                <div className="md:col-span-1 border-l flex flex-col">
                    <DialogHeader className="p-4 border-b shrink-0">
                        <DialogTitle>Course Playlist</DialogTitle>
                        <DialogDescription>{course.title}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-grow">
                        <div className="p-2 space-y-1">
                            {course.chapters?.map(chapter => (
                                <div key={chapter.name}>
                                    <h4 className="font-semibold text-sm p-2 sticky top-0 bg-background/95 backdrop-blur-sm z-10">{chapter.name}</h4>
                                    {chapter.videos.map(video => {
                                        const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
                                        if (!videoId) return null;
                                        return (
                                            <button 
                                                key={video.youtubeLink} 
                                                onClick={() => setSelectedVideo({...video, chapterName: chapter.name})}
                                                className={cn(
                                                    "w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                                                    selectedVideo?.youtubeLink === video.youtubeLink && "bg-muted"
                                                )}
                                            >
                                                <div className="relative h-10 w-16 rounded overflow-hidden shrink-0">
                                                    <Image
                                                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-xs font-medium truncate">{video.title}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
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
                    <CardTitle className="text-base font-bold text-foreground leading-tight mb-2">{course.subject} for {course.class}</CardTitle>
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
                                        <div>{course.description}</div>
                                        <div className="font-semibold pt-2 text-foreground">🔹 Course Highlights:</div>
                                        <ul className="list-none space-y-1 pl-4">
                                            <li>✅ Complete {course.class} {course.subject} syllabus</li>
                                            <li>✅ 100% FREE Offline Classes</li>
                                            <li>✅ Chapter-wise Recorded Videos – Free Access</li>
                                            <li>✅ Concept-based & Exam-focused Teaching</li>
                                            <li>✅ Notes and Doubt Support</li>
                                            <li>✅ Course Validity Till Final Exam</li>
                                        </ul>
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
