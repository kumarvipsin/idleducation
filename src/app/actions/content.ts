
'use server';

import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { z } from "zod";
import { uploadFileToGCS } from "@/lib/gcs";

// Helper to generate a slug from a string
const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};


// Schemas for validation
const TopicSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  pdfUrl: z.string().optional(),
});

const ChapterSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  topics: z.array(TopicSchema),
  pdfUrl: z.string().optional(),
});

const PartSchema = z.object({
  name: z.string().min(1),
  chapters: z.array(ChapterSchema),
});

const ClassDataSchema = z.record(z.string(), PartSchema); // Represents { part-1: Part, part-2: Part, ... }

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
// Field-based (Part/Chapter/Topic) Operations
// ==================================

export async function updatePart(collectionType: CollectionType, classId: string, partKey: string, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const name = rawFormData.name as string;

    if (!name) return { success: false, message: "Part name is required." };
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`${partKey}.name`]: name });
        return { success: true, message: `Part '${name}' in '${classId}' updated successfully.` };
    } catch (error) {
        console.error(`Error updating part ${partKey}:`, error);
        return { success: false, message: "Failed to update part." };
    }
}

export async function addChapter(collectionType: CollectionType, classId: string, partKey: string, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    
    const name = rawFormData.name as string;
    const slug = generateSlug(name);
    
    const chapterData = {
        name,
        slug,
        topics: [],
    };
    const pdfFile = rawFormData.pdf as File;

    const validation = ChapterSchema.pick({ name: true, slug: true, topics: true }).safeParse(chapterData);
    if (!validation.success) {
        return { success: false, message: "Invalid chapter data." };
    }
    
    try {
        let pdfUrl = '';
        if (pdfFile && pdfFile.size > 0) {
            const destination = `${collectionType}/${classId}/${partKey}/${chapterData.slug}-${pdfFile.name}`;
            pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }

        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, {
            [`${partKey}.chapters`]: arrayUnion({ ...chapterData, pdfUrl })
        });
        return { success: true, message: "Chapter added successfully." };
    } catch (error) {
        console.error("Error adding chapter:", error);
        return { success: false, message: "Failed to add chapter." };
    }
}

export async function addTopic(collectionType: CollectionType, classId: string, partKey: string, chapterIndex: number, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    
    const name = rawFormData.name as string;
    const slug = generateSlug(name);

    const topicData = {
        name,
        slug,
    };
    const pdfFile = rawFormData.pdf as File;

    const validation = TopicSchema.pick({ name: true, slug: true }).safeParse(topicData);
    if (!validation.success) {
        return { success: false, message: "Invalid topic data." };
    }
    
    try {
        let pdfUrl = '';
        if (pdfFile && pdfFile.size > 0) {
            const docSnap = await getDoc(getContentDocRef(collectionType, classId));
            if (!docSnap.exists()) return { success: false, message: "Class document not found." };
            const classData = docSnap.data();
            const chapterSlug = classData[partKey]?.chapters?.[chapterIndex]?.slug;
            if(!chapterSlug) return { success: false, message: "Chapter not found." };
            
            const destination = `${collectionType}/${classId}/${partKey}/${chapterSlug}/${topicData.slug}-${pdfFile.name}`;
            pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }

        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, message: "Class document not found." };
        }

        const classData = docSnap.data();
        const part = classData[partKey];
        
        if (part && Array.isArray(part.chapters) && part.chapters[chapterIndex]) {
            if(!part.chapters[chapterIndex].topics) {
                part.chapters[chapterIndex].topics = [];
            }
            part.chapters[chapterIndex].topics.push({ ...topicData, pdfUrl });
            await updateDoc(docRef, { [partKey]: part });
            return { success: true, message: "Topic added successfully." };
        }
        
        return { success: false, message: "Part or chapter not found." };
    } catch (error) {
        console.error(`Error adding topic:`, error);
        return { success: false, message: "Failed to add topic." };
    }
}

export async function editChapter(collectionType: CollectionType, classId: string, partKey: string, chapterIndex: number, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const name = rawFormData.name as string;
    const pdfFile = rawFormData.pdf as File;

    if (!name) return { success: false, message: "Chapter name is required." };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class document not found." };
        
        const classData = docSnap.data();
        const part = classData[partKey];
        if (!part || !part.chapters || !part.chapters[chapterIndex]) {
            return { success: false, message: "Chapter not found." };
        }
        
        const chapterToUpdate = part.chapters[chapterIndex];
        chapterToUpdate.name = name;
        chapterToUpdate.slug = generateSlug(name);

        if (pdfFile && pdfFile.size > 0) {
            const destination = `${collectionType}/${classId}/${partKey}/${chapterToUpdate.slug}-${pdfFile.name}`;
            chapterToUpdate.pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }
        
        await updateDoc(docRef, { [partKey]: part });
        return { success: true, message: "Chapter updated successfully." };
    } catch (error) {
        console.error("Error updating chapter:", error);
        return { success: false, message: "Failed to update chapter." };
    }
}

export async function editTopic(collectionType: CollectionType, classId: string, partKey: string, chapterIndex: number, topicIndex: number, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const name = rawFormData.name as string;
    const pdfFile = rawFormData.pdf as File;

    if (!name) return { success: false, message: "Topic name is required." };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class document not found." };

        const classData = docSnap.data();
        const part = classData[partKey];
        const chapter = part?.chapters?.[chapterIndex];
        if (!chapter || !chapter.topics || !chapter.topics[topicIndex]) {
            return { success: false, message: "Topic not found." };
        }

        const topicToUpdate = chapter.topics[topicIndex];
        topicToUpdate.name = name;
        topicToUpdate.slug = generateSlug(name);

        if (pdfFile && pdfFile.size > 0) {
            const destination = `${collectionType}/${classId}/${partKey}/${chapter.slug}/${topicToUpdate.slug}-${pdfFile.name}`;
            topicToUpdate.pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }

        await updateDoc(docRef, { [partKey]: part });
        return { success: true, message: "Topic updated successfully." };
    } catch (error) {
        console.error("Error updating topic:", error);
        return { success: false, message: "Failed to update topic." };
    }
}
