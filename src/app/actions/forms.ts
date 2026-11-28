// src/app/actions/forms.ts
'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import Razorpay from 'razorpay';
import { uploadFileToGCS } from '@/lib/gcs';
import { normalizeBranchId } from '@/lib/branch-utils';

const optionalTenDigitPhoneSchema = z
  .string()
  .regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." })
  .optional()
  .or(z.literal(''));

const optionalEmailSchema = z
  .string()
  .email({ message: "Please enter a valid email address." })
  .optional()
  .or(z.literal(''));

function validatePrimaryContact(
  data: { fatherPhone?: string; mobile?: string },
  ctx: z.RefinementCtx
) {
  const resolvedMobile = (data.fatherPhone || data.mobile || '').trim();
  if (!/^\d{10}$/.test(resolvedMobile)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid 10-digit father contact number.",
      path: ['fatherPhone'],
    });
  }
}

function normalizeContactFields(data: {
  fatherPhone?: string;
  motherPhone?: string;
  studentPhone?: string;
  mobile?: string;
  email?: string;
}) {
  const fatherPhone = (data.fatherPhone || data.mobile || '').trim();
  return {
    fatherPhone,
    motherPhone: data.motherPhone?.trim() || '',
    studentPhone: data.studentPhone?.trim() || '',
    mobile: fatherPhone,
    email: data.email?.trim() || '',
  };
}

const freeSessionSchema = z
  .object({
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    guardianName: z.string().optional(),
    classCourse: z.string().min(1, { message: "Please select a class or course." }),
    programTitle: z.string().optional(),
    fatherPhone: optionalTenDigitPhoneSchema,
    motherPhone: optionalTenDigitPhoneSchema,
    studentPhone: optionalTenDigitPhoneSchema,
    mobile: optionalTenDigitPhoneSchema,
    email: optionalEmailSchema,
    state: z.string().optional(),
    branch: z.string().optional(),
    nearestBranch: z.string().optional().or(z.literal('')),
    mode: z.string().optional(),
    sessionMode: z.string().optional(),
    subjects: z.string().optional(),
  })
  .superRefine(validatePrimaryContact);
type FreeSessionValues = z.infer<typeof freeSessionSchema>;

export async function bookFreeSession(data: FreeSessionValues) {
  const validation = freeSessionSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }
  
  try {
    const rawMode = (validation.data.mode || validation.data.sessionMode || '').trim();
    const normalizedMode = rawMode
      ? rawMode.charAt(0).toUpperCase() + rawMode.slice(1).toLowerCase()
      : undefined;
    const normalizedBranchId = normalizeBranchId(validation.data.branch || validation.data.nearestBranch);
    const trimmedTitle = validation.data.programTitle?.trim() || '';
    const formattedClassCourse = trimmedTitle
      ? `${validation.data.classCourse} — ${trimmedTitle}`
      : validation.data.classCourse;
    const contactFields = normalizeContactFields(validation.data);

    await addDoc(collection(db, "sessionBookings"), {
      ...validation.data,
      ...contactFields,
      classCourse: formattedClassCourse,
      ...(trimmedTitle ? { programTitle: trimmedTitle } : {}),
      ...(normalizedMode ? { mode: normalizedMode, sessionMode: normalizedMode.toLowerCase() } : {}),
      ...(normalizedBranchId && normalizedBranchId !== 'all' ? { branchId: normalizedBranchId } : {}),
      country: 'India',
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your free session has been booked successfully!" };
  } catch (error) {
    console.error("Error booking session:", error);
    return { success: false, message: "Failed to book session. Please try again later." };
  }
}

const scholarshipSchema = z
  .object({
    registrationId: z.string().optional().or(z.literal('')),
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    fatherName: z.string().min(2, { message: "Father name is required." }).optional().or(z.literal('')),
    guardianName: z.string().min(2, { message: "Guardian name is required." }).optional().or(z.literal('')),
    fatherOccupation: z.string().optional().or(z.literal('')),
    motherName: z.string().optional().or(z.literal('')),
    motherOccupation: z.string().optional().or(z.literal('')),
    dob: z.string().optional().or(z.literal('')),
    gender: z.string().optional().or(z.literal('')),
    class: z.string().min(1, { message: "Please select a class." }),
    programTitle: z.string().optional().or(z.literal('')),
    subjects: z.string().optional().or(z.literal('')),
    fatherPhone: optionalTenDigitPhoneSchema,
    motherPhone: optionalTenDigitPhoneSchema,
    studentPhone: optionalTenDigitPhoneSchema,
    mobile: optionalTenDigitPhoneSchema,
    email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    previousSchool: z.string().optional().or(z.literal('')),
    previousSubjects: z.string().optional().or(z.literal('')),
    previousMarks: z.string().optional().or(z.literal('')),
    scholarshipReason: z.string().optional().or(z.literal('')),
    feeAmount: z.number().optional(),
    paymentStatus: z.string().optional().or(z.literal('')),
    transactionId: z.string().optional().or(z.literal('')),
    otp: z.string().optional(),
    country: z.string().optional().default('India'),
    state: z.string().optional().default('Delhi'),
    city: z.string().optional(),
    branch: z.string().optional(),
    branchId: z.string().optional(),
    mode: z.string().optional().default('Offline'),
    message: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const resolvedGuardian = (data.guardianName || data.fatherName || '').trim();
    const resolvedMobile = (data.mobile || data.fatherPhone || '').trim();
    if (resolvedGuardian.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Father / Guardian name must be at least 2 characters.",
        path: ['fatherName'],
      });
    }
    if (!/^\d{10}$/.test(resolvedMobile)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid 10-digit contact number.",
        path: ['fatherPhone'],
      });
    }
  });
