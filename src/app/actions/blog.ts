'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, where, getDoc } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';
import { CBSE_SYLLABUS_POSTS } from "@/lib/syllabus-blogs";

const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export async function getBlogPosts() {
    try {
        const blogQuery = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(blogQuery);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        
        // Merge with CBSE Syllabus curated posts if not already present
        const existingSlugs = new Set(posts.map(p => p.slug));
        const missingSyllabusPosts = CBSE_SYLLABUS_POSTS.filter(sp => !existingSlugs.has(sp.slug));
        const combined = [...posts, ...missingSyllabusPosts];

        return { success: true, data: combined };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { success: true, data: CBSE_SYLLABUS_POSTS };
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const post = { id: querySnapshot.docs[0].id, ...serializeFirestoreData(querySnapshot.docs[0].data()) };
            return { success: true, data: post };
        }

        // Fallback to curated CBSE syllabus posts
        const syllabusPost = CBSE_SYLLABUS_POSTS.find(p => p.slug === slug);
        if (syllabusPost) {
            return { success: true, data: syllabusPost };
        }

        return { success: false, message: "Post not found." };
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        const syllabusPost = CBSE_SYLLABUS_POSTS.find(p => p.slug === slug);
        if (syllabusPost) {
            return { success: true, data: syllabusPost };
        }
        return { success: false, message: "Failed to fetch blog post." };
    }
}

export async function addBlogPost(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;
  const authorRole = (rawData.authorRole as string) || 'admin';
  
  const postData: any = {
    title: rawData.title as string,
    slug: generateSlug(rawData.title as string),
    category: rawData.category as string,
    excerpt: rawData.excerpt as string,
    content: rawData.content as string,
    author: rawData.author as string,
    authorRole,
    authorId: (rawData.authorId as string) || '',
    date: rawData.date as string,
    // Admin posts are auto-approved; teacher/student posts need approval
    status: authorRole === 'admin' ? 'approved' : 'pending',
    createdAt: serverTimestamp(),
  };

  try {
    if (imageFile && imageFile.size > 0) {
      const destination = `blog/${Date.now()}-${imageFile.name}`;
      postData.imageUrl = await uploadFileToGCS(imageFile, destination);
    }
    
    await addDoc(collection(db, "blogPosts"), postData);
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/blog');
    
    const msg = authorRole === 'admin'
      ? "Blog post published successfully."
      : "Blog post submitted for admin approval.";
    return { success: true, message: msg };
  } catch (error: any) {
    console.error("Error adding blog post:", error);
    return { success: false, message: `Failed to add post: ${error.message}` };
  }
}

export async function editBlogPost(id: string, formData: FormData, userRole?: string, userId?: string, userName?: string) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;
  
  try {
    const docRef = doc(db, "blogPosts", id);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      return { success: false, message: "Blog post not found." };
    }
    const existingData = existingSnap.data();

    // Permissions check: Admin can edit any post. Teacher/Student can only edit their own PENDING post.
    if (userRole && userRole !== 'admin') {
      // Block editing approved posts — only admin can edit after approval
      if (existingData.status === 'approved') {
        return { success: false, message: "This post has been approved. Only admin can edit approved posts." };
      }
      // Ensure role matches the post's authorRole (if defined)
      if (existingData.authorRole && existingData.authorRole !== userRole) {
        return { success: false, message: "Unauthorized: Role mismatch – cannot edit posts of other roles." };
      }
      const isOwnerById = userId && existingData.authorId && existingData.authorId === userId;
      const isOwnerByName = userName && existingData.author && existingData.author.toLowerCase() === userName.toLowerCase();
      if (!isOwnerById && !isOwnerByName) {
        return { success: false, message: "Unauthorized: You can only edit your own blog posts." };
      }
    }
  
    const postData: any = {
      title: rawData.title as string,
      slug: generateSlug(rawData.title as string),
      category: rawData.category as string,
      excerpt: rawData.excerpt as string,
      content: rawData.content as string,
      author: rawData.author as string,
      date: rawData.date as string,
    };

    if (rawData.authorRole) {
      postData.authorRole = rawData.authorRole as string;
    }
    if (rawData.authorId) {
      postData.authorId = rawData.authorId as string;
    }

    if (imageFile && imageFile.size > 0) {
      const destination = `blog/${id}-${imageFile.name}`;
      postData.imageUrl = await uploadFileToGCS(imageFile, destination);
    }

    await updateDoc(docRef, postData);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/blog');
    
    return { success: true, message: "Blog post updated successfully." };
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return { success: false, message: `Failed to update post: ${error.message}` };
  }
}

export async function deleteBlogPost(id: string, userRole?: string) {
    try {
        if (userRole && userRole !== 'admin') {
            return { success: false, message: "Unauthorized: Only administrators can delete blog posts." };
        }

        const docRef = doc(db, "blogPosts", id);
        await deleteDoc(docRef);
        
        const { revalidatePath } = await import('next/cache');
        revalidatePath('/blog');
        
        return { success: true, message: "Blog post deleted successfully." };
    } catch (error: any) {
        console.error("Error deleting blog post:", error);
        return { success: false, message: `Failed to delete post: ${error.message}` };
    }
}

export async function approveBlogPost(id: string, userRole?: string) {
  try {
    if (userRole && userRole !== 'admin') {
      return { success: false, message: "Unauthorized: Only administrators can approve blog posts." };
    }

    const docRef = doc(db, "blogPosts", id);
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      return { success: false, message: "Blog post not found." };
    }

    await updateDoc(docRef, { status: 'approved' });

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/blog');

    return { success: true, message: "Blog post approved and published successfully." };
  } catch (error: any) {
    console.error("Error approving blog post:", error);
    return { success: false, message: `Failed to approve post: ${error.message}` };
  }
}
