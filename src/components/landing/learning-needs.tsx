
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const learningNeeds = [
  {
    title: "Conceptual Clarity",
    description: "Build a strong foundation with clear and concise explanations from expert faculty.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/clarity/800/600",
    imageHint: "teacher explaining concept",
  },
  {
    title: "Practice & Assessment",
    description: "Test your knowledge with a vast library of practice questions, quizzes, and mock tests.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/practice/800/600",
    imageHint: "student taking test",
  },
  {
    title: "Doubt Solving",
    description: "Get your doubts cleared instantly with our two-teacher model and dedicated doubt-solving sessions.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/doubt/800/600",
    imageHint: "student asking question",
  },
];

export function LearningNeeds() {
  return (
    <section 
      className="w-full relative py-12 md:py-24 bg-white dark:bg-gray-800/20"
    >
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)" }}>
              Addressing Every Learning Need
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Our platform is designed to cater to every aspect of a student's learning journey.
            </p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 px-4 md:px-[10%]">
            {learningNeeds.map((need, index) => (
              <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                  <CardContent className="p-8 flex-grow flex flex-col">
                    <h3 className="text-2xl font-black mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{need.title}</h3>
                    <p className="text-sm mt-2 text-muted-foreground flex-grow">{need.description}</p>
                    <div className="mt-4">
                        <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                            <Link href={need.href}>
                                More <ChevronRight className="w-3 h-3 ml-1.5" />
                            </Link>
                        </Button>
                    </div>
                  </CardContent>
                  <div className="relative aspect-[4/3] w-full mt-auto p-4">
                    <Image
                      src={need.imageUrl}
                      alt={need.title}
                      data-ai-hint={need.imageHint}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
