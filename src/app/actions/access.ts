
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
    const userDocRef = doc(db, "users", `phone-${phoneNumber}`);
    const userSnap = await getDoc(userDocRef);
    let currentLoginCount = 0;

    if (!userSnap.exists()) {
      // Initial Registration
      currentLoginCount = isSuccessful ? 1 : 0;
      await setDoc(userDocRef, {
        phoneNumber,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        loginCount: currentLoginCount,
        totalTimeSpentSeconds: 0,
        role: 'visitor',
        status: 'approved'
      });
    } else {
      const userData = userSnap.data();
      currentLoginCount = (userData.loginCount || 0) + (isSuccessful ? 1 : 0);
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

    return { 
      success: true, 
      message: "Access logged successfully.", 
      loginCount: currentLoginCount 
    };
  } catch (error) {
    console.error("Error logging access attempt:", error);
    return { success: false, message: "Internal server error." };
  }
}

/**
 * Increments the time spent for a specific phone visitor.
 */
export async function incrementTimeSpent(phoneNumber: string, seconds: number) {
  try {
    const userDocRef = doc(db, "users", `phone-${phoneNumber}`);
    await updateDoc(userDocRef, {
      totalTimeSpentSeconds: increment(seconds)
    });
    return { success: true };
  } catch (error) {
    console.error("Error incrementing time spent:", error);
    return { success: false };
  }
}

/**
 * Fetches all user access logs for administrative overview.
 * Enriches grouped data with user profile metrics.
 */
export async function getAccessLogs() {
  try {
    const logsQuery = query(collection(db, "userAccessLogs"), orderBy("accessTimestamp", "desc"));
    const querySnapshot = await getDocs(logsQuery);
    
    // Fetch users to get engagement time
    const usersSnap = await getDocs(collection(db, "users"));
    const userMap = new Map();
    usersSnap.docs.forEach(d => userMap.set(d.id, d.data()));

    const logs = querySnapshot.docs.map(doc => {
      const logData = doc.data();
      const userData = userMap.get(logData.userId) || {};
      return { 
        id: doc.id, 
        ...serializeFirestoreData(logData),
        totalTimeSpentSeconds: userData.totalTimeSpentSeconds || 0,
        dbLoginCount: userData.loginCount || 0
      };
    });

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
    const usersSnap = await getDocs(collection(db, "users"));
    const logsSnap = await getDocs(collection(db, "userAccessLogs"));
    
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
