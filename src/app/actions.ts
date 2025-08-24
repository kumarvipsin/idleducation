'use server';

import { z } from "zod";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

export async function bookFreeSession(data: FormValues) {
  console.log("Booking session with data:", data);
  // Here you would typically handle the form data, e.g., send it to a database or an API.
  return { success: true, message: "Your free session has been booked successfully!" };
}
