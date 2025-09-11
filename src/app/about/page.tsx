
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Book, Zap, BrainCircuit, BarChart } from "lucide-react";
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

const missionParts = [
    {
        icon: <Book className="w-8 h-8 text-primary" />,
        title: "Simple Language",
        description: "We develop content by keeping by simplicity and flow of learning in mind. All the content on our platform is simple in language and easily relatable."
    },
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Highly Skilled",
        description: "Everyone working behind the scene is highly skilled and motivated to develop and deliver the quality content."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "Learning cycle",
        description: "We develop our content according to the learning cycle of the students. We give most of our efforts and time to research and understand that how a student learns and understands."
    },
    {
        icon: <BarChart className="w-8 h-8 text-primary" />,
        title: "Your growth",
        description: "The biggest success for a teacher is the growth of students. As an educational institute our priority is your growth. We always try to make our content worth more."
    }
]

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="my-12">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 bg-muted/40 p-8 flex flex-col items-center justify-center text-center">
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
                  <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                    "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the best tools for both our dedicated educators and our ambitious students. Together, we are not just learning; we are shaping the future."
                  </blockquote>
                </TabsContent>
                <TabsContent value="biography" className="mt-6 text-foreground/90 leading-relaxed space-y-4">
                  <p>
                    Amod Kumar Sharma is a visionary in the field of educational technology with over two decades of experience. He has dedicated his career to exploring the intersection of technology and learning.
                  </p>
                  <p>
                    Before founding IDL EDUCATION, Mr. Sharma was a celebrated professor and led several successful ed-tech initiatives that have been adopted by institutions nationwide. His research on digital pedagogy is widely published, and he is a frequent keynote speaker at global education conferences. Mr. Sharma's passion for accessible and effective education is the cornerstone of IDL EDUCATION's mission.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
      </section>

      <section className="my-12">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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
          </div>
        </Card>
      </section>
      
      <section className="my-12">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {missionParts.map((part, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full border shadow-sm">
                    {part.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{part.title}</h3>
                    <p className="text-foreground/80">{part.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </Card>
      </section>
      
      <ExpertTeam />
    </div>
  );
}
