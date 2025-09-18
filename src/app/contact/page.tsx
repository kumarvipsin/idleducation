
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Headset, Building, User, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm, submitSupportTicket } from "@/app/actions";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const supportTicketSchema = z.object({
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    problem: z.string().min(10, { message: "Please describe your problem in at least 10 characters." }),
});

type SupportTicketValues = z.infer<typeof supportTicketSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [showSupportForm, setShowSupportForm] = useState(false);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const supportForm = useForm<SupportTicketValues>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      studentName: '',
      email: '',
      problem: '',
    },
  });
  
  const onContactSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const result = await submitContactForm({ ...data, countryCode: '+91-India' });
    if (result.success) {
      toast({ title: "Success", description: result.message });
      contactForm.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const onSupportSubmit: SubmitHandler<SupportTicketValues> = async (data) => {
    const result = await submitSupportTicket(data);
    if (result.success) {
        toast({ title: "Success", description: result.message });
        supportForm.reset();
        setShowSupportForm(false);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }
  
  const contactDetails = [
    { icon: Phone, label: "For Admission Enquiry", value: "+91 7011117585", href: "tel:+917011117585" },
    { icon: Headset, label: "For Enrolled Students", value: "011 45035713", href: "tel:01145035713" },
    { icon: Mail, label: "Email Address", value: "info@idleducation.in", href: "mailto:info@idleducation.in" },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white dark:from-background dark:via-blue-900/10 dark:to-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg overflow-hidden flex flex-col md:flex-row border-t-8 border-primary rounded-t-lg">
            <div className="p-8 md:w-1/2 bg-white dark:bg-card mt-[5%] mb-[5%] ml-[5%] mr-[1.25%] border rounded-lg flex flex-col justify-start">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary">Get in Touch</h2>
                <p className="text-muted-foreground">We're here to help and answer any question you might have. We look forward to hearing from you.</p>
              </div>
              
              <div className="space-y-6 flex-grow mt-8">
                  {contactDetails.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                        <div className="p-3 bg-primary/10 text-primary rounded-full">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">{item.label}</h4>
                            <a href={item.href} className="text-muted-foreground hover:text-primary hover:underline">{item.value}</a>
                        </div>
                    </div>
                  ))}
                   <div className="pt-4 border-t">
                    {showSupportForm ? (
                      <div className="p-4 border rounded-lg bg-muted/30">
                         <h3 className="text-sm font-semibold mb-2">Submit a Support Ticket</h3>
                         <p className="text-xs text-muted-foreground mb-3">Please describe your issue, and our support team will get back to you shortly.</p>
                         <Form {...supportForm}>
                            <form onSubmit={supportForm.handleSubmit(onSupportSubmit)} className="space-y-3">
                                <FormField
                                    control={supportForm.control}
                                    name="studentName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                                    <Input placeholder="Your full name" {...field} className="pl-7 h-9 text-xs" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={supportForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                              <div className="relative">
                                                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                                <Input type="email" placeholder="Your email address" {...field} className="pl-7 h-9 text-xs" />
                                              </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={supportForm.control}
                                    name="problem"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                              <div className="relative">
                                                <Edit className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
                                                <Textarea placeholder="Describe your issue..." {...field} className="pl-7 text-xs" />
                                              </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-2">
                                    <Button type="submit" size="sm" className="flex-1" disabled={supportForm.formState.isSubmitting}>
                                        {supportForm.formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setShowSupportForm(false)}>Cancel</Button>
                                </div>
                            </form>
                        </Form>
                      </div>
                    ) : (
                      <div>
                          <h3 className="text-sm font-semibold mb-1">Technical Support</h3>
                          <p className="text-xs text-muted-foreground mb-3">Are you an enrolled student facing a technical issue? Please raise a support ticket.</p>
                          <Button variant="outline" size="sm" onClick={() => setShowSupportForm(true)}>
                              <Headset className="mr-2 h-4 w-4"/>
                              Raise a Support Ticket
                          </Button>
                      </div>
                    )}
                  </div>
              </div>
            </div>

            <div className="md:w-1/2 mt-[5%] mb-[5%] mr-[5%] ml-[1.25%] flex flex-col gap-4">
              <div className="p-8 border rounded-lg flex flex-col justify-start">
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4 flex flex-col">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter your name *" {...field} className="pl-9" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="Enter your email" {...field} className="pl-9" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={contactForm.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                                <Input type="tel" placeholder="Enter phone number *" {...field} maxLength={10} className="pl-16" />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Edit className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Textarea placeholder="Enter your message" className="min-h-[100px] pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full" disabled={contactForm.formState.isSubmitting}>
                      {contactForm.formState.isSubmitting ? 'Sending...' : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              <div className="p-8 border rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.882582885942!2d77.1165038751513!3d28.75283997782654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0134a3541629%3A0x4694f425b441f17a!2sIDL%20EDUCATION!5e0!3m2!1sen!2sin!4v1700669145952!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IDL EDUCATION Location"
                ></iframe>
                <div className="mt-4">
                    <h4 className="font-semibold text-foreground">Local Head Office</h4>
                    <p className="text-muted-foreground">E-18 Krishan Vihar, Main Kanjhawala Road, Delhi-110086</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
