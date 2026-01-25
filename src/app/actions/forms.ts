
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
  state: z.string().optional(),
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
    mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
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

const enquirySchema = z.object({
  studentName: z.string().min(2),
  guardianName: z.string().min(2),
  classCourse: z.string().min(1),
  mobile: z.string().regex(/^\d{10}$/),
  email: z.string().email().optional().or(z.literal('')),
  state: z.string().min(1),
  message: z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export async function submitStudentEnquiry(data: EnquiryFormValues) {
  const validation = enquirySchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check all fields." };
  }

  try {
    await addDoc(collection(db, "studentEnquiries"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your enquiry has been submitted successfully!" };
  } catch (error) {
    console.error("Error submitting student enquiry:", error);
    return { success: false, message: "Failed to submit your enquiry. Please try again later." };
  }
}


export async function submitAdmissionForm(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const studentPhoto = rawFormData.studentPhoto as File;

    const admissionData = {
        studentId: rawFormData.studentId as string,
        studentName: rawFormData.studentName as string,
        fatherName: rawFormData.fatherName as string,
        fatherOccupation: rawData.fatherOccupation as string || '',
        motherName: rawData.motherName as string,
        motherOccupation: rawData.motherOccupation as string || '',
        dob: rawData.dob as string,
        gender: rawData.gender as string,
        bloodGroup: rawData.bloodGroup as string || '',
        aadharNumber: rawData.aadharNumber as string || '',
        apaarId: rawData.apaarId as string || '',
        email: rawData.email as string,
        studentPhone: rawData.studentPhone as string || '',
        fatherPhone: rawData.fatherPhone as string,
        motherPhone: rawData.motherPhone as string,
        address: rawData.address as string,
        pincode: rawData.pincode as string,
        state: rawData.state as string,
        classApplied: rawData.classApplied as string,
        previousSchool: rawData.previousSchool as string || '',
        additionalInfo: rawData.additionalInfo as string || '',
        branch: rawData.branch as string,
        transactionId: rawData.transactionId as string,
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

const volunteerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address is required." }),
  availability: z.string().min(1, { message: "Please select your availability." }),
  reason: z.string().min(20, { message: "Please tell us why you want to volunteer (min. 20 characters)." }),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

export async function submitVolunteerForm(data: VolunteerFormValues) {
  const validation = volunteerSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }

  try {
    await addDoc(collection(db, "volunteerApplications"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your application has been submitted successfully!" };
  } catch (error) {
    console.error("Error submitting volunteer form:", error);
    return { success: false, message: "Failed to submit your application. Please try again later." };
  }
}

const donationSchema = z.object({
    name: z.string().optional(),
    contact: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    place: z.string().optional(),
    amount: z.number(),
    category: z.string(),
    paymentId: z.string(),
});
type DonationValues = z.infer<typeof donationSchema>;

export async function recordDonation(data: DonationValues) {
  const validation = donationSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    await addDoc(collection(db, "donations"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Donation recorded successfully." };
  } catch (error) {
    console.error("Error recording donation:", error);
    return { success: false, message: "Failed to record donation." };
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
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay keys are not set in environment variables.");
        return { success: false, message: "Payment service is not configured." };
    }
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

const callBackSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  place: z.string().min(1, { message: "Place is required." }),
  classCourse: z.string().min(1, { message: "Class/Course is required." }),
});

type CallBackFormValues = z.infer<typeof callBackSchema>;

export async function requestCallBack(data: CallBackFormValues) {
  const validation = callBackSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }
  
  try {
    await addDoc(collection(db, "callBackRequests"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your request has been received. We will call you back shortly!" };
  } catch (error) {
    console.error("Error requesting callback:", error);
    return { success: false, message: "Failed to submit request. Please try again later." };
  }
}

    