
'use client';

import { useEffect, useState } from 'react';
import { getStudentEnquiries } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Enquiry {
  id: string;
  studentName: string;
  guardianName: string;
  classCourse: string;
  mobile: string;
  email: string;
  state: string;
  message: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      const result = await getStudentEnquiries();
      if (result.success && result.data) {
        setEnquiries(result.data as Enquiry[]);
      }
      setLoading(false);
    };
    fetchEnquiries();
  }, []);

  const renderSkeleton = () => (
     [...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16" /></TableCell>
        </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Enquiries</CardTitle>
        <CardDescription>Recent enquiries from students and parents.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Class/Course</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : enquiries.length > 0 ? (
                  enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell className="font-medium">{enquiry.studentName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-xs">{enquiry.email || 'N/A'}</div>
                        <div className="text-xs">{enquiry.mobile}</div>
                      </TableCell>
                       <TableCell className="hidden md:table-cell">{enquiry.classCourse}</TableCell>
                      <TableCell className="hidden lg:table-cell">{enquiry.createdAt ? format(new Date(enquiry.createdAt), 'PPp') : 'N/A'}</TableCell>
                      <TableCell>
                        {enquiry.message ? (
                             <Accordion type="single" collapsible className="w-full max-w-[200px]">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="p-0 hover:no-underline">View</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="whitespace-pre-wrap">{enquiry.message}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ) : 'No message'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground h-48">
                      No student enquiries yet.
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
