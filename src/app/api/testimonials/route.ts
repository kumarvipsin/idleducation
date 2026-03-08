import { NextResponse } from 'next/server';
import { getTestimonials, getTopperTestimonials } from '@/app/actions/data';
import { getSignedUrlForPdf } from '@/app/actions/content';

/**
 * API route to fetch student and topper testimonials.
 */
export async function GET() {
  try {
    const [studentRes, topperRes] = await Promise.all([
      getTestimonials(),
      getTopperTestimonials()
    ]);

    const students = studentRes.data || [];
    const toppers = topperRes.data || [];

    // Sign avatar URLs for students
    const signedStudents = await Promise.all(students.map(async (s: any) => {
        if (s.avatarUrl) {
            const signed = await getSignedUrlForPdf(s.avatarUrl);
            return { ...s, avatarUrl: signed.success ? signed.url : s.avatarUrl };
        }
        return s;
    }));

    return NextResponse.json({
      success: true,
      data: {
        students: signedStudents,
        toppers: toppers
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
