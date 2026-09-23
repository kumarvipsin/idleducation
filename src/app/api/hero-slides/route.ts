import { NextResponse } from 'next/server';
import { getCollection } from '@/app/actions/data';
import { getSignedUrlForPdf } from '@/app/actions/content';

/**
 * API route to fetch all hero slides.
 * Used by the mobile app to populate the main home screen banner.
 * Ensures all image URLs are signed for secure access.
 */
export async function GET() {
  try {
    const result = await getCollection('heroSlides');
    
    if (result.success && Array.isArray(result.data)) {
        const signedData = await Promise.all(result.data.map(async (slide: any) => {
            let imageUrl = slide.imageUrl;
            let mobileImageUrl = slide.mobileImageUrl;
            if (slide.imageUrl) {
                const signed = await getSignedUrlForPdf(slide.imageUrl);
                if (signed.success && signed.url) imageUrl = signed.url;
            }
            if (slide.mobileImageUrl) {
                const signed = await getSignedUrlForPdf(slide.mobileImageUrl);
                if (signed.success && signed.url) mobileImageUrl = signed.url;
            }
            return { ...slide, imageUrl, mobileImageUrl };
        }));
        return NextResponse.json({ success: true, data: signedData });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error (hero-slides):', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
