
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Headset, Building, User, Edit, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm, submitSupportTicket } from "@/app/actions";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

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

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  country: z.string().optional(),
  state: z.string().optional(),
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
      country: '',
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
    { icon: MapPin, label: "Local Head Office", value: "E-18 Krishan Vihar, Main Kanjhawala Road Delhi-110086", href: "#" },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white dark:from-background dark:via-blue-900/10 dark:to-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg overflow-hidden flex flex-col md:flex-row border-t-8 border-primary rounded-t-lg">
            <div className="p-8 md:w-1/2 bg-white dark:bg-card m-[2.5%] border rounded-lg flex flex-col justify-start">
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
                            <a href={item.href} className="font-semibold text-foreground hover:text-primary hover:underline">{item.value}</a>
                             <h4 className="text-xs text-muted-foreground">{item.label}</h4>
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

            <div className="md:w-1/2 m-[2.5%] flex flex-col gap-4">
              <div className="p-8 border rounded-lg flex flex-col justify-start">
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
                    <FormField
                        control={contactForm.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
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
                     <FormField
                        control={contactForm.control}
                        name="country"
                        render={({ field }) => (
                        <FormItem>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <SelectTrigger className="pl-9">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                </div>
                            </FormControl>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country} value={country}>{country}</SelectItem>
                                ))}
                            </SelectContent>
                           </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
