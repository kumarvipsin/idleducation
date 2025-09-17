
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExpertTeam } from "@/components/landing/expert-team";
import { Separator } from "@/components/ui/separator";

const combinedValues = [
    {
        icon: <Eye className="w-10 h-10 text-primary" />,
        title: "Our Vision",
        description: "IDL EDUCATION shall remain a Unique Educational Centre defined by its core values. With excellence in all our activities of instructing, we are committed to provide the best education in the most cultivable environment so as to empower everyone. Our vision is to prepare global citizens who will become confident, determined and disciplined leaders for tomorrow's challenging world."
    },
    {
        icon: <Target className="w-10 h-10 text-primary" />,
        title: "Our Mission",
        description: "IDL EDUCATION has developed a sustainable, innovative, aspiring learning environment for its pupils, with focus on the three main fundamentals of life-Physical, Mental and Spiritual fitness. We at IDL EDUCATION are equipped with 21st century skills. We aim to create an equitable world for all and live upto our motto of “Learn to Serve”.... serve for humanity."
    },
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
        
        <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Values</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 mt-4">
              We are driven by a set of core values that define our mission and guide our approach to education.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
            {combinedValues.map((item, index) => (
              <Card key={index} className="bg-background/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up border-primary/10 group backdrop-blur-sm">
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
        
        <section className="animate-fade-in-up mt-12 md:mt-20" style={{ animationDelay: '1s' }}>
            <ExpertTeam />
        </section>

      </div>
    </div>
  );
}
