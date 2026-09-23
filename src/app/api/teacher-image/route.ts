import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src');

  if (!src) {
    return new NextResponse('Missing src', { status: 400 });
  }

  try {
    let inputBuffer: Buffer;
    if (src.startsWith('http://') || src.startsWith('https://')) {
      const res = await fetch(src);
      if (!res.ok) {
        return new NextResponse('Failed to fetch image', { status: 502 });
      }
      inputBuffer = Buffer.from(await res.arrayBuffer());
    } else {
      return new NextResponse('Invalid src protocol', { status: 400 });
    }

    // Process with sharp
    const { data, info } = await sharp(inputBuffer).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Check corners to detect if image has a white canvas/background
    const tlR = data[0];
    const tlG = data[1];
    const tlB = data[2];
    const isLightBg = tlR > 230 && tlG > 230 && tlB > 230;

    if (!isLightBg) {
      // Already dark or transparent, return directly as PNG
      const out = await sharp(inputBuffer).png().toBuffer();
      return new NextResponse(out, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }

    // BFS flood fill from all 4 borders to remove white background without touching foreground
    const visited = new Uint8Array(width * height);
    const queue: number[] = [];

    for (let x = 0; x < width; x++) {
      queue.push(x, 0);
      queue.push(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      queue.push(0, y);
      queue.push(width - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const x = queue[head++];
      const y = queue[head++];
      const idx = y * width + x;
      if (visited[idx]) continue;
      visited[idx] = 1;

      const pIdx = idx * channels;
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];

      if (r > 225 && g > 225 && b > 225) {
        const neighbors = [
          [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nIdx = ny * width + nx;
            if (!visited[nIdx]) {
              const np = nIdx * channels;
              if (data[np] > 225 && data[np + 1] > 225 && data[np + 2] > 225) {
                queue.push(nx, ny);
              }
            }
          }
        }
      }
    }

    // Create RGBA buffer with transparent background
    const rgba = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const srcIdx = idx * channels;
        const dstIdx = idx * 4;
        const r = data[srcIdx];
        const g = data[srcIdx + 1];
        const b = data[srcIdx + 2];

        rgba[dstIdx] = r;
        rgba[dstIdx + 1] = g;
        rgba[dstIdx + 2] = b;

        if (visited[idx]) {
          const whiteness = Math.min(r, g, b);
          if (whiteness > 240) {
            rgba[dstIdx + 3] = 0; // completely transparent
          } else {
            // Feathered edge for smooth antialiasing
            rgba[dstIdx + 3] = Math.max(0, Math.min(255, Math.round(255 * (240 - whiteness) / 15)));
          }
        } else {
          rgba[dstIdx + 3] = 255;
        }
      }
    }

    const outPng = await sharp(rgba, {
      raw: { width, height, channels: 4 },
    }).png().toBuffer();

    return new NextResponse(outPng, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err: any) {
    console.error('Error processing teacher image:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
