
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookCopy, FileText, BookCheck, ClipboardEdit, HelpCircle } from "lucide-react";
import Link from "next/link";

const resources = [
  {
    icon: <FileText className="w-8 h-8 text-rose-500" />,
    title: "Previous Year Questions",
    description: "Sharpen your skills and get exam-ready by practicing with past papers.",
    href: "/resources/previous-year-questions",
  },
  {
    icon: <BookCheck className="w-8 h-8 text-green-500" />,
    title: "NCERT Solutions",
    description: "Access detailed, step-by-step solutions for all your NCERT textbook questions.",
    href: "/resources/ncert-solutions",
  },
  {
    icon: <ClipboardEdit className="w-8 h-8 text-yellow-500" />,
    title: "Notes",
    description: "Find concise and well-structured notes designed for quick revision.",
    href: "/resources/notes",
  },
  {
    icon: <BookCopy className="w-8 h-8 text-blue-500" />,
    title: "Reference Books",
    description: "Explore a curated collection of reference books to supplement your learning.",
    href: "/resources/reference-books",
  },
]

export function StudyResources() {
  return (
    <section className="w-full py-8 md:py-16 bg-[#F5F5F7]">
      <div className="px-4 md:px-[10%]">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">Study</span> <span style={{ color: '#adb5bd' }}>Resources</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base">
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
             <Link href={resource.href} key={index} className="block h-full group">
                <Card 
                  className="overflow-hidden h-full transition-all duration-300 bg-card p-0 flex flex-col shadow-lg hover:shadow-xl rounded-lg hover:-translate-y-1"
                >
                    <CardContent className="p-6 flex flex-col flex-grow items-start text-left">
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-foreground">{resource.title}</h3>
                          <p className="text-sm mb-4 flex-grow text-muted-foreground">{resource.description}</p>
                        </div>
                        <div className="mt-auto w-full flex justify-end">
                            {resource.icon}
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
