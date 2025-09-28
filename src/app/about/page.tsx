
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExpertTeam } from "@/components/landing/expert-team";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getDirectorProfile } from "@/app/actions/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";


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
    const [director, setDirector] = useState<{name: string; photoUrl: string} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDirector = async () => {
            setLoading(true);
            const result = await getDirectorProfile();
            if (result.success && result.data) {
                setDirector(result.data as {name: string; photoUrl: string});
            }
            setLoading(false);
        };
        fetchDirector();
    }, []);

  return (
    <div className="bg-white dark:bg-background">
      <div className="container mx-auto py-12 md:py-20 px-4 md:px-[10%]">
        
        <section className="mb-12 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-2 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Card className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden border-2 border-primary/10 transform hover:scale-105 transition-transform duration-300">
                      <CardContent className="p-0">
                          <div className="relative w-full aspect-[4/4]">
                            {loading ? (
                                <Skeleton className="w-full h-full" />
                            ) : director?.photoUrl ? (
                                <GcsImage
                                    filePath={director.photoUrl}
                                    alt="Director's Photo"
                                    fill
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Image
                                  src="/amod.jpg"
                                  alt="Director's Photo"
                                  data-ai-hint="male director"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                            )}
                          </div>
                          <div className="p-4 bg-muted/30 text-center">
                            {loading ? (
                                <>
                                    <Skeleton className="h-6 w-3/4 mx-auto" />
                                    <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                                </>
                            ): (
                                <>
                                    <h2 className="text-lg font-bold text-foreground">{director?.name || 'Amod Kumar Sharma'}</h2>
                                    <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
                                </>
                            )}
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
                      <div className="text-foreground/80 leading-relaxed">
                        With over two decades in educational technology, {loading ? <Skeleton className="h-5 w-48 inline-block" /> : <span>{director?.name}</span>} is a celebrated professor and visionary leader. Before founding IDL EDUCATION, he led successful ed-tech initiatives and published extensive research on digital pedagogy. His passion for accessible education is the driving force behind our mission.
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </div>

      <section className="py-12 md:py-20 bg-gradient-to-b from-white via-blue-50 to-white dark:from-background dark:via-blue-900/10 dark:to-background">
        <div className="container mx-auto px-4 md:px-[10%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Core Values</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 mt-4">
              We are driven by a set of core values that define our mission and guide our approach to education.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {combinedValues.map((item, index) => (
              <Card key={index} className="bg-background rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up border-t-4 border-primary overflow-hidden group">
                  <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 text-primary p-4 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                  </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
        
      <div className="container mx-auto py-12 md:py-20 px-4 md:px-[10%]">
        <section className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <ExpertTeam />
        </section>
      </div>
    </div>
  );
}
