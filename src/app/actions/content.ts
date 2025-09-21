'use server';

import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { z } from "zod";
import { FieldValue } from 'firebase-admin/firestore';

// Schemas for validation
const ChapterSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

const BookSchema = z.object({
  name: z.string().min(1),
  lang: z.string().min(2),
  chapters: z.array(ChapterSchema),
});

const SubjectSchema = z.object({
  name: z.string().min(1),
  books: z.array(BookSchema),
});

const ClassDataSchema = z.record(z.string(), SubjectSchema); // Represents { maths: Subject, science: Subject, ... }

type CollectionType = 'notes' | 'importantQuestions';

// Helper function to get a document reference
const getContentDocRef = (collectionType: CollectionType, classId: string) => {
    return doc(db, collectionType, classId);
};

// ==================================
// Class Level Operations
// ==================================

/**
 * Creates or overwrites an entire class document.
 * @param collectionType - 'notes' or 'importantQuestions'
 * @param classId - e.g., 'class-5'
 * @param data - The entire data object for the class, matching the Zod schema.
 */
export async function setClassData(collectionType: CollectionType, classId: string, data: z.infer<typeof ClassDataSchema>) {
    const validation = ClassDataSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid class data provided." };
    }

    try {
        const docRef = getContentDocRef(collectionType, classId);
        await setDoc(docRef, validation.data);
        return { success: true, message: `Successfully set data for ${classId} in ${collectionType}.` };
    } catch (error) {
        console.error(`Error setting class data for ${classId}:`, error);
        return { success: false, message: "Failed to set class data." };
    }
}

/**
 * Deletes an entire class document.
 * @param collectionType - 'notes' or 'importantQuestions'
 * @param classId - e.g., 'class-5'
 */
export async function deleteClass(collectionType: CollectionType, classId: string) {
    if (!classId) {
        return { success: false, message: "Class ID is required." };
    }
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await deleteDoc(docRef);
        return { success: true, message: `${classId} deleted successfully from ${collectionType}.` };
    } catch (error) {
        console.error(`Error deleting class ${classId}:`, error);
        return { success: false, message: "Failed to delete class." };
    }
}


// ==================================
// Field-based (Subject/Book/Chapter) Operations
// ==================================

/**
 * Adds or updates a subject within a class document.
 * @param collectionType 
 * @param classId 
 * @param subjectKey 
 * @param subjectData 
 * @returns 
 */
export async function updateSubject(collectionType: CollectionType, classId: string, subjectKey: string, subjectData: z.infer<typeof SubjectSchema>) {
    const validation = SubjectSchema.safeParse(subjectData);
    if (!validation.success) {
        return { success: false, message: "Invalid subject data." };
    }
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [subjectKey]: validation.data });
        return { success: true, message: `Subject '${subjectKey}' in '${classId}' updated successfully.` };
    } catch (error) {
        console.error(`Error updating subject ${subjectKey}:`, error);
        return { success: false, message: "Failed to update subject." };
    }
}

/**
 * Adds a new book to a subject's 'books' array.
 * @param collectionType 
 * @param classId 
 * @param subjectKey 
 * @param bookData 
 * @returns 
 */
export async function addBook(collectionType: CollectionType, classId: string, subjectKey: string, bookData: z.infer<typeof BookSchema>) {
    const validation = BookSchema.safeParse(bookData);
    if (!validation.success) {
        return { success: false, message: "Invalid book data." };
    }
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, {
            [`${subjectKey}.books`]: arrayUnion(validation.data)
        });
        return { success: true, message: "Book added successfully." };
    } catch (error) {
        console.error("Error adding book:", error);
        return { success: false, message: "Failed to add book." };
    }
}


/**
 * Updates a specific book within a subject.
 * Note: This requires reading the document first to replace the element.
 * @param collectionType 
 * @param classId 
 * @param subjectKey 
 * @param bookIndex 
 * @param bookData 
 * @returns 
 */
export async function updateBook(collectionType: CollectionType, classId: string, subjectKey: string, bookIndex: number, bookData: z.infer<typeof BookSchema>) {
    const validation = BookSchema.safeParse(bookData);
    if (!validation.success) {
        return { success: false, message: "Invalid book data." };
    }

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return { success: false, message: "Class document not found." };
        }
        const classData = docSnap.data();
        const subject = classData[subjectKey];
        if (subject && Array.isArray(subject.books) && subject.books[bookIndex]) {
            subject.books[bookIndex] = validation.data;
            await updateDoc(docRef, { [subjectKey]: subject });
            return { success: true, message: `Book at index ${bookIndex} for subject '${subjectKey}' updated.` };
        }
        return { success: false, message: "Book or subject not found." };
    } catch (error) {
        console.error(`Error updating book for ${subjectKey}:`, error);
        return { success: false, message: "Failed to update book." };
    }
}


/**
 * Adds a new chapter to a book's 'chapters' array.
 * @param collectionType 
 * @param classId 
 * @param subjectKey 
 * @param bookIndex 
 * @param chapterData 
 * @returns 
 */
export async function addChapter(collectionType: CollectionType, classId: string, subjectKey: string, bookIndex: number, chapterData: z.infer<typeof ChapterSchema>) {
    const validation = ChapterSchema.safeParse(chapterData);
    if (!validation.success) {
        return { success: false, message: "Invalid chapter data." };
    }
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, message: "Class document not found." };
        }

        const classData = docSnap.data();
        const subject = classData[subjectKey];
        
        if (subject && Array.isArray(subject.books) && subject.books[bookIndex]) {
            subject.books[bookIndex].chapters.push(validation.data);
            await updateDoc(docRef, { [subjectKey]: subject });
            return { success: true, message: "Chapter added successfully." };
        }
        
        return { success: false, message: "Subject or book not found." };
    } catch (error) {
        console.error(`Error adding chapter:`, error);
        return { success: false, message: "Failed to add chapter." };
    }
}


/**
 * Updates a specific chapter within a book.
 * @param collectionType 
 * @param classId 
 * @param subjectKey 
 * @param bookIndex 
 * @param chapterIndex 
 * @param chapterData 
 * @returns 
 */
export async function updateChapter(collectionType: CollectionType, classId: string, subjectKey: string, bookIndex: number, chapterIndex: number, chapterData: z.infer<typeof ChapterSchema>) {
    const validation = ChapterSchema.safeParse(chapterData);
    if (!validation.success) {
        return { success: false, message: "Invalid chapter data." };
    }
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
         if (!docSnap.exists()) {
            return { success: false, message: "Class document not found." };
        }
        const classData = docSnap.data();
        const subject = classData[subjectKey];
        if (subject && subject.books[bookIndex] && subject.books[bookIndex].chapters[chapterIndex]) {
            subject.books[bookIndex].chapters[chapterIndex] = validation.data;
            await updateDoc(docRef, { [subjectKey]: subject });
            return { success: true, message: `Chapter updated successfully.` };
        }
        return { success: false, message: "Chapter not found." };
    } catch (error) {
        console.error(`Error updating chapter:`, error);
        return { success: false, message: "Failed to update chapter." };
    }
}
