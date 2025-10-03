
'use client';

import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, MoreVertical, XCircle, FileText, User, MapPin } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreOrders, updateOrderStatus } from "@/app/actions/store";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GcsImage } from "@/components/gcs-image";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  author: string;
  class: string;
  subject: string;
  edition: string;
}

interface Order {
  id: string;
  orderId: string;
  userName: string;
  userMobile: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentId: string;
  createdAt: any;
  status: 'processing' | 'delivered' | 'cancelled';
  deliveredAt?: any;
  cancelledAt?: any;
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
  }, []);
  
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

  const groupedOrders = useMemo(() => {
    return orders.reduce((acc, order) => {
        const key = `${order.userName}-${order.userMobile}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {} as { [key: string]: Order[] });
  }, [orders]);

  const renderSkeleton = () => [...Array(3)].map((_, i) => (
    <div key={i} className="p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
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
            {loading ? renderSkeleton() : Object.keys(groupedOrders).length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">No orders found.</div>
            ) : (
                <Accordion type="multiple" className="space-y-4">
                {Object.entries(groupedOrders).map(([key, userOrders], index) => (
                    <AccordionItem value={`user-${index}`} key={key} className="border rounded-lg bg-muted/30">
                        <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-primary" />
                                <div>
                                    <p>{userOrders[0].userName}</p>
                                    <p className="text-xs font-normal text-muted-foreground">{userOrders[0].userMobile}</p>
                                </div>
                                <Badge variant="secondary" className="ml-2">{userOrders.length} {userOrders.length > 1 ? 'Orders' : 'Order'}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <div className="overflow-x-auto">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Shipping Address</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                                        <TableCell className="text-xs max-w-[200px] whitespace-normal">
                                            <div className="flex items-start gap-1.5">
                                                <MapPin className="h-3 w-3 mt-0.5 shrink-0"/>
                                                <span>{order.shippingAddress}</span>
                                            </div>
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
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
       <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'deliver' && `This will mark order ${selectedOrder?.orderId} as delivered.`}
              {action === 'cancel' && `This will cancel order ${selectedOrder?.orderId}. This action cannot be undone.`}
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
