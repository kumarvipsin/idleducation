'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { PenSquare, ArrowRight, Linkedin } from "lucide-react";
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
        title: "Co-Founder, Head Academics",
        imageUrl: placeholderImages.founder1.src,
        imageAlt: placeholderImages.founder1.alt,
        imageHint: placeholderImages.founder1.hint,
        linkedinUrl: "#",
      },
      {
        name: "Manish Kumar",
        title: "Co-Founder, Head Product",
        imageUrl: placeholderImages.founder2.src,
        imageAlt: placeholderImages.founder2.alt,
        imageHint: placeholderImages.founder2.hint,
        linkedinUrl: "#",
      },
      {
        name: "Chandra Prakesh",
        title: "Head Graphic Media",
        imageUrl: placeholderImages.founder3.src,
        imageAlt: placeholderImages.founder3.alt,
        imageHint: placeholderImages.founder3.hint,
        linkedinUrl: "#",
      },
      {
        name: "Vidhi Sharma",
        title: "Head Content Media",
        imageUrl: placeholderImages.founder4.src,
        imageAlt: placeholderImages.founder4.alt,
        imageHint: placeholderImages.founder4.hint,
        linkedinUrl: "#",
      },
    ];

  return (
    <div className="bg-background">
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image
                            src="/logo.png"
                            alt="IDL Education Watermark"
                            width={400}
                            height={400}
                            className="opacity-5"
                        />
                    </div>
                    <div className="relative z-10 space-y-6 text-lg text-foreground/80 leading-relaxed">
                        <p>IDL Education is a reputed and result-driven educational institute founded in 2016 by Amod Sharma with the vision of providing quality education through strong academic foundations and expert guidance. Over the years, IDL Education has grown into a trusted name in education, operating four successful offline branches across Delhi. The institute offers comprehensive coaching for Classes 6 to 12 (CBSE Board), covering Science, Commerce, and Humanities streams, and focuses on developing conceptual clarity, confidence, and academic excellence among students.</p>
                        <p>At IDL Education, learning goes beyond textbooks. The institute follows a structured, student-centric teaching approach that emphasizes concept-based learning, regular assessments, personalized mentoring, and continuous performance tracking. In addition to school academics, IDL Education provides dedicated preparation for CBSE Board Examinations (Class 10 & 12), CUET, NIOS, and other government and entrance examinations, ensuring that students are well-prepared for both academic and competitive challenges.</p>
                        <p>IDL Education is widely recognized for its consistent outstanding results. Students from all streams—Science, Commerce, and Humanities—have achieved excellent scores in CBSE Class 10 and 12 examinations, while many others have secured impressive success in CUET and government entrance exams, earning admissions to reputed colleges and universities. Backed by experienced faculty, small batch sizes, updated study material, and a disciplined yet supportive learning environment, IDL Education remains committed to shaping confident learners and building successful futures.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="rounded-2xl shadow-lg border">
                    <CardContent className="p-8 md:p-12">
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
                    </CardContent>
                </Card>
            </div>
        </section>
        
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Meet Our{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Team</span>
                            <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 z-0"></span>
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
                                    className="object-contain filter grayscale"
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
