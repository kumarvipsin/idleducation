
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherProfilePage() {
  const { user, loading } = useAuth();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : user ? (
            <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? 'Teacher'} />
                    <AvatarFallback className="text-4xl">
                        {user.name ? user.name.charAt(0) : 'T'}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <User className="w-6 h-6 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-semibold text-lg">{user.name}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-lg">{user.email}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Briefcase className="w-6 h-6 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-semibold text-lg capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
            </div>
          ) : (
            <p>User not found. Please log in again.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
