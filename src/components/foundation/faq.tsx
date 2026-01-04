
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can I donate to IDL Foundation?",
    answer: "You can donate through our website by clicking the 'Donate' button. We accept various payment methods through our secure gateway. Your contribution helps fund our educational and social initiatives.",
  },
  {
    question: "What are the main areas IDL Foundation works in?",
    answer: "We focus on several key areas: providing education for underprivileged children, skill development for youth, women empowerment programs, environmental initiatives like tree plantation, and providing medical assistance to those in need.",
  },
  {
    question: "How is my donation utilized?",
    answer: "Your donation is utilized transparently and efficiently. A majority of the funds go directly into our programs, covering costs for educational materials, teacher salaries, vocational training equipment, and medical supplies. A small portion is used for administrative costs.",
  },
  {
    question: "Can I volunteer for IDL Foundation?",
    answer: "Yes, we welcome volunteers who are passionate about making a difference. You can find more information and apply to be a volunteer through the 'Become a Volunteer' link on our website. We have various opportunities ranging from teaching to event management.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer: "Yes, IDL Foundation is a registered non-profit organization. All donations made in India are eligible for tax exemption under Section 80G of the Income Tax Act. A receipt for your donation will be provided for your tax purposes.",
  },
  {
    question: "How can I stay updated on the foundation's activities?",
    answer: "You can follow us on our social media channels (Facebook, Instagram, Twitter) and subscribe to our newsletter. We regularly post updates, success stories, and information about upcoming events and campaigns.",
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
