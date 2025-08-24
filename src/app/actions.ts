'use server';
import { z } from "zod";
import nodemailer from "nodemailer";

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

  const { GMAIL_EMAIL, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
    console.error("Missing Gmail credentials in .env file");
    return { success: false, message: "Server configuration error. Could not book session." };
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
