// src/app/actions/data.ts
'use server';

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, getCountFromServer, limit, doc, getDoc, Timestamp } from "firebase/firestore";
import { serializeFirestoreData } from './utils';
import { getSignedUrlForPdf } from './content';
import { getServerAdminContext, resolveScopedBranchFilter, scopeRecordsToBranchAdmin } from '@/lib/server-admin-auth';
import { recordMatchesBranch } from '@/lib/branch-utils';

// Data Fetching
export async function getSessionBookings(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const bookingsQuery = query(collection(db, "sessionBookings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(bookingsQuery);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: scopeRecordsToBranchAdmin(bookings, adminCtx, { narrowBranchId }) };
  } catch (error) {
    console.error("Error fetching session bookings:", error);
    return { success: false, message: "Failed to fetch session bookings." };
  }
}

export async function getStudentEnquiries(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const enquiriesQuery = query(collection(db, "studentEnquiries"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(enquiriesQuery);
    const enquiries = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: scopeRecordsToBranchAdmin(enquiries, adminCtx, { narrowBranchId }) };
  } catch (error) {
    console.error("Error fetching student enquiries:", error);
    return { success: false, message: "Failed to fetch student enquiries." };
  }
}


export async function getContactSubmissions(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const submissionsQuery = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(submissionsQuery);
    const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: scopeRecordsToBranchAdmin(submissions, adminCtx, { narrowBranchId }) };
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return { success: false, message: "Failed to fetch contact submissions." };
  }
}

export async function getSupportTickets(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const ticketsQuery = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(ticketsQuery);
    const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: scopeRecordsToBranchAdmin(tickets, adminCtx, { narrowBranchId }) };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return { success: false, message: "Failed to fetch support tickets." };
  }
}

export async function getScholarshipRegistrations(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const registrationsQuery = query(collection(db, "scholarshipRegistrations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(registrationsQuery);
    const registrations = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: scopeRecordsToBranchAdmin(registrations, adminCtx, { narrowBranchId }) };
  } catch (error) {
    console.error("Error fetching scholarship registrations:", error);
    return { success: false, message: "Failed to fetch scholarship registrations." };
  }
}

export async function getUpdates(count?: number, narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    const effectiveBranch = adminCtx ? resolveScopedBranchFilter(adminCtx, narrowBranchId) : null;
    const isBranchFiltered = Boolean(effectiveBranch && effectiveBranch !== 'all');
    const updatesQuery =
      count && !isBranchFiltered
        ? query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(count))
        : query(collection(db, "updates"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(updatesQuery);
    const updates = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        if (!docData) return null;
        return { id: doc.id, ...serializeFirestoreData(docData) };
    }).filter((item): item is Record<string, any> => Boolean(item));
    const scoped = scopeRecordsToBranchAdmin(updates, adminCtx, {
      allowUnauthenticated: true,
      narrowBranchId,
    });
    return { success: true, data: count ? scoped.slice(0, count) : scoped };
  } catch (error) {
    console.error("Error fetching updates:", error);
    return { success: false, message: "Failed to fetch updates." };
  }
}

export async function getFeedbackSubmissions(narrowBranchId?: string) {
    try {
        const adminCtx = await getServerAdminContext();
        if (!adminCtx) {
          return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
        }
        const feedbackQuery = query(collection(db, "feedbackSubmissions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(feedbackQuery);
        const feedback = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: scopeRecordsToBranchAdmin(feedback, adminCtx, { narrowBranchId }) };
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return { success: false, message: "Failed to fetch feedback submissions." };
    }
}

export async function getAdmissions(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }
    const admissionsQuery = query(collection(db, "admissions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(admissionsQuery);
    const admissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: scopeRecordsToBranchAdmin(admissions, adminCtx, { narrowBranchId }) };
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return { success: false, message: "Failed to fetch admissions." };
  }
}

