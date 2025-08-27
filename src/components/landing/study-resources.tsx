
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const resources = [
  {
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    href: "/resources/reference-books",
    imageSrc: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "books library",
  },
  {
    title: "NCERT Solutions",
    description: "Unlock academic excellence with Physics Wallah's NCERT Solutions which provides you step-by-step solutions",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    href: "/resources/ncert-solutions",
    imageSrc: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "student studying",
  },
  {
    title: "Notes",
    description: "Use Physics Wallah's detailed study materials that simplify complex ideas into easily understandable language.",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    href: "/resources/notes",
    imageSrc: "https://images.unsplash.com/photo-1456735180827-d1262f71b8a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "writing notes",
  },
]

export function StudyResources() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Study Resources</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Link href={resource.href} key={index} className="group block h-full">
              <Card className={`overflow-hidden shadow-lg h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 ${resource.bgColor}`}>
                <CardContent className="p-6 flex flex-col h-full text-center">
                   <h3 className="text-2xl font-bold mb-2">{resource.title}</h3>
                   <p className="text-muted-foreground mb-4 flex-grow">{resource.description}</p>
                   <div className="my-4">
                     <Image
                        src={resource.imageSrc}
                        alt={resource.title}
                        data-ai-hint={resource.imageHint}
                        width={600}
                        height={400}
                        className="rounded-lg object-cover w-full aspect-video"
                     />
                   </div>
                  <div className="mt-auto">
                      <div className="inline-flex items-center font-semibold text-primary group-hover:underline justify-center">
                        Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
