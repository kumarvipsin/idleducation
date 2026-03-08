import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/app/actions/blog';
import { getSignedUrlForPdf } from '@/app/actions/content';

/**
 * API route to fetch all blog posts.
 * Used by mobile apps to retrieve the full article list.
 */
export async function GET() {
  try {
    const result = await getBlogPosts();
    
    if (result.success && Array.isArray(result.data)) {
        const signedData = await Promise.all(result.data.map(async (post: any) => {
            if (post.imageUrl) {
                const signed = await getSignedUrlForPdf(post.imageUrl);
                return { ...post, imageUrl: signed.success ? signed.url : post.imageUrl };
            }
            return post;
        }));
        return NextResponse.json({ ...result, data: signedData });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
