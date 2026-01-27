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
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="rounded-2xl shadow-lg border">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-primary">About IDL EDUCATION</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 md:p-12 space-y-6 text-lg text-foreground/80 leading-relaxed">
                        <p>
                            IDL Educational Services Limited is a leading educational institution in India that provides comprehensive test preparatory services to students preparing for medical and engineering entrance exams, school/board exams, NTSE, Olympiads and other foundation level exams. IDL has been committed to the success of students since 1988. It has been recognized nationally as one of the most trusted brands in the education sector. With 300+ branches across India, 5000+ expert faculty, comprehensive study material, regular tests & assessments and an efficient doubt clearing system, backed by robust technology for an omni channel experience, IDL provides one of the best coaching experiences for students aspiring to become a doctor or an engineer. IDL is well known for its comprehensive, result-oriented JEE, NEET and Foundation programs.
                        </p>
                        <p>
                            Our mission is to create an environment of academic excellence enabled by modern pedagogy & technology to impart quality education. Our aim is to become one of the most admired brands in the education sector and to help young aspirants make their dreams come true through quality teaching, technology enabled systems and a commitment to their success.
                        </p>
                        <p>
                            The first centre under 'IDL' was started in 1988, offering coaching services for medical entrance examinations. Today, we are highly acknowledged for offering niche test preparatory services for medical as well as engineering entrance exams and foundation level exams through our distinct verticals namely, IDL Medical, IDL Engineering and IDL Foundation.
                        </p>
                        <div className="space-y-4 pt-4">
                            <h3 className="text-2xl font-bold text-primary">IDL Medical</h3>
                            <p>
                                For more than 36 years, IDL Medical has been nurturing the aspirations of students who dream about a career in medicine. Every year our students achieve top ranks and display excellent results in the National Eligibility Cum Entrance Test - NEET (Previously AIPMT). For the past many years, our students have been securing top ranks in various medical entrance exams (NEET/AIPMT, AIIMS, JIPMER). Started as a single centre with just 12 students, IDL Institute has been ranked as the No. 1 Coaching Institute among Top 25 Best Coaching Institutes in the country for preparation of medical entrance exams by India Today Magazine.
                            </p>
                        </div>
                        <div className="space-y-4 pt-4">
                            <h3 className="text-2xl font-bold text-primary">IDL Engineering</h3>
                            <p>
                                Started in 2007, IDL Engineering prepares students for JEE (Main & Advanced) and other engineering entrance examinations. Through its integrated teaching methodology, focused learning environment and technology enabled-education, IDL Engineering provides cutting-edge educational solutions that help students to excel in their goals. Every year our students achieve top ranks and display excellent results in the engineering entrance exams. Students aspiring to succeed in engineering entrance exams can trust IDL Engineering for quality and result-oriented test preparation.
                            </p>
                        </div>
                        <div className="space-y-4 pt-4">
                            <h3 className="text-2xl font-bold text-primary">IDL Foundation</h3>
                            <p>
                                To nurture the aspirations of junior class students for various competitive and scholarship examinations such as NTSE, Olympiads, etc. and prepare them for school/board examinations, IDL Foundation became functional in the year 2009. It is also the youngest division of IDL. Thanks to its innovative teaching methodologies, it has been constantly bearing the fruits of success and steering its students to the top echelons in School/Board as well as Foundation Level Competitive and Scholarship Exams. In addition, it lays a strong foundation for medical, engineering and other competitive examinations.
                            </p>
                        </div>
                    </CardContent>
                </Card>
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
