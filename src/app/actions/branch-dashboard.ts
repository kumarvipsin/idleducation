'use server';

import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getServerAdminContext, resolveScopedBranchFilter } from '@/lib/server-admin-auth';
import { getBranchDisplayName, recordMatchesBranch } from '@/lib/branch-utils';
import { serializeFirestoreData } from './utils';

export interface BranchMonthlyStatPoint {
  name: string;
  newStudents: number;
  totalUsers: number;
  totalStudents: number;
  trainedStudents: number;
  totalTeachers: number;
}

export interface BranchPendingTeacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  experience?: string;
  branchId?: string;
  branchName?: string;
  createdAt?: string | null;
}

export interface BranchUpdateItem {
  id: string;
  title: string;
  description: string;
  branchId?: string;
  branchName?: string;
  createdAt?: string | null;
}

export interface BranchDashboardPayload {
  admin: {
    uid: string;
    name: string;
    email: string;
    branchId: string;
    branchName: string;
    branchDisplayName: string;
  };
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    approvedStudents: number;
    deniedUsers: number;
    totalBookings: number;
    monthlyBookings: number;
    totalSubmissions: number;
    monthlySubmissions: number;
    totalUpdates: number;
    monthlyUpdates: number;
    activeUsers: number;
    monthlyActiveUsers: number;
    inactiveUsers: number;
  };
  pendingTeachers: BranchPendingTeacher[];
  monthlyStats: BranchMonthlyStatPoint[];
  updates: BranchUpdateItem[];
}

function toJsDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof (value as any)?.toDate === 'function') return (value as any).toDate();
  const dt = new Date(value as string | number);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function getFiscalYearBoundaries(date: Date) {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  if (currentMonth >= 3) {
    return {
      fiscalYearStart: new Date(currentYear, 3, 1),
      fiscalYearEnd: new Date(currentYear + 1, 2, 31, 23, 59, 59, 999),
    };
  }
  return {
    fiscalYearStart: new Date(currentYear - 1, 3, 1),
    fiscalYearEnd: new Date(currentYear, 2, 31, 23, 59, 59, 999),
  };
}

/**
 * Fetches complete, strictly isolated dashboard statistics and operational lists
 * for the currently authenticated Branch Administrator.
 * Never accepts client-supplied branch IDs; always uses the server-verified admin session.
 */
