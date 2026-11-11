// src/app/actions/admin.ts
'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, query, where, getDocs, updateDoc, Timestamp, orderBy, deleteDoc, writeBatch,getCountFromServer, deleteField } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';
import { signUpUser } from './auth';
import { getServerAdminContext, scopeRecordsToBranchAdmin, type ServerAdminContext } from '@/lib/server-admin-auth';
import { getBranchDisplayName, normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';

function assertRecordInAdminBranch(
  adminCtx: ServerAdminContext | null,
  docData: Record<string, any> | null | undefined,
  resourceLabel = 'record'
): string | null {
  if (!adminCtx) {
    return 'Unauthorized: Valid administrator session required.';
  }
  if (!adminCtx.isBranchAdmin) return null;
  if (!docData || !recordMatchesBranch(docData, adminCtx.branchId)) {
    return `Forbidden: Cannot access or modify a ${resourceLabel} outside ${adminCtx.branchName}.`;
  }
  return null;
}

// User Management
export async function getPendingUsers(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required.", data: [] };
    }
    const usersQuery = query(collection(db, "users"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(usersQuery);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    const scoped = scopeRecordsToBranchAdmin(users, adminCtx, { narrowBranchId }).filter((u: any) =>
      adminCtx.isBranchAdmin ? String(u.role || '').toLowerCase() !== 'admin' : true
    );
    return { success: true, data: scoped };
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return { success: false, message: "Failed to fetch pending users." };
  }
}

export async function approveUser(userId: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const userDocRef = doc(db, "users", userId);
    if (adminCtx.isBranchAdmin) {
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) return { success: false, message: "User not found." };
      const err = assertRecordInAdminBranch(adminCtx, snap.data(), 'user');
      if (err) return { success: false, message: err };
    }
    await updateDoc(userDocRef, { status: 'approved' });
    return { success: true, message: "User approved successfully!" };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, message: "Failed to approve user." };
  }
}

export async function denyUser(userId: string) {
  try {
    const adminCtx = await getServerAdminContext();
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const err = assertRecordInAdminBranch(adminCtx, userData, 'user');
      if (err) return { success: false, message: err };

      const normalizedBranchId = normalizeBranchId(userData.branchId || userData.branchName || userData.branch);
      // Add to deniedUsers collection
      await setDoc(doc(db, "deniedUsers", userId), {
        ...userData,
        ...(normalizedBranchId ? { branchId: normalizedBranchId } : {}),
        deniedAt: serverTimestamp(),
      });
      // Delete from users collection
      await deleteDoc(userDocRef);
      return { success: true, message: "User denied and data moved." };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    console.error("Error denying user:", error);
    return { success: false, message: "Failed to deny user." };
  }
}

export async function deleteUser(userId: string) {
    try {
        const adminCtx = await getServerAdminContext();
        if (!adminCtx) {
          return { success: false, message: "Unauthorized: Valid administrator session required." };
        }
        const userDocRef = doc(db, "users", userId);
        if (adminCtx.isBranchAdmin) {
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) return { success: false, message: "User not found." };
          const data = snap.data();
          if (String(data?.role || '').toLowerCase() === 'admin') {
            return { success: false, message: "Forbidden: Branch admins cannot delete admin accounts." };
          }
          const err = assertRecordInAdminBranch(adminCtx, data, 'user');
          if (err) return { success: false, message: err };
        }
        await deleteDoc(userDocRef);
        // Note: This action does not delete the user from Firebase Authentication.
        // That would require privileged access not available here.
        return { success: true, message: "User data deleted from Firestore." };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user data." };
    }
}


export async function setUserStatus(userId: string, status: 'approved' | 'inactive') {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const userDocRef = doc(db, "users", userId);
    if (adminCtx.isBranchAdmin) {
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) return { success: false, message: "User not found." };
      const err = assertRecordInAdminBranch(adminCtx, snap.data(), 'user');
      if (err) return { success: false, message: err };
    }
    await updateDoc(userDocRef, { status });
    return { success: true, message: `User status updated to ${status}.` };
  } catch (error) {
    console.error(`Error setting user status to ${status}:`, error);
    return { success: false, message: "Failed to update user status." };
  }
}


