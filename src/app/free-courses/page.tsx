'use client';

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, ListVideo, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const playlists = {
  "Science": [
    {
      title: "The Fundamental Unit of Life",
      videoId: "mKEz0NVA7bA", // Example video ID
      thumbnail: "https://picsum.photos/seed/video2/800/450",
      hint: "cell biology",
      price: 0,
      originalPrice: 9999,
      discount: 100
    },
    {
      title: "Atoms and Molecules",
      videoId: "5zprgDRqL3M", // Example video ID
      thumbnail: "https://picsum.photos/seed/science2/800/450",
      hint: "atomic structure",
      price: 0,
      originalPrice: 9999,
      discount: 100
    }
  ],
  "Mathematics": [
    {
      title: "Introduction to Polynomials",
      videoId: "O3a-bX53NAc", // Example video ID
      thumbnail: "https://picsum.photos/seed/video1/800/450",
      hint: "math equations",
      price: 0,
      originalPrice: 9999,
      discount: 100
    },
    {
      title: "Linear Equations in Two Variables",
      videoId: "N-4_g2hhn0k", // Example video ID
      thumbnail: "https://picsum.photos/seed/math2/800/450",
      hint: "graphs equations",
      price: 0,
      originalPrice: 9999,
      discount: 100
    }
  ],
  "Social Studies": [
    {
      title: "The French Revolution",
      videoId: "IIDzc-VE_fE", // Example video ID
      thumbnail: "https://picsum.photos/seed/video3/800/450",
      hint: "french revolution",
      price: 0,
      originalPrice: 9999,
      discount: 100
    },
    {
      title: "India: Size and Location",
      videoId: "f8qYCp_e4fE", // Example video ID
      thumbnail: "https://picsum.photos/seed/social2/800/450",
      hint: "india map",
      price: 0,
      originalPrice: 9999,
      discount: 100
    }
  ],
};

const playlistsClass10 = {
  "Science": [
    {
      title: "Chemical Reactions and Equations",
      videoId: "Q6bY-J2Vj-E",
      thumbnail: "https://picsum.photos/seed/c10science1/800/450",
      hint: "chemistry reaction",
      price: 0,
      originalPrice: 9999,
      discount: 100
    },
    {
      title: "Life Processes",
      videoId: "vG1-BBUXjB8",
      thumbnail: "https://picsum.photos/seed/c10science2/800/450",
      hint: "biology human body",
      price: 0,
      originalPrice: 9999,
      discount: 100
    }
  ],
  "Mathematics": [
    {
      title: "Real Numbers",
      videoId: "oeO6z21u2yI",
      thumbnail: "https://picsum.photos/seed/c10math1/800/450",
      hint: "math numbers",
      price: 0,
      originalPrice: 9999,
      discount: 100
    },
    {
      title: "Triangles",
      videoId: "F_5gvi2A-A0",
      thumbnail: "https://picsum.photos/seed/c10math2/800/450",
      hint: "geometry triangles",
      price: 0,
      originalPrice: 9999,
      discount: 100
    }
  ],
  "Social Studies": [
    {
      title: "The Rise of Nationalism in Europe",
      videoId: "91o0e5x73fI",
      thumbnail: "https://picsum.photos/seed/c10social1/800/450",
      hint: "europe history map",
      price: 0,
      originalPrice: 9999,
      discount: 100
    },
    {
      title: "Resources and Development",
      videoId: "Yv2yQ_tH6y0",
      thumbnail: "https://picsum.photos/seed/c10social2/800/450",
      hint: "earth resources",
      price: 0,
      originalPrice: 9999,
      discount: 100
    }
  ],
};

