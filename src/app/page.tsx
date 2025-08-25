
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, Smartphone, ChevronRight, Star, Sigma, FlaskConical, Landmark, Palette, Zap, Atom, Globe, Code, Award, Target, ClipboardCheck, GraduationCap, FileText, UserCheck, Briefcase } from "lucide-react";
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
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const testimonials = [
  {
    name: "Aarav Sharma",
    class: "Class 10 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian student",
    testimonial: "The personalized learning paths have been a game-changer for my exam preparation. I feel much more confident in my abilities now.",
    testimonial_hi: "व्यक्तिगत सीखने के रास्ते मेरी परीक्षा की तैयारी के लिए गेम-चेंजर रहे हैं। अब मुझे अपनी क्षमताओं पर बहुत अधिक विश्वास है।",
  },
  {
    name: "Priya Singh",
    class: "Class 12 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "female student",
    testimonial: "IDL EDUCATION's teachers are incredibly supportive. The two-teacher model ensures that my doubts are always cleared instantly.",
    testimonial_hi: "आईडीएल एजुकेशन के शिक्षक अविश्वसनीय रूप से सहायक हैं। दो-शिक्षक मॉडल यह सुनिश्चित करता है कि मेरी शंकाओं का तुरंत समाधान हो जाए।",
  },
  {
    name: "Rohan Kumar",
    class: "Class 8 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "young student",
    testimonial: "Learning has become so much more fun and interactive with the app. I love the engaging video lessons and quizzes!",
    testimonial_hi: "ऐप के साथ सीखना बहुत अधिक मजेदार और इंटरैक्टिव हो गया है। मुझे आकर्षक वीडियो पाठ और क्विज़ पसंद हैं!",
  },
  {
    name: "Anika Verma",
    class: "Parent",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian parent",
    testimonial: "As a parent, I'm thrilled with the progress my child has made. The platform provides detailed reports that help me track his performance.",
    testimonial_hi: "एक अभिभावक के रूप में, मैं अपने बच्चे की प्रगति से बहुत खुश हूँ। प्लेटफ़ॉर्म विस्तृत रिपोर्ट प्रदान करता है जो मुझे उसके प्रदर्शन को ट्रैक करने में मदद करता है।",
  },
  {
    name: "Meera Iyer",
    class: "Parent",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian mother",
    testimonial: "The platform is fantastic. My daughter's confidence in math has soared since she started using IDL EDUCATION. The teachers are patient and knowledgeable.",
    testimonial_hi: "यह प्लेटफॉर्म शानदार है। जब से मेरी बेटी ने आईडीएल एजुकेशन का उपयोग करना शुरू किया है, तब से उसका गणित में आत्मविश्वास बढ़ गया है। शिक्षक धैर्यवान और जानकार हैं।",
  },
  {
    name: "Karan Malhotra",
    class: "Class 11 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "male student",
    testimonial: "Preparing for competitive exams felt overwhelming, but the structured courses and regular mock tests here have made a huge difference.",
    testimonial_hi: "प्रतियोगी परीक्षाओं की तैयारी भारी लग रही थी, लेकिन यहां के संरचित पाठ्यक्रमों और नियमित मॉक टेस्ट ने बहुत बड़ा अंतर पैदा किया है।",
  },
  {
    name: "Sunita Devi",
    class: "Parent",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian woman",
    testimonial: "The flexibility to learn anytime, anywhere has been perfect for my son's busy schedule. He can now revise lessons on the go.",
    testimonial_hi: "कभी भी, कहीं भी सीखने की सुविधा मेरे बेटे के व्यस्त कार्यक्रम के लिए एकदम सही रही है। वह अब चलते-फिरते पाठों को दोहरा सकता है।",
  },
  {
    name: "Vikram Reddy",
    class: "Class 9 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian boy",
    testimonial: "I used to struggle with Chemistry, but the visual experiments and simple explanations on the app have made it one of my favorite subjects.",
    testimonial_hi: "मैं पहले रसायन विज्ञान में संघर्ष करता था, लेकिन ऐप पर मौजूद दृश्य प्रयोगों और सरल व्याख्याओं ने इसे मेरे पसंदीदा विषयों में से एक बना दिया है।",
  },
  {
    name: "Nisha Gupta",
    class: "Class 7 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "young girl",
    testimonial: "The two-teacher model is the best! I get my questions answered without interrupting the class. It helps me understand concepts better.",
    testimonial_hi: "दो-शिक्षक मॉडल सबसे अच्छा है! मुझे कक्षा को बाधित किए बिना मेरे सवालों के जवाब मिल जाते हैं। यह मुझे अवधारणाओं को बेहतर ढंग से समझने में मदद करता है।",
  },
  {
    name: "Amit Patel",
    class: "Parent",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian father",
    testimonial: "Booking the free session was easy and it gave us a clear idea of the quality of teaching. We enrolled our son immediately after.",
    testimonial_hi: "मुफ्त सत्र बुक करना आसान था और इससे हमें शिक्षण की गुणवत्ता का स्पष्ट पता चल गया। हमने इसके तुरंत बाद अपने बेटे का नामांकन करा दिया।",
  },
  {
    name: "Sneha Reddy",
    class: "Class 10 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "teenage girl",
    testimonial: "The comprehensive study materials and notes are a lifesaver. I don't have to look for resources anywhere else.",
    testimonial_hi: "व्यापक अध्ययन सामग्री और नोट्स जीवन रक्षक हैं। मुझे कहीं और संसाधनों की तलाश करने की आवश्यकता नहीं है।",
  },
  {
    name: "Rajesh Kumar",
    class: "Parent",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "Indian parent",
    testimonial: "I appreciate the regular updates and performance reports. It keeps me involved in my child's academic journey.",
    testimonial_hi: "मैं नियमित अपडेट और प्रदर्शन रिपोर्ट की सराहना करता हूँ। यह मुझे मेरे बच्चे की शैक्षणिक यात्रा में शामिल रखता है।",
  },
  {
    name: "Ishaan Khan",
    class: "Class 8 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "young student",
    testimonial: "The quizzes and leaderboards make learning competitive and fun. I always try to get to the top of the leaderboard!",
    testimonial_hi: "क्विज़ और लीडरबोर्ड सीखने को प्रतिस्पर्धी और मजेदार बनाते हैं। मैं हमेशा लीडरबोर्ड के शीर्ष पर पहुंचने की कोशिश करता हूँ!",
  },
  {
    name: "Anjali Mehta",
    class: "Class 12 Student",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "female student",
    testimonial: "The teachers are not just educators but also mentors. They have guided me in making important career decisions.",
    testimonial_hi: "शिक्षक केवल शिक्षक ही नहीं, बल्कि संरक्षक भी हैं। उन्होंने मुझे महत्वपूर्ण करियर निर्णय लेने में मार्गदर्शन किया है।",
  },
];