export async function editTeacher(teacherId: string, formData: FormData) {
  const adminCtx = await getServerAdminContext();
  if (!adminCtx) {
    return { success: false, message: "Unauthorized: Valid administrator session required." };
  }
  const rawData = Object.fromEntries(formData.entries());
  const photoFile = rawData.photo as File | null;

  const teacherData: any = {
    name: rawData.name as string,
    designation: rawData.designation as string,
    experience: rawData.experience as string,
    biography: rawData.biography as string || '',
    socialLinks: {
      instagram: rawData.instagram as string || '',
      facebook: rawData.facebook as string || '',
      twitter: rawData.twitter as string || '',
    },
  };

  try {
    const docRef = doc(db, "users", teacherId);
    if (adminCtx.isBranchAdmin) {
      const snap = await getDoc(docRef);
      if (!snap.exists()) return { success: false, message: "Teacher not found." };
      const err = assertRecordInAdminBranch(adminCtx, snap.data(), 'teacher');
      if (err) return { success: false, message: err };
    }

    if (photoFile && photoFile.size > 0) {
      const destination = `teacher_photos/${teacherId}-${photoFile.name}`;
      teacherData.photoURL = await uploadFileToGCS(photoFile, destination);
    } else if (rawData.removePhoto === 'true') {
        teacherData.photoURL = '';
    }

    await updateDoc(docRef, teacherData);
    
    return { success: true, message: "Teacher updated successfully." };
  } catch (error) {
    console.error("Error updating teacher:", error);
    return { success: false, message: "Failed to update teacher." };
  }
}

const addAdminSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
});

export async function addAdmin(data: z.infer<typeof addAdminSchema>) {
  const adminCtx = await getServerAdminContext();
  if (!adminCtx) {
    return { success: false, message: "Unauthorized: Valid administrator session required." };
  }
  if (adminCtx.isBranchAdmin) {
    return { success: false, message: "Forbidden: Only Super Admin can create administrator accounts." };
  }
  const validation = addAdminSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: validation.error.errors.map(e => e.message).join(', ') };
  }

  // Use the existing signUpUser function, but force the role to 'admin'
  const result = await signUpUser({ ...validation.data, role: 'admin' });
  
  // The signUpUser function automatically sets status to 'pending', let's approve it right away for admins
  if (result.success && result.uid) {
    await approveUser(result.uid);
    if (validation.data.branchId) {
      const normalizedBranchId = normalizeBranchId(validation.data.branchId) || validation.data.branchId;
      await updateDoc(doc(db, "users", result.uid), {
        branchId: normalizedBranchId,
        branchName: validation.data.branchName || getBranchDisplayName(normalizedBranchId, true),
      });
    }
  }

  return result;
}


// Teacher-Student Assignment
export async function assignTeachersToStudent(studentId: string, teacherIds: string[]) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const studentDocRef = doc(db, "users", studentId);
    if (adminCtx.isBranchAdmin) {
      const studentSnap = await getDoc(studentDocRef);
      if (!studentSnap.exists()) return { success: false, message: "Student not found." };
      const err = assertRecordInAdminBranch(adminCtx, studentSnap.data(), 'student');
      if (err) return { success: false, message: err };

      for (const tId of teacherIds) {
        const teacherSnap = await getDoc(doc(db, "users", tId));
        if (!teacherSnap.exists()) return { success: false, message: "Assigned teacher not found." };
        const tErr = assertRecordInAdminBranch(adminCtx, teacherSnap.data(), 'teacher');
        if (tErr) return { success: false, message: tErr };
      }
    }
    await updateDoc(studentDocRef, { teacherIds: teacherIds });
    return { success: true, message: "Teachers assigned successfully!" };
  } catch (error) {
    console.error("Error assigning teachers:", error);
    return { success: false, message: "Failed to assign teachers." };
  }
}

// Progress Reports
const progressReportSchema = z.object({
  studentId: z.string(),
  teacherId: z.string(),
  month: z.string(),
  report: z.string().min(10, { message: "Report must be at least 10 characters." }),
});
type ProgressReportValues = z.infer<typeof progressReportSchema>;

export async function addProgressReport(data: ProgressReportValues) {
  const validation = progressReportSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    await addDoc(collection(db, "progressReports"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Progress report added successfully!" };
  } catch (error) {
    console.error("Error adding progress report:", error);
    return { success: false, message: "Failed to add report. Please check permissions." };
  }
}

// Updates Management
const updateSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
});
type UpdateValues = z.infer<typeof updateSchema>;

