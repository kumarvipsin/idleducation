'use server';

import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, writeBatch, collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { z } from "zod";

// Schemas for validation
const ChapterSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  // Add other chapter fields if necessary, e.g., content: z.string()
});

const BookSchema = z.object({
  name: z.string().min(1),
  lang: z.string().min(2),
  chapters: z.array(ChapterSchema),
});

const SubjectSchema = z.object({
  books: z.array(BookSchema),
});

const ClassDataSchema = z.record(SubjectSchema); // Represents { maths: Subject, science: Subject, ... }

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
 * Updates a specific subject within a class document.
 * @param collectionType - 'notes' or 'importantQuestions'
 * @param classId - e.g., 'class-5'
 * @param subjectKey - e.g., 'maths'
 * @param subjectData - The new data for the subject.
 */
export async function updateSubject(collectionType: CollectionType, classId: string, subjectKey: string, subjectData: z.infer<typeof SubjectSchema>) {
    const validation = SubjectSchema.safeParse(subjectData);
    if (!validation.success) {
        return { success: false, message: "Invalid subject data." };
    }
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await setDoc(docRef, { [subjectKey]: validation.data }, { merge: true });
        return { success: true, message: `Subject '${subjectKey}' in '${classId}' updated successfully.` };
    } catch (error) {
        console.error(`Error updating subject ${subjectKey}:`, error);
        return { success: false, message: "Failed to update subject." };
    }
}


/**
 * Updates a specific book within a subject.
 * Note: This replaces all chapters within that book.
 * @param collectionType - 'notes' or 'importantQuestions'
 * @param classId - e.g., 'class-5'
 * @param subjectKey - e.g., 'maths'
 * @param bookIndex - The index of the book in the 'books' array.
 * @param bookData - The new data for the book.
 */
export async function updateBook(collectionType: CollectionType, classId: string, subjectKey: string, bookIndex: number, bookData: z.infer<typeof BookSchema>) {
    const validation = BookSchema.safeParse(bookData);
    if (!validation.success) {
        return { success: false, message: "Invalid book data." };
    }

    try {
        const docRef = getContentDocRef(collectionType, classId);
        // Using dot notation to update a specific element in an array
        await updateDoc(docRef, { [`${subjectKey}.books.${bookIndex}`]: validation.data });
        return { success: true, message: `Book at index ${bookIndex} for subject '${subjectKey}' updated.` };
    } catch (error) {
        console.error(`Error updating book for ${subjectKey}:`, error);
        return { success: false, message: "Failed to update book." };
    }
}


/**
 * Updates a specific chapter within a book.
 * @param collectionType - 'notes' or 'importantQuestions'
 * @param classId - e.g., 'class-5'
 * @param subjectKey - e.g., 'maths'
 * @param bookIndex - The index of the book.
 * @param chapterIndex - The index of the chapter to update.
 * @param chapterData - The new data for the chapter.
 */
export async function updateChapter(collectionType: CollectionType, classId: string, subjectKey: string, bookIndex: number, chapterIndex: number, chapterData: z.infer<typeof ChapterSchema>) {
    const validation = ChapterSchema.safeParse(chapterData);
    if (!validation.success) {
        return { success: false, message: "Invalid chapter data." };
    }
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`${subjectKey}.books.${bookIndex}.chapters.${chapterIndex}`]: validation.data });
        return { success: true, message: `Chapter at index ${chapterIndex} updated successfully.` };
    } catch (error) {
        console.error(`Error updating chapter:`, error);
        return { success: false, message: "Failed to update chapter." };
    }
}

// Note: Firestore does not support directly deleting an element from an array by index/value in server actions easily.
// A robust solution requires reading the document, modifying the array in code, and overwriting the field.
// This is a more advanced operation and would be implemented in the UI logic that calls these actions.