export async function getVolunteerApplications() {
  try {
    const applicationsQuery = query(collection(db, "volunteerApplications"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(applicationsQuery);
    const applications = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: applications };
  } catch (error) {
    console.error("Error fetching volunteer applications:", error);
    return { success: false, message: "Failed to fetch volunteer applications." };
  }
}

export async function getDonations() {
  try {
    const donationsQuery = query(collection(db, "donations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(donationsQuery);
    const donations = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: donations };
  } catch (error) {
    console.error("Error fetching donations:", error);
    return { success: false, message: "Failed to fetch donations." };
  }
}

async function signTestimonialPhoto(testimonial: any) {
    const avatar = testimonial.avatarUrl || testimonial.photoUrl || testimonial.image || testimonial.photo;
    if (avatar && typeof avatar === "string" && (avatar.includes("storage.googleapis.com") || avatar.startsWith("testimonials/")) && !avatar.includes("X-Goog-Signature=") && !avatar.includes("Signature=")) {
        try {
            const cleanUrl = avatar.split("?")[0];
            const signed = await getSignedUrlForPdf(cleanUrl);
            if (signed.success && signed.url) {
                return {
                    ...testimonial,
                    originalAvatarUrl: cleanUrl,
                    avatarUrl: signed.url,
                };
            }
        } catch (err) {
            console.error("Error signing testimonial photo:", err);
        }
    }
    return testimonial;
}

async function signTopperPhoto(topper: any) {
    const photo = topper.thumbnailUrl || topper.avatarUrl || topper.photoUrl;
    if (photo && typeof photo === "string" && (photo.includes("storage.googleapis.com") || photo.startsWith("testimonials/")) && !photo.includes("X-Goog-Signature=") && !photo.includes("Signature=")) {
        try {
            const cleanUrl = photo.split("?")[0];
            const signed = await getSignedUrlForPdf(cleanUrl);
            if (signed.success && signed.url) {
                return {
                    ...topper,
                    thumbnailUrl: signed.url,
                    avatarUrl: signed.url,
                };
            }
        } catch (err) {
            console.error("Error signing topper photo:", err);
        }
    }
    return topper;
}

export async function getTestimonials() {
    try {
        const testimonialsQuery = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(testimonialsQuery);
        const testimonials = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        const signedTestimonials = await Promise.all(testimonials.map(signTestimonialPhoto));
        return { success: true, data: signedTestimonials };
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return { success: false, message: "Failed to fetch testimonials." };
    }
}

export async function getTopperTestimonials() {
    try {
        const testimonialsQuery = query(collection(db, "topperTestimonials"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(testimonialsQuery);
        const testimonials = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        const signedToppers = await Promise.all(testimonials.map(signTopperPhoto));
        return { success: true, data: signedToppers };
    } catch (error) {
        console.error("Error fetching topper testimonials:", error);
        return { success: false, message: "Failed to fetch topper testimonials." };
    }
}

export async function getExcellenceResults() {
    try {
        const resultsQuery = query(collection(db, "excellenceResults"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(resultsQuery);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching excellence results:", error);
        return { success: false, message: "Failed to fetch excellence results." };
    }
}

export async function getCollection(collectionName: string) {
  try {
    const docsQuery = query(collection(db, collectionName));
    const querySnapshot = await getDocs(docsQuery);
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: docs };
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return { success: false, message: `Failed to fetch ${collectionName}.` };
  }
}

export async function getImportantQuestionsForSubject(classId: string, subjectKey: string) {
  try {
    const docRef = doc(db, "importantQuestions", classId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.subjects && data.subjects[subjectKey]) {
        return { success: true, data: data.subjects[subjectKey] };
      }
    }
    
    return { success: false, message: `No important questions found for ${classId} - ${subjectKey}.` };

  } catch (error) {
    console.error("Error fetching important questions for subject:", error);
    return { success: false, message: "Failed to fetch important questions." };
  }
}

export async function getGalleryImages() {
    try {
        const galleryQuery = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(galleryQuery);
        const images = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: images };
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return { success: false, message: "Failed to fetch gallery images." };
    }
}

export async function getPreviousYearQuestions() {
    try {
        const questionsQuery = query(collection(db, "previousYearQuestions"), orderBy("year", "desc"));
        const querySnapshot = await getDocs(questionsQuery);
        const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: questions };
    } catch (error) {
        console.error("Error fetching previous year questions:", error);
        return { success: false, message: "Failed to fetch previous year questions." };
    }
}

export async function getExamCategories() {
    try {
        const categoriesQuery = query(collection(db, "examCategories"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(categoriesQuery);
        const categories = querySnapshot.docs.map(doc => {
            const docData = doc.data();
            if (!docData) return null;
            const name = docData.name || 'Unknown Category';
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const href = docData.group === 'school' ? `/school?class=${encodeURIComponent(name)}` : `/examcat?category=${encodeURIComponent(slug)}`;
            return { id: doc.id, ...serializeFirestoreData(docData), href };
        }).filter(Boolean);
        return { success: true, data: categories };
    } catch (error) {
        console.error("Error fetching exam categories:", error);
        return { success: false, message: "Failed to fetch exam categories." };
    }
}

export async function getTeamMembers() {
    try {
        const teamQuery = query(collection(db, "teamMembers"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(teamQuery);
        const members = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: members };
    } catch (error) {
        console.error("Error fetching team members:", error);
        return { success: false, message: "Failed to fetch team members." };
    }
}

const DEFAULT_EXPERT_TEACHERS = [
  {
    id: "teacher-amod",
    name: "Amod Sharma",
    designation: "Head Academic Faculty & Director",
    subject: "Biology & Chemistry",
    examFocus: "NEET & CBSE",
    specialization: "BIOLOGY & CHEMISTRY · NEET & CBSE",
    experience: "10+ Years Experience",
    qualification: "M.Sc. Chemistry",
    teachingFocus: "Concept Clarity & Diagnostic Approach",
    shortBio: "Breaks down complex biology and chemistry concepts through clear explanations and structured problem solving.",
    avatarUrl: "",
    photoUrl: "",
    videoUrl: "https://www.youtube.com/watch?v=bOmsL6Z5z1M",
    videoId: "bOmsL6Z5z1M",
    profileUrl: "/about",
    order: 1,
    isActive: true
  },
  {
    id: "teacher-manish",
    name: "Manish Sharma",
    designation: "Senior Faculty & Tech Director",
    subject: "Physics & Mathematics",
    examFocus: "JEE & BOARDS",
    specialization: "PHYSICS & MATHS · JEE & BOARDS",
    experience: "8+ Years Experience",
    qualification: "B.Tech & M.Sc.",
    teachingFocus: "Analytical Reasoning & Numerical Speed",
    shortBio: "Simplifies advanced mechanics and calculus through intuitive frameworks and exam-oriented problem solving.",
    avatarUrl: "/manish.png",
    photoUrl: "/manish.png",
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoId: "jNQXAC9IVRw",
    profileUrl: "/about",
    order: 2,
    isActive: true
  },
  {
    id: "teacher-shipra",
    name: "Shipra Khurana",
    designation: "Senior English Faculty",
    subject: "English",
    examFocus: "CBSE & COMPETITIVE",
    specialization: "ENGLISH · CBSE & COMPETITIVE",
    experience: "8+ Years",
    qualification: "M.A. English & B.Ed.",
    teachingFocus: "Communication & Literary Analysis",
    shortBio: "Specializes in developing strong communication, vocabulary, and exam-oriented English language skills.",
    avatarUrl: "/shipra.jpg",
    photoUrl: "/shipra.jpg",
    videoUrl: "https://www.youtube.com/watch?v=bOmsL6Z5z1M",
    videoId: "bOmsL6Z5z1M",
    profileUrl: "/about",
    order: 3,
    isActive: true
  },
  {
    id: "teacher-chandra",
    name: "Chandra Prakash",
    designation: "Senior Mathematics Faculty",
    subject: "Mathematics",
    examFocus: "JEE ADVANCED",
    specialization: "MATHEMATICS · JEE ADVANCED",
    experience: "7+ Years Experience",
    qualification: "M.Sc. Mathematics",
    teachingFocus: "Visual Geometry & Shortcut Strategies",
    shortBio: "Builds deep mathematical intuition with visual problem solving, structured shortcuts, and conceptual clarity.",
    avatarUrl: "/chandu.png",
    photoUrl: "/chandu.png",
    videoUrl: "https://www.youtube.com/watch?v=bOmsL6Z5z1M",
    videoId: "bOmsL6Z5z1M",
    profileUrl: "/about",
    order: 3,
    isActive: true
  },
  {
    id: "teacher-vidhi",
    name: "Vidhi Sharma",
    designation: "Editorial & Humanities Lead",
    subject: "Social Sciences",
    examFocus: "CBSE 9–12",
    specialization: "SOCIAL STUDIES · CBSE 9–12",
    experience: "6+ Years Experience",
    qualification: "M.A. & B.Ed.",
    teachingFocus: "Critical Analysis & Answer Writing",
    shortBio: "Brings humanities and social sciences to life through structured concepts, visual mapping, and precise answer writing.",
    avatarUrl: "/vidhi.png",
    photoUrl: "/vidhi.png",
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoId: "jNQXAC9IVRw",
    profileUrl: "/about",
    order: 4,
    isActive: true
  },
  {
    id: "teacher-vijay",
    name: "Vijay Verma",
    designation: "Senior Economics Faculty",
    subject: "Economics",
    examFocus: "CUET & CLASS 11–12",
    specialization: "ECONOMICS · CUET & CLASS 11–12",
    experience: "8+ Years Experience",
    qualification: "M.Com & UGC NET",
    teachingFocus: "Practical Case Studies & Macro Insights",
    shortBio: "Connects micro and macro economics with real-world examples, intuitive graphs, and exam-focused problem solving.",
    avatarUrl: "/vijay.png",
    photoUrl: "/vijay.png",
    videoUrl: "https://www.youtube.com/watch?v=bOmsL6Z5z1M",
    videoId: "bOmsL6Z5z1M",
    profileUrl: "/about",
    order: 5,
    isActive: true
  },
  {
    id: "teacher-vikas",
    name: "Vikas Kumar",
    designation: "Senior Commerce & Math Faculty",
    subject: "Mathematics & Accounts",
    examFocus: "FOUNDATION",
    specialization: "ACCOUNTS & MATHS · FOUNDATION",
    experience: "15+ Years Experience",
    qualification: "M.Com & B.Ed.",
    teachingFocus: "Fundamental Principles & Precision",
    shortBio: "15+ years of teaching experience focused on strong fundamentals, structured practice, and confident board preparation.",
    avatarUrl: "/teacher.png",
    photoUrl: "/teacher.png",
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoId: "jNQXAC9IVRw",
    profileUrl: "/about",
    order: 6,
    isActive: true
  }
];

async function signTeacherPhoto(teacher: any) {
    const photo = teacher.photoUrl || teacher.avatarUrl || teacher.photo;
    if (photo && typeof photo === 'string' && photo.includes('storage.googleapis.com')) {
        try {
            const cleanUrl = photo.split('?')[0];
            const signed = await getSignedUrlForPdf(cleanUrl);
            if (signed.success && signed.url) {
                return {
                    ...teacher,
                    originalPhotoUrl: cleanUrl,
                    photoUrl: signed.url,
                    avatarUrl: signed.url,
                    photo: signed.url,
                };
            }
        } catch (err) {
            console.error("Error signing teacher photo:", err);
        }
    }
    return teacher;
}

export async function getExpertTeachers() {
    try {
        const teachersQuery = query(collection(db, "expertTeachers"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(teachersQuery);
        if (!querySnapshot.empty) {
            const teachers = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))
                .filter((t: any) => t.isActive !== false);
            const signedTeachers = await Promise.all(teachers.map(signTeacherPhoto));
            return { success: true, data: signedTeachers.length > 0 ? signedTeachers : DEFAULT_EXPERT_TEACHERS };
        }
        // Fallback to initial structured faculty if collection not yet seeded in Firestore
        return { success: true, data: DEFAULT_EXPERT_TEACHERS };
    } catch (error) {
        console.warn("Firestore expertTeachers collection read note (using fallback):", error);
        return { success: true, data: DEFAULT_EXPERT_TEACHERS };
    }
}

export async function getAllExpertTeachers() {
    try {
        const teachersQuery = query(collection(db, "expertTeachers"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(teachersQuery);
        if (!querySnapshot.empty) {
            const teachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
            const signedTeachers = await Promise.all(teachers.map(signTeacherPhoto));
            return { success: true, data: signedTeachers };
        }
        return { success: true, data: DEFAULT_EXPERT_TEACHERS };
    } catch (error) {
        console.warn("Firestore expertTeachers read all fallback:", error);
        return { success: true, data: DEFAULT_EXPERT_TEACHERS };
    }
}

// Count Functions
function toJsDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value?.toDate && typeof value.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function getBranchScopedCount(
  collectionName: string,
  branchId: string,
  predicate?: (data: Record<string, any>) => boolean
) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const count = snapshot.docs.filter((docSnap) => {
      const data = docSnap.data();
      if (!recordMatchesBranch(data, branchId)) return false;
      return predicate ? predicate(data) : true;
    }).length;
    return { success: true, count };
  } catch (error) {
    console.error(`Error counting branch-scoped ${collectionName}:`, error);
    return { success: false, message: "Failed to fetch count." };
  }
}

async function getCount(q: any) {
    try {
        const snapshot = await getCountFromServer(q);
        return { success: true, count: snapshot.data().count };
    } catch (error) {
        console.error("Error getting count from server: ", error);
        return { success: false, message: "Failed to fetch count." };
    }
}

export async function getNewSessionBookingsCount(narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, count: 0 };
    }
    const effectiveBranch = resolveScopedBranchFilter(adminCtx, narrowBranchId);
    if (effectiveBranch && effectiveBranch !== 'all') {
      return getBranchScopedCount("sessionBookings", effectiveBranch, (d) => d.status === 'new');
    }
    const bookingsQuery = query(collection(db, "sessionBookings"), where("status", "==", "new"));
    const querySnapshot = await getDocs(bookingsQuery);
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    console.error("Error fetching new session bookings count:", error);
    return { success: false, message: "Failed to fetch new session bookings count." };
  }
}

export async function getTotalUsersCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => String(d.role || '').toLowerCase() !== 'admin');
    }
    const q = query(collection(db, "users"));
    return getCount(q);
}

