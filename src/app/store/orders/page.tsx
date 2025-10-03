
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingBag, FileText } from "lucide-react";
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

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentId: string;
  createdAt: any;
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
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Order[];
      
      // Sort orders by date on the client side
      fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setOrders(fetchedOrders);
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (loading) {
      return (
        <>
            <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <StoreHeader />
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
      <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <StoreHeader />
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
                                            <p className="text-sm font-semibold">Order ID: {order.id}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Placed on: {format(order.createdAt, 'PPP')}
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
