
'use server';

import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, updateDoc, getDoc, writeBatch, arrayUnion, arrayRemove, FieldValue, getDocs, collection } from "firebase/firestore";
import { z } from "zod";
import { uploadFileToGCS } from '@/lib/gcs';
import { revalidatePath } from "next/cache";

// Helper to generate a slug from a string
const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

type CollectionType = 'notes' | 'importantQuestions';

// Helper function to get a document reference
const getContentDocRef = (collectionType: CollectionType, classId: string) => {
    return doc(db, collectionType, classId);
};

// ==================================
// Class Level Operations
// ==================================
export async function addClass(collectionType: CollectionType, className: string) {
    if (!className) return { success: false, message: "Class name is required." };
    const classId = generateSlug(className);
    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: false, message: `Class '${className}' already exists.` };
        }
        await setDoc(docRef, { name: className, subjects: {} });
        return { success: true, message: `Successfully added class '${className}'.` };
    } catch (error) {
        console.error(`Error adding class ${className}:`, error);
        return { success: false, message: "Failed to add class." };
    }
}

export async function editClass(collectionType: CollectionType, oldClassId: string, newClassName: string) {
    if (!oldClassId || !newClassName) {
        return { success: false, message: "Both old class ID and new class name are required." };
    }
    
    const newClassId = generateSlug(newClassName);
    if (oldClassId === newClassId) {
        // Just update the name if slug is same but name might have changed casing
        try {
            const docRef = getContentDocRef(collectionType, oldClassId);
            await updateDoc(docRef, { name: newClassName });
            return { success: true, message: `Class name updated for '${oldClassId}'.` };
        } catch (error) {
            console.error(`Error updating class name for ${oldClassId}:`, error);
            return { success: false, message: "Failed to update class name." };
        }
    }

    try {
        const oldDocRef = getContentDocRef(collectionType, oldClassId);
        const oldDocSnap = await getDoc(oldDocRef);

        if (!oldDocSnap.exists()) {
            return { success: false, message: `Class '${oldClassId}' not found.` };
        }
        
        const data = oldDocSnap.data();
        data.name = newClassName; // Update the name in the data object

        const newDocRef = getContentDocRef(collectionType, newClassId);
        const newDocSnap = await getDoc(newDocRef);

        if (newDocSnap.exists()) {
            return { success: false, message: `Class with name '${newClassName}' already exists.` };
        }

        const batch = writeBatch(db);
        batch.set(newDocRef, data);
        batch.delete(oldDocRef);
        await batch.commit();

        return { success: true, message: `Class '${oldClassId}' successfully renamed to '${newClassName}'.` };
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
// Subject Level Operations
// ==================================
export async function addSubject(collectionType: CollectionType, classId: string, subjectName: string) {
    if (!classId || !subjectName) return { success: false, message: "Class ID and Subject Name are required." };
    
    const subjectKey = generateSlug(subjectName);
    const subjectData = {
        name: subjectName,
        parts: {},
        chapters: []
    };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`subjects.${subjectKey}`]: subjectData });
        return { success: true, message: `Subject '${subjectName}' added.` };
    } catch (error) {
        console.error(`Error adding subject ${subjectName}:`, error);
        return { success: false, message: "Failed to add subject." };
    }
}

// ==================================
// Part Level Operations
// ==================================
export async function addPart(collectionType: CollectionType, classId: string, subjectKey: string, partName: string) {
    if (!classId || !subjectKey || !partName) return { success: false, message: "Class ID, Subject Key and Part Name are required." };
    
    const partKey = generateSlug(partName);
    const partData = {
        name: partName,
        chapters: []
    };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`subjects.${subjectKey}.parts.${partKey}`]: partData });
        return { success: true, message: `Part '${partName}' added.` };
    } catch (error) {
        console.error(`Error adding part ${partName}:`, error);
        return { success: false, message: "Failed to add part." };
    }
}

// ==================================
// Chapter Level Operations
// ==================================
export async function addChapter(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterName: string, pdfFile: File | null) {
    if (!chapterName) return { success: false, message: "Chapter name is required." };
    
    let pdfUrl = '';
    if (pdfFile && pdfFile.size > 0) {
        const destination = `${collectionType}/${classId}/${subjectKey}/${partKey || 'chapters'}/${generateSlug(chapterName)}.pdf`;
        pdfUrl = await uploadFileToGCS(pdfFile, destination);
    }
    
    const chapterData = {
        name: chapterName,
        topics: [],
        pdfUrl: pdfUrl,
    };
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        const fieldPath = partKey 
            ? `subjects.${subjectKey}.parts.${partKey}.chapters`
            : `subjects.${subjectKey}.chapters`;
        
        await updateDoc(docRef, { [fieldPath]: arrayUnion(chapterData) });
        
        return { success: true, message: "Chapter added successfully." };
    } catch (error) {
        console.error("Error adding chapter:", error);
        return { success: false, message: "Failed to add chapter." };
    }
}

