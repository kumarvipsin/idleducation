import { NextResponse } from 'next/server';
import { getFreeCourses } from '@/app/actions/free-courses';
import { getSignedUrlForPdf } from '@/app/actions/content';

/**
 * API route to fetch all free courses.
 */
export async function GET() {
  try {
    const result = await getFreeCourses();
    
    if (result.success && Array.isArray(result.data)) {
        const signedData = await Promise.all(result.data.map(async (course: any) => {
            if (course.coverImageUrl) {
                const signed = await getSignedUrlForPdf(course.coverImageUrl);
                return { ...course, coverImageUrl: signed.success ? signed.url : course.coverImageUrl };
            }
            return course;
        }));
        return NextResponse.json({ ...result, data: signedData });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
