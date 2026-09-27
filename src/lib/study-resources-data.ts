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
    description: 'In-depth stream-specific study material tailored for Science, Commerce, and Arts / Humanities.',
  },
  {
    id: 'class-12',
    name: 'Class 12',
    classNumber: '12',
    badge: 'Senior Secondary',
    description: 'Advanced senior secondary board revision notes organized across academic streams.',
  },
];

export interface SubjectItem {
  id: string;
  name: string;
}

export const CLASS_9_10_SUBJECTS: SubjectItem[] = [
  { id: 'maths', name: 'Maths' },
  { id: 'science', name: 'Science' },
  { id: 'english', name: 'English' },
  { id: 'social-science', name: 'Social Science' },
];

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

export function normalizeClassId(raw: string | null): ClassId | null {
  if (!raw) return null;
  const clean = raw.toLowerCase().trim();
  if (clean === 'class-9' || clean === '9' || clean === 'class 9') return 'class-9';
  if (clean === 'class-10' || clean === '10' || clean === 'class 10') return 'class-10';
  if (clean === 'class-11' || clean === '11' || clean === 'class 11') return 'class-11';
  if (clean === 'class-12' || clean === '12' || clean === 'class 12') return 'class-12';
  return null;
}
