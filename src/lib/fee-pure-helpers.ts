// src/lib/fee-pure-helpers.ts
/**
 * Pure domain calculation and date-formatting helpers for Fee Management.
 * Kept strictly isolated from network/database side-effects for safe testing and clean module boundaries.
 */

export function getMonthSequence(startMonth: string, endMonth: string): string[] {
  const [sY, sM] = startMonth.split('-').map(Number);
  const [eY, eM] = endMonth.split('-').map(Number);
  const seq: string[] = [];
  let y = sY;
  let m = sM;
  while (y < eY || (y === eY && m <= eM)) {
    seq.push(`${y}-${String(m).padStart(2, '0')}`);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return seq;
}

export function clampDueDateForMonth(monthStr: string, dueDay: number): string {
  const [yStr, mStr] = (monthStr || '').split('-');
  const y = parseInt(yStr, 10) || new Date().getFullYear();
  const m = Math.min(12, Math.max(1, parseInt(mStr, 10) || 1));
  const maxDay = new Date(y, m, 0).getDate();
  const safeDay = Math.min(Math.max(1, Math.round(Number(dueDay) || 5)), maxDay);
  return `${y}-${String(m).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
}

export function normalizeIsoDateString(rawDate: string | undefined, fallbackIso: string): string {
  const trimmed = (rawDate || '').trim().replace(/\//g, '-');
  if (!trimmed) return fallbackIso;
  const parts = trimmed.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
    } else if (parts[2].length === 4) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
    }
  }
  return fallbackIso;
}

export function addMonthsToYYYYMM(baseMonth: string, addCount: number): string {
  const parts = (baseMonth || '2026-11').split('-');
  let y = parseInt(parts[0], 10) || 2026;
  let m = (parseInt(parts[1], 10) || 1) - 1; // 0-indexed
  m += addCount;
  y += Math.floor(m / 12);
  m = ((m % 12) + 12) % 12;
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

