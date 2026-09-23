import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrlForPdf } from '@/app/actions/content';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  if (!path) {
    return new NextResponse('Path required', { status: 400 });
  }

  try {
    const res = await getSignedUrlForPdf(path);
    if (!res.success || !res.url) {
      return new NextResponse('Not found', { status: 404 });
    }

    const imageRes = await fetch(res.url);
    if (!imageRes.ok) {
      return new NextResponse('Failed to fetch image', { status: imageRes.status });
    }

    const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imageRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
