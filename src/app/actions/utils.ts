// src/app/actions/utils.ts
import { Timestamp } from "firebase/firestore";

/**
 * Recursively serializes Firestore data to a format safe for Next.js Server Actions.
 * Handles Timestamps, Dates, NaN, Infinity, and converts undefined to null.
 * This is crucial for Next.js 15+ which is strict about undefined values in server action returns.
 */
export const serializeFirestoreData = (data: any): any => {
    // 1. Handle undefined (Server Actions cannot serialize undefined)
    if (data === undefined) {
        return null;
    }

    // 2. Handle null or primitives that are already serializable
    if (data === null || typeof data !== 'object') {
        if (typeof data === 'number') {
            if (Number.isNaN(data) || !Number.isFinite(data)) {
                return 0; // Fallback for non-serializable numbers
            }
        }
        return data;
    }

    // 3. Handle Firestore Timestamps
    // Check both instanceof and common properties to be resilient across environments
    if (data instanceof Timestamp || (data && typeof data.toDate === 'function')) {
        try {
            return data.toDate().toISOString();
        } catch (e) {
            return new Date().toISOString(); 
        }
    }

    // 4. Handle standard JavaScript Date objects
    if (data instanceof Date) {
        try {
            return data.toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    }

    // 5. Handle Arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeFirestoreData(item));
    }

    // 6. Handle Objects (Plain objects and class instances)
    // We create a new plain object to ensure it's clean for serialization
    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            newData[key] = serializeFirestoreData(data[key]);
        }
    }
    return newData;
};
