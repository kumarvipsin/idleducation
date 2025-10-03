
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
import { getStoreCustomers, resetStoreUserPassword } from "@/app/actions/store-auth";
import { format } from "date-fns";
import { KeyRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface StoreCustomer {
  id: string;
  name: string;
  mobile: string;
  createdAt: string;
}

export default function StoreCustomersPage() {
  const [customers, setCustomers] = useState<StoreCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<StoreCustomer | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCustomers() {
      const result = await getStoreCustomers();
      if (result.success && result.data) {
        setCustomers(result.data);
      }
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  const handleResetPassword = async () => {
    if (!selectedCustomer || !newPassword) {
        toast({ variant: "destructive", title: "Error", description: "Please enter a new password." });
        return;
    }
    setIsSubmitting(true);
    const result = await resetStoreUserPassword(selectedCustomer.id, newPassword);

    if (result.success) {
        toast({ title: "Success", description: "Password has been reset successfully." });
        setIsDialogOpen(false);
        setNewPassword('');
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSubmitting(false);
  };
  
  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Store Customers</CardTitle>
          <CardDescription>
            List of all customers registered through the IDL Store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                renderSkeleton()
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.mobile}</TableCell>
                    <TableCell>
                      {customer.createdAt ? format(new Date(customer.createdAt), "PPp") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                       <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => {setSelectedCustomer(customer); setNewPassword('');}}>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Reset Password
                          </Button>
                       </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No store customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
                Enter a new password for <span className="font-semibold">{selectedCustomer?.name}</span> ({selectedCustomer?.mobile}).
            </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
