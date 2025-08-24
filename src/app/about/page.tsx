import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, BookOpen, UserCheck, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function AboutPage() {
  const carouselImages = [
    { src: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80", alt: "Team working together", hint: "team collaboration" },
    { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80", alt: "Modern classroom environment", hint: "modern classroom" },
    { src: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80", alt: "Student using the platform", hint: "student learning" },
  ];

  const approachItems = [
    {
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      title: "Expert Faculty",
      description: "Our team consists of experienced educators and subject matter experts who are passionate about teaching and dedicated to student success."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Comprehensive Curriculum",
      description: "We offer a meticulously designed curriculum that covers all aspects of the syllabus, updated regularly to keep pace with changing exam patterns."
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Personalized Mentorship",
      description: "Every student receives individual attention and guidance. Our mentorship program helps students identify their strengths and overcome their weaknesses."
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About IDL EDUCATION</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
          We are dedicated to revolutionizing the educational landscape by providing an intuitive and powerful platform for both students and teachers.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-12 items-center">
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

      <section className="mb-12">
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Approach to Excellence</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
              We believe in a holistic approach to education that combines expert guidance with a supportive learning environment.
            </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {approachItems.map((item, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="flex flex-col items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  {item.icon}
                </div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 flex items-center justify-center gap-4">
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
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
