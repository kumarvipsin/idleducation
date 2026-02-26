'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ArrowRight, 
    BookOpen, 
    Sparkles, 
    Book, 
    PlayCircle,
    IndianRupee,
    ShoppingCart,
    Info,
    CheckCircle2,
    X,
    FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getUserPurchasedCourses, recordCoursePurchase, createRazorpayOrder } from "@/app/actions";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Script from "next/script";

// Custom Adobe-style PDF Icon matching the user's provided image
const AdobePdfIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 12.5C11.5 12.5 10.5 11.5 9.5 13.5C8.5 15.5 10.5 17.5 11.5 16.5C12.5 15.5 13.5 12.5 15.5 12.5C17.5 12.5 17.5 14.5 15.5 15.5C13.5 16.5 11.5 12.5 11.5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Mock CUET Courses matching TPaidCourse structure
const cuetCourses = [
    {
        id: "cuet-ug-2026-science",
        title: "CUET UG 2026 - Complete Science Batch",
        class: "Class 12 / Droppers",
        board: "CBSE/State Boards",
        subject: "PCM + Language + GT",
        medium: "Hinglish",
        batchName: "Victory 2.0",
        validity: "Until CUET 2026 Exam",
        price: 2999,
        originalPrice: 12000,
        description: "Comprehensive preparation for Science stream students. Includes Domain subjects (Phy, Chem, Math), English/Hindi language, and the General Test. Live classes, doubt sessions, and premium notes included.",
        coverImageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-science-3.png",
        status: 'active' as const,
        chapters: [
            {
                name: "Orientation & Strategy",
                videos: [{ title: "How to Crack CUET 2026", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 0 }]
            }
        ]
    },
    {
        id: "cuet-ug-2026-commerce",
        title: "CUET UG 2026 - Commerce Foundation",
        class: "Class 12",
        board: "CBSE/ICSE",
        subject: "Accounts + Eco + BST",
        medium: "English",
        batchName: "Achievers 2026",
        validity: "1 Year",
        price: 2499,
        originalPrice: 10000,
        description: "Targeted batch for Commerce aspirants. Expert faculty coverage of Accountancy, Economics, and Business Studies along with Section I and III requirements.",
        coverImageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-3.png",
        status: 'active' as const,
        chapters: [
            {
                name: "Introduction to Accounts",
                videos: [{ title: "Basics of Partnership", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 0 }]
            }
        ]
    },
    {
        id: "cuet-ug-2026-arts",
        title: "CUET UG 2026 - Humanities Specialized",
        class: "Class 12",
        board: "All Boards",
        subject: "Hist + Pol Sci + Geo",
        medium: "Hindi",
        batchName: "Samrath Batch",
        validity: "Until Exam",
        price: 1999,
        originalPrice: 8000,
        description: "Dedicated humanities batch covering History, Political Science, and Geography. Special focus on Section III General Test logic and quantitative aptitude.",
        coverImageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-ug-gat.png",
        status: 'active' as const,
        chapters: [
            {
                name: "Political Science Unit 1",
                videos: [{ title: "Era of One Party Dominance", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 0 }]
            }
        ]
    }
];

const VideoItem = ({
    video,
    chapterName,
    isActive,
    onSelect
}: {
    video: any,
    chapterName: string,
    isActive: boolean,
    onSelect: () => void
}) => {
    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full text-left flex items-center gap-3 py-3 px-4 transition-all duration-200 group border-b border-black/[0.03]",
                isActive
                    ? "bg-slate-50 border-l-[3px] border-l-primary"
                    : "hover:bg-slate-100"
            )}
        >
            <div className="relative h-12 w-20 rounded-md overflow-hidden shrink-0 bg-zinc-200 shadow-sm border border-border/50">
                <Image
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <PlayCircle className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>
            <div className="flex-grow min-w-0">
                <p className={cn(
                    "text-[13px] font-black leading-tight line-clamp-2 transition-colors",
                    isActive ? "text-primary" : "text-slate-700"
                )}>{chapterName}</p>
                {isActive && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] text-primary font-black uppercase tracking-widest">Now Playing</span>
                    </div>
                )}
            </div>
        </button>
    );
};

