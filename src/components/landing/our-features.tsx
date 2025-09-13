
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, Building, Video, MessageSquare, Award, Tv } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: <GraduationCap className="w-10 h-10 text-red-500" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
    href: "#",
  },
  {
    icon: <BookUp className="w-10 h-10 text-blue-500" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
    href: "#",
  },
  {
    icon: <FileStack className="w-10 h-10 text-purple-500" />,
    title: "1000+",
    subtitle: "Tests, sample papers & notes",
    href: "#",
  },
  {
    icon: <Users className="w-10 h-10 text-yellow-500" />,
    title: "100+",
    subtitle: "Expert Teachers",
    href: "#",
  },
  {
    icon: <Building className="w-10 h-10 text-green-500" />,
    title: "5+",
    subtitle: "Offline centres",
    href: "/offline-centers",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full pt-6 md:pt-12 pb-12 md:pb-16 bg-[#F0F8FF] -mt-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <Card className="shadow-lg rounded-xl">
            <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {features.map((feature, index) => (
                        <Link href={feature.href} key={index} className="relative group">
                            <div className="flex flex-col items-center text-center p-4 gap-2">
                                {feature.icon}
                                <h3 className="text-lg font-bold text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
                            </div>
                            {index < features.length - 1 && (
                                <Separator orientation="vertical" className="absolute right-0 top-1/4 h-1/2 hidden md:block" />
                            )}
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
