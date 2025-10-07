'use client';

import { useEffect, useState } from 'react';
import { getDonations } from '@/app/actions/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { IndianRupee } from 'lucide-react';

interface Donation {
  id: string;
  name?: string;
  email?: string;
  contact?: string;
  place?: string;
  amount: number;
  category: string;
  paymentId: string;
  createdAt: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      const result = await getDonations();
      if (result.success && result.data) {
        setDonations(result.data as Donation[]);
      }
      setLoading(false);
    };
    fetchDonations();
  }, []);

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foundation Donations</CardTitle>
        <CardDescription>A record of all donations made to the IDL Foundation.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-220px)] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Donor Information</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Payment ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? renderSkeleton() : donations.length > 0 ? (
                donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.createdAt ? format(new Date(donation.createdAt), 'PPp') : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="font-medium">{donation.name || 'Anonymous'}</div>
                      <div className="text-xs text-muted-foreground">{donation.email}</div>
                      <div className="text-xs text-muted-foreground">{donation.contact}</div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{donation.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{donation.category}</TableCell>
                    <TableCell>{donation.place || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-xs">{donation.paymentId}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-48">
                    No donations have been recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
