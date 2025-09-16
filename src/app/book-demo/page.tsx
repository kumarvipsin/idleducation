
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
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
  classCourse: z.string().min(1, { message: "Please enter your class or course." }),
  countryCode: z.string().min(1, { message: "Country code is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
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

const countryCodes = [
    { code: "+91", country: "India" },
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

export default function BookDemoPage() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      classCourse: '',
      countryCode: "+91-India",
      mobile: '',
      email: '',
      state: '',
    },
  });
  
  const selectedCountryCode = form.watch("countryCode");
  const sessionMode = form.watch("sessionMode");

  const getPhoneLength = (countryCodeValue: string) => {
    const code = countryCodeValue.split('-')[0];
    return phoneLengthByCountryCode[code] || 10; // Default to 10 if not found
  };
  
  const maxLength = getPhoneLength(selectedCountryCode);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await bookFreeSession(data);
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
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight group inline-block">
                  Book a Free Demo Class
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground font-semibold">
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
                                <FormLabel>Select Mode <span className="text-destructive">*</span></FormLabel>
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
                                    <Input 
                                    placeholder={t('bookFreeSession.childNamePlaceholder')} 
                                    {...field}
                                    onChange={(e) => {
                                        const formatted = capitalizeWords(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                    />
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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Class or Course" />
                                    </SelectTrigger>
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

                            <div>
                                <div className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name="countryCode"
                                        render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Code" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countryCodes.map((country) => (
                                                <SelectItem key={`${country.country}-${country.code}`} value={`${country.code}-${country.country}`}>
                                                    {country.code} ({country.country})
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
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
                                            <Input 
                                            type="tel" 
                                            placeholder={t('bookFreeSession.mobilePlaceholder')} 
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                field.onChange(value);
                                            }}
                                            maxLength={maxLength}
                                            />
                                            </FormControl>
                                            <FormMessage className="text-destructive" />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Input 
                                    type="email" 
                                    placeholder={t('bookFreeSession.emailPlaceholder')} 
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e.target.value.toLowerCase());
                                    }}
                                    />
                                </FormControl>
                                <FormMessage className="text-destructive" />
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
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('bookFreeSession.statePlaceholder')} />
                                    </SelectTrigger>
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

                            <Button type="submit" className="w-full text-base h-10 rounded-full font-bold" disabled={form.formState.isSubmitting}>
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