export async function addUpdate(data: UpdateValues, narrowBranchId?: string) {
  const validation = updateSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const targetBranch = adminCtx.isBranchAdmin
      ? adminCtx.branchId
      : normalizeBranchId(narrowBranchId);
    const hasBranchScope = Boolean(targetBranch && targetBranch !== 'all');
    await addDoc(collection(db, "updates"), {
      ...validation.data,
      ...(hasBranchScope && targetBranch
        ? {
            branchId: targetBranch,
            branchName: getBranchDisplayName(targetBranch, true),
            createdByUid: adminCtx.uid,
          }
        : {}),
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Update posted successfully!" };
  } catch (error) {
    console.error("Error adding update:", error);
    return { success: false, message: "Failed to post update. Please try again." };
  }
}

export async function editUpdate(id: string, data: UpdateValues) {
  const validation = updateSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const updateDocRef = doc(db, "updates", id);
    if (adminCtx.isBranchAdmin) {
      const snap = await getDoc(updateDocRef);
      if (!snap.exists()) return { success: false, message: "Update not found." };
      const err = assertRecordInAdminBranch(adminCtx, snap.data(), 'update');
      if (err) return { success: false, message: err };
    }
    await updateDoc(updateDocRef, {
      ...validation.data,
    });
    return { success: true, message: "Update edited successfully!" };
  } catch (error) {
    console.error("Error editing update:", error);
    return { success: false, message: "Failed to edit update. Please try again." };
  }
}

export async function deleteUpdate(id: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const updateDocRef = doc(db, "updates", id);
    if (adminCtx.isBranchAdmin) {
      const snap = await getDoc(updateDocRef);
      if (!snap.exists()) return { success: false, message: "Update not found." };
      const err = assertRecordInAdminBranch(adminCtx, snap.data(), 'update');
      if (err) return { success: false, message: err };
    }
    await deleteDoc(updateDocRef);
    return { success: true, message: "Update deleted successfully!" };
  } catch (error) {
    console.error("Error deleting update:", error);
    return { success: false, message: "Failed to delete update. Please try again." };
  }
}

// Session Bookings Management
export async function markAllBookingsAsSeen(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const effectiveBranch = adminCtx.isBranchAdmin
      ? adminCtx.branchId
      : normalizeBranchId(narrowBranchId);
    const newBookingsQuery = query(collection(db, "sessionBookings"), where("status", "==", "new"));
    const querySnapshot = await getDocs(newBookingsQuery);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(docSnap => {
      if (effectiveBranch && effectiveBranch !== 'all' && !recordMatchesBranch(docSnap.data(), effectiveBranch)) {
        return;
      }
      batch.update(docSnap.ref, { status: 'seen' });
    });
    await batch.commit();
    return { success: true, message: "All new bookings marked as seen." };
  } catch (error) {
    console.error("Error marking bookings as seen:", error);
    return { success: false, message: "Failed to mark bookings as seen." };
  }
}

// Testimonial Management
export async function addTestimonial(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const avatarFile = rawData.avatar as File | null;
  
  const testimonialData = {
    name: rawData.name as string,
    achievement: rawData.achievement as string,
    testimonial: rawData.testimonial as string,
    testimonial_hi: rawData.testimonial_hi as string || '',
    videoId: rawData.videoId as string || '',
  };

  try {
    let avatarUrl = '';
    if (avatarFile && avatarFile.size > 0) {
      const destination = `testimonials/${Date.now()}-${avatarFile.name}`;
      avatarUrl = await uploadFileToGCS(avatarFile, destination);
    }
    
    await addDoc(collection(db, "testimonials"), {
      ...testimonialData,
      avatarUrl,
      createdAt: serverTimestamp(),
    });
    
    return { success: true, message: "Testimonial added successfully." };
  } catch (error) {
    console.error("Error adding testimonial:", error);
    return { success: false, message: "Failed to add testimonial." };
  }
}

export async function editTestimonial(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const avatarFile = rawData.avatar as File | null;

    const testimonialData: any = {
      name: rawData.name as string,
      achievement: rawData.achievement as string,
      testimonial: rawData.testimonial as string,
      testimonial_hi: rawData.testimonial_hi as string || '',
      videoId: rawData.videoId as string || '',
    };
    
    try {
        if (avatarFile && avatarFile.size > 0) {
            const destination = `testimonials/${Date.now()}-${avatarFile.name}`;
            testimonialData.avatarUrl = await uploadFileToGCS(avatarFile, destination);
        }

        const docRef = doc(db, "testimonials", id);
        await updateDoc(docRef, testimonialData);
        
        return { success: true, message: "Testimonial updated successfully." };
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return { success: false, message: "Failed to update testimonial." };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        const docRef = doc(db, "testimonials", id);
        await deleteDoc(docRef);
        return { success: true, message: "Testimonial deleted successfully." };
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return { success: false, message: "Failed to delete testimonial." };
    }
}

