/**
 * Shared branch normalization and strict branch-matching utilities.
 * Safe for both Server Actions and Client Components (no server-only secrets).
 */

export interface CanonicalBranchMeta {
  id: string;
  displayName: string;
  adminLabel: string;
}

export const CANONICAL_BRANCHES: CanonicalBranchMeta[] = [
  { id: 'mangolpuri', displayName: 'Mangol Puri', adminLabel: 'Mangol Puri Branch' },
  { id: 'budh-vihar', displayName: 'Budh Vihar', adminLabel: 'Budh Vihar Branch' },
  { id: 'krishan-vihar', displayName: 'Krishan Vihar', adminLabel: 'Krishan Vihar Branch' },
  { id: 'mukherjee-nagar', displayName: 'Mukherjee Nagar', adminLabel: 'Mukherjee Nagar Branch' },
  { id: 'rohini', displayName: 'Rohini', adminLabel: 'Rohini Branch' },
  { id: 'online', displayName: 'Online / HQ', adminLabel: 'Online / HQ' },
];

const BRANCH_META_BY_ID = new Map<string, CanonicalBranchMeta>(
  CANONICAL_BRANCHES.map((branch) => [branch.id, branch])
);

/**
 * Normalizes any branch identifier, display name, or address string into a canonical branch slug.
 * Returns null for empty values, or `'all'` for Super Admin multi-branch access.
 */
export function normalizeBranchId(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'all' || lower.includes('all branches')) {
    return 'all';
  }
  if (lower.includes('mangol')) {
    return 'mangolpuri';
  }
  if (lower.includes('budh')) {
    return 'budh-vihar';
  }
  if (lower.includes('krish')) {
    return 'krishan-vihar';
  }
  if (lower.includes('mukherj')) {
    return 'mukherjee-nagar';
  }
  if (lower.includes('rohini')) {
    return 'rohini';
  }
  if (lower === 'online' || lower.startsWith('online')) {
    return 'online';
  }

  const head = lower.split(',')[0] || lower;
  const cleaned = head
    .replace(/\bbranch\b/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned || null;
}

/**
 * Returns a human-readable branch name for any raw branch ID or label.
 */
export function getBranchDisplayName(value?: string | null, withBranchSuffix = false): string {
  const normalized = normalizeBranchId(value);
  if (!normalized) return 'Unassigned Branch';
  if (normalized === 'all') {
    return withBranchSuffix ? 'All Branches (Super Admin)' : 'All Branches';
  }

  const known = BRANCH_META_BY_ID.get(normalized);
  if (known) {
    return withBranchSuffix ? known.adminLabel : known.displayName;
  }

  const titleCased = normalized
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return withBranchSuffix ? `${titleCased} Branch` : titleCased;
}

/**
 * Extracts the primary canonical branch ID from a Firestore or JSON record.
 */
export function extractRecordBranchId(record: Record<string, any> | null | undefined): string | null {
  if (!record || typeof record !== 'object') return null;

  const primary = record.branchId ?? record.branchSlug;
  if (typeof primary === 'string' && primary.trim()) {
    return normalizeBranchId(primary);
  }

  const secondaryCandidates = [record.branchName, record.branch, record.nearestBranch];
  for (const candidate of secondaryCandidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      const normalized = normalizeBranchId(candidate);
      if (normalized) return normalized;
    }
  }

  return null;
}

/**
 * Strictly checks whether a record belongs to the target canonical branch ID.
 * Fails closed: returns false if targetBranchId is invalid or record has no matching branch.
 * Notice: Super Admin sentinel `'all'` never matches a specific branch record.
 */
export function recordMatchesBranch(
  record: Record<string, any> | null | undefined,
  targetBranchId?: string | null
): boolean {
  const target = normalizeBranchId(targetBranchId);
  if (!target || !record || typeof record !== 'object') {
    return false;
  }
  if (target === 'all') {
    return true;
  }

  const explicitId = record.branchId ?? record.branchSlug;
  if (typeof explicitId === 'string' && explicitId.trim()) {
    return normalizeBranchId(explicitId) === target;
  }

  const textBranch = extractRecordBranchId(record);
  if (!textBranch || textBranch === 'all') {
    return false;
  }
  return textBranch === target;
}

