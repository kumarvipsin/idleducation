
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MessageSquare, MapPin, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitContactForm } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const contactFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
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
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      message: '',
    },
  });
  
  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const result = await submitContactForm({ 
        name: `${data.firstName} ${data.lastName}`, 
        email: data.email, 
        phone: data.phone, 
        message: data.message
    });

    if (result.success) {
      toast({ title: "Success", description: result.message });
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-gray-900 p-4">
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Right Info (order changed for mobile) */}
          <div className="space-y-8 text-center lg:text-left order-1 lg:order-2">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
              <p className="text-gray-600 dark:text-gray-300">
                We are here to help! Whether you have a question about our courses, need support, or just want to say hello, our team is ready to answer all your questions.
              </p>
            </div>
            
            <div className="relative p-8 bg-muted dark:bg-card rounded-2xl shadow-lg mt-8 text-foreground">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5" />
                  <span>+1-760-284-3410</span>
                </div>
                 <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5" />
                  <span>hello@demoemail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5" />
                  <span>931 Abia Martin Drive, PA-18104</span>
                </div>
              </div>

              <Separator className="my-6 bg-border" />

              <div className="flex items-center gap-4">
                <p className="font-semibold">Find us on:</p>
                <div className="flex gap-2">
                    <a href="#" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Facebook className="h-4 w-4" /></a>
                    <a href="#" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
                    <a href="#" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Linkedin className="h-4 w-4" /></a>
                    <a href="#" className="h-8 w-8 flex items-center justify-center bg-background rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"><Instagram className="h-4 w-4" /></a>
                </div>
              </div>
            </div>
          </div>

          {/* Left Form */}
          <div className="order-2 lg:order-1">
            <Card className="w-full max-w-lg mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="First Name *" {...field} className="pl-9 h-12 bg-gray-100 dark:bg-gray-800/50 border-0 rounded-lg" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Last Name *" {...field} className="pl-9 h-12 bg-gray-100 dark:bg-gray-800/50 border-0 rounded-lg" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="tel" placeholder="Phone *" {...field} className="pl-9 h-12 bg-gray-100 dark:bg-gray-800/50 border-0 rounded-lg" />
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
                              <Input type="email" placeholder="Email *" {...field} className="pl-9 h-12 bg-gray-100 dark:bg-gray-800/50 border-0 rounded-lg" />
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
                              <Textarea placeholder="Message *" className="pl-9 min-h-[120px] bg-gray-100 dark:bg-gray-800/50 border-0 rounded-lg" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg" disabled={form.formState.isSubmitting}>
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
