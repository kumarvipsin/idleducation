
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const resources = [
  {
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    image: "/books.png",
    imageHint: "reference books",
    buttonText: "Explore",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    href: "#"
  },
  {
    title: "NCERT Solutions",
    description: "Unlock academic excellence with Physics Wallah's NCERT Solutions which provides you step-by-step solutions",
    image: "/solutions.png",
    imageHint: "NCERT solutions",
    buttonText: "Explore",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    href: "#"
  },
  {
    title: "Notes",
    description: "Use Physics Wallah's detailed study materials that simplify complex ideas into easily understandable language.",
    image: "/notes.png",
    imageHint: "study notes",
    buttonText: "Explore",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    href: "#"
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
            <Card key={index} className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${resource.bgColor}`}>
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-2 text-left">{resource.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow text-left">{resource.description}</p>
                <div className="my-4 flex justify-center">
                    <Image 
                        src={resource.image} 
                        alt={resource.title}
                        data-ai-hint={resource.imageHint}
                        width={250}
                        height={200}
                        className="object-contain h-48 w-auto"
                    />
                </div>
                <div className="text-left mt-auto">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href={resource.href}>{resource.buttonText}</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
