'use client';
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 md:px-[10%]">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
            Contact Us
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-semibold">
            We are here to help! Fill out the form and our team will get back to you.
        </p>
      </div>
      <div className="w-full max-w-lg mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <Card className="shadow-none rounded-2xl border-2 border-primary/10 bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-0">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}