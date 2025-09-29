
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

interface Booking {
  id: string;
  studentName: string;
  classCourse: string;
  email: string;
  countryCode?: string;
  mobile: string;
  sessionMode: 'online' | 'offline';
  state: string;
  createdAt: string;
  status?: 'new' | 'seen';
}

export default function AdminDemoPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNewBookings, setHasNewBookings] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getSessionBookings();
    if (result.success && result.data) {
      const bookingsData = result.data as Booking[];
      setBookings(bookingsData);
      setHasNewBookings(bookingsData.some(b => b.status === 'new'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleMarkAllAsSeen = async () => {
    const result = await markAllBookingsAsSeen();
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
              <CardTitle>Free Demo Bookings</CardTitle>
              <CardDescription>Recent submissions from the landing page form.</CardDescription>
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
