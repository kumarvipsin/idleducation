// src/app/actions/reference-books.ts
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';

/**
 * Fetches all reference books from Firestore, ordered by creation date.
 */
export async function getReferenceBooks() {
  try {
    const booksQuery = query(collection(db, "referenceBooks"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(booksQuery);
    const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: books };
  } catch (error) {
    console.error("Error fetching reference books:", error);
    return { success: false, message: "Failed to fetch reference books." };
  }
}

/**
 * Adds a new reference book to Firestore.
 */
export async function addReferenceBook(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;

  const bookData: any = {
    title: rawData.title as string,
    author: rawData.author as string,
    price: parseFloat(rawData.price as string) || 0,
    originalPrice: parseFloat(rawData.originalPrice as string) || 0,
    rating: parseFloat(rawData.rating as string) || 0,
    class: rawData.class as string,
    subject: rawData.subject as string,
    edition: rawData.edition as string,
    set: rawData.set as string,
    category: rawData.category as string,
    buyLink: rawData.buyLink as string || '',
    createdAt: serverTimestamp(),
  };

  if(bookData.category === 'IDL Store' && rawData.productId) {
    bookData.productId = parseInt(rawData.productId as string, 10);
  }

  try {
    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      const destination = `reference-books/${Date.now()}-${imageFile.name}`;
      imageUrl = await uploadFileToGCS(imageFile, destination);
    }
    bookData.imageUrl = imageUrl;

    await addDoc(collection(db, "referenceBooks"), bookData);
    return { success: true, message: "Reference book added successfully." };
  } catch (error) {
    console.error("Error adding reference book:", error);
    return { success: false, message: "Failed to add reference book." };
  }
}

/**
 * Updates an existing reference book in Firestore.
 */
export async function editReferenceBook(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;

  const bookData: any = {
    title: rawData.title as string,
    author: rawData.author as string,
    price: parseFloat(rawData.price as string),
    originalPrice: parseFloat(rawData.originalPrice as string),
    rating: parseFloat(rawData.rating as string),
    class: rawData.class as string,
    subject: rawData.subject as string,
    edition: rawData.edition as string,
    set: rawData.set as string,
    category: rawData.category as string,
    buyLink: rawData.buyLink as string || '',
  };

  if(bookData.category === 'IDL Store' && rawData.productId) {
    bookData.productId = parseInt(rawData.productId as string, 10);
  }

  try {
    if (imageFile && imageFile.size > 0) {
      const destination = `reference-books/${id}-${imageFile.name}`;
      bookData.imageUrl = await uploadFileToGCS(imageFile, destination);
    } else if (rawData.removePhoto === 'true') {
        bookData.imageUrl = '';
    }

    const docRef = doc(db, "referenceBooks", id);
    await updateDoc(docRef, bookData);
    return { success: true, message: "Reference book updated successfully." };
  } catch (error) {
    console.error("Error updating reference book:", error);
    return { success: false, message: "Failed to update reference book." };
  }
}

/**
 * Deletes a reference book from Firestore.
 */
export async function deleteReferenceBook(id: string) {
  try {
    const docRef = doc(db, "referenceBooks", id);
    await deleteDoc(docRef);
    return { success: true, message: "Reference book deleted successfully." };
  } catch (error) {
    console.error("Error deleting reference book:", error);
    return { success: false, message: "Failed to delete reference book." };
  }
}
