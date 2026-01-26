'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PenSquare, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getDirectorProfile } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import placeholderImages from '@/app/lib/placeholder-images.json';

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
    <div className="bg-background">
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                <div className="md:col-span-1 flex flex-col items-center text-center animate-fade-in-up">
                    <div className="relative w-full max-w-xs aspect-[4/5] rounded-lg overflow-hidden shadow-lg border-4 border-primary/20">
                        {loading ? (
                            <Skeleton className="w-full h-full" />
                        ) : director?.photoUrl ? (
                            <GcsImage
                            filePath={director.photoUrl}
                            alt={director.name || "Director's Photo"}
                            fill
                            className="object-cover"
                            />
                        ) : (
                            <Image
                            src="/teacher.png"
                            alt="Director's Photo"
                            fill
                            className="object-cover"
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
                    <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-foreground/80 leading-relaxed">
                        "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our unique two-teacher model ensures every student gets the attention they deserve, making learning interactive and effective. We are committed to fostering an environment where students can explore their passions, develop critical thinking skills, and prepare for the challenges of tomorrow. We believe that with the right tools and support, every student can achieve greatness, and our mission is to provide that foundation for success."
                    </blockquote>
                    </div>
                </div>
                </div>
            </div>
        </section>

        <section className="w-full py-12 bg-muted/30 dark:bg-card/50">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="rounded-2xl shadow-lg border">
                    <CardContent className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                                    Our Educational Philosophy
                                </h2>
                                <p className="text-muted-foreground">
                                    We believe in a holistic, student-centric approach that goes beyond textbooks, focusing on conceptual clarity and real-world application to nurture lifelong learners.
                                </p>
                                <Button asChild className="rounded-full">
                                    <Link href="/contact">
                                        Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="relative h-64 w-64 mx-auto">
                                <Image
                                    src={placeholderImages.educational_philosophy.src}
                                    alt={placeholderImages.educational_philosophy.alt}
                                    data-ai-hint={placeholderImages.educational_philosophy.hint}
                                    fill
                                    className="object-cover rounded-full shadow-lg"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    </div>
  );
}
