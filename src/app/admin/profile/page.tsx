
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Phone, Home, Calendar, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { GcsImage } from "@/components/gcs-image";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col items-center justify-center p-6">
                 <Skeleton className="h-40 w-40 rounded-full" />
                 <Skeleton className="h-6 w-3/4 mt-4" />
                 <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-muted/30 rounded-lg">
                <Avatar className="w-40 h-40 border-4 border-primary shadow-lg mb-4">
                    {user.photoURL ? (
                      <GcsImage filePath={user.photoURL} alt={user.name || 'Admin'} fill className="rounded-full object-cover"/>
                    ) : (
                      <AvatarFallback className="text-5xl">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                      </AvatarFallback>
                    )}
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground capitalize">{user.role}</p>
                 <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4">Edit Profile</Button>
                </DialogTrigger>
            </div>
            <div className="md:col-span-2 space-y-4">
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
      );
    }

    return <p>User not found. Please log in again.</p>;
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Card>
            <CardContent className="p-6">
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
