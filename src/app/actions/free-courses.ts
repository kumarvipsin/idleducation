// src/app/actions/free-courses.ts
'use server';
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, getDoc } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all free courses from Firestore, ordered by creation date.
 */
export async function getFreeCourses() {
    try {
        const coursesQuery = query(collection(db, "freeCourses"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(coursesQuery);
        const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: courses };
    } catch (error) {
        console.error("Error fetching free courses:", error);
        return { success: false, message: "Failed to fetch free courses." };
    }
}

/**
 * Fetches a single free course by its ID.
 */
export async function getFreeCourseById(id: string) {
    try {
        const docRef = doc(db, "freeCourses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, data: { id: docSnap.id, ...serializeFirestoreData(docSnap.data()) } };
        } else {
            return { success: false, message: "Course not found." };
        }
    } catch (error) {
        console.error("Error fetching free course:", error);
        return { success: false, message: "Failed to fetch course details." };
    }
}

/**
 * Adds a new free course to Firestore, including uploading a cover image to GCS.
 */
export async function addFreeCourse(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const coverImageFile = rawData.coverImage as File | null;
  
  const courseData: any = {
    title: rawData.title as string,
    class: rawData.class as string,
    board: rawData.board as string,
    subject: rawData.subject as string,
    medium: rawData.medium as string,
    batchName: rawData.batchName as string,
    validity: rawData.validity as string,
    price: parseFloat(rawData.price as string) || 0,
    originalPrice: parseFloat(rawData.originalPrice as string) || 0,
    description: rawData.description as string,
    status: (rawData.status as 'active' | 'inactive') || 'active',
    chapters: [],
    createdAt: serverTimestamp(),
  };

  try {
    if (coverImageFile && coverImageFile.size > 0) {
      const destination = `free-courses/${Date.now()}-${coverImageFile.name}`;
      courseData.coverImageUrl = await uploadFileToGCS(coverImageFile, destination);
    }
    
    // Parse chapters and videos from nested form field names (e.g., chapters[0].name)
    const chapterEntries: { [key: number]: { name?: string; videos: { [key: number]: { title?: string; youtubeLink?: string } } } } = {};
    for (const [key, value] of formData.entries()) {
        const chapterMatch = key.match(/^chapters\[(\d+)\]\.name$/);
        if (chapterMatch) {
            const index = parseInt(chapterMatch[1], 10);
            if (!chapterEntries[index]) chapterEntries[index] = { videos: {} };
            chapterEntries[index].name = value as string;
        }

        const videoMatch = key.match(/^chapters\[(\d+)\]\.videos\[(\d+)\]\.(title|youtubeLink)$/);
        if (videoMatch) {
            const chapIndex = parseInt(videoMatch[1], 10);
            const videoIndex = parseInt(videoMatch[2], 10);
            const field = videoMatch[3];
            if (!chapterEntries[chapIndex]) chapterEntries[chapIndex] = { videos: {} };
            if (!chapterEntries[chapIndex].videos[videoIndex]) chapterEntries[chapIndex].videos[videoIndex] = {};
            chapterEntries[chapIndex].videos[videoIndex][field as 'title' | 'youtubeLink'] = value as string;
        }
    }

    for (const index in chapterEntries) {
        const chapterEntry = chapterEntries[index];
        if (!chapterEntry.name) continue;

        const videos = [];
        for (const videoIndex in chapterEntry.videos) {
            const videoEntry = chapterEntry.videos[videoIndex];
            if (videoEntry.title && videoEntry.youtubeLink) {
                videos.push({
                    title: videoEntry.title,
                    youtubeLink: videoEntry.youtubeLink,
                    order: parseInt(videoIndex, 10),
                });
            }
        }
        courseData.chapters.push({ name: chapterEntry.name, videos, status: 'show' });
    }

    await addDoc(collection(db, "freeCourses"), courseData);
    revalidatePath('/free-courses');
    return { success: true, message: "Free course added successfully." };
  } catch (error: any) {
    console.error("Error adding free course:", error);
    return { success: false, message: `Failed to add free course: ${error.message}` };
  }
}

/**
 * Updates an existing free course in Firestore.
 */
export async function editFreeCourse(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const coverImageFile = rawData.coverImage as File | null;
  
  const courseData: any = {
    title: rawData.title as string,
    class: rawData.class as string,
    board: rawData.board as string,
    subject: rawData.subject as string,
    medium: rawData.medium as string,
    batchName: rawData.batchName as string,
    validity: rawData.validity as string,
    price: parseFloat(rawData.price as string) || 0,
    originalPrice: parseFloat(rawData.originalPrice as string) || 0,
    description: rawData.description as string,
    status: (rawData.status as 'active' | 'inactive') || 'active',
    chapters: [],
  };

  try {
    if (coverImageFile && coverImageFile.size > 0) {
      const destination = `free-courses/${id}/${coverImageFile.name}`;
      courseData.coverImageUrl = await uploadFileToGCS(coverImageFile, destination);
    } else if (rawData.existingCoverImageUrl) {
      courseData.coverImageUrl = rawData.existingCoverImageUrl as string;
    }

    const chapterEntries: { [key: number]: { name?: string; videos: { [key: number]: { title?: string; youtubeLink?: string } } } } = {};
    for (const [key, value] of formData.entries()) {
      const chapterMatch = key.match(/^chapters\[(\d+)\]\.name$/);
        if (chapterMatch) {
            const index = parseInt(chapterMatch[1], 10);
            if (!chapterEntries[index]) chapterEntries[index] = { videos: {} };
            chapterEntries[index].name = value as string;
        }

        const videoMatch = key.match(/^chapters\[(\d+)\]\.videos\[(\d+)\]\.(title|youtubeLink)$/);
        if (videoMatch) {
            const chapIndex = parseInt(videoMatch[1], 10);
            const videoIndex = parseInt(videoMatch[2], 10);
            const field = videoMatch[3];
            if (!chapterEntries[chapIndex]) chapterEntries[chapIndex] = { videos: {} };
            if (!chapterEntries[chapIndex].videos[videoIndex]) chapterEntries[chapIndex].videos[videoIndex] = {};
            chapterEntries[chapIndex].videos[videoIndex][field as 'title' | 'youtubeLink'] = value as string;
        }
    }

    for (const index in chapterEntries) {
        const chapterEntry = chapterEntries[index];
        if (!chapterEntry.name) continue;

        const videos = [];
        for (const videoIndex in chapterEntry.videos) {
            const videoEntry = chapterEntry.videos[videoIndex];
            if (videoEntry.title && videoEntry.youtubeLink) {
                videos.push({
                    title: videoEntry.title,
                    youtubeLink: videoEntry.youtubeLink,
                    order: parseInt(videoIndex, 10),
                });
            }
        }
        courseData.chapters.push({ name: chapterEntry.name, videos, status: 'show' });
    }

    const docRef = doc(db, "freeCourses", id);
    await updateDoc(docRef, courseData);

    revalidatePath('/free-courses');
    return { success: true, message: "Free course updated successfully." };
  } catch (error: any) {
    console.error("Error updating free course:", error);
    return { success: false, message: `Failed to update free course: ${error.message}` };
  }
}

/**
 * Deletes a free course from Firestore.
 */
export async function deleteFreeCourse(id: string) {
    try {
        const docRef = doc(db, "freeCourses", id);
        await deleteDoc(docRef);
        revalidatePath('/free-courses');
        return { success: true, message: "Free course deleted successfully." };
    } catch (error: any) {
        console.error("Error deleting free course:", error);
        return { success: false, message: `Failed to delete free course: ${error.message}` };
    }
}
