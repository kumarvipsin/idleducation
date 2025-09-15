
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
          className="relative pt-12 text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card rounded-lg"
          style={{
            background: 'linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)'
          }}
        >
            <div className="absolute top-0 left-0 w-full h-24 bg-primary/10 dark:bg-primary/20 rounded-t-lg"></div>
            <div className="relative -mt-12">
                <Image
                    src={avatar}
                    alt={name}
                    data-ai-hint={avatarHint}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-background bg-background shadow-md object-cover inline-block"
                />
            </div>
            <CardContent className="p-6 text-white">
                <h3 className="text-lg font-bold uppercase tracking-wider">{name}</h3>
                <p className="text-sm text-white/90">{designation}</p>
                <p className="text-sm text-white/80 mt-1">{experience}</p>
                <div className="flex justify-center gap-4 mt-4 text-white/80">
                    <Link href="#" className="hover:text-white"><Facebook className="h-4 w-4" /></Link>
                    <Link href="#" className="hover:text-white"><Twitter className="h-4 w-4" /></Link>
                    <Link href="#" className="hover:text-white"><Instagram className="h-4 w-4" /></Link>
                </div>
            </CardContent>
        </Card>
    );
}
