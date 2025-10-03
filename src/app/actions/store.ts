
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { CartItem } from "@/context/cart-context";

interface OrderData {
    userId: string;
    items: CartItem[];
    totalAmount: number;
    paymentId: string;
}

export async function createOrder(data: OrderData) {
    try {
        await addDoc(collection(db, "storeOrders"), {
            ...data,
            createdAt: serverTimestamp(),
            status: 'completed',
        });
        return { success: true, message: "Order placed successfully!" };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, message: "Failed to place order." };
    }
}
