
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingBag, FileText, Truck, XCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { StoreHeader } from "@/app/store/page";
import { useStoreAuth } from "@/context/store-auth-context";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { GcsImage } from "@/components/gcs-image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  items: OrderItem[];
  totalAmount: number;
  paymentId: string;
  createdAt: any;
  status: 'processing' | 'delivered' | 'cancelled';
  deliveredAt?: any;
  cancelledAt?: any;
}

const getStatusBadge = (status: Order['status']) => {
    switch (status) {
        case 'processing':
            return <Badge variant="secondary">Processing</Badge>;
        case 'delivered':
            return <Badge variant="default">Delivered</Badge>;
        case 'cancelled':
            return <Badge variant="destructive">Cancelled</Badge>;
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
};

const StatusFooter = ({ order }: { order: Order }) => {
    switch (order.status) {
        case 'processing':
            return (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4"/>
                    <span>Estimated delivery within 7-10 working days.</span>
                </div>
            );
        case 'delivered':
            return (
                 <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4"/>
                    <span>Delivered on {order.deliveredAt ? format(order.deliveredAt.toDate(), 'PPP') : 'N/A'}</span>
                </div>
            );
        case 'cancelled':
            return (
                 <div className="flex items-center gap-2 text-xs text-destructive font-medium">
                    <XCircle className="h-4 w-4"/>
                    <span>Order cancelled on {order.cancelledAt ? format(order.cancelledAt.toDate(), 'PPP') : 'N/A'}</span>
                </div>
            );
        default:
            return null;
    }
}


export default function OrdersPage() {
  const { user } = useStoreAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const q = query(collection(db, "storeOrders"), where("userId", "==", user.id));
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as Order);
      
      // Sort orders by date on the client side
      fetchedOrders.sort((a, b) => {
        if (a.createdAt?.toDate && b.createdAt?.toDate) {
            return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
        }
        return 0;
      });
      
      setOrders(fetchedOrders);
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (loading) {
      return (
        <>
            <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900">
                <StoreHeader searchTerm="" setSearchTerm={() => {}} />
                <div className="container mx-auto py-12 px-4 md:px-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2"><Skeleton className="h-8 w-48" /></CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
      )
  }

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900">
          <StoreHeader searchTerm="" setSearchTerm={() => {}} />
          <div className="container mx-auto py-12 px-4 md:px-6">
              <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                          <ShoppingBag className="h-6 w-6" />
                          My Orders
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      {orders.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                              <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
                              <p className="font-semibold">You haven't placed any orders yet.</p>
                              <Button asChild className="mt-4">
                                  <Link href="/store">Start Shopping</Link>
                              </Button>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {orders.map(order => (
                                <Card key={order.id} className="bg-muted/30">
                                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                                        <div>
                                            <p className="text-sm font-semibold">Order ID: {order.orderId}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Placed on: {format(order.createdAt.toDate(), 'PPP')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">Total: ₹{order.totalAmount}</p>
                                            <p className="text-xs text-muted-foreground">Payment ID: {order.paymentId}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                      <Separator className="mb-4" />
                                       <div className="space-y-2">
                                        {order.items.map(item => (
                                          <div key={item.id} className="flex items-center gap-3 text-sm">
                                            <div className="relative h-12 w-10 flex-shrink-0">
                                                <GcsImage filePath={item.imageUrl} alt={item.title} fill className="object-cover rounded-sm" />
                                            </div>
                                            <p className="flex-grow font-medium truncate">{item.title}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="font-semibold w-20 text-right">₹{item.price * item.quantity}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 px-4 py-2 flex justify-between items-center">
                                       <StatusFooter order={order} />
                                       {getStatusBadge(order.status)}
                                    </CardFooter>
                                </Card>
                              ))}
                          </div>
                      )}
                  </CardContent>
              </Card>
          </div>
      </div>
    </>
  );
}
