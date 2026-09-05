'use server';

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { serializeFirestoreData } from "./utils";

export interface CourseLeafItem {
    id: string;
    label: string;
    classNumber?: number;
    slug?: string;
    href: string;
    order: number;
    status?: 'active' | 'inactive';
}

export interface CourseSubItem {
    id: string;
    label: string;
    classNumber?: number;
    slug?: string;
    href: string;
    order: number;
    status: 'active' | 'inactive';
    items?: CourseLeafItem[];
}

export interface CourseCategory {
    id: string;
    name: string;
    slug?: string;
    href: string;
    order: number;
    status: 'active' | 'inactive';
    subItems: CourseSubItem[];
}

/**
 * Fetches active course categories and their active sub-items, ordered by `order`.
 */
export async function getAllCoursesCategories(): Promise<{ success: boolean; data: CourseCategory[]; message?: string }> {
    try {
        const q = query(
            collection(db, "courseCategories"),
            where("status", "==", "active")
        );
        const snapshot = await getDocs(q);
        
        const categories: CourseCategory[] = [];
        snapshot.forEach(docSnap => {
            const data = serializeFirestoreData(docSnap.data());
            const subItems: CourseSubItem[] = Array.isArray(data.subItems)
                ? (data.subItems as any[])
                    .filter(sub => sub.status === 'active')
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(sub => ({
                        id: sub.id,
                        label: sub.label,
                        classNumber: sub.classNumber,
                        slug: sub.slug,
                        href: sub.href,
                        order: sub.order,
                        status: sub.status,
                        items: Array.isArray(sub.items)
                            ? sub.items
                                .filter((item: any) => item.status === 'active' || !item.status)
                                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                            : undefined
                    }))
                : [];

            categories.push({
                id: docSnap.id,
                name: data.name || "Category",
                slug: data.slug || "",
                href: data.href || `/category/${data.slug || docSnap.id}`,
                order: typeof data.order === 'number' ? data.order : 99,
                status: data.status || 'active',
                subItems,
            });
        });

        // Sort categories by order ascending
        categories.sort((a, b) => a.order - b.order);

        return {
            success: true,
            data: categories,
        };
    } catch (error: any) {
        console.error("Error fetching course categories:", error);
        return {
            success: false,
            data: [],
            message: error.message || "Failed to fetch course categories",
        };
    }
}