// Topper Testimonial Management
const topperTestimonialSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  studentClass: z.string().min(1, 'Class/Course is required'),
  videoId: z.string().min(1, 'YouTube Video ID is required'),
  achievement: z.string().optional(),
  quote: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  order: z.coerce.number().optional(),
  featured: z.boolean().optional(),
});

type TopperTestimonialValues = z.infer<typeof topperTestimonialSchema>;

export async function addTopperTestimonial(data: TopperTestimonialValues) {
    const validation = topperTestimonialSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data provided." };
    }
    try {
        await addDoc(collection(db, "topperTestimonials"), {
            ...validation.data,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Topper testimonial added successfully." };
    } catch (error) {
        console.error("Error adding topper testimonial:", error);
        return { success: false, message: "Failed to add topper testimonial." };
    }
}

export async function editTopperTestimonial(id: string, data: TopperTestimonialValues) {
    const validation = topperTestimonialSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data provided." };
    }
    try {
        const docRef = doc(db, "topperTestimonials", id);
        await updateDoc(docRef, validation.data);
        return { success: true, message: "Topper testimonial updated successfully." };
    } catch (error) {
        console.error("Error updating topper testimonial:", error);
        return { success: false, message: "Failed to update topper testimonial." };
    }
}

export async function deleteTopperTestimonial(id: string) {
    try {
        const docRef = doc(db, "topperTestimonials", id);
        await deleteDoc(docRef);
        return { success: true, message: "Topper testimonial deleted successfully." };
    } catch (error) {
        console.error("Error deleting topper testimonial:", error);
        return { success: false, message: "Failed to delete topper testimonial." };
    }
}

// Excellence Results Management
export async function addExcellenceResult(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;

  const resultData = {
    categoryName: rawData.categoryName as string,
    order: parseInt(rawData.order as string, 10) || 99,
  };

  try {
    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      const destination = `excellence-results/${Date.now()}-${imageFile.name}`;
      imageUrl = await uploadFileToGCS(imageFile, destination);
    } else {
      return { success: false, message: "Image is required." };
    }
    
    await addDoc(collection(db, "excellenceResults"), {
      ...resultData,
      imageUrl,
      createdAt: serverTimestamp(),
    });
    
    return { success: true, message: "Excellence result added successfully." };
  } catch (error) {
    console.error("Error adding excellence result:", error);
    return { success: false, message: "Failed to add excellence result." };
  }
}

export async function editExcellenceResult(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const imageFile = rawData.image as File | null;

    const resultData: any = {
      categoryName: rawData.categoryName as string,
      order: parseInt(rawData.order as string, 10) || 99,
    };
    
    try {
        if (imageFile && imageFile.size > 0) {
            const destination = `excellence-results/${Date.now()}-${imageFile.name}`;
            resultData.imageUrl = await uploadFileToGCS(imageFile, destination);
        }

        const docRef = doc(db, "excellenceResults", id);
        await updateDoc(docRef, resultData);
        
        return { success: true, message: "Excellence result updated successfully." };
    } catch (error) {
        console.error("Error updating excellence result:", error);
        return { success: false, message: "Failed to update excellence result." };
    }
}

export async function deleteExcellenceResult(id: string) {
    try {
        const docRef = doc(db, "excellenceResults", id);
        await deleteDoc(docRef);
        return { success: true, message: "Excellence result deleted successfully." };
    } catch (error) {
        console.error("Error deleting excellence result:", error);
        return { success: false, message: "Failed to delete excellence result." };
    }
}

// Gallery Management
export async function addGalleryImage(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;
  const layout = rawData.layout as string;

  const galleryData = {
    title: rawData.title as string,
    category: rawData.category as string,
    alt: (rawData.alt as string) || (rawData.title as string),
    className: layout === 'default' ? '' : layout,
  };

  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: "Image file is required." };
  }

  try {
    const destination = `gallery/${Date.now()}-${imageFile.name}`;
    const imageUrl = await uploadFileToGCS(imageFile, destination);
    
    await addDoc(collection(db, "gallery"), {
      ...galleryData,
      imageUrl,
      createdAt: serverTimestamp(),
    });
    
    return { success: true, message: "Image added to gallery successfully." };
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return { success: false, message: "Failed to add image." };
  }
}


