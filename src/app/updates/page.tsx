'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Sparkles, Bell, Clock, Calendar } from "lucide-react";
import { getUpdates } from '@/app/actions'; 
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
                <Skeleton className="h-20 w-full rounded-lg" />
            </div>
         </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
        <div className="max-w-2xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-16 space-y-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white shadow-sm border border-primary/5 text-primary text-[8px] font-bold uppercase tracking-wide">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    BOARD ANNOUNCEMENTS
                </div>
            </motion.div>
            
            <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
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
                <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-[11px] md:text-xs font-semibold leading-relaxed">
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

            <div className="space-y-8">
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
                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-full border-2 border-primary/10 shadow-none group-hover:border-primary group-hover:scale-110 transition-all duration-500">
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

                            {/* Content Card with Accordion */}
                            <Card className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-none rounded-lg overflow-hidden group/card transition-all duration-300">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="content" className="border-none">
                                        <AccordionTrigger className="p-6 md:p-8 hover:no-underline flex items-center justify-between">
                                            <div className="flex flex-col items-start gap-2 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-bold text-foreground tracking-tight leading-tight group-hover/card:text-primary transition-colors text-left">
                                                    <Calendar className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                                    {update.title}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                                            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap text-left">
                                                {update.description}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 shadow-none">
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