type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

export async function registerForScholarship(data: ScholarshipFormValues) {
    const validation = scholarshipSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data. Please check your inputs." };
    }

    try {
        const d = validation.data;
        const trimmedTitle = d.programTitle?.trim() || '';
        const trimmedSubjects = d.subjects?.trim() || '';
        const formattedClass = trimmedTitle
            ? `${d.class} — ${trimmedTitle}`
            : d.class;
        const normalizedBranchId = normalizeBranchId(d.branchId || d.branch);
        const resolvedGuardian = (d.guardianName || d.fatherName || '').trim();
        const resolvedMobile = (d.mobile || d.fatherPhone || '').trim();
        const summaryParts = [
          d.previousMarks?.trim() ? `Marks: ${d.previousMarks.trim()}` : '',
          d.previousSubjects?.trim() ? `Studied: ${d.previousSubjects.trim()}` : '',
          d.scholarshipReason?.trim() ? `Purpose: ${d.scholarshipReason.trim()}` : '',
        ].filter(Boolean);
        const resolvedMessage = (d.message?.trim() || summaryParts.join(' • ')).trim();
        const resolvedFeeAmount = typeof d.feeAmount === 'number' && !isNaN(d.feeAmount) ? d.feeAmount : 0;
        const resolvedPaymentStatus = d.paymentStatus?.trim() || (resolvedFeeAmount <= 0 ? 'free_waived' : 'paid');
        const resolvedTransactionId = d.transactionId?.trim() || (resolvedFeeAmount <= 0 ? 'FREE-WAIVER-0' : 'N/A');
        const resolvedRegistrationId =
          d.registrationId?.trim() || `SCH-${format(new Date(), 'ddMMyy')}-${Date.now().toString().slice(-3)}`;

        await addDoc(collection(db, "scholarshipRegistrations"), {
            ...d,
            registrationId: resolvedRegistrationId,
            fatherName: (d.fatherName || resolvedGuardian).trim(),
            guardianName: resolvedGuardian,
            fatherPhone: (d.fatherPhone || resolvedMobile).trim(),
            mobile: resolvedMobile,
            class: formattedClass,
            feeAmount: resolvedFeeAmount,
            paymentStatus: resolvedPaymentStatus,
            transactionId: resolvedTransactionId,
            ...(trimmedTitle ? { programTitle: trimmedTitle } : {}),
            ...(trimmedSubjects ? { subjects: trimmedSubjects } : {}),
            ...(resolvedMessage ? { message: resolvedMessage } : {}),
            ...(normalizedBranchId && normalizedBranchId !== 'all' ? { branchId: normalizedBranchId } : {}),
            createdAt: serverTimestamp(),
        });
        return {
          success: true,
          message: "You have successfully registered for the scholarship!",
          registrationId: resolvedRegistrationId,
        };
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
  branch: z.string().optional(),
  branchId: z.string().optional(),
  message: z.string().optional(),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContactForm(data: ContactFormValues) {
  const validation = contactFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }

  try {
    const normalizedBranchId = normalizeBranchId(validation.data.branchId || validation.data.branch);
    await addDoc(collection(db, "contactSubmissions"), {
      ...validation.data,
      ...(normalizedBranchId ? { branchId: normalizedBranchId } : {}),
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  feedback: z.string().min(5, { message: "Feedback message must be at least 5 characters." }),
  rating: z.number().min(1, { message: "Please select a rating (1-10)." }).max(10),
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

const enquirySchema = z
  .object({
    studentName: z.string().min(2),
    guardianName: z.string().min(2),
    classCourse: z.string().min(1),
    programTitle: z.string().optional(),
    fatherPhone: optionalTenDigitPhoneSchema,
    motherPhone: optionalTenDigitPhoneSchema,
    studentPhone: optionalTenDigitPhoneSchema,
    mobile: optionalTenDigitPhoneSchema,
    email: optionalEmailSchema,
    state: z.string().optional().default('Delhi'),
    branch: z.string().optional(),
    mode: z.string().optional(),
    message: z.string().min(2),
  })
  .superRefine(validatePrimaryContact);

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export async function submitStudentEnquiry(data: EnquiryFormValues) {
  const validation = enquirySchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check all fields." };
  }

  try {
    const trimmedTitle = validation.data.programTitle?.trim() || '';
    const formattedClassCourse = trimmedTitle
      ? `${validation.data.classCourse} — ${trimmedTitle}`
      : validation.data.classCourse;
    const normalizedBranchId = normalizeBranchId(validation.data.branch);
    const contactFields = normalizeContactFields(validation.data);

    await addDoc(collection(db, "studentEnquiries"), {
      ...validation.data,
      ...contactFields,
      classCourse: formattedClassCourse,
      ...(trimmedTitle ? { programTitle: trimmedTitle } : {}),
      ...(normalizedBranchId && normalizedBranchId !== 'all' ? { branchId: normalizedBranchId } : {}),
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
        fatherOccupation: rawFormData.fatherOccupation as string || '',
        motherName: rawFormData.motherName as string || '',
        motherOccupation: rawFormData.motherOccupation as string || '',
        dob: rawFormData.dob as string,
        gender: rawFormData.gender as string,
        bloodGroup: rawFormData.bloodGroup as string || '',
        aadharNumber: rawFormData.aadharNumber as string || '',
        apaarId: rawFormData.apaarId as string || '',
        email: rawFormData.email as string || '',
        studentPhone: rawFormData.studentPhone as string || '',
        fatherPhone: rawFormData.fatherPhone as string || '',
        motherPhone: rawFormData.motherPhone as string || '',
        parentEmail: rawFormData.parentEmail as string || '',
        address: rawFormData.address as string,
        city: (rawFormData.city as string) || '',
        pincode: (rawFormData.pincode as string) || '',
        state: (rawFormData.state as string) || '',
        emergencyContact: rawFormData.emergencyContact as string || '',
        classApplied: rawFormData.classApplied as string,
        board: rawFormData.board as string || '',
        medium: rawFormData.medium as string || '',
        mode: rawFormData.mode as string || 'Offline Classroom',
        program: rawFormData.program as string || '',
        previousSchool: rawFormData.previousSchool as string || '',
        previousClass: rawFormData.previousClass as string || '',
        previousPercentage: rawFormData.previousPercentage as string || '',
        stream: rawFormData.stream as string || '',
        scholarshipTest: rawFormData.scholarshipTest as string || '',
        additionalInfo: rawFormData.additionalInfo as string || '',
        branch: rawFormData.branch as string,
        admissionSession: rawFormData.admissionSession as string || '2026-2027',
        acceptedTerms: rawFormData.acceptedTerms === 'true',
        feeAmount: Number(rawFormData.feeAmount ?? 0) || 0,
        paymentStatus: (rawFormData.paymentStatus as string) || 'free_waived',
        transactionId: rawFormData.transactionId as string || 'N/A',
    };
    
    try {
        let studentPhotoPath = '';
        if (studentPhoto && studentPhoto.size > 0) {
            const destination = `student_photos/${admissionData.studentId}-${studentPhoto.name}`;
            await uploadFileToGCS(studentPhoto, destination);
            studentPhotoPath = destination;
        }
        
        const rawProgram = (rawFormData.program as string || '').trim();
        const rawClassApplied = (rawFormData.classApplied as string || '').trim();
        const formattedClassApplied = rawProgram && rawClassApplied && !rawClassApplied.includes(rawProgram)
            ? `${rawClassApplied} — ${rawProgram}`
            : rawClassApplied;
        const normalizedBranchId = normalizeBranchId(admissionData.branch);

        await addDoc(collection(db, "admissions"), {
            ...admissionData,
            classApplied: formattedClassApplied,
            ...(normalizedBranchId && normalizedBranchId !== 'all' ? { branchId: normalizedBranchId } : {}),
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

export async function submitQuickAdmission(data: {
    studentName: string;
    guardianName: string;
    mobile: string;
    branch: string;
    state: string;
    classApplied: string;
    previousSchool?: string;
}) {
    try {
        const studentIdRes = await getNextStudentId();
        const studentId = studentIdRes.success ? studentIdRes.studentId : `IDL-${Date.now().toString().slice(-6)}`;
        await addDoc(collection(db, "admissions"), {
            studentId,
            studentName: data.studentName,
            fatherName: data.guardianName,
            fatherPhone: data.mobile,
            mobile: data.mobile,
            branch: data.branch,
            state: data.state || 'Delhi',
            classApplied: data.classApplied,
            previousSchool: data.previousSchool || '',
            admissionSession: '2026–27',
            status: 'submitted',
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Admission form submitted successfully.", studentId };
    } catch (error) {
        console.error("Error submitting quick admission:", error);
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

export async function getNextScholarshipId() {
  try {
    const datePrefix = format(new Date(), 'ddMMyy');
    const scholarshipQuery = query(
      collection(db, "scholarshipRegistrations"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(scholarshipQuery);
    let nextSequence = 101;
    if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0].data();
      const lastId = String(lastDoc.registrationId || '');
      const parts = lastId.split('-');
      const seqNum = parseInt(parts[parts.length - 1] || '', 10);
      if (!isNaN(seqNum)) {
        nextSequence = seqNum + 1;
      }
    }
    return { success: true, registrationId: `SCH-${datePrefix}-${nextSequence}` };
  } catch (error) {
    console.error("Error generating next scholarship ID:", error);
    return { success: false, message: "Failed to generate scholarship registration ID." };
  }
}

// Payment
export async function createRazorpayOrder(options: { amount: number; currency?: string } | number, receiptId?: string) {
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RKEYtYbYMDeMpw';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'DkkvSEi6m4L5o9WrxklyrlVE';

    let amount = typeof options === 'number' ? options : Number(options?.amount);
    let currency = (typeof options === 'object' && options?.currency) ? options.currency : 'INR';

    if (!amount || isNaN(amount) || amount <= 0) {
        console.error("Invalid amount provided to createRazorpayOrder:", options);
        return { success: false, message: "Invalid payment amount." };
    }

    try {
        const razorpay = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        const order = await razorpay.orders.create({
            amount: Math.round(amount), // amount in the smallest currency unit (paise)
            currency: currency,
            receipt: receiptId || `receipt_${Date.now()}`,
        });

        const orderData = JSON.parse(JSON.stringify(order));
        return { 
            success: true, 
            order: orderData,
            orderId: orderData.id,
            amount: orderData.amount,
            currency: orderData.currency,
            message: "Order created successfully"
        };
    } catch (error: any) {
        console.error("Error creating Razorpay order:", error);
        return { 
            success: false, 
            message: error?.error?.description || error?.message || "Failed to create Razorpay order." 
        };
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
