'use client';

import { Card, CardContent, CardTitle as CardTitleUI } from "@/components/ui/card";
import Image from "next/image";
import { PlayCircle, BookOpen, Info, CheckCircle2, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TPaidCourse, TFreeCourseVideo } from "@/app/actions/types";
import { GcsImage } from "@/components/gcs-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useAuth } from "@/context/auth-context";
import { getUserPurchasedCourses, recordCoursePurchase, createRazorpayOrder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Script from "next/script";

const VideoItem = ({
    video,
    isActive,
    onSelect
}: {
    video: TFreeCourseVideo,
    isActive: boolean,
    onSelect: () => void
}) => {
    const videoId = video.youtubeLink.split('v=')[1]?.split('&')[0];
    if (!videoId) return null;

    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full text-left flex items-center gap-3 py-2 px-4 transition-all duration-200 group border-b border-black/[0.03]",
                isActive
                    ? "bg-primary/[0.04] border-l-[2px] border-l-primary"
                    : "hover:bg-black/[0.02]"
            )}
        >
            <div className="relative h-10 w-16 rounded-md overflow-hidden shrink-0 bg-zinc-200 shadow-sm">
                <Image
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <PlayCircle className={cn("w-4 h-4 transition-transform", isActive ? "text-primary scale-110" : "text-white/60 group-hover:scale-110")} />
                </div>
            </div>
            <div className="flex-grow min-w-0">
                <p className={cn(
                    "text-xs font-bold leading-tight line-clamp-2 transition-colors",
                    isActive ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                )}>{video.title}</p>
                {isActive && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="flex h-1 w-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] text-primary font-extrabold uppercase tracking-tight">Now Playing</span>
                    </div>
                )}
            </div>
        </button>
    );
};

