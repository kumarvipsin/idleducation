
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Shield, Phone, Home, Calendar, Droplets, User as UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { GcsImage } from "@/components/gcs-image";
import Image from "next/image";
import placeholderData from "@/app/lib/placeholder-images.json";

export default function AdminProfilePage() {
  const { user, loading, login } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: any) => {
    // The login function in auth context updates the user state and sessionStorage
    login(updatedUser);
    setIsEditDialogOpen(false);
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <div className="flex items-end px-4 -mt-16">
            <Skeleton className="h-32 w-32 rounded-full border-4" />
          </div>
          <div className="p-4 space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
    }

    if (user) {
      return (
        <div>
          <div className="relative h-48 w-full">
            <Image
              src={placeholderData.profile_banner.src}
              alt={placeholderData.profile_banner.alt}
              data-ai-hint={placeholderData.profile_banner.hint}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="px-6">
            <div className="flex items-end -mt-16">
              <Avatar className="w-32 h-32 border-4 border-background bg-background shadow-lg">
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
              <div className="ml-auto">
                 <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">@{user.email?.split('@')[0]}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card>
                    <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-primary"/><p>{user.email}</p></div>
                        <div className="flex items-center gap-4"><Phone className="w-5 h-5 text-primary"/><p>{user.phone || 'Not provided'}</p></div>
                        <div className="flex items-center gap-4"><Home className="w-5 h-5 text-primary"/><p>{user.address || 'Not provided'}</p></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><Calendar className="w-5 h-5 text-primary"/><p>{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</p></div>
                        <div className="flex items-center gap-4"><Droplets className="w-5 h-5 text-primary"/><p>{user.bloodGroup || 'Not provided'}</p></div>
                         <div className="flex items-center gap-4"><Shield className="w-5 h-5 text-primary"/><p className="capitalize">{user.role}</p></div>
                    </CardContent>
                </Card>
            </div>

          </div>
        </div>
      );
    }

    return <p>User not found. Please log in again.</p>;
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Card>
            <CardContent className="p-0">
              {renderContent()}
            </CardContent>
        </Card>
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
