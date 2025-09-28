'use client';
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className="relative overflow-visible shadow-lg rounded-xl h-full flex flex-col group">
            <div className="bg-primary h-24 rounded-t-xl absolute w-full top-0 left-0"></div>
            <CardContent className="relative flex flex-col items-center pt-12 flex-1">
                <div className="w-28 h-28 rounded-full bg-pink-100 border-4 border-white dark:border-card shadow-md flex items-center justify-center overflow-hidden mb-4">
                    <div className="relative w-full h-full">
                         <GcsImage
                            filePath={avatar}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold font-serif text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">{designation}</p>
                
                <p className="text-sm text-muted-foreground text-center mt-4 flex-grow">
                    {experience}
                </p>

                <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                    <Link href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
                    <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
                    <Link href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
                </div>
                
            </CardContent>
        </Card>
    );
}
