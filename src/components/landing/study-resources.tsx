
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookCopy, FileText, BookCheck, ClipboardEdit } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    icon: <BookCopy className="w-8 h-8 text-blue-500" />,
    title: "Reference Books",
    description: "Explore a curated collection of reference books to supplement your learning.",
    href: "/resources/reference-books",
    gradient: "from-blue-50 to-purple-50",
    shadowColor: "shadow-blue-500/20",
  },
  {
    icon: <FileText className="w-8 h-8 text-red-500" />,
    title: "Previous Year Questions",
    description: "Sharpen your skills and get exam-ready by practicing with past papers.",
    href: "/resources/previous-year-questions",
    gradient: "from-red-50 to-orange-50",
    shadowColor: "shadow-red-500/20",
  },
  {
    icon: <BookCheck className="w-8 h-8 text-green-500" />,
    title: "NCERT Solutions",
    description: "Access detailed, step-by-step solutions for all your NCERT textbook questions.",
    href: "/resources/ncert-solutions",
    gradient: "from-green-50 to-teal-50",
    shadowColor: "shadow-green-500/20",
  },
  {
    icon: <ClipboardEdit className="w-8 h-8 text-yellow-500" />,
    title: "Notes",
    description: "Find concise and well-structured notes designed for quick revision.",
    href: "/resources/notes",
    gradient: "from-yellow-50 to-amber-50",
    shadowColor: "shadow-yellow-500/20",
  },
]

export function StudyResources() {
  return (
    <section className="w-full py-8 md:py-16 bg-[#F0F8FF]">
      <div className="container mx-auto px-4 md:px-6" style={{ maxWidth: '79%' }}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Study</span> <span style={{ color: '#adb5bd' }}>Resources</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base">
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
             <Link href={resource.href} key={index} className="block h-full group">
                <Card 
                  className={`overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 bg-card p-0 flex flex-col shadow-lg hover:shadow-2xl dark:bg-zinc-800/50`}
                >
                    <CardContent className={`p-6 flex flex-col flex-grow items-center text-center bg-gradient-to-br ${resource.gradient} dark:from-zinc-900 dark:to-zinc-800`}>
                        <div className="p-4 bg-background/60 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 shadow-inner">
                            {resource.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-foreground">{resource.title}</h3>
                        <p className="text-sm mb-4 flex-grow text-muted-foreground">{resource.description}</p>
                        <div className="mt-auto flex justify-center items-center font-semibold text-primary group-hover:underline underline-offset-4">
                            <span className="text-sm">Explore</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
