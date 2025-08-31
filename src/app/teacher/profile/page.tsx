
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherProfilePage() {
  const { user, loading } = useAuth();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-muted/30 rounded-lg">
                <Avatar className="w-40 h-40 border-4 border-primary shadow-lg mb-4">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? 'Teacher'} />
                    <AvatarFallback className="text-5xl">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground capitalize">{user.role}</p>
            </div>
            <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold text-lg">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-3 rounded-full">
                         <Briefcase className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-semibold text-lg capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </div>
      );
    }

    return <p>User not found. Please log in again.</p>;
  };


  return (
    <div>
      <Card>
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
