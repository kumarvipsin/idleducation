
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, User, GraduationCap, Phone, Mail, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "@/app/actions";
import { useLanguage } from "@/context/language-context";
import { allPrograms } from "@/lib/courses";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"], { required_error: "Please select a session mode." }),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select a class or course." }),
  country: z.string().min(1, { message: "Please select a country." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweeip", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

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

export default function BookDemoPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      classCourse: '',
      country: 'India',
      mobile: '',
      email: '',
      state: '',
      sessionMode: undefined,
    },
  });
  
  const sessionMode = form.watch("sessionMode");


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await bookFreeSession({ ...data });
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const capitalizeWords = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  return (
    <div key={studentId} className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon">
              <Home className="h-6 w-6 text-primary" />
              <span className="sr-only">Home</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
          <div className="space-y-6 mb-8 animate-fade-in-up text-center">
              <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
                  Book a Free Demo Class
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
              </h1>
              <p className="mt-2 text-base text-muted-foreground font-semibold">
                Learn from India's best teachers
              </p>
          </div>

          <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-8 space-y-6">
                      <div className="text-center">
                          <h2 className="text-2xl font-bold text-primary">Enter Your Details</h2>
                      </div>
                      <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="sessionMode"
                            render={({ field }) => (
                                <FormItem>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <Button 
                                    type="button" 
                                    variant={sessionMode === 'online' ? 'default' : 'outline'} 
                                    className="flex items-center justify-center gap-2"
                                    onClick={() => {
                                        field.onChange('online');
                                    }}
                                    >
                                    {sessionMode === 'online' && <CheckCircle className="w-5 h-5" />}
                                    {t('bookFreeSession.online')}
                                    </Button>
                                    <Button 
                                    type="button" 
                                    variant={sessionMode === 'offline' ? 'default' : 'outline'}
                                    className="flex items-center justify-center gap-2"
                                    onClick={() => {
                                        field.onChange('offline');
                                    }}
                                    >
                                    {sessionMode === 'offline' && <CheckCircle className="w-5 h-5" />}
                                    {t('bookFreeSession.offline')}
                                    </Button>
                                </div>
                                <FormMessage className="text-destructive" />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="studentName"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                        placeholder="Enter Name of your Child *"
                                        {...field}
                                        className="pl-9"
                                        onChange={(e) => {
                                            const formatted = capitalizeWords(e.target.value);
                                            field.onChange(formatted);
                                        }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-destructive" />
                                </FormItem>
                            )}
                            />
                            
                            <FormField
                            control={form.control}
                            name="classCourse"
                            render={({ field }) => (
                                <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <SelectTrigger className="pl-9">
                                            <SelectValue placeholder="Select a Class or Course *" />
                                        </SelectTrigger>
                                    </div>
                                    </FormControl>
                                    <SelectContent>
                                    {allPrograms.map(program => (
                                        <SelectItem key={program.name} value={program.name}>{program.name}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-destructive" />
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
                                        <Input 
                                        type="email" 
                                        placeholder="Email Address *"
                                        {...field}
                                        className="pl-9"
                                        onChange={(e) => {
                                            field.onChange(e.target.value.toLowerCase());
                                        }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-destructive" />
                                </FormItem>
                            )}
                            />

                            <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                             <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                                            <Input 
                                                type="tel" 
                                                placeholder="Enter your Mobile Number *"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    field.onChange(value);
                                                }}
                                                maxLength={10}
                                                className="pl-16"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-destructive" />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-9">
                                                <SelectValue placeholder="Select your country *" />
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
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <SelectTrigger className="pl-9">
                                            <SelectValue placeholder="State *" />
                                        </SelectTrigger>
                                    </div>
                                    </FormControl>
                                    <SelectContent>
                                    {indianStates.sort().map(state => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-destructive" />
                                </FormItem>
                            )}
                            />

                            <Button type="submit" className="w-full text-base h-10 font-bold" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? t('bookFreeSession.scheduling') : 'Submit'}
                            </Button>
                          </form>
                      </Form>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
