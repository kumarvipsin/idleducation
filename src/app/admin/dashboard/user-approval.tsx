
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
import { getPendingUsers, approveUser, denyUser } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, GraduationCap, Briefcase } from "lucide-react";
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
}

export function UserApproval() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const result = await getPendingUsers();
    if (result.success && result.data) {
      // Filter to only show teachers
      const teachers = (result.data as User[]).filter(user => user.role === 'teacher');
      setUsers(teachers);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    const result = await approveUser(userId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchUsers(); // Re-fetch users to update the list
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
  }

  return (
    <AlertDialog>
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle>Pending Teacher Approvals</CardTitle>
          <CardDescription>Approve or deny new teacher registrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {user.role === 'student' ? <GraduationCap className="h-4 w-4"/> : <Briefcase className="h-4 w-4"/>}
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" onClick={() => handleApproveUser(user.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" onClick={() => setSelectedUser(user)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Deny
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No pending teachers.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will deny the registration for <span className="font-semibold">{selectedUser?.name}</span> and remove their data. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDenyUser}>
              Deny
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
