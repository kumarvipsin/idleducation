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
    title: "Medical & Non-Medical",
    subtitle: "Take the First Step towards becoming a Doctor/Engineer",
    href: "/category/iit-jee",
    imageUrl: "https://cdn1.byjus.com/wp-content/uploads/2024/02/Aakash_JEE_NEET.webp",
    imageHint: "student studying"
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
];

export function ExamCategories() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary">Exam Categories</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find the perfect program to help you achieve your academic and career goals.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="block group">
              <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                      src={category.imageUrl}
                      alt={category.title}
                      data-ai-hint={category.imageHint}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 flex flex-col items-start flex-grow">
                    <h3 className="text-lg font-bold text-foreground text-left">{category.title}</h3>
                    <p className="text-xs mt-1 text-muted-foreground flex-grow">{category.subtitle}</p>
                    <div className="mt-4">
                        <div className="text-primary font-semibold flex items-center group-hover:underline text-sm">
                            Explore Category
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
