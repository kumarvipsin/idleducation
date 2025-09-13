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
        <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative h-56 w-full">
                <Image
                src={avatar}
                alt={name}
                data-ai-hint={avatarHint}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-bold">{name}</h3>
                <p className="text-sm text-primary">{designation}</p>
                <p className="text-sm text-muted-foreground">{experience}</p>
            </CardContent>
        </Card>
    );
}
