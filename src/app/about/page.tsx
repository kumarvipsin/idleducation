import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, BookOpen, UserCheck, Star, PenSquare, UserCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AboutPage() {
  const carouselImages = [
    { src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80", alt: "Team working together", hint: "team collaboration" },
    { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80", alt: "Modern classroom environment", hint: "modern classroom" },
    { src: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80", alt: "Student using the platform", hint: "student learning" },
    { src: "https://placehold.co/600x400.png", alt: "Collaborative session", hint: "team meeting" },
    { src: "https://placehold.co/600x400.png", alt: "Teacher helping student", hint: "teacher student" },
    { src: "https://placehold.co/600x400.png", alt: "Modern office interior", hint: "office interior" },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="my-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Director</h2>
        </div>
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 bg-primary/10 p-8 flex flex-col items-center justify-center text-center">
              <Avatar className="w-48 h-48 mb-4 border-4 border-primary shadow-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8dGVhY2hlciUyMHByb2ZpbGV8ZW58MHx8fHwxNzU1OTY3MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Director's Photo" data-ai-hint="professional headshot" />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold text-primary">Dr. Evelyn Reed</h1>
              <p className="text-lg text-foreground/80 mt-1">Director & Founder</p>
            </div>
            <div className="md:col-span-2 p-8">
              <Tabs defaultValue="message" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="message">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Director's Message
                  </TabsTrigger>
                  <TabsTrigger value="biography">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Biography
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="message" className="mt-6 text-foreground/90 leading-relaxed">
                  <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                    "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the best tools for both our dedicated educators and our ambitious students. Together, we are not just learning; we are shaping the future."
                  </blockquote>
                </TabsContent>
                <TabsContent value="biography" className="mt-6 text-foreground/90 leading-relaxed space-y-4">
                  <p>
                    Dr. Evelyn Reed is a visionary in the field of educational technology with over two decades of experience. Holding a Ph.D. in Education from Stanford University, she has dedicated her career to exploring the intersection of technology and learning.
                  </p>
                  <p>
                    Before founding IDL EDUCATION, Dr. Reed was a celebrated professor and led several successful ed-tech initiatives that have been adopted by institutions worldwide. Her research on digital pedagogy is widely published, and she is a frequent keynote speaker at global education conferences. Dr. Reed's passion for accessible and effective education is the cornerstone of IDL EDUCATION's mission.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-8 items-center">
        <div>
          <Carousel className="w-full max-w-xl mx-auto" opts={{ loop: true }}>
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                    <Image
                      src={image.src}
                      data-ai-hint={image.hint}
                      alt={image.alt}
                      width={600}
                      height={400}
                      className="rounded-xl object-cover w-full aspect-video"
                    />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Target className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                To empower educators and inspire students by creating a seamless, accessible, and engaging digital learning environment. We believe that technology can bridge gaps in education and unlock the full potential of every learner.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Eye className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                To become the leading platform for online education, known for our commitment to quality, innovation, and user success. We envision a future where learning is not confined to classrooms, but is a lifelong journey of discovery.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center">
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}
