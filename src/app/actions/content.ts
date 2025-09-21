
'use server';

import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { z } from "zod";
import { uploadFileToGCS } from "@/lib/gcs";

// Helper to generate a slug from a string
const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// ==================================
// Schemas for validation
// ==================================
const SubTopicSchema = z.object({
  name: z.string().min(1),
  pdfUrl: z.string().optional(),
});

const TopicSchema = z.object({
  name: z.string().min(1),
  pdfUrl: z.string().optional(),
  subTopics: z.array(SubTopicSchema).optional(),
});

const ChapterSchema = z.object({
  name: z.string().min(1),
  pdfUrl: z.string().optional(),
  topics: z.array(TopicSchema).optional(),
});

const PartSchema = z.object({
  name: z.string().min(1),
  chapters: z.array(ChapterSchema),
});

const SubjectSchema = z.object({
  name: z.string().min(1),
  parts: z.record(z.string(), PartSchema).optional(), // Optional parts map
  chapters: z.array(ChapterSchema).optional(), // Optional chapters array if no parts
});

const ClassDataSchema = z.record(z.string(), SubjectSchema);

type CollectionType = 'notes' | 'importantQuestions';

// Helper function to get a document reference
const getContentDocRef = (collectionType: CollectionType, classId: string) => {
    return doc(db, collectionType, classId);
};

// ==================================
// Class Level Operations
// ==================================
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

export async function editClass(collectionType: CollectionType, oldClassId: string, newClassId: string) {
    if (!oldClassId || !newClassId) {
        return { success: false, message: "Both old and new class IDs are required." };
    }
    if (oldClassId === newClassId) {
        return { success: true, message: "Class ID is the same, no changes made."};
    }

    try {
        const oldDocRef = getContentDocRef(collectionType, oldClassId);
        const oldDocSnap = await getDoc(oldDocRef);

        if (!oldDocSnap.exists()) {
            return { success: false, message: `Class '${oldClassId}' not found.` };
        }
        
        const data = oldDocSnap.data();

        const newDocRef = getContentDocRef(collectionType, newClassId);
        const newDocSnap = await getDoc(newDocRef);

        if (newDocSnap.exists()) {
            return { success: false, message: `Class '${newClassId}' already exists.` };
        }

        const batch = writeBatch(db);
        batch.set(newDocRef, data);
        batch.delete(oldDocRef);
        await batch.commit();

        return { success: true, message: `Class '${oldClassId}' successfully renamed to '${newClassId}'.` };
    } catch (error) {
        console.error(`Error renaming class from ${oldClassId} to ${newClassId}:`, error);
        return { success: false, message: "Failed to rename class." };
    }
}

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
// Field-based (Subject/Part/Chapter/Topic) Operations
// ==================================
export async function updateSubject(collectionType: CollectionType, classId: string, subjectKey: string, formData: FormData) {
    const name = formData.get('name') as string;
    if (!name) return { success: false, message: "Subject name is required." };
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`${subjectKey}.name`]: name });
        return { success: true, message: `Subject updated successfully.` };
    } catch (error) {
        console.error(`Error updating subject ${subjectKey}:`, error);
        return { success: false, message: "Failed to update subject." };
    }
}

export async function updatePart(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string, formData: FormData) {
    const name = formData.get('name') as string;
    if (!name) return { success: false, message: "Part name is required." };
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`${subjectKey}.parts.${partKey}.name`]: name });
        return { success: true, message: `Part updated successfully.` };
    } catch (error) {
        console.error(`Error updating part ${partKey}:`, error);
        return { success: false, message: "Failed to update part." };
    }
}


export async function addChapter(collectionType: CollectionType, classId: string, subjectKey: string, partKey?: string) {
    // This is a simplified version. In a real app, you'd get the chapter name from formData.
    // For now, let's add a placeholder chapter.
    const chapterName = `New Chapter ${Date.now()}`;
    const chapterData = {
        name: chapterName,
        topics: [],
        pdfUrl: '',
    };
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const classData = docSnap.data();
        const fieldPath = partKey 
            ? `${subjectKey}.parts.${partKey}.chapters`
            : `${subjectKey}.chapters`;
        
        // This uses Firestore's arrayUnion to safely add the new chapter.
        await updateDoc(docRef, { [fieldPath]: arrayUnion(chapterData) });
        
        return { success: true, message: "Chapter added successfully." };
    } catch (error) {
        console.error("Error adding chapter:", error);
        return { success: false, message: "Failed to add chapter." };
    }
}


export async function addTopic(collectionType: CollectionType, classId: string, subjectKey: string, chapterIndex: number, partKey?: string) {
    const topicName = `New Topic ${Date.now()}`;
    const topicData = {
        name: topicName,
        subTopics: [],
        pdfUrl: '',
    };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };

        const classData = docSnap.data();
        let chaptersArray;

        if (partKey) {
            chaptersArray = classData[subjectKey]?.parts?.[partKey]?.chapters;
        } else {
            chaptersArray = classData[subjectKey]?.chapters;
        }

        if (chaptersArray && chaptersArray[chapterIndex]) {
            if (!chaptersArray[chapterIndex].topics) {
                chaptersArray[chapterIndex].topics = [];
            }
            chaptersArray[chapterIndex].topics.push(topicData);

            // Now update the correct path in Firestore
            const fieldPath = partKey 
                ? `${subjectKey}.parts.${partKey}.chapters` 
                : `${subjectKey}.chapters`;
            await updateDoc(docRef, { [fieldPath]: chaptersArray });
            
            return { success: true, message: "Topic added successfully." };
        }

        return { success: false, message: "Chapter not found." };
    } catch (error) {
        console.error("Error adding topic:", error);
        return { success: false, message: "Failed to add topic." };
    }
}

// Placeholder functions for edit/delete of chapter, topic, sub-topic would go here.
// They would follow a similar pattern of getting the document, modifying the array in memory,
// and then using updateDoc with the full path to the array.

