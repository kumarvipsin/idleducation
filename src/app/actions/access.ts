
'use server';

import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  increment,
  getDoc,
  deleteDoc,
  orderBy
} from "firebase/firestore";
import { serializeFirestoreData } from './utils';

/**
 * Logs a phone number access attempt and updates the user's login stats.
 * Groups data under the same phone number by updating/creating a User document.
 */
export async function logAccessAttempt(phoneNumber: string, otp: string, isSuccessful: boolean) {
  try {
    // 1. Find or create the User document keyed by phone number
    // Using phone number as a unique ID for simplicity in grouping
    const userDocRef = doc(db, "users", `phone-${phoneNumber}`);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      // Initial Registration
      await setDoc(userDocRef, {
        phoneNumber,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        loginCount: isSuccessful ? 1 : 0,
        role: 'visitor', // Default role for phone-verified visitors
        status: 'approved'
      });
    } else {
      // Existing user - increment stats if successful
      if (isSuccessful) {
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
          loginCount: increment(1)
        });
      }
    }

    // 2. Log the individual access attempt
    const logRef = collection(db, "userAccessLogs");
    await addDoc(logRef, {
      userId: `phone-${phoneNumber}`,
      phoneNumber,
      otpEntered: otp,
      accessTimestamp: serverTimestamp(),
      isSuccessful,
      eventType: userSnap.exists() ? 'LoginAttempt' : 'InitialRegistration'
    });

    return { success: true, message: "Access logged successfully." };
  } catch (error) {
    console.error("Error logging access attempt:", error);
    return { success: false, message: "Internal server error." };
  }
}

/**
 * Fetches all user access logs for administrative overview.
 */
export async function getAccessLogs() {
  try {
    const logsQuery = query(collection(db, "userAccessLogs"), orderBy("accessTimestamp", "desc"));
    const querySnapshot = await getDocs(logsQuery);
    const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: logs };
  } catch (error) {
    console.error("Error fetching access logs:", error);
    return { success: false, message: "Failed to fetch logs." };
  }
}

/**
 * Fetches summary stats for the access dashboard.
 */
export async function getAccessStats() {
  try {
    // Simple way to get counts for a prototype
    const usersSnap = await getDocs(collection(db, "users"));
    const logsSnap = await getDocs(collection(db, "userAccessLogs"));
    
    // Filter out real system users (admins/teachers) to get unique phone visitors
    const visitors = usersSnap.docs.filter(d => d.id.startsWith('phone-'));

    return {
      success: true,
      data: {
        totalAttempts: logsSnap.size,
        uniqueVisitors: visitors.length,
        totalSuccessfulLogins: visitors.reduce((acc, curr) => acc + (curr.data().loginCount || 0), 0)
      }
    };
  } catch (error) {
    console.error("Error fetching access stats:", error);
    return { success: false, message: "Failed to fetch stats." };
  }
}

/**
 * Deletes an access log entry.
 */
export async function deleteAccessLog(logId: string) {
  try {
    await deleteDoc(doc(db, "userAccessLogs", logId));
    return { success: true, message: "Log deleted successfully." };
  } catch (error) {
    console.error("Error deleting log:", error);
    return { success: false, message: "Failed to delete log." };
  }
}
