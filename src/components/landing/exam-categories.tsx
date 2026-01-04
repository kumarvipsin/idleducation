
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Academic Programs",
    subtitle: "Your complete guide to school-level success.",
    href: "/school",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "students in classroom"
  },
  {
    title: "For Medical & Non Medical",
    subtitle: "Take the First Step towards becoming a Doctor/Engineer",
    href: "/category/iit-jee",
    imageUrl: "https://cdn1.byjus.com/wp-content/uploads/2024/02/Aakash_JEE_NEET.webp",
    imageHint: "student studying"
  },
  {
    title: "For Competitive Exams",
    subtitle: "Your gateway to success in government and national-level entrance exams.",
    href: "/examcat",
    imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "professionals meeting"
  },
  {
    title: "For Open School/College",
    subtitle: "Flexible and accessible education for all through NIOS, IGNOU, and DU SOL.",
    href: "/new-work",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageHint: "students outdoors"
  },
];

export function ExamCategories() {
  return (
    <section className="w-full py-4 md:py-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 text-2xl mr-2">•</span>
              <h2 className="text-lg font-semibold text-blue-600">Exam Categories</h2>
            </div>
          <h3 className="text-3xl md:text-4xl font-black text-muted-foreground tracking-tight mt-2">
            Find the perfect program to help you achieve your academic and career goals.
          </h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore a wide range of courses designed to provide comprehensive knowledge and skills, ensuring you are well-prepared for any challenge ahead.
          </p>
        </div>
      </div>
       <div className="relative">
        <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-6 px-4 md:px-[10%]">
                {categories.map((category, index) => (
                    <div key={index} className="block flex-shrink-0 w-[300px] h-[525px] sm:w-[350px] sm:h-[612.5px] group">
                        <Link href={category.href} className="block h-full">
                            <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                                <div className="relative w-full h-[75%]">
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.title}
                                        data-ai-hint={category.imageHint}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-4 flex flex-col items-start bg-gradient-to-t from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 h-[25%]">
                                    <h3 className="text-lg font-bold text-foreground text-left">{category.title}</h3>
                                    <p className="text-xs mt-1 text-muted-foreground">{category.subtitle}</p>
                                    <div className="mt-auto pt-2">
                                        <div className="text-primary font-semibold flex items-center group-hover:underline text-sm">
                                            Explore Category
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
