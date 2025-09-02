
'use client';

import { useEffect, useState } from 'react';
import { getAdmissions } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Admission {
  id: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  classApplied: string;
  previousSchool?: string;
  additionalInfo?: string;
  createdAt: string;
}

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      const result = await getAdmissions();
      if (result.success && result.data) {
        setAdmissions(result.data as Admission[]);
      }
      setLoading(false);
    };
    fetchAdmissions();
  }, []);

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
        <TableRow key={i}>
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
        <CardTitle>Admission Submissions</CardTitle>
        <CardDescription>All submitted admission forms from students.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-220px)] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Submission Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? renderSkeleton() : admissions.length > 0 ? (
                admissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell className="font-mono">{admission.studentId}</TableCell>
                    <TableCell className="font-medium">{admission.studentName}</TableCell>
                    <TableCell>{admission.classApplied}</TableCell>
                    <TableCell>
                      <div>{admission.email}</div>
                      <div>{admission.phone}</div>
                    </TableCell>
                    <TableCell>
                      {admission.createdAt ? format(new Date(admission.createdAt), 'PPp') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No admission forms have been submitted yet.
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
