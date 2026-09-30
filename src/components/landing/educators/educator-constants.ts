/* ─────────────────────────────────────────────────────────────
   FALLBACK IMAGES
───────────────────────────────────────────────────────────── */
export const TEACHER_FALLBACK_IMAGES: Record<string, string> = {
  "Amod Sharma": "/director.png",
  "Manish Kumar": "/manish.png",
  "Manish Sharma": "/manish.png",
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

/* ─────────────────────────────────────────────────────────────
   SUBJECT 3D ICON & METADATA RESOLVER
   Uses icons from public: "physics.png", "maths.png", "economic.png",
   "socialstudies.png", "english.png", "science.png"
───────────────────────────────────────────────────────────── */
export interface SubjectVisual {
  iconPath: string;
  cleanSubject: string;
}

export function getSubjectVisual(
  subject?: string,
  specialization?: string,
  designation?: string,
  teacherName?: string
): SubjectVisual {
  const text = `${subject || ''} ${specialization || ''} ${designation || ''} ${teacherName || ''}`.toLowerCase();

  // English -> /english.png
  if (text.includes('english') || text.includes('eng') || text.includes('shipra')) {
    return {
      iconPath: '/english.png',
      cleanSubject: 'English',
    };
  }

  // Physics -> /physics.png
  if (text.includes('physic') || text.includes('phy') || text.includes('mechanics')) {
    return {
      iconPath: '/physics.png',
      cleanSubject: text.includes('math') ? 'Physics & Maths' : 'Physics',
    };
  }

  // Mathematics -> /maths.png
  if (text.includes('math') || text.includes('calculus') || text.includes('algebra') || text.includes('chandra')) {
    return {
      iconPath: '/maths.png',
      cleanSubject: 'Mathematics',
    };
  }

  // Economics -> /economic.png
  if (
    text.includes('economic') ||
    text.includes('econ') ||
    text.includes('commerce') ||
    text.includes('cuet') ||
    text.includes('vijay')
  ) {
    return {
      iconPath: '/economic.png',
      cleanSubject: 'Economics',
    };
  }

  // Social Studies -> /socialstudies.png
  if (
    text.includes('social') ||
    text.includes('sst') ||
    text.includes('humanities') ||
    text.includes('history') ||
    text.includes('geography') ||
    text.includes('civics') ||
    text.includes('vidhi')
  ) {
    return {
      iconPath: '/socialstudies.png',
      cleanSubject: 'Social Studies',
    };
  }

  // Science / Biology / Chemistry -> /science.png
  if (
    text.includes('science') ||
    text.includes('bio') ||
    text.includes('chem') ||
    text.includes('neet') ||
    text.includes('amod')
  ) {
    return {
      iconPath: '/science.png',
      cleanSubject: subject && subject.includes('&') ? subject : 'Science',
    };
  }

  // Fallback
  return {
    iconPath: '/english.png',
    cleanSubject: subject || 'Faculty',
  };
}
