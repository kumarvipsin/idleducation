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
import { UserPlus, Users, Mail, Phone, Calendar, User, Home, Key } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signUpUser } from "@/app/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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
    photoUrl?: string;
}


// Mock data for now
const initialStaff: StaffMember[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'staff', staffId: 'S001', contact: '9876543210', dob: '1990-05-15', guardianName: 'Robert Johnson', address: '123 Tech Park, Bangalore' },
    { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', role: 'staff', staffId: 'S002', contact: '8765432109', dob: '1988-11-22', guardianName: 'David Williams', address: '456 IT Hub, Pune' },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [previewStaff, setPreviewStaff] = useState<StaffMember | null>(null);
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
    // The extra details would be saved in a separate firestore call.
    const result = await signUpUser({ name: data.name, email: data.email, password: data.password, role: 'teacher' }); // Using 'teacher' role as a placeholder for staff

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

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <div className="space-y-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>Add, view, and manage your staff members.</CardDescription>
                </div>
                 <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Staff
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Staff ID</TableHead>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Father/Guardian</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staff.map((member) => (
                    <TableRow key={member.id} onClick={() => setPreviewStaff(member)} className="cursor-pointer">
                        <TableCell>{member.staffId}</TableCell>
                        <TableCell className="font-medium flex items-center gap-2"><Users className="h-4 w-4"/> {member.name}</TableCell>
                        <TableCell>{member.guardianName}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.contact}</TableCell>
                        <TableCell>{member.dob}</TableCell>
                        <TableCell>{member.address}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{member.role}</Badge></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            </Card>
        </div>

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

        <Dialog open={!!previewStaff} onOpenChange={(isOpen) => !isOpen && setPreviewStaff(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Staff Details</DialogTitle>
                </DialogHeader>
                {previewStaff && (
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <Avatar className="h-24 w-24 border-4 border-primary shadow-lg">
                            <AvatarImage src={previewStaff.photoUrl} alt={previewStaff.name} data-ai-hint="professional headshot" />
                            <AvatarFallback className="text-3xl">
                                {previewStaff.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold text-center">{previewStaff.name}</h3>
                            <p className="text-sm text-muted-foreground text-center capitalize">{previewStaff.role}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center gap-2"><Key className="h-4 w-4 text-muted-foreground" /> <strong>Staff ID:</strong> {previewStaff.staffId}</div>
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> <strong>Email:</strong> {previewStaff.email}</div>
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> <strong>Contact:</strong> {previewStaff.contact}</div>
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> <strong>D.O.B:</strong> {previewStaff.dob}</div>
                        <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> <strong>Guardian:</strong> {previewStaff.guardianName}</div>
                        <div className="flex items-start gap-2"><Home className="h-4 w-4 text-muted-foreground mt-1" /> <strong>Address:</strong> <span className="flex-1">{previewStaff.address}</span></div>
                    </div>
                </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setPreviewStaff(null)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Dialog>
  );
}
