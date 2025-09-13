
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
        <Card className="relative pt-12 text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card rounded-lg">
            <div className="absolute top-0 left-0 w-full h-24 bg-muted/50 dark:bg-muted/20 rounded-t-lg"></div>
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
            <CardContent className="p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider">{name}</h3>
                <p className="text-sm text-primary">{designation}</p>
                <p className="text-sm text-muted-foreground mt-1">{experience}</p>
                <div className="flex justify-center gap-4 mt-4 text-muted-foreground">
                    <Link href="#" className="hover:text-primary"><Facebook className="h-4 w-4" /></Link>
                    <Link href="#" className="hover:text-primary"><Twitter className="h-4 w-4" /></Link>
                    <Link href="#" className="hover:text-primary"><Instagram className="h-4 w-4" /></Link>
                </div>
            </CardContent>
        </Card>
    );
}
