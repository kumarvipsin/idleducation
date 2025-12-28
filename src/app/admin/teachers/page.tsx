
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTeachers } from "@/app/actions/user";
import { resetUserPassword, signUpUser } from "@/app/actions/auth";
import { approveUser, denyUser, setUserStatus, editTeacher, deleteUser } from "@/app/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, KeyRound, CheckCircle, XCircle, UserCheck, UserX, UserPlus, Instagram, Facebook, Twitter, Image as ImageIcon, Edit, MoreVertical, Trash2, Upload, View, Mail, Phone, Home, Calendar as CalendarIcon, Droplets } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GcsImage } from "@/components/gcs-image";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  status: 'pending' | 'approved' | 'inactive';
  photoURL?: string;
  designation?: string;
  experience?: string;
  biography?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

const teacherSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional().or(z.literal('')),
  designation: z.string().min(2, { message: "Designation is required." }),
  experience: z.string().min(2, { message: "Experience is required." }),
  biography: z.string().optional(),
  instagram: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
});
type TeacherFormValues = z.infer<typeof teacherSchema>;


const TeacherForm = ({ teacher, onSuccess }: { teacher?: User | null, onSuccess: () => void }) => {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { 
      name: teacher?.name || '', 
      email: teacher?.email || '', 
      password: '',
      designation: teacher?.designation || '', 
      experience: teacher?.experience || '',
      biography: teacher?.biography || '',
      instagram: teacher?.socialLinks?.instagram || '', 
      facebook: teacher?.socialLinks?.facebook || '', 
      twitter: teacher?.socialLinks?.twitter || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemovePhoto(false);
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setPhotoFile(null);
  }


  const onSubmit: SubmitHandler<TeacherFormValues> = async (data) => {
    let result;
    
    if (teacher) { // Editing
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (photoFile) formData.append('photo', photoFile);
      if (removePhoto) formData.append('removePhoto', 'true');
      
      result = await editTeacher(teacher.id, formData);
    } else { // Adding
      const { instagram, facebook, twitter, ...restOfData } = data;
      const teacherData = {
        ...restOfData,
        role: 'teacher' as const,
        socialLinks: {
          instagram: instagram || '',
          facebook: facebook || '',
          twitter: twitter || '',
        }
      };
      result = await signUpUser(teacherData, photoFile);
    }
    
    if (result.success) {
      toast({
        title: teacher ? "Teacher Updated" : "Teacher Added",
        description: result.message,
      });
      onSuccess();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
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
                     ) : teacher?.photoURL && !removePhoto ? (
                       <GcsImage filePath={teacher.photoURL} alt={teacher.name || ''} width={80} height={80} className="rounded-full object-cover" />
                     ) : (
                        <AvatarFallback><ImageIcon className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                     )}
                   </Avatar>
                   <div className="flex flex-col gap-2">
                       <Button type="button" onClick={() => document.getElementById('photo-upload')?.click()} variant="outline" size="sm"><Upload className="w-4 h-4 mr-2"/>Change Photo</Button>
                       <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                       {(teacher?.photoURL || photoPreview) && !removePhoto && <Button type="button" onClick={handleRemovePhoto} variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Remove</Button>}
                   </div>
                </div>
                <FormMessage />
              </FormItem>
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="teacher@example.com" {...field} disabled={!!teacher} /></FormControl><FormMessage /></FormItem> )} />
              {!teacher && (
                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
              )}
              <FormField control={form.control} name="designation" render={({ field }) => ( <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="e.g., Senior Maths Teacher" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="experience" render={({ field }) => ( <FormItem><FormLabel>Experience</FormLabel><FormControl><Input placeholder="e.g., 10+ Years of Experience" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="biography" render={({ field }) => ( <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea placeholder="A short bio about the teacher..." {...field} /></FormControl><FormMessage /></FormItem> )} />

              <h3 className="text-sm font-medium">Social Media Links (Optional)</h3>
              <FormField control={form.control} name="instagram" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Instagram className="h-4 w-4"/> Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/username" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="facebook" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Facebook className="h-4 w-4"/> Facebook</FormLabel><FormControl><Input placeholder="https://facebook.com/username" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="twitter" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Twitter className="h-4 w-4"/> Twitter</FormLabel><FormControl><Input placeholder="https://twitter.com/username" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'resetPassword' | 'deny' | 'toggleStatus' | 'delete' | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<User | null>(null);
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
      fetchUsers(); // Re-fetch users to update status
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingTeacher(null);
    fetchUsers();
  }
  
  const getBadgeVariant = (status: User['status']) => {
    switch (status) {
        case 'approved': return 'default';
        case 'pending': return 'secondary';
        case 'inactive': return 'destructive';
        default: return 'outline';
    }
  };

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => (
    <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-sm">{value || 'Not provided'}</p>
        </div>
    </div>
);


  return (
    <AlertDialog>
       <Dialog open={isFormOpen || !!viewingTeacher} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setIsFormOpen(false);
                setEditingTeacher(null);
                setViewingTeacher(null);
            }
       }}>
        <div className="space-y-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Teacher Management</CardTitle>
                    <CardDescription>Manage all teachers on the platform.</CardDescription>
                </div>
                 <DialogTrigger asChild>
                    <Button onClick={() => { setEditingTeacher(null); setIsFormOpen(true); }}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Teacher
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-250px)]">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Teacher Name</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                        <TableCell>
                           <button onClick={() => setViewingTeacher(teacher)} className="font-medium flex items-center gap-2 cursor-pointer hover:underline">
                               <Avatar>
                                 {teacher.photoURL ? (
                                   <GcsImage filePath={teacher.photoURL} alt={teacher.name || ''} width={40} height={40} className="rounded-full object-cover"/>
                                 ) : (
                                   <AvatarFallback>{teacher.name ? teacher.name.charAt(0) : 'T'}</AvatarFallback>
                                 )}
                               </Avatar>
                               <div>
                                 <p>{teacher.name}</p>
                                 <p className="text-xs text-muted-foreground">{teacher.email}</p>
                               </div>
                           </button>
                        </TableCell>
                        <TableCell>{teacher.designation || 'N/A'}</TableCell>
                        <TableCell>{teacher.experience || 'N/A'}</TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(teacher.status)} className="capitalize">
                            {teacher.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            {teacher.status === 'pending' ? (
                            <>
                            <Button size="sm" onClick={() => handleApproveUser(teacher.id)}>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => { setEditingTeacher(teacher); setIsFormOpen(true); }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(teacher); setActionType('toggleStatus'); }}>
                                    {teacher.status === 'approved' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                    {teacher.status === 'approved' ? 'Deactivate' : 'Activate'}
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(teacher); setActionType('resetPassword'); }}>
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Reset Password
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(teacher); setActionType('delete'); }}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
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
                {actionType === 'delete' && `This will permanently delete the teacher ${selectedUser?.name}. This action cannot be undone.`}
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
        {editingTeacher && (
             <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Teacher</DialogTitle>
                    <DialogDescription>
                       Update the details for this teacher.
                    </DialogDescription>
                </DialogHeader>
                <TeacherForm teacher={editingTeacher} onSuccess={handleFormSuccess} />
            </DialogContent>
        )}
        {!editingTeacher && viewingTeacher && (
           <DialogContent className="sm:max-w-md">
               <DialogHeader>
                    <DialogTitle>Teacher Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                     <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-md">
                            {viewingTeacher.photoURL ? <GcsImage filePath={viewingTeacher.photoURL} alt={viewingTeacher.name} fill className="rounded-full object-cover"/> : <AvatarFallback className="text-2xl">{viewingTeacher.name.charAt(0)}</AvatarFallback>}
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-bold text-center">{viewingTeacher.name}</h3>
                            <p className="text-xs text-muted-foreground text-center capitalize">{viewingTeacher.role}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-3 text-sm pt-4 border-t">
                        <DetailItem icon={<Badge />} label="Designation" value={viewingTeacher.designation} />
                        <DetailItem icon={<Briefcase />} label="Experience" value={viewingTeacher.experience} />
                        <DetailItem icon={<Mail size={16}/>} label="Email" value={viewingTeacher.email} />
                     </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setViewingTeacher(null)}>Close</Button>
                </DialogFooter>
           </DialogContent>
        )}
         {!editingTeacher && !viewingTeacher && isFormOpen && (
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new teacher account.
                    </DialogDescription>
                </DialogHeader>
                <TeacherForm teacher={null} onSuccess={handleFormSuccess} />
            </DialogContent>
        )}
       </Dialog>
    </AlertDialog>
  );
}
