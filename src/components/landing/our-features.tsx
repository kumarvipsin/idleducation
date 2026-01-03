
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight, FlaskConical, Clock, IndianRupee, Zap, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "100+ Expert Faculty",
    href: "/feature/expert-faculty",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "100% Quality Education",
    href: "/feature/quality-education",
  },
  {
    icon: <FileStack className="w-5 h-5" />,
    title: "100% Complete Syllabus",
    href: "/feature/complete-syllabus",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Unique Two-Teacher Model",
    href: "/feature/two-teacher-model",
  },
   {
    icon: <BookUp className="w-5 h-5" />,
    title: "All-in-One Learning, Anytime, Anywhere.",
    href: "/feature/all-in-one-learning",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 md:px-[10%] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="space-y-6">
                    <div className="flex items-center">
                        <span className="text-sky-500 text-2xl mr-2">•</span>
                        <h2 className="text-lg font-semibold text-sky-500">Why Choose IDL?</h2>
                    </div>
                     <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                        Experience a New Era of Learning
                    </h3>
                    <p className="text-muted-foreground">
                        Our platform is meticulously crafted to provide a holistic and effective learning experience. Here's what sets us apart:
                    </p>
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                           <Link href={feature.href} key={index} className="block group">
                             <Card className="shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                            {feature.icon}
                                        </div>
                                        <p className="font-semibold text-foreground">{feature.title}</p>
                                    </div>
                                     <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                                </CardContent>
                            </Card>
                           </Link>
                        ))}
                    </div>
                </div>
            </div>
             <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                 <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                     <Image
                        src="https://picsum.photos/seed/learning/800/800"
                        alt="A student engaged in learning"
                        data-ai-hint="student learning"
                        fill
                        className="object-cover rounded-2xl shadow-xl"
                    />
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
}
