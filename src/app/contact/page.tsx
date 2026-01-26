'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MessageSquare, MapPin, Linkedin, Facebook, Twitter, Instagram, Youtube, X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitContactForm } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "A valid phone number is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  });
  
  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const result = await submitContactForm(data);

    if (result.success) {
      toast({ title: "Success", description: result.message });
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
       <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm border shadow-lg hover:bg-background/50">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
          </Button>
      </Link>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Right Info (order changed for mobile) */}
          <div className="space-y-8 text-center lg:text-left order-1 lg:order-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
              <p className="text-gray-600 dark:text-gray-300">
                We are here to help! Whether you have a question about our courses, need support, or just want to say hello, our team is ready to answer all your questions.
              </p>
            </div>
            
            <div className="relative p-8 bg-background/50 backdrop-blur-sm rounded-2xl shadow-lg mt-8 text-foreground border">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5" />
                  <a href="tel:01145035713" className="hover:text-primary">011 45035713</a>
                </div>
                 <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:info@idleducation.in" className="hover:text-primary">info@idleducation.in</a>
                </div>
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08.12 4.79.12h.01c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zM12.04 20.1c-1.55 0-3.04-.49-4.28-1.38l-.3-.18-3.18.84.85-3.1-.19-.31c-.98-1.56-1.5-3.39-1.5-5.28 0-4.51 3.67-8.18 8.18-8.18s8.18 3.67 8.18 8.18-3.67 8.18-8.18 8.18zm4.49-5.37c-.27-.13-1.59-.78-1.84-.87-.25-.09-.43-.13-.62.13-.19.27-.7.87-.86 1.04-.16.18-.32.19-.59.06-.27-.13-1.15-.42-2.18-1.34s-1.66-2.09-1.86-2.43c-.2-.35-.02-.54.12-.68.12-.13.27-.32.4-.43.14-.11.18-.18.27-.3.09-.12.05-.23-.02-.32-.07-.09-.62-1.49-.85-2.04-.23-.55-.46-.48-.62-.48-.15 0-.32-.02-.49-.02s-.43.06-.65.3c-.22.25-.85.83-.85 2.02s.87 2.35 1 2.51c.13.16.85 1.35 2.98 2.62.5.31.89.49 1.2.62.5.21.94.18 1.3.11.39-.07 1.15-.47 1.32-.92.16-.45.16-.83.11-.92-.05-.09-.18-.13-.45-.26z"/></svg>
                  <a href="https://wa.me/918860040010" target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp: +91 8860040010</a>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5" />
                  <span>Krishan Vihar, Delhi-110086</span>
                </div>
              </div>

              <Separator className="my-6 bg-border" />

              <div className="flex items-center gap-4">
                <p className="font-semibold">Find us on:</p>
                <div className="flex gap-2">
                    <a href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
                    <a href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Facebook className="h-4 w-4" /></a>
                    <a href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
                    <a href="https://www.youtube.com/@idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Youtube className="h-4 w-4" /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Left Form */}
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <Card className="w-full max-w-lg mx-auto bg-background/80 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-primary/10">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="Full Name *" {...field} className="pl-9 h-12 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="tel" placeholder="Phone *" {...field} className="pl-9 h-12 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="email" placeholder="Email *" {...field} className="pl-9 h-12 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                              <Textarea placeholder="Message *" className="pl-9 min-h-[120px] rounded-lg" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full font-bold h-12 rounded-lg" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Submitting...' : 'SUBMIT'}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      Company Name not sell, share, or trade customer information. Your privacy is very important to us.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
