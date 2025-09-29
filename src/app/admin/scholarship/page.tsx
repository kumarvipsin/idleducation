
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
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="h-[calc(100vh-220px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Guardian Name</TableHead>
                    <TableHead className="hidden md:table-cell">Class</TableHead>
                    <TableHead className="hidden lg:table-cell">Mobile</TableHead>
                    <TableHead className="hidden xl:table-cell">State</TableHead>
                    <TableHead>Submission Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? renderSkeleton() : registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.studentName}</TableCell>
                        <TableCell className="hidden sm:table-cell">{reg.guardianName}</TableCell>
                        <TableCell className="hidden md:table-cell">{reg.class}</TableCell>
                        <TableCell className="hidden lg:table-cell">{reg.mobile}</TableCell>
                        <TableCell className="hidden xl:table-cell">{reg.state || 'N/A'}</TableCell>
                        <TableCell>
                          {reg.createdAt ? format(new Date(reg.createdAt), 'PPp') : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground h-48">
                        No scholarship registrations have been submitted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
  );
}
