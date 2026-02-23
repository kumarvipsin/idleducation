'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Megaphone, ArrowLeft, Sparkles, Clock, Info } from "lucide-react";
import { getUpdates } from '@/app/actions'; 
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
         <Card key={i} className="overflow-hidden border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
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

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16 relative z-10">
        <div className="max-w-3xl mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="space-y-6">
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px] -ml-2">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
            </Button>
            
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    Platform Announcements
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                    Recent{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Updates</span>
                        <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                <path d="M0,15 Q50,5 100,15" />
                            </svg>
                        </div>
                    </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-bold leading-relaxed max-w-xl">
                    Stay informed with the latest news, feature releases, and academic announcements from the IDL Education team.
                </p>
            </div>
          </div>

          {/* Updates List */}
          <div className="space-y-6">
            {loading ? (
              renderSkeleton()
            ) : updates.length > 0 ? (
              updates.map((update, index) => (
                <Card 
                    key={update.id} 
                    className="group border border-white/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="shrink-0 flex flex-row md:flex-col items-center md:items-center gap-4">
                            <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div className="text-center md:pt-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">
                                    {format(new Date(update.createdAt), 'MMM')}
                                </p>
                                <p className="text-2xl font-black text-foreground tracking-tighter leading-none mt-1">
                                    {format(new Date(update.createdAt), 'dd')}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                                    {update.title}
                                </h2>
                                <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5 rounded-lg px-2.5 py-1">
                                    <Clock className="w-3 h-3 mr-1.5 opacity-60" />
                                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                </Badge>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap">
                                {update.description}
                            </p>

                            <div className="pt-4 flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-muted-foreground/10 via-muted-foreground/5 to-transparent" />
                                <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                                    <Info className="w-3 h-3" />
                                    Official Release
                                </div>
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-dashed py-24 flex flex-col items-center justify-center text-center bg-white/40 rounded-[2.5rem]">
                <div className="bg-primary/5 p-8 rounded-full mb-6 border border-primary/10">
                    <Bell className="w-16 h-16 text-primary/20" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">No Updates Available</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 font-bold">
                    Check back soon! We'll be posting exciting announcements here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
