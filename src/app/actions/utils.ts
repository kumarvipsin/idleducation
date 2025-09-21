// src/app/actions/utils.ts
import { Timestamp } from "firebase/firestore";

export const serializeFirestoreData = (data: any): any => {
    if (data === null || data === undefined) {
        return data;
    }
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(item => serializeFirestoreData(item));
    }
    if (typeof data === 'object') {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            newData[key] = serializeFirestoreData(data[key]);
        }
        return newData;
    }
    return data;
};
