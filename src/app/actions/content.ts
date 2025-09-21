


'use server';
import 'dotenv/config';
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, updateDoc, getDoc, writeBatch, arrayUnion, arrayRemove, getDocs, collection, serverTimestamp, deleteField } from "firebase/firestore";
import { z } from "zod";
import { uploadFileToGCS, getSignedUrl } from '@/lib/gcs';
import { revalidatePath } from "next/cache";
import { TClass, TSubject, TPart, TChapter, TTopic, TSubTopic } from './types';


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
// View PDF Action
// ==================================
export async function getSignedUrlForPdf(publicUrl: string) {
    if (!publicUrl) {
        return { success: false, message: 'No file URL provided.' };
    }
    try {
        const bucketName = process.env.GCS_BUCKET_NAME || 'idlcloud';
        const filePath = decodeURIComponent(publicUrl.substring(publicUrl.indexOf(bucketName) + bucketName.length + 1));
        const url = await getSignedUrl(filePath);
        return { success: true, url: url };
    } catch (error) {
        console.error("Error generating signed URL for PDF:", error);
        return { success: false, message: 'Could not get viewable link for the PDF.' };
    }
}

// ==================================
// Reordering Action
// ==================================
export async function reorderArrayItem(
    collectionType: CollectionType,
    path: { classId: string; subjectKey: string; partKey?: string; chapterIndex?: number; topicIndex?: number; },
    itemType: 'chapter' | 'topic' | 'subTopic',
    itemIndex: number,
    direction: 'up' | 'down'
) {
    if (!path.classId || !path.subjectKey) {
        return { success: false, message: "Invalid path provided." };
    }

    try {
        const docRef = getContentDocRef(collectionType, path.classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };

        const data = docSnap.data();
        const subject = data.subjects?.[path.subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };
        
        let arrayToModify: any[] | undefined;
        let fieldPath: string;

        if (itemType === 'chapter') {
            fieldPath = path.partKey ? `subjects.${path.subjectKey}.parts.${path.partKey}.chapters` : `subjects.${path.subjectKey}.chapters`;
            arrayToModify = path.partKey ? subject.parts?.[path.partKey]?.chapters : subject.chapters;
        } else if (itemType === 'topic' && path.chapterIndex !== undefined) {
            fieldPath = path.partKey ? `subjects.${path.subjectKey}.parts.${path.partKey}.chapters` : `subjects.${path.subjectKey}.chapters`;
            const chapters = path.partKey ? subject.parts?.[path.partKey]?.chapters : subject.chapters;
            arrayToModify = chapters?.[path.chapterIndex]?.topics;
        } else if (itemType === 'subTopic' && path.chapterIndex !== undefined && path.topicIndex !== undefined) {
            fieldPath = path.partKey ? `subjects.${path.subjectKey}.parts.${path.partKey}.chapters` : `subjects.${path.subjectKey}.chapters`;
            const chapters = path.partKey ? subject.parts?.[path.partKey]?.chapters : subject.chapters;
            arrayToModify = chapters?.[path.chapterIndex]?.topics?.[path.topicIndex]?.subTopics;
        } else {
             return { success: false, message: "Invalid item type or path for reordering." };
        }

        if (!arrayToModify || itemIndex < 0 || itemIndex >= arrayToModify.length) {
            return { success: false, message: "Item not found or index out of bounds." };
        }

        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
        if (newIndex < 0 || newIndex >= arrayToModify.length) {
            return { success: false, message: "Cannot move item further." };
        }
        
        // Swap elements
        const temp = arrayToModify[itemIndex];
        arrayToModify[itemIndex] = arrayToModify[newIndex];
        arrayToModify[newIndex] = temp;

        if (itemType === 'chapter') {
            await updateDoc(docRef, { [fieldPath]: arrayToModify });
        } else {
            const chapters = path.partKey ? subject.parts?.[path.partKey]?.chapters : subject.chapters;
            if (itemType === 'topic') {
                chapters[path.chapterIndex!].topics = arrayToModify;
            } else if (itemType === 'subTopic') {
                chapters[path.chapterIndex!].topics[path.topicIndex!].subTopics = arrayToModify;
            }
            await updateDoc(docRef, { [fieldPath]: chapters });
        }

        return { success: true, message: `${itemType} reordered successfully.` };

    } catch (error) {
        console.error("Error reordering item:", error);
        return { success: false, message: "Failed to reorder item." };
    }
}


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
        await setDoc(docRef, { name: className, subjects: {}, order: 99 });
        return { success: true, message: `Successfully added class '${className}'.` };
    } catch (error) {
        console.error(`Error adding class ${className}:`, error);
        return { success: false, message: "Failed to add class." };
    }
}

