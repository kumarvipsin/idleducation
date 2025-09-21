// src/app/actions/forms.ts
'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import Razorpay from 'razorpay';
import { uploadFileToGCS } from '@/lib/gcs';

const freeSessionSchema = z.object({
  sessionMode: z.enum(["online", "offline"], { required_error: "Please select a session mode." }),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select a class or course." }),
  country: z.string().min(1, { message: "Please select a country." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});
type FreeSessionValues = z.infer<typeof freeSessionSchema>;

export async function bookFreeSession(data: FreeSessionValues) {
  const validation = freeSessionSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }
  
  try {
    await addDoc(collection(db, "sessionBookings"), {
      ...validation.data,
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your free session has been booked successfully!" };
  } catch (error) {
    console.error("Error booking session:", error);
    return { success: false, message: "Failed to book session. Please try again later." };
  }
}

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian name is required." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  country: z.string().min(1, { message: "Please select a country." }),
  state: z.string().min(1, { message: "Please select a state." }),
});
type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

export async function registerForScholarship(data: ScholarshipFormValues) {
    const validation = scholarshipSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data. Please check your inputs." };
    }

    try {
        await addDoc(collection(db, "scholarshipRegistrations"), {
            ...validation.data,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "You have successfully registered for the scholarship!" };
    } catch (error) {
        console.error("Error registering for scholarship:", error);
        return { success: false, message: "Registration failed. Please try again later." };
    }
}

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  country: z.string().optional(),
  state: z.string().min(1, { message: "Please select a state." }),
  message: z.string().optional(),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContactForm(data: ContactFormValues) {
  const validation = contactFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }

  try {
    await addDoc(collection(db, "contactSubmissions"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}

const supportTicketSchema = z.object({
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    problem: z.string().min(10, { message: "Please describe your problem in at least 10 characters." }),
});
type SupportTicketValues = z.infer<typeof supportTicketSchema>;

export async function submitSupportTicket(data: SupportTicketValues) {
    const validation = supportTicketSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data provided. Please check your inputs." };
    }

    try {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ticketId = `IDL-${timestamp}-${randomPart}`;
        
        await addDoc(collection(db, "supportTickets"), {
            ...validation.data,
            ticketId: ticketId,
            status: 'new',
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Your support ticket has been submitted successfully!", ticketId: ticketId };
    } catch (error) {
        console.error("Error submitting support ticket:", error);
        return { success: false, message: "Failed to submit ticket. Please try again later." };
    }
}

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category." }),
  rating: z.number().min(1, { message: "Please provide a rating." }),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});
type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export async function submitFeedback(data: FeedbackFormValues) {
  const validation = feedbackSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }

  try {
    await addDoc(collection(db, "feedbackSubmissions"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Thank you for your valuable feedback!" };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: "Failed to submit feedback. Please try again later." };
  }
}

export async function submitAdmissionForm(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const studentPhoto = rawFormData.studentPhoto as File;

    const admissionData = {
        studentId: rawFormData.studentId as string,
        studentName: rawFormData.studentName as string,
        fatherName: rawFormData.fatherName as string,
        fatherOccupation: rawFormData.fatherOccupation as string || '',
        motherName: rawFormData.motherName as string,
        motherOccupation: rawFormData.motherOccupation as string || '',
        dob: rawFormData.dob as string,
        gender: rawFormData.gender as string,
        bloodGroup: rawFormData.bloodGroup as string || '',
        aadharNumber: rawFormData.aadharNumber as string || '',
        apaarId: rawFormData.apaarId as string || '',
        email: rawFormData.email as string,
        studentPhone: rawFormData.studentPhone as string || '',
        fatherPhone: rawFormData.fatherPhone as string,
        motherPhone: rawFormData.motherPhone as string,
        address: rawFormData.address as string,
        pincode: rawFormData.pincode as string,
        state: rawFormData.state as string,
        classApplied: rawFormData.classApplied as string,
        previousSchool: rawFormData.previousSchool as string || '',
        additionalInfo: rawFormData.additionalInfo as string || '',
        branch: rawFormData.branch as string,
        transactionId: rawFormData.transactionId as string,
    };
    
    try {
        let studentPhotoPath = '';
        if (studentPhoto && studentPhoto.size > 0) {
            const destination = `student_photos/${admissionData.studentId}-${studentPhoto.name}`;
            await uploadFileToGCS(studentPhoto, destination);
            studentPhotoPath = destination;
        }
        
        await addDoc(collection(db, "admissions"), {
            ...admissionData,
            studentPhotoUrl: studentPhotoPath,
            createdAt: serverTimestamp(),
            status: 'submitted',
        });
        
        return { success: true, message: "Admission form submitted successfully." };
    } catch (error) {
        console.error("Error submitting admission form:", error);
        return { success: false, message: "Failed to submit admission form." };
    }
}

// Utility
export async function getNextStudentId() {
  try {
    const today = new Date();
    const datePrefix = format(today, 'ddMMyy');

    const admissionsQuery = query(
      collection(db, "admissions"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(admissionsQuery);
    
    let nextSequence = 101;

    if (!querySnapshot.empty) {
      const lastAdmission = querySnapshot.docs[0].data();
      const lastId = lastAdmission.studentId;
      if (lastId && lastId.includes('-')) {
        const lastSequence = parseInt(lastId.split('-')[1], 10);
        if (!isNaN(lastSequence)) {
          nextSequence = lastSequence + 1;
        }
      }
    }

    const studentId = `${datePrefix}-${nextSequence}`;
    
    return { success: true, studentId: studentId };
  } catch (error) {
    console.error("Error generating next student ID:", error);
    return { success: false, message: "Failed to generate student ID." };
  }
}

// Payment
export async function createRazorpayOrder(options: { amount: number; currency: string }) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const order = await razorpay.orders.create({
            amount: options.amount, // amount in the smallest currency unit
            currency: options.currency,
            receipt: `receipt_order_${new Date().getTime()}`,
        });
        return { success: true, order };
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return { success: false, message: "Failed to create Razorpay order." };
    }
}
