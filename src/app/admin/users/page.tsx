
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudents, getTeachers, assignTeachersToStudent, resetUserPassword, approveUser, denyUser, setUserStatus } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap, ChevronDown, KeyRound, CheckCircle, XCircle, UserCheck, UserX, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  teacherIds?: string[];
  status: 'pending' | 'approved' | 'inactive';
  photoURL?: string;
}

export default function AdminUsersPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'resetPassword' | 'deny' | 'toggleStatus' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const [studentsResult, teachersResult] = await Promise.all([
      getStudents(),
      getTeachers(),
    ]);

    if (studentsResult.success && studentsResult.data) {
      setStudents(studentsResult.data as User[]);
    }
    if (teachersResult.success && teachersResult.data) {
      setTeachers(teachersResult.data as User[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async () => {
    if (!selectedUser || !actionType) return;

    let result;
    switch (actionType) {
      case 'resetPassword':
        result = await resetUserPassword(selectedUser.email);
        break;
      case 'deny':
        result = await denyUser(selectedUser.id);
        break;
      case 'toggleStatus':
        const newStatus = selectedUser.status === 'approved' ? 'inactive' : 'approved';
        result = await setUserStatus(selectedUser.id, newStatus);
        break;
      default:
        return;
    }
    
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchUsers();
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
      fetchUsers();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleAssignTeachers = async (studentId: string, teacherIds: string[]) => {
    const result = await assignTeachersToStudent(studentId, teacherIds);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, teacherIds } : s));
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const getTeacherNames = (teacherIds: string[] = []) => {
    if (teacherIds.length === 0) return "Not Assigned";
    return teacherIds.map(id => teachers.find(t => t.id === id)?.name).filter(Boolean).join(', ');
  };
  
  const getBadgeVariant = (status: User['status']) => {
    switch (status) {
        case 'approved': return 'default';
        case 'pending': return 'secondary';
        case 'inactive': return 'destructive';
        default: return 'outline';
    }
  };
  
  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
    ))
  );

  return (
    <AlertDialog>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Approve or deny new students, assign teachers, or send a password reset email.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-280px)] w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned Teachers</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? renderSkeleton() : students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            {student.photoURL ? <GcsImage filePath={student.photoURL} alt={student.name} width={40} height={40} className="rounded-full object-cover" /> : <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>}
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{student.name}</div>
                                            <div className="text-xs text-muted-foreground">{student.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant={getBadgeVariant(student.status)} className="capitalize">{student.status}</Badge></TableCell>
                                <TableCell>{getTeacherNames(student.teacherIds)}</TableCell>
                                <TableCell className="text-right">
                                    {student.status === 'pending' ? (
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" onClick={() => handleApproveUser(student.id)}><CheckCircle className="mr-2 h-4 w-4" />Approve</Button>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(student); setActionType('deny'); }}><XCircle className="mr-2 h-4 w-4" />Deny</Button>
                                            </AlertDialogTrigger>
                                        </div>
                                    ) : (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Manage Teachers</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <ScrollArea className="h-40">
                                                    {teachers.map(teacher => (
                                                    <DropdownMenuCheckboxItem
                                                        key={teacher.id}
                                                        checked={student.teacherIds?.includes(teacher.id)}
                                                        onCheckedChange={(checked) => {
                                                        const currentTeacherIds = student.teacherIds || [];
                                                        const newTeacherIds = checked
                                                            ? [...currentTeacherIds, teacher.id]
                                                            : currentTeacherIds.filter(id => id !== teacher.id);
                                                        handleAssignTeachers(student.id, newTeacherIds);
                                                        }}
                                                    >
                                                        {teacher.name}
                                                    </DropdownMenuCheckboxItem>
                                                    ))}
                                                </ScrollArea>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>Other Actions</DropdownMenuLabel>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(student); setActionType('toggleStatus'); }}>
                                                        {student.status === 'approved' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                                        {student.status === 'approved' ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(student); setActionType('resetPassword'); }}>
                                                        <KeyRound className="mr-2 h-4 w-4" />
                                                        Reset Password
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
              {actionType === 'resetPassword' && `This will send a password reset link to ${selectedUser?.email}.`}
              {actionType === 'deny' && `This will deny the registration for ${selectedUser?.name} and remove their data.`}
              {actionType === 'toggleStatus' && `This will ${selectedUser?.status === 'approved' ? 'deactivate' : 'activate'} the account for ${selectedUser?.name}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setSelectedUser(null); setActionType(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
                Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
