'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Academic Programs",
    subtitle: "Class 6 - 12",
    href: "/school",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "students in classroom"
  },
  {
    title: "Competitive Exams",
    subtitle: "CUET | SSC | DELHI POLICE & OTHER EXAM",
    href: "/examcat",
    imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "professionals meeting"
  },
  {
    title: "Open School Programs",
    subtitle: "NIOS | IGNOU | DU SOL",
    href: "/new-work",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "students outdoors"
  },
  {
    title: "Other Programs",
    subtitle: "NEET / JEE & OTHER FOUNDATION",
    href: "/category/iit-jee",
    imageUrl: "https://images.unsplash.com/photo-1627993093883-3729daste15a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "science laboratory"
  }
];

export function ExamCategories() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Exam Categories</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find the perfect program to help you achieve your academic and career goals.
          </p>
        </div>
      </div>
       <div className="relative">
        <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 px-4 md:px-[10%]">
                {categories.map((category, index) => (
                    <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                        <Link href={category.href} className="block h-full">
                            <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                                 <div className="relative aspect-video w-full">
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.title}
                                        data-ai-hint={category.imageHint}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                                    <p className="text-sm mt-1 text-muted-foreground">{category.subtitle}</p>
                                    <div className="mt-auto pt-4">
                                        <div className="text-primary font-semibold flex items-center group-hover:underline">
                                            Read more
                                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
