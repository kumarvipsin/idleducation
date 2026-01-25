'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Headset, Building, User, Edit, Globe, CheckCircle, Copy, Home, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm, submitSupportTicket } from "@/app/actions";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  country: z.string().optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  state: z.string().min(1, { message: "Please select a state." }),
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
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      country: 'India',
      phone: '',
      state: '',
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
    const result = await submitContactForm({ ...data });
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
        setSubmittedTicketId(result.ticketId || null);
        supportForm.reset();
        setShowSupportForm(false);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }

  const handleCopyToClipboard = () => {
    if (submittedTicketId) {
        navigator.clipboard.writeText(submittedTicketId);
        toast({
            title: "Copied to clipboard!",
            description: `Ticket ID: ${submittedTicketId}`,
        });
    }
  };
  
  const contactDetails = [
    { icon: Phone, label: "For Admission Enquiry", value: "+91 7011117585", href: "tel:+917011117585" },
    { icon: Phone, label: "Landline", value: "011 45035713", href: "tel:01145035713" },
    { icon: Headset, label: "For Enrolled Students", value: "011 45035713", href: "tel:01145035713" },
    { icon: Mail, label: "Email Address", value: "info@idleducation.in", href: "mailto:info@idleducation.in" },
  ];

  return (
    <>
    <div className="relative min-h-screen w-full bg-white dark:bg-gray-900 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon" className="rounded-full bg-background/30 backdrop-blur-sm border shadow-lg hover:bg-background/50">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
          <div className="w-full">
              <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up">
                  <div className="p-8 md:max-w-xl md:mx-auto flex flex-col gap-4">
                  <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-primary">Drop your message</h3>
                      <p className="text-muted-foreground text-sm">Fill out the form and we'll get back to you.</p>
                  </div>
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
                    <div className="flex items-start gap-2">
                        <FormField
                            control={contactForm.control}
                            name="countryCode"
                            render={({ field }) => (
                            <FormItem className="w-32">
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Code" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {countryCodes.map((country) => (
                                    <SelectItem key={`${country.country}-${country.code}`} value={`${country.code}-${country.country}`}>
                                        {country.code}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={contactForm.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="tel" placeholder="Enter phone number *" {...field} maxLength={10} className="pl-9" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={contactForm.control}
                        name="state"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Enter your state" {...field} className="pl-9" />
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
              </Card>
          </div>
        </div>
    </div>
    
    <Dialog open={!!submittedTicketId} onOpenChange={() => setSubmittedTicketId(null)}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Ticket Submitted!</DialogTitle>
          <DialogDescription className="text-center">
            Your support ticket has been successfully submitted. Please save your ticket ID for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div 
            className="flex items-center justify-between p-3 border-2 border-dashed rounded-lg bg-muted cursor-pointer hover:bg-muted/80"
            onClick={handleCopyToClipboard}
          >
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Your Ticket ID</span>
                <span className="font-mono font-semibold text-lg">{submittedTicketId}</span>
            </div>
            <Copy className="w-6 h-6 text-primary" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setSubmittedTicketId(null)} className="w-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
