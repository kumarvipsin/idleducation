'use client';

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAccessLogs, getAccessStats, deleteAccessLog } from "@/app/actions/access";
import { format } from "date-fns";
import { Trash2, Phone, History, Users, Activity, BarChart3, ChevronDown, ChevronRight, Clock, ShieldCheck, User as UserIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface AccessLog {
  id: string;
  userId: string;
  phoneNumber: string;
  otpEntered: string;
  accessTimestamp: string;
  isSuccessful: boolean;
  eventType: string;
}

interface Stats {
  totalAttempts: number;
  uniqueVisitors: number;
  totalSuccessfulLogins: number;
}

export default function AdminAccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [logsRes, statsRes] = await Promise.all([
      getAccessLogs(),
      getAccessStats()
    ]);

    if (logsRes.success && logsRes.data) {
      setLogs(logsRes.data as AccessLog[]);
    }
    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data as Stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await deleteAccessLog(id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchData();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  // Group logs by phone number
  const groupedLogs = useMemo(() => {
    return logs.reduce((acc, log) => {
      if (!acc[log.phoneNumber]) {
        acc[log.phoneNumber] = [];
      }
      acc[log.phoneNumber].push(log);
      return acc;
    }, {} as Record<string, AccessLog[]>);
  }, [logs]);

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-0">
            <div className={cn("p-6 flex items-start justify-between bg-gradient-to-br", color)}>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{title}</p>
                    <h3 className="text-3xl font-black text-white">{value}</h3>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">{sub}</p>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Visitors" 
            value={stats?.totalAttempts || 0} 
            sub="Attempts recorded in system"
            icon={Activity}
            color="from-indigo-600 to-primary"
        />
        <StatCard 
            title="Unique Users" 
            value={stats?.uniqueVisitors || 0} 
            sub="Distinct phone registrations"
            icon={Users}
            color="from-emerald-600 to-teal-700"
        />
        <StatCard 
            title="Success Rate" 
            value={stats ? `${Math.round((stats.totalSuccessfulLogins / stats.totalAttempts) * 100 || 0)}%` : "0%"} 
            sub="OTP verification efficiency"
            icon={ShieldCheck}
            color="from-amber-500 to-orange-600"
        />
      </div>

      <Card className="rounded-3xl shadow-2xl border-none bg-white dark:bg-slate-950 overflow-hidden">
        <CardHeader className="p-8 border-b bg-muted/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight text-foreground">User Registration Hub</CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Manage phone-verified visitors and access history
                </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} className="rounded-xl font-bold text-[10px] uppercase tracking-widest">
                Refresh Records
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-450px)]">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
              </div>
            ) : Object.keys(groupedLogs).length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(groupedLogs).map(([phoneNumber, userLogs], index) => {
                  const successCount = userLogs.filter(l => l.isSuccessful).length;
                  return (
                    <AccordionItem key={phoneNumber} value={`item-${index}`} className="border-b last:border-0 hover:bg-muted/5 transition-colors">
                      <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                        <div className="flex flex-1 items-center justify-between pr-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-lg font-black tracking-tighter text-foreground">+91 {phoneNumber}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Last Visit: {format(new Date(userLogs[0].accessTimestamp), "PPp")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center hidden sm:block">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Logins</p>
                                    <Badge className="bg-primary text-white font-black px-3 rounded-lg">{successCount}</Badge>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Status</p>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter text-emerald-600 border-emerald-200 bg-emerald-50">Verified</Badge>
                                </div>
                            </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-8 pb-8 pt-2">
                        <div className="bg-muted/30 rounded-3xl p-6 border">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                                <History className="w-3 h-3" /> 
                                Detailed Access History
                            </h4>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-muted-foreground/10">
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest">Date & Time</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest">OTP Used</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest">Event Type</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Result</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userLogs.map((log) => (
                                            <TableRow key={log.id} className="border-muted-foreground/5 group/row">
                                                <TableCell className="font-bold text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                                        {format(new Date(log.accessTimestamp), "PPp")}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-primary">{log.otpEntered}</TableCell>
                                                <TableCell className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{log.eventType}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={cn(
                                                        "text-[8px] font-black uppercase tracking-widest border-none px-2 py-0.5",
                                                        log.isSuccessful ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                                                    )}>
                                                        {log.isSuccessful ? "Success" : "Failed"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover/row:opacity-100 hover:text-destructive transition-all"
                                                        onClick={() => handleDelete(log.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="py-24 text-center space-y-4">
                <div className="bg-muted p-6 rounded-full w-fit mx-auto opacity-20">
                    <UserIcon className="w-16 h-16" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">No registrations yet</h3>
                    <p className="text-sm text-muted-foreground font-bold mt-1">Website visitors will appear here after verification.</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}