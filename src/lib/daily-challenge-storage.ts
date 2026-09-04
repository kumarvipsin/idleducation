export type ClassLevel = '6' | '7' | '8' | '9' | '10';

export interface DailyChallengeState {
  selectedClass: ClassLevel | null;
  challengesCompleted: number;
  currentStreak: number;
  bestStreak: number;
  totalCorrect: number;
  totalAttempted: number;
  lastCompletedDate: string | null; // 'YYYY-MM-DD'
  lastScore: {
    score: number;
    total: number;
    date: string;
    classLevel: ClassLevel;
    userAnswers: number[]; // index of selected option per question, -1 if unanswered
  } | null;
}

const STORAGE_KEY = 'idl_daily_challenge_data_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultState(): DailyChallengeState {
  return {
    selectedClass: null,
    challengesCompleted: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAttempted: 0,
    lastCompletedDate: null,
    lastScore: null,
  };
}

export function getDailyChallengeState(): DailyChallengeState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultState(),
      ...parsed,
    };
  } catch (err) {
    console.error('Error reading daily challenge state:', err);
    return getDefaultState();
  }
}

export function saveDailyChallengeState(state: DailyChallengeState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving daily challenge state:', err);
  }
}

export function saveSelectedClass(classLevel: ClassLevel): DailyChallengeState {
  const current = getDailyChallengeState();
  const updated: DailyChallengeState = {
    ...current,
    selectedClass: classLevel,
  };
  saveDailyChallengeState(updated);
  return updated;
}

export function hasCompletedToday(): boolean {
  const state = getDailyChallengeState();
  if (!state.lastCompletedDate) return false;
  return state.lastCompletedDate === getTodayDateString();
}

/**
 * Calculates day difference between two YYYY-MM-DD strings in local timezone.
 */
function getDayDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function recordChallengeCompletion(
  score: number,
  total: number,
  classLevel: ClassLevel,
  userAnswers: number[]
): DailyChallengeState {
  const current = getDailyChallengeState();
  const today = getTodayDateString();

  // If already completed today, just return current state without re-incrementing streak
  if (current.lastCompletedDate === today && current.lastScore) {
    return current;
  }

  let newStreak = 1;
  if (current.lastCompletedDate) {
    const diff = getDayDifference(current.lastCompletedDate, today);
    if (diff === 1) {
      newStreak = (current.currentStreak || 0) + 1;
    } else if (diff === 0) {
      newStreak = current.currentStreak || 1;
    } else {
      newStreak = 1;
    }
  }

  const bestStreak = Math.max(current.bestStreak || 0, newStreak);

  const updated: DailyChallengeState = {
    ...current,
    selectedClass: classLevel,
    challengesCompleted: (current.challengesCompleted || 0) + 1,
    currentStreak: newStreak,
    bestStreak: bestStreak,
    totalCorrect: (current.totalCorrect || 0) + score,
    totalAttempted: (current.totalAttempted || 0) + total,
    lastCompletedDate: today,
    lastScore: {
      score,
      total,
      date: today,
      classLevel,
      userAnswers,
    },
  };

  saveDailyChallengeState(updated);
  return updated;
}
