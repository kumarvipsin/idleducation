import { NextResponse } from 'next/server';
import { loginUser } from '@/app/actions/auth';

/**
 * API route for user login.
 * Proxies the request to the loginUser server action.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await loginUser(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error (auth-login):', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
