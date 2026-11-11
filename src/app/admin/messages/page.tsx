
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
import { useAuth } from '@/context/auth-context';
import { getBranchDisplayName, normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';

interface Submission {
  id: string;
  name: string;
  email: string;
  country?: string;
  countryCode?: string;
  phone: string;
  state: string;
  branch?: string;
  branchId?: string;
  branchName?: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? normalizedBranchId : null;
  const branchDisplayName = isBranchAdmin
    ? user?.branchName || getBranchDisplayName(branchAdminBranchId, true)
    : null;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    const fetchSubmissions = async () => {
      setLoading(true);
      const scopeArg = isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined;
      const result = await getContactSubmissions(scopeArg);
      if (result.success && result.data) {
        const list = result.data as Submission[];
        setSubmissions(
          isBranchAdmin && branchAdminBranchId
            ? list.filter((item) => recordMatchesBranch(item as any, branchAdminBranchId))
            : list
        );
      } else {
        setSubmissions([]);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [authLoading, user?.uid, isBranchAdmin, branchAdminBranchId]);

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
        <CardTitle>
          Contact Form Submissions
          {branchDisplayName && (
            <span className="ml-2 inline-flex items-center rounded-md border border-[#E5EAF2] bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-semibold text-[#2864E8] align-middle">
              {branchDisplayName}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {branchDisplayName
            ? `Showing contact enquiries submitted for ${branchDisplayName}.`
            : 'Recent messages from the contact us page.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-xs">{submission.email || 'N/A'}</div>
                        <div className="text-xs">
                          {submission.countryCode ? `${submission.countryCode.split('-')[0]} ` : ''}
                          {submission.phone}
                        </div>
                      </TableCell>
                       <TableCell className="hidden md:table-cell">
                        <div className="text-xs">{submission.state || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{submission.country || ''}</div>
                       </TableCell>
                      <TableCell className="hidden lg:table-cell">{submission.createdAt ? format(new Date(submission.createdAt), 'PPp') : 'N/A'}</TableCell>
                      <TableCell>
                        {submission.message ? (
                             <Accordion type="single" collapsible className="w-full max-w-[200px]">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="p-0 hover:no-underline">View</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="whitespace-pre-wrap">{submission.message}</p>
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
                      No contact form submissions yet.
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
