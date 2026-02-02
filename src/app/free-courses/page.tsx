
'use client';

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, ListVideo, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
                        <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted cursor-pointer">
                            <div className="relative h-16 w-28 flex-shrink-0">
                                <Image 
                                    src={video.thumbnail}
                                    alt={video.title}
                                    data-ai-hint={video.hint}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <h3 className="font-semibold text-sm flex-grow">{video.title}</h3>
                            <PlayCircle className="w-6 h-6 text-muted-foreground" />
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Class 9th CBSE Board
            </span>
          </h1>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4">
          {Object.entries(orderedPlaylists).map(([subject, videos]) => (
            <Card key={subject} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col w-80 flex-shrink-0 bg-card">
              <div className="relative group">
                  <div className="relative w-full aspect-video">
                      <Image
                          src={videos[0].thumbnail}
                          alt={subject}
                          data-ai-hint={videos[0].hint}
                          fill
                          className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-16 h-16 text-white/80" />
                      </div>
                  </div>
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                  <CardTitle className="text-base font-bold text-foreground leading-tight h-10">{subject} for Class 9th</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">PRARAMBH BATCH 2.O</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Validity: Till Exam</p>
                  <p className="text-xs text-muted-foreground mt-1">Medium: Hindi</p>
                  <p className="text-xs text-muted-foreground mt-1">Mode: Recoded</p>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">₹{videos[0].price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground line-through">₹{videos[0].originalPrice}</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mt-2 flex items-center gap-1 w-fit">
                        <Tag className="w-3 h-3" />
                        <span>Discount of 100% applied</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">(FULL COURSE)</p>
                  </div>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Class 10th CBSE Board
            </span>
          </h1>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4">
          {Object.entries(orderedPlaylistsClass10).map(([subject, videos]) => (
            <Card key={subject} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col w-80 flex-shrink-0 bg-card">
              <div className="relative group">
                  <div className="relative w-full aspect-video">
                      <Image
                          src={videos[0].thumbnail}
                          alt={subject}
                          data-ai-hint={videos[0].hint}
                          fill
                          className="object-cover"
                      />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-16 h-16 text-white/80" />
                      </div>
                  </div>
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                  <CardTitle className="text-base font-bold text-foreground leading-tight h-10">{subject} for Class 10th</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">PRARAMBH BATCH 2.O</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Validity: Till Exam</p>
                  <p className="text-xs text-muted-foreground mt-1">Medium: Hindi</p>
                  <p className="text-xs text-muted-foreground mt-1">Mode: Recoded</p>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-primary">₹0000.00</p>
                      <p className="text-sm text-muted-foreground line-through">₹9999</p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mt-2 flex items-center gap-1 w-fit">
                        <Tag className="w-3 h-3" />
                        <span>Discount of 100% applied</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">(FULL COURSE)</p>
                  </div>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
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
