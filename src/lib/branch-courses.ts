import { normalizeBranchId } from '@/lib/branch-utils';
import type { FeeClass } from '@/types/fee-management';

export type PublicBranchCatalogSource = 'live' | 'catalog';

export interface BranchClassCatalogResult {
  classesByBranch: Record<string, string[]>;
  titlesByBranchAndClass: Record<string, Record<string, string[]>>;
  sourcesByBranch: Record<string, PublicBranchCatalogSource>;
}

export interface DemoSubjectSelectorConfig {
  mode: 'stream' | 'text';
  heading: string;
  options: { value: string; label: string }[];
  singleSelect: boolean;
}

/**
 * Exact branch order required for Book Free Demo.
 */
export const BOOK_DEMO_BRANCHES = [
  'Budh Vihar, Delhi-110086',
  'Krishan Vihar, Delhi-110086',
  'Mangol Puri, Delhi-110083',
  'Mukherjee Nagar, Delhi-110009',
] as const;

const CATALOG_BRANCH_IDS = ['budh-vihar', 'krishan-vihar', 'mangolpuri', 'mukherjee-nagar'] as const;

/**
 * Branches that offer JEE / NEET batches (and therefore Class 12 PASS).
 */
const JEE_NEET_BRANCH_IDS = new Set<string>(['budh-vihar', 'mukherjee-nagar']);

/**
 * Fallback class/course options used only when a branch currently has
 * zero active classes created in Admin Class Management (`/admin/fees`).
 */
export const FALLBACK_COURSES_BY_BRANCH: Record<string, string[]> = {
  'budh-vihar': ['Class 4-8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Class 12 PASS'],
  'krishan-vihar': ['Class 4-8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  mangolpuri: ['Class 1-8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  'mukherjee-nagar': ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Class 12 PASS', 'JEE / NEET', 'CUET (UG)'],
};

export const DEMO_SCIENCE_SUBJECTS = ['PCM', 'PCB', 'PCMB'] as const;
export const DEMO_COMMERCE_SUBJECTS = ['Mathematics', 'Accounts', 'Economics', 'Business Studies'] as const;
export const DEMO_HUMANITIES_SUBJECTS = ['Economics', 'Political Science', 'History', 'Geography'] as const;
export const DEMO_JEE_NEET_SUBJECTS = [
  { value: 'NEET', label: 'NEET' },
  { value: 'JEE Main', label: 'JEE Main' },
  { value: 'JEE Advance', label: 'JEE Adv' },
  { value: 'JEE Main+Advance', label: 'JEE Main+Adv' },
] as const;

/**
 * Normalizes spacing in single-number class names (e.g. `Class-11` -> `Class 11`)
 * while preserving range labels such as `Class 1-8`, `Class 4-8`, or `Class 6-8`.
 */
export function formatBranchClassLabel(rawName: string | undefined | null): string {
  return String(rawName || '')
    .trim()
    .replace(/^(Class)-(\d+)(?!\s*-)/i, '$1 $2')
    .replace(/\s+/g, ' ');
}

/**
 * Expands grouped grade ranges (e.g. `Class 1-8`, `Class 4-8`, `Class 6-8`)
 * into individual ascending class entries (`Class 1`, `Class 2`, ...).
 */
export function expandBranchClassLabels(rawName: string | undefined | null): string[] {
  const cleanLabel = formatBranchClassLabel(rawName);
  if (!cleanLabel) return [];

  const rangeMatch = cleanLabel.match(/^(?:Class\s*)?(\d+)\s*[-–]\s*(\d+)$/i);
  if (rangeMatch) {
    const startGrade = Number(rangeMatch[1]);
    const endGrade = Number(rangeMatch[2]);
    if (
      Number.isInteger(startGrade) &&
      Number.isInteger(endGrade) &&
      startGrade >= 1 &&
      endGrade >= startGrade &&
      endGrade <= 12 &&
      endGrade - startGrade <= 11
    ) {
      const expanded: string[] = [];
      for (let grade = startGrade; grade <= endGrade; grade += 1) {
        expanded.push(`Class ${grade}`);
      }
      return expanded;
    }
  }

  return [cleanLabel];
}

function isExcludedDemoClass(rawName: string | undefined | null, division?: string | null): boolean {
  const name = String(rawName || '').trim();
  const div = String(division || '').trim();
  return /\bnios\b/i.test(name) || /^nios$/i.test(div);
}

function getClassSortKey(rawName: string, order?: number | null): [number, number, number, string] {
  const label = formatBranchClassLabel(rawName);
  const match = label.match(/^(?:Class\s*)?(\d+)(?:\s*[-–]\s*(\d+))?(.*)$/i);
  if (match) {
    const startGrade = Number(match[1]);
    const endGrade = match[2] ? Number(match[2]) : startGrade;
    const suffix = (match[3] || '').trim().toLowerCase();
    const suffixRank = suffix === '' ? 0 : suffix.includes('pass') ? 1 : 2;
    return [startGrade, endGrade, suffixRank, label.toLowerCase()];
  }

  const orderVal =
    order !== undefined && order !== null && !Number.isNaN(Number(order)) ? Number(order) : 9999;
  return [100 + orderVal, 999, 0, label.toLowerCase()];
}

function sortClassesClassWise<T extends { name: string; order?: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ka = getClassSortKey(a.name, a.order);
    const kb = getClassSortKey(b.name, b.order);
    for (let i = 0; i < 3; i++) {
      if (ka[i] !== kb[i]) return (ka[i] as number) - (kb[i] as number);
    }
    return String(ka[3]).localeCompare(String(kb[3]), undefined, { numeric: true });
  });
}

