
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Book, Zap, BrainCircuit, Rocket, Goal, Route } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExpertTeam } from "@/components/landing/expert-team";
import { Separator } from "@/components/ui/separator";

const combinedValues = [
    {
        icon: <Eye className="w-10 h-10 text-primary" />,
        title: "Our Vision",
        description: "To become the leading platform for online education, known for our commitment to quality, innovation, and user success. We envision a future where learning is not confined to classrooms, but is a lifelong journey of discovery."
    },
    {
        icon: <Target className="w-10 h-10 text-primary" />,
        title: "Our Mission",
        description: "To empower educators and inspire students by creating a seamless, accessible, and engaging digital learning environment. We believe that technology can bridge gaps in education and unlock potential."
    },
    {
        icon: <Goal className="w-10 h-10 text-primary" />,
        title: "Our Goal",
        description: "To make high-quality education affordable and accessible to every student, regardless of their geographical location or economic background, fostering a community of lifelong learners."
    },
    {
        icon: <Route className="w-10 h-10 text-primary" />,
        title: "Our Approach",
        description: "We use a student-centric approach, combining technology with proven teaching methodologies to create a personalized learning experience that is both effective and engaging for all."
    },
    {
        icon: <Book className="w-10 h-10 text-primary" />,
        title: "Simple Language",
        description: "We develop content by keeping by simplicity and flow of learning in mind. All the content on our platform is simple in language and easily relatable."
    },
    {
        icon: <BrainCircuit className="w-10 h-10 text-primary" />,
        title: "Highly Skilled",
        description: "Everyone working behind the scene is highly skilled and motivated to develop and deliver the quality content."
    },
    {
        icon: <Zap className="w-10 h-10 text-primary" />,
        title: "Learning cycle",
        description: "We develop our content according to the learning cycle of the students. We give most of our efforts and time to research and understand that how a student learns and understands."
    },
    {
        icon: <Rocket className="w-10 h-10 text-primary" />,
        title: "Your growth",
        description: "The biggest success for a teacher is the growth of students. As an educational institute our priority is your growth. We always try to make our content worth more."
    }
];


export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-background">
      <div className="container mx-auto py-12 md:py-20 px-4 md:px-[10%]">
        
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
        
        <section className="mb-12 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {combinedValues.map((item, index) => (
              <Card key={index} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border-primary/10 group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-background rounded-full mb-4 border shadow-inner transition-transform duration-300 group-hover:scale-110">
                        {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8 md:my-12" />
        
        <section className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <ExpertTeam />
        </section>

      </div>
    </div>
  );
}
