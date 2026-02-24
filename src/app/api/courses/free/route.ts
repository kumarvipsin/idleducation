import { NextResponse } from 'next/server';
import { getFreeCourses } from '@/app/actions/free-courses';

/**
 * API route to fetch all free courses.
 */
export async function GET() {
  try {
    const result = await getFreeCourses();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}