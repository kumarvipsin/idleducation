// src/app/actions/utils.ts
import { Timestamp } from "firebase/firestore";

/**
 * Recursively serializes Firestore data to a format safe for Next.js Server Actions.
 * Handles Timestamps, Dates, NaN, Infinity, and converts undefined to null.
 * Also handles potential circular references and BigInts which are not JSON-serializable.
 */
export const serializeFirestoreData = (data: any, seen = new WeakSet()): any => {
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
        if (typeof data === 'bigint') {
            return data.toString(); // BigInt must be converted to string
        }
        return data;
    }

    // 3. Handle Firestore Timestamps and objects with toDate()
    if (typeof data.toDate === 'function') {
        try {
            const date = data.toDate();
            return date instanceof Date && !isNaN(date.getTime()) 
                ? date.toISOString() 
                : new Date().toISOString();
        } catch (e) {
            return new Date().toISOString(); 
        }
    }

    // 4. Handle standard JavaScript Date objects
    if (data instanceof Date) {
        try {
            return !isNaN(data.getTime()) ? data.toISOString() : new Date().toISOString();
        } catch (e) {
            return new Date().toISOString();
        }
    }

    // Circular reference protection
    if (seen.has(data)) {
        return null;
    }
    seen.add(data);

    // 5. Handle Arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeFirestoreData(item, seen));
    }

    // 6. Handle Objects (Plain objects and class instances)
    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            newData[key] = serializeFirestoreData(data[key], seen);
        }
    }
    return newData;
};
