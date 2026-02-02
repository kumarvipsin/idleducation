// src/app/actions/admin.ts
'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, query, where, getDocs, updateDoc, Timestamp, orderBy, deleteDoc, writeBatch,getCountFromServer, deleteField } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';
import { serializeFirestoreData } from './utils';
import { signUpUser } from './auth';

// User Management
export async function getPendingUsers() {
  try {
    const usersQuery = query(collection(db, "users"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(usersQuery);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return { success: false, message: "Failed to fetch pending users." };
  }
}

export async function approveUser(userId: string) {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status: 'approved' });
    return { success: true, message: "User approved successfully!" };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, message: "Failed to approve user." };
  }
}

export async function denyUser(userId: string) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Add to deniedUsers collection
      await setDoc(doc(db, "deniedUsers", userId), {
        ...userData,
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
        const userDocRef = doc(db, "users", userId);
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
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status });
    return { success: true, message: `User status updated to ${status}.` };
  } catch (error) {
    console.error(`Error setting user status to ${status}:`, error);
    return { success: false, message: "Failed to update user status." };
  }
}


export async function editTeacher(teacherId: string, formData: FormData) {
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
    if (photoFile && photoFile.size > 0) {
      const destination = `teacher_photos/${teacherId}-${photoFile.name}`;
      teacherData.photoURL = await uploadFileToGCS(photoFile, destination);
    } else if (rawData.removePhoto === 'true') {
        teacherData.photoURL = '';
    }

    const docRef = doc(db, "users", teacherId);
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
});

export async function addAdmin(data: z.infer<typeof addAdminSchema>) {
  const validation = addAdminSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: validation.error.errors.map(e => e.message).join(', ') };
  }

  // Use the existing signUpUser function, but force the role to 'admin'
  const result = await signUpUser({ ...validation.data, role: 'admin' });
  
  // The signUpUser function automatically sets status to 'pending', let's approve it right away for admins
  if (result.success && result.uid) {
    await approveUser(result.uid);
  }

  return result;
}


// Teacher-Student Assignment
export async function assignTeachersToStudent(studentId: string, teacherIds: string[]) {
  try {
    const studentDocRef = doc(db, "users", studentId);
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

export async function addUpdate(data: UpdateValues) {
  const validation = updateSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    await addDoc(collection(db, "updates"), {
      ...validation.data,
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
    const updateDocRef = doc(db, "updates", id);
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
    const updateDocRef = doc(db, "updates", id);
    await deleteDoc(updateDocRef);
    return { success: true, message: "Update deleted successfully!" };
  } catch (error) {
    console.error("Error deleting update:", error);
    return { success: false, message: "Failed to delete update. Please try again." };
  }
}

// Session Bookings Management
export async function markAllBookingsAsSeen() {
  try {
    const newBookingsQuery = query(collection(db, "sessionBookings"), where("status", "==", "new"));
    const querySnapshot = await getDocs(newBookingsQuery);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'seen' });
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
  const rawData = Object.fromEntries(formData.entries());
  const photoFile = rawData.photo as File | null;
  const dataToUpdate: any = {};

  // Only add fields to the update object if they have a value
  if (rawData.name) dataToUpdate.name = rawData.name as string;
  if (rawData.phone) dataToUpdate.phone = rawData.phone as string;
  if (rawData.address) dataToUpdate.address = rawData.address as string;
  if (rawData.dob) dataToUpdate.dob = rawData.dob as string;
  if (rawData.bloodGroup) dataToUpdate.bloodGroup = rawData.bloodGroup as string;
  
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
    if (photoFile && photoFile.size > 0) {
      const destination = `profile_photos/${studentId}-${photoFile.name}`;
      studentData.photoURL = await uploadFileToGCS(photoFile, destination);
    } else if (rawData.removePhoto === 'true') {
        studentData.photoURL = '';
    }

    const docRef = doc(db, "users", studentId);
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
  if (!imageFile) return { success: false, message: "Image is required." };

  try {
    const destination = `hero-slides/${Date.now()}-${imageFile.name}`;
    const imageUrl = await uploadFileToGCS(imageFile, destination);
    
    await addDoc(collection(db, "heroSlides"), {
      title: rawData.title as string,
      description: rawData.description as string,
      buttonText: rawData.buttonText as string,
      buttonLink: rawData.buttonLink as string,
      order: parseInt(rawData.order as string, 10) || 99,
      imageUrl,
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
    