export async function editClass(collectionType: CollectionType, classId: string, newClassName: string, order: number) {
    if (!classId || !newClassName) {
        return { success: false, message: "Class ID and new class name are required." };
    }
    
    const newClassId = generateSlug(newClassName);
    
    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()) return { success: false, message: "Class not found." };

        const data = docSnap.data();
        data.name = newClassName;
        data.order = isNaN(order) ? 99 : order;

        if (classId === newClassId) {
            await updateDoc(docRef, { name: newClassName, order: data.order });
            return { success: true, message: `Class '${newClassName}' updated successfully.` };
        }

        const newDocRef = getContentDocRef(collectionType, newClassId);
        const newDocSnap = await getDoc(newDocRef);
        if (newDocSnap.exists()) {
            return { success: false, message: `Class with name '${newClassName}' already exists.` };
        }

        const batch = writeBatch(db);
        batch.set(newDocRef, data);
        batch.delete(docRef);
        await batch.commit();

        return { success: true, message: `Class '${classId}' successfully renamed to '${newClassName}'.` };

    } catch (error) {
        console.error(`Error processing class edit from ${classId} to ${newClassId}:`, error);
        return { success: false, message: "Failed to process class edit." };
    }
}

export async function deleteClass(collectionType: CollectionType, classId: string) {
    if (!classId) {
        return { success: false, message: "Class ID is required." };
    }
    try {
        const docRef = getContentDocRef(collectionType, classId);
        await deleteDoc(docRef);
        return { success: true, message: `Class '${classId}' deleted successfully from ${collectionType}.` };
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
    const subjectData: TSubject = {
        name: subjectName,
        createdAt: new Date().toISOString(),
        parts: {},
        chapters: [],
        order: 99,
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

export async function editSubject(collectionType: CollectionType, classId: string, subjectKey: string, newSubjectName: string, order: number) {
    if (!classId || !subjectKey || !newSubjectName) return { success: false, message: "Required fields are missing."};

    const newSubjectKey = generateSlug(newSubjectName);

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        const subjectData = data.subjects[subjectKey];
        if(!subjectData) return { success: false, message: "Subject not found."};

        subjectData.name = newSubjectName;
        subjectData.order = isNaN(order) ? 99 : order;

        const batch = writeBatch(db);

        if (subjectKey !== newSubjectKey) {
            batch.update(docRef, { [`subjects.${subjectKey}`]: deleteField() });
            batch.update(docRef, { [`subjects.${newSubjectKey}`]: subjectData });
        } else {
             batch.update(docRef, { 
                [`subjects.${subjectKey}.name`]: newSubjectName,
                [`subjects.${subjectKey}.order`]: subjectData.order
            });
        }

        await batch.commit();

        return { success: true, message: "Subject updated successfully." };

    } catch(error) {
        console.error("Error updating subject: ", error);
        return { success: false, message: "Failed to update subject." };
    }
}

export async function deleteSubject(collectionType: CollectionType, classId: string, subjectKey: string) {
    if (!classId || !subjectKey) return { success: false, message: "Class ID and Subject Key are required." };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`subjects.${subjectKey}`]: deleteField() });
        return { success: true, message: "Subject deleted successfully." };
    } catch (error) {
        console.error("Error deleting subject:", error);
        return { success: false, message: "Failed to delete subject." };
    }
}


// ==================================
// Part Level Operations
// ==================================
export async function addPart(collectionType: CollectionType, classId: string, subjectKey: string, partName: string) {
    if (!classId || !subjectKey || !partName) return { success: false, message: "Class ID, Subject Key and Part Name are required." };
    
    const partKey = generateSlug(partName);
    const partData: TPart = {
        name: partName,
        createdAt: new Date().toISOString(),
        chapters: [],
        order: 99
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

export async function editPart(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string, newPartName: string, order: number) {
    if (!classId || !subjectKey || !partKey || !newPartName) return { success: false, message: "Required fields are missing." };

    const newPartKey = generateSlug(newPartName);

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };

        const data = docSnap.data();
        const partData = data.subjects?.[subjectKey]?.parts?.[partKey];
        if (!partData) return { success: false, message: "Part not found." };

        partData.name = newPartName;
        partData.order = isNaN(order) ? 99 : order;

        const batch = writeBatch(db);

        if (partKey !== newPartKey) {
            batch.update(docRef, { [`subjects.${subjectKey}.parts.${partKey}`]: deleteField() });
            batch.update(docRef, { [`subjects.${subjectKey}.parts.${newPartKey}`]: partData });
        } else {
            batch.update(docRef, { 
                [`subjects.${subjectKey}.parts.${partKey}.name`]: newPartName,
                [`subjects.${subjectKey}.parts.${partKey}.order`]: partData.order,
            });
        }

        await batch.commit();

        return { success: true, message: "Part updated successfully." };

    } catch (error) {
        console.error("Error updating part:", error);
        return { success: false, message: "Failed to update part." };
    }
}

