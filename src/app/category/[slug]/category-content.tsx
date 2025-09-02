
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronDown, MessageCircle, Tag, Target, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function CategoryContent({ data, slug, subCategories }: { data: any, slug: string, subCategories: string[] }) {
  
  return (
    <div>
      <section className="bg-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{data.name} Online Coaching, Complete Course for {data.name} Preparation</h1>
              <p className="text-base md:text-lg text-foreground/80">
                  {data.name} Online Coaching 2025 provides study material for the required sections. Students can solve mock tests and evaluate their performance in our {data.name} Online Coaching Class.
              </p>
          </div>
      </section>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="border-b mb-8">
            <div className="flex items-center justify-between overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center space-x-8">
                    {subCategories.map((sub, index) => (
                        <button key={index} className={`whitespace-nowrap pb-2 border-b-2 font-medium ${index === 0 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                            {sub}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.courses?.map((course: any, index: number) => {
            if (course.bgColor) {
                return (
                    <div key={index} className="p-1 h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${course.bgColor}`}>
                            <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                            <h3 className={`text-xl font-semibold mb-2 ${course.textColor}`}>
                                {course.title}
                            </h3>
                             {course.description && <p className={`text-sm mb-2 ${course.textColor}`}>{course.description}</p>}
                             {course.language && <p className={`text-xs ${course.textColor}`}>{course.language}</p>}
                            <div className="flex items-center justify-center gap-2 mt-auto pt-4">
                                {course.buttons.map((button: any) => (
                                <Button key={button.text} asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                                    <Link href={button.href}>{button.text}</Link>
                                </Button>
                                ))}
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            }
            if (course.title && course.description) {
              return (
                <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardHeader>
                      <BookOpen className="w-10 h-10 text-primary mb-2" />
                      <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{course.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href="#">
                        View Course <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            }
          })}
        </div>
      </div>
  </div>
  );
}
