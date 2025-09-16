
'use client';
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

type TeacherCardProps = {
    name: string;
    designation: string;
    experience: string;
    avatar: string;
    avatarHint: string;
}

export function TeacherCard({ name, designation, experience, avatar, avatarHint }: TeacherCardProps) {
    return (
        <Card 
          className="relative text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card rounded-lg h-full"
        >
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
                <Image
                    src={avatar}
                    alt={name}
                    data-ai-hint={avatarHint}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            </div>
            <CardContent className="absolute bottom-0 left-0 right-0 p-2 md:p-4 text-white">
                <h3 className="text-base md:text-lg font-bold uppercase tracking-wider">{name}</h3>
                <p className="text-xs md:text-sm text-white/90">{designation}</p>
                <p className="text-xs text-white/80 mt-1">{experience}</p>
            </CardContent>
        </Card>
    );
}
