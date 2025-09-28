
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
import { getAdmins, deleteUser, addAdmin, editAdminProfile } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, Edit, Trash2, MoreVertical } from "lucide-react";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  photoURL?: string;
}

const adminSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.date().optional(),
  bloodGroup: z.string().optional(),
});
type AdminFormValues = z.infer<typeof adminSchema>;


const AdminForm = ({ admin, onSuccess }: { admin?: User | null, onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: { 
      name: admin?.name || '', 
      email: admin?.email || '', 
      password: '',
    },
  });

  const onSubmit: SubmitHandler<AdminFormValues> = async (data) => {
    setIsSubmitting(true);
    let result;
    if (admin) { // Editing
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if(key !== 'password' && key !== 'email' && value) {
            formData.append(key, value instanceof Date ? value.toISOString() : value);
        }
      });
      result = await editAdminProfile(admin.id, formData);
    } else { // Adding
      result = await addAdmin(data);
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="admin@example.com" {...field} disabled={!!admin} /></FormControl><FormMessage /></FormItem> )} />
              {!admin && (
                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
  )
}

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'delete' | null>(null);
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const result = await deleteUser(selectedUser.id);
     if (result.success) {
        toast({ title: "Success", description: "Admin deleted successfully." });
        fetchUsers();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message || "Could not delete admin." });
    }
    setSelectedUser(null);
    setActionType(null);
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingAdmin(null);
    fetchUsers();
  }

  return (
    <AlertDialog>
       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
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
                      This will permanently delete the admin <span className="font-semibold">{selectedUser?.name}</span>. This action cannot be undone.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => { setSelectedUser(null); setActionType(null); }}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>
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