const VideoPlayer = ({ videoId, title }: { videoId: string; title: string }) => (
  <DialogContent className="max-w-3xl p-0">
    <DialogHeader className="p-4">
        <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    <div className="aspect-video">
        <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`YouTube video player for ${title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        ></iframe>
    </div>
  </DialogContent>
);

const PlaylistDialog = ({ subject, videos }: { subject: string, videos: any[] }) => (
    <DialogContent className="sm:max-w-lg">
        <DialogHeader>
            <DialogTitle className="text-2xl">{subject}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-2 p-1">
            {videos.map((video, index) => (
                <Dialog key={index}>
                    <DialogTrigger asChild>
                        <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors w-full">
                            <div className="relative h-16 w-28 flex-shrink-0">
                                <Image
                                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                    alt={video.title}
                                    fill
                                    className="object-cover rounded-md"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-md">
                                    <PlayCircle className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-sm flex-grow text-left">{video.title}</h3>
                        </div>
                    </DialogTrigger>
                    <VideoPlayer videoId={video.videoId} title={video.title} />
                </Dialog>
            ))}
        </div>
    </DialogContent>
);


export default function FreeCoursesPage() {
  // Re-ordering playlists to have Science first.
  const orderedPlaylists = {
    "Science": playlists["Science"],
    ...Object.fromEntries(Object.entries(playlists).filter(([key]) => key !== "Science"))
  };

  const orderedPlaylistsClass10 = {
    "Science": playlistsClass10["Science"],
    ...Object.fromEntries(Object.entries(playlistsClass10).filter(([key]) => key !== "Science"))
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="mb-16">
        <div className="mb-12 text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="relative inline-block">
                <span className="relative z-10">Class 9th CBSE Board</span>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-11/12 h-2.5 z-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,4 C25,0,75,8,100,4" stroke="#fcd34d" strokeWidth="4" fill="none" />
                    </svg>
                </span>
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(orderedPlaylists).map(([subject, videos]) => (
            <Card key={subject} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
              <div className="relative group">
                  <div className="relative w-full aspect-video">
                      <Image
                          src={videos[0].thumbnail}
                          alt={subject}
                          data-ai-hint={videos[0].hint}
                          fill
                          className="object-cover"
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      </div>
                  </div>
              </div>
              <CardContent className="p-3 flex flex-col flex-grow">
                  <CardTitle className="text-base font-bold text-foreground leading-tight mb-2">{subject} for Class 9th</CardTitle>
                  <div className="flex items-center gap-2">
                      <Badge variant="secondary">PRARAMBH BATCH 2.O</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    <p>Validity: Till Exam</p>
                    <p>Medium: Hindi</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">₹0.00</p>
                      <p className="text-sm text-muted-foreground line-through">₹9999</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mt-1 flex items-center gap-1 w-fit">
                        <Tag className="w-3 h-3" />
                        <span>Discount of 100% applied</span>
                    </div>
                    <div className="mt-auto pt-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground hover:text-primary">View Full Course Details</Button>
                            </DialogTrigger>
                             <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Class 9 {subject} – Free Complete Chapter Offline Course</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="space-y-2 mt-2 text-sm text-left text-muted-foreground">
                                            <div>This FREE offline course is designed to cover all chapters of Class 9 {subject} in a clear and structured way. The course is fully exam-oriented and helps students build strong concepts for excellent exam performance.</div>
                                            <div className="font-semibold pt-2 text-foreground">🔹 Course Highlights:</div>
                                            <ul className="list-none space-y-1 pl-4">
                                                <li>✅ Complete Class 9 {subject} syllabus (All Chapters)</li>
                                                <li>✅ 100% FREE Offline Classes</li>
                                                <li>✅ Chapter-wise Recorded Videos – Free Access</li>
                                                <li>✅ Concept-based & Exam-focused Teaching</li>
                                                <li>✅ Notes and Doubt Support</li>
                                                <li>✅ Course Validity Till Final Exam</li>
                                            </ul>
                                            {subject === 'Science' && <div className="pt-2"><strong className="font-semibold text-foreground">🔹 Subjects Covered:</strong> Physics | Chemistry | Biology</div>}
                                            <div className="pt-2">This course is ideal for students who want a strong foundation, clear understanding, and confidence in exams—at no cost.</div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                  </div>
              </CardContent>
              <div className="p-3 pt-0 mt-auto">
                  <Dialog>
                      <DialogTrigger asChild>
                          <Button className="w-full bg-primary hover:bg-primary/90">View Course</Button>
                      </DialogTrigger>
                      <PlaylistDialog subject={subject} videos={videos} />
                  </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
       <section>
        <div className="mb-12 text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
             <span className="relative inline-block">
                <span className="relative z-10">Class 10th CBSE Board</span>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-11/12 h-2.5 z-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 8" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,4 C25,0,75,8,100,4" stroke="#fcd34d" strokeWidth="4" fill="none" />
                    </svg>
                </span>
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(orderedPlaylistsClass10).map(([subject, videos]) => (
            <Card key={subject} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
              <div className="relative group">
                  <div className="relative w-full aspect-video">
                      <Image
                          src={videos[0].thumbnail}
                          alt={subject}
                          data-ai-hint={videos[0].hint}
                          fill
                          className="object-cover"
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      </div>
                  </div>
              </div>
              <CardContent className="p-3 flex flex-col flex-grow">
                  <CardTitle className="text-base font-bold text-foreground leading-tight mb-2">{subject} for Class 10th</CardTitle>
                  <div className="flex items-center gap-2">
                      <Badge variant="secondary">PRARAMBH BATCH 2.O</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    <p>Validity: Till Exam</p>
                    <p>Medium: Hindi</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">₹0.00</p>
                      <p className="text-sm text-muted-foreground line-through">₹9999</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mt-1 flex items-center gap-1 w-fit">
                        <Tag className="w-3 h-3" />
                        <span>Discount of 100% applied</span>
                    </div>
                     <Dialog>
                      <DialogTrigger asChild>
                          <Button variant="link" className="text-xs p-0 h-auto mt-1 text-muted-foreground hover:text-primary">View Full Course Details</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                              <DialogTitle>Class 10 {subject} – Free Complete Chapter Offline Course</DialogTitle>
                              <DialogDescription>
                                    <div className="space-y-2 mt-2 text-sm text-left text-muted-foreground">
                                      <div>This FREE offline course is designed to cover all chapters of Class 10 {subject} in a clear and structured way. The course is fully exam-oriented and helps students build strong concepts for excellent exam performance.</div>
                                      <div className="font-semibold pt-2 text-foreground">🔹 Course Highlights:</div>
                                      <ul className="list-none space-y-1 pl-4">
                                          <li>✅ Complete Class 10 {subject} syllabus (All Chapters)</li>
                                          <li>✅ 100% FREE Offline Classes</li>
                                          <li>✅ Chapter-wise Recorded Videos – Free Access</li>
                                          <li>✅ Concept-based & Exam-focused Teaching</li>
                                          <li>✅ Notes and Doubt Support</li>
                                          <li>✅ Course Validity Till Final Exam</li>
                                      </ul>
                                      {subject === 'Science' && <div className="pt-2"><strong className="font-semibold text-foreground">🔹 Subjects Covered:</strong> Physics | Chemistry | Biology</div>}
                                      <div className="pt-2">This course is ideal for students who want a strong foundation, clear understanding, and confidence in exams—at no cost.</div>
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
                      <PlaylistDialog subject={subject} videos={videos} />
                  </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
