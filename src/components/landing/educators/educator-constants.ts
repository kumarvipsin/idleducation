/* ─────────────────────────────────────────────────────────────
   FALLBACK IMAGES
───────────────────────────────────────────────────────────── */
export const TEACHER_FALLBACK_IMAGES: Record<string, string> = {
  "Amod Sharma": "/director.png",
  "Manish Kumar": "/manish.png",
  "Shipra Khurana": "/shipra.jpg",
  "Chandra Prakash": "/chandu.png",
  "Vidhi Sharma": "/vidhi.png",
  "Vijay Verma": "/vijay.png",
};

/* ─────────────────────────────────────────────────────────────
   YOUTUBE ID EXTRACTOR
───────────────────────────────────────────────────────────── */
export function getYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const t = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(t)) return t;
  const m = t.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return m ? m[1] : null;
}

/* ─────────────────────────────────────────────────────────────
   EXPERIENCE FORMATTER
───────────────────────────────────────────────────────────── */
export function formatExperience(experience?: string): string {
  const expRaw = (experience || "").trim();
  const expCleaned = expRaw
    .replace(/\s+experience$/i, "")
    .replace(/\s+exp\.?$/i, "")
    .trim();
  if (!expCleaned) return "";
  return /\b(?:years?|yrs?)\b/i.test(expCleaned)
    ? expCleaned.replace(/\b(?:yrs?|years?)\b/i, "Years")
    : `${expCleaned} Years`;
}