export async function deleteGalleryImage(id: string) {
    try {
        // Note: This does not delete the image from GCS to prevent accidental data loss.
        // A more robust solution might involve a GCS cleanup function.
        await deleteDoc(doc(db, "gallery", id));
        return { success: true, message: "Image deleted successfully." };
    } catch (error) {
        console.error("Error deleting gallery image:", error);
        return { success: false, message: "Failed to delete image." };
    }
}

export async function editAdminProfile(userId: string, formData: FormData) {
  const adminCtx = await getServerAdminContext();
  if (!adminCtx) {
    return { success: false, message: "Unauthorized: Valid administrator session required." };
  }
  if (adminCtx.isBranchAdmin && userId !== adminCtx.uid) {
    return { success: false, message: "Forbidden: You can only update your own branch admin profile." };
  }

  const rawData = Object.fromEntries(formData.entries());
  const photoFile = rawData.photo as File | null;
  const dataToUpdate: any = {};

  // Only add fields to the update object if they have a value
  if (rawData.name) dataToUpdate.name = rawData.name as string;
  if (rawData.phone) dataToUpdate.phone = rawData.phone as string;
  if (rawData.address) dataToUpdate.address = rawData.address as string;
  if (rawData.dob) dataToUpdate.dob = rawData.dob as string;
  if (rawData.bloodGroup) dataToUpdate.bloodGroup = rawData.bloodGroup as string;
  if (!adminCtx?.isBranchAdmin) {
    if (rawData.branchId !== undefined) {
      const normalized = normalizeBranchId(rawData.branchId as string);
      dataToUpdate.branchId = normalized || (rawData.branchId as string);
      if (rawData.branchName === undefined && normalized) {
        dataToUpdate.branchName = getBranchDisplayName(normalized, true);
      }
    }
    if (rawData.branchName !== undefined) dataToUpdate.branchName = rawData.branchName as string;
  }
  
  try {
    if (photoFile && photoFile.size > 0) {
      const destination = `profile_photos/${userId}-${photoFile.name}`;
      dataToUpdate.photoURL = await uploadFileToGCS(photoFile, destination);
    } else if (rawData.removePhoto === 'true') {
        dataToUpdate.photoURL = '';
    }

    if (Object.keys(dataToUpdate).length > 0) {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, dataToUpdate);
    }
    
    // Fetch the updated document to return it
    const updatedDoc = await getDoc(doc(db, "users", userId));
    if (updatedDoc.exists()) {
        const userProfile = {
            uid: userId,
            email: updatedDoc.data().email,
            ...serializeFirestoreData(updatedDoc.data())
        }
        return { success: true, message: "Profile updated successfully.", user: userProfile };
    }
    
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return { success: false, message: "Failed to update profile." };
  }
}

export async function getDirectorProfile() {
  try {
    const docRef = doc(db, "siteContent", "director");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: serializeFirestoreData(docSnap.data()) };
    } else {
      // Return a default structure if it doesn't exist
      return { success: true, data: { name: 'Amod Kumar Sharma', photoUrl: 'amod.jpg' } };
    }
  } catch (error) {
    console.error("Error fetching director profile:", error);
    return { success: false, message: "Failed to fetch director profile." };
  }
}

export async function editStudentProfile(studentId: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const photoFile = rawData.photo as File | null;
  
  const studentData: any = {
    name: rawData.name as string,
    biography: rawData.biography as string || '',
    dob: rawData.dob ? rawData.dob as string : null,
    bloodGroup: rawData.bloodGroup as string || '',
    phone: rawData.phone as string || '',
    address: rawData.address as string || '',
    socialLinks: {
      instagram: rawData.instagram as string || '',
      facebook: rawData.facebook as string || '',
      twitter: rawData.twitter as string || '',
    },
  };

  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Valid administrator session required." };
    }
    const docRef = doc(db, "users", studentId);
    if (adminCtx.isBranchAdmin) {
      const snap = await getDoc(docRef);
      if (!snap.exists()) return { success: false, message: "Student not found." };
      const err = assertRecordInAdminBranch(adminCtx, snap.data(), 'student');
      if (err) return { success: false, message: err };
    }

    if (photoFile && photoFile.size > 0) {
      const destination = `profile_photos/${studentId}-${photoFile.name}`;
      studentData.photoURL = await uploadFileToGCS(photoFile, destination);
    } else if (rawData.removePhoto === 'true') {
        studentData.photoURL = '';
    }

    await updateDoc(docRef, studentData);
    
    return { success: true, message: "Student profile updated successfully." };
  } catch (error) {
    console.error("Error updating student profile:", error);
    return { success: false, message: "Failed to update student profile." };
  }
}

