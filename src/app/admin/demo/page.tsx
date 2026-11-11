
'use client';

import { useEffect, useState } from 'react';
import { getSessionBookings, markAllBookingsAsSeen } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { getBranchDisplayName, normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';

interface Booking {
  id: string;
  studentName: string;
  classCourse: string;
  email: string;
  countryCode?: string;
  mobile: string;
  sessionMode: 'online' | 'offline';
  state: string;
  branch?: string;
  branchId?: string;
  branchName?: string;
  createdAt: string;
  status?: 'new' | 'seen';
}

export default function AdminDemoPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? normalizedBranchId : null;
  const branchDisplayName = isBranchAdmin
    ? user?.branchName || getBranchDisplayName(branchAdminBranchId, true)
    : null;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNewBookings, setHasNewBookings] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    const scopeArg = isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined;
    const result = await getSessionBookings(scopeArg);
    if (result.success && result.data) {
      const rawBookings = result.data as Booking[];
      const bookingsData =
        isBranchAdmin && branchAdminBranchId
          ? rawBookings.filter((item) => recordMatchesBranch(item as any, branchAdminBranchId))
          : rawBookings;
      setBookings(bookingsData);
      setHasNewBookings(bookingsData.some(b => b.status === 'new'));
    } else {
      setBookings([]);
      setHasNewBookings(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchBookings();
    }
  }, [authLoading, user?.uid, branchAdminBranchId]);

  const handleMarkAllAsSeen = async () => {
    const scopeArg = isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined;
    const result = await markAllBookingsAsSeen(scopeArg);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchBookings(); // Refresh the list
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <div>
       <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>
                Free Demo Bookings
                {branchDisplayName && (
                  <span className="ml-2 inline-flex items-center rounded-md border border-[#E5EAF2] bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-semibold text-[#2864E8] align-middle">
                    {branchDisplayName}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {branchDisplayName
                  ? `Showing free demo bookings registered for ${branchDisplayName}.`
                  : 'Recent submissions from the landing page form.'}
              </CardDescription>
            </div>
            {hasNewBookings && (
              <Button size="sm" onClick={handleMarkAllAsSeen}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as seen
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="h-[calc(100vh-280px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Class/Course</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden lg:table-cell">Mode</TableHead>
                        <TableHead className="hidden xl:table-cell">State</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? renderSkeleton() : bookings.length > 0 ? (
                        bookings.map((booking) => (
                          <TableRow key={booking.id} className={booking.status === 'new' ? 'bg-primary/5' : ''}>
                            <TableCell className="font-medium">{booking.studentName}</TableCell>
                            <TableCell className="hidden sm:table-cell">{booking.classCourse}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>{booking.email}</div>
                              <div>{booking.countryCode?.split('-')[0]} {booking.mobile}</div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge variant={booking.sessionMode === 'online' ? 'default' : 'secondary'}>
                                {booking.sessionMode}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">{booking.state}</TableCell>
                            <TableCell>{booking.createdAt ? format(new Date(booking.createdAt), 'PPp') : 'N/A'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground h-48">
                            No session bookings yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
    </div>
  );
}
