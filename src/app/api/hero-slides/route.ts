import { NextResponse } from 'next/server';
import { getCollection } from '@/app/actions/data';

/**
 * API route to fetch all hero slides.
 * Used by the mobile app to populate the main home screen banner.
 */
export async function GET() {
  try {
    const result = await getCollection('heroSlides');
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error (hero-slides):', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
