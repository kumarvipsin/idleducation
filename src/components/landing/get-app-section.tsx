
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, HelpCircle, CheckCircle, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What courses do you offer?",
    answer: "We offer a wide range of courses for students from Class 4 to Class 10, covering subjects like Mathematics, Science, History, and Arts. We also have specialized courses for competitive exams.",
  },
  {
    question: "Are the classes live or recorded?",
    answer: "Our platform offers both live interactive classes and recorded sessions. This allows students to learn at their own pace and revisit concepts whenever they need to.",
  },
  {
    question: "How are doubts cleared?",
    answer: "We have a unique two-teacher model where one teacher conducts the class and another teacher is dedicated to clearing doubts instantly during the live session. We also have dedicated doubt-solving sessions.",
  },
  {
    question: "Do you provide study materials?",
    answer: "Yes, we provide comprehensive study materials including notes, practice questions, sample papers, and mock tests to ensure students are well-prepared for their exams.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Absolutely! You can book a free demo class to experience our teaching methodology and platform features before enrolling in a course.",
  },
];


export function GetAppSection() {
  return (
    <section className="w-full py-6 md:py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <p className="text-lg font-semibold">Frequently Asked Questions</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Frequently Asked Questions</DialogTitle>
              </DialogHeader>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DialogContent>
          </Dialog>

          <Card className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Link href="/contact" className="flex items-center gap-4 p-6">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-lg font-semibold">Talk to an expert</p>
            </Link>
          </Card>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-10 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Column 1: Mobile App Image */}
            <div className="relative h-64 md:h-80 flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8bW9iaWxlJTIwfGVufDB8fHx8MTc2ODY3MTQ5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="IDL Education App Features"
                    data-ai-hint="mobile learning app"
                    fill
                    className="object-contain"
                />
            </div>
            
            {/* Column 2: Title and Key Points */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold">Get IDL App for JEE & NEET</h2>
              <ul className="space-y-3 text-left">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Access <strong>free</strong> videos worth ₹5000</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explore core concept videos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Clear all your doubts</span>
                </li>
              </ul>
            </div>

            {/* Column 3: QR and App Store Links */}
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-2 rounded-lg">
                    <Image
                        src="https://picsum.photos/seed/qr/100/100"
                        alt="QR Code"
                        data-ai-hint="qr code"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="space-y-3 flex flex-col items-center">
                     <Link href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://www.pw.live/_next/static/media/apple-store-badge.acb101ce.webp"
                            alt="Download on the App Store"
                            width={135}
                            height={40}
                        />
                    </Link>
                    <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                            alt="Get it on Google Play"
                            width={135}
                            height={40}
                        />
                    </Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
