
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
import { getTeachers, resetUserPassword } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, KeyRound } from "lucide-react";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const teachersResult = await getTeachers();
      if (teachersResult.success && teachersResult.data) {
        setTeachers(teachersResult.data as User[]);
      }
    };
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
  };

  return (
    <AlertDialog>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Management</CardTitle>
            <CardDescription>Manage teachers or send a password reset email.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium flex items-center gap-2"><Briefcase className="h-4 w-4"/> {teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell className="text-right">
                         <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(teacher)}>
                            <KeyRound className="h-4 w-4" />
                            <span className="sr-only">Reset Password</span>
                          </Button>
                        </AlertDialogTrigger>
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
              This action will send a password reset link to <span className="font-medium">{selectedUser?.email}</span>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordReset}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
