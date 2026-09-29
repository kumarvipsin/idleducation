export type ClassId = 'class-9' | 'class-10' | 'class-11' | 'class-12';

export interface ClassItem {
  id: ClassId;
  name: string;
  classNumber: string;
  badge: string;
  description: string;
}

export const CLASSES: ClassItem[] = [
  {
    id: 'class-9',
    name: 'Class 9',
    classNumber: '9',
    badge: 'CBSE Curriculum',
    description: 'Foundational CBSE curriculum notes covering core concepts, textbook summaries, and revision guides.',
  },
  {
    id: 'class-10',
    name: 'Class 10',
    classNumber: '10',
    badge: 'Board Exam Prep',
    description: 'Comprehensive board exam preparation notes, key formulas, and structured conceptual summaries.',
  },
  {
    id: 'class-11',
    name: 'Class 11',
    classNumber: '11',
    badge: 'Senior Secondary',
    description: 'Foundational senior secondary curriculum notes, core concepts, and revision guides.',
  },
  {
    id: 'class-12',
    name: 'Class 12',
    classNumber: '12',
    badge: 'Board Exam Prep',
    description: 'Advanced senior secondary board revision notes, key concepts, and structured study material.',
  },
];

export interface SubjectItem {
  id: string;
  name: string;
  description?: string;
  accentBarClass?: string;
  accentColor?: string;
  image?: string;
  glowBg?: string;
  badgeNumber?: string;
}

export const CLASS_9_SUBJECTS: SubjectItem[] = [
  {
    id: 'maths',
    name: 'Maths',
    description: 'Chapter-wise short revision notes for quick learning, plus detailed Premium Notes.',
    accentBarClass: 'bg-[#155EEF]',
    accentColor: '#155EEF',
    image: '/images/books/class-9/maths.png',
    glowBg: 'radial-gradient(circle, rgba(21,94,239,0.10) 0%, rgba(21,94,239,0.03) 60%, transparent 72%)',
    badgeNumber: '09',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Chapter-wise short revision notes for quick learning, plus detailed Premium Notes.',
    accentBarClass: 'bg-[#16A34A]',
    accentColor: '#16A34A',
    image: '/images/books/class-9/science.png',
    glowBg: 'radial-gradient(circle, rgba(22,163,74,0.10) 0%, rgba(22,163,74,0.03) 60%, transparent 72%)',
    badgeNumber: '09',
  },
  {
    id: 'english',
    name: 'English',
    description: 'Chapter-wise short revision notes for quick learning, plus detailed Premium Notes.',
    accentBarClass: 'bg-[#F59E0B]',
    accentColor: '#F59E0B',
    image: '/images/books/class-9/english.png',
    glowBg: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.03) 60%, transparent 72%)',
    badgeNumber: '09',
  },
  {
    id: 'social-science',
    name: 'Social Studies',
    description: 'Chapter-wise short revision notes for quick learning, plus detailed Premium Notes.',
    accentBarClass: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
    image: '/images/books/class-9/social-science.png',
    glowBg: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.03) 60%, transparent 72%)',
    badgeNumber: '09',
  },
];

export const CLASS_9_10_SUBJECTS: SubjectItem[] = CLASS_9_SUBJECTS;

export const CLASS_12_SUBJECTS: SubjectItem[] = [
  {
    id: 'political-science',
    name: 'Political Science',
    description: 'Chapter-wise short revision notes for quick learning, plus detailed Premium Notes.',
    accentBarClass: 'bg-[#8B5CF6]',
    accentColor: '#8B5CF6',
    image: '/images/books/class-12/political-science.png',
    glowBg: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.03) 60%, transparent 72%)',
    badgeNumber: '12',
  },
];

export function getSubjectsForClass(classId: ClassId): SubjectItem[] {
  if (classId === 'class-12') return CLASS_12_SUBJECTS;
  if (classId === 'class-9') return CLASS_9_SUBJECTS;
  return [];
}

export interface StreamItem {
  id: string;
  name: string;
  description: string;
}

export const STREAMS: StreamItem[] = [
  {
    id: 'science',
    name: 'Science',
    description: 'Comprehensive study material for Physics, Chemistry, Mathematics, and Biology.',
  },
  {
    id: 'commerce',
    name: 'Commerce',
    description: 'Structured revision notes for Accountancy, Business Studies, Economics, and Applied Mathematics.',
  },
  {
    id: 'arts-humanities',
    name: 'Arts / Humanities',
    description: 'Detailed conceptual guides for History, Political Science, Geography, Sociology, and Psychology.',
  },
];

export interface ChapterItem {
  id: string;
  number: string;
  name: string;
  slug: string;
  supportingText: string;
}

export const CLASS_9_SCIENCE_CHAPTERS: ChapterItem[] = [
  { id: '1', number: '01', name: 'Matter in Our Surroundings', slug: 'matter-in-our-surroundings', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '2', number: '02', name: 'Is Matter Around Us Pure?', slug: 'is-matter-around-us-pure', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '3', number: '03', name: 'Atoms and Molecules', slug: 'atoms-and-molecules', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '4', number: '04', name: 'Structure of the Atom', slug: 'structure-of-the-atom', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '5', number: '05', name: 'The Fundamental Unit of Life', slug: 'the-fundamental-unit-of-life', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '6', number: '06', name: 'Tissues', slug: 'tissues', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '7', number: '07', name: 'Diversity in Living Organisms', slug: 'diversity-in-living-organisms', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '8', number: '08', name: 'Motion', slug: 'motion', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '9', number: '09', name: 'Force and Laws of Motion', slug: 'force-and-laws-of-motion', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '10', number: '10', name: 'Gravitation', slug: 'gravitation', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '11', number: '11', name: 'Work and Energy', slug: 'work-and-energy', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '12', number: '12', name: 'Sound', slug: 'sound', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '13', number: '13', name: 'Why Do We Fall Ill?', slug: 'why-do-we-fall-ill', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '14', number: '14', name: 'Natural Resources', slug: 'natural-resources', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '15', number: '15', name: 'Improvement in Food Resources', slug: 'improvement-in-food-resources', supportingText: 'Chapter Notes • English / Hindi' },
];

