
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Book, Zap, BrainCircuit, Rocket, Goal, Route } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExpertTeam } from "@/components/landing/expert-team";
import { Separator } from "@/components/ui/separator";

const coreValues = [
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
];

const visionAndMission = [
    {
        icon: <Eye className="w-8 h-8 text-primary" />,
        title: "Our Vision",
        description: "To become the leading platform for online education, known for our commitment to quality, innovation, and user success. We envision a future where learning is not confined to classrooms, but is a lifelong journey of discovery."
    },
    {
        icon: <Target className="w-8 h-8 text-primary" />,
        title: "Our Mission",
        description: "To empower educators and inspire students by creating a seamless, accessible, and engaging digital learning environment. We believe that technology can bridge gaps in education and unlock potential."
    },
    {
        icon: <Goal className="w-8 h-8 text-primary" />,
        title: "Our Goal",
        description: "To make high-quality education affordable and accessible to every student, regardless of their geographical location or economic background, fostering a community of lifelong learners."
    },
    {
        icon: <Route className="w-8 h-8 text-primary" />,
        title: "Our Approach",
        description: "We use a student-centric approach, combining technology with proven teaching methodologies to create a personalized learning experience that is both effective and engaging for all."
    }
]

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 md:px-6 relative text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">About IDL EDUCATION</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Shaping the future of learning with passion and innovation.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto py-12 md:py-20 px-4 md:px-6">
        
        <section className="mb-12 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-2 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Card className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden border-2 border-primary/10 transform hover:scale-105 transition-transform duration-300">
                      <CardContent className="p-0">
                          <Image
                            src="/amod.jpg"
                            alt="Director's Photo"
                            width={400}
                            height={500}
                            className="w-full h-auto object-cover"
                          />
                          <div className="p-4 bg-muted/30 text-center">
                              <h2 className="text-lg font-bold text-foreground">AMOD KUMAR SHARMA</h2>
                              <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
                          </div>
                      </CardContent>
                  </Card>
              </div>
              <div className="lg:col-span-3 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                          <PenSquare className="w-7 h-7" /> Director's Message
                      </h3>
                      <blockquote className="border-l-4 border-primary pl-6 italic text-lg md:text-xl text-foreground/80 leading-relaxed">
                        "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized."
                      </blockquote>
                  </div>
                  <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                          <UserCircle className="w-7 h-7" /> Biography
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        With over two decades in educational technology, Amod Kumar Sharma is a celebrated professor and visionary leader. Before founding IDL EDUCATION, he led successful ed-tech initiatives and published extensive research on digital pedagogy. His passion for accessible education is the driving force behind our mission.
                      </p>
                  </div>
              </div>
          </div>
        </section>
        
        <Separator className="my-12 md:my-20" />

        <section className="mb-12 md:mb-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Core Principles</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                At IDL EDUCATION, we are guided by a clear vision and mission that shape our commitment to revolutionizing the learning experience for students everywhere.
            </p>
        </section>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 md:mb-20">
            {visionAndMission.map((item, index) => (
              <Card key={index} className="text-center p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-lg animate-fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <div className="flex justify-center mb-4">
                      <div className="bg-primary/10 p-4 rounded-full">
                          {item.icon}
                      </div>
                  </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/80">{item.description}</p>
              </Card>
            ))}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 md:mb-20">
            {coreValues.map((item, index) => (
              <div key={index} className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                      {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-foreground/80">{item.description}</p>
                  </div>
              </div>
            ))}
        </section>

        <Separator className="my-12 md:my-20" />
        
        <section className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <ExpertTeam />
        </section>

      </div>
    </div>
  );
}
