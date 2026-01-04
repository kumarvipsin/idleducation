
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getDirectorProfile } from "@/app/actions/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import { getTeamMembers } from "@/app/actions/data";
import type { TTeamMember } from "@/app/actions/types";
import { TeacherCard } from "@/components/landing/teacher-card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

const TeamMembers = () => {
    const [teamMembers, setTeamMembers] = useState<TTeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
        setLoading(true);
        const result = await getTeamMembers();
        if (result.success && result.data) {
            setTeamMembers(result.data as TTeamMember[]);
        }
        setLoading(false);
        };
        fetchTeam();
    }, []);

    return (
        <section className="w-full py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Expert Team</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                The power of an organisation is its team. We believe that great teams build great organisations.
            </p>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {teamMembers.map((member) => (
                    <TeacherCard 
                        key={member.id} 
                        name={member.name}
                        designation={member.designation}
                        experience={member.experience}
                        biography={member.biography}
                        avatar={member.avatarUrl}
                        avatarHint={`${member.name} photo`}
                        socialLinks={member.socialLinks}
                    />
                    ))}
                </div>
            )}
        </div>
        </section>
    );
};

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
    <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon">
              <Home className="h-6 w-6 text-primary" />
              <span className="sr-only">Home</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
          <div className="w-full">
            <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up">
              <CardContent className="p-4 md:p-8">
                <section className="mb-12 md:mb-20">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
                      <div className="lg:col-span-2 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                          <Avatar className="w-40 h-40 border-4 border-primary/20 shadow-lg bg-blue-100 dark:bg-blue-900/20">
                            {loading ? (
                                <Skeleton className="w-full h-full rounded-full" />
                            ) : (
                                <Image
                                    src="/teacher.png"
                                    alt="Director's Photo"
                                    fill
                                    className="rounded-full object-cover"
                                />
                            )}
                          </Avatar>
                          <div className="text-center mt-4">
                            {loading ? (
                                <>
                                    <Skeleton className="h-6 w-48 mx-auto" />
                                    <Skeleton className="h-4 w-32 mx-auto mt-2" />
                                </>
                            ): (
                                <>
                                    <h2 className="text-xl font-bold text-foreground">{director?.name || 'AMOD KUMAR SHARMA'}</h2>
                                    <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
                                </>
                            )}
                          </div>
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
              </CardContent>
            </Card>
            <Card className="mt-8 shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-4 md:p-8">
                <section className="py-12 md:py-20">
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
                </section>
              </CardContent>
            </Card>
             <Card className="mt-8 shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <CardContent className="p-4 md:p-8">
                    <section className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
                        <TeamMembers />
                    </section>
                </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
