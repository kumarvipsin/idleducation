
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, Phone, Home, Calendar, Droplets, User as UserIcon, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { GcsImage } from "@/components/gcs-image";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import placeholderImages from '@/lib/placeholder-images.json';

export default function AdminProfilePage() {
  const { user, loading, login } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: any) => {
    login(updatedUser);
    setIsEditDialogOpen(false);
  }
  
  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
        <div className="text-primary mt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium">{value || 'Not provided'}</p>
        </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Card className="w-full mx-auto">
            <CardContent className="p-6">
                <Skeleton className="h-48 w-full mb-[-80px] rounded-t-lg" />
                <div className="flex flex-col items-center">
                    <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                    <Skeleton className="h-8 w-48 mt-4" />
                    <Skeleton className="h-4 w-32 mt-2" />
                    <Skeleton className="h-10 w-32 mt-4" />
                </div>
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
        </Card>
      );
    }

    if (user) {
      return (
        <Card className="w-full mx-auto overflow-hidden shadow-lg">
            <div className="relative h-48 bg-muted">
                <Image
                    src={placeholderImages.profile_banner.src}
                    alt={placeholderImages.profile_banner.alt}
                    data-ai-hint={placeholderImages.profile_banner.hint}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>
            <CardContent className="p-6">
                <div className="flex flex-col items-center -mt-24">
                     <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                        {user.photoURL ? (
                            <GcsImage
                                filePath={user.photoURL}
                                alt={user.name || 'Admin'}
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <AvatarFallback className="text-5xl">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="text-center mt-4">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-sm text-muted-foreground">@{user.email?.split('@')[0]}</p>
                    </div>
                     <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-4">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                </div>
                
                 <Separator className="my-8" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={<Mail className="h-5 w-5"/>} label="Email Address" value={user.email} />
                    <InfoItem icon={<Phone className="h-5 w-5"/>} label="Phone Number" value={user.phone} />
                    <InfoItem icon={<Home className="h-5 w-5"/>} label="Address" value={user.address} />
                    <InfoItem icon={<Calendar className="h-5 w-5"/>} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : null} />
                    <InfoItem icon={<Droplets className="h-5 w-5"/>} label="Blood Group" value={user.bloodGroup} />
                    <InfoItem icon={<Shield className="h-5 w-5"/>} label="Role" value={user.role} />
                </div>
            </CardContent>
        </Card>
      );
    }

    return <p>User not found. Please log in again.</p>;
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {renderContent()}
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit Your Profile</DialogTitle>
                <DialogDescription>
                    Update your personal details. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            {user && <ProfileEditForm user={user} onSuccess={handleUpdateSuccess} />}
        </DialogContent>
    </Dialog>
  );
}
