// src/app/actions/data.ts
'use server';

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, getCountFromServer, limit, doc, getDoc, Timestamp } from "firebase/firestore";
import { serializeFirestoreData } from './utils';

// Data Fetching
export async function getSessionBookings() {
  try {
    const bookingsQuery = query(collection(db, "sessionBookings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(bookingsQuery);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: bookings };
  } catch (error) {
    console.error("Error fetching session bookings:", error);
    return { success: false, message: "Failed to fetch session bookings." };
  }
}

export async function getContactSubmissions() {
  try {
    const submissionsQuery = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(submissionsQuery);
    const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: submissions };
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return { success: false, message: "Failed to fetch contact submissions." };
  }
}

export async function getSupportTickets() {
  try {
    const ticketsQuery = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(ticketsQuery);
    const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: tickets };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return { success: false, message: "Failed to fetch support tickets." };
  }
}

export async function getScholarshipRegistrations() {
  try {
    const registrationsQuery = query(collection(db, "scholarshipRegistrations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(registrationsQuery);
    const registrations = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: registrations };
  } catch (error) {
    console.error("Error fetching scholarship registrations:", error);
    return { success: false, message: "Failed to fetch scholarship registrations." };
  }
}

export async function getUpdates(count?: number) {
  try {
    let updatesQuery;
    if (count) {
        updatesQuery = query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(count));
    } else {
        updatesQuery = query(collection(db, "updates"), orderBy("createdAt", "desc"));
    }
    const querySnapshot = await getDocs(updatesQuery);
    const updates = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: updates };
  } catch (error) {
    console.error("Error fetching updates:", error);
    return { success: false, message: "Failed to fetch updates." };
  }
}

export async function getFeedbackSubmissions() {
    try {
        const feedbackQuery = query(collection(db, "feedbackSubmissions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(feedbackQuery);
        const feedback = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: feedback };
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return { success: false, message: "Failed to fetch feedback submissions." };
    }
}

export async function getAdmissions() {
  try {
    const admissionsQuery = query(collection(db, "admissions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(admissionsQuery);
    const admissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: admissions };
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return { success: false, message: "Failed to fetch admissions." };
  }
}

export async function getNcertSolutions(className: string, subject: string) {
  try {
    const docRef = doc(db, "notes", className);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data[subject]) {
        return { success: true, data: data[subject] };
      }
    }
    
    return { success: false, message: `No data found for ${className} - ${subject}.` };

  } catch (error) {
    console.error("Error fetching NCERT solutions:", error);
    return { success: false, message: "Failed to fetch NCERT solutions." };
  }
}

export async function getNotes() {
  try {
    const notesQuery = query(collection(db, "notes"));
    const querySnapshot = await getDocs(notesQuery);
    const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: notes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, message: "Failed to fetch notes." };
  }
}

export async function getImportantQuestions() {
  try {
    const questionsQuery = query(collection(db, "importantQuestions"));
    const querySnapshot = await getDocs(questionsQuery);
    const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: questions };
  } catch (error) {
    console.error("Error fetching important questions:", error);
    return { success: false, message: "Failed to fetch important questions." };
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

// Count Functions
async function getCount(q: any) {
    try {
        const snapshot = await getCountFromServer(q);
        return { success: true, count: snapshot.data().count };
    } catch (error) {
        console.error("Error getting count from server: ", error);
        return { success: false, message: "Failed to fetch count." };
    }
}

export async function getNewSessionBookingsCount() {
  try {
    const bookingsQuery = query(collection(db, "sessionBookings"), where("status", "==", "new"));
    const querySnapshot = await getDocs(bookingsQuery);
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    console.error("Error fetching new session bookings count:", error);
    return { success: false, message: "Failed to fetch new session bookings count." };
  }
}

export async function getTotalUsersCount() {
    const q = query(collection(db, "users"));
    return getCount(q);
}

export async function getTotalStudentsCount() {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    return getCount(q);
}

export async function getTotalTeachersCount() {
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    return getCount(q);
}

export async function getNewStudentsCount() {
    const q = query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "approved"));
    return getCount(q);
}

export async function getTrainedStudentsCount() {
    const q = query(
      collection(db, "users"), 
      where("role", "==", "student"), 
      where("status", "==", "approved"),
      where("teacherIds", "!=", [])
    );
    return getCount(q);
}

export async function getDeniedUsersCount() {
    const q = query(collection(db, "deniedUsers"));
    return getCount(q);
}

export async function getTotalSessionBookingsCount() {
    const q = query(collection(db, "sessionBookings"));
    return getCount(q);
}

export async function getMonthlySessionBookingsCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = query(
        collection(db, "sessionBookings"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getTotalContactSubmissionsCount() {
    const q = query(collection(db, "contactSubmissions"));
    return getCount(q);
}

export async function getMonthlyContactSubmissionsCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = query(
        collection(db, "contactSubmissions"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getTotalUpdatesCount() {
    const q = query(collection(db, "updates"));
    return getCount(q);
}

export async function getMonthlyUpdatesCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = query(
        collection(db, "updates"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getActiveUsersCount() {
    const q = query(collection(db, "users"), where("status", "==", "approved"));
    return getCount(q);
}

export async function getInactiveUsersCount() {
    const q = query(collection(db, "users"), where("status", "==", "inactive"));
    return getCount(q);
}

export async function getMonthlyActiveUsersCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
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
        const now = new Date();
        const { fiscalYearStart, fiscalYearEnd } = getFiscalYearBoundaries(now);

        const allUsersQuery = query(
            collection(db, "users"),
            where("createdAt", ">=", fiscalYearStart),
            where("createdAt", "<=", fiscalYearEnd)
        );
        const allUsersSnapshot = await getDocs(allUsersQuery);
        const allUsers = allUsersSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAtData = data.createdAt;
            const createdAtDate = createdAtData instanceof Timestamp
                ? createdAtData.toDate()
                : (typeof createdAtData === 'string' ? new Date(createdAtData) : new Date());
            return {
                ...data,
                createdAt: createdAtDate
            };
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
