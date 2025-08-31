
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const carouselImages = [
    { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Students collaborating", hint: "students collaborating" },
    { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Students learning on laptops", hint: "students learning" },
    { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Teacher with students", hint: "teacher students" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Classroom lecture", hint: "classroom lecture" },
    { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8c3R1ZGVudHxlbnwwfHx8fDE3NTYwNzE3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Team meeting in office", hint: "team meeting" },
    { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8Y2xhc3Nyb29tfGVufDB8fHx8MTc1NjEwNDM5OHww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Modern study area", hint: "classroom" },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="my-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">About Us</h2>
           <Button asChild className="mt-6">
            <Link href="/director">Meet Our Director</Link>
          </Button>
        </div>
      </section>

      <section className="my-12">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full border shadow-sm">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Our Mission</h3>
                <p className="text-foreground/80 leading-relaxed">
                  To empower educators and inspire students by creating a seamless, accessible, and engaging digital learning environment. We believe that technology can bridge gaps in education and unlock the full potential of every learner.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full border shadow-sm">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Our Vision</h3>
                <p className="text-foreground/80 leading-relaxed">
                  To become the leading platform for online education, known for our commitment to quality, innovation, and user success. We envision a future where learning is not confined to classrooms, but is a lifelong journey of discovery.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="text-center my-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 flex items-center justify-center gap-4">
          <Users className="w-8 h-8" /> Our Workspace
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Image
                    src={image.src}
                    data-ai-hint={image.hint}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="rounded-xl object-cover w-full aspect-video"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </section>
    </div>
  );
}