export async function deletePart(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string) {
    if (!classId || !subjectKey || !partKey) return { success: false, message: "Class ID, Subject Key, and Part Key are required." };

    try {
        const docRef = getContentDocRef(collectionType, classId);
        await updateDoc(docRef, { [`subjects.${subjectKey}.parts.${partKey}`]: deleteField() });
        return { success: true, message: "Part deleted successfully." };
    } catch (error) {
        console.error("Error deleting part:", error);
        return { success: false, message: "Failed to delete part." };
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
    
    const chapterData: TChapter = {
        name: chapterName,
        createdAt: new Date().toISOString(),
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

export async function editChapter(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, newChapterName: string, pdfFile: File | null) {
    if (!classId || !subjectKey || chapterIndex === undefined || !newChapterName) {
        return { success: false, message: "Required fields are missing." };
    }

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        const subject = data.subjects?.[subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };
        
        const chaptersArray = partKey ? subject.parts?.[partKey]?.chapters : subject.chapters;
        if (!chaptersArray || !chaptersArray[chapterIndex]) return { success: false, message: "Chapter not found." };

        const chapterToUpdate = chaptersArray[chapterIndex];
        chapterToUpdate.name = newChapterName;

        if (pdfFile && pdfFile.size > 0) {
            const destination = `${collectionType}/${classId}/${subjectKey}/${partKey || 'chapters'}/${generateSlug(newChapterName)}.pdf`;
            chapterToUpdate.pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }
        
        chaptersArray[chapterIndex] = chapterToUpdate;

        const fieldPath = partKey ? `subjects.${subjectKey}.parts.${partKey}.chapters` : `subjects.${subjectKey}.chapters`;
        await updateDoc(docRef, { [fieldPath]: chaptersArray });

        return { success: true, message: "Chapter updated successfully." };

    } catch (error) {
        console.error("Error updating chapter:", error);
        return { success: false, message: "Failed to update chapter." };
    }
}


export async function deleteChapter(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterName: string) {
     if (!classId || !subjectKey || !chapterName) return { success: false, message: "Required fields are missing."};

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        const subject = data.subjects?.[subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };
        
        let chaptersArray;
        let fieldPath;

        if(partKey) {
            chaptersArray = subject.parts?.[partKey]?.chapters || [];
            fieldPath = `subjects.${subjectKey}.parts.${partKey}.chapters`;
        } else {
            chaptersArray = subject.chapters || [];
            fieldPath = `subjects.${subjectKey}.chapters`;
        }

        const chapterToDelete = chaptersArray.find((chap: any) => chap.name === chapterName);
        if(!chapterToDelete) return { success: false, message: "Chapter not found."};
        
        await updateDoc(docRef, { [fieldPath]: arrayRemove(chapterToDelete) });
        
        return { success: true, message: "Chapter deleted successfully." };

    } catch (error) {
        console.error("Error deleting chapter:", error);
        return { success: false, message: "Failed to delete chapter." };
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

    const topicData: TTopic = {
        name: topicName,
        createdAt: new Date().toISOString(),
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

export async function editTopic(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, topicIndex: number, newTopicName: string, pdfFile: File | null) {
    if (!classId || !subjectKey || chapterIndex === undefined || topicIndex === undefined || !newTopicName) {
        return { success: false, message: "Required fields are missing." };
    }

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        const subject = data.subjects?.[subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };
        
        const chaptersArray = partKey ? subject.parts?.[partKey]?.chapters : subject.chapters;
        if (!chaptersArray || !chaptersArray[chapterIndex] || !chaptersArray[chapterIndex].topics || !chaptersArray[chapterIndex].topics[topicIndex]) {
            return { success: false, message: "Topic not found." };
        }

        const topicToUpdate = chaptersArray[chapterIndex].topics[topicIndex];
        topicToUpdate.name = newTopicName;

        if (pdfFile && pdfFile.size > 0) {
            const destination = `${collectionType}/${classId}/${subjectKey}/${partKey || 'chapters'}/chapter-${chapterIndex}/${generateSlug(newTopicName)}.pdf`;
            topicToUpdate.pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }

        chaptersArray[chapterIndex].topics[topicIndex] = topicToUpdate;

        const fieldPath = partKey ? `subjects.${subjectKey}.parts.${partKey}.chapters` : `subjects.${subjectKey}.chapters`;
        await updateDoc(docRef, { [fieldPath]: chaptersArray });

        return { success: true, message: "Topic updated successfully." };

    } catch (error) {
        console.error("Error updating topic:", error);
        return { success: false, message: "Failed to update topic." };
    }
}


export async function deleteTopic(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, topicName: string) {
     if (!classId || !subjectKey || chapterIndex === undefined || !topicName) return { success: false, message: "Required fields are missing."};

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        const subject = data.subjects?.[subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };
        
        const chaptersArray = partKey ? subject.parts?.[partKey]?.chapters : subject.chapters;
        if (!chaptersArray || !chaptersArray[chapterIndex]) return { success: false, message: "Chapter not found." };

        const originalTopics = chaptersArray[chapterIndex].topics || [];
        const updatedTopics = originalTopics.filter((topic: any) => topic.name !== topicName);

        chaptersArray[chapterIndex].topics = updatedTopics;

        const fieldPath = partKey ? `subjects.${subjectKey}.parts.${partKey}.chapters` : `subjects.${subjectKey}.chapters`;
        await updateDoc(docRef, { [fieldPath]: chaptersArray });
        
        return { success: true, message: "Topic deleted successfully." };

    } catch (error) {
        console.error("Error deleting topic:", error);
        return { success: false, message: "Failed to delete topic." };
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
    
    const subTopicData: TSubTopic = {
        name: subTopicName,
        createdAt: new Date().toISOString(),
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


export async function editSubTopic(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, topicIndex: number, subTopicIndex: number, newSubTopicName: string, pdfFile: File | null) {
    if (!classId || !subjectKey || chapterIndex === undefined || topicIndex === undefined || subTopicIndex === undefined || !newSubTopicName) {
        return { success: false, message: "Required fields are missing." };
    }

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };

        const data = docSnap.data();
        const subject = data.subjects?.[subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };

        const chaptersArray = partKey ? subject.parts?.[partKey]?.chapters : subject.chapters;
        if (!chaptersArray || !chaptersArray[chapterIndex] || !chaptersArray[chapterIndex].topics || !chaptersArray[chapterIndex].topics[topicIndex] || !chaptersArray[chapterIndex].topics[topicIndex].subTopics || !chaptersArray[chapterIndex].topics[topicIndex].subTopics[subTopicIndex]) {
            return { success: false, message: "Sub-topic not found." };
        }

        const subTopicToUpdate = chaptersArray[chapterIndex].topics[topicIndex].subTopics[subTopicIndex];
        subTopicToUpdate.name = newSubTopicName;

        if (pdfFile && pdfFile.size > 0) {
            const destination = `${collectionType}/${classId}/${subjectKey}/${partKey || 'chapters'}/chapter-${chapterIndex}/topic-${topicIndex}/${generateSlug(newSubTopicName)}.pdf`;
            subTopicToUpdate.pdfUrl = await uploadFileToGCS(pdfFile, destination);
        }

        chaptersArray[chapterIndex].topics[topicIndex].subTopics[subTopicIndex] = subTopicToUpdate;

        const fieldPath = partKey ? `subjects.${subjectKey}.parts.${partKey}.chapters` : `subjects.${subjectKey}.chapters`;
        await updateDoc(docRef, { [fieldPath]: chaptersArray });

        return { success: true, message: "Sub-topic updated successfully." };

    } catch (error) {
        console.error("Error updating sub-topic:", error);
        return { success: false, message: "Failed to update sub-topic." };
    }
}

export async function deleteSubTopic(collectionType: CollectionType, classId: string, subjectKey: string, partKey: string | undefined, chapterIndex: number, topicIndex: number, subTopicName: string) {
    if (!classId || !subjectKey || chapterIndex === undefined || topicIndex === undefined || !subTopicName) return { success: false, message: "Required fields are missing."};

    try {
        const docRef = getContentDocRef(collectionType, classId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return { success: false, message: "Class not found." };
        
        const data = docSnap.data();
        const subject = data.subjects?.[subjectKey];
        if (!subject) return { success: false, message: "Subject not found." };

        const chaptersArray = partKey ? subject.parts?.[partKey]?.chapters : subject.chapters;
        if (!chaptersArray || !chaptersArray[chapterIndex] || !chaptersArray[chapterIndex].topics || !chaptersArray[chapterIndex].topics[topicIndex]) {
            return { success: false, message: "Topic not found." };
        }

        const originalSubTopics = chaptersArray[chapterIndex].topics[topicIndex].subTopics || [];
        const updatedSubTopics = originalSubTopics.filter((subTopic: any) => subTopic.name !== subTopicName);
        
        chaptersArray[chapterIndex].topics[topicIndex].subTopics = updatedSubTopics;

        const fieldPath = partKey ? `subjects.${subjectKey}.parts.${partKey}.chapters` : `subjects.${subjectKey}.chapters`;
        await updateDoc(docRef, { [fieldPath]: chaptersArray });

        return { success: true, message: "Sub-topic deleted successfully." };

    } catch (error) {
        console.error("Error deleting sub-topic:", error);
        return { success: false, message: "Failed to delete sub-topic." };
    }
}
