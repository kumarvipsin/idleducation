'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BookOpen, BarChart3, Upload, Users, Download, Star, Award, UserCheck, CheckCircle, Smartphone } from "lucide-react";
import Image from "next/image";
import { SelectionsChart } from "@/components/selections-chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "./actions";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const { toast } = useToast();
  const [sessionMode, setSessionMode] = useState<'online' | 'offline'>('offline');
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionMode: 'offline',
      childName: '',
      mobile: '',
      email: '',
      state: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
        description: "Something went wrong. Please try again.",
      });
    }
  };


  const stats = [
    { value: "200,000+", label: "Downloads", icon: <Download className="h-10 w-10 text-white/80" /> },
    { value: "500+", label: "UPSC Civils Ranks", icon: <Award className="h-10 w-10 text-white/80" /> },
    { value: "1,000+", label: "APPSC & TSPSC Ranks", icon: <Star className="h-10 w-10 text-white/80" /> },
    { value: "500,000+", label: "Aspirants Impacted", icon: <UserCheck className="h-10 w-10 text-white/80" /> },
  ];

  return (
    <div className="flex flex-col">
       <section className="relative w-full py-12 md:py-24 lg:py-32 bg-purple text-purple-foreground overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-4 items-center">
               <Image 
                src="https://placehold.co/600x600.png"
                alt="Happy Student"
                data-ai-hint="happy student"
                width={500}
                height={500}
                className="rounded-xl"
              />
            </div>
            <div className="w-full max-w-md mx-auto">
              <Card className="bg-background text-foreground">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Book your Free Session</CardTitle>
                  <p className="text-muted-foreground">Learn from India's best teachers</p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="sessionMode"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="font-semibold">Select the Session Mode</Label>
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
                                Online
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
                                Offline
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
                             <Label htmlFor="child-name" className="font-semibold">Enter Your Details</Label>
                            <FormControl>
                              <Input id="child-name" placeholder="Enter Name of your Child" {...field} />
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
                            <div className="flex items-center gap-2">
                              <div className="relative flex-grow">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <FormControl>
                                  <Input id="mobile" type="tel" placeholder="Enter your Mobile Number" className="pl-10" {...field} />
                                </FormControl>
                              </div>
                              <Button type="button" variant="secondary">Send OTP</Button>
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
                              <Input id="email" type="email" placeholder="Email Address" {...field} />
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
                                  <SelectValue placeholder="State" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="state1">State 1</SelectItem>
                                <SelectItem value="state2">State 2</SelectItem>
                                <SelectItem value="state3">State 3</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Scheduling..." : "Continue to Schedule"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[150px] overflow-hidden">
          <svg className="relative block w-[calc(100%+1.3px)] h-[150px]" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" fill="hsla(var(--primary), 0.7)" />
              <use xlinkHref="#gentle-wave" x="48" y="3" fill="hsla(var(--primary), 0.5)" />
              <use xlinkHref="#gentle-wave" x="48" y="5" fill="hsla(var(--primary), 0.3)" />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="hsl(var(--primary))" />
            </g>
          </svg>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-12 lg:justify-between">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center mx-4">
                <div 
                  className="relative flex items-center justify-center w-48 h-48 rounded-full bg-primary-foreground/10"
                  style={{
                    boxShadow: 'inset 0 0 0 4px hsl(var(--primary-foreground)), inset 0 0 0 6px hsl(var(--primary))'
                  }}
                >
                  <div className="text-center">
                    <p className="text-4xl font-bold">{stat.value}</p>
                    <p className="text-lg mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Key Features</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you and your students need to succeed in one platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 xl:grid-cols-4 mt-12">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Interactive Courses</h3>
              <p className="text-sm text-foreground/80">Engaging and accessible course content for students.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Progress Tracking</h3>
              <p className="text-sm text-foreground/80">Intuitive progress trackers for students to monitor their learning journey.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Easy Material Upload</h3>
              <p className="text-sm text-foreground/80">A simple interface for teachers to upload course materials.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Class Management</h3>
              <p className="text-sm text-foreground/80">Powerful tools for teachers to manage their classes and students.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="success" className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Our Success Story</h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A visual journey of our students' achievements over the years.
            </p>
          </div>
          <SelectionsChart />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">What Our Users Say</h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from students and teachers who love using IDL EDUCATION.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-2 mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Sarah T.</CardTitle>
                    <p className="text-sm text-foreground/80">Student</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>"IDL EDUCATION has transformed the way I study. The interactive courses are so engaging, and I can easily track my progress. It's fantastic!"</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Michael J.</CardTitle>
                    <p className="text-sm text-foreground/80">Teacher</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>"Managing my classes has never been easier. Uploading materials is a breeze, and the platform provides all the tools I need to support my students."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
