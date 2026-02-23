'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, ArrowLeft, Sparkles, Bell, Calendar, Clock, ChevronRight } from "lucide-react";
import { getUpdates } from '@/app/actions'; 
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
         <div key={i} className="flex gap-6">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
         </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 relative selection:bg-primary/10">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
        <div className="max-w-2xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-16 space-y-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Button asChild variant="ghost" className="rounded-full hover:bg-white dark:hover:bg-slate-900 border shadow-sm text-muted-foreground font-bold uppercase tracking-widest text-[9px] h-8 px-4">
                    <Link href="/"><ArrowLeft className="mr-1.5 h-3 w-3" /> Back to Campus</Link>
                </Button>
            </motion.div>
            
            <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    Recent Updates
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-md mx-auto">
                    A curated timeline of academic releases, curriculum adjustments, and official board notifications.
                </p>
            </div>
          </div>

          {/* Timeline View */}
          <div className="relative">
            {/* Timeline Line */}
            {!loading && updates.length > 0 && (
                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden sm:block" />
            )}

            <div className="space-y-12">
                {loading ? (
                    renderSkeleton()
                ) : updates.length > 0 ? (
                    updates.map((update, index) => (
                        <motion.div
                            key={update.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group flex flex-col sm:flex-row gap-6"
                        >
                            {/* Desktop Date Marker */}
                            <div className="hidden sm:flex flex-col items-center shrink-0 z-10">
                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-full border-2 border-primary/10 shadow-sm group-hover:border-primary group-hover:scale-110 transition-all duration-500">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-tighter leading-none">
                                        {format(new Date(update.createdAt), 'MMM')}
                                    </p>
                                    <p className="text-base font-black text-foreground tracking-tighter leading-none mt-1">
                                        {format(new Date(update.createdAt), 'dd')}
                                    </p>
                                </div>
                            </div>

                            {/* Content Card */}
                            <Card className="flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-white dark:border-slate-800 shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 rounded-[1.5rem] overflow-hidden group/card border-none">
                                <CardContent className="p-6 md:p-8">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight leading-tight group-hover/card:text-primary transition-colors">
                                                {update.title}
                                            </h2>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                                            {update.description}
                                        </p>

                                        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(update.createdAt), 'EEEE, MMMM dd')}
                                            </div>
                                            <div className="text-primary opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-1 transition-all duration-300">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-dashed">
                        <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-foreground tracking-tight">No Announcements</h3>
                        <p className="text-sm text-muted-foreground font-bold mt-1">Check back later for important school updates.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
