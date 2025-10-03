
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StoreHeader } from "../page";

export default function OrdersPage() {
  // Mock data for now
  const orders: any[] = [];

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
                          <div className="space-y-4">
                              {/* Orders list will go here */}
                          </div>
                      )}
                  </CardContent>
              </Card>
          </div>
      </div>
    </>
  );
}