function toTitleCaseLabel(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase());
}

/**
 * Derives clean Title / Program options for a specific branch and class/course.
 */
export function resolveTitlesForClass(
  branchId: string,
  classLabel: string,
  division?: string | null
): string[] {
  const cleanLabel = formatBranchClassLabel(classLabel);
  const lowerName = cleanLabel.toLowerCase();
  const cleanDivision = (division || '').trim();
  const upperDiv = cleanDivision.toUpperCase();

  if (/\b12\s*pass\b/i.test(lowerName) || /\bjee\b|\bneet\b/i.test(lowerName)) {
    return ['JEE / NEET Foundation'];
  }

  if (/\bcuet\b/i.test(lowerName)) {
    return ['CUET (UG) Target Batch'];
  }

  const gradeMatch = cleanLabel.match(/^(?:Class\s*)?(\d+)(?:\s*[-–]\s*(\d+))?/i);
  if (gradeMatch) {
    const startGrade = Number(gradeMatch[1]);
    const endGrade = gradeMatch[2] ? Number(gradeMatch[2]) : startGrade;

    if (endGrade <= 8) {
      return ['Junior Foundation'];
    }

    if (startGrade >= 9 && endGrade <= 10) {
      return ['Secondary Board'];
    }

    if (startGrade >= 11) {
      const seniorTitles = ['Science Program', 'Commerce Program', 'Humanities Program'];
      if (JEE_NEET_BRANCH_IDS.has(branchId)) {
        seniorTitles.push('JEE / NEET Foundation');
      }
      if (branchId === 'mukherjee-nagar' && endGrade === 12) {
        seniorTitles.push('CUET (UG)');
      }
      return seniorTitles;
    }
  }

  if (
    cleanDivision &&
    upperDiv !== 'FOUNDATION' &&
    upperDiv !== 'SECONDARY' &&
    upperDiv !== 'GENERAL'
  ) {
    return [toTitleCaseLabel(cleanDivision)];
  }

  return [cleanLabel];
}

/**
 * Returns subject/stream selector configuration matching EnrollNowModal for senior & JEE/NEET titles,
 * or standard free-text subject input for Junior/Secondary/CUET classes.
 */
