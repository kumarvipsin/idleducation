
'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { serializeFirestoreData } from './utils';

// Schema for store user signup
const storeSignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type StoreSignupValues = z.infer<typeof storeSignupSchema>;

// Schema for store user login
const storeLoginSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type StoreLoginValues = z.infer<typeof storeLoginSchema>;


export async function signUpStoreUser(data: StoreSignupValues) {
  const validation = storeSignupSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid input data." };
  }

  const { name, mobile, password } = validation.data;

  try {
    // Check if user already exists
    const q = query(collection(db, "storeCustomers"), where("mobile", "==", mobile));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, message: "A user with this mobile number already exists." };
    }

    // In a real app, you would hash the password here before storing.
    // For this prototype, we'll store it as-is, but this is NOT secure.
    const hashedPassword = password; // Replace with a real hashing function like bcrypt

    await addDoc(collection(db, "storeCustomers"), {
      name,
      mobile,
      password: hashedPassword,
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "User registered successfully." };
  } catch (error) {
    console.error("Error signing up store user:", error);
    return { success: false, message: "An unexpected error occurred during signup." };
  }
}

export async function loginStoreUser(data: StoreLoginValues) {
  const validation = storeLoginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid input data." };
  }

  const { mobile, password } = validation.data;

  try {
    const q = query(collection(db, "storeCustomers"), where("mobile", "==", mobile));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: "Invalid mobile number or password." };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // In a real app, compare hashed passwords.
    // This is an insecure comparison for prototype purposes only.
    if (userData.password !== password) {
      return { success: false, message: "Invalid mobile number or password." };
    }

    // In a real app, you would generate and return a session token (e.g., JWT).
    // For this prototype, we'll just return a success message and user data.
    const userProfile = { id: userDoc.id, ...serializeFirestoreData(userData) };
    
    return { success: true, message: "Login successful!", user: userProfile };

  } catch (error) {
    console.error("Error logging in store user:", error);
    return { success: false, message: "An unexpected error occurred during login." };
  }
}


export async function getStoreCustomers() {
    try {
        const customersQuery = query(collection(db, "storeCustomers"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(customersQuery);
        const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: customers };
    } catch (error) {
        console.error("Error fetching store customers:", error);
        return { success: false, message: "Failed to fetch store customers." };
    }
}
