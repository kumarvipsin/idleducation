
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Book, Zap, BrainCircuit, Rocket } from "lucide-react";
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
import { ExpertTeam } from "@/components/landing/expert-team";
import { Separator } from "@/components/ui/separator";

const missionParts = [
    {
        icon: <Book className="w-8 h-8 text-primary" />,
        title: "Simple Language",
        description: "We develop content by keeping by simplicity and flow of learning in mind. All the content on our platform is simple in language and easily relatable."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "Highly Skilled",
        description: "Everyone working behind the scene is highly skilled and motivated to develop and deliver the quality content."
    },
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Learning cycle",
        description: "We develop our content according to the learning cycle of the students. We give most of our efforts and time to research and understand that how a student learns and understands."
    },
    {
        icon: <Rocket className="w-8 h-8 text-primary" />,
        title: "Your growth",
        description: "The biggest success for a teacher is the growth of students. As an educational institute our priority is your growth. We always try to make our content worth more."
    }
]

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <section className="my-12">
          <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1 p-8 flex flex-col items-center justify-center text-center">
                <Avatar className="w-48 h-48 mb-4 border-[6px] border-white shadow-lg">
                  <AvatarImage src="/amod.jpg" alt="Director's Photo" />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <h1 className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">AMOD KUMAR SHARMA</h1>
                <p className="text-base text-muted-foreground mt-1">Founder & Managing Director</p>
              </div>
              <div className="md:col-span-2 p-4 sm:p-8">
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
                    <blockquote className="border-l-4 border-border pl-4 italic text-lg">
                      "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the best tools for both our dedicated educators and our ambitious students. Together, we are not just learning; we are shaping the future."
                    </blockquote>
                  </TabsContent>
                  <TabsContent value="biography" className="mt-6 text-foreground/90 leading-relaxed">
                    <div className="border-l-4 border-border pl-4 space-y-4">
                      <p>
                        With over two decades in educational technology, Amod Kumar Sharma is a celebrated professor and visionary leader. Before founding IDL EDUCATION, he led successful ed-tech initiatives and published extensive research on digital pedagogy. His passion for accessible education is the driving force behind our mission.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        </section>

        <section className="my-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl text-primary">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                        To become the leading platform for online education, known for our commitment to quality, innovation, and user success. We envision a future where learning is not confined to classrooms, but is a lifelong journey of discovery.
                    </p>
                </CardContent>
            </Card>
             <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                        To empower educators and inspire students by creating a seamless, accessible, and engaging digital learning environment. We believe that technology can bridge gaps in education and unlock the full potential of every learner.
                    </p>
                </CardContent>
            </Card>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto">
              {missionParts.map((part, index) => (
                <Card key={index} className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            {part.icon}
                        </div>
                    </div>
                  <h3 className="text-lg font-bold mb-2">{part.title}</h3>
                  <p className="text-sm text-foreground/80">{part.description}</p>
                </Card>
              ))}
            </div>
        </section>
        
        <section className="my-12">
            <ExpertTeam />
        </section>
      </div>
    </div>
  );
}
