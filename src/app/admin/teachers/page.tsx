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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTeachers, deleteUser, addAdmin, editAdminProfile, setUserStatus, resetUserPassword, editTeacher, signUpUser, approveUser, denyUser } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, KeyRound, CheckCircle, XCircle, UserCheck, UserX, UserPlus, Instagram, Facebook, Twitter, Image as ImageIcon, Edit, MoreVertical, Trash2, Upload, Eye, Mail, Phone, Home, Calendar as CalendarIcon, Droplets } from "lucide-react";
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
import { useAuth } from "@/context/auth-context";
import { normalizeBranchId, recordMatchesBranch } from "@/lib/branch-utils";

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
      result = await signUpUser(teacherData as any, photoFile);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ScrollArea className="max-h-[60vh] w-full pr-3">
            <div className="space-y-3 py-0.5">
              {/* Compact Inline Profile Photo Row */}
              <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2">
                <Avatar className="h-11 w-11 shrink-0 border border-slate-200">
                  {photoPreview && !removePhoto ? (
                    <AvatarImage src={photoPreview} />
                  ) : teacher?.photoURL && !removePhoto ? (
                    <GcsImage filePath={teacher.photoURL} alt={teacher.name || ''} width={44} height={44} className="rounded-full object-cover" />
                  ) : (
                    <AvatarFallback><ImageIcon className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-xs font-medium"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {photoPreview || (teacher?.photoURL && !removePhoto) ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {(teacher?.photoURL || photoPreview) && !removePhoto && (
                    <Button
                      type="button"
                      onClick={handleRemovePhoto}
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-slate-600">Full Name</FormLabel>
                      <FormControl><Input className="h-8 text-xs md:text-xs" placeholder="Full name" {...field} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-slate-600">Email Address</FormLabel>
                      <FormControl><Input className="h-8 text-xs md:text-xs" type="email" placeholder="teacher@example.com" {...field} disabled={!!teacher} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              {!teacher && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-slate-600">Password</FormLabel>
                      <FormControl><Input className="h-8 text-xs md:text-xs" type="password" placeholder="Min 6 characters" {...field} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-slate-600">Designation</FormLabel>
                      <FormControl><Input className="h-8 text-xs md:text-xs" placeholder="e.g., Maths Faculty" {...field} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium text-slate-600">Experience</FormLabel>
                      <FormControl><Input className="h-8 text-xs md:text-xs" placeholder="e.g., 5+ Years" {...field} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-medium text-slate-600">Biography</FormLabel>
                    <FormControl><Textarea rows={2} className="min-h-[56px] text-xs md:text-xs resize-none" placeholder="Short bio (optional)..." {...field} /></FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <div className="pt-1 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Social Links (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="flex items-center gap-1.5 text-[11px] text-slate-500"><Instagram className="h-3 w-3" /> Instagram</FormLabel>
                        <FormControl><Input className="h-8 text-xs md:text-xs px-2.5" placeholder="URL" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="flex items-center gap-1.5 text-[11px] text-slate-500"><Facebook className="h-3 w-3" /> Facebook</FormLabel>
                        <FormControl><Input className="h-8 text-xs md:text-xs px-2.5" placeholder="URL" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="flex items-center gap-1.5 text-[11px] text-slate-500"><Twitter className="h-3 w-3" /> Twitter</FormLabel>
                        <FormControl><Input className="h-8 text-xs md:text-xs px-2.5" placeholder="URL" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-2 border-t border-slate-100">
            <Button type="submit" size="sm" className="h-8 px-4 text-xs font-semibold" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : teacher ? 'Save Changes' : 'Add Teacher'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default function AdminTeachersPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? normalizedBranchId : null;

  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'resetPassword' | 'deny' | 'toggleStatus' | 'delete' | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const scopeArg = isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined;
    const teachersResult = await getTeachers({ narrowBranchId: scopeArg });
    if (teachersResult.success && teachersResult.data) {
      const list = teachersResult.data as User[];
      setTeachers(
        isBranchAdmin && branchAdminBranchId
          ? list.filter((item) => recordMatchesBranch(item as any, branchAdminBranchId))
          : list
      );
    } else {
      setTeachers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchUsers();
    }
  }, [authLoading, user?.uid, branchAdminBranchId]);

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
  
  const getStatusBadgeClasses = (status: User['status']) => {
    switch (status) {
      case 'approved':
        return {
          pill: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
          dot: 'bg-emerald-500',
        };
      case 'pending':
        return {
          pill: 'bg-amber-50/90 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
          dot: 'bg-amber-500',
        };
      case 'inactive':
        return {
          pill: 'bg-rose-50/90 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
          dot: 'bg-rose-500',
        };
      default:
        return {
          pill: 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
        };
    }
  };

  const renderStatusBadge = (status: User['status']) => {
    const styles = getStatusBadgeClasses(status);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11.5px] font-medium capitalize leading-none tracking-[0.01em] ${styles.pill}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {status}
      </span>
    );
  };

  const renderTeacherProfile = (teacher: User) => (
    <button
      type="button"
      onClick={() => setViewingTeacher(teacher)}
      className="group flex items-center gap-3 text-left min-w-0 max-w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
    >
      <Avatar className="h-9 w-9 shrink-0 ring-1 ring-slate-200/80 dark:ring-slate-700">
        {teacher.photoURL ? (
          <GcsImage
            filePath={teacher.photoURL}
            alt={teacher.name || ''}
            width={36}
            height={36}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <AvatarFallback className="bg-primary/[0.07] text-primary text-xs font-semibold uppercase">
            {teacher.name ? teacher.name.charAt(0) : 'T'}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0 flex flex-col">
        <span className="text-[13.5px] font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors truncate">
          {teacher.name}
        </span>
        <span className="text-xs leading-snug text-slate-500 dark:text-slate-400 truncate mt-0.5">
          {teacher.email}
        </span>
      </div>
    </button>
  );

  const renderTeacherActions = (teacher: User) => {
    if (teacher.status === 'pending') {
      return (
        <div className="inline-flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            onClick={() => handleApproveUser(teacher.id)}
            className="h-7 rounded-md px-2.5 text-xs font-medium gap-1 shadow-none"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Approve
          </Button>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => { setSelectedUser(teacher); setActionType('deny'); }}
              className="h-7 rounded-md px-2.5 text-xs font-medium gap-1 shadow-none"
            >
              <XCircle className="h-3.5 w-3.5" />
              Deny
            </Button>
          </AlertDialogTrigger>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Actions"
            className="h-8 w-8 rounded-lg border-0 bg-transparent text-slate-400 shadow-none hover:bg-slate-100 hover:text-slate-700 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 outline-none transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-lg border-slate-200/80 p-1 shadow-md">
          <DropdownMenuItem
            className="rounded-md text-xs font-medium cursor-pointer"
            onSelect={() => { setEditingTeacher(teacher); setIsFormOpen(true); }}
          >
            <Edit className="mr-2 h-3.5 w-3.5 text-slate-500" />
            Edit
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="rounded-md text-xs font-medium cursor-pointer"
              onSelect={(e) => e.preventDefault()}
              onClick={() => { setSelectedUser(teacher); setActionType('toggleStatus'); }}
            >
              {teacher.status === 'approved' ? (
                <UserX className="mr-2 h-3.5 w-3.5 text-slate-500" />
              ) : (
                <UserCheck className="mr-2 h-3.5 w-3.5 text-slate-500" />
              )}
              {teacher.status === 'approved' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="rounded-md text-xs font-medium cursor-pointer"
              onSelect={(e) => e.preventDefault()}
              onClick={() => { setSelectedUser(teacher); setActionType('resetPassword'); }}
            >
              <KeyRound className="mr-2 h-3.5 w-3.5 text-slate-500" />
              Reset Password
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuSeparator className="my-1 bg-slate-100" />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="rounded-md text-xs font-medium text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
              onClick={() => { setSelectedUser(teacher); setActionType('delete'); }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
        <div className="space-y-4">
            <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.02)] dark:border-slate-800 dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b border-slate-100 bg-white px-4 py-3.5 sm:px-6 sm:py-4 dark:border-slate-800/80 dark:bg-card">
                <CardTitle className="text-[17px] sm:text-[18px] font-bold tracking-[-0.015em] text-[#0B1F4B] dark:text-foreground">
                  Teacher Management
                </CardTitle>
                <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => { setEditingTeacher(null); setIsFormOpen(true); }}
                      className="h-8 sm:h-[34px] rounded-lg bg-primary px-3 sm:px-3.5 text-xs font-semibold text-primary-foreground gap-1.5 shadow-[0_1px_2px_rgba(8,32,94,0.16)] hover:bg-primary/90 hover:shadow-[0_2px_6px_rgba(8,32,94,0.2)] active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <UserPlus className="h-3.5 w-3.5 shrink-0" />
                        <span>Add Teacher</span>
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[calc(100vh-190px)] overflow-y-auto">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-[2px] dark:bg-slate-900/80">
                        <TableRow className="border-b border-slate-200/75 hover:bg-transparent dark:border-slate-800">
                            <TableHead className="h-10 w-[38%] pl-6 pr-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Teacher Name</TableHead>
                            <TableHead className="h-10 w-[22%] px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Designation</TableHead>
                            <TableHead className="h-10 w-[16%] px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Experience</TableHead>
                            <TableHead className="h-10 w-[14%] px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Status</TableHead>
                            <TableHead className="h-10 w-[10%] pl-4 pr-6 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loading ? (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                              Loading teachers...
                            </TableCell>
                          </TableRow>
                        ) : teachers.length === 0 ? (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="py-10 text-center text-sm text-slate-500">
                              No teachers found.
                            </TableCell>
                          </TableRow>
                        ) : teachers.map((teacher) => (
                            <TableRow
                              key={teacher.id}
                              className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors dark:border-slate-800/70 dark:hover:bg-slate-800/40"
                            >
                            <TableCell className="py-3.5 pl-6 pr-4">
                              {renderTeacherProfile(teacher)}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-[13.5px] font-medium text-slate-700 dark:text-slate-300">
                              <span className={teacher.designation ? '' : 'text-slate-400 font-normal'}>
                                {teacher.designation || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-[13px] text-slate-600 dark:text-slate-400 tabular-nums">
                              <span className={teacher.experience ? '' : 'text-slate-400'}>
                                {teacher.experience || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="py-3.5 px-4">
                              {renderStatusBadge(teacher.status)}
                            </TableCell>
                            <TableCell className="py-3.5 pl-4 pr-6 text-right">
                              {renderTeacherActions(teacher)}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Compact Card List View */}
                  <div className="md:hidden">
                    {loading ? (
                      <div className="px-4 py-10 text-center text-sm text-slate-500">
                        Loading teachers...
                      </div>
                    ) : teachers.length === 0 ? (
                      <div className="px-4 py-10 text-center text-sm text-slate-500">
                        No teachers found.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                        {teachers.map((teacher) => (
                          <div
                            key={teacher.id}
                            className="px-4 py-3.5 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                {renderTeacherProfile(teacher)}
                              </div>
                              {teacher.status !== 'pending' && (
                                <div className="shrink-0 -mr-1">
                                  {renderTeacherActions(teacher)}
                                </div>
                              )}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-slate-100/80 pt-2.5 dark:border-slate-800/60">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">Designation</span>
                                  <span className={teacher.designation ? 'font-medium text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                                    {teacher.designation || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">Experience</span>
                                  <span className={teacher.experience ? 'font-medium text-slate-600 dark:text-slate-400 tabular-nums' : 'text-slate-400'}>
                                    {teacher.experience || 'N/A'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {renderStatusBadge(teacher.status)}
                              </div>
                            </div>
                            {teacher.status === 'pending' && (
                              <div className="mt-2.5 flex items-center justify-end gap-2 border-t border-slate-100/80 pt-2 dark:border-slate-800/60">
                                {renderTeacherActions(teacher)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
             <DialogContent className="sm:max-w-[430px] p-5 gap-3">
                <DialogHeader className="space-y-0.5">
                    <DialogTitle className="text-base font-bold">Edit Teacher</DialogTitle>
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
            <DialogContent className="sm:max-w-[430px] p-5 gap-3">
                <DialogHeader className="space-y-0.5">
                    <DialogTitle className="text-base font-bold">Add Teacher</DialogTitle>
                </DialogHeader>
                <TeacherForm teacher={null} onSuccess={handleFormSuccess} />
            </DialogContent>
        )}
       </Dialog>
    </AlertDialog>
  );
}
