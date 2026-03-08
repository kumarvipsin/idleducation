import { NextResponse } from 'next/server';
import { signUpUser } from '@/app/actions/auth';

/**
 * API route for user signup.
 * Proxies the request to the signUpUser server action.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Server action handles role-based logic and status initialization.
    const result = await signUpUser(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error (auth-signup):', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
