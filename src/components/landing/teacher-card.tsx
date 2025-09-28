
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
        <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl h-full border border-border/20">
            <CardContent className="p-6 text-center flex flex-col items-center h-full">
                <div className="relative w-32 h-32 mb-4 transition-transform duration-500 group-hover:scale-110">
                     <GcsImage
                        filePath={avatar}
                        alt={name}
                        fill
                        className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">{name}</h3>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mt-1">{designation}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-dashed w-full">
                     <p className="text-xs text-muted-foreground font-medium">{experience}</p>
                </div>
            </CardContent>
        </Card>
    );
}
