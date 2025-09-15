
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
        <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
                src={avatar}
                alt={name}
                data-ai-hint={avatarHint}
                width={400}
                height={500}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold uppercase tracking-wider">{name}</h3>
                <p className="text-sm text-white/90">{designation}</p>
                <div className="border-t border-white/20 my-3"></div>
                <p className="text-sm text-white/80">{experience}</p>
                 <div className="flex justify-start gap-4 mt-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link href="#" className="hover:text-white"><Facebook className="h-5 w-5" /></Link>
                    <Link href="#" className="hover:text-white"><Twitter className="h-5 w-5" /></Link>
                    <Link href="#" className="hover:text-white"><Instagram className="h-5 w-5" /></Link>
                </div>
            </div>
        </div>
    );
}
