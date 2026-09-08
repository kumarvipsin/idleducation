'use server';
/**
 * @fileOverview Server actions for managing free courses and YouTube educational library.
 */
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  getDoc,
  where,
} from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';
import { parseYouTubeUrl } from '@/lib/youtube';
import type { TFreeCourse } from './types';

// Helper to generate URL-safe slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || 'course';
}

/**
 * Normalizes course data ensuring YouTube metadata and backward-compatible fields are present.
 */
function normalizeCourseRecord(id: string, data: any): TFreeCourse {
  const serialized = serializeFirestoreData(data);
  const ytResult = serialized.youtubeUrl ? parseYouTubeUrl(serialized.youtubeUrl) : null;

  const fallbackThumbnail = ytResult?.thumbnailUrl ||
    (serialized.coverImageUrl ? serialized.coverImageUrl : undefined);

  return {
    id,
    title: serialized.title || '',
    slug: serialized.slug || slugify(serialized.title || id),
    class: serialized.class || 'Class 9',
    board: serialized.board || 'CBSE',
    subject: serialized.subject || 'General',
    chapter: serialized.chapter || (serialized.chapters?.[0]?.name ?? ''),
    category: serialized.category || 'Free Course',
    medium: serialized.medium || 'English / Hindi',
    batchName: serialized.batchName || 'Free YouTube Batch',
    validity: serialized.validity || 'Lifetime',
    price: typeof serialized.price === 'number' ? serialized.price : 0,
    originalPrice: typeof serialized.originalPrice === 'number' ? serialized.originalPrice : 0,
    description: serialized.description || '',
    shortDescription: serialized.shortDescription || serialized.description || '',
    youtubeUrl: serialized.youtubeUrl || '',
    youtubeType: serialized.youtubeType || ytResult?.type || 'video',
    youtubeVideoId: serialized.youtubeVideoId || ytResult?.videoId || '',
    youtubePlaylistId: serialized.youtubePlaylistId || ytResult?.playlistId || '',
    thumbnailUrl: serialized.thumbnailUrl || fallbackThumbnail || '',
    coverImageUrl: serialized.coverImageUrl || fallbackThumbnail || '',
    status: serialized.status || (serialized.publishStatus === 'published' ? 'active' : 'active'),
    publishStatus: serialized.publishStatus || (serialized.status === 'inactive' ? 'unpublished' : 'published'),
    displayOrder: typeof serialized.displayOrder === 'number' ? serialized.displayOrder : 0,
    isFeatured: Boolean(serialized.isFeatured),
    publishedAt: serialized.publishedAt || serialized.createdAt || '',
    chapters: Array.isArray(serialized.chapters) ? serialized.chapters : [],
    createdAt: serialized.createdAt || '',
    updatedAt: serialized.updatedAt || '',
  };
}

/**
 * Fetches free courses for the student public UI.
 * Returns only published, active content ordered by displayOrder (asc) then createdAt (desc).
 */
