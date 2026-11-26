
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

  const sectionTitleStyle = { wordSpacing: '0.03em' };
  const sectionTitleClass =
    'text-[18px] sm:text-[19px] font-extrabold tracking-[-0.015em] leading-snug text-[#173568] dark:text-slate-100';
  const sectionDescClass =
    'text-[12.5px] sm:text-[13px] font-medium tracking-[0.005em] leading-snug text-[#475E82] dark:text-slate-400';
  const tableHeadClass =
    'text-[12.5px] font-bold tracking-[0.01em] text-[#173568]/85 dark:text-slate-300';

  return (
    <AlertDialog>
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 antialiased">
        <CardHeader>
          <CardTitle style={sectionTitleStyle} className={sectionTitleClass}>
            Pending Teacher Approvals
          </CardTitle>
          <CardDescription className={sectionDescClass}>
            Approve or deny new teacher registrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={sectionTitleStyle} className={tableHeadClass}>User Name</TableHead>
                  <TableHead style={sectionTitleStyle} className={tableHeadClass}>Email</TableHead>
                  <TableHead style={sectionTitleStyle} className={tableHeadClass}>Role</TableHead>
                  <TableHead style={sectionTitleStyle} className={`text-right ${tableHeadClass}`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-2 text-[13.5px] font-bold tracking-[0.005em] text-[#0B224D] dark:text-white">
                        {user.role === 'student' ? <GraduationCap className="h-4 w-4"/> : <Briefcase className="h-4 w-4"/>}
                        {user.name}
                      </TableCell>
                      <TableCell className="text-[13px] font-medium tracking-[0.005em] text-[#334E75] dark:text-slate-300">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="capitalize text-[11.5px] font-bold tracking-[0.01em] text-[#173568] dark:text-slate-200"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id)}
                          className="text-xs font-bold tracking-[0.01em]"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setSelectedUser(user)}
                            className="text-xs font-bold tracking-[0.01em]"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Deny
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-[13px] font-semibold tracking-[0.005em] text-[#475E82] dark:text-slate-400"
                        >
                            No pending teachers.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <AlertDialogContent className="antialiased">
        <AlertDialogHeader>
          <AlertDialogTitle
            style={sectionTitleStyle}
            className="text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100"
          >
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className={sectionDescClass}>
            This action will deny the registration for{' '}
            <span className="font-bold text-[#0B224D] dark:text-white">{selectedUser?.name}</span> and remove their data. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-xs font-bold tracking-[0.01em]"
            onClick={() => setSelectedUser(null)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-xs font-bold tracking-[0.01em]"
            onClick={handleDenyUser}
          >
              Deny
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
