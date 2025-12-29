'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    title: "Academic Programs",
    subtitle: "Class 6 - 12",
    href: "/school",
    imageUrl: "https://www.euroschoolindia.com/wp-content/uploads/2023/10/what-is-the-cbse-board-and-how-does-it-work.jpg",
    imageHint: "students in classroom"
  },
  {
    title: "Competitive Exams",
    subtitle: "CUET | SSC | DELHI POLICE & OTHER EXAM",
    href: "/examcat",
    imageUrl: "https://static.vecteezy.com/system/resources/thumbnails/008/412/475/small_2x/group-of-people-in-formal-wear-walking-and-talking-in-a-busy-modern-office-building-in-the-lobby-in-slow-motion-video.jpg",
    imageHint: "professionals meeting"
  },
  {
    title: "Open School Programs",
    subtitle: "NIOS | IGNOU | DU SOL",
    href: "/new-work",
    imageUrl: "https://png.pngtree.com/png-vector/20240409/ourmid/pngtree-a-group-of-students-studying-png-image_12239493.png",
    imageHint: "students outdoors"
  },
  {
    title: "Other Programs",
    subtitle: "NEET / JEE & OTHER FOUNDATION",
    href: "/category/iit-jee",
    imageUrl: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/share/neet-jee.png",
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
                                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 p-4">
                                     <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{category.subtitle}</Badge>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.title}
                                            data-ai-hint={category.imageHint}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <CardContent className="p-6 flex flex-col items-start flex-grow">
                                    <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                                    <p className="text-sm mt-1 text-muted-foreground">{category.subtitle}</p>
                                    <div className="mt-auto pt-4">
                                        <div className="text-primary font-semibold flex items-center group-hover:underline underline-offset-4">
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
