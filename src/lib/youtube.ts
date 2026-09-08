/**
 * YouTube utility functions for parsing URLs, detecting content type,
 * extracting IDs, and generating standard thumbnail URLs.
 */

export type YouTubeContentType = 'video' | 'playlist' | 'unknown';

export interface ParsedYouTubeResult {
  isValid: boolean;
  type: YouTubeContentType;
  videoId?: string;
  playlistId?: string;
  normalizedUrl?: string;
  thumbnailUrl?: string;
  hqThumbnailUrl?: string;
  maxResThumbnailUrl?: string;
  embedUrl?: string;
  error?: string;
}

/**
 * Validates and extracts video or playlist details from a YouTube URL.
 * Handles formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - URLs with additional query params (tracking, timestamp, etc.)
 */
export function parseYouTubeUrl(rawUrl: string): ParsedYouTubeResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isValid: false,
      type: 'unknown',
      error: 'Please enter a valid YouTube link.',
    };
  }

  const trimmed = rawUrl.trim();

  // Basic check for youtube/youtu.be domains
  if (!/(youtube\.com|youtu\.be)/i.test(trimmed)) {
    return {
      isValid: false,
      type: 'unknown',
      error: 'Only YouTube video and playlist links are supported.',
    };
  }

  try {
    // Prefix protocol if missing
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(urlString);

    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const pathname = parsed.pathname;
    const searchParams = parsed.searchParams;

    // Check for Playlist (explicit playlist or playlist query param on watch)
    const listParam = searchParams.get('list');
    const vParam = searchParams.get('v');

    // If pathname starts with /playlist or listParam exists without a specific video
    if (pathname.startsWith('/playlist') && listParam) {
      const playlistId = listParam;
      return {
        isValid: true,
        type: 'playlist',
        playlistId,
        normalizedUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
        thumbnailUrl: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${playlistId}`,
      };
    }

    // Check for youtu.be short URL
    if (hostname === 'youtu.be') {
      const videoId = pathname.replace(/^\//, '').split('/')[0].split('?')[0];
      if (videoId && /^[a-zA-Z0-9_-]{10,12}$/.test(videoId)) {
        return buildVideoResult(videoId, listParam || undefined);
      }
    }

    // Check for /shorts/VIDEO_ID
    if (pathname.startsWith('/shorts/')) {
      const videoId = pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0];
      if (videoId && /^[a-zA-Z0-9_-]{10,12}$/.test(videoId)) {
        return buildVideoResult(videoId);
      }
    }

    // Check for /embed/VIDEO_ID
    if (pathname.startsWith('/embed/')) {
      const videoId = pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0];
      if (videoId && /^[a-zA-Z0-9_-]{10,12}$/.test(videoId)) {
        return buildVideoResult(videoId);
      }
    }

    // Standard /watch?v=VIDEO_ID
    if (vParam && /^[a-zA-Z0-9_-]{10,12}$/.test(vParam)) {
      return buildVideoResult(vParam, listParam || undefined);
    }

    // If there is only listParam (e.g. youtube.com/watch?list=PLAYLIST_ID)
    if (listParam) {
      return {
        isValid: true,
        type: 'playlist',
        playlistId: listParam,
        normalizedUrl: `https://www.youtube.com/playlist?list=${listParam}`,
        thumbnailUrl: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${listParam}`,
      };
    }

    return {
      isValid: false,
      type: 'unknown',
      error: 'Could not detect a valid YouTube Video ID or Playlist ID.',
    };
  } catch {
    return {
      isValid: false,
      type: 'unknown',
      error: 'Please enter a valid URL (e.g. https://www.youtube.com/watch?v=...)',
    };
  }
}

function buildVideoResult(videoId: string, playlistId?: string): ParsedYouTubeResult {
  return {
    isValid: true,
    type: 'video',
    videoId,
    playlistId,
    normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    hqThumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    maxResThumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
  };
}