// Hero Slide Management
export async function addHeroSlide(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const imageFile = rawData.image as File | null;
  const mobileImageFile = rawData.mobileImage as File | null;
  if (!imageFile || imageFile.size === 0) return { success: false, message: "Desktop image is required." };

  try {
    const destination = `hero-slides/${Date.now()}-${imageFile.name}`;
    const imageUrl = await uploadFileToGCS(imageFile, destination);
    
    let mobileImageUrl: string | undefined = undefined;
    if (mobileImageFile && mobileImageFile.size > 0) {
      const mobileDestination = `hero-slides/${Date.now()}-mobile-${mobileImageFile.name}`;
      mobileImageUrl = await uploadFileToGCS(mobileImageFile, mobileDestination);
    }
    
    await addDoc(collection(db, "heroSlides"), {
      title: rawData.title as string,
      description: rawData.description as string,
      buttonText: rawData.buttonText as string,
      buttonLink: rawData.buttonLink as string,
      order: parseInt(rawData.order as string, 10) || 99,
      imageUrl,
      ...(mobileImageUrl ? { mobileImageUrl } : {}),
      createdAt: serverTimestamp(),
    });
    
    return { success: true, message: "Hero slide added successfully." };
  } catch (error) {
    console.error("Error adding hero slide:", error);
    return { success: false, message: "Failed to add hero slide." };
  }
}

export async function editHeroSlide(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const imageFile = rawData.image as File | null;
    const mobileImageFile = rawData.mobileImage as File | null;

    const slideData: any = {
      title: rawData.title as string,
      description: rawData.description as string,
      buttonText: rawData.buttonText as string,
      buttonLink: rawData.buttonLink as string,
      order: parseInt(rawData.order as string, 10) || 99,
    };
    
    try {
        if (imageFile && imageFile.size > 0) {
            const destination = `hero-slides/${Date.now()}-${imageFile.name}`;
            slideData.imageUrl = await uploadFileToGCS(imageFile, destination);
        }

        if (mobileImageFile && mobileImageFile.size > 0) {
            const mobileDestination = `hero-slides/${Date.now()}-mobile-${mobileImageFile.name}`;
            slideData.mobileImageUrl = await uploadFileToGCS(mobileImageFile, mobileDestination);
        }

        const docRef = doc(db, "heroSlides", id);
        await updateDoc(docRef, slideData);
        
        return { success: true, message: "Hero slide updated successfully." };
    } catch (error) {
        console.error("Error updating hero slide:", error);
        return { success: false, message: "Failed to update hero slide." };
    }
}

export async function deleteHeroSlide(id: string) {
    try {
        const docRef = doc(db, "heroSlides", id);
        await deleteDoc(docRef);
        return { success: true, message: "Hero slide deleted successfully." };
    } catch (error) {
        console.error("Error deleting hero slide:", error);
        return { success: false, message: "Failed to delete hero slide." };
    }
}

function extractAndNormalizeYouTube(urlOrId?: string): { videoUrl: string; videoId: string } {
  if (!urlOrId) return { videoUrl: '', videoId: '' };
  const trimmed = urlOrId.trim();
  if (!trimmed) return { videoUrl: '', videoId: '' };

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      videoId: trimmed,
      videoUrl: `https://www.youtube.com/watch?v=${trimmed}`
    };
  }

  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return {
      videoId: match[1],
      videoUrl: `https://www.youtube.com/watch?v=${match[1]}`
    };
  }

  return { videoUrl: '', videoId: '' };
}

