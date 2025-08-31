
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
  childName: string;
  classCourse: string;
  email: string;
  mobile: string;
  sessionMode: 'online' | 'offline';
  state: string;
  createdAt: string;
  status?: 'new' | 'seen';
}

export function SessionBookings() {
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
        <ScrollArea className="h-[350px] w-full">
          {loading ? renderSkeleton() : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class/Course</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id} className={booking.status === 'new' ? 'bg-primary/5' : ''}>
                      <TableCell className="font-medium">{booking.childName}</TableCell>
                      <TableCell>{booking.classCourse}</TableCell>
                      <TableCell>
                        <div>{booking.email}</div>
                        <div>{booking.mobile}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.sessionMode === 'online' ? 'default' : 'secondary'}>
                          {booking.sessionMode}
                        </Badge>
                      </TableCell>
                       <TableCell>{booking.state}</TableCell>
                      <TableCell>{booking.createdAt ? format(new Date(booking.createdAt), 'PPp') : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No session bookings yet.
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
