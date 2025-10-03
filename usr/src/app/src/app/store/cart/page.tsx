
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StoreHeader } from "@/app/store/page";
import { GcsImage } from "@/components/gcs-image";
import { createRazorpayOrder } from "@/app/actions";
import { createOrder } from "@/app/actions/store";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";
import { useStoreAuth } from "@/context/store-auth-context";
import { useRouter } from "next/navigation";


export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useStoreAuth();
  const router = useRouter();


  const handleCheckout = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to proceed to checkout.",
        });
        router.push('/store/auth');
        return;
    }

    const result = await createRazorpayOrder({ amount: cartTotal * 100, currency: 'INR' });
    if (!result.success || !result.order) {
        toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not create payment order.' });
        return;
    }
    const order = result.order;
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'IDL Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response: any) {
            const orderResult = await createOrder({
                userId: user.id,
                userName: user.name,
                userMobile: user.mobile,
                items: cartItems,
                totalAmount: cartTotal,
                paymentId: response.razorpay_payment_id,
            });

            if (orderResult.success) {
                toast({ title: 'Payment Successful', description: 'Your order has been placed!' });
                clearCart();
                router.push('/store/orders');
            } else {
                toast({ variant: 'destructive', title: 'Order Failed', description: 'There was an issue saving your order. Please contact support.' });
            }
        },
        prefill: {
            name: user.name,
            contact: user.mobile,
        },
        theme: {
            color: '#0d47a1',
        },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  }


  return (
    <>
        <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <StoreHeader />
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
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
                                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-md">
                                            <div className="flex w-full sm:w-auto items-start gap-4">
                                                <div className="relative h-24 w-20 flex-shrink-0">
                                                    <GcsImage filePath={item.imageUrl} alt={item.title} fill className="object-cover rounded-md" />
                                                </div>
                                                <div className="flex-grow sm:hidden">
                                                    <h3 className="font-semibold text-base">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">by {item.author}</p>
                                                    <p className="text-xs text-muted-foreground">{item.class} | Edition: {item.edition}</p>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block flex-grow">
                                                <h3 className="font-semibold text-base">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">by {item.author}</p>
                                                <p className="text-xs text-muted-foreground">{item.class} | Edition: {item.edition}</p>
                                                <p className="text-base font-bold mt-1">₹{item.price}</p>
                                            </div>
                                            <div className="flex w-full sm:w-auto justify-between items-center mt-2 sm:mt-0">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="outline" onClick={() => decreaseQuantity(item.id)} className="h-8 w-8">
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="font-bold w-8 text-center text-lg">{item.quantity}</span>
                                                    <Button size="icon" variant="outline" onClick={() => increaseQuantity(item.id)} className="h-8 w-8">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-right flex-grow sm:flex-grow-0 sm:w-24">
                                                    <p className="font-semibold text-lg">₹{item.price * item.quantity}</p>
                                                </div>
                                                 <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive sm:ml-2">
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        {cartItems.length > 0 && (
                            <CardFooter className="flex-col items-stretch p-6">
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <Button className="w-full mt-6" size="lg" onClick={handleCheckout}>
                                    Proceed to Checkout
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    </>
  );
}