export const CLASS_9_MATHS_CHAPTERS: ChapterItem[] = [
  { id: '1', number: '01', name: 'Number Systems', slug: 'number-systems', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '2', number: '02', name: 'Polynomials', slug: 'polynomials', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '3', number: '03', name: 'Coordinate Geometry', slug: 'coordinate-geometry', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '4', number: '04', name: 'Linear Equations in Two Variables', slug: 'linear-equations-in-two-variables', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '5', number: '05', name: 'Introduction to Euclid’s Geometry', slug: 'introduction-to-euclids-geometry', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '6', number: '06', name: 'Lines and Angles', slug: 'lines-and-angles', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '7', number: '07', name: 'Triangles', slug: 'triangles', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '8', number: '08', name: 'Quadrilaterals', slug: 'quadrilaterals', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '9', number: '09', name: 'Circles', slug: 'circles', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '10', number: '10', name: 'Heron’s Formula', slug: 'herons-formula', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '11', number: '11', name: 'Surface Areas and Volumes', slug: 'surface-areas-and-volumes', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '12', number: '12', name: 'Statistics', slug: 'statistics', supportingText: 'Chapter Notes • English / Hindi' },
];

export const CLASS_9_ENGLISH_CHAPTERS: ChapterItem[] = [
  { id: '1', number: '01', name: 'The Fun They Had', slug: 'the-fun-they-had', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '2', number: '02', name: 'The Sound of Music', slug: 'the-sound-of-music', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '3', number: '03', name: 'The Little Girl', slug: 'the-little-girl', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '4', number: '04', name: 'A Truly Beautiful Mind', slug: 'a-truly-beautiful-mind', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '5', number: '05', name: 'The Snake and the Mirror', slug: 'the-snake-and-the-mirror', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '6', number: '06', name: 'My Childhood', slug: 'my-childhood', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '7', number: '07', name: 'Reach for the Top', slug: 'reach-for-the-top', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '8', number: '08', name: 'Kathmandu', slug: 'kathmandu', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '9', number: '09', name: 'If I Were You', slug: 'if-i-were-you', supportingText: 'Chapter Notes • English / Hindi' },
];

export const CLASS_9_SOCIAL_SCIENCE_CHAPTERS: ChapterItem[] = [
  { id: '1', number: '01', name: 'The French Revolution', slug: 'the-french-revolution', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '2', number: '02', name: 'Socialism in Europe and the Russian Revolution', slug: 'socialism-in-europe-and-the-russian-revolution', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '3', number: '03', name: 'Nazism and the Rise of Hitler', slug: 'nazism-and-the-rise-of-hitler', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '4', number: '04', name: 'India - Size and Location', slug: 'india-size-and-location', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '5', number: '05', name: 'Physical Features of India', slug: 'physical-features-of-india', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '6', number: '06', name: 'Drainage', slug: 'drainage', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '7', number: '07', name: 'What is Democracy? Why Democracy?', slug: 'what-is-democracy-why-democracy', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '8', number: '08', name: 'Electoral Politics', slug: 'electoral-politics', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '9', number: '09', name: 'Working of Institutions', slug: 'working-of-institutions', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '10', number: '10', name: 'The Story of Village Palampur', slug: 'the-story-of-village-palampur', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '11', number: '11', name: 'People as Resource', slug: 'people-as-resource', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '12', number: '12', name: 'Poverty as a Challenge', slug: 'poverty-as-a-challenge', supportingText: 'Chapter Notes • English / Hindi' },
];

export const CLASS_12_POLITICAL_SCIENCE_CHAPTERS: ChapterItem[] = [
  { id: '1', number: '01', name: 'The End of Bipolarity', slug: 'the-end-of-bipolarity', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '2', number: '02', name: 'Contemporary Centres of Power', slug: 'contemporary-centres-of-power', supportingText: 'Chapter Notes • English / Hindi' },
  { id: '3', number: '03', name: 'Contemporary South Asia', slug: 'contemporary-south-asia', supportingText: 'Chapter Notes • English / Hindi' },
];

export function getChaptersForSubject(classId: string, subjectId: string): ChapterItem[] {
  const cId = normalizeClassId(classId);
  if (cId === 'class-9') {
    if (subjectId === 'science') return CLASS_9_SCIENCE_CHAPTERS;
    if (subjectId === 'maths') return CLASS_9_MATHS_CHAPTERS;
    if (subjectId === 'english') return CLASS_9_ENGLISH_CHAPTERS;
    if (subjectId === 'social-science') return CLASS_9_SOCIAL_SCIENCE_CHAPTERS;
  }
  if (cId === 'class-12') {
    if (subjectId === 'political-science') return CLASS_12_POLITICAL_SCIENCE_CHAPTERS;
  }
  return [];
}

export function normalizeClassId(raw: string | null): ClassId | null {
  if (!raw) return null;
  const clean = raw.toLowerCase().trim();
  if (clean === 'class-9' || clean === '9' || clean === 'class 9') return 'class-9';
  if (clean === 'class-10' || clean === '10' || clean === 'class 10') return 'class-10';
  if (clean === 'class-11' || clean === '11' || clean === 'class 11') return 'class-11';
  if (clean === 'class-12' || clean === '12' || clean === 'class 12') return 'class-12';
  return null;
}
