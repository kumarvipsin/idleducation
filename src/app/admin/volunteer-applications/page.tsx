'use client';

import { useEffect, useState } from 'react';
import { getVolunteerApplications } from '@/app/actions/data';
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
} from "@/components/ui/accordion";

interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  availability: string;
  reason: string;
  createdAt: string;
}

export default function AdminVolunteerApplicationsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const result = await getVolunteerApplications();
      if (result.success && result.data) {
        setApplications(result.data as VolunteerApplication[]);
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  const renderSkeleton = () => (
     [...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16" /></TableCell>
        </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volunteer Applications</CardTitle>
        <CardDescription>Recent applications from prospective volunteers.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Availability</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-xs">{app.email}</div>
                        <div className="text-xs">{app.phone}</div>
                      </TableCell>
                       <TableCell className="hidden md:table-cell">{app.availability}</TableCell>
                      <TableCell className="hidden lg:table-cell">{app.createdAt ? format(new Date(app.createdAt), 'PPp') : 'N/A'}</TableCell>
                      <TableCell>
                        {app.reason ? (
                             <Accordion type="single" collapsible className="w-full max-w-[200px]">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="p-0 hover:no-underline">View</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="whitespace-pre-wrap">{app.reason}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ) : 'No reason provided'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground h-48">
                      No volunteer applications yet.
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
