
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
  CardFooter,
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
    [...Array(6)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter className="gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-10" />
        </CardFooter>
      </Card>
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
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? renderSkeleton() : students.map((student) => (
            <Card key={student.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={student.photoURL} alt={student.name}/>
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </div>
                 <Badge variant={getBadgeVariant(student.status)} className="capitalize self-start">
                    {student.status}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                 <div>
                    <p className="text-xs font-semibold text-muted-foreground">Assigned Teachers</p>
                    <p className="text-sm">{getTeacherNames(student.teacherIds)}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-3 flex justify-end gap-2">
                {student.status === 'pending' ? (
                  <>
                    <Button size="sm" onClick={() => handleApproveUser(student.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                    </Button>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(student); setActionType('deny'); }}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Deny
                        </Button>
                    </AlertDialogTrigger>
                  </>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 justify-start">
                          Manage Teachers <ChevronDown className="ml-auto h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Assign Teachers</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-9 h-9">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
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
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
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

    