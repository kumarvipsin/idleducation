
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Mail, Phone, Calendar, User as UserIcon, Home, KeyRound, Trash2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signUpUser, deleteUser } from "@/app/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { GcsImage } from "@/components/gcs-image";

const staffSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  staffId: z.string().min(1, { message: "Staff ID is required." }),
  contact: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  dob: z.string().min(1, { message: "Date of Birth is required." }),
  guardianName: z.string().min(2, { message: "Guardian name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'staff';
    staffId: string;
    contact: string;
    dob: string;
    guardianName: string;
    address: string;
    photoURL?: string;
}


// Mock data for now
const initialStaff: StaffMember[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'staff', staffId: 'S001', contact: '9876543210', dob: '1990-05-15', guardianName: 'Robert Johnson', address: '123 Tech Park, Bangalore' },
    { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', role: 'staff', staffId: 'S002', contact: '8765432109', dob: '1988-11-22', guardianName: 'David Williams', address: '456 IT Hub, Pune' },
];

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => (
    <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-sm">{value || 'Not provided'}</p>
        </div>
    </div>
);

export default function AdminStaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { name: '', email: '', password: '', staffId: '', contact: '', dob: '', guardianName: '', address: '' },
  });

  const onSubmit: SubmitHandler<StaffFormValues> = async (data) => {
    // In a real app, you would call a server action to add the staff member
    // and store all the details in Firestore.
    const newStaffMember: StaffMember = {
        id: (staff.length + 1).toString(),
        role: 'staff' as const,
        ...data
    };
    
    // Simulating API call for user creation. 
    // NOTE: For now, we are using the 'teacher' role as a placeholder for staff in the signUpUser function.
    const result = await signUpUser({ name: data.name, email: data.email, password: data.password, role: 'teacher' }); 

    if (result.success) {
      toast({
        title: "Staff Added",
        description: `${data.name} has been added to the staff.`,
      });
      setStaff(prev => [...prev, newStaffMember]);
      form.reset();
      setIsAddDialogOpen(false);
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result.message || "Could not add staff member.",
      });
    }
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaff) return;
    
    // In a real app, you would also need to delete from Firebase auth, which requires an admin SDK on the backend.
    // For now we simulate deletion and remove from local state.
    const result = await deleteUser(deletingStaff.id);
    
    if (result.success) {
        toast({ title: "Staff Deleted", description: `${deletingStaff.name} has been removed.` });
        setStaff(prev => prev.filter(s => s.id !== deletingStaff.id));
    } else {
         toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Could not delete staff member.",
        });
    }
    setDeletingStaff(null);
  };

  return (
    <AlertDialog>
    <Dialog open={isAddDialogOpen || !!viewingStaff} onOpenChange={(isOpen) => {
        if (!isOpen) {
            setIsAddDialogOpen(false);
            setViewingStaff(null);
        }
    }}>
        <div className="space-y-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Add, view, and manage your staff members.</CardDescription>
                </div>
                 <DialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Staff
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Staff ID</TableHead>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staff.map((member) => (
                    <TableRow key={member.id} >
                        <TableCell>{member.staffId}</TableCell>
                        <TableCell onClick={() => setViewingStaff(member)} className="cursor-pointer font-medium flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <GcsImage filePath={member.photoURL ?? ''} alt={member.name} width={32} height={32} />
                                <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {member.name}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.contact}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{member.role}</Badge></TableCell>
                        <TableCell className="text-right">
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingStaff(member)}>
                                    <Trash2 className="h-4 w-4" />
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
        </div>
        {!isAddDialogOpen && viewingStaff && (
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Staff Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-md">
                          {viewingStaff.photoURL ? <GcsImage filePath={viewingStaff.photoURL} alt={viewingStaff.name} fill className="rounded-full object-cover"/> : <AvatarFallback className="text-2xl">{viewingStaff.name.charAt(0)}</AvatarFallback>}
                      </Avatar>
                      <div>
                          <h3 className="text-lg font-bold text-center">{viewingStaff.name}</h3>
                          <p className="text-xs text-muted-foreground text-center capitalize">{viewingStaff.role}</p>
                      </div>
                  </div>
                    <div className="grid grid-cols-1 gap-3 text-sm pt-4 border-t">
                      <DetailItem icon={<KeyRound size={16}/>} label="Staff ID" value={viewingStaff.staffId} />
                      <DetailItem icon={<Mail size={16}/>} label="Email" value={viewingStaff.email} />
                      <DetailItem icon={<Phone size={16}/>} label="Contact" value={viewingStaff.contact} />
                      <DetailItem icon={<Calendar size={16}/>} label="Date of Birth" value={viewingStaff.dob} />
                      <DetailItem icon={<UserIcon size={16}/>} label="Guardian Name" value={viewingStaff.guardianName} />
                      <DetailItem icon={<Home size={16}/>} label="Address" value={viewingStaff.address} />
                    </div>
              </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewingStaff(null)}>Close</Button>
              </DialogFooter>
          </DialogContent>
        )}
        {isAddDialogOpen && !viewingStaff && (
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new staff member to the platform.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <ScrollArea className="h-96 w-full pr-4">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="staffId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Staff ID</FormLabel>
                                    <FormControl>
                                    <Input placeholder="S003" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="staff@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                    <Input type="tel" placeholder="9999988888" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                    <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="guardianName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Father/Guardian Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Robert Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                    <Input placeholder="123 Main St, Anytown" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? 'Adding...' : 'Add Staff Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
        )}
         <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action will permanently delete the staff member <span className="font-semibold">{deletingStaff?.name}</span>. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingStaff(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteStaff} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </Dialog>
    </AlertDialog>
  );
}
