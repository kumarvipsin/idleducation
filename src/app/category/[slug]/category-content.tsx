
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronDown, MessageCircle, Tag, Target, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function CategoryContent({ data, slug, subCategories }: { data: any, slug: string, subCategories: string[] }) {
  if (slug !== 'cuet') {
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
                <div className="flex items-center space-x-2">
                    {/* Placeholder for content */}
                </div>
            </div>
        </div>
        <div className="flex items-center overflow-x-auto space-x-4 mb-8 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.courses.length > 0 ? (
            data.courses.map((course: {title: string, description: string}, index: number) => (
              <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex-grow p-6">
                    <BookOpen className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
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
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center">
              <Card className="p-8">
                  <p className="text-muted-foreground">No courses available in this category yet. Please check back later!</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  }

  // CUET specific layout
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
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center overflow-x-auto space-x-4 mb-8 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Button variant="outline" className="rounded-full whitespace-nowrap">Online</Button>
          <Button variant="outline" className="rounded-full whitespace-nowrap">Offline</Button>
          <Button variant="outline" className="rounded-full whitespace-nowrap">Power Batch</Button>
          <Button variant="outline" className="rounded-full whitespace-nowrap">Newly Launched</Button>
        </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {data.courses.map((course: any, index: number) => (
           <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
             <div className="relative">
                <div className={`absolute top-0 left-0 text-white text-xs font-bold uppercase px-3 py-1 ${course.modeColor} rounded-br-lg z-10`}>
                    {course.mode}
                </div>
                <Image
                    src={course.image}
                    alt={course.title}
                    data-ai-hint={course.imageHint}
                    width={600}
                    height={400}
                    className="w-full object-cover aspect-video"
                />
             </div>
             <CardContent className="p-4 flex flex-col flex-grow">
               <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold flex-grow truncate">{course.title}</h3>
                {course.tags && course.tags.map((tag: string) => (
                    <Badge key={tag} variant={tag === 'NEW' ? 'default' : 'secondary'} className="whitespace-nowrap">{tag}</Badge>
                ))}
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
               </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    <p className="truncate">{course.target}</p>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <p className="truncate">Starts on {course.startDate} <span className="mx-1">·</span> Ends on {course.endDate}</p>
                </div>
                
                {course.features && course.features.text && (
                  <div className="bg-gray-800 text-white rounded-md p-2 flex justify-between items-center text-sm mb-4">
                      <span>{course.features.text}</span>
                      <span className="bg-yellow-500 text-gray-900 font-bold text-xs px-2 py-0.5 rounded-sm">{course.features.badge}</span>
                  </div>
                )}


                <div className="mt-auto pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="text-2xl font-bold">₹{course.price}</p>
                            {course.originalPrice && <p className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</p>}
                        </div>
                        {course.discount && (
                            <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full text-xs">
                                <Tag className="w-3 h-3"/>
                                <span>{course.discount}</span>
                            </div>
                        )}
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">
                        {course.originalPrice ? '(FOR FULL BATCH)' : '(BOOK A SEAT)'}
                     </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline">Explore</Button>
                    <Button>Buy Now</Button>
                </div>
             </CardContent>
           </Card>
         ))}
       </div>
       <div className="mt-12 text-center">
            <Button variant="outline">
                View All Batches <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
       </div>
     </div>
    </div>
  );
}
