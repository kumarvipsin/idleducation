'use client';

import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";

const categories = [
  {
    title: "School Programs",
    subtitle: "Classes 6-12",
    href: "/school",
    imageUrl: "https://png.pngtree.com/png-vector/20240415/ourmid/pngtree-a-picture-of-a-school-boy-with-a-blue-background-png-image_12236319.png",
    imageHint: "school boy"
  },
  {
    title: "Competitive Exams",
    subtitle: "JEE, NEET, SSC, NDA, CUET",
    href: "/examcat",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/028/286/737/non_2x/a-female-doctor-smiles-and-looks-up-at-the-sky-with-a-stethoscope-around-her-neck-ai-generated-photo.jpg",
    imageHint: "female doctor"
  },
  {
    title: "Open School & Special Programs",
    subtitle: "NIOS, Foundation Courses",
    href: "#",
    imageUrl: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/student-smiling.png",
    imageHint: "male student"
  },
  {
    title: "Other Programs",
    subtitle: "Explore more learning opportunities",
    href: "#",
    imageUrl: "https://picsum.photos/seed/other-programs/800/600",
    imageHint: "group learning"
  }
];

export function ExamCategories() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Exam Categories</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find the perfect program to help you achieve your academic and career goals.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
                <Link href={category.href} key={index} className="block group">
                    <Card className="h-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                        <CardContent className="p-0 flex-grow flex flex-col justify-between">
                            <div className="p-6 text-white text-center z-10" style={{ background: 'linear-gradient(135deg, #2E6B9E, #62B8F6)'}}>
                                <h3 className="text-xl font-bold">{category.title}</h3>
                                <p className="text-sm opacity-90">{category.subtitle}</p>
                            </div>
                            <div className="relative aspect-[4/3.5] w-full mt-auto">
                                <Image
                                    src={category.imageUrl}
                                    alt={category.title}
                                    data-ai-hint={category.imageHint}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
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
