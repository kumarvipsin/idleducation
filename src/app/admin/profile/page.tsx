
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, Phone, Home, Calendar as CalendarIcon, Droplets, User as UserIcon, Edit, ShieldCheck, BadgeCheck, Clock, CheckCircle2, Sparkles, MapPin, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { GcsImage } from "@/components/gcs-image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import placeholderImages from '@/app/lib/placeholder-images.json';
import { motion } from "framer-motion";

export default function AdminProfilePage() {
  const { user, loading, login } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: any) => {
    login(updatedUser);
    setIsEditDialogOpen(false);
  }
  
  const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-sm">
            {icon}
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">{title}</h3>
    </div>
  );

  const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="group p-5 rounded-[1.5rem] border border-muted-foreground/5 bg-card hover:bg-muted/30 transition-all duration-500 shadow-sm hover:shadow-lg">
        <div className="flex items-start gap-5">
            <div className="text-primary mt-1 p-2 bg-primary/5 rounded-lg transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/60 mb-1">{label}</p>
                <p className="font-bold text-sm text-foreground truncate">{value || 'Not provided'}</p>
            </div>
        </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-0">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                  <Skeleton className="h-80 w-full rounded-[2rem]" />
              </div>
              <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
              </div>
          </div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground font-black text-sm uppercase tracking-widest">User session expired. Please re-authenticate.</p>
        </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto p-2 md:p-0 animate-fade-in-up">
        {/* Advanced Profile Header */}
        <Card className="relative overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-gray-900 group/header">
            <div className="absolute inset-0 z-0 h-56 md:h-72">
                <Image
                    src={placeholderImages.profile_banner.src}
                    alt="Administrative Workspace"
                    fill
                    className="object-cover opacity-90 transition-transform duration-1000 group-hover/header:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />
            </div>
            
            <CardContent className="relative z-10 pt-40 md:pt-56 pb-10 px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-end gap-8 bg-white/40 dark:bg-black/20 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-white/30 dark:border-white/10 shadow-2xl">
                    <div className="relative shrink-0 mx-auto md:mx-0 -mt-20 md:-mt-24">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                        <Avatar className="w-36 h-32 md:w-48 md:h-48 border-[6px] border-white dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:scale-105">
                            {user.photoURL ? (
                                <GcsImage filePath={user.photoURL} alt={user.name || 'Admin'} fill className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-6xl bg-primary text-white font-black">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute bottom-4 right-4 bg-emerald-500 border-[3px] border-white dark:border-gray-800 w-7 h-7 rounded-full shadow-xl ring-4 ring-emerald-500/20" title="Active Admin Session" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="space-y-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground drop-shadow-sm">{user.name}</h1>
                                <Badge className="w-fit mx-auto md:mx-0 bg-primary text-white border-none font-black text-[9px] tracking-[0.25em] uppercase px-4 py-1.5 shadow-lg shadow-primary/20">
                                    <ShieldCheck className="w-3 h-3 mr-2" /> {user.role} PRIVILEGES
                                </Badge>
                            </div>
                            <p className="text-muted-foreground font-bold flex items-center justify-center md:justify-start gap-2.5 text-sm md:text-base">
                                <Mail className="w-4 h-4 text-primary" /> {user.email}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full border text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <Clock className="w-3 h-3" /> Last Active: Just Now
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest">
                                <CheckCircle2 className="w-3 h-3" /> System Verified
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 pb-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="rounded-2xl font-black px-8 shadow-[0_15px_30px_-5px_rgba(var(--primary),0.3)] transition-all duration-300 hover:shadow-[0_20px_40px_-5px_rgba(var(--primary),0.4)] active:scale-95 group h-14 bg-primary text-white">
                                    <Edit className="w-5 h-5 mr-3 transition-transform group-hover:rotate-[15deg] group-hover:scale-110" />
                                    MODIFY PROFILE
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                                <DialogHeader className="p-8 pb-0">
                                    <DialogTitle className="text-3xl font-black tracking-tight flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary"><Edit className="w-6 h-6"/></div>
                                        Administrative Sync
                                    </DialogTitle>
                                    <DialogDescription className="font-bold text-sm mt-2">Update your organizational credentials and personal telemetry.</DialogDescription>
                                </DialogHeader>
                                <div className="p-8">
                                    <ProfileEditForm user={user} onSuccess={handleUpdateSuccess} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Stats & Security */}
            <div className="lg:col-span-4 space-y-10">
                <Card className="rounded-[2.5rem] shadow-xl border-muted-foreground/10 bg-white dark:bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl">
                    <CardHeader className="bg-muted/30 pb-5 border-b p-8">
                        <CardTitle className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.2em] text-primary">
                            <BadgeCheck className="w-5 h-5" />
                            Security Integrity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Authentication</span>
                            <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] tracking-[0.2em] px-3">PROTECTED</Badge>
                        </div>
                        <Separator className="opacity-50" />
                        <div className="space-y-5">
                            {[
                                { label: "Email Authentication", active: true },
                                { label: "Two-Factor Protection", active: true },
                                { label: "Biometric Integration", active: false },
                                { label: "Admin Root Privileges", active: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                        item.active ? "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white" : "bg-muted text-muted-foreground opacity-50"
                                    )}>
                                        {item.active ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                    <span className={cn("text-xs font-bold transition-colors", item.active ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] shadow-2xl border-none bg-gradient-to-br from-primary to-indigo-900 text-white overflow-hidden group/logs relative p-[1px]">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/logs:opacity-100 transition-opacity duration-500" />
                    <CardContent className="relative z-10 p-10 space-y-6 bg-primary dark:bg-gray-950 rounded-[calc(2.5rem-1px)] h-full">
                        <div className="p-4 bg-white/10 rounded-2xl w-fit group-hover/logs:scale-110 group-hover/logs:rotate-[10deg] transition-all duration-500">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black tracking-tighter">Command Center</h3>
                            <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wide">Secure access tunnel verified. No anomalies detected in current node.</p>
                        </div>
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white text-white hover:text-primary font-black text-[10px] tracking-[0.25em] rounded-2xl h-12">
                            SYSTEM LOGS
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Main Information Hub */}
            <div className="lg:col-span-8">
                <Card className="rounded-[3rem] shadow-2xl border-muted-foreground/10 bg-white dark:bg-card overflow-hidden">
                    <CardContent className="p-8 md:p-12 space-y-12">
                        {/* Section: Personal Hub */}
                        <div className="space-y-8">
                            <SectionHeader title="Personal Intelligence" icon={<UserIcon size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard icon={<UserIcon size={20} />} label="Administrative Name" value={user.name} />
                                <InfoCard icon={<CalendarIcon size={20} />} label="Legacy Birth Date" value={user.dob ? format(new Date(user.dob), "MMMM do, yyyy") : null} />
                                <InfoCard icon={<Droplets size={20} />} label="Blood Group Index" value={user.bloodGroup} />
                                <InfoCard icon={<Shield size={20} />} label="Assigned Command Role" value={user.role} />
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Section: Connectivity Hub */}
                        <div className="space-y-8">
                            <SectionHeader title="Connectivity & Node" icon={<Phone size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard icon={<Mail size={20} />} label="Verified Communications" value={user.email} />
                                <InfoCard icon={<Phone size={20} />} label="Secure Line Index" value={user.phone} />
                                <div className="md:col-span-2">
                                    <InfoCard icon={<MapPin size={20} />} label="Primary Strategic Address" value={user.address} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-between items-center bg-muted/20 p-6 rounded-[2rem] border border-muted-foreground/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Globe className="w-6 h-6"/></div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-foreground">Global Registry</p>
                                    <p className="text-[10px] font-bold text-muted-foreground">ID: {user.uid.substring(0, 16)}...</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="font-bold text-[9px] tracking-[0.2em] border-primary/20 text-primary px-4 py-1.5 rounded-xl uppercase">UTC-8 Zone</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
