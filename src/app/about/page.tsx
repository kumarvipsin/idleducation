'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PenSquare, ArrowRight, Linkedin, Quote, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getDirectorProfile } from "@/app/actions/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import placeholderImages from '@/app/lib/placeholder-images.json';

export default function AboutPage() {
    const [director, setDirector] = useState<{name: string; photoUrl: string} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const directorResult = await getDirectorProfile();
            if (directorResult.success && directorResult.data) {
                setDirector(directorResult.data as {name: string; photoUrl: string});
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const team = [
      {
        name: "Vijay Verma",
        title: "Head Of Academics",
        imageUrl: "/vijay.png",
        imageAlt: "Vijay Verma",
        imageHint: "man smiling",
        linkedinUrl: "#",
      },
      {
        name: "Manish Kumar",
        title: "Head Of Products",
        imageUrl: "/manish.png",
        imageAlt: "Manish Kumar",
        imageHint: "man professional",
        linkedinUrl: "#",
      },
      {
        name: "Chandra Prakesh",
        title: "Head Graphic Media",
        imageUrl: "/chandu.png",
        imageAlt: "Chandra Prakesh",
        imageHint: "man glasses",
        linkedinUrl: "#",
      },
      {
        name: "Vidhi Sharma",
        title: "Head Content Media",
        imageUrl: "/vidhi.png",
        imageAlt: "Vidhi Sharma",
        imageHint: "woman smiling",
        linkedinUrl: "#",
      },
    ];

  return (
    <div className="bg-white dark:bg-background">
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Image Column */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl group bg-muted/20">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-[2.5rem]" />
                                ) : director?.photoUrl ? (
                                    <GcsImage
                                    filePath={director.photoUrl}
                                    alt={director.name || "Director's Photo"}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <Image
                                    src="/teacher.png"
                                    alt="Director's Photo"
                                    fill
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <p className="text-white font-black text-xl tracking-tight uppercase">{director?.name || 'AMOD KUMAR SHARMA'}</p>
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">Managing Director</p>
                                </div>
                            </div>
                            {/* Decorative element behind image */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full -z-10 animate-pulse"></div>
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-full -z-10 animate-bounce" style={{ animationDuration: '3s' }}></div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                    <Sparkles className="w-3 h-3 text-yellow-500" />
                                    Director's Message
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight uppercase">
                                    Vision for <br/>
                                    <span className="relative inline-block text-primary">
                                        <span className="relative z-10">Our Founder</span>
                                        <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                                <path d="M0,15 Q50,5 100,15" />
                                            </svg>
                                        </div>
                                    </span>
                                </h2>
                            </div>

                            <div className="relative">
                                <Quote className="absolute -top-8 -left-8 w-16 h-16 text-primary/5 transform rotate-180" />
                                <div className="space-y-4 relative z-10">
                                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium text-left">
                                        "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our unique two-teacher model ensures every student gets the attention they deserve, making learning interactive and effective."
                                    </p>
                                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-medium text-left">
                                        "We are committed to fostering an environment where students can explore their passions, develop critical thinking skills, and prepare for the challenges of tomorrow. We believe that with the right tools and support, every student can achieve greatness, and our mission is to provide that foundation for success. Together, we can build a brighter future for all learners."
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col items-start gap-1">
                                {loading ? (
                                    <>
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-32 mt-2" />
                                    </>
                                ) : (
                                    <>
                                    <h3 className="text-xl font-black text-foreground tracking-tight uppercase">{director?.name || 'AMOD KUMAR SHARMA'}</h3>
                                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Founder & Managing Director</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="w-full py-16 md:py-24 bg-white dark:bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground uppercase">Meet Our{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Team</span>
                            <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h2>
                    <p className="text-muted-foreground mt-2 font-bold text-sm uppercase tracking-widest">The visionary minds driving our educational excellence</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {team.map((member) => (
                        <div key={member.name} className="flex flex-col items-center text-center group">
                            <div className="relative w-48 h-56 mb-4 rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-2">
                                <Image
                                    src={member.imageUrl}
                                    alt={member.imageAlt}
                                    data-ai-hint={member.imageHint}
                                    fill
                                    className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{member.name}</h3>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{member.title}</p>
                            <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-4">
                                <Button variant="outline" size="icon" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}