
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

export function TeacherCard({ name, designation, experience, avatar, avatarHint }: TeacherCardProps) {
    return (
        <div className="relative group overflow-hidden rounded-lg bg-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="relative w-full aspect-[4/5]">
                <Image
                    src={avatar}
                    alt={name}
                    data-ai-hint={avatarHint}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-3 text-center bg-background">
                <h3 className="text-base font-bold text-foreground">{name}</h3>
                <p className="text-xs text-primary font-semibold">{designation}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{experience}</p>
                
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex justify-center gap-3 text-muted-foreground">
                        <Link href="#" className="hover:text-primary"><Facebook className="h-4 w-4" /></Link>
                        <Link href="#" className="hover:text-primary"><Twitter className="h-4 w-4" /></Link>
                        <Link href="#" className="hover:text-primary"><Instagram className="h-4 w-4" /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
