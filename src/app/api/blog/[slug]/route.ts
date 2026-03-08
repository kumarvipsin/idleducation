import { NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/app/actions/blog';
import { getSignedUrlForPdf } from '@/app/actions/content';

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
    
    if (result.success && result.data && (result.data as any).imageUrl) {
        const signed = await getSignedUrlForPdf((result.data as any).imageUrl);
        if (signed.success) {
            (result.data as any).imageUrl = signed.url;
        }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
