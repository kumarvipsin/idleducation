// src/app/actions/utils.ts
import { Timestamp } from "firebase/firestore";

/**
 * Recursively serializes Firestore data to a format safe for Next.js Server Actions.
 * Handles Timestamps, Dates, NaN, and Infinity.
 */
export const serializeFirestoreData = (data: any): any => {
    // Handle null, undefined, or primitive types that don't need transformation
    if (data === null || data === undefined) {
        return data;
    }

    // Ensure numbers are serializable (handle NaN and Infinity)
    if (typeof data === 'number') {
        if (Number.isNaN(data) || !Number.isFinite(data)) {
            return 0; // Fallback to 0 for non-serializable numbers
        }
        return data;
    }

    // Handle Firestore Timestamps
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }

    // Handle standard JavaScript Date objects
    if (data instanceof Date) {
        return data.toISOString();
    }

    // Recursively handle arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeFirestoreData(item));
    }

    // Recursively handle objects, ensuring we only touch own properties
    if (typeof data === 'object') {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newData[key] = serializeFirestoreData(data[key]);
            }
        }
        return newData;
    }

    // Return other primitives (strings, booleans) as-is
    return data;
};