const CoursePlayerDialog = ({ course }: { course: any }) => {
    const [activeVideo, setActiveVideo] = useState<any | null>(
        course.chapters?.[0]?.videos?.[0] || null
    );

    const activeVideoId = activeVideo?.youtubeLink.split('v=')[1]?.split('&')[0];

    return (
        <DialogContent className="p-0 flex flex-col lg:flex-row max-w-full lg:max-w-5xl w-full h-full lg:h-fit overflow-hidden rounded-none lg:rounded-2xl border-none lg:border border-border bg-white shadow-2xl transition-all duration-500">
            <DialogHeader className="sr-only">
                <DialogTitle>{course.title}</DialogTitle>
                <DialogDescription>Premium course curriculum</DialogDescription>
            </DialogHeader>

            <div className="flex-none lg:flex-grow bg-white flex flex-col relative h-auto">
                <div className="aspect-video w-full relative flex items-center justify-center bg-white">
                    {activeVideoId ? (
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                            title={activeVideo?.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4">
                            <PlayCircle className="w-16 h-16 opacity-20" />
                            <p className="text-sm font-medium">Select a lesson to begin premium learning</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 lg:w-[320px] flex flex-col bg-white lg:border-l border-border lg:shrink-0 overflow-hidden min-h-0">
                <ScrollArea className="flex-1">
                    <div className="pb-0">
                        {course.chapters && course.chapters.length > 0 ? (
                            course.chapters.map((chapter: any, cIdx: number) => (
                                <div key={`chapter-${cIdx}`} className="mt-0">
                                    <div className="flex flex-col">
                                        {chapter.videos.map((video: any, vIdx: number) => (
                                            <VideoItem
                                                key={`video-${cIdx}-${vIdx}`}
                                                video={video}
                                                chapterName={chapter.name}
                                                isActive={activeVideo?.youtubeLink === video.youtubeLink}
                                                onSelect={() => {
                                                    setActiveVideo(video);
                                                    if (window.innerWidth < 1024) {
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
                                <BookOpen className="w-10 h-10 opacity-20 mb-2" />
                                <p className="text-xs font-extrabold">No content available</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                <div className="lg:hidden p-4 border-t bg-slate-50 mt-auto">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full font-black text-[10px] tracking-widest uppercase h-11 rounded-xl shadow-sm border-slate-200">
                            CLOSE PLAYER
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </DialogContent>
    );
};

export default function CuetPage() {
    const [activeTab, setActiveTab] = useState('ug');
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
    const [isProcessing, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            getUserPurchasedCourses(user.uid).then(res => {
                if (res.success && res.data) {
                    setPurchasedCourseIds(res.data);
                }
            });
        }
    }, [user]);

    const handlePurchase = async (course: any) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please log in to purchase this course.",
            });
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        const result = await createRazorpayOrder({ amount: course.price * 100, currency: 'INR' });
        
        if (!result.success || !result.order) {
            toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not initiate payment.' });
            setIsSubmitting(false);
            return;
        }

        const order = result.order;
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'IDL Education',
            description: `Enroll in ${course.title}`,
            order_id: order.id,
            handler: async function (response: any) {
                const enrollResult = await recordCoursePurchase(user.uid, course.id, response.razorpay_payment_id);
                if (enrollResult.success) {
                    toast({ title: 'Payment Successful', description: enrollResult.message });
                    setPurchasedCourseIds(prev => [...prev, course.id]);
                } else {
                    toast({ variant: 'destructive', title: 'Enrollment Error', description: enrollResult.message });
                }
                setIsSubmitting(false);
            },
            prefill: {
                name: user.name,
                email: user.email,
            },
            theme: {
                color: '#0d47a1',
            },
            modal: {
                ondismiss: function() {
                    setIsSubmitting(false);
                }
            }
        };
        
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
    };
    
    const resourceCards = [
        {
          title: "CUET Syllabus 2026",
          subtitle: "Latest exam pattern and section-wise syllabus guide",
          icon: <AdobePdfIcon />,
          bgColor: "bg-white dark:bg-slate-900/50",
          textColor: "text-slate-900",
          iconBg: "bg-red-50 text-red-600",
          href: "/resources/ncert-solutions"
        },
        {
          title: "Revision Notes",
          subtitle: "Expert study material",
          icon: <BookOpen />,
          bgColor: "bg-white dark:bg-slate-900/50",
          textColor: "text-slate-900",
          iconBg: "bg-blue-50 text-blue-600",
          href: "/resources/notes"
        },
         {
          title: "Mock Tests",
          subtitle: "Practice & PYQs",
          icon: <Book />,
          bgColor: "bg-white dark:bg-slate-900/50",
          textColor: "text-slate-900",
          iconBg: "bg-indigo-50 text-indigo-600",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative">
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl relative z-10">
                {/* Banner */}
                <section className="mb-6 animate-fade-in-up">
                    <div className="relative rounded-xl overflow-hidden border bg-white shadow-sm">
                        <div className="relative w-full aspect-[21/7] md:aspect-[21/5]">
                            <Image
                                src="/result.jpg"
                                alt="CUET Results"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </section>

                {/* Compact Heading Area */}
                <section className="mb-10 text-center md:text-left animate-fade-in-up">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Target CUET (UG) 2026
                            </h1>
                            <p className="max-w-3xl text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                For students of class XII to secure admission in the top Central Universities of the country, the ability to grasp concepts and attempt multiple choice questions accurately is essential in this exam. With the team of best faculties, latest study materials, daily practice worksheets and regular class tests; CUET (UG) with IDL a stepping stone not just for academic success but also a bright future.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border shadow-sm">
                            <Button 
                                onClick={() => setActiveTab('ug')} 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-full px-5 text-xs font-bold transition-all h-7",
                                    activeTab === 'ug' ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:bg-primary/5"
                                )}
                            >
                                CUET UG
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('pg')} 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-full px-5 text-xs font-bold transition-all h-7",
                                    activeTab === 'pg' ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:bg-primary/5"
                                )}
                            >
                                CUET PG
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Compact Resource Hub */}
                <section className="mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {resourceCards.map((card, index) => (
                            <Link key={index} href={card.href} className="group">
                                <div className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 shadow-sm border bg-white dark:bg-slate-900/50 hover:shadow-md hover:border-primary/20",
                                )}>
                                    <div className={cn("p-2 rounded-lg shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm", card.iconBg)}>
                                        {React.cloneElement(card.icon as React.ReactElement, { className: "w-4 h-4" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold leading-none mb-1 text-foreground">{card.title}</h4>
                                        <p className="text-[10px] font-medium text-muted-foreground truncate">{card.subtitle}</p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 transition-all group-hover:translate-x-1 opacity-20 group-hover:opacity-100" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Courses Section */}
                <section className="mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-l-4 border-primary pl-3">
                            <div>
                                <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white tracking-tight">
                                    CUET Courses-2026
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Premium Batches</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cuetCourses.map((course) => {
                                const isPurchased = purchasedCourseIds.includes(course.id);
                                return (
                                    <div key={course.id} className="flex-shrink-0 w-full h-full">
                                        <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col bg-card border group/card relative h-full">
                                            <div className="relative overflow-hidden aspect-[16/9]">
                                                {course.coverImageUrl.startsWith('https') ? (
                                                    <Image
                                                        src={course.coverImageUrl}
                                                        alt={course.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    />
                                                ) : (
                                                    <GcsImage
                                                        filePath={course.coverImageUrl}
                                                        alt={course.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <Badge className="absolute top-3 right-3 bg-primary/90 text-white font-extrabold text-[9px] tracking-widest rounded-lg px-3 py-1 uppercase shadow-lg">PREMIUM</Badge>
                                            </div>
                                            
                                            <CardContent className="p-4 flex flex-col flex-grow">
                                                <CardTitleUI className="text-sm md:text-base font-extrabold text-foreground leading-tight mb-2 line-clamp-2 group-hover/card:text-primary transition-colors">{course.title}</CardTitleUI>
                                                
                                                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                                    <Badge variant="secondary" className="rounded-md bg-primary/5 text-primary border-none font-extrabold uppercase text-[8px] tracking-widest h-6 px-3 py-0 flex items-center justify-center">{course.batchName}</Badge>
                                                    <Badge variant="outline" className="rounded-md border-muted-foreground/20 text-muted-foreground text-[8px] tracking-widest font-extrabold uppercase h-6 px-3 py-0 flex items-center justify-center">{course.medium}</Badge>
                                                </div>

                                                <div className="text-[11px] text-muted-foreground mt-1 space-y-1 font-extrabold capitalize tracking-tight">
                                                    <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Validity: <span className="text-foreground">{course.validity}</span></p>
                                                    <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Subject: <span className="text-foreground">{course.subject}</span></p>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-baseline gap-1.5">
                                                            <p className="text-lg font-extrabold text-primary">₹{course.price}</p>
                                                            {course.originalPrice > 0 && <p className="text-[10px] text-muted-foreground line-through opacity-50 font-extrabold">₹{course.originalPrice}</p>}
                                                        </div>
                                                        {course.originalPrice > course.price && (
                                                            <div className="bg-green-500/10 text-green-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded mt-1 border border-green-500/20 uppercase tracking-tighter w-fit">
                                                                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary hover:text-white transition-all h-7 w-7">
                                                                <Info className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-72 p-4 rounded-xl bg-background/95 backdrop-blur-xl border-white/20 shadow-2xl" align="end">
                                                            <h4 className="font-extrabold text-[9px] mb-2 text-primary uppercase tracking-widest">About this course</h4>
                                                            <ScrollArea className="max-h-40">
                                                                <p className="text-[10px] text-foreground font-extrabold leading-relaxed whitespace-pre-wrap opacity-80">
                                                                    {course.description}
                                                                </p>
                                                            </ScrollArea>
                                                            <div className="mt-4 pt-3 border-t border-white/10">
                                                                <div className="flex items-center gap-2 text-[9px] font-extrabold text-green-600">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    <span>Full Syllabus Access</span>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </CardContent>

                                            <div className="p-4 pt-0 mt-auto">
                                                {isPurchased ? (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn text-[10px] tracking-tight">
                                                                <PlayCircle className="w-3.5 h-3.5 mr-2 transition-transform group-hover:btn:scale-110" />
                                                                VIEW LESSONS
                                                            </Button>
                                                        </DialogTrigger>
                                                        <CoursePlayerDialog course={course} />
                                                    </Dialog>
                                                ) : (
                                                    <Button 
                                                        onClick={() => handlePurchase(course)}
                                                        disabled={isProcessing}
                                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn text-[10px] tracking-tight"
                                                    >
                                                        <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                                                        {isProcessing ? 'PROCESSING...' : 'BUY NOW'}
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
