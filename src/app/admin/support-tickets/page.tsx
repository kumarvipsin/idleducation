
'use client';

import { useEffect, useState } from 'react';
import { getSupportTickets } from '@/app/actions';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  ticketId?: string;
  studentName: string;
  email: string;
  problem: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
}

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const result = await getSupportTickets();
      if (result.success && result.data) {
        setTickets(result.data as SupportTicket[]);
      }
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
        description: `Ticket ID: ${text}`,
    });
  };

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

  const getBadgeVariant = (status: SupportTicket['status']) => {
    switch (status) {
        case 'new': return 'destructive';
        case 'in-progress': return 'secondary';
        case 'resolved': return 'default';
        default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>View and manage all student support tickets.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-220px)] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Problem Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? renderSkeleton() : tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-xs">
                        {ticket.ticketId ? (
                             <div className="flex items-center gap-2">
                                <span>{ticket.ticketId.split('-')[0]}-...{ticket.ticketId.slice(-4)}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyToClipboard(ticket.ticketId!)}>
                                    <Clipboard className="h-3 w-3" />
                                </Button>
                             </div>
                        ) : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{ticket.studentName}</TableCell>
                    <TableCell>{ticket.email}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(ticket.status)} className="capitalize">
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.createdAt ? format(new Date(ticket.createdAt), 'PPp') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {ticket.problem ? (
                           <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                  <AccordionTrigger className="p-0">View</AccordionTrigger>
                                  <AccordionContent>
                                      {ticket.problem}
                                  </AccordionContent>
                              </AccordionItem>
                          </Accordion>
                      ) : 'No description'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No support tickets have been submitted yet.
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
