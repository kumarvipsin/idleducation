'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PenSquare, ArrowRight, Linkedin, Quote } from "lucide-react";
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
        <section className="py-16 md:py-24 bg-white dark:bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="rounded-2xl shadow-none border">
                    <CardContent className="p-8 md:p-12">
                        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                        <div className="md:col-span-1 flex flex-col items-center text-center animate-fade-in-up">
                            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-none bg-muted border-4 border-primary">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-full" />
                                ) : director?.photoUrl ? (
                                    <GcsImage
                                    filePath={director.photoUrl}
                                    alt={director.name || "Director's Photo"}
                                    fill
                                    className="object-cover object-top"
                                    />
                                ) : (
                                    <Image
                                    src="/teacher.png"
                                    alt="Director's Photo"
                                    fill
                                    className="object-cover object-top"
                                    />
                                )}
                            </div>
                            <div className="text-center mt-4">
                            {loading ? (
                                <>
                                <Skeleton className="h-6 w-48 mx-auto" />
                                <Skeleton className="h-4 w-32 mx-auto mt-2" />
                                </>
                            ) : (
                                <>
                                <h2 className="text-xl font-bold text-foreground">{director?.name || 'AMOD KUMAR SHARMA'}</h2>
                                <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
                                </>
                            )}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                                <PenSquare className="w-7 h-7" /> Director's Message
                            </h3>
                            <div className="relative p-6 md:p-8 bg-primary/5 rounded-3xl border border-primary/10">
                                <Quote className="absolute -top-3 -left-3 w-10 h-10 text-primary opacity-20 transform -rotate-12" />
                                <blockquote className="text-lg text-foreground/80 leading-relaxed text-left relative z-10">
                                    "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our unique two-teacher model ensures every student gets the attention they deserve, making learning interactive and effective. We are committed to fostering an environment where students can explore their passions, develop critical thinking skills, and prepare for the challenges of tomorrow. We believe that with the right tools and support, every student can achieve greatness, and our mission is to provide that foundation for success. Together, we can build a brighter future for all learners."
                                </blockquote>
                            </div>
                            </div>
                        </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
        
        <section className="w-full py-16 md:py-24 bg-white dark:bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Meet Our{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Team</span>
                            <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h2>
                    <p className="text-muted-foreground mt-2">The people behind our success.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {team.map((member) => (
                        <div key={member.name} className="flex flex-col items-center text-center">
                            <div className="relative w-48 h-56 mb-4">
                                <Image
                                    src={member.imageUrl}
                                    alt={member.imageAlt}
                                    data-ai-hint={member.imageHint}
                                    fill
                                    className="object-cover filter grayscale"
                                />
                            </div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-muted-foreground">{member.title}</p>
                            <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-2">
                                <Button variant="outline" size="icon" className="rounded-full border-orange-500 text-orange-500 hover:bg-orange-500/10">
                                    <Linkedin className="h-5 w-5" />
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
