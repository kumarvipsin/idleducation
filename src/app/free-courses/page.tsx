'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, ListVideo } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const playlists = {
  "Science": [
    {
      title: "The Fundamental Unit of Life",
      videoId: "mKEz0NVA7bA", // Example video ID
      thumbnail: "https://picsum.photos/seed/video2/800/450",
      hint: "cell biology"
    },
    {
      title: "Atoms and Molecules",
      videoId: "5zprgDRqL3M", // Example video ID
      thumbnail: "https://picsum.photos/seed/science2/800/450",
      hint: "atomic structure"
    }
  ],
  "Mathematics": [
    {
      title: "Introduction to Polynomials",
      videoId: "O3a-bX53NAc", // Example video ID
      thumbnail: "https://picsum.photos/seed/video1/800/450",
      hint: "math equations"
    },
    {
      title: "Linear Equations in Two Variables",
      videoId: "N-4_g2hhn0k", // Example video ID
      thumbnail: "https://picsum.photos/seed/math2/800/450",
      hint: "graphs equations"
    }
  ],
  "Social Studies": [
    {
      title: "The French Revolution",
      videoId: "IIDzc-VE_fE", // Example video ID
      thumbnail: "https://picsum.photos/seed/video3/800/450",
      hint: "french revolution"
    },
    {
      title: "India: Size and Location",
      videoId: "f8qYCp_e4fE", // Example video ID
      thumbnail: "https://picsum.photos/seed/social2/800/450",
      hint: "india map"
    }
  ],
};

const playlistsClass10 = {
  "Science": [
    {
      title: "Chemical Reactions and Equations",
      videoId: "Q6bY-J2Vj-E",
      thumbnail: "https://picsum.photos/seed/c10science1/800/450",
      hint: "chemistry reaction"
    },
    {
      title: "Life Processes",
      videoId: "vG1-BBUXjB8",
      thumbnail: "https://picsum.photos/seed/c10science2/800/450",
      hint: "biology human body"
    }
  ],
  "Mathematics": [
    {
      title: "Real Numbers",
      videoId: "oeO6z21u2yI",
      thumbnail: "https://picsum.photos/seed/c10math1/800/450",
      hint: "math numbers"
    },
    {
      title: "Triangles",
      videoId: "F_5gvi2A-A0",
      thumbnail: "https://picsum.photos/seed/c10math2/800/450",
      hint: "geometry triangles"
    }
  ],
  "Social Studies": [
    {
      title: "The Rise of Nationalism in Europe",
      videoId: "91o0e5x73fI",
      thumbnail: "https://picsum.photos/seed/c10social1/800/450",
      hint: "europe history map"
    },
    {
      title: "Resources and Development",
      videoId: "Yv2yQ_tH6y0",
      thumbnail: "https://picsum.photos/seed/c10social2/800/450",
      hint: "earth resources"
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
            <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">(FREE COURSES)</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
              A curated collection of free video lessons to help you excel in your studies.
          </p>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4">
          {Object.entries(orderedPlaylists).map(([subject, videos]) => (
            <Dialog key={subject}>
              <DialogTrigger asChild>
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex-shrink-0 w-80">
                      <div className="relative w-full aspect-video">
                      <Image 
                          src={videos[0].thumbnail} // Use first video's thumbnail as cover
                          alt={subject}
                          data-ai-hint={videos[0].hint}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                          <h2 className="text-2xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{subject}</h2>
                      </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ListVideo className="w-16 h-16 text-white/80" />
                      </div>
                      </div>
                  </Card>
              </DialogTrigger>
              <PlaylistDialog subject={subject} videos={videos} />
            </Dialog>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-12 text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Class 10th CBSE Board
            </span>
             <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">(FREE COURSES)</span>
          </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A curated collection of free video lessons to help you excel in your studies.
            </p>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-4">
          {Object.entries(orderedPlaylistsClass10).map(([subject, videos]) => (
            <Dialog key={subject}>
              <DialogTrigger asChild>
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer flex-shrink-0 w-80">
                      <div className="relative w-full aspect-video">
                      <Image 
                          src={videos[0].thumbnail} // Use first video's thumbnail as cover
                          alt={subject}
                          data-ai-hint={videos[0].hint}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                          <h2 className="text-2xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{subject}</h2>
                      </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ListVideo className="w-16 h-16 text-white/80" />
                      </div>
                      </div>
                  </Card>
              </DialogTrigger>
              <PlaylistDialog subject={subject} videos={videos} />
            </Dialog>
          ))}
        </div>
      </section>
    </div>
  );
}
