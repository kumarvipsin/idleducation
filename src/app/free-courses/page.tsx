
'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

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

export default function FreeCoursesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
          CLASS IX CBSE Board
        </h1>
      </div>

      <Accordion type="multiple" defaultValue={["Science"]} className="w-full space-y-4">
        {Object.entries(playlists).map(([subject, videos]) => (
          <AccordionItem value={subject} key={subject} className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="p-4 text-xl font-semibold hover:no-underline">{subject}</AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                        <div className="relative w-full aspect-video">
                          <Image 
                            src={video.thumbnail}
                            alt={video.title}
                            data-ai-hint={video.hint}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-16 h-16 text-white" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-base line-clamp-2 h-12">{video.title}</h3>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <VideoPlayer videoId={video.videoId} title={video.title} />
                  </Dialog>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
