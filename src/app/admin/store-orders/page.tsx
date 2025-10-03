
'use client';

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, MoreVertical, XCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreOrders, updateOrderStatus } from "@/app/actions/store";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Order {
    id: string;
    userName: string;
    userMobile: string;
    items: { title: string, quantity: number, price: number }[];
    totalAmount: number;
    paymentId: string;
    createdAt: any;
    status: 'processing' | 'delivered' | 'cancelled';
}

const getBadgeVariant = (status: Order['status']) => {
    switch (status) {
        case 'processing':
            return 'secondary';
        case 'delivered':
            return 'default';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
};

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [action, setAction] = useState<'deliver' | 'cancel' | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getStoreOrders();
    if (result.success && result.data) {
      setOrders(result.data.map((d: any) => ({ ...d, createdAt: d.createdAt ? new Date(d.createdAt) : new Date() })));
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch orders.' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [toast]);
  
  const handleAction = async () => {
    if (!selectedOrder || !action) return;
    
    const newStatus = action === 'deliver' ? 'delivered' : 'cancelled';
    const result = await updateOrderStatus(selectedOrder.id, newStatus);
    
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      fetchOrders();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }

    setSelectedOrder(null);
    setAction(null);
  };

  const renderSkeleton = () => [...Array(5)].map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
    </TableRow>
  ));
  
  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Store Orders</CardTitle>
          <CardDescription>View and manage all orders from the IDL Store.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.userName}</div>
                      <div className="text-xs text-muted-foreground">{order.userMobile}</div>
                    </TableCell>
                    <TableCell>{format(order.createdAt, 'PPp')}</TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(order.status)} className="capitalize">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {order.status === 'processing' && (
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedOrder(order); setAction('deliver'); }}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                        Mark as Delivered
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => { setSelectedOrder(order); setAction('cancel'); }} className="text-destructive">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Order
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                         </DropdownMenu>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
       <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'deliver' && `This will mark order ${selectedOrder?.id} as delivered.`}
              {action === 'cancel' && `This will cancel order ${selectedOrder?.id}. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setSelectedOrder(null); setAction(null); }}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