export async function getTotalStudentsCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => d.role === 'student');
    }
    const q = query(collection(db, "users"), where("role", "==", "student"));
    return getCount(q);
}

export async function getTotalTeachersCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => d.role === 'teacher');
    }
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    return getCount(q);
}

export async function getNewStudentsCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => d.role === 'student' && d.status === 'approved');
    }
    const q = query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "approved"));
    return getCount(q);
}

export async function getTrainedStudentsCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => d.role === 'student' && d.status === 'approved' && Array.isArray(d.teacherIds) && d.teacherIds.length > 0);
    }
    const q = query(
      collection(db, "users"), 
      where("role", "==", "student"), 
      where("status", "==", "approved"),
      where("teacherIds", "!=", [])
    );
    return getCount(q);
}

export async function getDeniedUsersCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("deniedUsers", adminCtx.branchId);
    }
    const q = query(collection(db, "deniedUsers"));
    return getCount(q);
}

export async function getTotalSessionBookingsCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("sessionBookings", adminCtx.branchId);
    }
    const q = query(collection(db, "sessionBookings"));
    return getCount(q);
}

export async function getMonthlySessionBookingsCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("sessionBookings", adminCtx.branchId, (d) => {
        const dt = toJsDate(d.createdAt);
        return Boolean(dt && dt >= startDate && dt < endDate);
      });
    }

    const q = query(
        collection(db, "sessionBookings"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getTotalContactSubmissionsCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("contactSubmissions", adminCtx.branchId);
    }
    const q = query(collection(db, "contactSubmissions"));
    return getCount(q);
}

export async function getMonthlyContactSubmissionsCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("contactSubmissions", adminCtx.branchId, (d) => {
        const dt = toJsDate(d.createdAt);
        return Boolean(dt && dt >= startDate && dt < endDate);
      });
    }

    const q = query(
        collection(db, "contactSubmissions"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getTotalUpdatesCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("updates", adminCtx.branchId);
    }
    const q = query(collection(db, "updates"));
    return getCount(q);
}

export async function getMonthlyUpdatesCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("updates", adminCtx.branchId, (d) => {
        const dt = toJsDate(d.createdAt);
        return Boolean(dt && dt >= startDate && dt < endDate);
      });
    }

    const q = query(
        collection(db, "updates"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getActiveUsersCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => String(d.role || '').toLowerCase() !== 'admin' && d.status === 'approved');
    }
    const q = query(collection(db, "users"), where("status", "==", "approved"));
    return getCount(q);
}

export async function getInactiveUsersCount() {
    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => String(d.role || '').toLowerCase() !== 'admin' && d.status === 'inactive');
    }
    const q = query(collection(db, "users"), where("status", "==", "inactive"));
    return getCount(q);
}

export async function getMonthlyActiveUsersCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const adminCtx = await getServerAdminContext();
    if (adminCtx?.isBranchAdmin) {
      return getBranchScopedCount("users", adminCtx.branchId, (d) => {
        if (String(d.role || '').toLowerCase() === 'admin' || d.status !== 'approved') return false;
        const dt = toJsDate(d.createdAt);
        return Boolean(dt && dt >= startDate && dt < endDate);
      });
    }

    const q = query(collection(db, "users"), where("status", "==", "approved"), where("createdAt", ">=", startDate), where("createdAt", "<", endDate));
    return getCount(q);
}


