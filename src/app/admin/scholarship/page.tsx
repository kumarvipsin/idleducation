
'use client';

import { useEffect, useState } from 'react';
import { getScholarshipRegistrations } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Registration {
  id: string;
  studentName: string;
  guardianName: string;
  class: string;
  mobile: string;
  state?: string;
  createdAt: string;
}

export default function AdminScholarshipPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      const result = await getScholarshipRegistrations();
      if (result.success && result.data) {
        setRegistrations(result.data as Registration[]);
      }
      setLoading(false);
    };
    fetchRegistrations();
  }, []);

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        </TableRow>
    ))
  );

  return (
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Registrations</CardTitle>
          <CardDescription>All scholarship form submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-220px)] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Guardian Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Submission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.studentName}</TableCell>
                      <TableCell>{reg.guardianName}</TableCell>
                      <TableCell>{reg.class}</TableCell>
                      <TableCell>{reg.mobile}</TableCell>
                      <TableCell>{reg.state || 'N/A'}</TableCell>
                      <TableCell>
                        {reg.createdAt ? format(new Date(reg.createdAt), 'PPp') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No scholarship registrations have been submitted yet.
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
