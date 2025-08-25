
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "@/app/actions";
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please enter your class or course." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function HeroSection() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [sessionMode, setSessionMode] = useState<'online' | 'offline'>('offline');
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionMode: 'offline',
      childName: '',
      classCourse: '',
      mobile: '',
      email: '',
      state: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await bookFreeSession(data as any);
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

  return (
    <section className="relative w-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8')"}}>
      <div className="absolute inset-0 bg-primary/80 z-0"></div>
      <div className="container px-4 md:px-6 relative z-10 py-12 md:py-24 lg:py-32">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Card className="bg-background text-foreground">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{t('bookFreeSession.title')}</CardTitle>
                <p className="text-muted-foreground">{t('bookFreeSession.subtitle')}</p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="sessionMode"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-semibold text-center block w-full bg-primary/10 p-2 rounded-md">{t('bookFreeSession.sessionMode')}</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button 
                              type="button" 
                              variant={sessionMode === 'online' ? 'default' : 'outline'} 
                              className={`flex items-center justify-center gap-2 ${sessionMode === 'online' ? 'bg-purple text-purple-foreground ring-2 ring-purple-foreground' : ''}`}
                              onClick={() => {
                                setSessionMode('online');
                                field.onChange('online');
                              }}
                            >
                              {sessionMode === 'online' && <CheckCircle className="w-5 h-5" />}
                              {t('bookFreeSession.online')}
                            </Button>
                            <Button 
                              type="button" 
                              variant={sessionMode === 'offline' ? 'default' : 'outline'} 
                              className={`flex items-center justify-center gap-2 ${sessionMode === 'offline' ? 'bg-purple text-purple-foreground ring-2 ring-purple-foreground' : ''}`}
                              onClick={() => {
                                setSessionMode('offline');
                                field.onChange('offline');
                              }}
                            >
                              {sessionMode === 'offline' && <CheckCircle className="w-5 h-5" />}
                              {t('bookFreeSession.offline')}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="childName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                           <Label htmlFor="child-name" className="font-semibold">{t('bookFreeSession.yourDetails')}</Label>
                          <FormControl>
                            <Input id="child-name" placeholder={t('bookFreeSession.childNamePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classCourse"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                           <Label htmlFor="class-course" className="font-semibold sr-only">Enter Your Class/Course</Label>
                          <FormControl>
                            <Input id="class-course" placeholder="Enter Your Class/Course" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="relative flex-grow w-full">
                              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input id="mobile" type="tel" placeholder={t('bookFreeSession.mobilePlaceholder')} className="pl-10" {...field} />
                              </FormControl>
                            </div>
                            <Button type="button" variant="secondary" className="w-full sm:w-auto">{t('bookFreeSession.sendOTP')}</Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input id="email" type="email" placeholder={t('bookFreeSession.emailPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? t('bookFreeSession.scheduling') : t('bookFreeSession.continueToSchedule')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[120px] bg-transparent">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <g className="parallax fill-background">
            <use href="#wave-path" x="48" y="0" className="opacity-70" />
            <use href="#wave-path" x="48" y="3" className="opacity-50" />
            <use href="#wave-path" x="48" y="5" className="opacity-30" />
            <use href="#wave-path" x="48" y="7" />
          </g>
           <defs>
              <path id="wave-path" d="M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,229.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </defs>
        </svg>
      </div>
    </section>
  );
}
