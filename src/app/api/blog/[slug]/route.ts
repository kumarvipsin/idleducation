import { NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/app/actions/blog';

/**
 * API route to fetch a single blog post by its slug.
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const result = await getBlogPostBySlug(slug);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}