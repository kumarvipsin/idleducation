import { NextResponse } from 'next/server';
import { getUpdates } from '@/app/actions/data';

/**
 * API route to fetch recent platform updates/notifications.
 */
export async function GET() {
  try {
    const result = await getUpdates();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}