import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BookOpen, BarChart3, Upload, Users, Download, Star, Award, UserCheck } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SelectionsChart } from "@/components/selections-chart";

export default function Home() {
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1609660100545-05f3799a941b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb25hbHxlbnwwfHx8fDE3NTU5NjA1MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Student learning online",
      hint: "online learning"
    },
    {
      src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb258ZW58MHx8fHwxNzU1OTYwNTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Graduation ceremony",
      hint: "graduation success"
    },
    {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdHVkZW50c3xlbnwwfHx8fDE3NTU5NjA1MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Students collaborating",
      hint: "student collaboration"
    }
  ];

  const stats = [
    { value: "200,000+", label: "Downloads", icon: <Download className="h-10 w-10 text-white/80" /> },
    { value: "500+", label: "UPSC Civils Ranks", icon: <Award className="h-10 w-10 text-white/80" /> },
    { value: "1,000+", label: "APPSC & TSPSC Ranks", icon: <Star className="h-10 w-10 text-white/80" /> },
    { value: "500,000+", label: "Aspirants Impacted", icon: <UserCheck className="h-10 w-10 text-white/80" /> },
  ];

  return (
    <div className="flex flex-col">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Welcome to IDL EDUCATION
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl">
                  An interactive educational platform designed for seamless learning and teaching experiences.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Student Login</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/login">Teacher Login</Link>
                </Button>
              </div>
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative">
                        <Image
                          src={image.src}
                          data-ai-hint={image.hint}
                          alt={image.alt}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center mx-4">
                <div 
                  className="relative flex items-center justify-center w-48 h-48 rounded-full bg-primary-foreground/10"
                  style={{
                    boxShadow: 'inset 0 0 0 4px hsl(var(--primary-foreground)), inset 0 0 0 6px hsl(var(--primary))'
                  }}
                >
                  <div className="text-center">
                    <p className="text-4xl font-bold">{stat.value}</p>
                    <p className="text-lg mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Key Features</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you and your students need to succeed in one platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 xl:grid-cols-4 mt-12">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Interactive Courses</h3>
              <p className="text-sm text-foreground/80">Engaging and accessible course content for students.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Progress Tracking</h3>
              <p className="text-sm text-foreground/80">Intuitive progress trackers for students to monitor their learning journey.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Easy Material Upload</h3>
              <p className="text-sm text-foreground/80">A simple interface for teachers to upload course materials.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Class Management</h3>
              <p className="text-sm text-foreground/80">Powerful tools for teachers to manage their classes and students.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="success" className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Our Success Story</h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A visual journey of our students' achievements over the years.
            </p>
          </div>
          <SelectionsChart />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">What Our Users Say</h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from students and teachers who love using IDL EDUCATION.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-2 mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Sarah T.</CardTitle>
                    <p className="text-sm text-foreground/80">Student</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>"IDL EDUCATION has transformed the way I study. The interactive courses are so engaging, and I can easily track my progress. It's fantastic!"</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Michael J.</CardTitle>
                    <p className="text-sm text-foreground/80">Teacher</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>"Managing my classes has never been easier. Uploading materials is a breeze, and the platform provides all the tools I need to support my students."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
