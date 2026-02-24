import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/app/actions/blog';

/**
 * API route to fetch all blog posts.
 * Used by mobile apps to retrieve the full article list.
 */
export async function GET() {
  try {
    const result = await getBlogPosts();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}