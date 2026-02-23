'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Sparkles, Bell, Calendar } from "lucide-react";
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
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
         <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-12 space-y-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white shadow-sm border border-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
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
                <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase tracking-tight leading-relaxed">
                    A curated timeline of academic releases and board notifications.
                </p>
            </div>
          </div>

          {/* List View */}
          <div className="w-full">
                {loading ? (
                    renderSkeleton()
                ) : updates.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4 w-full">
                        {updates.map((update, index) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 5 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <AccordionItem value={update.id} className="border-none">
                                    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-none rounded-lg overflow-hidden group/card transition-all duration-300 hover:border-primary/20">
                                        <AccordionTrigger className="p-5 md:p-6 hover:no-underline flex items-center justify-between group data-[state=open]:bg-primary/[0.03] transition-colors">
                                            <header className="flex flex-col items-start gap-1 pr-4">
                                                {/* Time Row */}
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-100">
                                                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                {/* Date Row */}
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left opacity-100">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-black text-foreground uppercase tracking-tight">
                                                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        {format(new Date(update.createdAt), "EEEE, MMM dd, yyyy")}
                                                    </div>
                                                </div>
                                            </header>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-5 md:px-6 pb-6 pt-0 border-t border-slate-50 dark:border-slate-800/50 mt-2">
                                            <div className="pt-4">
                                                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap text-left flex-1">
                                                    {update.description}
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 shadow-none">
                        <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">No Announcements</h3>
                        <p className="text-xs text-muted-foreground font-bold mt-1">Check back later for important school updates.</p>
                    </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}