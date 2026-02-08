
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, Phone, Home, Calendar as CalendarIcon, Droplets, User as UserIcon, Edit, ShieldCheck, BadgeCheck, Clock, CheckCircle2 } from "lucide-react";
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

export default function AdminProfilePage() {
  const { user, loading, login } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: any) => {
    login(updatedUser);
    setIsEditDialogOpen(false);
  }
  
  const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            {icon}
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{title}</h3>
    </div>
  );

  const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="group p-4 rounded-xl border bg-card hover:bg-muted/50 transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="flex items-start gap-4">
            <div className="text-primary mt-1 transition-transform duration-300 group-hover:scale-110">{icon}</div>
            <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-0.5">{label}</p>
                <p className="font-bold text-sm text-foreground break-all">{value || 'Not provided'}</p>
            </div>
        </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-0">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                  <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
              <div className="md:col-span-2 space-y-6">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
              </div>
          </div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground font-bold">User session not found. Please log in again.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-2 md:p-0 animate-fade-in-up">
        {/* Profile Header Card */}
        <Card className="relative overflow-hidden rounded-[2rem] border-none shadow-2xl bg-white dark:bg-gray-900">
            <div className="absolute inset-0 z-0 h-48 md:h-64">
                <Image
                    src={placeholderImages.profile_banner.src}
                    alt="Banner"
                    fill
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white dark:to-gray-900" />
            </div>
            
            <CardContent className="relative z-10 pt-32 md:pt-44 pb-10 px-6 md:px-10">
                <div className="flex flex-col md:flex-row items-end gap-6">
                    <div className="relative shrink-0 mx-auto md:mx-0">
                        <Avatar className="w-32 h-32 md:w-44 md:h-44 border-4 border-white dark:border-gray-800 shadow-2xl">
                            {user.photoURL ? (
                                <GcsImage filePath={user.photoURL} alt={user.name || 'Admin'} fill className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-5xl bg-primary text-white">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="absolute bottom-2 right-2 bg-green-500 border-2 border-white dark:border-gray-800 w-6 h-6 rounded-full shadow-lg" title="Active Account" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left pb-2 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{user.name}</h1>
                            <Badge className="w-fit mx-auto md:mx-0 bg-primary/10 text-primary border-primary/20 font-black text-[10px] tracking-[0.2em] uppercase px-3 py-1">
                                <ShieldCheck className="w-3 h-3 mr-1.5" /> {user.role} Access
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> {user.email}
                        </p>
                    </div>

                    <div className="pb-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl font-black px-6 shadow-xl shadow-primary/20 group h-11">
                                    <Edit className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                                    EDIT PROFILE
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight">Modify Information</DialogTitle>
                                    <DialogDescription className="font-medium">Update your administrative credentials and personal details.</DialogDescription>
                                </DialogHeader>
                                <ProfileEditForm user={user} onSuccess={handleUpdateSuccess} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Column: Account Health & Badges */}
            <div className="space-y-8">
                <Card className="rounded-[2rem] shadow-lg border-muted-foreground/10 overflow-hidden bg-white dark:bg-card">
                    <CardHeader className="bg-muted/30 pb-4 border-b">
                        <CardTitle className="text-base font-black flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-primary" />
                            ACCOUNT VERIFICATION
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
                            <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] tracking-widest">VERIFIED</Badge>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-bold text-foreground">Email Authenticated</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-bold text-foreground">Two-Factor Enabled</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-bold text-foreground">Admin Privileges Active</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] shadow-lg border-muted-foreground/10 bg-primary text-white overflow-hidden group">
                    <CardContent className="p-8 space-y-4">
                        <div className="p-3 bg-white/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">System Logs</h3>
                            <p className="text-xs font-medium text-white/70 mt-1">Last activity recorded 2 hours ago from a verified IP.</p>
                        </div>
                        <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white text-white hover:text-primary font-black text-[10px] tracking-[0.2em] rounded-xl">
                            VIEW ACCESS HISTORY
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Column: Details Grid */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="rounded-[2.5rem] shadow-xl border-muted-foreground/10 bg-white dark:bg-card">
                    <CardContent className="p-8 md:p-10 space-y-10">
                        {/* Section: Personal Information */}
                        <div>
                            <SectionHeader title="Personal Information" icon={<UserIcon size={18} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <InfoCard icon={<UserIcon size={18} />} label="Legal Name" value={user.name} />
                                <InfoCard icon={<CalendarIcon size={18} />} label="Date of Birth" value={user.dob ? format(new Date(user.dob), "MMMM do, yyyy") : null} />
                                <InfoCard icon={<Droplets size={18} />} label="Blood Group" value={user.bloodGroup} />
                                <InfoCard icon={<Shield size={18} />} label="Administrative Role" value={user.role} />
                            </div>
                        </div>

                        {/* Section: Contact & Location */}
                        <div>
                            <SectionHeader title="Contact & Location" icon={<Phone size={18} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <InfoCard icon={<Mail size={18} />} label="Primary Email" value={user.email} />
                                <InfoCard icon={<Phone size={18} />} label="Contact Number" value={user.phone} />
                                <div className="md:col-span-2">
                                    <InfoCard icon={<Home size={18} />} label="Permanent Address" value={user.address} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