export async function getFreeCourses() {
  try {
    const coursesQuery = query(collection(db, "freeCourses"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(coursesQuery);
    
    const allCourses = querySnapshot.docs.map(doc => normalizeCourseRecord(doc.id, doc.data()));

    // Filter for publicly visible courses
    const visibleCourses = allCourses.filter(course => {
      const isArchived = course.publishStatus === 'archived';
      const isDraft = course.publishStatus === 'draft';
      const isUnpublished = course.publishStatus === 'unpublished';
      const isInactive = course.status === 'inactive';
      return !isArchived && !isDraft && !isUnpublished && !isInactive;
    });

    // Sort by displayOrder ascending, then createdAt descending
    visibleCourses.sort((a, b) => {
      const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return { success: true, data: visibleCourses };
  } catch (error) {
    console.error("Error fetching free courses:", error);
    return { success: false, message: "Failed to fetch free courses." };
  }
}

/**
 * Fetches all courses for the Admin panel (including drafts, unpublished, and archived).
 */
export async function getAdminFreeCourses() {
  try {
    const coursesQuery = query(collection(db, "freeCourses"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(coursesQuery);
    
    const courses = querySnapshot.docs.map(doc => normalizeCourseRecord(doc.id, doc.data()));

    courses.sort((a, b) => {
      const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching admin free courses:", error);
    return { success: false, message: "Failed to fetch free courses." };
  }
}

/**
 * Fetches a single free course by ID.
 */
export async function getFreeCourseById(id: string) {
  try {
    const docRef = doc(db, "freeCourses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: normalizeCourseRecord(docSnap.id, docSnap.data()) };
    } else {
      return { success: false, message: "Course not found." };
    }
  } catch (error) {
    console.error("Error fetching free course:", error);
    return { success: false, message: "Failed to fetch course details." };
  }
}

/**
 * Adds a new free course to Firestore with automatic YouTube parsing and thumbnail handling.
 */
export async function addFreeCourse(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const coverImageFile = rawData.coverImage as File | null;

  const youtubeUrl = (rawData.youtubeUrl as string)?.trim() || '';
  const ytParsed = youtubeUrl ? parseYouTubeUrl(youtubeUrl) : null;

  const title = (rawData.title as string)?.trim() || '';
  const slug = rawData.slug ? String(rawData.slug).trim() : slugify(title);

  const courseData: any = {
    title,
    slug,
    class: (rawData.class as string)?.trim() || 'Class 9',
    board: (rawData.board as string)?.trim() || 'CBSE',
    subject: (rawData.subject as string)?.trim() || 'General',
    chapter: (rawData.chapter as string)?.trim() || '',
    category: (rawData.category as string)?.trim() || 'Free Course',
    medium: (rawData.medium as string)?.trim() || 'Hindi / English',
    batchName: (rawData.batchName as string)?.trim() || 'Free YouTube Batch',
    validity: (rawData.validity as string)?.trim() || 'Lifetime',
    price: 0,
    originalPrice: parseFloat(rawData.originalPrice as string) || 0,
    description: (rawData.description as string)?.trim() || '',
    shortDescription: (rawData.shortDescription as string)?.trim() || (rawData.description as string)?.trim() || '',
    youtubeUrl: ytParsed?.normalizedUrl || youtubeUrl,
    youtubeType: (rawData.youtubeType as string) || ytParsed?.type || 'video',
    youtubeVideoId: ytParsed?.videoId || '',
    youtubePlaylistId: ytParsed?.playlistId || '',
    thumbnailUrl: (rawData.thumbnailUrl as string) || ytParsed?.thumbnailUrl || '',
    status: (rawData.status as 'active' | 'inactive') || (rawData.publishStatus === 'draft' ? 'inactive' : 'active'),
    publishStatus: (rawData.publishStatus as 'published' | 'draft' | 'unpublished' | 'archived') || 'published',
    displayOrder: parseInt(rawData.displayOrder as string, 10) || 0,
    isFeatured: rawData.isFeatured === 'true' || rawData.isFeatured === true,
    chapters: [],
    publishedAt: rawData.publishStatus === 'draft' ? null : new Date().toISOString(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    if (coverImageFile && coverImageFile.size > 0) {
      const destination = `free-courses/${Date.now()}-${coverImageFile.name}`;
      courseData.coverImageUrl = await uploadFileToGCS(coverImageFile, destination);
      if (!courseData.thumbnailUrl) {
        courseData.thumbnailUrl = courseData.coverImageUrl;
      }
    } else if (courseData.thumbnailUrl) {
      courseData.coverImageUrl = courseData.thumbnailUrl;
    }

    // Parse chapters and videos if provided
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

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/free-courses');
    revalidatePath('/admin/free-courses');

    return { success: true, message: "Free course published successfully." };
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

  const youtubeUrl = (rawData.youtubeUrl as string)?.trim() || '';
  const ytParsed = youtubeUrl ? parseYouTubeUrl(youtubeUrl) : null;

  const title = (rawData.title as string)?.trim() || '';
  const slug = rawData.slug ? String(rawData.slug).trim() : slugify(title);

  const courseData: any = {
    title,
    slug,
    class: (rawData.class as string)?.trim() || 'Class 9',
    board: (rawData.board as string)?.trim() || 'CBSE',
    subject: (rawData.subject as string)?.trim() || 'General',
    chapter: (rawData.chapter as string)?.trim() || '',
    category: (rawData.category as string)?.trim() || 'Free Course',
    medium: (rawData.medium as string)?.trim() || 'Hindi / English',
    batchName: (rawData.batchName as string)?.trim() || 'Free YouTube Batch',
    validity: (rawData.validity as string)?.trim() || 'Lifetime',
    price: 0,
    originalPrice: parseFloat(rawData.originalPrice as string) || 0,
    description: (rawData.description as string)?.trim() || '',
    shortDescription: (rawData.shortDescription as string)?.trim() || (rawData.description as string)?.trim() || '',
    youtubeUrl: ytParsed?.normalizedUrl || youtubeUrl,
    youtubeType: (rawData.youtubeType as string) || ytParsed?.type || 'video',
    youtubeVideoId: ytParsed?.videoId || '',
    youtubePlaylistId: ytParsed?.playlistId || '',
    status: (rawData.status as 'active' | 'inactive') || (rawData.publishStatus === 'draft' ? 'inactive' : 'active'),
    publishStatus: (rawData.publishStatus as 'published' | 'draft' | 'unpublished' | 'archived') || 'published',
    displayOrder: parseInt(rawData.displayOrder as string, 10) || 0,
    isFeatured: rawData.isFeatured === 'true' || rawData.isFeatured === true,
    chapters: [],
    updatedAt: serverTimestamp(),
  };

  if (rawData.thumbnailUrl) {
    courseData.thumbnailUrl = rawData.thumbnailUrl;
  } else if (ytParsed?.thumbnailUrl) {
    courseData.thumbnailUrl = ytParsed.thumbnailUrl;
  }

  try {
    if (coverImageFile && coverImageFile.size > 0) {
      const destination = `free-courses/${id}/${coverImageFile.name}`;
      courseData.coverImageUrl = await uploadFileToGCS(coverImageFile, destination);
      courseData.thumbnailUrl = courseData.coverImageUrl;
    } else if (rawData.existingCoverImageUrl) {
      courseData.coverImageUrl = rawData.existingCoverImageUrl as string;
    } else if (courseData.thumbnailUrl) {
      courseData.coverImageUrl = courseData.thumbnailUrl;
    }

    // Parse chapters and videos
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

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/free-courses');
    revalidatePath('/admin/free-courses');

    return { success: true, message: "Free course updated successfully." };
  } catch (error: any) {
    console.error("Error updating free course:", error);
    return { success: false, message: `Failed to update free course: ${error.message}` };
  }
}

/**
 * Toggles a course's publish status between 'published' and 'unpublished'.
 */
export async function togglePublishStatus(id: string, currentStatus: string) {
  try {
    const nextStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    const nextActive = nextStatus === 'published' ? 'active' : 'inactive';

    const docRef = doc(db, "freeCourses", id);
    await updateDoc(docRef, {
      publishStatus: nextStatus,
      status: nextActive,
      updatedAt: serverTimestamp(),
    });

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/free-courses');
    revalidatePath('/admin/free-courses');

    return { success: true, message: `Course ${nextStatus === 'published' ? 'published' : 'unpublished'} successfully.` };
  } catch (error: any) {
    console.error("Error toggling publish status:", error);
    return { success: false, message: `Failed to update status: ${error.message}` };
  }
}

/**
 * Deletes or archives a free course from Firestore.
 */
export async function deleteFreeCourse(id: string) {
  try {
    const docRef = doc(db, "freeCourses", id);
    await deleteDoc(docRef);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/free-courses');
    revalidatePath('/admin/free-courses');

    return { success: true, message: "Free course removed successfully." };
  } catch (error: any) {
    console.error("Error deleting free course:", error);
    return { success: false, message: `Failed to delete free course: ${error.message}` };
  }
}
