
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StoreHeader } from "../page";
import { GcsImage } from "@/components/gcs-image";


export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal } = useCart();

  return (
    <>
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <StoreHeader />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6" />
                            Your Shopping Cart
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <ShoppingCart className="h-16 w-16 mx-auto mb-4" />
                                <p className="font-semibold">Your cart is empty.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/store">Continue Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-md">
                                        <div className="relative h-20 w-16 flex-shrink-0">
                                            <GcsImage filePath={item.imageUrl} alt={item.title} fill className="object-cover rounded-md" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="outline" onClick={() => decreaseQuantity(item.id)} className="h-8 w-8">
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                                            <Button size="icon" variant="outline" onClick={() => increaseQuantity(item.id)} className="h-8 w-8">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    {cartItems.length > 0 && (
                        <CardFooter className="flex-col items-stretch p-6">
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <Button className="w-full mt-6" size="lg">
                                Proceed to Checkout
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    </>
  );
}