const CoursePlayerDialog = ({ course }: { course: TPaidCourse }) => {
    const [activeVideo, setActiveVideo] = useState<TFreeCourseVideo | null>(
        course.chapters?.[0]?.videos?.[0] || null
    );

    const activeVideoId = activeVideo?.youtubeLink.split('v=')[1]?.split('&')[0];
    const activeChapterIndex = course.chapters.findIndex(chap => 
        chap.videos.some(v => v.youtubeLink === activeVideo?.youtubeLink)
    );
    const activeChapterNumber = activeChapterIndex !== -1 ? activeChapterIndex + 1 : null;

    return (
        <DialogContent className="p-0 flex flex-col lg:flex-row max-w-full lg:max-w-[95vw] xl:max-w-[1400px] h-[100dvh] lg:h-[85vh] overflow-hidden rounded-none lg:rounded-2xl border-none lg:border border-border bg-white shadow-2xl transition-all duration-500">
            <DialogHeader className="sr-only">
                <DialogTitle>{course.title}</DialogTitle>
                <DialogDescription>Premium course curriculum</DialogDescription>
            </DialogHeader>

            <div className="flex-none lg:flex-grow bg-zinc-100 flex flex-col relative h-auto lg:h-full">
                <div className="aspect-video w-full relative flex items-center justify-center bg-black">
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

                <div className="p-4 md:p-6 bg-white border-b lg:border-b-0 border-border">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            {activeChapterNumber && (
                                <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
                                    Module {activeChapterNumber}
                                </span>
                            )}
                            <span className="text-zinc-300">•</span>
                            <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-tight">{course.title}</span>
                        </div>
                        <h2 className="text-lg md:text-2xl font-extrabold text-foreground leading-tight tracking-tight mt-1">
                            {activeVideo?.title || "Select a Topic"}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="flex-1 lg:w-[320px] flex flex-col bg-zinc-50 lg:border-l border-border lg:shrink-0 overflow-hidden min-h-0">
                <ScrollArea className="flex-1">
                    <div className="pb-2">
                        {course.chapters && course.chapters.length > 0 ? (
                            course.chapters.map((chapter, cIdx) => (
                                <div key={`chapter-${cIdx}`} className="mt-0.5 first:mt-0">
                                    <div className="px-4 py-2 flex items-center gap-2 bg-black/[0.02] border-b border-black/[0.03]">
                                        <h4 className="font-bold text-[10px] tracking-widest text-muted-foreground/60 uppercase truncate">
                                            {chapter.name}
                                        </h4>
                                    </div>
                                    <div className="flex flex-col">
                                        {chapter.videos.map((video, vIdx) => (
                                            <VideoItem
                                                key={`video-${cIdx}-${vIdx}`}
                                                video={video}
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
                                <p className="text-xs font-bold">No content available</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                <div className="p-4 bg-white border-t border-border lg:hidden">
                    <DialogClose asChild>
                        <Button className="w-full bg-zinc-900 text-white font-extrabold h-12 rounded-xl">
                            CLOSE PLAYER
                        </Button>
                    </DialogClose>
                </div>

                <div className="p-3 bg-white border-t border-border hidden lg:flex items-center justify-center gap-2 shrink-0">
                    <Image src="/logo.png" alt="Logo" width={14} height={14} className="opacity-40" />
                    <span className="text-[8px] font-extrabold text-muted-foreground/60 tracking-[0.2em] uppercase">Premium Learning by IDL</span>
                </div>
            </div>
        </DialogContent>
    );
};

export function PaidCoursesClient({ courses }: { courses: TPaidCourse[] }) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
  const [isProcessing, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
        getUserPurchasedCourses(user.uid).then(res => {
            if (res.success && res.data) {
                setPurchasedCourseIds(res.data);
            }
        });
    }
  }, [user]);

  const handlePurchase = async (course: TPaidCourse) => {
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

  const groupedCourses = useMemo(() => {
    return courses.reduce((acc, course) => {
      const key = course.class || 'Other Courses';
      const cleanKey = key.toLowerCase().includes('class') ? key : `Class ${key}`;
      if (!acc[cleanKey]) {
        acc[cleanKey] = [];
      }
      acc[cleanKey].push(course);
      return acc;
    }, {} as {[key: string]: TPaidCourse[]});
  }, [courses]);

  const sortedGroupedEntries = useMemo(() => {
    return Object.entries(groupedCourses).sort(([keyA], [keyB]) => {
      const numA = parseInt(keyA.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(keyB.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });
  }, [groupedCourses]);

  if (!mounted) return null;

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
        {sortedGroupedEntries.length > 0 ? (
          sortedGroupedEntries.map(([groupTitle, groupCourses]) => (
              <section key={groupTitle} className="mb-12">
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground relative inline-block">
                    <span className="relative z-10">{groupTitle}</span>
                    <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-yellow-400 fill-none stroke-current stroke-[10] opacity-70">
                          <path d="M0,15 Q50,5 100,15" />
                      </svg>
                    </div>
                  </h2>
                </div>
      
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupCourses.map((course) => {
                    const isPurchased = purchasedCourseIds.includes(course.id);
                    return (
                    <Card key={course.id} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col bg-card border group/card relative">
                      <div className="relative overflow-hidden aspect-[16/9]">
                          <GcsImage
                              filePath={course.coverImageUrl || ""}
                              alt={course.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                           <Badge className="absolute top-3 right-3 bg-primary/90 text-white font-bold text-[9px] tracking-widest rounded-lg px-3 py-1 uppercase shadow-lg">PREMIUM</Badge>
                      </div>
                      
                      <CardContent className="p-4 flex flex-col flex-grow">
                          <CardTitleUI className="text-sm md:text-base font-bold text-foreground leading-tight mb-2 line-clamp-2 group-hover/card:text-primary transition-colors">{course.title}</CardTitleUI>
                          
                          <div className="flex flex-wrap items-center gap-1.5 mb-3">
                              <Badge variant="secondary" className="rounded-md bg-primary/5 text-primary border-none font-bold uppercase text-[8px] tracking-widest">{course.batchName}</Badge>
                              <Badge variant="outline" className="rounded-md border-muted-foreground/20 text-muted-foreground text-[8px] tracking-widest font-bold uppercase">{course.medium}</Badge>
                          </div>

                          <div className="text-[9px] text-muted-foreground mt-1 space-y-1 font-bold uppercase tracking-tight">
                            <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Validity: <span className="text-foreground">{course.validity}</span></p>
                            <p className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-primary" /> Subject: <span className="text-foreground">{course.subject}</span></p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                  <p className="text-lg font-extrabold text-primary">₹{course.price}</p>
                                  {course.originalPrice > 0 && <p className="text-[10px] text-muted-foreground line-through opacity-50 font-bold">₹{course.originalPrice}</p>}
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
                                      <p className="text-[10px] text-foreground font-medium leading-relaxed whitespace-pre-wrap opacity-80">
                                          {course.description}
                                      </p>
                                  </ScrollArea>
                                  <div className="mt-4 pt-3 border-t border-white/10">
                                      <div className="flex items-center gap-2 text-[9px] font-bold text-green-600">
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
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group/btn text-[10px] tracking-tight">
                                        <PlayCircle className="w-3.5 h-3.5 mr-2 transition-transform group-hover/btn:scale-110" />
                                        EXPLORE CONTENT
                                    </Button>
                                </DialogTrigger>
                                <CoursePlayerDialog course={course} />
                            </Dialog>
                          ) : (
                            <Button 
                                onClick={() => handlePurchase(course)}
                                disabled={isProcessing}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold h-11 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] group/btn text-[10px] tracking-tight"
                            >
                                <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                                {isProcessing ? 'PROCESSING...' : 'BUY NOW'}
                            </Button>
                          )}
                      </div>
                    </Card>
                  )})}
                </div>
              </section>
            ))
        ) : (
          <div className="text-center py-32 space-y-4">
              <div className="p-6 bg-muted/50 rounded-full w-fit mx-auto">
                  <BookOpen className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <h2 className="text-xl font-extrabold text-foreground/40 tracking-tight uppercase">No premium courses found</h2>
              <p className="text-xs text-muted-foreground font-bold">Exciting premium content is being prepared for you!</p>
          </div>
        )}
      </div>
    </>
  );
}
