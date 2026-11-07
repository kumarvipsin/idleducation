// src/app/actions/enrollment.ts
'use server';

import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { serializeFirestoreData } from './utils';
import { enrollmentSchema, type EnrollmentFormValues } from "@/types/enrollment";

/**
 * Submit a student enrollment from website or branch page
 */
export async function submitEnrollment(data: EnrollmentFormValues) {
  const validation = enrollmentSchema.safeParse(data);
  if (!validation.success) {
    const errorMsg = validation.error.errors[0]?.message || "Invalid data provided.";
    return { success: false, message: errorMsg };
  }

  try {
    const cleanData = validation.data;
    
    // Normalize branchSlug if not present
    let branchSlug = cleanData.branchSlug;
    if (!branchSlug && cleanData.branch) {
      const lower = cleanData.branch.toLowerCase();
      if (lower.includes('mangol')) branchSlug = 'mangolpuri';
      else if (lower.includes('budh')) branchSlug = 'budh-vihar';
      else if (lower.includes('krishan')) branchSlug = 'krishan-vihar';
      else if (lower.includes('mukherjee')) branchSlug = 'mukherjee-nagar';
      else if (lower.includes('rohini')) branchSlug = 'rohini';
      else if (lower.includes('online')) branchSlug = 'online';
      else branchSlug = 'other';
    }

    const docRef = await addDoc(collection(db, "enrollments"), {
      ...cleanData,
      branchSlug: branchSlug || 'general',
      status: 'new',
      createdAt: serverTimestamp(),
    });

    return { 
      success: true, 
      message: "Congratulations! Your enrollment request has been submitted successfully. Our branch counsellor will contact you shortly.",
      id: docRef.id
    };
  } catch (error) {
    console.error("Error submitting enrollment:", error);
    return { 
      success: false, 
      message: "Failed to submit enrollment. Please try again later or call our helpline." 
    };
  }
}

/**
 * Fetch all enrollments for admin panel
 */
export async function getEnrollments() {
  try {
    const q = query(collection(db, "enrollments"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...serializeFirestoreData(docSnap.data()),
    }));
    return { success: true, data: enrollments };
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return { success: false, message: "Failed to fetch enrollments." };
  }
}

/**
 * Update enrollment status in admin panel
 */
export async function updateEnrollmentStatus(id: string, status: string) {
  try {
    const docRef = doc(db, "enrollments", id);
    await updateDoc(docRef, { 
      status,
      updatedAt: serverTimestamp() 
    });
    return { success: true, message: `Enrollment marked as ${status}.` };
  } catch (error) {
    console.error("Error updating enrollment status:", error);
    return { success: false, message: "Failed to update enrollment status." };
  }
}

/**
 * Delete enrollment from admin panel
 */
export async function deleteEnrollment(id: string) {
  try {
    const docRef = doc(db, "enrollments", id);
    await deleteDoc(docRef);
    return { success: true, message: "Enrollment deleted successfully." };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return { success: false, message: "Failed to delete enrollment." };
  }
}
