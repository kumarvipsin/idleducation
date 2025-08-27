
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    href: "/resources/reference-books"
  },
  {
    title: "NCERT Solutions",
    description: "Unlock academic excellence with Physics Wallah's NCERT Solutions which provides you step-by-step solutions",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    href: "/resources/ncert-solutions"
  },
  {
    title: "Notes",
    description: "Use Physics Wallah's detailed study materials that simplify complex ideas into easily understandable language.",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    href: "/resources/notes"
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
            <Link href={resource.href} key={index} className="group block">
              <Card className={`overflow-hidden shadow-lg h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 ${resource.bgColor}`}>
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2 text-left">{resource.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow text-left">{resource.description}</p>
                  <div className="text-left mt-auto">
                      <div className="inline-flex items-center font-semibold text-primary group-hover:underline">
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
