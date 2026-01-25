
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Home, X } from "lucide-react";
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
        icon: <div className="w-5 h-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />,
        title: "Our Vision",
        description: "IDL EDUCATION shall remain a Unique Educational Centre defined by its core values. With excellence in all our activities of instructing, we are committed to provide the best education in the most cultivable environment so as to empower everyone. Our vision is to prepare global citizens who will become confident, determined and disciplined leaders for tomorrow's challenging world."
    },
    {
        icon: <div className="w-5 h-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />,
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Expert</h2>
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
    <div className="relative min-h-screen w-full bg-white dark:bg-gray-900 overflow-y-auto px-4 md:px-6">
      <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="outline" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
      </Link>
      <div className="relative z-10 container mx-auto">
          <div className="w-full">
            <Card className="bg-transparent shadow-none border-0 overflow-hidden animate-fade-in-up">
              <CardContent className="p-0">
                <section>
                  <div className="flex flex-col items-center gap-12">
                      <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                          <Avatar className="w-40 h-40 border-4 border-primary/20 shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
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
                      <div className="w-full space-y-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                          <div>
                              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                                  <PenSquare className="w-7 h-7" /> Director's Message
                              </h3>
                              <blockquote className="border-l-4 border-primary pl-6 italic text-lg md:text-xl text-foreground/80 leading-relaxed font-josefin-sans">
                                "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our unique two-teacher model ensures every student gets the attention they deserve, making learning interactive and effective. We are committed to fostering an environment where students can explore their passions, develop critical thinking skills, and prepare for the challenges of tomorrow. We believe that with the right tools and support, every student can achieve greatness, and our mission is to provide that foundation for success."
                              </blockquote>
                          </div>
                          <div>
                              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                                  <UserCircle className="w-7 h-7" /> Biography
                              </h3>
                              <div className="text-lg md:text-xl text-foreground/80 leading-relaxed font-josefin-sans">
                                With over two decades in educational technology, {loading ? <Skeleton className="h-5 w-48 inline-block" /> : <span>{director?.name || 'AMOD KUMAR SHARMA'}</span>} is a celebrated professor and visionary leader. Before founding IDL EDUCATION, he led successful ed-tech initiatives and published extensive research on digital pedagogy. His work has focused on creating adaptive learning systems that cater to individual student needs, making quality education accessible to all. His passion for accessible education is the driving force behind our mission, and he continues to innovate, ensuring that IDL EDUCATION remains at the forefront of educational excellence and technology. His vision extends beyond academics, aiming to build well-rounded individuals ready to contribute positively to society.
                              </div>
                          </div>
                      </div>
                  </div>
                </section>
              </CardContent>
            </Card>
            <Card className="bg-transparent shadow-none border-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-0">
                <section className="py-8 md:py-12">
                    <div className="rounded-2xl bg-white dark:bg-card p-6 md:p-8 border shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-primary mb-4">Our Vision</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-5 h-5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-semibold text-lg">Empowerment</h5>
                                                <p className="text-muted-foreground text-sm">To provide the best education in the most cultivable environment so as to empower everyone.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-5 h-5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-semibold text-lg">Global Citizens</h5>
                                                <p className="text-muted-foreground text-sm">To prepare global citizens who will become confident, determined and disciplined leaders for tomorrow's challenging world.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-5 h-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-semibold text-lg">Holistic Development</h5>
                                                <p className="text-muted-foreground text-sm">A sustainable, innovative, aspiring learning environment with focus on Physical, Mental and Spiritual fitness.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-5 h-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <h5 className="font-semibold text-lg">Service to Humanity</h5>
                                                <p className="text-muted-foreground text-sm">We aim to create an equitable world for all and live upto our motto of “Learn to Serve”.... serve for humanity.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-96 rounded-lg overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                                    alt="Our Core Values"
                                    data-ai-hint="team collaboration"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
              </CardContent>
            </Card>
             <Card className="mt-8 bg-transparent shadow-none border-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <CardContent className="p-0">
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