// Stats
const getFiscalYearBoundaries = (date: Date) => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    let fiscalYearStart, fiscalYearEnd;

    if (currentMonth >= 3) { // April (month 3) to December
        fiscalYearStart = new Date(currentYear, 3, 1);
        fiscalYearEnd = new Date(currentYear + 1, 2, 31, 23, 59, 59, 999);
    } else { // January to March
        fiscalYearStart = new Date(currentYear - 1, 3, 1);
        fiscalYearEnd = new Date(currentYear, 2, 31, 23, 59, 59, 999);
    }
    return { fiscalYearStart, fiscalYearEnd };
};

export async function getMonthlyUserStats() {
    try {
        const adminCtx = await getServerAdminContext();
        const now = new Date();
        const { fiscalYearStart, fiscalYearEnd } = getFiscalYearBoundaries(now);

        const allUsersQuery = query(
            collection(db, "users"),
            where("createdAt", ">=", fiscalYearStart),
            where("createdAt", "<=", fiscalYearEnd)
        );
        const allUsersSnapshot = await getDocs(allUsersQuery);
        const allUsers = allUsersSnapshot.docs
          .map(doc => {
            const data = doc.data();
            const createdAtData = data.createdAt;
            const createdAtDate = createdAtData instanceof Timestamp
                ? createdAtData.toDate()
                : (typeof createdAtData === 'string' ? new Date(createdAtData) : new Date());
            return {
                ...data,
                createdAt: createdAtDate
            } as Record<string, any> & { createdAt: Date };
          })
          .filter((u: any) => {
            if (!adminCtx?.isBranchAdmin) return true;
            return String(u.role || '').toLowerCase() !== 'admin' && recordMatchesBranch(u, adminCtx.branchId);
          });

        const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
        
        let cumulativeData: { [key: string]: any } = {};

        monthNames.forEach(month => {
            cumulativeData[month] = { name: month, newStudents: 0, totalUsers: 0, totalStudents: 0, trainedStudents: 0, totalTeachers: 0 };
        });

        allUsers.forEach(user => {
            const monthIndex = user.createdAt.getMonth();
            let fiscalMonthName: string;
            if (monthIndex >= 3) {
                fiscalMonthName = monthNames[monthIndex - 3];
            } else {
                fiscalMonthName = monthNames[monthIndex + 9];
            }

            if(cumulativeData[fiscalMonthName]) {
                cumulativeData[fiscalMonthName].totalUsers += 1;
                if (user.role === 'student') {
                    cumulativeData[fiscalMonthName].totalStudents += 1;
                    if (user.status === 'approved') {
                        cumulativeData[fiscalMonthName].newStudents += 1;
                        if (user.teacherIds && user.teacherIds.length > 0) {
                            cumulativeData[fiscalMonthName].trainedStudents += 1;
                        }
                    }
                } else if (user.role === 'teacher') {
                    cumulativeData[fiscalMonthName].totalTeachers += 1;
                }
            }
        });
        
        let cumulativeUsers = 0, cumulativeStudents = 0, cumulativeTrained = 0, cumulativeTeachers = 0;
        
        const cumulativeChartData = monthNames.map(month => {
            cumulativeUsers += cumulativeData[month].totalUsers;
            cumulativeStudents += cumulativeData[month].totalStudents;
            cumulativeTrained += cumulativeData[month].trainedStudents;
            cumulativeTeachers += cumulativeData[month].totalTeachers;

            return {
                name: month,
                newStudents: cumulativeData[month].newStudents,
                totalUsers: cumulativeUsers,
                totalStudents: cumulativeStudents,
                trainedStudents: cumulativeTrained,
                totalTeachers: cumulativeTeachers
            };
        });

        return { success: true, data: cumulativeChartData };

    } catch (error) {
        console.error("Error fetching monthly user stats:", error);
        return { success: false, message: "Failed to fetch monthly stats." };
    }
}
