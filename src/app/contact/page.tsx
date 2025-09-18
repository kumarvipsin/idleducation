
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
  countryCode: z.string(),
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


const countryCodes = [
    { code: "+93", country: "Afghanistan" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Algeria" },
    { code: "+1-684", country: "American Samoa" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+1-264", country: "Anguilla" },
    { code: "+672", country: "Antarctica" },
    { code: "+1-268", country: "Antigua and Barbuda" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+297", country: "Aruba" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+1-242", country: "Bahamas" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+1-246", country: "Barbados" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+501", country: "Belize" },
    { code: "+229", country: "Benin" },
    { code: "+1-441", country: "Bermuda" },
    { code: "+975", country: "Bhutan" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia and Herzegovina" },
    { code: "+267", country: "Botswana" },
    { code: "+55", country: "Brazil" },
    { code: "+246", country: "British Indian Ocean Territory" },
    { code: "+1-284", country: "British Virgin Islands" },
    { code: "+673", country: "Brunei" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Cambodia" },
    { code: "+237", country: "Cameroon" },
    { code: "+1", country: "Canada" },
    { code: "+238", country: "Cape Verde" },
    { code: "+1-345", country: "Cayman Islands" },
    { code: "+236", country: "Central African Republic" },
    { code: "+235", country: "Chad" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China" },
    { code: "+61", country: "Christmas Island" },
    { code: "+61", country: "Cocos Islands" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoros" },
    { code: "+682", country: "Cook Islands" },
    { code: "+506", country: "Costa Rica" },
    { code: "+385", country: "Croatia" },
    { code: "+53", country: "Cuba" },
    { code: "+599", country: "Curacao" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Republic" },
    { code: "+243", country: "Democratic Republic of the Congo" },
    { code: "+45", country: "Denmark" },
    { code: "+253", country: "Djibouti" },
    { code: "+1-767", country: "Dominica" },
    { code: "+1-809", country: "Dominican Republic" },
    { code: "+670", country: "East Timor" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egypt" },
    { code: "+503", country: "El Salvador" },
    { code: "+240", country: "Equatorial Guinea" },
    { code: "+291", country: "Eritrea" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Ethiopia" },
    { code: "+500", country: "Falkland Islands" },
    { code: "+298", country: "Faroe Islands" },
    { code: "+679", country: "Fiji" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+689", country: "French Polynesia" },
    { code: "+241", country: "Gabon" },
    { code: "+220", country: "Gambia" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+233", country: "Ghana" },
    { code: "+350", country: "Gibraltar" },
    { code: "+30", country: "Greece" },
    { code: "+299", country: "Greenland" },
    { code: "+1-473", country: "Grenada" },
    { code: "+1-671", country: "Guam" },
    { code: "+502", country: "Guatemala" },
    { code: "+44-1481", country: "Guernsey" },
    { code: "+224", country: "Guinea" },
    { code: "+245", country: "Guinea-Bissau" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haiti" },
    { code: "+504", country: "Honduras" },
    { code: "+852", country: "Hong Kong" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+98", country: "Iran" },
    { code: "+964", country: "Iraq" },
    { code: "+353", country: "Ireland" },
    { code: "+44-1624", country: "Isle of Man" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italy" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+1-876", country: "Jamaica" },
    { code: "+81", country: "Japan" },
    { code: "+44-1534", country: "Jersey" },
    { code: "+962", country: "Jordan" },
    { code: "+7", country: "Kazakhstan" },
    { code: "+254", country: "Kenya" },
    { code: "+686", country: "Kiribati" },
    { code: "+383", country: "Kosovo" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Latvia" },
    { code: "+961", country: "Lebanon" },
    { code: "+266", country: "Lesotho" },
    { code: "+231", country: "Liberia" },
    { code: "+218", country: "Libya" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+853", country: "Macau" },
    { code: "+389", country: "Macedonia" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malawi" },
    { code: "+60", country: "Malaysia" },
    { code: "+960", country: "Maldives" },
    { code: "+223", country: "Mali" },
    { code: "+356", country: "Malta" },
    { code: "+692", country: "Marshall Islands" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauritius" },
    { code: "+262", country: "Mayotte" },
    { code: "+52", country: "Mexico" },
    { code: "+691", country: "Micronesia" },
    { code: "+373", country: "Moldova" },
    { code: "+377", country: "Monaco" },
    { code: "+976", country: "Mongolia" },
    { code: "+382", country: "Montenegro" },
    { code: "+1-664", country: "Montserrat" },
    { code: "+212", country: "Morocco" },
    { code: "+258", country: "Mozambique" },
    { code: "+95", country: "Myanmar" },
    { code: "+264", country: "Namibia" },
    { code: "+674", country: "Nauru" },
    { code: "+977", country: "Nepal" },
    { code: "+31", country: "Netherlands" },
    { code: "+599", country: "Netherlands Antilles" },
    { code: "+687", country: "New Caledonia" },
    { code: "+64", country: "New Zealand" },
    { code: "+505", country: "Nicaragua" },
    { code: "+227", country: "Niger" },
    { code: "+234", country: "Nigeria" },
    { code: "+683", country: "Niue" },
    { code: "+850", country: "North Korea" },
    { code: "+1-670", country: "Northern Mariana Islands" },
    { code: "+47", country: "Norway" },
    { code: "+968", country: "Oman" },
    { code: "+92", country: "Pakistan" },
    { code: "+680", country: "Palau" },
    { code: "+970", country: "Palestine" },
    { code: "+507", country: "Panama" },
    { code: "+675", country: "Papua New Guinea" },
    { code: "+595", country: "Paraguay" },
    { code: "+51", country: "Peru" },
    { code: "+63", country: "Philippines" },
    { code: "+64", country: "Pitcairn" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+1-787", country: "Puerto Rico" },
    { code: "+1-939", country: "Puerto Rico" },
    { code: "+974", country: "Qatar" },
    { code: "+242", country: "Republic of the Congo" },
    { code: "+262", country: "Reunion" },
    { code: "+40", country: "Romania" },
    { code: "+7", country: "Russia" },
    { code: "+250", country: "Rwanda" },
    { code: "+590", country: "Saint Barthelemy" },
    { code: "+290", country: "Saint Helena" },
    { code: "+1-869", country: "Saint Kitts and Nevis" },
    { code: "+1-758", country: "Saint Lucia" },
    { code: "+590", country: "Saint Martin" },
    { code: "+508", country: "Saint Pierre and Miquelon" },
    { code: "+1-784", country: "Saint Vincent and the Grenadines" },
    { code: "+685", country: "Samoa" },
    { code: "+378", country: "San Marino" },
    { code: "+239", country: "Sao Tome and Principe" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+221", country: "Senegal" },
    { code: "+381", country: "Serbia" },
    { code: "+248", country: "Seychelles" },
    { code: "+232", country: "Sierra Leone" },
    { code: "+65", country: "Singapore" },
    { code: "+1-721", country: "Sint Maarten" },
    { code: "+421", country: "Slovakia" },
    { code: "+386", country: "Slovenia" },
    { code: "+677", country: "Solomon Islands" },
    { code: "+252", country: "Somalia" },
    { code: "+27", country: "South Africa" },
    { code: "+82", country: "South Korea" },
    { code: "+211", country: "South Sudan" },
    { code: "+34", country: "Spain" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+249", country: "Sudan" },
    { code: "+597", country: "Suriname" },
    { code: "+47", country: "Svalbard and Jan Mayen" },
    { code: "+268", country: "Swaziland" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+963", country: "Syria" },
    { code: "+886", country: "Taiwan" },
    { code: "+992", country: "Tajikistan" },
    { code: "+255", country: "Tanzania" },
    { code: "+66", country: "Thailand" },
    { code: "+228", country: "Togo" },
    { code: "+690", country: "Tokelau" },
    { code: "+676", country: "Tonga" },
    { code: "+1-868", country: "Trinidad and Tobago" },
    { code: "+216", country: "Tunisia" },
    { code: "+90", country: "Turkey" },
    { code: "+993", country: "Turkmenistan" },
    { code: "+1-649", country: "Turks and Caicos Islands" },
    { code: "+688", country: "Tuvalu" },
    { code: "+1-340", country: "U.S. Virgin Islands" },
    { code: "+256", country: "Uganda" },
    { code: "+380", country: "Ukraine" },
    { code: "+971", country: "United Arab Emirates" },
    { code: "+44", country: "United Kingdom" },
    { code: "+1", country: "United States" },
    { code: "+598", country: "Uruguay" },
    { code: "+998", country: "Uzbekistan" },
    { code: "+678", country: "Vanuatu" },
    { code: "+379", country: "Vatican" },
    { code: "+58", country: "Venezuela" },
    { code: "+84", country: "Vietnam" },
    { code: "+681", country: "Wallis and Futuna" },
    { code: "+212", country: "Western Sahara" },
    { code: "+967", country: "Yemen" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabwe" },
  ].sort((a, b) => a.country.localeCompare(b.country));

const phoneLengthByCountryCode: { [key: string]: number } = {
  "+91": 10,
  "+1": 10,
  "+44": 10,
  "+61": 9,
  "+86": 11,
};

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

  const officeLocation = {
    icon: Building,
    label: "Local Head Office",
    value: "E-18 Krishan Vihar, Main Kanjhawala Road, Delhi-110086"
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-white dark:from-background dark:via-blue-900/10 dark:to-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-lg overflow-hidden flex flex-col md:flex-row border-t-8 border-primary rounded-t-lg">
            <div className="p-8 space-y-8 md:w-2/5 bg-white dark:bg-card m-[5%] border rounded-lg">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary">Get in Touch</h2>
                <p className="text-muted-foreground">We're here to help and answer any question you might have. We look forward to hearing from you.</p>
              </div>
              
              <div className="space-y-6">
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
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="p-3 bg-primary/10 text-primary rounded-full">
                          <officeLocation.icon className="w-5 h-5" />
                      </div>
                      <div>
                          <h4 className="font-semibold text-foreground">{officeLocation.label}</h4>
                          <p className="text-muted-foreground">{officeLocation.value}</p>
                      </div>
                  </div>
              </div>

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

            <div className="p-8 md:w-3/5 border rounded-lg m-[5%]">
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
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
                            <Textarea placeholder="Enter your message" className="min-h-[150px] pl-9" {...field} />
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
  );
}
