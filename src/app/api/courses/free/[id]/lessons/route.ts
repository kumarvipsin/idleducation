import { NextResponse } from 'next/server';
import { getFreeCourseById } from '@/app/actions/free-courses';

/**
 * API route to fetch lessons (chapters and videos) for a specific free course.
 * Used by mobile apps and clients to populate the course curriculum viewer.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const result = await getFreeCourseById(id);
    
    if (result.success && result.data) {
        return NextResponse.json({
            success: true,
            data: (result.data as any).chapters || []
        });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error (free-course-lessons):', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
