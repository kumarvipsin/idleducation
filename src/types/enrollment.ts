// src/types/enrollment.ts
import { z } from "zod";

export const enrollmentSchema = z.object({
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  fatherName: z.string().min(2, { message: "Father / Guardian name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email().optional().or(z.literal('')),
  mode: z.enum(['Offline', 'Online', 'Hybrid'], {
    errorMap: () => ({ message: "Please select your learning mode (Offline, Online, or Hybrid)." }),
  }),
  branch: z.string().min(1, { message: "Please select a branch." }),
  branchSlug: z.string().optional(),
  classLevel: z.string().min(1, { message: "Please select a class / grade." }),
  course: z.string().min(1, { message: "Please select a course / stream." }),
  subjects: z.array(z.string()).optional().default([]),
  programTitle: z.string().optional(),
  state: z.string().optional().default('Delhi'),
  city: z.string().optional(),
  pincode: z.string().optional(),
  previousSchool: z.string().optional(),
  remarks: z.string().optional(),
  source: z.string().optional().default('Main Website'),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export interface EnrollmentRecord extends EnrollmentFormValues {
  id: string;
  status: 'new' | 'contacted' | 'enrolled' | 'follow-up' | 'closed';
  createdAt: string;
}