export function getSubjectSelectorConfig(
  classValue: string | undefined | null,
  programTitle: string | undefined | null
): DemoSubjectSelectorConfig {
  const titleLower = String(programTitle || '').toLowerCase();
  const classLower = String(classValue || '').toLowerCase();

  if (
    titleLower.includes('jee') ||
    titleLower.includes('neet') ||
    classLower.includes('12 pass') ||
    classLower.includes('jee') ||
    classLower.includes('neet')
  ) {
    return {
      mode: 'stream',
      heading: 'SELECT TARGET STREAM / SUBJECT(S) *',
      options: DEMO_JEE_NEET_SUBJECTS.map((o) => ({ value: o.value, label: o.label })),
      singleSelect: true,
    };
  }

  if (titleLower.includes('science')) {
    return {
      mode: 'stream',
      heading: 'SELECT SUBJECT(S) *',
      options: DEMO_SCIENCE_SUBJECTS.map((s) => ({ value: s, label: s })),
      singleSelect: true,
    };
  }

  if (titleLower.includes('commerce')) {
    return {
      mode: 'stream',
      heading: 'SELECT SUBJECT(S) *',
      options: DEMO_COMMERCE_SUBJECTS.map((s) => ({ value: s, label: s })),
      singleSelect: false,
    };
  }

  if (titleLower.includes('humanities')) {
    return {
      mode: 'stream',
      heading: 'SELECT SUBJECT(S) *',
      options: DEMO_HUMANITIES_SUBJECTS.map((s) => ({ value: s, label: s })),
      singleSelect: false,
    };
  }

  return {
    mode: 'text',
    heading: '',
    options: [],
    singleSelect: false,
  };
}

/**
 * Builds an ordered map of branchId -> class-wise sorted Class / Course labels
 * and per-class Title options from Admin Class Management (`feeManagement/classes`).
 * Excludes NIOS entries and appends `Class 12 PASS` exclusively for JEE/NEET branches.
 */
export function buildBranchClassCatalog(
  classes: Pick<FeeClass, 'id' | 'name' | 'branchId' | 'order' | 'division'>[]
): BranchClassCatalogResult {
  const classesByBranch: Record<string, string[]> = {};
  const titlesByBranchAndClass: Record<string, Record<string, string[]>> = {};
  const sourcesByBranch: Record<string, PublicBranchCatalogSource> = {};

  for (const branchId of CATALOG_BRANCH_IDS) {
    const filteredLive = classes.filter(
      (cls) => normalizeBranchId(cls.branchId) === branchId && !isExcludedDemoClass(cls.name, cls.division)
    );

    const seen = new Set<string>();
    const rawEntries: { name: string; division?: string | null; order?: number | null }[] = [];

    for (const cls of filteredLive) {
      for (const label of expandBranchClassLabels(cls.name)) {
        const dedupeKey = label.toLowerCase();
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        rawEntries.push({ name: label, division: cls.division, order: cls.order });
      }
    }

    if (rawEntries.length > 0) {
      // Include Class 12 PASS strictly for branches that run JEE / NEET
      const hasSeniorOrEntrance = rawEntries.some((item) =>
        /\b(11|12|jee|neet)\b/i.test(item.name)
      );
      if (JEE_NEET_BRANCH_IDS.has(branchId) && hasSeniorOrEntrance && !seen.has('class 12 pass')) {
        rawEntries.push({ name: 'Class 12 PASS', division: 'JEE / NEET', order: 6 });
        seen.add('class 12 pass');
      }

      const sortedLive = sortClassesClassWise(rawEntries);
      const formattedNames: string[] = [];
      const titleMap: Record<string, string[]> = {};
      for (const entry of sortedLive) {
        formattedNames.push(entry.name);
        titleMap[entry.name] = resolveTitlesForClass(branchId, entry.name, entry.division);
      }
      classesByBranch[branchId] = formattedNames;
      titlesByBranchAndClass[branchId] = titleMap;
      sourcesByBranch[branchId] = 'live';
    } else {
      const fallbackSeen = new Set<string>();
      const expandedFallback: { name: string; order: number }[] = [];
      for (const rawFallback of FALLBACK_COURSES_BY_BRANCH[branchId] || []) {
        for (const label of expandBranchClassLabels(rawFallback)) {
          const dedupeKey = label.toLowerCase();
          if (fallbackSeen.has(dedupeKey)) continue;
          fallbackSeen.add(dedupeKey);
          expandedFallback.push({ name: label, order: expandedFallback.length + 1 });
        }
      }
      const fallbackList = sortClassesClassWise(expandedFallback).map((item) => item.name);
      const titleMap: Record<string, string[]> = {};
      for (const fallbackName of fallbackList) {
        titleMap[fallbackName] = resolveTitlesForClass(branchId, fallbackName, null);
      }
      classesByBranch[branchId] = fallbackList;
      titlesByBranchAndClass[branchId] = titleMap;
      sourcesByBranch[branchId] = 'catalog';
    }
  }

  return { classesByBranch, titlesByBranchAndClass, sourcesByBranch };
}

