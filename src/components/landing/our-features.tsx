
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-red-500" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
    href: "#",
  },
  {
    icon: <BookUp className="w-8 h-8 text-blue-500" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
    href: "#",
  },
  {
    icon: <FileStack className="w-8 h-8 text-purple-500" />,
    title: "1000+",
    subtitle: "Tests, sample papers & notes",
    href: "#",
  },
  {
    icon: <Users className="w-8 h-8 text-yellow-500" />,
    title: "100+",
    subtitle: "Expert Teachers",
    href: "#",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative pb-12 md:pb-16 bg-white dark:bg-muted/20"
    >
      <div className="container mx-auto px-4 md:px-[10%] -mt-16">
        <Card className="shadow-lg rounded-xl mx-auto" style={{ paddingBlock: '0.5rem' }}>
            <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {features.map((feature, index) => (
                        <Link href={feature.href} key={index} className="relative group">
                            <div className="flex flex-col items-center text-center p-4 gap-2">
                                <div className="p-4 bg-background/60 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 shadow-inner">
                                    {feature.icon}
                                </div>
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
