
'use client';
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

type TeacherCardProps = {
    name: string;
    designation: string;
    experience: string;
    avatar: string;
    avatarHint: string;
}

export function TeacherCardV2({ name, designation, experience, avatar, avatarHint }: TeacherCardProps) {
    return (
        <div className="relative group overflow-hidden rounded-lg bg-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div 
              className="absolute top-0 left-0 w-full h-2/5 bg-primary transition-all duration-300 ease-in-out group-hover:h-1/2" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}
            ></div>
            <div className="relative p-6 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 -mt-20 group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={avatar}
                        alt={name}
                        data-ai-hint={avatarHint}
                        width={128}
                        height={128}
                        className="rounded-full object-cover"
                    />
                </div>
                <h3 className="text-lg font-bold text-foreground">{name}</h3>
                <p className="text-sm text-primary font-semibold">{designation}</p>
                <p className="text-xs text-muted-foreground mt-1">{experience}</p>
                
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-center gap-4 text-muted-foreground">
                        <Link href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
