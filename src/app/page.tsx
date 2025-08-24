'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, Smartphone, ChevronRight } from "lucide-react";
import Image from "next/image";
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
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

const testimonials = [
  {
    name: "Aarav Sharma",
    class: "Class 10 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "student portrait",
    testimonial: "The personalized learning paths have been a game-changer for my exam preparation. I feel much more confident in my abilities now.",
  },
  {
    name: "Priya Singh",
    class: "Class 12 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "student headshot",
    testimonial: "IDL EDUCATION's teachers are incredibly supportive. The two-teacher model ensures that my doubts are always cleared instantly.",
  },
  {
    name: "Rohan Kumar",
    class: "Class 8 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "young student",
    testimonial: "Learning has become so much more fun and interactive with the app. I love the engaging video lessons and quizzes!",
  },
  {
    name: "Anika Verma",
    class: "Parent",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "parent profile",
    testimonial: "As a parent, I'm thrilled with the progress my child has made. The platform provides detailed reports that help me track his performance.",
  },
];

const learningPrograms = [
  {
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "early learning",
    category: "LKG - Class 3",
    title: "Early Learn Program",
    description: "An Active Learning Adventure",
  },
  {
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "self study",
    category: "Class 4 - 10",
    title: "Self-Study Pack",
    description: "The Learning App",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "live classes",
    category: "Class 4 - 10",
    title: "Live Classes",
    description: "Interactive online sessions",
  },
  {
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMnx8Y2xhc3N8ZW58MHx8fHwxNzU2MDUzNTc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "foundation course",
    category: "Class 8 - 10",
    title: "Foundation Course",
    description: "For JEE / NEET",
  },
  {
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxjbGFzc3xlbnwwfHx8fDE3NTYwNTM1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "test preparation",
    category: "Class 11 - 12",
    title: "Aakash Byju's Program",
    description: "Comprehensive test prep",
  },
]

const advantageItems = [
    {
      title: "Conceptual clarity through visualisation",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "online lecture"
    },
    {
      title: "Personalised learning programs",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "knowledge graph"
    },
    {
      title: "Unmatched individual attention",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      imageHint: "student attention"
    }
  ];

const heroCarouselImages = [
    { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Students collaborating", hint: "student collaboration" },
    { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Modern classroom", hint: "modern classroom" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Teacher giving a lecture", hint: "teacher lecture" }
];

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

  return (
    <div className="flex flex-col">
       <section 
        className="relative w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8')"}}
        >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="hidden lg:flex flex-col justify-center space-y-4 items-center">
               <Carousel className="w-full max-w-lg" opts={{ loop: true }}>
                <CarouselContent>
                    {heroCarouselImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <Image 
                                src={image.src}
                                alt={image.alt}
                                data-ai-hint={image.hint}
                                width={500}
                                height={500}
                                className="rounded-xl object-cover w-full aspect-square"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
               </Carousel>
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
      </section>
      
      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive learning programs <br/> & classes for all students</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Become lifelong learners with India's best teachers, engaging video lessons and personalised learning journeys
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg relative">
            <div className="text-center mb-6">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Classes 4 - 10
              </Button>
            </div>
            <div className="grid md:grid-cols-2 items-center gap-8 relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-8 h-8 text-purple-600"/>
                    <h3 className="text-xl font-bold">The Learning App</h3>
                </div>
                <p className="text-muted-foreground mb-2">Personalised learning app to learn anytime, anywhere</p>
                <Link href="#" className="font-semibold text-primary hover:underline flex items-center">
                  Know more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <Separator orientation="vertical" className="hidden md:block absolute left-1/2 -translate-x-1/2 h-2/3 top-1/2 -translate-y-1/2" />
              
              <div className="flex flex-col items-center text-center">
                 <div className="flex items-center gap-2 mb-2">
                    <Users className="w-8 h-8 text-purple-600"/>
                    <h3 className="text-xl font-bold">IDL's Classes</h3>
                </div>
                <p className="text-muted-foreground mb-2">Personalised online tutoring program with a unique two teacher model</p>
                <Link href="#" className="font-semibold text-primary hover:underline flex items-center">
                  Know more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg relative">
            <div className="grid md:grid-cols-2 items-center gap-8 relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-8 h-8 text-purple-600"/>
                    <h3 className="text-xl font-bold">Another Program</h3>
                </div>
                <p className="text-muted-foreground mb-2">Description for another great program to attract students.</p>
                <Link href="#" className="font-semibold text-primary hover:underline flex items-center">
                  Know more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <Separator orientation="vertical" className="hidden md:block absolute left-1/2 -translate-x-1/2 h-2/3 top-1/2 -translate-y-1/2" />
              
              <div className="flex flex-col items-center text-center">
                 <div className="flex items-center gap-2 mb-2">
                    <Users className="w-8 h-8 text-purple-600"/>
                    <h3 className="text-xl font-bold">Specialized Courses</h3>
                </div>
                <p className="text-muted-foreground mb-2">Details about specialized courses with expert teachers.</p>
                <Link href="#" className="font-semibold text-primary hover:underline flex items-center">
                  Know more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-12 py-6 text-lg">
                Book a FREE class
              </Button>
            </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Get the IDL EDUCATION Advantage</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {advantageItems.map((item, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg group">
                        <Image 
                            src={item.image}
                            alt={item.title}
                            data-ai-hint={item.imageHint}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Explore our Learning Programs</h2>
            </div>
            <Carousel
                opts={{
                align: "start",
                loop: true,
                }}
                className="w-full max-w-7xl mx-auto"
            >
                <CarouselContent>
                {learningPrograms.map((program, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                        <div className="p-2">
                            <Card className="h-full flex flex-col overflow-hidden">
                                <Image 
                                    src={program.image}
                                    alt={program.title}
                                    data-ai-hint={program.imageHint}
                                    width={600}
                                    height={400}
                                    className="w-full object-cover aspect-[3/2]"
                                />
                                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-primary">{program.category}</p>
                                        <h3 className="text-lg font-bold mt-1">{program.title}</h3>
                                        <p className="text-sm text-muted-foreground">{program.description}</p>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto mt-4 self-start">Read more</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Students Say</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Hear from students who have benefited from our platform.
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <Card className="h-full flex flex-col">
                      <CardContent className="p-6 flex-1 flex flex-col justify-between">
                        <blockquote className="text-lg italic mb-4">
                          "{testimonial.testimonial}"
                        </blockquote>
                        <div className="flex items-center gap-4 mt-auto">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint}/>
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.class}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
