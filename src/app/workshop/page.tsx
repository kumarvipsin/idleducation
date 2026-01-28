'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholderImages from '@/app/lib/placeholder-images.json';

const upcomingWorkshops = [
  {
    title: "Advanced AI & Machine Learning",
    date: "August 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Online",
    description: "An in-depth workshop on the latest trends and techniques in AI and Machine Learning.",
    imageUrl: "https://picsum.photos/seed/workshop1/800/600",
    imageHint: "artificial intelligence"
  },
  {
    title: "Web Development Bootcamp",
    date: "September 5, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "IDL Delhi Center",
    description: "A hands-on bootcamp covering modern web development from frontend to backend.",
    imageUrl: "https://picsum.photos/seed/workshop2/800/600",
    imageHint: "web development"
  },
  {
    title: "Creative Writing Masterclass",
    date: "September 20, 2024",
    time: "1:00 PM - 3:00 PM",
    location: "Online",
    description: "Unlock your storytelling potential with our creative writing masterclass.",
    imageUrl: "https://picsum.photos/seed/workshop3/800/600",
    imageHint: "writing person"
  }
];

const previousWorkshopPhotos = [
  {
    src: "https://picsum.photos/seed/prev_ws1/600/400",
    alt: "Students participating in a workshop",
    hint: "students workshop"
  },
  {
    src: "https://picsum.photos/seed/prev_ws2/600/400",
    alt: "A speaker presenting at a workshop",
    hint: "speaker presentation"
  },
  {
    src: "https://picsum.photos/seed/prev_ws3/600/400",
    alt: "Group activity during a workshop",
    hint: "group activity"
  },
  {
    src: "https://picsum.photos/seed/prev_ws4/600/400",
    alt: "Networking session at a workshop",
    hint: "people networking"
  }
];

export default function WorkshopPage() {
  return (
    <div className="bg-background">
      <section className="relative py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/workshop-hero/1920/1080"
            alt="Workshop hero background"
            data-ai-hint="workshop collaboration"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">IDL Workshops</h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Hands-on, interactive learning experiences designed to build practical skills and ignite curiosity.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">What is a Workshop All About?</h2>
              <p className="text-muted-foreground leading-relaxed">
                IDL workshops are intensive, focused sessions where students engage directly with experts and peers. Unlike traditional lectures, our workshops are built around hands-on activities, collaborative projects, and real-world problem-solving. It's an opportunity to dive deep into a specific subject, develop practical skills, and get personalized feedback in a dynamic and supportive environment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether it's a coding bootcamp, a creative writing masterclass, or a science experiment marathon, our workshops are designed to be fun, engaging, and highly educational.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src="https://picsum.photos/seed/what-is-workshop/800/600"
                    alt="Students in a workshop"
                    data-ai-hint="students workshop interaction"
                    fill
                    className="object-cover"
                />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Upcoming Workshops</h2>
              <p className="text-muted-foreground mt-2">Don't miss out on these learning opportunities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingWorkshops.map((workshop, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative w-full aspect-video">
                  <Image
                    src={workshop.imageUrl}
                    alt={workshop.title}
                    data-ai-hint={workshop.imageHint}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{workshop.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground h-16">{workshop.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /><span>{workshop.date}</span></div>
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /><span>{workshop.time}</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4 text-primary" /><span>{workshop.location}</span></div>
                  <Button className="w-full mt-4">
                    Register Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">From Our Previous Workshops</h2>
              <p className="text-muted-foreground mt-2">A glimpse into our vibrant learning community.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previousWorkshopPhotos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md group">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    data-ai-hint={photo.hint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/gallery?category=Workshops">View Full Gallery</Link>
              </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
