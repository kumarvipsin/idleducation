
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const resources = [
  {
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    image: "https://images.unsplash.com/photo-1544716278-e513176f20b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib29rc3RvcmV8ZW58MHx8fHwxNzU2MjYyODU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "books shelf",
    buttonText: "Explore",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    href: "#"
  },
  {
    title: "NCERT Solutions",
    description: "Unlock academic excellence with our NCERT Solutions which provides you step-by-step solutions.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMG1hdGVyaWFsc3xlbnwwfHx8fDE3NTYyNjI4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "study materials",
    buttonText: "Explore",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    href: "#"
  },
  {
    title: "Notes",
    description: "Use our detailed study materials that simplify complex ideas into easily understandable language.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkb2N1bWVudHN8ZW58MHx8fHwxNzU2MjYyOTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "documents",
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
              <CardContent className="p-6 text-center flex flex-col items-center h-full">
                <h3 className="text-2xl font-bold mb-2">{resource.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{resource.description}</p>
                <div className="my-4">
                    <Image 
                        src={resource.image} 
                        alt={resource.title}
                        data-ai-hint={resource.imageHint}
                        width={200}
                        height={200}
                        className="object-contain h-48 w-full"
                    />
                </div>
                <Button asChild className="mt-auto">
                    <Link href={resource.href}>{resource.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
