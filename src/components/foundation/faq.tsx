
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does IDL's learning process work?",
    answer:
      "Our learning process is designed to be interactive and student-centric. We use a blend of live online classes, recorded lectures, and personalized study materials. Our unique two-teacher model ensures that students get their doubts cleared instantly, making learning more effective.",
  },
  {
    question: "Which classes and exam categories do you teach?",
    answer:
      "We offer courses for classes 6 to 12, covering a wide range of subjects. Additionally, we provide specialized coaching for competitive exams like NEET, JEE, CUET, and various government job exams.",
  },
  {
    question: "What makes your teaching methods different?",
    answer:
      "Our teaching methods are a blend of traditional wisdom and modern technology. We focus on conceptual understanding rather than rote learning. Our two-teacher model, personalized attention, and regular assessments help students build a strong foundation and excel in their exams.",
  },
  {
    question: "Do you provide personal doubt-clearing sessions?",
    answer:
      "Yes, absolutely. Our unique two-teacher model in live classes is designed for instant doubt resolution. Additionally, we have dedicated doubt-clearing sessions and one-on-one mentorship to ensure every student's queries are addressed.",
  },
  {
    question: "How many students are there in one batch?",
    answer:
      "We believe in personalized attention, which is why we maintain small batch sizes. This allows our teachers to focus on each student's individual learning needs and provide them with the guidance they need to succeed.",
  },
  {
    question: "Are the classes online, offline, or hybrid?",
    answer:
      "We offer flexible learning options to suit every student's needs. You can choose from online classes, offline sessions at our centers, or a hybrid model that combines the best of both worlds.",
  },
];


export function FAQ() {
    return (
        <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-900 text-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center">
                        <span className="text-blue-600 text-2xl mr-2">•</span>
                        <h2 className="text-lg font-semibold text-blue-600">FAQ</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mt-2">
                        Answers to your most common question
                    </h3>
                </div>

                <div className="max-w-3xl mx-auto mt-12">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index} className="border-b">
                                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pt-2">
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
