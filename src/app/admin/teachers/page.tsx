
'use client';

import { useEffect, useState } from "react";
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
import { getTeachers, resetUserPassword, approveUser, denyUser } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, KeyRound, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  status: 'pending' | 'approved';
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'resetPassword' | 'deny' | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const teachersResult = await getTeachers();
    if (teachersResult.success && teachersResult.data) {
      setTeachers(teachersResult.data as User[]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePasswordReset = async () => {
    if (!selectedUser) return;
    const result = await resetUserPassword(selectedUser.email);
    if (result.success) {
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setSelectedUser(null);
    setActionType(null);
  };
  
  const handleApproveUser = async (userId: string) => {
    const result = await approveUser(userId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchUsers(); // Re-fetch users to update status
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleDenyUser = async () => {
    if (!selectedUser) return;
    const result = await denyUser(selectedUser.id);
    if (result.success) {
        toast({ title: "Success", description: result.message });
        fetchUsers();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setSelectedUser(null);
    setActionType(null);
  }

  return (
    <AlertDialog>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>Approve or deny new teachers, or send a password reset email.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium flex items-center gap-2"><Briefcase className="h-4 w-4"/> {teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                       <TableCell>
                        <Badge variant={teacher.status === 'approved' ? 'default' : 'secondary'} className="capitalize">
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {teacher.status === 'pending' ? (
                          <>
                           <Button size="sm" onClick={() => handleApproveUser(teacher.id)} className="mr-2">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                           </Button>
                           <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(teacher); setActionType('deny'); }}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deny
                              </Button>
                           </AlertDialogTrigger>
                          </>
                        ) : (
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(teacher); setActionType('resetPassword'); }}>
                              <KeyRound className="h-4 w-4" />
                              <span className="sr-only">Reset Password</span>
                            </Button>
                          </AlertDialogTrigger>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'resetPassword' && `This action will send a password reset link to ${selectedUser?.email}. This cannot be undone.`}
              {actionType === 'deny' && `This action will deny the registration for ${selectedUser?.name} and remove their data. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setSelectedUser(null); setActionType(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={actionType === 'resetPassword' ? handlePasswordReset : handleDenyUser}>
                {actionType === 'deny' ? 'Deny' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
