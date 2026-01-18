'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Book, Atom, Landmark, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Academic Programs",
    subtitle: "Class 6 - 12",
    href: "/school",
    icon: <Book className="w-8 h-8 text-primary" />,
    bgColor: "bg-blue-100/50 dark:bg-blue-900/20"
  },
  {
    title: "Medical & Non-Medical",
    subtitle: "NEET, JEE & Foundations",
    href: "/category/iit-jee",
    icon: <Atom className="w-8 h-8 text-green-500" />,
    bgColor: "bg-green-100/50 dark:bg-green-900/20"
  },
  {
    title: "Competitive Exams",
    subtitle: "CUET, SSC, Defence, etc.",
    href: "/examcat",
    icon: <Landmark className="w-8 h-8 text-red-500" />,
    bgColor: "bg-red-100/50 dark:bg-red-900/20"
  },
  {
    title: "Open School Programs",
    subtitle: "NIOS, IGNOU & DU SOL",
    href: "/new-work",
    icon: <Users className="w-8 h-8 text-yellow-500" />,
    bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20"
  },
];

export function ExamCategories() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/30">
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
              <Card className={`h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card ${category.bgColor}`}>
                <CardContent className="p-6 flex flex-col items-start flex-grow">
                    <div className="mb-4">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-foreground text-left">{category.title}</h3>
                    <p className="text-sm mt-1 text-muted-foreground flex-grow">{category.subtitle}</p>
                    <div className="mt-6">
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
