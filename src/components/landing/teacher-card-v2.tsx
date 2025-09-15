
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
            <div className="relative w-full h-56">
                <Image
                    src={avatar}
                    alt={name}
                    data-ai-hint={avatarHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-4 text-center bg-background">
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
