
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getStudentEnquiries } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Enquiry {
  id: string;
  studentName: string;
  guardianName: string;
  classCourse: string;
  mobile: string;
  email: string;
  state: string;
  branch?: string;
  message: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? normalizedBranchId : null;

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>(branchAdminBranchId || 'all');

  useEffect(() => {
    if (isBranchAdmin && branchAdminBranchId && selectedBranch !== branchAdminBranchId) {
      setSelectedBranch(branchAdminBranchId);
    }
  }, [isBranchAdmin, branchAdminBranchId]);

  useEffect(() => {
    if (authLoading || !user) return;
    const fetchEnquiries = async () => {
      setLoading(true);
      const result = await getStudentEnquiries(isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined);
      if (result.success && result.data) {
        setEnquiries(result.data as Enquiry[]);
      }
      setLoading(false);
    };
    fetchEnquiries();
  }, [authLoading, user?.uid, isBranchAdmin, branchAdminBranchId]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(item => {
      const targetBranch = isBranchAdmin ? branchAdminBranchId : selectedBranch;
      if (!targetBranch || targetBranch === 'all') return true;
      return recordMatchesBranch(item, targetBranch);
    });
  }, [enquiries, isBranchAdmin, branchAdminBranchId, selectedBranch]);

  const renderSkeleton = () => (
     [...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16" /></TableCell>
        </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Student Enquiries</CardTitle>
            {isBranchAdmin && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-600" />
                {user?.branchName || 'Mangol Puri Branch'}
              </span>
            )}
          </div>
          <CardDescription className="mt-1">
            {isBranchAdmin
              ? `Showing enquiries received for ${user?.branchName || 'Mangol Puri'}.`
              : 'Recent student & parent enquiries across all branches.'}
          </CardDescription>
        </div>
        {!isBranchAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-medium">Branch:</span>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="text-xs border rounded-md px-2.5 py-1.5 bg-background font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">🌐 All Branches</option>
              <option value="mangolpuri">🏢 Mangol Puri</option>
              <option value="budh-vihar">🏢 Budh Vihar</option>
              <option value="krishan-vihar">🏢 Krishan Vihar</option>
              <option value="mukherjee-nagar">🏢 Mukherjee Nagar</option>
            </select>
          </div>
        )}
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
                  <TableHead>Branch</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell className="font-medium">{enquiry.studentName}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-xs">{enquiry.email || 'N/A'}</div>
                        <div className="text-xs font-mono">{enquiry.mobile}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{enquiry.classCourse}</TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {enquiry.branch || '—'}
                        </span>
                      </TableCell>
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
                    <TableCell colSpan={6} className="text-center text-muted-foreground h-48">
                      No student enquiries found for this branch.
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
