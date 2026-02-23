'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Megaphone, ArrowLeft, Sparkles, Clock, Info, Calendar } from "lucide-react";
import { getUpdates } from '@/app/actions'; 
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";

interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true);
      const result = await getUpdates();
      if (result.success && result.data) {
        setUpdates(result.data as Update[]);
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to load updates." });
      }
      setLoading(false);
    };
    fetchUpdates();
  }, [toast]);

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
         <Card key={i} className="overflow-hidden border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                    </div>
                </div>
            </CardContent>
         </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative overflow-x-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-10 lg:py-14 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="space-y-5 text-center md:text-left">
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[9px] h-8 -ml-2">
                <Link href="/"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Home</Link>
            </Button>
            
            <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-black uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-3 text-yellow-500" />
                    Board Announcements
                </div>
                <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                    Recent{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Updates</span>
                        <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                <path d="M0,15 Q50,5 100,15" />
                            </svg>
                        </div>
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] md:text-xs font-semibold leading-relaxed max-w-lg mx-auto md:mx-0">
                    Stay informed with the latest news, curriculum changes, and academic notifications from the IDL Education team.
                </p>
            </div>
          </div>

          {/* Updates List */}
          <div className="space-y-4">
            {loading ? (
              renderSkeleton()
            ) : updates.length > 0 ? (
              updates.map((update, index) => (
                <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                    <Card className="group border border-white/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden">
                    <CardContent className="p-4 md:p-5">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 flex flex-col items-center gap-2">
                                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                    <Megaphone className="w-4 h-4" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                                        {format(new Date(update.createdAt), 'MMM')}
                                    </p>
                                    <p className="text-sm font-black text-foreground tracking-tighter leading-none mt-0.5">
                                        {format(new Date(update.createdAt), 'dd')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h2 className="text-sm md:text-base font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors truncate">
                                        {update.title}
                                    </h2>
                                    <Badge variant="outline" className="w-fit text-[8px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5 rounded-lg px-2 py-0.5 shrink-0">
                                        <Clock className="w-2.5 h-2.5 mr-1 opacity-60" />
                                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                    </Badge>
                                </div>
                                
                                <p className="text-slate-600 dark:text-slate-400 text-[11px] md:text-[12px] font-bold leading-relaxed whitespace-pre-wrap line-clamp-3">
                                    {update.description}
                                </p>

                                <div className="pt-2 flex items-center gap-3">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-muted-foreground/10 via-muted-foreground/5 to-transparent" />
                                    <div className="flex items-center gap-1.5 text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                                        <Info className="w-2.5 h-2.5" />
                                        Verified Update
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>
              ))
            ) : (
              <Card className="border-dashed py-16 flex flex-col items-center justify-center text-center bg-white/40 rounded-3xl">
                <div className="bg-primary/5 p-6 rounded-full mb-4 border border-primary/10">
                    <Bell className="w-10 h-10 text-primary/20" />
                </div>
                <h3 className="text-lg font-black text-foreground tracking-tight uppercase">No Updates Yet</h3>
                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto mt-1 font-bold">
                    New notifications will appear here. Please check back later.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
