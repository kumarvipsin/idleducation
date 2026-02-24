import { NextResponse } from 'next/server';
import { getPaidCourses } from '@/app/actions/paid-courses';

/**
 * API route to fetch all premium paid courses.
 */
export async function GET() {
  try {
    const result = await getPaidCourses();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}