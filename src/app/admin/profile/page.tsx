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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AdminProfilePage() {
  const { user, loading, login } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateSuccess = (updatedUser: any) => {
    login(updatedUser);
    setIsEditDialogOpen(false);
  }
  
  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
    <div className="flex items-start gap-4">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center gap-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-1 text-center">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
      );
    }

    if (user) {
      return (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card className="shadow-lg">
                    <CardContent className="p-6 flex flex-col items-center gap-4">
                       <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
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
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">@{user.email?.split('@')[0]}</p>
                        </div>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>View and manage your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Tabs defaultValue="contact">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="contact">Contact</TabsTrigger>
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                            </TabsList>
                            <TabsContent value="contact" className="mt-4">
                                <div className="space-y-4">
                                    <InfoItem icon={<Mail className="h-5 w-5"/>} label="Email Address" value={user.email} />
                                    <Separator />
                                    <InfoItem icon={<Phone className="h-5 w-5"/>} label="Phone Number" value={user.phone} />
                                    <Separator />
                                    <InfoItem icon={<Home className="h-5 w-5"/>} label="Address" value={user.address} />
                                </div>
                            </TabsContent>
                            <TabsContent value="personal" className="mt-4">
                               <div className="space-y-4">
                                    <InfoItem icon={<Calendar className="h-5 w-5"/>} label="Date of Birth" value={user.dob ? new Date(user.dob).toLocaleDateString() : null} />
                                    <Separator />
                                    <InfoItem icon={<Droplets className="h-5 w-5"/>} label="Blood Group" value={user.bloodGroup} />
                                    <Separator />
                                    <InfoItem icon={<Shield className="h-5 w-5"/>} label="Role" value={user.role} />
                               </div>
                            </TabsContent>
                        </Tabs>
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