// ==================================
// Topic Level Operations
// ==================================
export async function addTopic(collectionType: CollectionType, classId: string, subjectKey: string, chapterIndex: number, partKey: string | undefined, topicName: string, pdfFile: File | null) {
    if (!topicName) return { success: false, message: "Topic name is required." };

    let pdfUrl = '';
    if (pdfFile && pdfFile.size > 0) {
        const destination = `${collectionType}/${classId}/${subjectKey}/${partKey || 'chapters'}/chapter-${chapterIndex}/${generateSlug(topicName)}.pdf`;
        pdfUrl = await uploadFileToGCS(pdfFile, destination);
    }

    const topicData = {
        name: topicName,
        subTopics: [],
        pdfUrl: pdfUrl,
    };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };

        const data = docSnap.data();
        if (!data || !data.subjects || !data.subjects[subjectKey]) {
            return { success: false, message: "Subject not found." };
        }
        
        const subject = data.subjects[subjectKey];
        const chaptersArray = partKey ? (subject.parts?.[partKey]?.chapters) : subject.chapters;

        if (chaptersArray && chaptersArray[chapterIndex]) {
            if (!chaptersArray[chapterIndex].topics) {
                chaptersArray[chapterIndex].topics = [];
            }
            chaptersArray[chapterIndex].topics.push(topicData);

            const fieldPath = partKey 
                ? `subjects.${subjectKey}.parts.${partKey}.chapters` 
                : `subjects.${subjectKey}.chapters`;
            await updateDoc(docRef, { [fieldPath]: chaptersArray });
            
            return { success: true, message: "Topic added successfully." };
        }

        return { success: false, message: "Chapter not found." };
    } catch (error) {
        console.error("Error adding topic:", error);
        return { success: false, message: "Failed to add topic." };
    }
}

// ==================================
// SubTopic Level Operations
// ==================================
export async function addSubTopic(collectionType: CollectionType, classId: string, subjectKey: string, chapterIndex: number, topicIndex: number, partKey: string | undefined, subTopicName: string, pdfFile: File | null) {
    if (!subTopicName) return { success: false, message: "Sub-topic name is required." };

    let pdfUrl = '';
    if (pdfFile && pdfFile.size > 0) {
        const destination = `${collectionType}/${classId}/${subjectKey}/${partKey || 'chapters'}/chapter-${chapterIndex}/topic-${topicIndex}/${generateSlug(subTopicName)}.pdf`;
        pdfUrl = await uploadFileToGCS(pdfFile, destination);
    }
    
    const subTopicData = {
        name: subTopicName,
        pdfUrl: pdfUrl,
    };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        if (!data || !data.subjects || !data.subjects[subjectKey]) {
            return { success: false, message: "Subject not found." };
        }
        
        const subject = data.subjects[subjectKey];
        const chaptersArray = partKey ? (subject.parts?.[partKey]?.chapters) : subject.chapters;

        if (chaptersArray && chaptersArray[chapterIndex] && chaptersArray[chapterIndex].topics && chaptersArray[chapterIndex].topics[topicIndex]) {
            if (!chaptersArray[chapterIndex].topics[topicIndex].subTopics) {
                chaptersArray[chapterIndex].topics[topicIndex].subTopics = [];
            }
            chaptersArray[chapterIndex].topics[topicIndex].subTopics.push(subTopicData);

            const fieldPath = partKey 
                ? `subjects.${subjectKey}.parts.${partKey}.chapters` 
                : `subjects.${subjectKey}.chapters`;
            await updateDoc(docRef, { [fieldPath]: chaptersArray });
            
            return { success: true, message: "Sub-topic added successfully." };
        }

        return { success: false, message: "Topic not found." };
    } catch (error) {
        console.error("Error adding sub-topic:", error);
        return { success: false, message: "Failed to add sub-topic." };
    }
}

// Placeholder functions for edit/delete operations
export async function editSubject(collectionType: CollectionType, classId: string, subjectKey: string, newSubjectName: string) {
    // This is complex because it involves renaming a map key. 
    // It's often easier to delete and re-add. A full implementation would read the subject data,
    // delete the old key, and write the data back under a new key.
    return { success: false, message: "Edit subject not implemented yet." };
}

export async function editPart(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string, newPartName: string) {
    return { success: false, message: "Edit part not implemented yet." };
}

export async function editChapter(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, newChapterName: string, pdfFile: File | null) {
    return { success: false, message: "Edit chapter not implemented yet." };
}

export async function editTopic(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, topicIndex: number, newTopicName: string, pdfFile: File | null) {
    return { success: false, message: "Edit topic not implemented yet." };
}
