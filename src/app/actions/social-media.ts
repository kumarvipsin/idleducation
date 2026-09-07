'use server';

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { serializeFirestoreData } from "./utils";

export interface TSocialPlatformSetting {
  url: string;
  active: boolean;
}

export interface TSocialMediaSettings {
  instagram: TSocialPlatformSetting;
  youtube: TSocialPlatformSetting;
  facebook: TSocialPlatformSetting;
  twitter?: TSocialPlatformSetting;
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_SETTINGS: TSocialMediaSettings = {
  instagram: {
    url: "https://www.instagram.com/idleducation",
    active: true,
  },
  youtube: {
    url: "https://www.youtube.com/@idleducation",
    active: true,
  },
  facebook: {
    url: "https://www.facebook.com/idleducation",
    active: true,
  },
  twitter: {
    url: "https://x.com/idleducation",
    active: true,
  },
};

const SETTINGS_DOC_REF = () => doc(db, "settings", "socialMedia");

/**
 * Validate that a URL is a valid external HTTPS URL and belongs to the expected platform domain.
 */
function validatePlatformUrl(platform: 'instagram' | 'youtube' | 'facebook' | 'twitter', urlString: string): { valid: boolean; normalized?: string; error?: string } {
  const trimmed = urlString.trim();
  if (!trimmed) {
    return { valid: true, normalized: '' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: `Invalid URL format for ${platform}. Please enter a valid web address.` };
  }

  // Must be HTTPS (Rule 19)
  if (parsed.protocol !== 'https:') {
    return { valid: false, error: `${platform} URL must use secure HTTPS (e.g., https://${platform === 'youtube' ? 'youtube.com' : platform === 'twitter' ? 'x.com' : platform + '.com'}/...).` };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  // Platform domain validation (Rule 20)
  if (platform === 'instagram') {
    if (hostname !== 'instagram.com') {
      return { valid: false, error: 'Instagram URL must be on instagram.com (e.g., https://www.instagram.com/yourhandle).' };
    }
  } else if (platform === 'youtube') {
    if (hostname !== 'youtube.com' && hostname !== 'youtu.be') {
      return { valid: false, error: 'YouTube URL must be on youtube.com or youtu.be (e.g., https://www.youtube.com/@yourchannel).' };
    }
  } else if (platform === 'facebook') {
    if (hostname !== 'facebook.com' && hostname !== 'fb.com') {
      return { valid: false, error: 'Facebook URL must be on facebook.com (e.g., https://www.facebook.com/yourpage).' };
    }
  } else if (platform === 'twitter') {
    if (hostname !== 'x.com' && hostname !== 'twitter.com') {
      return { valid: false, error: 'X (Twitter) URL must be on x.com or twitter.com (e.g., https://x.com/yourhandle).' };
    }
  }

  // Normalize trailing slash if it's just the root domain, or clean it appropriately
  let normalized = parsed.toString();
  if (parsed.pathname === '/' && !parsed.search && !parsed.hash) {
    normalized = normalized.replace(/\/$/, '');
  }

  return { valid: true, normalized };
}

/**
 * Fetches the centralized social media settings.
 * Returns defaults if the document does not exist yet.
 */
export async function getSocialMediaSettings(): Promise<{ success: boolean; data: TSocialMediaSettings; message?: string }> {
  try {
    const snap = await getDoc(SETTINGS_DOC_REF());
    if (snap.exists()) {
      const rawData = snap.data();
      const serialized = serializeFirestoreData(rawData) as any;

      return {
        success: true,
        data: {
          instagram: {
            url: typeof serialized.instagram?.url === 'string' ? serialized.instagram.url : DEFAULT_SETTINGS.instagram.url,
            active: typeof serialized.instagram?.active === 'boolean' ? serialized.instagram.active : true,
          },
          youtube: {
            url: typeof serialized.youtube?.url === 'string' ? serialized.youtube.url : DEFAULT_SETTINGS.youtube.url,
            active: typeof serialized.youtube?.active === 'boolean' ? serialized.youtube.active : true,
          },
          facebook: {
            url: typeof serialized.facebook?.url === 'string' ? serialized.facebook.url : DEFAULT_SETTINGS.facebook.url,
            active: typeof serialized.facebook?.active === 'boolean' ? serialized.facebook.active : true,
          },
          twitter: {
            url: typeof serialized.twitter?.url === 'string' ? serialized.twitter.url : DEFAULT_SETTINGS.twitter!.url,
            active: typeof serialized.twitter?.active === 'boolean' ? serialized.twitter.active : true,
          },
          updatedAt: serialized.updatedAt || undefined,
          updatedBy: serialized.updatedBy || undefined,
        },
      };
    }

    // Initialize with default settings in Firestore so document exists
    await setDoc(SETTINGS_DOC_REF(), {
      ...DEFAULT_SETTINGS,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      data: DEFAULT_SETTINGS,
    };
  } catch (error: any) {
    console.error("Error fetching social media settings:", error);
    // Fallback to defaults so site never breaks
    return {
      success: true,
      data: DEFAULT_SETTINGS,
      message: error.message,
    };
  }
}

/**
 * Updates the social media settings with strict URL and platform validation.
 */
export async function updateSocialMediaSettings(
  data: {
    instagram: { url: string; active: boolean };
    youtube: { url: string; active: boolean };
    facebook: { url: string; active: boolean };
    twitter?: { url: string; active: boolean };
  },
  updatedBy: string = 'admin'
): Promise<{ success: boolean; message: string; errors?: Record<string, string> }> {
  try {
    const errors: Record<string, string> = {};

    // Validate Instagram
    const igCheck = validatePlatformUrl('instagram', data.instagram.url);
    if (!igCheck.valid) {
      errors.instagram = igCheck.error || 'Invalid Instagram URL';
    }

    // Validate YouTube
    const ytCheck = validatePlatformUrl('youtube', data.youtube.url);
    if (!ytCheck.valid) {
      errors.youtube = ytCheck.error || 'Invalid YouTube URL';
    }

    // Validate Facebook
    const fbCheck = validatePlatformUrl('facebook', data.facebook.url);
    if (!fbCheck.valid) {
      errors.facebook = fbCheck.error || 'Invalid Facebook URL';
    }

    // Validate Twitter (if provided)
    let twCheck: any = { valid: true, normalized: '' };
    if (data.twitter) {
      twCheck = validatePlatformUrl('twitter', data.twitter.url);
      if (!twCheck.valid) {
        errors.twitter = twCheck.error || 'Invalid X (Twitter) URL';
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please resolve the URL errors before saving.',
        errors,
      };
    }

    const payload: any = {
      instagram: {
        url: igCheck.normalized || '',
        active: Boolean(data.instagram.active),
      },
      youtube: {
        url: ytCheck.normalized || '',
        active: Boolean(data.youtube.active),
      },
      facebook: {
        url: fbCheck.normalized || '',
        active: Boolean(data.facebook.active),
      },
      updatedAt: serverTimestamp(),
      updatedBy,
    };

    if (data.twitter) {
      payload.twitter = {
        url: twCheck.normalized || '',
        active: Boolean(data.twitter.active),
      };
    }

    await setDoc(SETTINGS_DOC_REF(), payload, { merge: true });

    return {
      success: true,
      message: "Social media settings updated.",
    };
  } catch (error: any) {
    console.error("Error updating social media settings:", error);
    return {
      success: false,
      message: error.message || "Failed to update social media settings.",
    };
  }
}
