
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import type { CartItem } from "@/context/cart-context";
import { serializeFirestoreData } from "./utils";

interface OrderData {
    userId: string;
    userName: string;
    userMobile: string;
    items: CartItem[];
    totalAmount: number;
    paymentId: string;
}

// Function to generate a random 8-digit order ID
const generateOrderId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};


export async function createOrder(data: OrderData) {
    try {
        const orderId = generateOrderId();
        await addDoc(collection(db, "storeOrders"), {
            ...data,
            orderId: orderId,
            createdAt: serverTimestamp(),
            status: 'processing',
        });
        return { success: true, message: "Order placed successfully!" };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, message: "Failed to place order." };
    }
}

export async function getStoreOrders() {
    try {
        const ordersQuery = query(collection(db, "storeOrders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(ordersQuery);
        const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: orders };
    } catch (error) {
        console.error("Error fetching store orders:", error);
        return { success: false, message: "Failed to fetch store orders." };
    }
}

export async function updateOrderStatus(orderId: string, status: 'processing' | 'delivered' | 'cancelled') {
    try {
        const orderRef = doc(db, "storeOrders", orderId);
        const updateData: { status: string; deliveredAt?: any; cancelledAt?: any } = { status };
        
        if (status === 'delivered') {
            updateData.deliveredAt = serverTimestamp();
        } else if (status === 'cancelled') {
            updateData.cancelledAt = serverTimestamp();
        }

        await updateDoc(orderRef, updateData);
        return { success: true, message: `Order marked as ${status}.` };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, message: "Failed to update order status." };
    }
}