/**
 * Resolves the class-wise sorted Class / Course list for a UI branch value or slug.
 */
export function getClassesForBranchValue(
  catalog: BranchClassCatalogResult,
  branchValue: string | undefined | null
): string[] {
  const normalizedId = normalizeBranchId(branchValue);
  if (!normalizedId || normalizedId === 'all') return [];
  return catalog.classesByBranch[normalizedId] || [];
}

/**
 * Resolves Title / Program options for a UI branch value and selected Class / Course.
 */
export function getTitlesForBranchClass(
  catalog: BranchClassCatalogResult,
  branchValue: string | undefined | null,
  classValue: string | undefined | null
): string[] {
  const normalizedId = normalizeBranchId(branchValue);
  const formattedClass = formatBranchClassLabel(classValue);
  if (!normalizedId || normalizedId === 'all' || !formattedClass) return [];

  const branchTitles = catalog.titlesByBranchAndClass[normalizedId];
  if (branchTitles?.[formattedClass]?.length) {
    return branchTitles[formattedClass];
  }
  return resolveTitlesForClass(normalizedId, formattedClass, null);
}

/**
 * Resolves deep-linked or default branch, class/course, and title against a live catalog.
 */
export function resolveCatalogSelectionFromParams(
  catalog: BranchClassCatalogResult,
  params: {
    branch?: string | null;
    classCourse?: string | null;
    title?: string | null;
  }
): { branch: string; classCourse: string; programTitle: string } {
  const branchParam = params.branch?.trim() || '';
  const courseParam = params.classCourse?.trim() || '';
  const titleParam = params.title?.trim() || '';

  let matchedBranchValue = '';
  if (branchParam) {
    const paramBranchId = normalizeBranchId(branchParam);
    const matchedBranch = BOOK_DEMO_BRANCHES.find((b) => {
      if (paramBranchId && normalizeBranchId(b) === paramBranchId) return true;
      const shortName = b.split(',')[0].toLowerCase();
      return (
        b.toLowerCase().includes(branchParam.toLowerCase()) ||
        branchParam.toLowerCase().includes(shortName)
      );
    });
    if (matchedBranch) {
      matchedBranchValue = matchedBranch;
    }
  }

  let matchedCourseValue = '';
  if (courseParam && matchedBranchValue) {
    const branchCourses = getClassesForBranchValue(catalog, matchedBranchValue);
    const normalizedCourseParam = formatBranchClassLabel(courseParam).toLowerCase();
    const matchedCourse = branchCourses.find(
      (c) =>
        c.toLowerCase() === normalizedCourseParam ||
        c.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedCourseParam.replace(/[^a-z0-9]/g, '')
    );
    if (matchedCourse) {
      matchedCourseValue = matchedCourse;
    }
  }

  let matchedTitleValue = '';
  if (matchedBranchValue && matchedCourseValue) {
    const availableTitles = getTitlesForBranchClass(catalog, matchedBranchValue, matchedCourseValue);
    if (titleParam) {
      const normalizedTitle = titleParam.toLowerCase();
      const matched = availableTitles.find((t) => t.toLowerCase() === normalizedTitle);
      if (matched) matchedTitleValue = matched;
    } else if (availableTitles.length === 1) {
      matchedTitleValue = availableTitles[0];
    }
  }

  return {
    branch: matchedBranchValue,
    classCourse: matchedCourseValue,
    programTitle: matchedTitleValue,
  };
}
