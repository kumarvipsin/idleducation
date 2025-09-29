
'use client';

import { useEffect, useState, useRef } from "react";
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
import { getStudents, getTeachers, assignTeachersToStudent, resetUserPassword, approveUser, denyUser, setUserStatus, deleteUser, editStudentProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap, ChevronDown, KeyRound, CheckCircle, XCircle, UserCheck, UserX, MoreVertical, Trash2, Users, Edit, Instagram, Facebook, Twitter, Image as ImageIcon, Upload } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageCropper } from "@/components/image-cropper";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  teacherIds?: string[];
  status: 'pending' | 'approved' | 'inactive';
  photoURL?: string;
  dob?: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
  biography?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

const studentSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
  bloodGroup: z.string().optional(),
  biography: z.string().optional(),
  instagram: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const StudentEditForm = ({ student, onSuccess }: { student: User | null; onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      phone: student?.phone || '',
      address: student?.address || '',
      dob: student?.dob ? student.dob.split('T')[0] : '', // Format date for input
      bloodGroup: student?.bloodGroup || '',
      biography: student?.biography || '',
      instagram: student?.socialLinks?.instagram || '',
      facebook: student?.socialLinks?.facebook || '',
      twitter: student?.socialLinks?.twitter || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemovePhoto(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageCropped = (croppedImageFile: File) => {
    setCroppedPhoto(croppedImageFile);
    setPhotoPreview(URL.createObjectURL(croppedImageFile));
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setCroppedPhoto(null);
  };

  const onSubmit = async (data: StudentFormValues) => {
    if (!student) return;
    setIsSubmitting(true);
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (croppedPhoto) formData.append('photo', croppedPhoto);
    if (removePhoto) formData.append('removePhoto', 'true');

    const result = await editStudentProfile(student.id, formData);

    if (result.success) {
      toast({ title: 'Success', description: 'Student profile updated successfully.' });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-4">
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <div className="flex items-center gap-4">
                   <Avatar className="h-20 w-20">
                     {photoPreview && !removePhoto ? (
                       <AvatarImage src={photoPreview} />
                     ) : student?.photoURL && !removePhoto ? (
                       <GcsImage filePath={student.photoURL} alt={student.name || ''} width={80} height={80} className="rounded-full object-cover" />
                     ) : (
                        <AvatarFallback><ImageIcon className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                     )}
                   </Avatar>
                   <div className="flex flex-col gap-2">
                       <Button type="button" onClick={() => document.getElementById('photo-upload')?.click()} variant="outline" size="sm"><Upload className="w-4 h-4 mr-2"/>Change Photo</Button>
                       <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                       {(student?.photoURL || photoPreview) && !removePhoto && <Button type="button" onClick={handleRemovePhoto} variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Remove</Button>}
                   </div>
                </div>
                <FormMessage />
              </FormItem>
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="dob" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="bloodGroup" render={({ field }) => ( <FormItem><FormLabel>Blood Group</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="biography" render={({ field }) => ( <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />

              <h3 className="text-sm font-medium">Social Media Links (Optional)</h3>
              <FormField control={form.control} name="instagram" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Instagram className="h-4 w-4"/> Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/username" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="facebook" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Facebook className="h-4 w-4"/> Facebook</FormLabel><FormControl><Input placeholder="https://facebook.com/username" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="twitter" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Twitter className="h-4 w-4"/> Twitter</FormLabel><FormControl><Input placeholder="https://twitter.com/username" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
      <ImageCropper 
        isOpen={isCropperOpen} 
        onClose={() => setIsCropperOpen(false)} 
        imageSrc={photoPreview} 
        onImageCropped={onImageCropped} 
        aspectRatio={1}
      />
    </>
  )
}

export default function AdminUsersPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'resetPassword' | 'deny' | 'toggleStatus' | 'delete' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
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
      case 'delete':
        result = await deleteUser(selectedUser.id);
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

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
    fetchUsers();
  }

  const getTeacherCountText = (teacherIds: string[] = []) => {
    if (teacherIds.length === 0) return "Not Assigned";
    return `${teacherIds.length} ${teacherIds.length > 1 ? 'teachers' : 'teacher'}`;
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
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
                                  <TableCell>
                                      <div className="flex items-center gap-2">
                                          <span className="truncate max-w-xs">{getTeacherCountText(student.teacherIds)}</span>
                                          <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                  <Button variant="outline" size="sm">
                                                      Assign <Users className="ml-2 h-4 w-4" />
                                                  </Button>
                                              </DropdownMenuTrigger>
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
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                      </div>
                                  </TableCell>
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
                                                  <DropdownMenuItem onSelect={() => { setEditingStudent(student); setIsFormOpen(true); }}>
                                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                                  </DropdownMenuItem>
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
                                                  <DropdownMenuSeparator />
                                                  <AlertDialogTrigger asChild>
                                                      <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(student); setActionType('delete'); }}>
                                                          <Trash2 className="mr-2 h-4 w-4" />
                                                          Delete Student
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
                {actionType === 'delete' && `This will permanently delete the student ${selectedUser?.name} from the database. This action cannot be undone.`}
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
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>
                    Update the details for this student.
                </DialogDescription>
            </DialogHeader>
            <StudentEditForm student={editingStudent} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </AlertDialog>
  );
}
