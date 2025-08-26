
'use server';
import { z } from "zod";
import nodemailer from "nodemailer";
import 'dotenv/config';

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please enter your class or course." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

export async function bookFreeSession(data: FormValues) {
  console.log("New free session booking request received:");
  console.log("Child's Name:", data.childName);
  console.log("Class/Course:", data.classCourse);
  console.log("Mobile Number:", data.mobile);
  console.log("Email Address:", data.email);
  console.log("State:", data.state);
  console.log("Session Mode:", data.sessionMode);

  const { GMAIL_EMAIL, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD || GMAIL_EMAIL === "your_email@gmail.com") {
    console.warn("Gmail credentials not configured in .env file. Skipping email sending.");
    // For demonstration purposes, we'll return success even if email is not sent.
    return { success: true, message: "Your free session has been booked successfully! (Email sending is disabled)." };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"IDL EDUCATION" <${GMAIL_EMAIL}>`,
    to: "idleducation.query@gmail.com",
    subject: "New Free Session Booking Request",
    html: `
      <h2>New Free Session Booking Request</h2>
      <p><strong>Child's Name:</strong> ${data.childName}</p>
      <p><strong>Class/Course:</strong> ${data.classCourse}</p>
      <p><strong>Mobile Number:</strong> ${data.mobile}</p>
      <p><strong>Email Address:</strong> ${data.email}</p>
      <p><strong>State:</strong> ${data.state}</p>
      <p><strong>Session Mode:</strong> ${data.sessionMode}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Your free session has been booked successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to book session. Please try again later." };
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
  role: z.enum(['student', 'teacher'])
});

type LoginValues = z.infer<typeof loginSchema>;

// Dummy user data for demonstration
const users = {
  'student@example.com': { password: 'password', role: 'student' },
  'teacher@example.com': { password: 'password', role: 'teacher' },
};

export async function loginUser(data: LoginValues) {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid input." };
  }
  
  const { email, password, role } = validation.data;

  const user = (users as any)[email];

  if (!user || user.password !== password || user.role !== role) {
    return { success: false, message: "Invalid email or password." };
  }

  // In a real application, you would create a session here.
  // For now, we'll just return success.
  return { success: true, message: "Login successful!" };
}
