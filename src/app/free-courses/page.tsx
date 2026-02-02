'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

const videos = [
  {
    title: "Introduction to Polynomials",
    subject: "Mathematics",
    thumbnail: "https://picsum.photos/seed/video1/800/450",
    hint: "math equations"
  },
  {
    title: "The Fundamental Unit of Life",
    subject: "Science",
    thumbnail: "https://picsum.photos/seed/video2/800/450",
    hint: "cell biology"
  },
  {
    title: "The French Revolution",
    subject: "History",
    thumbnail: "https://picsum.photos/seed/video3/800/450",
    hint: "french revolution"
  },
];

export default function FreeCoursesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
          CLASS IX CBSE Board
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Enjoy these free video lessons to get a taste of our quality education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
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
              <h3 className="font-bold text-lg">{video.title}</h3>
              <p className="text-sm text-muted-foreground">{video.subject}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
