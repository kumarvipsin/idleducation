// src/types/fee-management.ts
export type Gender = 'male' | 'female' | 'other';
export type StudentStatus = 'active' | 'disabled';
export type FeeStructureType = 'monthly' | 'course_onetime' | 'yearly_package';
export type PaymentMode = 'cash' | 'online' | 'upi' | 'net_banking' | 'cheque' | 'card';
export type LedgerStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | 'ADVANCE';

export interface FeeBranch {
  id: string; // 'mukherjee-nagar' | 'mangolpuri' | 'krishan-vihar' | 'budh-vihar' | 'online'
  name: string;
  code: string;
  address: string;
  phone: string;
}

export interface FeeClass {
  id: string;
  name: string; // e.g. "Class 10 - Foundation"
  code: string; // e.g. "C10"
  branchId: string; // which branch this class belongs to, or 'all'
  academicSession: string; // e.g. "2026-27"
  division?: string; // e.g. "Foundation", "Section A", "Senior", etc.
  description?: string;
  defaultMonthlyFee: number;
  order?: number; // display order sequence number
  batchCount?: number;
  studentCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FeeBatch {
  id: string;
  classId: string;
  branchId: string;
  name: string; // e.g. "Morning Alpha Batch"
  duration: string; // e.g. "1 Year (Apr 2026 - Mar 2027)"
  startDate?: string;
  endDate?: string;
  classTime: string; // e.g. "04:00 PM - 06:00 PM (Mon-Sat)"
  subjects: string[]; // e.g. ["Physics", "Chemistry", "Mathematics"]
  monthlyFee: number; // default monthly fee
  courseFee?: number; // total course fee
  order?: number; // display order sequence number
  studentCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FeeStudent {
  id: string;
  rollNumber: string; // e.g. "IDL-MN-2026-001"
  name: string;
  fatherName: string;
  fatherOccupation?: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  bloodGroup?: string;
  address: string;
  contact1: string; // Primary 10-digit mobile (Student Contact)
  contact2: string; // Emergency / Secondary Contact
  fatherContact?: string; // Father Contact Number
  motherContact?: string; // Mother Contact Number
  branchId: string; // branch
  classId: string;
  batchId: string;
  subjects: string[]; // manually added/removed subjects
  joiningDate: string; // YYYY-MM-DD
  dueDayOfMonth: number; // e.g. 5, 10, 15
  dueDate?: string; // DD-MM-YYYY or YYYY-MM-DD

  // Fee Details
  feeType: FeeStructureType; // 'monthly' | 'course_onetime'
  paymentCycleMonths: number; // 1 = monthly, 2 = 2-months, 3 = quarterly
  baseFee: number; // base fee entered manually
  scholarshipPercent: number; // e.g. 20 for 20%
  discountAmount: number; // (baseFee * scholarshipPercent) / 100
  netFee: number; // baseFee - discountAmount

  // For Course Onetime / Yearly Package
  installmentCount?: 1 | 2 | 3; // 1 time, 2 times, or 3 times
  yearlyPackage?: {
    totalYearlyFee: number;
    courseMonths: number;
    standardMonthlyFee?: number;
    monthlyEquatedFee?: number;
    packageSubjects?: string[];
    isFullPaid?: boolean;
  };

  // Additional Subjects & Custom Charges (Optional student-specific extra subjects)
  additionalSubjects?: AdditionalSubject[];
  additionalFee?: number; // total current active monthly additional fee

  // Status & Lifecycle
  status: StudentStatus;
  disabledAt?: string;
  enabledAt?: string;
  statusNotes?: string;
  excludedMonths?: string[]; // Specific months where student fee ledger is excluded/deleted for that month only
  statusHistory?: {
    month: string; // "YYYY-MM" e.g. "2026-10"
    status: StudentStatus; // 'active' | 'disabled'
    updatedAt?: string;
    note?: string;
  }[];

  transferHistory?: StudentTransferRecord[];

  createdAt: string;
  updatedAt?: string;
}

export interface StudentTransferRecord {
  id: string;
  fromBranchId: string;
  toBranchId: string;
  fromClassId: string;
  toClassId: string;
  fromBatchId: string;
  toBatchId: string;
  transferDate: string; // YYYY-MM-DD
  transferMonth: string; // YYYY-MM
  reason?: string;
  previousNetFee?: number;
  newNetFee?: number;
  transferredAt: string; // ISO string
}

/**
 * Returns student status for a given month ("active" | "disabled").
 * If student was disabled from a month, they remain disabled for subsequent months
 * until manually re-enabled in a later month.
 */
export function getStudentStatusForMonth(
  student: FeeStudent,
  month: string
): StudentStatus {
  if (student.statusHistory && student.statusHistory.length > 0) {
    // Sort descending by month
    const sorted = [...student.statusHistory].sort((a, b) => b.month.localeCompare(a.month));
    const entry = sorted.find(e => e.month <= month);
    if (entry) {
      return entry.status;
    }
    // If target month is prior to first transition, default to active
    const oldest = sorted[sorted.length - 1];
    if (month < oldest.month) {
      return 'active';
    }
  }

  return student.status || 'active';
}

export interface AdditionalSubject {
  id: string;
  name: string;
  fee: number; // additional fee (monthly)
  addedMonth: string; // "YYYY-MM" e.g. "2026-11"
  removedMonth?: string; // "YYYY-MM" if removed from a certain month onwards
  status: 'active' | 'removed';
  addedAt?: string;
  removedAt?: string;
}

/**
 * Returns active additional subjects for a given student in a specific month ("YYYY-MM").
 */
export function getActiveAdditionalSubjectsForMonth(
  student: FeeStudent,
  month: string
): AdditionalSubject[] {
  if (!student.additionalSubjects || student.additionalSubjects.length === 0) return [];
  return student.additionalSubjects.filter(sub => {
    if (sub.addedMonth && sub.addedMonth > month) return false;
    if (sub.removedMonth && sub.removedMonth <= month) return false;
    if (!sub.removedMonth && sub.status === 'removed') return false;
    return true;
  });
}

export interface FeeLedgerEntry {
  id: string;
  studentId: string;
  branchId: string;
  classId: string;
  batchId: string;
  month: string; // "YYYY-MM", e.g. "2026-11"
  monthLabel: string; // "November 2026"
  baseAmount: number;
  discountAmount: number;
  netDueAmount: number; // monthly net fee + carry forward
  carriedForwardDue: number; // any pending amount from previous month
  paidAmount: number;
  balanceAmount: number;
  advanceAmount: number;
  dueDate: string; // "YYYY-MM-DD"
  status: LedgerStatus;
  isOverdue: boolean;
  forwardedToNextMonth?: boolean;
  forwardedMonthLabel?: string;
  forwardedAmount?: number;
  lastPaymentDate?: string;
  remarks?: string;
  updatedAt?: string;
}

export interface FeePayment {
  id: string;
  receiptNumber: string; // e.g. "REC-202611-0001"
  studentId: string;
  studentName: string;
  rollNumber: string;
  branchId: string;
  classId: string;
  batchId: string;
  month: string; // "YYYY-MM"
  monthLabel: string; // "November 2026"
  amount: number;
  paymentMode: PaymentMode;
  transactionRef?: string; // UPI ID, Cheque No, Bank Ref
  paymentDate: string; // YYYY-MM-DD
  collectedBy: string; // e.g. "Admin Desk"
  remarks?: string;
  createdAt: string;
}

export interface FeeDashboardStats {
  totalStudents: number;
  activeStudents: number;
  disabledStudents: number;
  totalClasses: number;
  totalBatches: number;
  currentMonth: string;
  currentMonthLabel: string;
  totalExpectedFee: number;
  totalReceivedFee: number;
  totalPendingFee: number;
  totalAdvanceFee: number;
  overdueCount: number;
  collectionRate: number; // percentage
  classBreakdown: {
    classId: string;
    className: string;
    branchId: string;
    studentCount: number;
    expectedFee: number;
    receivedFee: number;
    pendingFee: number;
  }[];
  branchBreakdown: {
    branchId: string;
    branchName: string;
    studentCount: number;
    expectedFee: number;
    receivedFee: number;
    pendingFee: number;
  }[];
  recentPayments: FeePayment[];
}

export const IDL_BRANCHES: FeeBranch[] = [
  { id: 'all', name: 'All Branches', code: 'ALL', address: 'All Branches, Delhi-NCR', phone: '8860040010' },
  { id: 'budh-vihar', name: 'Budh Vihar', code: 'BV', address: 'Budh Vihar Phase-1, Delhi-110086', phone: '8860040010' },
  { id: 'krishan-vihar', name: 'Krishan Vihar', code: 'KV', address: 'Krishan Vihar, Delhi-110086', phone: '8860040010' },
  { id: 'mangolpuri', name: 'Mangol Puri', code: 'MP', address: 'Mangol Puri, Delhi-110083', phone: '8860040010' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar', code: 'MN', address: 'Mukherjee Nagar, Delhi-110009', phone: '8860040010' },
];

export const AVAILABLE_SUBJECTS: string[] = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Science (PCB/M)',
  'English Language & Literature',
  'Social Science (SST)',
  'Accountancy',
  'Business Studies',
  'Economics',
  'Computer Science / IP',
  'Hindi',
];

export interface BranchYearlyMonthPoint {
  month: string;
  monthLabel: string;
  studentCount: number;
  expected: number;
  received: number;
  pending: number;
  rate: number;
}

export interface BranchYearlyData {
  branchId: string;
  branchName: string;
  address: string;
  annualExpected: number;
  annualReceived: number;
  annualPending: number;
  annualRate: number;
  activeStudents: number;
  monthData: BranchYearlyMonthPoint[];
}

export interface BranchYearlyReportResult {
  session: string;
  sessionLabel: string;
  branches: BranchYearlyData[];
  totals: {
    annualExpected: number;
    annualReceived: number;
    annualPending: number;
    annualRate: number;
    activeStudents: number;
  };
}