// Expert Teacher Management
export async function addExpertTeacher(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const photoFile = rawData.photo as File | null;
  const rawVideo = (rawData.videoUrl as string || rawData.videoId as string || '').trim();
  const { videoUrl, videoId } = extractAndNormalizeYouTube(rawVideo);
  
  const teacherData: any = {
    name: (rawData.name as string) || '',
    designation: (rawData.designation as string) || '',
    subject: (rawData.subject as string) || '',
    examFocus: (rawData.examFocus as string) || '',
    specialization: (rawData.specialization as string) || '',
    experience: (rawData.experience as string) || '',
    qualification: (rawData.qualification as string) || '',
    teachingFocus: (rawData.teachingFocus as string) || '',
    shortBio: (rawData.shortBio as string) || '',
    videoUrl,
    videoId,
    profileUrl: (rawData.profileUrl as string) || '/about',
    order: parseInt(rawData.order as string, 10) || 99,
    isActive: rawData.isActive === 'true' || rawData.isActive === 'on',
    photoPosition: (rawData.photoPosition as string) || 'top',
  };

  try {
    let avatarUrl = (rawData.avatarUrl as string) || (rawData.photoUrl as string) || '';
    if (avatarUrl && typeof avatarUrl === 'string') {
      avatarUrl = avatarUrl.split('?')[0];
    }
    if (photoFile && photoFile.size > 0) {
      const destination = `expert-teachers/${Date.now()}-${photoFile.name}`;
      avatarUrl = await uploadFileToGCS(photoFile, destination);
    }
    
    await addDoc(collection(db, "expertTeachers"), {
      ...teacherData,
      avatarUrl: avatarUrl || '',
      photoUrl: avatarUrl || '',
      createdAt: serverTimestamp(),
    });
    
    return { success: true, message: "Expert teacher added successfully." };
  } catch (error) {
    console.error("Error adding expert teacher:", error);
    return { success: false, message: "Failed to add expert teacher." };
  }
}

export async function editExpertTeacher(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const photoFile = rawData.photo as File | null;
  const rawVideo = (rawData.videoUrl as string || rawData.videoId as string || '').trim();
  const { videoUrl, videoId } = extractAndNormalizeYouTube(rawVideo);

  const teacherData: any = {
    name: (rawData.name as string) || '',
    designation: (rawData.designation as string) || '',
    subject: (rawData.subject as string) || '',
    examFocus: (rawData.examFocus as string) || '',
    specialization: (rawData.specialization as string) || '',
    experience: (rawData.experience as string) || '',
    qualification: (rawData.qualification as string) || '',
    teachingFocus: (rawData.teachingFocus as string) || '',
    shortBio: (rawData.shortBio as string) || '',
    videoUrl,
    videoId,
    profileUrl: (rawData.profileUrl as string) || '/about',
    order: parseInt(rawData.order as string, 10) || 99,
    isActive: rawData.isActive === 'true' || rawData.isActive === 'on',
    photoPosition: (rawData.photoPosition as string) || 'top',
  };

  try {
    if (rawData.removePhoto === 'true') {
      // Admin explicitly removed the photo — clear it
      teacherData.avatarUrl = '';
      teacherData.photoUrl = '';
    } else if (photoFile && photoFile.size > 0) {
      // New file uploaded
      const destination = `expert-teachers/${Date.now()}-${photoFile.name}`;
      const uploadedUrl = await uploadFileToGCS(photoFile, destination);
      teacherData.avatarUrl = uploadedUrl;
      teacherData.photoUrl = uploadedUrl;
    } else if (rawData.photoUrl) {
      // URL typed in the URL field (strip any signed URL query params)
      const cleanUrl = (rawData.photoUrl as string).split('?')[0];
      teacherData.avatarUrl = cleanUrl;
      teacherData.photoUrl = cleanUrl;
    } else if (rawData.avatarUrl) {
      const cleanUrl = (rawData.avatarUrl as string).split('?')[0];
      teacherData.avatarUrl = cleanUrl;
      teacherData.photoUrl = cleanUrl;
    }

    const docRef = doc(db, "expertTeachers", id);
    await updateDoc(docRef, teacherData);
    
    return { success: true, message: "Expert teacher updated successfully." };
  } catch (error) {
    console.error("Error updating expert teacher:", error);
    return { success: false, message: "Failed to update expert teacher." };
  }
}

export async function deleteExpertTeacher(id: string) {
  try {
    const docRef = doc(db, "expertTeachers", id);
    await deleteDoc(docRef);
    return { success: true, message: "Expert teacher deleted successfully." };
  } catch (error) {
    console.error("Error deleting expert teacher:", error);
    return { success: false, message: "Failed to delete expert teacher." };
  }
}
    