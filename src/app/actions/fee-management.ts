// src/app/actions/fee-management.ts
'use server';

import fs from 'fs';
import path from 'path';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import type {
  FeeClass,
  FeeBatch,
  FeeStudent,
  AdditionalSubject,
  StudentTransferRecord,
  FeeLedgerEntry,
  FeePayment,
  FeeDashboardStats,
  StudentStatus,
  LedgerStatus,
  PaymentMode,
  BranchYearlyReportResult,
  BranchYearlyData,
  BranchYearlyMonthPoint,
} from '@/types/fee-management';
import { IDL_BRANCHES, getStudentStatusForMonth, getActiveAdditionalSubjectsForMonth } from '@/types/fee-management';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'fee-management-db.json');

interface FeeDatabase {
  classes: FeeClass[];
  batches: FeeBatch[];
  students: FeeStudent[];
  ledger: FeeLedgerEntry[];
  payments: FeePayment[];
}

function loadDatabase(): FeeDatabase {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial: FeeDatabase = {
        classes: [],
        batches: [],
        students: [],
        ledger: [],
        payments: [],
      };
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      classes: parsed.classes || [],
      batches: parsed.batches || [],
      students: parsed.students || [],
      ledger: parsed.ledger || [],
      payments: parsed.payments || [],
    };
  } catch (err) {
    console.error('Failed to load fee database from file, fallback:', err);
    return {
      classes: [],
      batches: [],
      students: [],
      ledger: [],
      payments: [],
    };
  }
}

function saveDatabase(data: FeeDatabase): void {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    console.error('Failed to save fee database to disk:', err);
  }
}

