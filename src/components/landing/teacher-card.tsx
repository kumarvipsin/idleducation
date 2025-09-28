'use client';
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { GcsImage } from "@/components/gcs-image";

type TeacherCardProps = {
    name: string;
    designation: string;
    experience: string;
    avatar: string;
    avatarHint: string;
}

export function TeacherCard({ name, designation, experience, avatar, avatarHint }: TeacherCardProps) {
    return (
        <div className="relative group overflow-hidden rounded-lg bg-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="relative w-full aspect-[4/5]">
                <GcsImage
                    filePath={avatar}
                    alt={name}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-base font-bold">{name}</h3>
                    <p className="text-xs text-primary-foreground/80 font-semibold">{designation}</p>
                    <div className="h-4">
                        <div className="flex justify-start gap-3 text-primary-foreground/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Link href="#" className="hover:text-white"><Facebook className="h-4 w-4" /></Link>
                            <Link href="#" className="hover:text-white"><Twitter className="h-4 w-4" /></Link>
                            <Link href="#" className="hover:text-white"><Instagram className="h-4 w-4" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