const popularProgramsEn = [
  "News & Editorials", "Drishti Media", "Optional Subjects", "Classroom Prog.", "Mains Test Series", "Daily MCQs"
];
const popularProgramsHi = [
  "दृष्टि मीडिया", "कक्षा कार्यक्रम", "प्रिलिम्स टेस्ट सीरीज़", "मेन्स प्रैक्टिस प्रश्न", "करेंट अफेयर्स", "प्रैक्टिस टेस्ट"
];

export default function Home() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
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
        description: result.message || "Something went wrong. Please try again.",
      });
    }
  };
  
  const courses = [
    { icon: <Sigma className="w-10 h-10 text-primary" />, title: t('courses.math.title'), description: t('courses.math.description') },
    { icon: <FlaskConical className="w-10 h-10 text-primary" />, title: t('courses.science.title'), description: t('courses.science.description') },
    { icon: <Landmark className="w-10 h-10 text-primary" />, title: t('courses.history.title'), description: t('courses.history.description') },
    { icon: <Palette className="w-10 h-10 text-primary" />, title: t('courses.arts.title'), description: t('courses.arts.description') },
    { icon: <Zap className="w-10 h-10 text-primary" />, title: t('courses.english.title'), description: t('courses.english.description') },
    { icon: <Atom className="w-10 h-10 text-primary" />, title: t('courses.social.title'), description: t('courses.social.description') },
    { icon: <Code className="w-10 h-10 text-primary" />, title: t('courses.computer.title'), description: t('courses.computer.description') },
    { icon: <Globe className="w-10 h-10 text-primary" />, title: t('courses.music.title'), description: t('courses.music.description') },
  ];

  const prepClasses = ['class6', 'class7', 'class8', 'class9', 'class10', 'class11', 'class12', 'demoNotes'];

  const whyChooseUsItems = [
    {
      icon: <GraduationCap className="w-10 h-10 text-primary" />,
      title: t('whyChooseUs.expertFaculty.title'),
      description: t('whyChooseUs.expertFaculty.description')
    },
    {
      icon: <FileText className="w-10 h-10 text-primary" />,
      title: t('whyChooseUs.comprehensiveCurriculum.title'),
      description: t('whyChooseUs.comprehensiveCurriculum.description')
    },
    {
      icon: <UserCheck className="w-10 h-10 text-primary" />,
      title: t('whyChooseUs.personalizedLearning.title'),
      description: t('whyChooseUs.personalizedLearning.description')
    },
    {
      icon: <Award className="w-10 h-10 text-primary" />,
      title: t('whyChooseUs.provenResults.title'),
      description: t('whyChooseUs.provenResults.description')
    },
    {
      icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
      title: t('whyChooseUs.regularAssessments.title'),
      description: t('whyChooseUs.regularAssessments.description')
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: t('whyChooseUs.twoTeacherModel.title'),
      description: t('whyChooseUs.twoTeacherModel.description')
    }
  ];

  const teamMembers = [
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "female teacher"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "male teacher"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "https://images.unsplash.com/flagged/photo-1559475555-b26777ed3ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8dGVhY2hlcnMlMjB8ZW58MHx8fHwxNzU2MDk5NTU2fDA&ixlib-rb-4.1.0&q=80&w=1080",
        avatarHint: "female scientist"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "male professional"
    },
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "young professional"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "team working"
    }
  ];

  return (
    <div className="flex flex-col">
       <section className="relative w-full bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8')"}}>
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
                            <Label className="font-semibold">{t('bookFreeSession.sessionMode')}</Label>
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

      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Popular Academic Programs</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Explore our popular programs available in English and Hindi.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <Image src="https://placehold.co/150x60.png" alt="English Program Logo" width={150} height={60} className="rounded-md" data-ai-hint="logo design" />
                </div>
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {Array.from({ length: Math.ceil(popularProgramsEn.length / 4) }).map((_, slideIndex) => (
                      <CarouselItem key={slideIndex}>
                        <div className="grid grid-cols-2 gap-4">
                          {popularProgramsEn.slice(slideIndex * 4, slideIndex * 4 + 4).map((program) => (
                            <Button key={program} variant="outline" className="h-12 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90">
                              {program}
                            </Button>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
                </Carousel>
                <div className="mt-8 flex justify-center">
                  <Button size="lg" className="bg-accent text-accent-foreground font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:bg-accent/90">
                    VISIT ENGLISH WEBSITE
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <Image src="https://placehold.co/150x60.png" alt="Hindi Program Logo" width={150} height={60} className="rounded-md" data-ai-hint="vision logo" />
                </div>
                 <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {Array.from({ length: Math.ceil(popularProgramsHi.length / 4) }).map((_, slideIndex) => (
                      <CarouselItem key={slideIndex}>
                        <div className="grid grid-cols-2 gap-4">
                          {popularProgramsHi.slice(slideIndex * 4, slideIndex * 4 + 4).map((program) => (
                            <Button key={program} variant="outline" className="h-12 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90">
                              {program}
                            </Button>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
                </Carousel>
                <div className="mt-8 flex justify-center">
                  <Button size="lg" className="bg-accent text-accent-foreground font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:bg-accent/90">
                    हिंदी वेबसाइट पर जाएँ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('courses.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {t('courses.subtitle')}
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
              {courses.map((course, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                        <Card className="text-center hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                            <CardHeader className="flex-grow">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                {course.icon}
                                </div>
                            </div>
                            <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <p className="text-muted-foreground">{course.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('schoolPrep.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Select your class to get started with tailored resources and materials.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {prepClasses.map((prepClass) => (
              <div key={prepClass} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Card className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl h-40 flex flex-col justify-center items-center text-center">
                  <div className="absolute top-0 left-0 w-full h-full bg-card/50 backdrop-blur-sm"></div>
                  <CardContent className="relative z-10 flex flex-col items-center justify-center p-6 space-y-2">
                    <h3 className="text-4xl font-bold text-primary tracking-tighter">
                      {t(`schoolPrep.${prepClass}`).split(' ')[1] || t(`schoolPrep.${prepClass}`)}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {t(`schoolPrep.${prepClass}`).split(' ')[0]}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('whyChooseUs.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsItems.map((item, index) => (
               <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    {item.icon}
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {t('team.subtitle')}
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
              {teamMembers.map((member, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4 h-full">
                    <Card className="h-full flex flex-col text-center bg-background shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                      <div className="overflow-hidden">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          data-ai-hint={member.avatarHint}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col justify-center">
                          <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                          <p className="text-base text-muted-foreground">{member.designation}</p>
                          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-foreground/80">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <span>{member.experience}</span>
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
      
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">{t('testimonials.title')}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
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
                  <div className="p-4 h-full">
                    <Card className="h-full flex flex-col bg-muted shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex-1 flex flex-col justify-between text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar className="w-24 h-24 border-4 border-primary/20">
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint}/>
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="mb-4">
                            <p className="font-bold text-lg">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.class}</p>
                            <div className="flex justify-center mt-2">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                            </div>
                        </div>
                        <blockquote className="text-base italic text-foreground/80 before:content-['“'] after:content-['”']">
                          {language === 'hi' ? testimonial.testimonial_hi : testimonial.testimonial}
                        </blockquote>
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
