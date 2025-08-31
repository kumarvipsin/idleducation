
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signUpUser } from "@/app/actions";

const staffSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type StaffFormValues = z.infer<typeof staffSchema>;

// Mock data for now
const initialStaff = [
    { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'staff' },
    { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', role: 'staff' },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit: SubmitHandler<StaffFormValues> = async (data) => {
    // In a real app, you would call a server action to add the staff member
    // For now, we'll just add to the local state for demonstration
    const newStaffMember = {
        id: (staff.length + 1).toString(),
        name: data.name,
        email: data.email,
        role: 'staff' as const,
    };
    
    // Simulating API call
    const result = await signUpUser({ ...data, role: 'teacher' });

    if (result.success) {
      toast({
        title: "Staff Added",
        description: `${data.name} has been added to the staff.`,
      });
      setStaff(prev => [...prev, newStaffMember]);
      form.reset();
      setIsDialogOpen(false);
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result.message || "Could not add staff member.",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {staff.map((member) => (
                    <TableRow key={member.id}>
                        <TableCell className="font-medium flex items-center gap-2"><Users className="h-4 w-4"/> {member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell className="capitalize">{member.role}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </div>

        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new staff member to the platform.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                    <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                           {form.formState.isSubmitting ? 'Adding...' : 'Add Staff Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
