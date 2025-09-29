
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
import { getAdmins, deleteUser, addAdmin, editAdminProfile, setUserStatus, resetUserPassword } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, Edit, Trash2, MoreVertical, Upload, Phone, Home, Calendar as CalendarIcon, Droplets, KeyRound, UserX, UserCheck, User as UserIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GcsImage } from "@/components/gcs-image";
import { ImageCropper } from "@/components/image-cropper";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  status: 'pending' | 'approved' | 'inactive';
  photoURL?: string;
  phone?: string;
  address?: string;
  dob?: string;
  bloodGroup?: string;
}

const adminSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.date().optional(),
  bloodGroup: z.string().optional(),
});
type AdminFormValues = z.infer<typeof adminSchema>;


const AdminForm = ({ admin, onSuccess }: { admin?: User | null, onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: { 
      name: admin?.name || '', 
      email: admin?.email || '', 
      password: '',
      phone: admin?.phone || '',
      address: admin?.address || '',
      dob: admin?.dob ? new Date(admin.dob) : undefined,
      bloodGroup: admin?.bloodGroup || '',
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
  }

  const onSubmit: SubmitHandler<AdminFormValues> = async (data) => {
    setIsSubmitting(true);
    let result;
    const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if(key !== 'password' && key !== 'email' && value) {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else {
                 formData.append(key, value as string);
            }
        }
      });
      if (croppedPhoto) formData.append('photo', croppedPhoto);
      if (removePhoto) formData.append('removePhoto', 'true');
      
    if (admin) { // Editing
      result = await editAdminProfile(admin.id, formData);
    } else { // Adding
       if (data.password) {
        formData.append('password', data.password);
      }
      formData.append('email', data.email);
      result = await addAdmin(data as z.infer<typeof adminSchema> & { password: string });
    }
    
    if (result.success) {
      toast({
        title: admin ? "Admin Updated" : "Admin Added",
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
                     ) : admin?.photoURL && !removePhoto ? (
                       <GcsImage filePath={admin.photoURL} alt={admin.name || ''} width={80} height={80} className="rounded-full object-cover" />
                     ) : (
                        <AvatarFallback><UserIcon className="h-8 w-8 text-muted-foreground"/></AvatarFallback>
                     )}
                   </Avatar>
                   <div className="flex flex-col gap-2">
                       <Button type="button" onClick={() => document.getElementById('photo-upload')?.click()} variant="outline" size="sm"><Upload className="w-4 h-4 mr-2"/>Change Photo</Button>
                       <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                       {(admin?.photoURL || photoPreview) && !removePhoto && <Button type="button" onClick={handleRemovePhoto} variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Remove</Button>}
                   </div>
                </div>
                <FormMessage />
              </FormItem>

              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="admin@example.com" {...field} disabled={!!admin} /></FormControl><FormMessage /></FormItem> )} />
              {!admin && (
                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
              )}
               <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4"/> Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4"/>Date of Birth</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bloodGroup" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Droplets className="h-4 w-4"/>Blood Group</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel className="flex items-center gap-2"><Home className="h-4 w-4"/>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
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

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'toggleStatus' | 'resetPassword' | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAdmins();
    if (result.success && result.data) {
      setAdmins(result.data as User[]);
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
      case 'delete':
        result = await deleteUser(selectedUser.id);
        break;
      case 'toggleStatus':
        const newStatus = selectedUser.status === 'approved' ? 'inactive' : 'approved';
        result = await setUserStatus(selectedUser.id, newStatus);
        break;
      case 'resetPassword':
        result = await resetUserPassword(selectedUser.email);
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


  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingAdmin(null);
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

  return (
    <AlertDialog>
       <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingAdmin(null);
        setIsFormOpen(isOpen);
       }}>
        <div className="space-y-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Admin Management</CardTitle>
                    <CardDescription>Add, edit, or remove administrators.</CardDescription>
                </div>
                 <DialogTrigger asChild>
                    <Button onClick={() => { setEditingAdmin(null); setIsFormOpen(true); }}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-250px)]">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Admin Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                      ))
                    ) : admins.map((admin) => (
                        <TableRow key={admin.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                           <Avatar>
                             {admin.photoURL ? (
                               <GcsImage filePath={admin.photoURL} alt={admin.name || ''} width={40} height={40} className="rounded-full object-cover"/>
                             ) : (
                               <AvatarFallback>{admin.name ? admin.name.charAt(0) : 'A'}</AvatarFallback>
                             )}
                           </Avatar>
                           <p>{admin.name}</p>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                            <Badge variant={getBadgeVariant(admin.status)} className="capitalize">{admin.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => { setEditingAdmin(admin); setIsFormOpen(true); }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(admin); setActionType('toggleStatus'); }}>
                                        {admin.status === 'approved' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                        {admin.status === 'approved' ? 'Deactivate' : 'Activate'}
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(admin); setActionType('resetPassword'); }}>
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Reset Password
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedUser(admin); setActionType('delete'); }}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                 </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                    {actionType === 'delete' && `This will permanently delete the admin ${selectedUser?.name}. This action cannot be undone.`}
                    {actionType === 'toggleStatus' && `This will ${selectedUser?.status === 'approved' ? 'deactivate' : 'activate'} the account for ${selectedUser?.name}.`}
                    {actionType === 'resetPassword' && `This will send a password reset link to ${selectedUser?.email}.`}
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
                <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                <DialogDescription>
                    {editingAdmin ? "Update the details for this admin." : "Fill in the details to create a new admin account."}
                </DialogDescription>
            </DialogHeader>
            <AdminForm admin={editingAdmin} onSuccess={handleFormSuccess} />
        </DialogContent>
       </Dialog>
    </AlertDialog>
  );
}
