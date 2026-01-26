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
        <div className="w-full max-w-lg mx-auto">
          <div className="animate-fade-in-up">
            <Card className="w-full bg-background/80 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-primary/10">
              <CardContent className="p-8">
                 <div className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        We are here to help! Fill out the form and our team will get back to you.
                    </p>
                </div>
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