// Helper for month formatting
export async function getMonthLabel(monthStr: string): Promise<string> {
  const [year, month] = monthStr.split('-').map(Number);
  if (!year || !month) return monthStr;
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export async function getCurrentMonth(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getPreviousMonth(monthStr: string): string {
  const [y, m] = monthStr.split('-').map(Number);
  let prevYear = y;
  let prevMonth = m - 1;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}

function getNextMonth(monthStr: string): string {
  const [y, m] = monthStr.split('-').map(Number);
  let nextYear = y;
  let nextMonth = m + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
}

function getMonthSequence(startMonth: string, endMonth: string): string[] {
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

// Academic session months starting strictly from April 2026 (2026-04) up to current month (future months locked)
export async function getAcademicMonths(): Promise<{ value: string; label: string }[]> {
  const currentMonth = await getCurrentMonth();
  const startYear = 2026;
  const startMonth = 4; // 1 April 2026

  const [currYear, currMonth] = currentMonth.split('-').map(Number);
  const months: { value: string; label: string }[] = [];

  let y = startYear;
  let m = startMonth;

  while (y < currYear || (y === currYear && m <= currMonth)) {
    const val = `${y}-${String(m).padStart(2, '0')}`;
    const date = new Date(y, m - 1, 1);
    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    months.push({ value: val, label });

    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }

  return months;
}

// Reset/Clear action - ONLY called if explicitly clicked by user with double confirmation
export async function clearAllFeeData(): Promise<{ success: boolean; message: string }> {
  try {
    saveDatabase({
      classes: [],
      batches: [],
      students: [],
      ledger: [],
      payments: [],
    });
    return { success: true, message: 'Fee data reset to clean state.' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Failed to clear data' };
  }
}

// =============================================================
// 1. CLASSES MANAGEMENT
// =============================================================

export async function getFeeClasses(branchId?: string): Promise<{ success: boolean; data: FeeClass[] }> {
  try {
    const dbData = loadDatabase();
    let classes = [...dbData.classes];
    if (branchId && branchId !== 'all') {
      classes = classes.filter(c => c.branchId === branchId);
    }

    // Attach batch and student counts
    const enriched = classes.map(cls => {
      const batches = dbData.batches.filter(b => b.classId === cls.id);
      const students = dbData.students.filter(s => s.classId === cls.id);
      return {
        ...cls,
        batchCount: batches.length,
        studentCount: students.length,
      };
    });

    // Sort classes by order number ascending, fallback to numeric/alphabetical name
    enriched.sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return { success: true, data: enriched };
  } catch (error: any) {
    console.error('Error fetching fee classes:', error);
    return { success: false, data: [] };
  }
}

export async function createFeeClass(data: {
  name: string;
  code: string;
  branchId: string;
  academicSession: string;
  division?: string;
  description?: string;
  defaultMonthlyFee?: number;
  order?: number;
}): Promise<{ success: boolean; message: string; data?: FeeClass }> {
  try {
    const id = `cls-${Date.now()}`;
    const newClass: FeeClass = {
      id,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      branchId: data.branchId || 'mukherjee-nagar',
      academicSession: data.academicSession || '2026-27',
      division: data.division?.trim(),
      description: data.description?.trim(),
      defaultMonthlyFee: Number(data.defaultMonthlyFee) || 0,
      order: data.order !== undefined && data.order !== null && !isNaN(Number(data.order)) ? Number(data.order) : undefined,
      createdAt: new Date().toISOString(),
    };

    const dbData = loadDatabase();
    dbData.classes.unshift(newClass);
    saveDatabase(dbData);

    return {
      success: true,
      message: `Class "${newClass.name}" created successfully.`,
      data: newClass,
    };
  } catch (error: any) {
    console.error('Error creating fee class:', error);
    return { success: false, message: error.message || 'Failed to create class.' };
  }
}

export async function updateFeeClass(
  id: string,
  data: Partial<FeeClass>
): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.classes.findIndex(c => c.id === id);
    if (idx === -1) return { success: false, message: 'Class not found.' };

    dbData.classes[idx] = {
      ...dbData.classes[idx],
      ...data,
      name: data.name !== undefined ? data.name.trim() : dbData.classes[idx].name,
      code: data.code !== undefined ? data.code.trim().toUpperCase() : dbData.classes[idx].code,
      branchId: data.branchId !== undefined ? data.branchId : dbData.classes[idx].branchId,
      division: data.division !== undefined ? data.division.trim() : dbData.classes[idx].division,
      academicSession: data.academicSession !== undefined ? data.academicSession.trim() : dbData.classes[idx].academicSession,
      description: data.description !== undefined ? data.description.trim() : dbData.classes[idx].description,
      defaultMonthlyFee: data.defaultMonthlyFee !== undefined ? Number(data.defaultMonthlyFee) || 0 : dbData.classes[idx].defaultMonthlyFee,
      order: data.order !== undefined ? (data.order !== null && !isNaN(Number(data.order)) ? Number(data.order) : undefined) : dbData.classes[idx].order,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(dbData);
    return { success: true, message: 'Class updated successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update class.' };
  }
}

export async function deleteFeeClass(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const batchCount = dbData.batches.filter(b => b.classId === id).length;
    const studentCount = dbData.students.filter(s => s.classId === id).length;

    if (batchCount > 0 || studentCount > 0) {
      return {
        success: false,
        message: `Deletion blocked: This class has ${batchCount} active batch(es) and ${studentCount} enrolled student(s). Please remove or reassign them first.`,
      };
    }

    dbData.classes = dbData.classes.filter(c => c.id !== id);
    saveDatabase(dbData);
    return { success: true, message: 'Class deleted successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete class.' };
  }
}

// =============================================================
// 2. BATCHES MANAGEMENT
// =============================================================

export async function getFeeBatches(
  classId?: string,
  branchId?: string
): Promise<{ success: boolean; data: FeeBatch[] }> {
  try {
    const dbData = loadDatabase();
    let batches = [...dbData.batches];
    if (classId && classId !== 'all') {
      batches = batches.filter(b => b.classId === classId);
    }
    if (branchId && branchId !== 'all') {
      batches = batches.filter(b => b.branchId === branchId);
    }

    const enriched = batches.map(b => ({
      ...b,
      studentCount: dbData.students.filter(s => s.batchId === b.id).length,
    }));

    // Sort batches by order number ascending
    enriched.sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return { success: true, data: enriched };
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

export async function createFeeBatch(data: {
  classId: string;
  branchId?: string;
  name: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  classTime?: string;
  subjects?: string[];
  monthlyFee: number;
  courseFee?: number;
  order?: number;
  createdAt?: string;
}): Promise<{ success: boolean; message: string; data?: FeeBatch }> {
  try {
    const dbData = loadDatabase();
    const targetCls = dbData.classes.find(c => c.id === data.classId);
    const resolvedBranch = targetCls?.branchId || data.branchId || 'mukherjee-nagar';

    const id = `batch-${Date.now()}`;
    const rawMonthly = Number(data.monthlyFee) || 0;
    const rawYearly = Number(data.courseFee) || 0;
    const finalMonthly = rawMonthly > 0 ? rawMonthly : (rawYearly > 0 ? Math.round(rawYearly / 12) : 0);
    const finalYearly = rawYearly > 0 ? rawYearly : (finalMonthly > 0 ? finalMonthly * 12 : undefined);

    const newBatch: FeeBatch = {
      id,
      classId: data.classId,
      branchId: resolvedBranch,
      name: data.name.trim(),
      duration: data.duration?.trim() || '1 Year (2026-27)',
      startDate: data.startDate?.trim() || undefined,
      endDate: data.endDate?.trim() || undefined,
      classTime: data.classTime?.trim() || '04:00 PM - 06:00 PM',
      subjects: Array.isArray(data.subjects) ? data.subjects : [],
      monthlyFee: finalMonthly,
      courseFee: finalYearly,
      order: data.order !== undefined && data.order !== null && !isNaN(Number(data.order)) ? Number(data.order) : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
    };

    dbData.batches.unshift(newBatch);
    saveDatabase(dbData);

    return {
      success: true,
      message: `Batch "${newBatch.name}" created successfully.`,
      data: newBatch,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create batch.' };
  }
}

export async function updateFeeBatch(
  id: string,
  data: Partial<FeeBatch>
): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.batches.findIndex(b => b.id === id);
    if (idx === -1) return { success: false, message: 'Batch not found.' };

    const oldBatch = dbData.batches[idx];
    const oldSubjects: string[] = Array.isArray(oldBatch.subjects) ? oldBatch.subjects : [];
    const newSubjects: string[] = data.subjects !== undefined ? data.subjects : oldSubjects;

    // Detect renamed, added, and removed subjects
    const renamedMap: Record<string, string> = {};
    if (oldSubjects.length === newSubjects.length) {
      for (let i = 0; i < oldSubjects.length; i++) {
        if (oldSubjects[i] !== newSubjects[i]) {
          renamedMap[oldSubjects[i]] = newSubjects[i];
        }
      }
    }
    const addedSubjects = newSubjects.filter(s => !oldSubjects.includes(s) && !Object.values(renamedMap).includes(s));
    const removedSubjects = oldSubjects.filter(s => !newSubjects.includes(s) && !(s in renamedMap));

    const nextMonthlyInput = data.monthlyFee !== undefined ? (Number(data.monthlyFee) || 0) : oldBatch.monthlyFee;
    const nextYearlyInput = data.courseFee !== undefined ? (Number(data.courseFee) || 0) : (oldBatch.courseFee || 0);
    const resolvedMonthlyFee = nextMonthlyInput > 0 ? nextMonthlyInput : (nextYearlyInput > 0 ? Math.round(nextYearlyInput / 12) : 0);
    const resolvedCourseFee = nextYearlyInput > 0 ? nextYearlyInput : (resolvedMonthlyFee > 0 ? resolvedMonthlyFee * 12 : undefined);

    const targetCls = dbData.classes.find(c => c.id === (data.classId || oldBatch.classId));
    const resolvedBranch = targetCls?.branchId || data.branchId || oldBatch.branchId || 'mukherjee-nagar';

    const updatedBatch: FeeBatch = {
      ...oldBatch,
      ...data,
      branchId: resolvedBranch,
      name: data.name !== undefined ? data.name.trim() : oldBatch.name,
      duration: data.duration !== undefined ? data.duration.trim() : oldBatch.duration,
      classTime: data.classTime !== undefined ? data.classTime.trim() : oldBatch.classTime,
      monthlyFee: resolvedMonthlyFee,
      courseFee: resolvedCourseFee,
      subjects: newSubjects,
      order: data.order !== undefined ? (data.order !== null && !isNaN(Number(data.order)) ? Number(data.order) : undefined) : oldBatch.order,
      updatedAt: new Date().toISOString(),
    };

    dbData.batches[idx] = updatedBatch;

    const feeChanged =
      resolvedMonthlyFee !== (oldBatch.monthlyFee || 0) ||
      (resolvedCourseFee || 0) !== (oldBatch.courseFee || 0);
    const subjectsChanged =
      data.subjects !== undefined &&
      (addedSubjects.length > 0 || removedSubjects.length > 0 || Object.keys(renamedMap).length > 0);
    const classOrBranchChanged =
      updatedBatch.classId !== oldBatch.classId || updatedBatch.branchId !== oldBatch.branchId;

    // Auto-sync subjects, fees, and class/branch to all existing students enrolled in this batch
    let updatedStudentCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    if (subjectsChanged || feeChanged || classOrBranchChanged) {
      dbData.students = dbData.students.map(student => {
        if (student.batchId !== id) return student;

        let changed = false;
        let studentSubs = Array.isArray(student.subjects) ? [...student.subjects] : [];

        if (subjectsChanged) {
          // 1. Apply renames
          if (Object.keys(renamedMap).length > 0) {
            studentSubs = studentSubs.map(sub => {
              if (renamedMap[sub]) {
                changed = true;
                return renamedMap[sub];
              }
              return sub;
            });
          }

          // 2. Remove deleted batch subjects
          if (removedSubjects.length > 0) {
            const beforeLen = studentSubs.length;
            studentSubs = studentSubs.filter(sub => !removedSubjects.includes(sub));
            if (studentSubs.length !== beforeLen) {
              changed = true;
            }
          }

          // 3. Add newly added batch subjects
          for (const sub of addedSubjects) {
            if (!studentSubs.includes(sub)) {
              studentSubs.push(sub);
              changed = true;
            }
          }
        }

        let nextBaseFee = student.baseFee;
        let nextDiscount = student.discountAmount;
        let nextNetFee = student.netFee;
        let nextYearlyPkg = student.yearlyPackage ? { ...student.yearlyPackage } : undefined;

        if (feeChanged && resolvedMonthlyFee > 0) {
          nextBaseFee = resolvedMonthlyFee;
          const pct = Math.min(100, Math.max(0, Number(student.scholarshipPercent) || 0));
          nextDiscount = Math.round((nextBaseFee * pct) / 100);
          nextNetFee = Math.max(0, nextBaseFee - nextDiscount);
          changed = true;

          if (nextYearlyPkg) {
            const cMonths = Math.max(1, Number(nextYearlyPkg.courseMonths) || 12);
            const totalY = resolvedCourseFee || (nextNetFee * cMonths);
            nextYearlyPkg = {
              ...nextYearlyPkg,
              totalYearlyFee: totalY,
              standardMonthlyFee: nextBaseFee,
              packageSubjects: subjectsChanged ? studentSubs : nextYearlyPkg.packageSubjects,
            };
          }
        } else if (subjectsChanged && nextYearlyPkg) {
          nextYearlyPkg = {
            ...nextYearlyPkg,
            packageSubjects: studentSubs,
          };
        }

        if (classOrBranchChanged) {
          changed = true;
        }

        if (changed) {
          updatedStudentCount++;
          const updatedStu: FeeStudent = {
            ...student,
            classId: updatedBatch.classId,
            branchId: updatedBatch.branchId,
            subjects: studentSubs,
            baseFee: nextBaseFee,
            discountAmount: nextDiscount,
            netFee: nextNetFee,
            yearlyPackage: nextYearlyPkg,
            updatedAt: new Date().toISOString(),
          };

          // Keep student's ledger entries in sync for unpaid/partial months or class/branch changes
          dbData.ledger = dbData.ledger.map(led => {
            if (led.studentId !== student.id) return led;
            if (feeChanged && resolvedMonthlyFee > 0 && led.status !== 'PAID') {
              const newNetDue = nextNetFee + (led.carriedForwardDue || 0);
              const newBalance = Math.max(0, newNetDue - (led.paidAmount || 0));
              const newAdvance = Math.max(0, (led.paidAmount || 0) - newNetDue);
              let newStatus: LedgerStatus = 'PENDING';
              if (newBalance === 0 && newAdvance > 0) newStatus = 'ADVANCE';
              else if (newBalance === 0 && (led.paidAmount || 0) > 0) newStatus = 'PAID';
              else if ((led.paidAmount || 0) > 0 && newBalance > 0) newStatus = 'PARTIAL';
              else if (todayStr > led.dueDate && newBalance > 0) newStatus = 'OVERDUE';

              return {
                ...led,
                classId: updatedBatch.classId,
                branchId: updatedBatch.branchId,
                baseAmount: nextBaseFee,
                discountAmount: nextDiscount,
                netDueAmount: newNetDue,
                balanceAmount: newBalance,
                advanceAmount: newAdvance,
                status: newStatus,
                isOverdue: todayStr > led.dueDate && newBalance > 0,
                updatedAt: new Date().toISOString(),
              };
            }
            if (classOrBranchChanged) {
              return {
                ...led,
                classId: updatedBatch.classId,
                branchId: updatedBatch.branchId,
                updatedAt: new Date().toISOString(),
              };
            }
            return led;
          });

          return updatedStu;
        }
        return student;
      });
    }

    saveDatabase(dbData);

    const syncNote = updatedStudentCount > 0
      ? ` Changes automatically synced to ${updatedStudentCount} enrolled student${updatedStudentCount > 1 ? 's' : ''}.`
      : '';

    return {
      success: true,
      message: `Batch "${dbData.batches[idx].name}" updated successfully.${syncNote}`,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update batch.' };
  }
}

export async function deleteFeeBatch(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const studentCount = dbData.students.filter(s => s.batchId === id).length;
    if (studentCount > 0) {
      return {
        success: false,
        message: `Deletion blocked: This batch has ${studentCount} active enrolled student(s). Please reassign them first.`,
      };
    }

    dbData.batches = dbData.batches.filter(b => b.id !== id);
    saveDatabase(dbData);
    return { success: true, message: 'Batch deleted successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete batch.' };
  }
}

// =============================================================
// 3. STUDENT DIRECTORY & PROFILES
// =============================================================

export async function getFeeStudents(filters?: {
  branchId?: string;
  classId?: string;
  batchId?: string;
  status?: StudentStatus;
  search?: string;
  month?: string;
}): Promise<{ success: boolean; data: FeeStudent[] }> {
  try {
    const dbData = loadDatabase();
    let students = [...dbData.students];

    // Filter by admission month and exclusions if month filter is provided
    if (filters?.month) {
      students = students.filter(s => {
        const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
        if (jMonth > filters.month!) return false;
        if (s.excludedMonths?.includes(filters.month!)) return false;
        return true;
      });
    }

    if (filters?.branchId && filters.branchId !== 'all') {
      students = students.filter(s => s.branchId === filters.branchId);
    }
    if (filters?.classId && filters.classId !== 'all') {
      students = students.filter(s => s.classId === filters.classId);
    }
    if (filters?.batchId && filters.batchId !== 'all') {
      students = students.filter(s => s.batchId === filters.batchId);
    }
    if (filters?.status && filters.status !== ('all' as any)) {
      students = students.filter(s => {
        const mStatus = filters?.month ? getStudentStatusForMonth(s, filters.month) : s.status;
        return mStatus === filters.status;
      });
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      students = students.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.fatherName.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.contact1.includes(q) ||
          (s.fatherContact && s.fatherContact.includes(q)) ||
          (s.motherContact && s.motherContact.includes(q)) ||
          (s.contact2 && s.contact2.includes(q))
      );
    }

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

function addMonthsToYYYYMM(baseMonth: string, addCount: number): string {
  const parts = (baseMonth || '2026-11').split('-');
  let y = parseInt(parts[0], 10) || 2026;
  let m = (parseInt(parts[1], 10) || 1) - 1; // 0-indexed
  m += addCount;
  y += Math.floor(m / 12);
  m = ((m % 12) + 12) % 12;
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

function generateStudentRollNumber(joiningDateStr?: string, existingStudents: FeeStudent[] = []): string {
  const now = new Date();
  let day = String(now.getDate()).padStart(2, '0');
  let month = String(now.getMonth() + 1).padStart(2, '0');
  let year = String(now.getFullYear());

  if (joiningDateStr) {
    const clean = joiningDateStr.trim().replace(/\//g, '-');
    const parts = clean.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      } else {
        day = parts[0].padStart(2, '0');
        month = parts[1].padStart(2, '0');
        year = parts[2];
      }
    }
  }

  const datePrefix = `${day}${month}${year}`;
  const prefixMatch = `${datePrefix}-`;
  let maxSeq = 100;

  for (const s of existingStudents) {
    if (s.rollNumber && s.rollNumber.startsWith(prefixMatch)) {
      const rest = s.rollNumber.slice(prefixMatch.length);
      const num = parseInt(rest, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  return `${datePrefix}-${maxSeq + 1}`;
}

export async function createFeeStudent(data: {
  rollNumber?: string;
  name: string;
  fatherName: string;
  fatherOccupation?: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address: string;
  contact1: string;
  fatherContact?: string;
  motherContact?: string;
  contact2?: string;
  branchId: string;
  classId: string;
  batchId: string;
  subjects?: string[];
  joiningDate?: string;
  dueDayOfMonth?: number;
  feeType?: 'monthly' | 'course_onetime' | 'yearly_package';
  paymentCycleMonths?: number;
  baseFee: number;
  scholarshipPercent?: number;
  discountAmount?: number;
  netFee?: number;
  yearlyPackage?: {
    totalYearlyFee: number;
    courseMonths?: number;
    packageSubjects?: string[];
  };
  additionalSubjects?: AdditionalSubject[];
}): Promise<{ success: boolean; message: string; data?: FeeStudent }> {
  try {
    const dbData = loadDatabase();
    const id = `stu-${Date.now()}`;
    const branchCode =
      IDL_BRANCHES.find(b => b.id === data.branchId)?.code.replace('IDL-', '') || 'DL';
    const rollNumber = data.rollNumber?.trim() || generateStudentRollNumber(data.joiningDate, dbData.students);

    const isYearly = data.feeType === 'yearly_package' || Boolean(data.yearlyPackage?.totalYearlyFee);
    let baseFee = Math.max(0, Number(data.baseFee) || 0);
    let scholarshipPercent = Math.min(100, Math.max(0, Number(data.scholarshipPercent) || 0));
    let discountAmount = 0;
    let netFee = 0;

    let courseMonths = 12;
    let totalYearlyFee = 0;

    const joiningDateStr = data.joiningDate || new Date().toISOString().split('T')[0];
    const joiningMonth = joiningDateStr.slice(0, 7);

    // Process & sanitize additional subjects
    const rawAddl = Array.isArray(data.additionalSubjects) ? data.additionalSubjects : [];
    const sanitizedAddl: AdditionalSubject[] = rawAddl
      .filter(s => s && s.name && s.name.trim().length > 0)
      .map((s, idx) => ({
        id: s.id || `addl-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        name: s.name.trim(),
        fee: Math.max(0, Number(s.fee) || 0),
        addedMonth: s.addedMonth || joiningMonth,
        status: (s.status as any) || 'active',
        addedAt: s.addedAt || new Date().toISOString(),
      }));

    const totalAddlFee = sanitizedAddl
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.fee, 0);

    if (isYearly && data.yearlyPackage?.totalYearlyFee) {
      totalYearlyFee = Number(data.yearlyPackage.totalYearlyFee);
      courseMonths = Math.max(1, Number(data.yearlyPackage.courseMonths) || 12);
      const monthlyEquated = Math.round(totalYearlyFee / courseMonths);

      // If standard base fee was provided and is higher than equated monthly fee,
      // calculate difference as scholarship percentage so monthly base shows full standard fee
      if (baseFee > 0 && baseFee > monthlyEquated) {
        scholarshipPercent = Math.round(((baseFee - monthlyEquated) / baseFee) * 100);
        discountAmount = baseFee - monthlyEquated;
        netFee = monthlyEquated + totalAddlFee;
      } else {
        baseFee = monthlyEquated;
        scholarshipPercent = 0;
        discountAmount = 0;
        netFee = monthlyEquated + totalAddlFee;
      }
      totalYearlyFee += (totalAddlFee * courseMonths);
    } else {
      if (data.discountAmount !== undefined && Number(data.discountAmount) > 0) {
        discountAmount = Math.min(baseFee, Math.max(0, Number(data.discountAmount)));
        scholarshipPercent = baseFee > 0 ? Number(((discountAmount / baseFee) * 100).toFixed(1)) : 0;
        netFee = Math.max(0, baseFee - discountAmount) + totalAddlFee;
      } else {
        discountAmount = Math.round((baseFee * scholarshipPercent) / 100);
        netFee = Math.max(0, baseFee - discountAmount) + totalAddlFee;
      }
    }

    const newStudent: FeeStudent = {
      id,
      rollNumber,
      name: data.name.trim(),
      fatherName: data.fatherName.trim(),
      fatherOccupation: data.fatherOccupation?.trim() || '',
      dob: data.dob,
      gender: data.gender || 'male',
      bloodGroup: data.bloodGroup || '',
      address: data.address?.trim() || '',
      contact1: data.contact1.trim(),
      fatherContact: data.fatherContact?.trim() || '',
      motherContact: data.motherContact?.trim() || data.contact2?.trim() || '',
      contact2: data.contact2?.trim() || data.motherContact?.trim() || '',
      branchId: data.branchId,
      classId: data.classId,
      batchId: data.batchId,
      subjects: data.subjects || [],
      additionalSubjects: sanitizedAddl,
      additionalFee: totalAddlFee,
      joiningDate: joiningDateStr,
      dueDayOfMonth: isYearly ? (parseInt((joiningDateStr || '2026-11-01').split('-')[2], 10) || 1) : (data.dueDayOfMonth || 5),
      dueDate: isYearly ? `${joiningMonth}-${String(parseInt((joiningDateStr || '2026-11-01').split('-')[2], 10) || 1).padStart(2, '0')}` : `${joiningMonth}-${String(data.dueDayOfMonth || 5).padStart(2, '0')}`,
      feeType: isYearly ? 'yearly_package' : (data.feeType || 'monthly'),
      paymentCycleMonths: isYearly ? courseMonths : (data.paymentCycleMonths || 1),
      baseFee,
      scholarshipPercent,
      discountAmount,
      netFee,
      yearlyPackage: isYearly
        ? {
            totalYearlyFee: totalYearlyFee || (netFee * courseMonths),
            courseMonths,
            standardMonthlyFee: baseFee,
            monthlyEquatedFee: netFee,
            packageSubjects: data.yearlyPackage?.packageSubjects || data.subjects || [],
            isFullPaid: true,
          }
        : undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    dbData.students.unshift(newStudent);

    const studentJoiningMonth = (newStudent.joiningDate || '2026-11-01').slice(0, 7);
    const dayStr = String(newStudent.dueDayOfMonth).padStart(2, '0');

    if (isYearly) {
      // Auto-create ledger entries for all course months and mark them as PAID
      for (let i = 0; i < courseMonths; i++) {
        const curMonth = addMonthsToYYYYMM(studentJoiningMonth, i);
        const curMonthLabel = await getMonthLabel(curMonth);
        const curDueDate = `${curMonth}-${dayStr}`;

        const entry: FeeLedgerEntry = {
          id: `led-${newStudent.id}-${curMonth}`,
          studentId: newStudent.id,
          branchId: newStudent.branchId,
          classId: newStudent.classId,
          batchId: newStudent.batchId,
          month: curMonth,
          monthLabel: curMonthLabel,
          baseAmount: newStudent.baseFee,
          discountAmount: newStudent.discountAmount,
          netDueAmount: newStudent.netFee,
          carriedForwardDue: 0,
          paidAmount: newStudent.netFee, // Fully paid for each month
          balanceAmount: 0,              // 0 balance
          advanceAmount: 0,
          dueDate: curDueDate,
          lastPaymentDate: newStudent.joiningDate || joiningDateStr,
          status: 'PAID',               // Marked as PAID!
          isOverdue: false,
          updatedAt: new Date().toISOString(),
        };
        dbData.ledger.unshift(entry);
      }

      // Record upfront payment receipt
      const receiptNo = `REC-${joiningMonth.replace('-', '')}-${String(dbData.payments.length + 1).padStart(4, '0')}`;
      const newPayment: FeePayment = {
        id: `pay-yr-${newStudent.id}-${Date.now()}`,
        receiptNumber: receiptNo,
        studentId: newStudent.id,
        studentName: newStudent.name,
        rollNumber: newStudent.rollNumber,
        branchId: newStudent.branchId,
        classId: newStudent.classId,
        batchId: newStudent.batchId,
        month: joiningMonth,
        monthLabel: `${await getMonthLabel(joiningMonth)} (Yearly Package)`,
        amount: totalYearlyFee || (newStudent.netFee * courseMonths),
        paymentMode: 'cash',
        paymentDate: newStudent.joiningDate || new Date().toISOString().split('T')[0],
        transactionRef: 'YEARLY-PACKAGE-LUMPSUM',
        remarks: `Upfront Yearly Package (${courseMonths} Months). Equal Monthly: ₹${newStudent.netFee}/mo with ${newStudent.scholarshipPercent}% Scholarship.`,
        collectedBy: 'Admin Desk',
        createdAt: new Date().toISOString(),
      };
      dbData.payments.unshift(newPayment);
    } else {
      // Auto-create ledger entry for student's admission month (joiningMonth)
      const monthLabel = await getMonthLabel(joiningMonth);
      const dueDate = `${joiningMonth}-${dayStr}`;
      const todayStr = new Date().toISOString().split('T')[0];

      const newLedgerEntry: FeeLedgerEntry = {
        id: `led-${newStudent.id}-${joiningMonth}`,
        studentId: newStudent.id,
        branchId: newStudent.branchId,
        classId: newStudent.classId,
        batchId: newStudent.batchId,
        month: joiningMonth,
        monthLabel,
        baseAmount: newStudent.baseFee,
        discountAmount: newStudent.discountAmount,
        netDueAmount: newStudent.netFee,
        carriedForwardDue: 0,
        paidAmount: 0,
        balanceAmount: newStudent.netFee,
        advanceAmount: 0,
        dueDate,
        status: todayStr > dueDate && newStudent.netFee > 0 ? 'OVERDUE' : 'PENDING',
        isOverdue: todayStr > dueDate && newStudent.netFee > 0,
        updatedAt: new Date().toISOString(),
      };

      dbData.ledger.unshift(newLedgerEntry);
    }

    saveDatabase(dbData);

    return {
      success: true,
      message: `Student "${newStudent.name}" enrolled successfully with Roll No: ${newStudent.rollNumber}.${isYearly ? ` Yearly package of ${courseMonths} months auto-set to PAID with ${newStudent.scholarshipPercent}% scholarship applied.` : ''}`,
      data: newStudent,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create student.' };
  }
}

export async function updateFeeStudent(
  id: string,
  data: Partial<FeeStudent>
): Promise<{ success: boolean; message: string; data?: FeeStudent }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.students.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, message: 'Student not found.' };

    const current = dbData.students[idx];
    const baseFee = data.baseFee !== undefined ? Math.max(0, Number(data.baseFee)) : current.baseFee;
    let scholarshipPercent =
      data.scholarshipPercent !== undefined
        ? Math.min(100, Math.max(0, Number(data.scholarshipPercent)))
        : current.scholarshipPercent;
    let discountAmount =
      data.discountAmount !== undefined
        ? Math.min(baseFee, Math.max(0, Number(data.discountAmount)))
        : Math.round((baseFee * scholarshipPercent) / 100);

    if (data.discountAmount !== undefined && data.scholarshipPercent === undefined) {
      scholarshipPercent = baseFee > 0 ? Number(((discountAmount / baseFee) * 100).toFixed(1)) : 0;
    } else if (data.scholarshipPercent !== undefined && data.discountAmount === undefined) {
      discountAmount = Math.round((baseFee * scholarshipPercent) / 100);
    }

    const additionalSubjects = data.additionalSubjects !== undefined ? data.additionalSubjects : (current.additionalSubjects || []);
    const totalAddlFee = additionalSubjects
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
    const netFee = Math.max(0, baseFee - discountAmount) + totalAddlFee;

    const updatedStudent: FeeStudent = {
      ...current,
      ...data,
      baseFee,
      scholarshipPercent,
      discountAmount,
      additionalSubjects,
      additionalFee: totalAddlFee,
      netFee,
      updatedAt: new Date().toISOString(),
    };

    dbData.students[idx] = updatedStudent;

    // Prune any legacy ledger entries prior to new admission month if admission date was changed
    if (data.joiningDate) {
      const newJoiningMonth = data.joiningDate.slice(0, 7);
      dbData.ledger = dbData.ledger.filter(l => !(l.studentId === id && l.month < newJoiningMonth));
    }

    // Keep active monthly ledgers in sync
    const currentMonth = await getCurrentMonth();
    const ledgerIdx = dbData.ledger.findIndex(l => l.studentId === id && l.month === currentMonth);
    if (ledgerIdx !== -1) {
      const led = dbData.ledger[ledgerIdx];
      const newNetDue = netFee + led.carriedForwardDue;
      const newBalance = Math.max(0, newNetDue - led.paidAmount);
      const newAdvance = Math.max(0, led.paidAmount - newNetDue);
      const dayStr = String(data.dueDayOfMonth || updatedStudent.dueDayOfMonth || 5).padStart(2, '0');
      const todayStr = new Date().toISOString().split('T')[0];
      const newDueDate = `${currentMonth}-${dayStr}`;

      let newStatus: LedgerStatus = 'PENDING';
      if (newBalance === 0 && newAdvance > 0) newStatus = 'ADVANCE';
      else if (newBalance === 0 && led.paidAmount > 0) newStatus = 'PAID';
      else if (led.paidAmount > 0 && newBalance > 0) newStatus = 'PARTIAL';
      else if (todayStr > newDueDate && newBalance > 0) newStatus = 'OVERDUE';

      dbData.ledger[ledgerIdx] = {
        ...led,
        branchId: updatedStudent.branchId,
        classId: updatedStudent.classId,
        batchId: updatedStudent.batchId,
        baseAmount: baseFee,
        discountAmount,
        netDueAmount: newNetDue,
        balanceAmount: newBalance,
        advanceAmount: newAdvance,
        dueDate: newDueDate,
        status: newStatus,
        isOverdue: todayStr > newDueDate && newBalance > 0,
        updatedAt: new Date().toISOString(),
      };
    }

    // If updated to yearly package, ensure course months are created and marked PAID
    if (data.feeType === 'yearly_package' || data.yearlyPackage || updatedStudent.feeType === 'yearly_package' || Boolean(updatedStudent.yearlyPackage)) {
      const courseMonths = Math.max(1, Number(data.yearlyPackage?.courseMonths || updatedStudent.yearlyPackage?.courseMonths) || 12);
      const startMonth = (updatedStudent.joiningDate || current.joiningDate || '2026-11-01').slice(0, 7);
      const joinDay = parseInt((updatedStudent.joiningDate || current.joiningDate || '2026-11-01').split('-')[2], 10) || 1;
      updatedStudent.dueDayOfMonth = joinDay;
      const dayStr = String(joinDay).padStart(2, '0');
      updatedStudent.dueDate = `${startMonth}-${dayStr}`;

      for (let i = 0; i < courseMonths; i++) {
        const curM = addMonthsToYYYYMM(startMonth, i);
        const curLabel = await getMonthLabel(curM);
        const ledItem = dbData.ledger.find(l => l.studentId === id && l.month === curM);
        if (!ledItem) {
          dbData.ledger.unshift({
            id: `led-${id}-${curM}`,
            studentId: id,
            branchId: updatedStudent.branchId,
            classId: updatedStudent.classId,
            batchId: updatedStudent.batchId,
            month: curM,
            monthLabel: curLabel,
            baseAmount: updatedStudent.baseFee,
            discountAmount: updatedStudent.discountAmount,
            netDueAmount: updatedStudent.netFee,
            carriedForwardDue: 0,
            paidAmount: updatedStudent.netFee,
            balanceAmount: 0,
            advanceAmount: 0,
            dueDate: `${curM}-${dayStr}`,
            lastPaymentDate: updatedStudent.joiningDate || current.joiningDate || '2026-11-01',
            status: 'PAID',
            isOverdue: false,
            updatedAt: new Date().toISOString(),
          });
        } else {
          ledItem.baseAmount = updatedStudent.baseFee;
          ledItem.discountAmount = updatedStudent.discountAmount;
          ledItem.netDueAmount = updatedStudent.netFee;
          ledItem.paidAmount = updatedStudent.netFee;
          ledItem.balanceAmount = 0;
          ledItem.dueDate = `${curM}-${dayStr}`;
          ledItem.lastPaymentDate = updatedStudent.joiningDate || current.joiningDate || '2026-11-01';
          ledItem.status = 'PAID';
          ledItem.isOverdue = false;
          ledItem.updatedAt = new Date().toISOString();
        }
      }

      // Ensure a yearly package master receipt exists so Print/Share receipts work immediately
      const hasYearlyPayment = dbData.payments.some(
        p =>
          p.studentId === id &&
          (p.transactionRef === 'YEARLY-PACKAGE-LUMPSUM' || (p.monthLabel || '').includes('Yearly Package'))
      );
      if (!hasYearlyPayment) {
        const totalYFee =
          Number(data.yearlyPackage?.totalYearlyFee || updatedStudent.yearlyPackage?.totalYearlyFee) ||
          updatedStudent.netFee * courseMonths;
        const receiptNo = `REC-${startMonth.replace('-', '')}-${String(dbData.payments.length + 1).padStart(4, '0')}`;
        const payDate = updatedStudent.joiningDate || current.joiningDate || new Date().toISOString().split('T')[0];
        dbData.payments.unshift({
          id: `pay-yr-${id}-${Date.now()}`,
          receiptNumber: receiptNo,
          studentId: id,
          studentName: updatedStudent.name,
          rollNumber: updatedStudent.rollNumber,
          branchId: updatedStudent.branchId,
          classId: updatedStudent.classId,
          batchId: updatedStudent.batchId,
          month: startMonth,
          monthLabel: `${await getMonthLabel(startMonth)} (Yearly Package)`,
          amount: totalYFee,
          paymentMode: 'cash',
          paymentDate: payDate,
          transactionRef: 'YEARLY-PACKAGE-LUMPSUM',
          remarks: `Yearly Package (${courseMonths} Months). Equal Monthly: ₹${updatedStudent.netFee}/mo with ${updatedStudent.scholarshipPercent}% Scholarship.`,
          collectedBy: 'Admin Desk',
          createdAt: new Date().toISOString(),
        });
      }
    }

    saveDatabase(dbData);
    return { success: true, message: 'Student details updated successfully.', data: updatedStudent };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update student.' };
  }
}

/**
 * Adds an optional additional subject to an existing student with monthly fee & effective month tracking.
 */
export async function addStudentAdditionalSubject(data: {
  studentId: string;
  name: string;
  fee: number;
  effectiveMonth?: string;
}): Promise<{ success: boolean; message: string; data?: FeeStudent }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.students.findIndex(s => s.id === data.studentId);
    if (idx === -1) return { success: false, message: 'Student not found.' };

    const student = dbData.students[idx];
    const currentMonth = await getCurrentMonth();
    const effectiveMonth = data.effectiveMonth || currentMonth;

    const newSub: AdditionalSubject = {
      id: `addl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      fee: Math.max(0, Number(data.fee) || 0),
      addedMonth: effectiveMonth,
      status: 'active',
      addedAt: new Date().toISOString(),
    };

    const currentAddl = student.additionalSubjects || [];
    const updatedAddl = [...currentAddl, newSub];
    const totalAddlFee = updatedAddl
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (Number(s.fee) || 0), 0);

    const netFee = Math.max(0, student.baseFee - student.discountAmount) + totalAddlFee;

    const updatedStudent: FeeStudent = {
      ...student,
      additionalSubjects: updatedAddl,
      additionalFee: totalAddlFee,
      netFee,
      updatedAt: new Date().toISOString(),
    };

    dbData.students[idx] = updatedStudent;

    // Update active ledger entry for current month if exists and unpaid
    const ledIdx = dbData.ledger.findIndex(l => l.studentId === data.studentId && l.month === currentMonth);
    if (ledIdx !== -1 && dbData.ledger[ledIdx].paidAmount === 0 && dbData.ledger[ledIdx].status !== 'PAID') {
      const led = dbData.ledger[ledIdx];
      const newDue = netFee + led.carriedForwardDue;
      dbData.ledger[ledIdx] = {
        ...led,
        baseAmount: student.baseFee + totalAddlFee,
        netDueAmount: newDue,
        balanceAmount: Math.max(0, newDue - led.paidAmount),
        updatedAt: new Date().toISOString(),
      };
    }

    saveDatabase(dbData);
    return { success: true, message: `Added ${newSub.name} (+₹${newSub.fee}/mo) successfully.`, data: updatedStudent };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to add additional subject.' };
  }
}

/**
 * Removes an optional additional subject from a student starting from a specified month.
 * Preserves history so past months continue to reflect the subject fee.
 */
export async function removeStudentAdditionalSubject(data: {
  studentId: string;
  subjectId: string;
  effectiveMonth?: string;
}): Promise<{ success: boolean; message: string; data?: FeeStudent }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.students.findIndex(s => s.id === data.studentId);
    if (idx === -1) return { success: false, message: 'Student not found.' };

    const student = dbData.students[idx];
    const currentMonth = await getCurrentMonth();
    const effectiveMonth = data.effectiveMonth || currentMonth;

    const currentAddl = student.additionalSubjects || [];
    const subIdx = currentAddl.findIndex(s => s.id === data.subjectId);
    if (subIdx === -1) return { success: false, message: 'Additional subject not found.' };

    const sub = currentAddl[subIdx];
    // If it was added in the same effective month or never finalized, we can mark removed from effectiveMonth
    const updatedSub: AdditionalSubject = {
      ...sub,
      removedMonth: effectiveMonth,
      status: 'removed',
      removedAt: new Date().toISOString(),
    };

    const updatedAddl = [...currentAddl];
    updatedAddl[subIdx] = updatedSub;

    // Recalculate currently active additional fee (active in currentMonth)
    const activeSubjects = getActiveAdditionalSubjectsForMonth(
      { ...student, additionalSubjects: updatedAddl },
      currentMonth
    );
    const totalAddlFee = activeSubjects.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
    const netFee = Math.max(0, student.baseFee - student.discountAmount) + totalAddlFee;

    const updatedStudent: FeeStudent = {
      ...student,
      additionalSubjects: updatedAddl,
      additionalFee: totalAddlFee,
      netFee,
      updatedAt: new Date().toISOString(),
    };

    dbData.students[idx] = updatedStudent;

    // Update active ledger entry for current month if exists and unpaid
    const ledIdx = dbData.ledger.findIndex(l => l.studentId === data.studentId && l.month === currentMonth);
    if (ledIdx !== -1 && dbData.ledger[ledIdx].paidAmount === 0 && dbData.ledger[ledIdx].status !== 'PAID') {
      const led = dbData.ledger[ledIdx];
      const newDue = netFee + led.carriedForwardDue;
      dbData.ledger[ledIdx] = {
        ...led,
        baseAmount: student.baseFee + totalAddlFee,
        netDueAmount: newDue,
        balanceAmount: Math.max(0, newDue - led.paidAmount),
        updatedAt: new Date().toISOString(),
      };
    }

    saveDatabase(dbData);
    return {
      success: true,
      message: `Removed ${sub.name} starting from ${await getMonthLabel(effectiveMonth)}. History preserved.`,
      data: updatedStudent,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to remove additional subject.' };
  }
}

/**
 * Transfers a student to a different batch or different branch/class/batch.
 * Records the transfer in student's transfer history and preserves historical ledger integrity.
 */
export async function transferFeeStudent(data: {
  studentId: string;
  targetBranchId: string;
  targetClassId: string;
  targetBatchId: string;
  effectiveMonth?: string;
  retainCurrentFee?: boolean;
  newBaseFee?: number;
  newDiscountAmount?: number;
  newScholarshipPercent?: number;
  reason?: string;
}): Promise<{ success: boolean; message: string; data?: FeeStudent }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.students.findIndex(s => s.id === data.studentId);
    if (idx === -1) return { success: false, message: 'Student not found.' };

    const student = dbData.students[idx];
    const targetBatch = dbData.batches.find(b => b.id === data.targetBatchId);
    if (!targetBatch) return { success: false, message: 'Destination batch not found.' };

    const fromBranch = student.branchId;
    const fromClass = student.classId;
    const fromBatch = student.batchId;

    const currentMonth = await getCurrentMonth();
    const effMonth = data.effectiveMonth || currentMonth;

    // Determine fee
    let baseFee = student.baseFee;
    let scholarshipPercent = student.scholarshipPercent || 0;
    let discountAmount = student.discountAmount || 0;

    if (!data.retainCurrentFee && data.newBaseFee !== undefined) {
      baseFee = Math.max(0, Number(data.newBaseFee));
      if (data.newDiscountAmount !== undefined) {
        discountAmount = Math.max(0, Number(data.newDiscountAmount));
        scholarshipPercent = data.newScholarshipPercent !== undefined
          ? Number(data.newScholarshipPercent)
          : (baseFee > 0 ? Number(((discountAmount / baseFee) * 100).toFixed(1)) : 0);
      } else {
        discountAmount = Math.round((baseFee * scholarshipPercent) / 100);
      }
    } else if (!data.retainCurrentFee && targetBatch.monthlyFee > 0) {
      baseFee = targetBatch.monthlyFee;
      if (data.newDiscountAmount !== undefined) {
        discountAmount = Math.max(0, Number(data.newDiscountAmount));
        scholarshipPercent = data.newScholarshipPercent !== undefined
          ? Number(data.newScholarshipPercent)
          : (baseFee > 0 ? Number(((discountAmount / baseFee) * 100).toFixed(1)) : 0);
      } else {
        discountAmount = Math.round((baseFee * scholarshipPercent) / 100);
      }
    }

    const totalAddlFee = (student.additionalSubjects || [])
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (Number(s.fee) || 0), 0);

    const netFee = Math.max(0, baseFee - discountAmount) + totalAddlFee;

    // Subjects: adopt target batch subjects if available, else keep current
    const newSubjects = targetBatch.subjects && targetBatch.subjects.length > 0
      ? targetBatch.subjects
      : student.subjects;

    const transferRecord: StudentTransferRecord = {
      id: `tr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fromBranchId: fromBranch,
      toBranchId: data.targetBranchId,
      fromClassId: fromClass,
      toClassId: data.targetClassId,
      fromBatchId: fromBatch,
      toBatchId: data.targetBatchId,
      transferDate: new Date().toISOString().split('T')[0],
      transferMonth: effMonth,
      reason: data.reason || 'Batch / Branch Transfer',
      previousNetFee: student.netFee,
      newNetFee: netFee,
      transferredAt: new Date().toISOString(),
    };

    const updatedStudent: FeeStudent = {
      ...student,
      branchId: data.targetBranchId,
      classId: data.targetClassId,
      batchId: data.targetBatchId,
      subjects: newSubjects,
      baseFee,
      scholarshipPercent,
      discountAmount,
      netFee,
      transferHistory: [...(student.transferHistory || []), transferRecord],
      updatedAt: new Date().toISOString(),
    };

    dbData.students[idx] = updatedStudent;

    // Update ledger entries for effectiveMonth and future months
    for (const led of dbData.ledger) {
      if (led.studentId === student.id && led.month >= effMonth) {
        led.branchId = data.targetBranchId;
        led.classId = data.targetClassId;
        led.batchId = data.targetBatchId;

        // If unpaid / pending, update amounts
        if (led.status === 'PENDING' || led.status === 'OVERDUE') {
          led.baseAmount = baseFee;
          led.discountAmount = discountAmount;
          const newNetDue = netFee + led.carriedForwardDue;
          led.netDueAmount = newNetDue;
          led.balanceAmount = Math.max(0, newNetDue - led.paidAmount);
        }
        led.updatedAt = new Date().toISOString();
      }
    }

    // Recalculate batch and class student counts
    dbData.batches.forEach(b => {
      b.studentCount = dbData.students.filter(s => s.batchId === b.id && s.status === 'active').length;
    });
    dbData.classes.forEach(c => {
      c.batchCount = dbData.batches.filter(b => b.classId === c.id).length;
      c.studentCount = dbData.students.filter(s => s.classId === c.id && s.status === 'active').length;
    });

    saveDatabase(dbData);

    return {
      success: true,
      message: `Student successfully transferred to ${targetBatch.name}.`,
      data: updatedStudent,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to transfer student.' };
  }
}

export async function collectYearlyPackagePayment(data: {
  studentId: string;
  totalYearlyFee: number;
  courseMonths?: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  remarks?: string;
  paymentDate?: string;
  collectedBy?: string;
}): Promise<{
  success: boolean;
  message: string;
  receipt?: FeePayment;
}> {
  try {
    const dbData = loadDatabase();
    const student = dbData.students.find(s => s.id === data.studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const totalFee = Number(data.totalYearlyFee);
    if (totalFee <= 0) return { success: false, message: 'Total yearly fee must be greater than zero.' };

    const courseMonths = Math.max(1, Number(data.courseMonths) || 12);
    const monthlyEquated = Math.round(totalFee / courseMonths);
    const standardBase = student.baseFee > 0 ? student.baseFee : monthlyEquated;

    let scholarshipPercent = 0;
    let discountAmount = 0;
    if (standardBase > monthlyEquated) {
      scholarshipPercent = Math.round(((standardBase - monthlyEquated) / standardBase) * 100);
      discountAmount = standardBase - monthlyEquated;
    }

    // Update student to yearly package
    student.feeType = 'yearly_package';
    student.baseFee = standardBase;
    student.scholarshipPercent = scholarshipPercent;
    student.discountAmount = discountAmount;
    student.netFee = monthlyEquated;
    student.paymentCycleMonths = courseMonths;
    student.yearlyPackage = {
      totalYearlyFee: totalFee,
      courseMonths,
      standardMonthlyFee: standardBase,
      monthlyEquatedFee: monthlyEquated,
      packageSubjects: student.subjects,
      isFullPaid: true,
    };
    student.updatedAt = new Date().toISOString();

    const joinDateStr = student.joiningDate || new Date().toISOString().split('T')[0];
    const startMonth = joinDateStr.slice(0, 7);
    const joinDay = parseInt(joinDateStr.split('-')[2], 10) || 1;
    student.dueDayOfMonth = joinDay;
    student.dueDate = `${startMonth}-${String(joinDay).padStart(2, '0')}`;
    const dayStr = String(joinDay).padStart(2, '0');

    // Create / update all course months to PAID
    for (let i = 0; i < courseMonths; i++) {
      const curM = addMonthsToYYYYMM(startMonth, i);
      const curLabel = await getMonthLabel(curM);
      let led = dbData.ledger.find(l => l.studentId === student.id && l.month === curM);
      if (!led) {
        led = {
          id: `led-${student.id}-${curM}`,
          studentId: student.id,
          branchId: student.branchId,
          classId: student.classId,
          batchId: student.batchId,
          month: curM,
          monthLabel: curLabel,
          baseAmount: standardBase,
          discountAmount,
          netDueAmount: monthlyEquated,
          carriedForwardDue: 0,
          paidAmount: monthlyEquated,
          balanceAmount: 0,
          advanceAmount: 0,
          dueDate: `${curM}-${dayStr}`,
          lastPaymentDate: joinDateStr,
          status: 'PAID',
          isOverdue: false,
          updatedAt: new Date().toISOString(),
        };
        dbData.ledger.unshift(led);
      } else {
        led.baseAmount = standardBase;
        led.discountAmount = discountAmount;
        led.netDueAmount = monthlyEquated;
        led.paidAmount = monthlyEquated;
        led.balanceAmount = 0;
        led.advanceAmount = 0;
        led.dueDate = `${curM}-${dayStr}`;
        led.lastPaymentDate = joinDateStr;
        led.status = 'PAID';
        led.isOverdue = false;
        led.updatedAt = new Date().toISOString();
      }
    }

    // Record Master Receipt
    const receiptNo = `REC-${startMonth.replace('-', '')}-${String(dbData.payments.length + 1).padStart(4, '0')}`;
    const pDate = data.paymentDate || joinDateStr;
    const newPayment: FeePayment = {
      id: `pay-yr-${student.id}-${Date.now()}`,
      receiptNumber: receiptNo,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      branchId: student.branchId,
      classId: student.classId,
      batchId: student.batchId,
      month: startMonth,
      monthLabel: `${await getMonthLabel(startMonth)} (Yearly Package)`,
      amount: totalFee,
      paymentMode: data.paymentMode || 'cash',
      paymentDate: pDate,
      transactionRef: data.transactionRef || 'YEARLY-PACKAGE-LUMPSUM',
      remarks: data.remarks || `Yearly Package for ${courseMonths} Months. Equated: ₹${monthlyEquated}/mo with ${scholarshipPercent}% Scholarship.`,
      collectedBy: data.collectedBy || 'Admin Desk',
      createdAt: `${pDate}T12:00:00.000Z`,
    };
    dbData.payments.unshift(newPayment);

    saveDatabase(dbData);
    return {
      success: true,
      message: `Yearly package of ₹${totalFee.toLocaleString('en-IN')} recorded successfully. All ${courseMonths} months set to PAID with ${scholarshipPercent}% Scholarship applied.`,
      receipt: newPayment,
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to collect yearly package.' };
  }
}

export async function toggleStudentStatus(
  id: string,
  newStatus: StudentStatus,
  options?: {
    month?: string;
    mode?: 'month_onwards' | 'all_months';
    note?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.students.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, message: 'Student not found.' };

    const student = dbData.students[idx];
    const now = new Date().toISOString();
    const mode = options?.mode || 'month_onwards';
    const currentM = await getCurrentMonth();
    const targetMonth = options?.month || currentM;
    const monthLabel = await getMonthLabel(targetMonth);

    if (!student.statusHistory) {
      student.statusHistory = [];
    }

    if (mode === 'all_months') {
      // Permanently apply to all months
      student.status = newStatus;
      student.statusHistory = [
        {
          month: '2026-04',
          status: newStatus,
          updatedAt: now,
          note: options?.note || (newStatus === 'disabled' ? 'Permanently disabled for all months' : 'Activated for all months'),
        },
      ];
      if (newStatus === 'disabled') {
        student.disabledAt = now;
        student.statusNotes = options?.note || 'Student permanently disabled across all months. Fee cycles paused.';
        // Remove unpaid ledger entries across all months so fee is not counted
        dbData.ledger = dbData.ledger.filter(l => !(l.studentId === id && l.paidAmount === 0));
      } else {
        student.enabledAt = now;
        student.statusNotes = options?.note || 'Student activated across all months.';
      }
    } else {
      // Apply starting from targetMonth onwards (persists into future months until manually enabled)
      const exIdx = student.statusHistory.findIndex(e => e.month === targetMonth);
      if (exIdx !== -1) {
        student.statusHistory[exIdx] = {
          month: targetMonth,
          status: newStatus,
          updatedAt: now,
          note: options?.note,
        };
      } else {
        student.statusHistory.push({
          month: targetMonth,
          status: newStatus,
          updatedAt: now,
          note: options?.note,
        });
      }
      // Keep sorted chronologically by month
      student.statusHistory.sort((a, b) => a.month.localeCompare(b.month));

      if (newStatus === 'disabled') {
        student.disabledAt = now;
        student.statusNotes = options?.note || `Paused from ${monthLabel} onwards.`;
        // Remove unpaid ledger entry for targetMonth so fee is not counted
        const lIdx = dbData.ledger.findIndex(l => l.studentId === id && l.month === targetMonth);
        if (lIdx !== -1 && dbData.ledger[lIdx].paidAmount === 0) {
          dbData.ledger.splice(lIdx, 1);
        }
      } else {
        student.enabledAt = now;
        student.statusNotes = options?.note || `Re-activated from ${monthLabel} onwards.`;
      }

      // Fallback status is latest in history
      const latest = student.statusHistory[student.statusHistory.length - 1];
      student.status = latest ? latest.status : newStatus;
    }

    student.updatedAt = now;
    saveDatabase(dbData);

    const actionWord = newStatus === 'disabled' ? 'PAUSED' : 'ACTIVATED';
    const scopeWord = mode === 'all_months' ? 'sabhi mahino ke liye' : `${monthLabel} se aage ke liye`;

    return {
      success: true,
      message: `Student "${student.name}" ko ${scopeWord} ${actionWord} kar diya gaya hai.`,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update student status.' };
  }
}

// Option 1: Delete / Remove student for a specific month only (keeping other months & student profile intact)
export async function deleteStudentFromMonth(
  studentId: string,
  month: string
): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const student = dbData.students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const monthLabel = await getMonthLabel(month);

    if (!student.excludedMonths) {
      student.excludedMonths = [];
    }
    if (!student.excludedMonths.includes(month)) {
      student.excludedMonths.push(month);
    }
    student.updatedAt = new Date().toISOString();

    // Remove ledger entry for this student in this specific month
    dbData.ledger = dbData.ledger.filter(
      l => !(l.studentId === studentId && l.month === month)
    );

    // Remove any payments recorded for this student in this specific month
    dbData.payments = dbData.payments.filter(
      p => !(p.studentId === studentId && p.month === month)
    );

    saveDatabase(dbData);

    return {
      success: true,
      message: `Student "${student.name}" ko ${monthLabel} ke fee record se safalta-poorvak hata diya gaya hai. Pichle mahino ka record aur student profile safe hai.`,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to remove student from month.' };
  }
}

// Restore a student previously removed from a specific month
export async function restoreStudentToMonth(
  studentId: string,
  month: string
): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const student = dbData.students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Student not found.' };

    const monthLabel = await getMonthLabel(month);

    if (student.excludedMonths) {
      student.excludedMonths = student.excludedMonths.filter(m => m !== month);
    }
    student.updatedAt = new Date().toISOString();
    saveDatabase(dbData);

    // Reconstruct monthly ledger for this month
    await getMonthlyLedger(month);

    return {
      success: true,
      message: `Student "${student.name}" ko ${monthLabel} me wapas restore kar diya gaya hai.`,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to restore student.' };
  }
}

// Option 2: Delete student completely from ALL months (permanently remove student, ledgers & receipts)
export async function deleteFeeStudent(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const dbData = loadDatabase();
    const idx = dbData.students.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, message: 'Student not found.' };

    const student = dbData.students[idx];
    dbData.students = dbData.students.filter(s => s.id !== id);
    dbData.ledger = dbData.ledger.filter(l => l.studentId !== id);
    dbData.payments = dbData.payments.filter(p => p.studentId !== id);
    saveDatabase(dbData);

    return {
      success: true,
      message: `Student "${student.name}" (${student.rollNumber}) ko sabhi mahino aur database se permanently delete kar diya gaya hai.`,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete student.' };
  }
}

// =============================================================
// 4. MONTHLY LEDGER & CARRY FORWARD ENGINE
// =============================================================

export async function getMonthlyLedger(
  month: string,
  filters?: {
    branchId?: string;
    classId?: string;
    batchId?: string;
    status?: LedgerStatus;
  }
): Promise<{ success: boolean; data: (FeeLedgerEntry & { student: FeeStudent })[] }> {
  try {
    const dbData = loadDatabase();
    const currentMonth = await getCurrentMonth();
    // Clamp to current month so future months cannot be accessed
    const effectiveMonth = month > currentMonth ? currentMonth : month;
    const monthLabel = await getMonthLabel(effectiveMonth);
    const todayStr = new Date().toISOString().split('T')[0];

    let modified = false;

    // Process all students whose admission date is on or before effectiveMonth
    for (const student of dbData.students) {
      const joiningMonth = (student.joiningDate || '2026-11-01').slice(0, 7);
      // Student was NOT admitted yet in this month -> skip
      if (joiningMonth > effectiveMonth) {
        continue;
      }

      // If student is disabled in effectiveMonth, remove unpaid ledger entry & skip fee billing
      const statusThisMonth = getStudentStatusForMonth(student, effectiveMonth);
      if (statusThisMonth === 'disabled') {
        const exIdx = dbData.ledger.findIndex(l => l.studentId === student.id && l.month === effectiveMonth);
        if (exIdx !== -1 && dbData.ledger[exIdx].paidAmount === 0) {
          dbData.ledger.splice(exIdx, 1);
          modified = true;
        }
        continue;
      }

      // Process sequence from admission month to effectiveMonth to compute accurate carry-forward
      const monthSeq = getMonthSequence(joiningMonth, effectiveMonth);

      for (const curM of monthSeq) {
        // If student was disabled in curM, skip fee billing for that month
        const curMStatus = getStudentStatusForMonth(student, curM);
        if (curMStatus === 'disabled') {
          const exIdx = dbData.ledger.findIndex(l => l.studentId === student.id && l.month === curM);
          if (exIdx !== -1 && dbData.ledger[exIdx].paidAmount === 0) {
            dbData.ledger.splice(exIdx, 1);
            modified = true;
          }
          continue;
        }

        // If student was deleted / excluded from this specific month, skip ledger creation and remove if exists
        if (student.excludedMonths?.includes(curM)) {
          const exIdx = dbData.ledger.findIndex(l => l.studentId === student.id && l.month === curM);
          if (exIdx !== -1) {
            dbData.ledger.splice(exIdx, 1);
            modified = true;
          }
          continue;
        }

        let entry = dbData.ledger.find(l => l.studentId === student.id && l.month === curM);
        const prevM = getPreviousMonth(curM);
        let carriedForward = 0;
        let advanceFromPrev = 0;

        if (prevM >= joiningMonth) {
          const prevEntry = dbData.ledger.find(l => l.studentId === student.id && l.month === prevM);
          if (prevEntry) {
            carriedForward = Math.max(0, prevEntry.balanceAmount);
            advanceFromPrev = Math.max(0, prevEntry.advanceAmount);
            if (carriedForward > 0 && !prevEntry.forwardedToNextMonth) {
              const curMLabel = await getMonthLabel(curM);
              prevEntry.forwardedToNextMonth = true;
              prevEntry.forwardedMonthLabel = curMLabel;
              prevEntry.forwardedAmount = carriedForward;
              modified = true;
            }
          }
        }

        const addlFeeForMonth = getActiveAdditionalSubjectsForMonth(student, curM).reduce(
          (sum, s) => sum + (Number(s.fee) || 0),
          0
        );
        const monthlyBase = student.baseFee + addlFeeForMonth;
        const monthlyNet = Math.max(0, student.baseFee - student.discountAmount) + addlFeeForMonth;

        if (!entry) {
          const curMLabel = await getMonthLabel(curM);
          const dayStr = String(student.dueDayOfMonth).padStart(2, '0');
          const dueDate = `${curM}-${dayStr}`;

          let paidAmount = 0;
          let advanceAmount = 0;
          let balanceAmount = monthlyNet + carriedForward;

          if (advanceFromPrev > 0) {
            if (advanceFromPrev >= balanceAmount) {
              paidAmount = balanceAmount;
              advanceAmount = advanceFromPrev - balanceAmount;
              balanceAmount = 0;
            } else {
              paidAmount = advanceFromPrev;
              balanceAmount -= advanceFromPrev;
              advanceAmount = 0;
            }
          }

          let status: LedgerStatus = 'PENDING';
          if (balanceAmount === 0 && advanceAmount > 0) status = 'ADVANCE';
          else if (balanceAmount === 0 && paidAmount > 0) status = 'PAID';
          else if (paidAmount > 0 && balanceAmount > 0) status = 'PARTIAL';
          else if (todayStr > dueDate && balanceAmount > 0) status = 'OVERDUE';

          entry = {
            id: `led-${student.id}-${curM}`,
            studentId: student.id,
            branchId: student.branchId,
            classId: student.classId,
            batchId: student.batchId,
            month: curM,
            monthLabel: curMLabel,
            baseAmount: monthlyBase,
            discountAmount: student.discountAmount,
            netDueAmount: monthlyNet + carriedForward,
            carriedForwardDue: carriedForward,
            paidAmount,
            balanceAmount,
            advanceAmount,
            dueDate,
            status,
            isOverdue: todayStr > dueDate && balanceAmount > 0,
            updatedAt: new Date().toISOString(),
          };

          dbData.ledger.push(entry);
          modified = true;
        } else {
          // If unpaid entry exists, keep netDueAmount synced with additional fee for that month
          if (entry.paidAmount === 0 && entry.status !== 'PAID') {
            const expectedNetDue = monthlyNet + carriedForward;
            if (entry.netDueAmount !== expectedNetDue || entry.baseAmount !== monthlyBase) {
              entry.baseAmount = monthlyBase;
              entry.netDueAmount = expectedNetDue;
              entry.balanceAmount = Math.max(0, expectedNetDue - entry.paidAmount);
              modified = true;
            }
          }
          // Keep carriedForwardDue and netDueAmount accurately in sync
          if (entry.carriedForwardDue !== carriedForward) {
            entry.carriedForwardDue = carriedForward;
            entry.netDueAmount = student.netFee + carriedForward;
            entry.balanceAmount = Math.max(0, entry.netDueAmount - entry.paidAmount);
            entry.advanceAmount = Math.max(0, entry.paidAmount - entry.netDueAmount);
            if (entry.balanceAmount === 0 && entry.advanceAmount > 0) entry.status = 'ADVANCE';
            else if (entry.balanceAmount === 0 && entry.paidAmount > 0) entry.status = 'PAID';
            else if (entry.paidAmount > 0 && entry.balanceAmount > 0) entry.status = 'PARTIAL';
            else if (todayStr > entry.dueDate && entry.balanceAmount > 0) entry.status = 'OVERDUE';
            else entry.status = 'PENDING';
            entry.isOverdue = todayStr > entry.dueDate && entry.balanceAmount > 0;
            modified = true;
          }
        }

        // Yearly package student consistency: Admission Date, Due Date, and Paid Date are always synchronized
        const isYearlyStudent = student.feeType === 'yearly_package' || Boolean(student.yearlyPackage?.totalYearlyFee);
        if (isYearlyStudent) {
          const joinDateStr = student.joiningDate || '2026-11-01';
          const joinDay = parseInt(joinDateStr.split('-')[2], 10) || 1;
          const expectedDueDate = `${curM}-${String(joinDay).padStart(2, '0')}`;
          if (entry.dueDate !== expectedDueDate) {
            entry.dueDate = expectedDueDate;
            modified = true;
          }
          if (!entry.lastPaymentDate) {
            entry.lastPaymentDate = joinDateStr;
            modified = true;
          }
          if (entry.paidAmount === 0 || entry.status !== 'PAID') {
            entry.paidAmount = entry.netDueAmount;
            entry.balanceAmount = 0;
            entry.status = 'PAID';
            entry.isOverdue = false;
            modified = true;
          }
        } else if (entry.paidAmount > 0 && !entry.lastPaymentDate) {
          const p = dbData.payments.find(pay => pay.studentId === student.id && pay.month === curM);
          if (p?.paymentDate) {
            entry.lastPaymentDate = p.paymentDate;
            modified = true;
          }
        }

        // If this month is before currentMonth and has pending balance, mark next-month forwarding info
        if (curM < currentMonth && entry.balanceAmount > 0) {
          const nextM = getNextMonth(curM);
          const nextMLabel = await getMonthLabel(nextM);
          if (!entry.forwardedToNextMonth || entry.forwardedMonthLabel !== nextMLabel) {
            entry.forwardedToNextMonth = true;
            entry.forwardedMonthLabel = nextMLabel;
            entry.forwardedAmount = entry.balanceAmount;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      saveDatabase(dbData);
    }

    // Filter ledgers
    // Only return entries for students admitted on or before effectiveMonth, not excluded, and not disabled (unless payment recorded)
    let entries = dbData.ledger.filter(l => {
      if (l.month !== effectiveMonth) return false;
      const s = dbData.students.find(st => st.id === l.studentId);
      if (!s) return false;
      if (s.excludedMonths?.includes(effectiveMonth)) return false;
      if (getStudentStatusForMonth(s, effectiveMonth) === 'disabled' && l.paidAmount === 0) return false;
      const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
      return jMonth <= effectiveMonth;
    });

    if (filters?.branchId && filters.branchId !== 'all') {
      entries = entries.filter(l => l.branchId === filters.branchId);
    }
    if (filters?.classId && filters.classId !== 'all') {
      entries = entries.filter(l => l.classId === filters.classId);
    }
    if (filters?.batchId && filters.batchId !== 'all') {
      entries = entries.filter(l => l.batchId === filters.batchId);
    }
    if (filters?.status && filters.status !== ('all' as any)) {
      entries = entries.filter(l => l.status === filters.status);
    }

    // Attach student profile to each ledger record
    const enriched = entries
      .map(entry => {
        const student = dbData.students.find(s => s.id === entry.studentId);
        if (!student) return null;
        return {
          ...entry,
          student,
        };
      })
      .filter(Boolean) as (FeeLedgerEntry & { student: FeeStudent })[];

    return { success: true, data: enriched };
  } catch (error: any) {
    console.error('Error fetching monthly ledger:', error);
    return { success: false, data: [] };
  }
}

/**
 * Public lookup for Student Fee Payment by Student ID / Roll Number + Registered Primary Phone Number
 * Requires both ID and Phone number to match for student privacy and security.
 */
export async function lookupStudentForFeePayment(
  studentIdQuery: string,
  phoneNumberQuery?: string
): Promise<{
  success: boolean;
  message?: string;
  data?: {
    id: string;
    rollNumber: string;
    name: string;
    fatherName: string;
    contact: string;
    className: string;
    batchName: string;
    branchName: string;
    branchId: string;
    classId: string;
    batchId: string;
    currentMonth: string;
    currentMonthLabel: string;
    monthlyFee: number;
    dueAmount: number;
    paidAmount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
    dueDate: string;
    isOverdue: boolean;
    overdueDays: number;
  };
}> {
  try {
    const qId = (studentIdQuery || '').trim().toLowerCase();
    const qPhone = (phoneNumberQuery || '').replace(/\D/g, '');

    if (!qId) {
      return { success: false, message: 'Kripya apna Student ID ya Roll Number enter karein.' };
    }

    if (!qPhone || qPhone.length < 10) {
      return { success: false, message: 'Kripya apna 10-digit registered primary mobile number enter karein.' };
    }

    const dbData = loadDatabase();
    const cleanQId = qId.replace(/[^a-z0-9]/g, '');

    const student = dbData.students.find(s => {
      const sRoll = (s.rollNumber || '').toLowerCase();
      const sId = (s.id || '').toLowerCase();
      return (
        sRoll === qId ||
        sId === qId ||
        (cleanQId.length > 3 && sRoll.replace(/[^a-z0-9]/g, '') === cleanQId) ||
        (cleanQId.length > 3 && sId.replace(/[^a-z0-9]/g, '') === cleanQId)
      );
    });

    if (!student) {
      return {
        success: false,
        message: 'Is ID / Roll Number se koi student record nahi mila. Kripya check karein.',
      };
    }

    // Security Verification: Verify entered phone number matches any of the student's registered contacts
    const last10Entered = qPhone.slice(-10);
    const registeredPhones = [
      student.contact1,
      student.fatherContact,
      student.motherContact,
      student.contact2,
    ]
      .filter(Boolean)
      .map(p => String(p).replace(/\D/g, '').slice(-10));

    const isPhoneMatched = registeredPhones.includes(last10Entered);

    if (!isPhoneMatched) {
      return {
        success: false,
        message: 'Student ID aur Registered Phone Number match nahi hua. Kripya apna registered primary mobile number enter karein.',
      };
    }

    const currentMonth = await getCurrentMonth();
    const currentMonthLabel = await getMonthLabel(currentMonth);

    const cls = dbData.classes.find(c => c.id === student.classId);
    const batch = dbData.batches.find(b => b.id === student.batchId);
    const branch = IDL_BRANCHES.find(b => b.id === student.branchId);

    let ledgerEntry = dbData.ledger.find(l => l.studentId === student.id && l.month === currentMonth);

    let dueAmount = student.netFee;
    let paidAmount = 0;
    let status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL' = 'PENDING';
    let dueDate = `${currentMonth}-${String(student.dueDayOfMonth || 5).padStart(2, '0')}`;

    if (ledgerEntry) {
      dueAmount = Math.max(0, ledgerEntry.balanceAmount !== undefined ? ledgerEntry.balanceAmount : ledgerEntry.netDueAmount);
      paidAmount = ledgerEntry.paidAmount || 0;
      status = ledgerEntry.status as any;
      dueDate = ledgerEntry.dueDate || dueDate;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isOverdue = false;
    let overdueDays = 0;

    if (dueAmount > 0) {
      const effectiveDueDate = (student.feeType === 'yearly_package' || Boolean(student.yearlyPackage))
        ? (student.joiningDate || dueDate)
        : dueDate;

      if (effectiveDueDate) {
        const pure = effectiveDueDate.split('T')[0];
        const parts = pure.split('-');
        let dueD: Date | null = null;
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            dueD = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          } else {
            dueD = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          }
        }
        if (dueD) {
          dueD.setHours(0, 0, 0, 0);
          const diffMs = today.getTime() - dueD.getTime();
          if (diffMs > 0) {
            isOverdue = true;
            overdueDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            status = 'OVERDUE';
          }
        }
      }
      if (status === 'OVERDUE') {
        isOverdue = true;
        if (overdueDays === 0) overdueDays = 1;
      }
    }

    return {
      success: true,
      data: {
        id: student.id,
        rollNumber: student.rollNumber || student.id,
        name: student.name,
        fatherName: student.fatherName || '—',
        contact: student.fatherContact || student.contact1 || student.contact2 || '—',
        className: cls?.name || 'Class',
        batchName: batch?.name || 'Batch',
        branchName: branch?.name || 'Budh Vihar',
        branchId: student.branchId,
        classId: student.classId,
        batchId: student.batchId,
        currentMonth,
        currentMonthLabel,
        monthlyFee: student.netFee,
        dueAmount,
        paidAmount,
        status,
        dueDate,
        isOverdue,
        overdueDays,
      },
    };
  } catch (error: any) {
    console.error('Error looking up student:', error);
    return { success: false, message: error.message || 'Lookup failed.' };
  }
}

// =============================================================
// 5. FEE COLLECTION & RECEIPT GENERATION
// =============================================================

export async function collectFeePayment(data: {
  studentId: string;
  month: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  remarks?: string;
  collectedBy?: string;
  paymentDate?: string; // Manual collection date specified by admin
}): Promise<{
  success: boolean;
  message: string;
  receipt?: FeePayment;
  updatedLedger?: FeeLedgerEntry;
}> {
  try {
    const dbData = loadDatabase();
    const amount = Number(data.amount);
    if (amount <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }

    const student = dbData.students.find(s => s.id === data.studentId);
    if (!student) {
      return { success: false, message: 'Student not found.' };
    }

    const month = data.month;
    const monthLabel = await getMonthLabel(month);

    let ledger = dbData.ledger.find(l => l.studentId === student.id && l.month === month);
    if (!ledger) {
      const dayStr = String(student.dueDayOfMonth).padStart(2, '0');
      const dueDate = `${month}-${dayStr}`;
      ledger = {
        id: `led-${student.id}-${month}`,
        studentId: student.id,
        branchId: student.branchId,
        classId: student.classId,
        batchId: student.batchId,
        month,
        monthLabel,
        baseAmount: student.baseFee,
        discountAmount: student.discountAmount,
        netDueAmount: student.netFee,
        carriedForwardDue: 0,
        paidAmount: 0,
        balanceAmount: student.netFee,
        advanceAmount: 0,
        dueDate,
        status: 'PENDING',
        isOverdue: false,
        updatedAt: new Date().toISOString(),
      };
      dbData.ledger.push(ledger);
    }

    const newPaidTotal = ledger.paidAmount + amount;
    let newBalance = Math.max(0, ledger.netDueAmount - newPaidTotal);
    let newAdvance = Math.max(0, newPaidTotal - ledger.netDueAmount);

    let newStatus: LedgerStatus = 'PENDING';
    if (newBalance === 0 && newAdvance > 0) newStatus = 'ADVANCE';
    else if (newBalance === 0) newStatus = 'PAID';
    else if (newPaidTotal > 0 && newBalance > 0) newStatus = 'PARTIAL';

    const todayStr = new Date().toISOString().split('T')[0];
    const effectivePaymentDate = data.paymentDate && data.paymentDate.trim() ? data.paymentDate.trim() : todayStr;
    const isOverdue = newBalance > 0 && effectivePaymentDate > ledger.dueDate;
    if (isOverdue && newStatus === 'PENDING') newStatus = 'OVERDUE';

    ledger.paidAmount = newPaidTotal;
    ledger.balanceAmount = newBalance;
    ledger.advanceAmount = newAdvance;
    ledger.status = newStatus;
    ledger.isOverdue = isOverdue;
    ledger.lastPaymentDate = effectivePaymentDate;
    ledger.remarks = data.remarks || ledger.remarks;
    ledger.updatedAt = new Date().toISOString();

    const receiptNum = `REC-${month.replace('-', '')}-${String(dbData.payments.length + 1).padStart(4, '0')}`;
    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      branchId: student.branchId,
      classId: student.classId,
      batchId: student.batchId,
      month,
      monthLabel,
      amount,
      paymentMode: data.paymentMode || 'cash',
      transactionRef: data.transactionRef || '',
      paymentDate: effectivePaymentDate,
      collectedBy: data.collectedBy || 'Admin Desk',
      remarks: data.remarks || '',
      createdAt: new Date().toISOString(),
    };

    dbData.payments.unshift(newPayment);
    saveDatabase(dbData);

    return {
      success: true,
      message: `Fee payment of ₹${amount} recorded successfully. Receipt No: ${receiptNum}`,
      receipt: newPayment,
      updatedLedger: ledger,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to record payment.' };
  }
}

// Manually update collection date for an existing payment receipt
export async function updatePaymentDate(
  paymentId: string,
  newPaymentDate: string
): Promise<{ success: boolean; message: string; updatedPayment?: FeePayment }> {
  try {
    const dbData = loadDatabase();
    const payment = dbData.payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, message: 'Receipt not found.' };

    const oldDate = payment.paymentDate;
    payment.paymentDate = newPaymentDate;

    // Update lastPaymentDate on corresponding ledger entry
    const ledger = dbData.ledger.find(l => l.studentId === payment.studentId && l.month === payment.month);
    if (ledger) {
      ledger.lastPaymentDate = newPaymentDate;
      ledger.updatedAt = new Date().toISOString();
    }

    saveDatabase(dbData);
    return {
      success: true,
      message: `Receipt ${payment.receiptNumber} ki collection date badal kar "${newPaymentDate}" kar di gayi hai (Purani date: ${oldDate}).`,
      updatedPayment: payment,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update payment date.' };
  }
}

export async function getFeePayments(filters?: {
  branchId?: string;
  studentId?: string;
  month?: string;
}): Promise<{ success: boolean; data: FeePayment[] }> {
  try {
    const dbData = loadDatabase();
    let payments = [...dbData.payments];

    if (filters?.branchId && filters.branchId !== 'all') {
      payments = payments.filter(p => p.branchId === filters.branchId);
    }
    if (filters?.studentId) {
      payments = payments.filter(p => p.studentId === filters.studentId);
    }
    if (filters?.month && filters.month !== 'all') {
      payments = payments.filter(p => p.month === filters.month);

      // For yearly package students viewing any covered paid month, include their master yearly receipt
      if (filters?.studentId && payments.length === 0) {
        const stu = dbData.students.find(s => s.id === filters.studentId);
        const isYearly = stu?.feeType === 'yearly_package' || Boolean(stu?.yearlyPackage?.totalYearlyFee);
        if (isYearly) {
          const paidLedger = dbData.ledger.find(
            l => l.studentId === filters.studentId && l.month === filters.month && l.paidAmount > 0
          );
          if (paidLedger) {
            payments = dbData.payments.filter(
              p =>
                p.studentId === filters.studentId &&
                (p.transactionRef === 'YEARLY-PACKAGE-LUMPSUM' || (p.monthLabel || '').includes('Yearly Package'))
            );
          }
        }
      }
    }

    return { success: true, data: payments };
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

// =============================================================
// 5B. REVERT FEE PAYMENT & MARK UNPAID
// =============================================================

export async function revertFeePayment(paymentId: string): Promise<{
  success: boolean;
  message: string;
  updatedLedger?: FeeLedgerEntry;
}> {
  try {
    const dbData = loadDatabase();
    const paymentIndex = dbData.payments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      return { success: false, message: 'Payment receipt not found.' };
    }

    const payment = dbData.payments[paymentIndex];
    const { studentId, month, amount, receiptNumber, studentName } = payment;

    // Find and update the ledger entry
    const ledger = dbData.ledger.find(l => l.studentId === studentId && l.month === month);
    if (ledger) {
      const newPaidTotal = Math.max(0, ledger.paidAmount - amount);
      const newBalance = Math.max(0, ledger.netDueAmount - newPaidTotal);
      const newAdvance = Math.max(0, newPaidTotal - ledger.netDueAmount);

      const todayStr = new Date().toISOString().split('T')[0];
      const isOverdue = newBalance > 0 && todayStr > ledger.dueDate;

      let newStatus: LedgerStatus = 'PENDING';
      if (newPaidTotal === 0) {
        newStatus = isOverdue ? 'OVERDUE' : 'PENDING';
      } else if (newBalance === 0 && newAdvance > 0) {
        newStatus = 'ADVANCE';
      } else if (newBalance === 0) {
        newStatus = 'PAID';
      } else if (newPaidTotal > 0 && newBalance > 0) {
        newStatus = 'PARTIAL';
      }

      ledger.paidAmount = newPaidTotal;
      ledger.balanceAmount = newBalance;
      ledger.advanceAmount = newAdvance;
      ledger.status = newStatus;
      ledger.isOverdue = isOverdue;
      if (newPaidTotal === 0) {
        delete ledger.lastPaymentDate;
      }
      ledger.updatedAt = new Date().toISOString();
    }

    // Remove the payment from payments array
    dbData.payments.splice(paymentIndex, 1);
    saveDatabase(dbData);

    return {
      success: true,
      message: `Receipt ${receiptNumber} (₹${amount.toLocaleString('en-IN')}) for ${studentName} successfully reverted.`,
      updatedLedger: ledger,
    };
  } catch (error: any) {
    console.error('Error reverting fee payment:', error);
    return { success: false, message: error.message || 'Failed to revert payment.' };
  }
}

export async function markMonthUnpaid(
  studentId: string,
  month: string
): Promise<{
  success: boolean;
  message: string;
  updatedLedger?: FeeLedgerEntry;
}> {
  try {
    const dbData = loadDatabase();
    const student = dbData.students.find(s => s.id === studentId);
    const studentName = student?.name || 'Student';

    const ledger = dbData.ledger.find(l => l.studentId === studentId && l.month === month);
    if (!ledger) {
      return { success: false, message: 'Ledger entry not found for this student and month.' };
    }

    const previousPaid = ledger.paidAmount;
    const todayStr = new Date().toISOString().split('T')[0];
    const isOverdue = ledger.netDueAmount > 0 && todayStr > ledger.dueDate;

    ledger.paidAmount = 0;
    ledger.balanceAmount = ledger.netDueAmount;
    ledger.advanceAmount = 0;
    ledger.status = isOverdue ? 'OVERDUE' : 'PENDING';
    ledger.isOverdue = isOverdue;
    delete ledger.lastPaymentDate;
    ledger.updatedAt = new Date().toISOString();

    // Remove all payments for this student and month
    const countBefore = dbData.payments.length;
    dbData.payments = dbData.payments.filter(
      p => !(p.studentId === studentId && p.month === month)
    );
    const removedCount = countBefore - dbData.payments.length;

    saveDatabase(dbData);

    return {
      success: true,
      message: `Fee marked as UNPAID for ${studentName} (${ledger.monthLabel}). Reverted ₹${previousPaid.toLocaleString('en-IN')}${removedCount > 0 ? ` across ${removedCount} receipt(s)` : ''}.`,
      updatedLedger: ledger,
    };
  } catch (error: any) {
    console.error('Error marking month unpaid:', error);
    return { success: false, message: error.message || 'Failed to mark month unpaid.' };
  }
}

// =============================================================
// 6. DASHBOARD AGGREGATED STATS
// =============================================================

export async function getFeeDashboardStats(
  month?: string,
  branchId?: string
): Promise<{ success: boolean; data: FeeDashboardStats }> {
  try {
    const currentMonth = await getCurrentMonth();
    const rawMonth = month || currentMonth;
    const effectiveMonth = rawMonth > currentMonth ? currentMonth : rawMonth;
    const currentMonthLabel = await getMonthLabel(effectiveMonth);

    // Make sure monthly ledger exists for all branches
    await getMonthlyLedger(effectiveMonth);

    const dbData = loadDatabase();
    // Filter students strictly by admission date (joiningDate <= effectiveMonth) and not excluded for this month
    const allStudentsForMonth = dbData.students.filter(s => {
      const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
      if (jMonth > effectiveMonth) return false;
      if (s.excludedMonths?.includes(effectiveMonth)) return false;
      return true;
    });

    const allLedgersForMonth = dbData.ledger.filter(l => {
      if (l.month !== effectiveMonth) return false;
      const s = dbData.students.find(st => st.id === l.studentId);
      if (!s) return false;
      if (s.excludedMonths?.includes(effectiveMonth)) return false;
      if (getStudentStatusForMonth(s, effectiveMonth) === 'disabled' && l.paidAmount === 0) return false;
      const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
      return jMonth <= effectiveMonth;
    });

    let students = [...allStudentsForMonth];
    let classes = [...dbData.classes];
    let batches = [...dbData.batches];
    let ledgers = [...allLedgersForMonth];
    let payments = dbData.payments.filter(p => p.month === effectiveMonth);

    if (branchId && branchId !== 'all') {
      students = students.filter(s => s.branchId === branchId);
      classes = classes.filter(c => c.branchId === branchId);
      batches = batches.filter(b => b.branchId === branchId);
      ledgers = ledgers.filter(l => l.branchId === branchId);
      payments = payments.filter(p => p.branchId === branchId);
    }

    const totalStudents = students.length;
    const activeStudents = students.filter(s => getStudentStatusForMonth(s, effectiveMonth) === 'active').length;
    const disabledStudents = students.filter(s => getStudentStatusForMonth(s, effectiveMonth) === 'disabled').length;

    let totalExpectedFee = 0;
    let totalReceivedFee = 0;
    let totalPendingFee = 0;
    let totalAdvanceFee = 0;
    let overdueCount = 0;

    for (const entry of ledgers) {
      const s = dbData.students.find(st => st.id === entry.studentId);
      const isDis = s ? getStudentStatusForMonth(s, effectiveMonth) === 'disabled' : false;
      if (isDis) {
        // Disabled student fee is NOT counted as pending dues or unearned billing
        totalExpectedFee += entry.paidAmount;
        totalReceivedFee += entry.paidAmount;
      } else {
        totalExpectedFee += entry.netDueAmount;
        totalReceivedFee += entry.paidAmount;
        totalPendingFee += entry.balanceAmount;
        totalAdvanceFee += entry.advanceAmount;
        if (entry.isOverdue || entry.status === 'OVERDUE') {
          overdueCount += 1;
        }
      }
    }

    const collectionRate =
      totalExpectedFee > 0 ? Math.round((totalReceivedFee / totalExpectedFee) * 100) : 0;

    // Class Breakdown
    const classBreakdown = classes.map(cls => {
      const clsStudents = students.filter(s => s.classId === cls.id);
      const clsLedgers = ledgers.filter(l => l.classId === cls.id);
      let expected = 0;
      let received = 0;
      let pending = 0;

      for (const l of clsLedgers) {
        const s = dbData.students.find(st => st.id === l.studentId);
        const isDis = s ? getStudentStatusForMonth(s, effectiveMonth) === 'disabled' : false;
        if (isDis) {
          expected += l.paidAmount;
          received += l.paidAmount;
        } else {
          expected += l.netDueAmount;
          received += l.paidAmount;
          pending += l.balanceAmount;
        }
      }

      return {
        classId: cls.id,
        className: cls.name,
        branchId: cls.branchId,
        studentCount: clsStudents.length,
        expectedFee: expected,
        receivedFee: received,
        pendingFee: pending,
      };
    });

    // Branch Breakdown across ALL branches for this month
    const branchBreakdown = IDL_BRANCHES.filter(b => b.id !== 'all').map(branch => {
      const bStudents = dbData.students.filter(s => {
        const bMatch = s.branchId === branch.id || (branch.id === 'mangolpuri' && s.branchId === 'mangol-puri') || (branch.id === 'mangol-puri' && s.branchId === 'mangolpuri');
        if (!bMatch) return false;
        const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
        return jMonth <= effectiveMonth;
      });
      const bLedgers = allLedgersForMonth.filter(l => {
        return l.branchId === branch.id || (branch.id === 'mangolpuri' && l.branchId === 'mangol-puri') || (branch.id === 'mangol-puri' && l.branchId === 'mangolpuri');
      });
      let expected = 0;
      let received = 0;
      let pending = 0;

      for (const l of bLedgers) {
        const s = dbData.students.find(st => st.id === l.studentId);
        const isDis = s ? getStudentStatusForMonth(s, effectiveMonth) === 'disabled' : false;
        if (isDis) {
          expected += l.paidAmount;
          received += l.paidAmount;
        } else {
          expected += l.netDueAmount;
          received += l.paidAmount;
          pending += l.balanceAmount;
        }
      }

      // If any active student in branch does not yet have a ledger entry for this month, account for their expected fee
      for (const s of bStudents) {
        const hasLedger = bLedgers.some(l => l.studentId === s.id);
        if (!hasLedger) {
          const fee = s.netFee || s.baseFee || 0;
          expected += fee;
          pending += fee;
        }
      }

      return {
        branchId: branch.id,
        branchName: branch.name,
        studentCount: bStudents.length,
        expectedFee: expected,
        receivedFee: received,
        pendingFee: pending,
      };
    });

    const recentPayments = payments.slice(0, 8);

    return {
      success: true,
      data: {
        totalStudents,
        activeStudents,
        disabledStudents,
        totalClasses: classes.length,
        totalBatches: batches.length,
        currentMonth: effectiveMonth,
        currentMonthLabel,
        totalExpectedFee,
        totalReceivedFee,
        totalPendingFee,
        totalAdvanceFee,
        overdueCount,
        collectionRate,
        classBreakdown,
        branchBreakdown,
        recentPayments,
      },
    };
  } catch (error: any) {
    console.error('Error calculating fee dashboard stats:', error);
    return {
      success: false,
      data: {
        totalStudents: 0,
        activeStudents: 0,
        disabledStudents: 0,
        totalClasses: 0,
        totalBatches: 0,
        currentMonth: month || '2026-11',
        currentMonthLabel: 'November 2026',
        totalExpectedFee: 0,
        totalReceivedFee: 0,
        totalPendingFee: 0,
        totalAdvanceFee: 0,
        overdueCount: 0,
        collectionRate: 0,
        classBreakdown: [],
        branchBreakdown: [],
        recentPayments: [],
      },
    };
  }
}

/**
 * Calculates academic year / session performance for all branches and month-by-month trends.
 */
export async function getBranchYearlyReport(session = '2026-27'): Promise<{
  success: boolean;
  data: BranchYearlyReportResult;
}> {
  try {
    const dbData = loadDatabase();

    // Full Academic Session 2026-27 (12 months: April 2026 to March 2027)
    const sessionMonths = [
      '2026-04', '2026-05', '2026-06', '2026-07',
      '2026-08', '2026-09', '2026-10', '2026-11',
      '2026-12', '2027-01', '2027-02', '2027-03',
    ];

    const branches: BranchYearlyData[] = IDL_BRANCHES.filter(b => b.id !== 'all').map(br => {
      let annualExpected = 0;
      let annualReceived = 0;
      let annualPending = 0;
      const monthData: BranchYearlyMonthPoint[] = [];

      // Active students belonging to this branch
      const branchStudents = dbData.students.filter(s => {
        return s.branchId === br.id || (br.id === 'mangolpuri' && s.branchId === 'mangol-puri') || (br.id === 'mangol-puri' && s.branchId === 'mangolpuri');
      });

      for (const m of sessionMonths) {
        const [y, mo] = m.split('-').map(Number);
        const mLabel = new Date(y, mo - 1, 1).toLocaleString('en-US', { month: 'short', year: 'numeric' });

        const activeInMonth = branchStudents.filter(s => {
          const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
          if (jMonth > m) return false;
          if (s.excludedMonths && s.excludedMonths.includes(m)) return false;
          const status = getStudentStatusForMonth(s, m);
          return status !== 'disabled';
        });

        const mEntries = dbData.ledger.filter(l => {
          const bMatch = l.branchId === br.id || (br.id === 'mangolpuri' && l.branchId === 'mangol-puri') || (br.id === 'mangol-puri' && l.branchId === 'mangolpuri');
          return bMatch && l.month === m;
        });

        let mExpected = 0;
        let mReceived = 0;
        let mPending = 0;

        // Process every active student for this month
        for (const s of activeInMonth) {
          const l = mEntries.find(entry => entry.studentId === s.id);
          if (l) {
            mExpected += l.netDueAmount;
            mReceived += l.paidAmount;
            mPending += l.balanceAmount;
          } else {
            const fee = s.netFee || s.baseFee || 0;
            mExpected += fee;
            mPending += fee;
          }
        }

        // Also check if any inactive/disabled students had payments in this month
        for (const l of mEntries) {
          const isAlreadyCounted = activeInMonth.some(s => s.id === l.studentId);
          if (!isAlreadyCounted && l.paidAmount > 0) {
            mExpected += l.paidAmount;
            mReceived += l.paidAmount;
          }
        }

        annualExpected += mExpected;
        annualReceived += mReceived;
        annualPending += mPending;

        monthData.push({
          month: m,
          monthLabel: mLabel,
          studentCount: activeInMonth.length,
          expected: mExpected,
          received: mReceived,
          pending: mPending,
          rate: mExpected > 0 ? Math.round((mReceived / mExpected) * 100) : 0,
        });
      }

      return {
        branchId: br.id,
        branchName: br.name,
        address: br.address,
        annualExpected,
        annualReceived,
        annualPending,
        annualRate: annualExpected > 0 ? Math.round((annualReceived / annualExpected) * 100) : 0,
        activeStudents: branchStudents.length,
        monthData,
      };
    });

    const totals = {
      annualExpected: branches.reduce((acc, b) => acc + b.annualExpected, 0),
      annualReceived: branches.reduce((acc, b) => acc + b.annualReceived, 0),
      annualPending: branches.reduce((acc, b) => acc + b.annualPending, 0),
      annualRate: 0,
      activeStudents: branches.reduce((acc, b) => acc + b.activeStudents, 0),
    };
    totals.annualRate = totals.annualExpected > 0 ? Math.round((totals.annualReceived / totals.annualExpected) * 100) : 0;

    return {
      success: true,
      data: {
        session,
        sessionLabel: `Session ${session} (Apr 2026 - Mar 2027)`,
        branches,
        totals,
      },
    };
  } catch (error: any) {
    console.error('Error generating branch yearly report:', error);
    return {
      success: false,
      data: {
        session,
        sessionLabel: `Session ${session}`,
        branches: [],
        totals: {
          annualExpected: 0,
          annualReceived: 0,
          annualPending: 0,
          annualRate: 0,
          activeStudents: 0,
        },
      },
    };
  }
}
