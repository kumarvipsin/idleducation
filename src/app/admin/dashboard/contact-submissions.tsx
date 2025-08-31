
'use client';

import { useEffect, useState } from 'react';
import { getContactSubmissions } from '@/app/actions';
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

interface Submission {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  state: string;
  message: string;
  createdAt: string;
}

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const result = await getContactSubmissions();
      if (result.success && result.data) {
        setSubmissions(result.data as Submission[]);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, []);

  const renderSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
        <CardDescription>Recent messages from the contact us page.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] w-full">
          {loading ? renderSkeleton() : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>
                        <div>{submission.email}</div>
                        <div>{submission.countryCode.split('-')[0]} {submission.phone}</div>
                      </TableCell>
                       <TableCell>{submission.state}</TableCell>
                      <TableCell>{submission.createdAt ? format(new Date(submission.createdAt), 'PPp') : 'N/A'}</TableCell>
                      <TableCell>
                        {submission.message ? (
                             <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="p-0">View</AccordionTrigger>
                                    <AccordionContent>
                                        {submission.message}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ) : 'No message'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No contact form submissions yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