export async function getBranchDashboardData(narrowBranchId?: string): Promise<{
  success: boolean;
  message?: string;
  data?: BranchDashboardPayload;
}> {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      return { success: false, message: 'Unauthorized: Valid administrator session required.' };
    }
    const branchId = resolveScopedBranchFilter(adminCtx, narrowBranchId);
    if (!branchId || branchId === 'all') {
      return { success: false, message: 'Branch admin account required for branch dashboard.' };
    }
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const { fiscalYearStart, fiscalYearEnd } = getFiscalYearBoundaries(now);

    const isInCurrentMonth = (rawDate: unknown): boolean => {
      const dt = toJsDate(rawDate);
      return Boolean(dt && dt >= monthStart && dt < nextMonthStart);
    };

    const [usersSnap, deniedSnap, bookingsSnap, contactsSnap, updatesSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'deniedUsers')),
      getDocs(collection(db, 'sessionBookings')),
      getDocs(collection(db, 'contactSubmissions')),
      getDocs(collection(db, 'updates')),
    ]);

    const branchUsers = usersSnap.docs
      .map((d) => ({ id: d.id, raw: d.data(), serialized: serializeFirestoreData(d.data()) }))
      .filter(({ raw }) => {
        if (!recordMatchesBranch(raw, branchId)) return false;
        return String(raw.role || '').trim().toLowerCase() !== 'admin';
      });

    const deniedCount = deniedSnap.docs.filter((d) => recordMatchesBranch(d.data(), branchId)).length;

    const branchBookings = bookingsSnap.docs
      .map((d) => d.data())
      .filter((raw) => recordMatchesBranch(raw, branchId));

    const branchContacts = contactsSnap.docs
      .map((d) => d.data())
      .filter((raw) => recordMatchesBranch(raw, branchId));

    const branchUpdates = updatesSnap.docs
      .map((d) => ({
        id: d.id,
        raw: d.data(),
        serialized: serializeFirestoreData(d.data()),
      }))
      .filter(({ raw }) => recordMatchesBranch(raw, branchId))
      .sort((a, b) => {
        const tA = toJsDate(a.raw.createdAt)?.getTime() || 0;
        const tB = toJsDate(b.raw.createdAt)?.getTime() || 0;
        return tB - tA;
      });

    const totalUsers = branchUsers.length;
    const totalStudents = branchUsers.filter(({ raw }) => raw.role === 'student').length;
    const totalTeachers = branchUsers.filter(({ raw }) => raw.role === 'teacher').length;
    const approvedStudents = branchUsers.filter(
      ({ raw }) => raw.role === 'student' && raw.status === 'approved'
    ).length;
    const activeUsers = branchUsers.filter(({ raw }) => raw.status === 'approved').length;
    const monthlyActiveUsers = branchUsers.filter(
      ({ raw }) => raw.status === 'approved' && isInCurrentMonth(raw.createdAt)
    ).length;
    const inactiveUsers = branchUsers.filter(({ raw }) => raw.status === 'inactive').length;

    const pendingTeachers: BranchPendingTeacher[] = branchUsers
      .filter(({ raw }) => raw.role === 'teacher' && raw.status === 'pending')
      .sort((a, b) => {
        const tA = toJsDate(a.raw.createdAt)?.getTime() || 0;
        const tB = toJsDate(b.raw.createdAt)?.getTime() || 0;
        return tB - tA;
      })
      .map(({ id, serialized }) => ({
        id,
        name: String(serialized.name || 'Unnamed Teacher'),
        email: String(serialized.email || ''),
        phone: serialized.phone ? String(serialized.phone) : undefined,
        designation: serialized.designation ? String(serialized.designation) : undefined,
        experience: serialized.experience ? String(serialized.experience) : undefined,
        branchId: serialized.branchId,
        branchName: serialized.branchName,
        createdAt: serialized.createdAt || null,
      }));

    // Build Apr-Mar cumulative fiscal year chart series strictly from branch users
    const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const monthlyBuckets: Record<
      string,
      { newStudents: number; totalUsers: number; totalStudents: number; trainedStudents: number; totalTeachers: number }
    > = {};
    for (const m of monthNames) {
      monthlyBuckets[m] = {
        newStudents: 0,
        totalUsers: 0,
        totalStudents: 0,
        trainedStudents: 0,
        totalTeachers: 0,
      };
    }

    for (const { raw } of branchUsers) {
      const createdAt = toJsDate(raw.createdAt);
      if (!createdAt || createdAt < fiscalYearStart || createdAt > fiscalYearEnd) {
        continue;
      }
      const mIdx = createdAt.getMonth();
      const fiscalMonthName = mIdx >= 3 ? monthNames[mIdx - 3] : monthNames[mIdx + 9];
      const bucket = monthlyBuckets[fiscalMonthName];
      if (!bucket) continue;

      bucket.totalUsers += 1;
      if (raw.role === 'student') {
        bucket.totalStudents += 1;
        if (raw.status === 'approved') {
          bucket.newStudents += 1;
          if (Array.isArray(raw.teacherIds) && raw.teacherIds.length > 0) {
            bucket.trainedStudents += 1;
          }
        }
      } else if (raw.role === 'teacher') {
        bucket.totalTeachers += 1;
      }
    }

    let cumUsers = 0;
    let cumStudents = 0;
    let cumTrained = 0;
    let cumTeachers = 0;
    const monthlyStats: BranchMonthlyStatPoint[] = monthNames.map((m) => {
      cumUsers += monthlyBuckets[m].totalUsers;
      cumStudents += monthlyBuckets[m].totalStudents;
      cumTrained += monthlyBuckets[m].trainedStudents;
      cumTeachers += monthlyBuckets[m].totalTeachers;
      return {
        name: m,
        newStudents: monthlyBuckets[m].newStudents,
        totalUsers: cumUsers,
        totalStudents: cumStudents,
        trainedStudents: cumTrained,
        totalTeachers: cumTeachers,
      };
    });

    const updates: BranchUpdateItem[] = branchUpdates.map(({ id, serialized }) => ({
      id,
      title: String(serialized.title || ''),
      description: String(serialized.description || ''),
      branchId: serialized.branchId,
      branchName: serialized.branchName,
      createdAt: serialized.createdAt || null,
    }));

    return {
      success: true,
      data: {
        admin: {
          uid: adminCtx.uid,
          name: adminCtx.name,
          email: adminCtx.email,
          branchId,
          branchName: getBranchDisplayName(branchId, true),
          branchDisplayName: getBranchDisplayName(branchId, false),
        },
        stats: {
          totalUsers,
          totalStudents,
          totalTeachers,
          approvedStudents,
          deniedUsers: deniedCount,
          totalBookings: branchBookings.length,
          monthlyBookings: branchBookings.filter((b) => isInCurrentMonth(b.createdAt)).length,
          totalSubmissions: branchContacts.length,
          monthlySubmissions: branchContacts.filter((c) => isInCurrentMonth(c.createdAt)).length,
          totalUpdates: updates.length,
          monthlyUpdates: updates.filter((u) => isInCurrentMonth(u.createdAt)).length,
          activeUsers,
          monthlyActiveUsers,
          inactiveUsers,
        },
        pendingTeachers,
        monthlyStats,
        updates,
      },
    };
  } catch (error) {
    console.error('Error loading branch dashboard data:', error);
    return { success: false, message: 'Failed to load branch dashboard data.' };
  }
}

