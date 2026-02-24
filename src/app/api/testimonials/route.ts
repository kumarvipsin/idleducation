import { NextResponse } from 'next/server';
import { getTestimonials, getTopperTestimonials } from '@/app/actions/data';

/**
 * API route to fetch student and topper testimonials.
 */
export async function GET() {
  try {
    const [studentRes, topperRes] = await Promise.all([
      getTestimonials(),
      getTopperTestimonials()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        students: studentRes.data || [],
        toppers: topperRes.data || []
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}