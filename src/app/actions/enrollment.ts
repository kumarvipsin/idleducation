// src/app/actions/enrollment.ts
'use server';

import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { serializeFirestoreData } from './utils';
import { enrollmentSchema, type EnrollmentFormValues } from "@/types/enrollment";
import { getServerAdminContext, scopeRecordsToBranchAdmin } from '@/lib/server-admin-auth';
import { normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';

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
    
    const branchSlug = normalizeBranchId(cleanData.branchSlug || cleanData.branch) || 'general';

    const docRef = await addDoc(collection(db, "enrollments"), {
      ...cleanData,
      branchSlug,
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
export async function getEnrollments(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const q = query(collection(db, "enrollments"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const enrollments = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...serializeFirestoreData(docSnap.data()),
    }));
    return {
      success: true,
      data: scopeRecordsToBranchAdmin(enrollments, adminCtx, { narrowBranchId }),
    };
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
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const docRef = doc(db, "enrollments", id);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      return { success: false, message: "Enrollment not found." };
    }
    if (adminCtx.isBranchAdmin && !recordMatchesBranch(existing.data(), adminCtx.branchId)) {
      return { success: false, message: "Forbidden: Enrollment belongs to a different branch." };
    }
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
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const docRef = doc(db, "enrollments", id);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      return { success: false, message: "Enrollment not found." };
    }
    if (adminCtx.isBranchAdmin && !recordMatchesBranch(existing.data(), adminCtx.branchId)) {
      return { success: false, message: "Forbidden: Enrollment belongs to a different branch." };
    }
    await deleteDoc(docRef);
    return { success: true, message: "Enrollment deleted successfully." };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return { success: false, message: "Failed to delete enrollment." };
  }
}
