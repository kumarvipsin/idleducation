
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy, where, getDoc } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';
import { revalidatePath } from 'next/cache';

const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export async function getBlogPosts() {
    try {
        const blogQuery = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(blogQuery);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: posts };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { success: false, message: "Failed to fetch blog posts." };
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return { success: false, message: "Post not found." };
        const post = { id: querySnapshot.docs[0].id, ...serializeFirestoreData(querySnapshot.docs[0].data()) };
        return { success: true, data: post };
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return { success: false, message: "Failed to fetch blog post." };
    }
}

export async function addBlogPost(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;
  
  const postData: any = {
    title: rawData.title as string,
    slug: generateSlug(rawData.title as string),
    category: rawData.category as string,
    excerpt: rawData.excerpt as string,
    content: rawData.content as string,
    author: rawData.author as string,
    date: rawData.date as string,
    createdAt: serverTimestamp(),
  };

  try {
    if (imageFile && imageFile.size > 0) {
      const destination = `blog/${Date.now()}-${imageFile.name}`;
      postData.imageUrl = await uploadFileToGCS(imageFile, destination);
    }
    
    await addDoc(collection(db, "blogPosts"), postData);
    revalidatePath('/blog');
    return { success: true, message: "Blog post added successfully." };
  } catch (error: any) {
    console.error("Error adding blog post:", error);
    return { success: false, message: `Failed to add post: ${error.message}` };
  }
}

export async function editBlogPost(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;
  
  const postData: any = {
    title: rawData.title as string,
    slug: generateSlug(rawData.title as string),
    category: rawData.category as string,
    excerpt: rawData.excerpt as string,
    content: rawData.content as string,
    author: rawData.author as string,
    date: rawData.date as string,
  };

  try {
    if (imageFile && imageFile.size > 0) {
      const destination = `blog/${id}-${imageFile.name}`;
      postData.imageUrl = await uploadFileToGCS(imageFile, destination);
    }

    const docRef = doc(db, "blogPosts", id);
    await updateDoc(docRef, postData);

    revalidatePath('/blog');
    return { success: true, message: "Blog post updated successfully." };
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return { success: false, message: `Failed to update post: ${error.message}` };
  }
}

export async function deleteBlogPost(id: string) {
    try {
        const docRef = doc(db, "blogPosts", id);
        await deleteDoc(docRef);
        revalidatePath('/blog');
        return { success: true, message: "Blog post deleted successfully." };
    } catch (error: any) {
        console.error("Error deleting blog post:", error);
        return { success: false, message: `Failed to delete post: ${error.message}` };
    }
}
