'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, PenSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getDirectorProfile, getTeamMembers } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import type { TTeamMember } from "@/app/actions/types";
import { TeacherCard } from "@/components/landing/teacher-card";

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
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Expert</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        The power of an organisation is its team. We believe that great teams build great organisations.
                    </p>
                </div>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        
        <TeamMembers />
    </div>
  );
}
