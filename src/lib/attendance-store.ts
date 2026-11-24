// IDL EDUCATION - Attendance Management System Data Store
// Core domain entities, calculations, audit logging, and reactive state management

export type StudentStatus = 'not_arrived' | 'present' | 'late' | 'absent' | 'leave' | 'left' | 'live';

export type CallStatus = 'Not Contacted' | 'Contacted' | 'Busy' | 'Not Reachable' | 'Call Back Requested';

export type SpokeTo = 'Father' | 'Mother' | 'Student' | 'Guardian' | 'Other';

export type LeaveReason = 
  | 'Fever'
  | 'Medical'
  | 'Family Function'
  | 'Personal Work'
  | 'Out of Station'
  | 'Other';

export type LeaveApprovalStatus = 'Approved' | 'Pending' | 'Rejected';

export type ScheduleType = 'regular' | 'one_time' | 'extra' | 'rescheduled' | 'cancelled' | 'holiday';

export type UserRole = 'Super Admin' | 'Admin' | 'Teacher' | 'Staff';

export interface TStudentBatchTransfer {
  fromBatchId: string;
  fromBatchName: string;
  toBatchId: string;
  toBatchName: string;
  effectiveDate: string; // YYYY-MM-DD
  transferredAt: string;
  transferredBy?: string;
  reason?: string;
}

export interface TStudent {
  id: string;
  name: string;
  rollNo: number;
  classId: string;
  className: string; // e.g. "9th"
  batchId: string;
  batchName: string; // e.g. "9A"
  branchId?: string;
  admissionDate: string; // "YYYY-MM-DD" e.g. "2026-08-10"
  dueDate?: string; // "YYYY-MM-DD" e.g. "2026-09-10"
  dueDayOfMonth?: number;
  exitDate?: string;
  status: 'active' | 'archived';
  dob?: string;
  gender?: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  motherPhone?: string;
  address?: string;
  avatar?: string;
  targetExam?: string;
  notes?: string;
  batchHistory?: TStudentBatchTransfer[];
  createdAt?: string;
  isDemo?: boolean;
}

export interface TClass {
  id: string;
  name: string; // "9th", "10th", "11th", "12th"
  displayName: string;
  batches: string[];
  status: 'active' | 'archived';
  description?: string;
  division?: string;
  branchId?: string;
  academicSession?: string;
  order?: number;
  defaultMonthlyFee?: number;
  studentCount?: number;
  createdAt?: string;
  isDemo?: boolean;
}

export interface TBatch {
  id: string;
  name: string; // "9A", "9B", "10A", etc.
  classId: string;
  className: string;
  room?: string;
  status: 'active' | 'archived';
  startDate?: string;
  endDate?: string;
  duration?: string;
  classTime?: string;
  order?: number;
  monthlyFee?: number;
  courseFee?: number;
  subjects?: string[];
  branchId?: string;
  description?: string;
  createdAt?: string;
  isDemo?: boolean;
}

export interface TTeacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  avatar?: string;
  status: 'active' | 'archived';
  joiningDate?: string;
  assignedClasses?: string[];
  assignedBatches?: string[];
  notes?: string;
  isDemo?: boolean;
}

export interface TSubject {
  id: string;
  name: string;
  code: string;
  classes: string[];
  teachers: string[];
  classId?: string;
  className?: string;
  batchId?: string;
  batchName?: string;
  branchId?: string;
  scheduleDays?: 'MWF' | 'TTS' | 'Mon-Sat' | 'Sunday';
  startTime?: string;
  endTime?: string;
  status: 'active' | 'archived';
  description?: string;
  avgAttendance?: string;
  isDemo?: boolean;
}

export interface TScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // "09:00 AM" or "16:00"
  endTime: string; // "10:00 AM" or "18:00"
  durationMinutes: number; // e.g. 60, 90, 120
  classId: string;
  className: string;
  batchId: string;
  batchName: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  type: ScheduleType;
  status: 'Completed' | 'Ongoing' | 'Upcoming' | 'Cancelled' | 'Holiday';
  cancellationReason?: string;
  holidayTitle?: string;
  room?: string;
  notes?: string;
  isDemo?: boolean;
}

export interface TStudentSessionRecord {
  studentId: string;
  studentName: string;
  rollNo: number;
  status: StudentStatus;
  checkInTime?: string; // e.g. "04:05 PM"
  checkOutTime?: string; // e.g. "06:00 PM"
  attendedMinutes: number;
  missedMinutes: number;
  extraMinutes: number;
  isOngoing?: boolean;
  leaveReason?: string;
  leaveRemark?: string;
  absenceRemark?: string;
  isVoided?: boolean;
  voidReason?: string;
  voidedBy?: string;
  lastEditedAt?: string;
  lastEditedBy?: string;
  editReason?: string;
  isDemo?: boolean;
}

export interface TClassSession {
  id: string;
  scheduleId: string;
  date: string;
  classId: string;
  className: string;
  batchId: string;
  batchName: string;
  subject: string;
  teacherName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  scheduledDurationMinutes: number;
  sessionStatus: 'Upcoming' | 'Ongoing' | 'Completed';
  startedAt?: string;
  endedAt?: string;
  studentRecords: Record<string, TStudentSessionRecord>;
  isDemo?: boolean;
}

export interface TLeaveRequest {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  batchId: string;
  batchName: string;
  subject?: string;
  reason: LeaveReason;
  customReason?: string;
  informedBy: 'Parent' | 'Student' | 'Guardian' | 'Other';
  status: LeaveApprovalStatus;
  remark?: string;
  appliedOn: string;
  isDemo?: boolean;
}

export interface TAbsenceFollowUp {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  batchId: string;
  batchName: string;
  subject: string;
  missedHours: string;
  callStatus: CallStatus;
  spokeTo?: SpokeTo;
  parentReason?: string;
  remark?: string;
  lastContactedAt?: string;
  contactNumber: string;
  isDemo?: boolean;
}

export interface THoliday {
  id: string;
  date: string;
  title: string;
  type: 'Institute Holiday' | 'Class Cancelled' | 'Teacher Unavailable' | 'Other';
  reason: string;
  branchName?: string;
  appliedTo?: 'all' | 'selected';
  targetClasses?: string[];
  targetBatches?: string[];
  status?: 'active' | 'archived';
  isDemo?: boolean;
}

export interface TAuditLog {
  id: string;
  timestamp: string; // ISO or formatted
  user: string;
  role: UserRole;
  action: 
    | 'Student Added' 
    | 'Student Edited' 
    | 'Student Transferred' 
    | 'Student Archived' 
    | 'Student Restored' 
    | 'Student Deleted'
    | 'Class Added'
    | 'Class Edited'
    | 'Class Archived'
    | 'Class Restored'
    | 'Class Deleted'
    | 'Batch Added'
    | 'Batch Edited'
    | 'Batch Archived'
    | 'Batch Restored'
    | 'Batch Deleted'
    | 'Teacher Added'
    | 'Teacher Edited'
    | 'Teacher Archived'
    | 'Teacher Restored'
    | 'Teacher Deleted'
    | 'Subject Added'
    | 'Subject Edited'
    | 'Subject Archived'
    | 'Subject Restored'
    | 'Subject Deleted'
    | 'Schedule Added'
    | 'Schedule Rescheduled'
    | 'Schedule Cancelled'
    | 'Schedule Deleted'
    | 'Attendance Edited'
    | 'Attendance Voided'
    | 'Holiday Declared'
    | 'Holiday Edited'
    | 'Holiday Archived'
    | 'Holiday Deleted'
    | 'Leave Added'
    | 'Leave Approved'
    | 'Leave Rejected'
    | 'Leave Deleted'
    | 'Session Started'
    | 'Session Completed'
    | 'Audit Logs Cleared'
    | 'Audit Log Deleted'
    | 'Demo Data Reset'
    | 'Demo Data Cleared'
    | string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  dependentRecordsDeleted?: number;
}

// -----------------------------------------------------------------------------
// HELPER CALCULATIONS
// -----------------------------------------------------------------------------

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numbersOnly = clean.replace(/[^\d:]/g, '');
  const parts = numbersOnly.split(':').map(Number);
  let hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function formatMinutesToDuration(mins: number): string {
  if (mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getCurrentTimeFormatted(): string {
  const d = new Date();
  let hours = d.getHours();
  const mins = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minsStr = mins < 10 ? '0' + mins : mins;
  const hoursStr = hours < 10 ? '0' + hours : hours;
  return `${hoursStr}:${minsStr} ${ampm}`;
}

export function calculateStudentAttendanceTiming(
  scheduledStart: string,
  scheduledEnd: string,
  checkIn?: string,
  checkOut?: string,
  isSessionCompleted: boolean = false
): { attendedMinutes: number; missedMinutes: number; extraMinutes: number } {
  const schedStartMin = parseTimeToMinutes(scheduledStart);
  const schedEndMin = parseTimeToMinutes(scheduledEnd);
  const schedTotal = Math.max(0, schedEndMin - schedStartMin);

  if (!checkIn) {
    return { attendedMinutes: 0, missedMinutes: schedTotal, extraMinutes: 0 };
  }

  const checkInMin = parseTimeToMinutes(checkIn);
  let checkOutMin = checkOut ? parseTimeToMinutes(checkOut) : (isSessionCompleted ? schedEndMin : parseTimeToMinutes(getCurrentTimeFormatted()));

  if (checkOutMin < checkInMin) {
    checkOutMin = checkInMin;
  }

  const actualAttended = Math.max(0, checkOutMin - checkInMin);
  const lateMinutes = Math.max(0, checkInMin - schedStartMin);
  const earlyLeaveMinutes = isSessionCompleted && checkOut ? Math.max(0, schedEndMin - checkOutMin) : 0;
  
  const missedMinutes = Math.min(schedTotal, lateMinutes + earlyLeaveMinutes);
  const extraMinutes = Math.max(0, checkOutMin - schedEndMin);

  return {
    attendedMinutes: actualAttended,
    missedMinutes,
    extraMinutes,
  };
}

// -----------------------------------------------------------------------------
// DATE NORMALIZATION & BATCH APPLICABILITY RESOLUTION
// -----------------------------------------------------------------------------

export function normalizeDateString(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const dmyMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const monthStr = dmyMatch[2].slice(0, 3).toLowerCase();
    const year = dmyMatch[3];
    const monthNames: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    };
    const month = monthNames[monthStr] || '01';
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return trimmed;
}

export function formatDateDisplay(dateStr: string): string {
  const norm = normalizeDateString(dateStr);
  if (!norm || !norm.includes('-')) return dateStr;
  const parts = norm.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return dateStr;
  const [y, m, d] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d).padStart(2, '0')} ${months[m - 1] || 'Jan'} ${y}`;
}

export function formatMinutesToHoursDisplay(minutes: number): string {
  if (minutes <= 0) return '0h';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getStudentBatchOnDate(student: TStudent, dateStr: string): string {
  const normDate = normalizeDateString(dateStr);
  if (!student.batchHistory || student.batchHistory.length === 0) {
    return student.batchId || student.batchName;
  }
  const sorted = [...student.batchHistory].sort((a, b) =>
    normalizeDateString(a.effectiveDate).localeCompare(normalizeDateString(b.effectiveDate))
  );

  for (const transfer of sorted) {
    const eff = normalizeDateString(transfer.effectiveDate);
    if (normDate < eff) {
      return transfer.fromBatchId || transfer.fromBatchName;
    }
  }
  const last = sorted[sorted.length - 1];
  return last.toBatchId || last.toBatchName;
}

export function isClassApplicableToStudent(
  student: TStudent,
  sessionDate: string,
  sessionBatchId: string
): boolean {
  const normSessionDate = normalizeDateString(sessionDate);
  const normAdmissionDate = normalizeDateString(student.admissionDate);

  // If class was conducted before the student was admitted, NOT applicable
  if (normAdmissionDate && normSessionDate < normAdmissionDate) {
    return false;
  }

  // If student has an exit date and class is after exit date, NOT applicable
  if (student.exitDate) {
    const normExitDate = normalizeDateString(student.exitDate);
    if (normSessionDate > normExitDate) {
      return false;
    }
  }

  const activeBatch = getStudentBatchOnDate(student, sessionDate);
  const b1 = (activeBatch || '').toLowerCase().replace(/^batch\s*/i, '').trim();
  const b2 = (sessionBatchId || '').toLowerCase().replace(/^batch\s*/i, '').trim();
  return b1 === b2;
}

export function isHolidayOnDate(
  holidays: THoliday[] | undefined,
  dateStr: string,
  batchIdOrName?: string
): THoliday | null {
  if (!holidays || holidays.length === 0) return null;
  const normDate = normalizeDateString(dateStr);
  const cleanBatch = (batchIdOrName || '').toLowerCase().replace(/^batch\s*/i, '').trim();

  for (const h of holidays) {
    if (h.status === 'archived') continue;
    if (normalizeDateString(h.date) !== normDate) continue;

    if (h.appliedTo === 'selected') {
      if (cleanBatch && h.targetBatches && h.targetBatches.length > 0) {
        const matches = h.targetBatches.some(
          tb => tb.toLowerCase().replace(/^batch\s*/i, '').trim() === cleanBatch
        );
        if (!matches) continue;
      }
    }
    return h;
  }
  return null;
}

// -----------------------------------------------------------------------------
// SEED DATA - REALISTIC EDUCATIONAL INSTITUTE
// -----------------------------------------------------------------------------

export const SEED_CLASSES: TClass[] = [
  // 1. Budh Vihar
  { id: 'c9', name: '9th', displayName: 'Class 9th (CBSE)', division: 'CBSE', branchId: 'budh-vihar', academicSession: '2026-27', order: 1, batches: ['9A', '9B'], status: 'active', createdAt: '2026-03-01', isDemo: true },
  { id: 'c10', name: '10th', displayName: 'Class 10th (CBSE Board)', division: 'CBSE Board', branchId: 'budh-vihar', academicSession: '2026-27', order: 2, batches: ['10A', '10B'], status: 'active', createdAt: '2026-03-01', isDemo: true },

  // 2. Krishan Vihar
  { id: 'c11', name: '11th', displayName: 'Class 11th (JEE/NEET)', division: 'JEE/NEET', branchId: 'krishan-vihar', academicSession: '2026-27', order: 1, batches: ['11A'], status: 'active', createdAt: '2026-03-01', isDemo: true },
  { id: 'c12', name: '12th', displayName: 'Class 12th (Board & Entrance)', division: 'Board & Entrance', branchId: 'krishan-vihar', academicSession: '2026-27', order: 2, batches: ['12A'], status: 'active', createdAt: '2026-03-01', isDemo: true },

  // 3. Mangol Puri
  { id: 'c9-mp', name: '9th', displayName: 'Class 9th (FOUNDATION)', division: 'FOUNDATION', branchId: 'mangolpuri', academicSession: '2026-27', order: 1, batches: ['9-MP'], status: 'active', createdAt: '2026-03-01', isDemo: true },
  { id: 'c10-mp', name: '10th', displayName: 'Class 10th (BOARD PREP)', division: 'BOARD PREP', branchId: 'mangolpuri', academicSession: '2026-27', order: 2, batches: ['10-MP'], status: 'active', createdAt: '2026-03-01', isDemo: true },

  // 4. Mukherjee Nagar
  { id: 'c11-mn', name: '11th', displayName: 'Class 11th (NEET TARGET)', division: 'NEET TARGET', branchId: 'mukherjee-nagar', academicSession: '2026-27', order: 1, batches: ['11-MN'], status: 'active', createdAt: '2026-03-01', isDemo: true },
  { id: 'c12-mn', name: '12th', displayName: 'Class 12th (JEE ADVANCED)', division: 'JEE ADVANCED', branchId: 'mukherjee-nagar', academicSession: '2026-27', order: 2, batches: ['12-MN'], status: 'active', createdAt: '2026-03-01', isDemo: true },
];

export const SEED_BATCHES: TBatch[] = [
  // Budh Vihar
  { id: '9A', name: 'Batch 9A', classId: 'c9', className: '9th', room: 'Room 101', status: 'active', branchId: 'budh-vihar', classTime: '04:00 PM - 06:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 2400, courseFee: 28800, subjects: ['Maths', 'Science', 'English', 'Social Studies'], startDate: '2026-04-01', description: 'Morning foundational batch', isDemo: true },
  { id: '9B', name: 'Batch 9B', classId: 'c9', className: '9th', room: 'Room 102', status: 'active', branchId: 'budh-vihar', classTime: '06:00 PM - 08:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 2400, courseFee: 28800, subjects: ['Maths', 'Science', 'English', 'Social Studies'], startDate: '2026-04-01', description: 'Afternoon standard batch', isDemo: true },
  { id: '10A', name: 'Batch 10A', classId: 'c10', className: '10th', room: 'Hall A', status: 'active', branchId: 'budh-vihar', classTime: '04:00 PM - 06:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 2600, courseFee: 31200, subjects: ['Maths', 'Science', 'English', 'Social Studies'], startDate: '2026-03-25', description: 'Board examination primary batch', isDemo: true },
  { id: '10B', name: 'Batch 10B', classId: 'c10', className: '10th', room: 'Hall B', status: 'active', branchId: 'budh-vihar', classTime: '06:00 PM - 08:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 2600, courseFee: 31200, subjects: ['Maths', 'Science', 'English', 'Social Studies'], startDate: '2026-04-01', description: 'Board examination evening batch', isDemo: true },

  // Krishan Vihar
  { id: '11A', name: 'Batch 11A', classId: 'c11', className: '11th', room: 'Lab 1', status: 'active', branchId: 'krishan-vihar', classTime: '03:00 PM - 05:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 3000, courseFee: 36000, subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], startDate: '2026-04-01', description: 'Science & Entrance intensive', isDemo: true },
  { id: '12A', name: 'Batch 12A', classId: 'c12', className: '12th', room: 'Auditorium', status: 'active', branchId: 'krishan-vihar', classTime: '05:00 PM - 07:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 3200, courseFee: 38400, subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'], startDate: '2026-04-01', description: 'Target 2027 competitive batch', isDemo: true },

  // Mangol Puri
  { id: '9-MP', name: 'Batch 9-MP', classId: 'c9-mp', className: '9th', room: 'Room 201', status: 'active', branchId: 'mangolpuri', classTime: '04:00 PM - 06:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 2200, courseFee: 26400, subjects: ['Maths', 'Science', 'English'], startDate: '2026-04-01', description: 'Mangol Puri Foundation Batch', isDemo: true },
  { id: '10-MP', name: 'Batch 10-MP', classId: 'c10-mp', className: '10th', room: 'Room 202', status: 'active', branchId: 'mangolpuri', classTime: '06:00 PM - 08:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 2400, courseFee: 28800, subjects: ['Maths', 'Science', 'English'], startDate: '2026-04-01', description: 'Mangol Puri Board Prep Batch', isDemo: true },

  // Mukherjee Nagar
  { id: '11-MN', name: 'Batch 11-MN', classId: 'c11-mn', className: '11th', room: 'Hall 1', status: 'active', branchId: 'mukherjee-nagar', classTime: '08:00 AM - 10:00 AM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 3500, courseFee: 42000, subjects: ['Physics', 'Chemistry', 'Biology'], startDate: '2026-04-01', description: 'Mukherjee Nagar NEET Target Batch', isDemo: true },
  { id: '12-MN', name: 'Batch 12-MN', classId: 'c12-mn', className: '12th', room: 'Hall 2', status: 'active', branchId: 'mukherjee-nagar', classTime: '10:00 AM - 12:00 PM', duration: '01 Apr 2026 – 31 Mar 2027', monthlyFee: 3800, courseFee: 45600, subjects: ['Physics', 'Chemistry', 'Mathematics'], startDate: '2026-04-01', description: 'Mukherjee Nagar JEE Advanced Batch', isDemo: true },
];

export const SEED_TEACHERS: TTeacher[] = [
  { id: 't1', name: 'Amod Sharma', subject: 'Mathematics', phone: '+91 98765 43210', email: 'amod@idleducation.com', status: 'active', joiningDate: '2024-06-01', assignedClasses: ['9th', '11th'], assignedBatches: ['9A', '11A'], notes: 'Academic Director & Math Head', isDemo: true },
  { id: 't2', name: 'Nitin Vijay Sir', subject: 'English & Physics', phone: '+91 98765 43211', email: 'nitin@idleducation.com', status: 'active', joiningDate: '2024-07-15', assignedClasses: ['9th', '10th'], assignedBatches: ['9B', '10A'], isDemo: true },
  { id: 't3', name: 'Rakesh Sir', subject: 'Science & Chemistry', phone: '+91 98765 43212', email: 'rakesh@idleducation.com', status: 'active', joiningDate: '2025-01-10', assignedClasses: ['9th', '10th'], assignedBatches: ['9A', '10B'], isDemo: true },
  { id: 't4', name: 'Priya Ma\'am', subject: 'Biology & Chemistry', phone: '+91 98765 43213', email: 'priya@idleducation.com', status: 'active', joiningDate: '2025-03-01', assignedClasses: ['11th', '12th'], assignedBatches: ['12A'], isDemo: true },
  { id: 't5', name: 'Sanjay Verma Sir', subject: 'Social Science (SST)', phone: '+91 98765 43214', email: 'sanjay@idleducation.com', status: 'active', joiningDate: '2025-04-01', assignedClasses: ['9th', '10th'], assignedBatches: ['9A', '9B'], isDemo: true },
];

export const SEED_SUBJECTS: TSubject[] = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH-01', classes: ['9th', '10th', '11th', '12th'], teachers: ['Amod Sharma', 'Nitin Vijay Sir'], status: 'active', avgAttendance: '88%', isDemo: true },
  { id: 'sub-2', name: 'Science', code: 'SCI-01', classes: ['9th', '10th'], teachers: ['Rakesh Sir'], status: 'active', avgAttendance: '82%', isDemo: true },
  { id: 'sub-3', name: 'Physics', code: 'PHY-01', classes: ['11th', '12th'], teachers: ['Nitin Vijay Sir', 'Amod Sharma'], status: 'active', avgAttendance: '91%', isDemo: true },
  { id: 'sub-4', name: 'Chemistry', code: 'CHEM-01', classes: ['11th', '12th'], teachers: ['Priya Ma\'am', 'Rakesh Sir'], status: 'active', avgAttendance: '86%', isDemo: true },
  { id: 'sub-5', name: 'Biology', code: 'BIO-01', classes: ['11th', '12th'], teachers: ['Priya Ma\'am'], status: 'active', avgAttendance: '90%', isDemo: true },
  { id: 'sub-6', name: 'English', code: 'ENG-01', classes: ['9th', '10th'], teachers: ['Nitin Vijay Sir'], status: 'active', avgAttendance: '93%', isDemo: true },
  { id: 'sub-7', name: 'Social Science (SST)', code: 'SST-01', classes: ['9th', '10th'], teachers: ['Sanjay Verma Sir'], status: 'active', avgAttendance: '85%', isDemo: true },
];

export const SEED_HOLIDAYS: THoliday[] = [
  { id: 'h1', date: '2026-09-16', title: 'Ganesh Chaturthi', type: 'Institute Holiday', reason: 'Festival Holiday for all batches and staff.', status: 'active', isDemo: true },
  { id: 'h2', date: '2026-10-02', title: 'Gandhi Jayanti', type: 'Institute Holiday', reason: 'National Holiday', status: 'active', isDemo: true },
];

export const SEED_AUDIT_LOGS: TAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-11 04:02 PM',
    user: 'Amod Sharma',
    role: 'Super Admin',
    action: 'Attendance Edited',
    entity: 'Student Attendance',
    entityId: 's-9a-7',
    previousValue: 'Not Arrived',
    newValue: 'Present (Check-in 04:05 PM)',
    reason: 'Student arrived at classroom gate with valid pass.',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-10 11:30 AM',
    user: 'Amod Sharma',
    role: 'Super Admin',
    action: 'Student Added',
    entity: 'Student',
    entityId: 's-9a-7',
    newValue: 'Aman Kumar enrolled in Class 9th (Batch 9A)',
    reason: 'New admission approved.',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-09 03:15 PM',
    user: 'Admin',
    role: 'Admin',
    action: 'Schedule Rescheduled',
    entity: 'Class Schedule',
    entityId: 'sch-4',
    previousValue: '03:00 - 05:00 PM',
    newValue: '04:00 - 06:00 PM',
    reason: 'Lab maintenance completed late.',
  },
];

// Generate exactly 4 realistic students per batch across all branches
export function generateSeedStudents(): TStudent[] {
  const students: TStudent[] = [
    // -------------------------------------------------------------
    // BUDH VIHAR BRANCH (Total: 16 Students, 4 per batch)
    // -------------------------------------------------------------
    // Class 9th — Batch 9A
    {
      id: 's-bv-9a-1',
      name: 'Aarav Sharma',
      rollNo: 1,
      classId: 'c9',
      className: '9th',
      batchId: '9A',
      batchName: 'Batch 9A',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-04-12',
      gender: 'Male',
      phone: '+91 98110 11001',
      parentName: 'Rajesh Sharma (Father)',
      parentPhone: '+91 99110 11001',
      address: 'Budh Vihar Phase-1, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-9a-2',
      name: 'Bhavya Singh',
      rollNo: 2,
      classId: 'c9',
      className: '9th',
      batchId: '9A',
      batchName: 'Batch 9A',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-06-25',
      gender: 'Female',
      phone: '+91 98110 11002',
      parentName: 'Manoj Singh (Father)',
      parentPhone: '+91 99110 11002',
      address: 'Budh Vihar Phase-2, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-9a-3',
      name: 'Karan Mehta',
      rollNo: 3,
      classId: 'c9',
      className: '9th',
      batchId: '9A',
      batchName: 'Batch 9A',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-08-14',
      gender: 'Male',
      phone: '+91 98110 11003',
      parentName: 'Sunita Mehta (Mother)',
      parentPhone: '+91 99110 11003',
      address: 'Sector 24, Rohini, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-9a-4',
      name: 'Neha Sharma',
      rollNo: 4,
      classId: 'c9',
      className: '9th',
      batchId: '9A',
      batchName: 'Batch 9A',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-09-19',
      gender: 'Female',
      phone: '+91 98110 11004',
      parentName: 'Pawan Sharma (Father)',
      parentPhone: '+91 99110 11004',
      address: 'Budh Vihar Main Road, Delhi',
      createdAt: '2026-04-01',
    },

    // Class 9th — Batch 9B
    {
      id: 's-bv-9b-1',
      name: 'Diya Singh',
      rollNo: 1,
      classId: 'c9',
      className: '9th',
      batchId: '9B',
      batchName: 'Batch 9B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-05-18',
      gender: 'Female',
      phone: '+91 98110 12001',
      parentName: 'Vikram Singh (Father)',
      parentPhone: '+91 99110 12001',
      address: 'Budh Vihar Phase-1, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-9b-2',
      name: 'Rohit Kumar',
      rollNo: 2,
      classId: 'c9',
      className: '9th',
      batchId: '9B',
      batchName: 'Batch 9B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-07-22',
      gender: 'Male',
      phone: '+91 98110 12002',
      parentName: 'Ajay Kumar (Father)',
      parentPhone: '+91 99110 12002',
      address: 'Pooth Kalan, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-9b-3',
      name: 'Aditi Chauhan',
      rollNo: 3,
      classId: 'c9',
      className: '9th',
      batchId: '9B',
      batchName: 'Batch 9B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-10-05',
      gender: 'Female',
      phone: '+91 98110 12003',
      parentName: 'Ramesh Chauhan (Father)',
      parentPhone: '+91 99110 12003',
      address: 'Vijay Vihar, Rohini, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-9b-4',
      name: 'Ayush Bajpai',
      rollNo: 4,
      classId: 'c9',
      className: '9th',
      batchId: '9B',
      batchName: 'Batch 9B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-11-12',
      gender: 'Male',
      phone: '+91 98110 12004',
      parentName: 'Santosh Bajpai (Father)',
      parentPhone: '+91 99110 12004',
      address: 'Budh Vihar Phase-2, Delhi',
      createdAt: '2026-04-01',
    },

    // Class 10th — Batch 10A
    {
      id: 's-bv-10a-1',
      name: 'Aryan Kapoor',
      rollNo: 1,
      classId: 'c10',
      className: '10th',
      batchId: '10A',
      batchName: 'Batch 10A',
      branchId: 'budh-vihar',
      admissionDate: '2026-03-25',
      status: 'active',
      dob: '2010-03-15',
      gender: 'Male',
      phone: '+91 98110 13001',
      parentName: 'Sanjay Kapoor (Father)',
      parentPhone: '+91 99110 13001',
      address: 'Budh Vihar Phase-1, Delhi',
      createdAt: '2026-03-25',
    },
    {
      id: 's-bv-10a-2',
      name: 'Akash Tripathi',
      rollNo: 2,
      classId: 'c10',
      className: '10th',
      batchId: '10A',
      batchName: 'Batch 10A',
      branchId: 'budh-vihar',
      admissionDate: '2026-03-25',
      status: 'active',
      dob: '2010-06-11',
      gender: 'Male',
      phone: '+91 98110 13002',
      parentName: 'Vinod Tripathi (Father)',
      parentPhone: '+91 99110 13002',
      address: 'Rithala, Rohini, Delhi',
      createdAt: '2026-03-25',
    },
    {
      id: 's-bv-10a-3',
      name: 'Disha Mathur',
      rollNo: 3,
      classId: 'c10',
      className: '10th',
      batchId: '10A',
      batchName: 'Batch 10A',
      branchId: 'budh-vihar',
      admissionDate: '2026-03-25',
      status: 'active',
      dob: '2010-08-20',
      gender: 'Female',
      phone: '+91 98110 13003',
      parentName: 'Kavita Mathur (Mother)',
      parentPhone: '+91 99110 13003',
      address: 'Budh Vihar, Delhi',
      createdAt: '2026-03-25',
    },
    {
      id: 's-bv-10a-4',
      name: 'Farhan Ali',
      rollNo: 4,
      classId: 'c10',
      className: '10th',
      batchId: '10A',
      batchName: 'Batch 10A',
      branchId: 'budh-vihar',
      admissionDate: '2026-03-25',
      status: 'active',
      dob: '2010-10-03',
      gender: 'Male',
      phone: '+91 98110 13004',
      parentName: 'Imran Ali (Father)',
      parentPhone: '+91 99110 13004',
      address: 'Mangolpuri Block E, Delhi',
      createdAt: '2026-03-25',
    },

    // Class 10th — Batch 10B
    {
      id: 's-bv-10b-1',
      name: 'Isha Batra',
      rollNo: 1,
      classId: 'c10',
      className: '10th',
      batchId: '10B',
      batchName: 'Batch 10B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-04-18',
      gender: 'Female',
      phone: '+91 98110 14001',
      parentName: 'Kamal Batra (Father)',
      parentPhone: '+91 99110 14001',
      address: 'Budh Vihar Phase-1, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-10b-2',
      name: 'Keshav Goyal',
      rollNo: 2,
      classId: 'c10',
      className: '10th',
      batchId: '10B',
      batchName: 'Batch 10B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-05-29',
      gender: 'Male',
      phone: '+91 98110 14002',
      parentName: 'Praveen Goyal (Father)',
      parentPhone: '+91 99110 14002',
      address: 'Sector 23, Rohini, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-10b-3',
      name: 'Lavanya Saxena',
      rollNo: 3,
      classId: 'c10',
      className: '10th',
      batchId: '10B',
      batchName: 'Batch 10B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-09-08',
      gender: 'Female',
      phone: '+91 98110 14003',
      parentName: 'Alok Saxena (Father)',
      parentPhone: '+91 99110 14003',
      address: 'Budh Vihar, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-bv-10b-4',
      name: 'Manish Bisht',
      rollNo: 4,
      classId: 'c10',
      className: '10th',
      batchId: '10B',
      batchName: 'Batch 10B',
      branchId: 'budh-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-11-21',
      gender: 'Male',
      phone: '+91 98110 14004',
      parentName: 'Harish Bisht (Father)',
      parentPhone: '+91 99110 14004',
      address: 'Begumpur, Delhi',
      createdAt: '2026-04-01',
    },

    // -------------------------------------------------------------
    // KRISHAN VIHAR BRANCH (Total: 8 Students, 4 per batch)
    // -------------------------------------------------------------
    // Class 11th — Batch 11A
    {
      id: 's-kv-11a-1',
      name: 'Rohan Verma',
      rollNo: 1,
      classId: 'c11',
      className: '11th',
      batchId: '11A',
      batchName: 'Batch 11A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-02-14',
      gender: 'Male',
      phone: '+91 98110 21001',
      parentName: 'Satish Verma (Father)',
      parentPhone: '+91 99110 21001',
      address: 'Krishan Vihar Main, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-kv-11a-2',
      name: 'Sakshi Gupta',
      rollNo: 2,
      classId: 'c11',
      className: '11th',
      batchId: '11A',
      batchName: 'Batch 11A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-04-19',
      gender: 'Female',
      phone: '+91 98110 21002',
      parentName: 'Ashok Gupta (Father)',
      parentPhone: '+91 99110 21002',
      address: 'Sultanpuri Road, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-kv-11a-3',
      name: 'Aman Kumar',
      rollNo: 3,
      classId: 'c11',
      className: '11th',
      batchId: '11A',
      batchName: 'Batch 11A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-07-28',
      gender: 'Male',
      phone: '+91 98110 21003',
      parentName: 'Naresh Kumar (Father)',
      parentPhone: '+91 99110 21003',
      address: 'Krishan Vihar Pocket A, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-kv-11a-4',
      name: 'Mohit Verma',
      rollNo: 4,
      classId: 'c11',
      className: '11th',
      batchId: '11A',
      batchName: 'Batch 11A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-10-15',
      gender: 'Male',
      phone: '+91 98110 21004',
      parentName: 'Rajiv Verma (Father)',
      parentPhone: '+91 99110 21004',
      address: 'Rohini Sector 20, Delhi',
      createdAt: '2026-04-01',
    },

    // Class 12th — Batch 12A
    {
      id: 's-kv-12a-1',
      name: 'Devansh Joshi',
      rollNo: 1,
      classId: 'c12',
      className: '12th',
      batchId: '12A',
      batchName: 'Batch 12A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-01-20',
      gender: 'Male',
      phone: '+91 98110 22001',
      parentName: 'Dinesh Joshi (Father)',
      parentPhone: '+91 99110 22001',
      address: 'Krishan Vihar, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-kv-12a-2',
      name: 'Ishita Roy',
      rollNo: 2,
      classId: 'c12',
      className: '12th',
      batchId: '12A',
      batchName: 'Batch 12A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-03-14',
      gender: 'Female',
      phone: '+91 98110 22002',
      parentName: 'Subhash Roy (Father)',
      parentPhone: '+91 99110 22002',
      address: 'Rohini Sector 21, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-kv-12a-3',
      name: 'Kabir Malhotra',
      rollNo: 3,
      classId: 'c12',
      className: '12th',
      batchId: '12A',
      batchName: 'Batch 12A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-06-30',
      gender: 'Male',
      phone: '+91 98110 22003',
      parentName: 'Anil Malhotra (Father)',
      parentPhone: '+91 99110 22003',
      address: 'Krishan Vihar Phase-2, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-kv-12a-4',
      name: 'Meera Nair',
      rollNo: 4,
      classId: 'c12',
      className: '12th',
      batchId: '12A',
      batchName: 'Batch 12A',
      branchId: 'krishan-vihar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-09-09',
      gender: 'Female',
      phone: '+91 98110 22004',
      parentName: 'Geetha Nair (Mother)',
      parentPhone: '+91 99110 22004',
      address: 'Rohini Sector 22, Delhi',
      createdAt: '2026-04-01',
    },

    // -------------------------------------------------------------
    // MANGOL PURI BRANCH (Total: 8 Students, 4 per batch)
    // -------------------------------------------------------------
    // Class 9th — Batch 9-MP
    {
      id: 's-mp-9-1',
      name: 'Pranav Rao',
      rollNo: 1,
      classId: 'c9-mp',
      className: '9th',
      batchId: '9-MP',
      batchName: 'Batch 9-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-03-24',
      gender: 'Male',
      phone: '+91 98110 31001',
      parentName: 'Kishore Rao (Father)',
      parentPhone: '+91 99110 31001',
      address: 'Mangolpuri Block A, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mp-9-2',
      name: 'Riya Choudhary',
      rollNo: 2,
      classId: 'c9-mp',
      className: '9th',
      batchId: '9-MP',
      batchName: 'Batch 9-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-06-17',
      gender: 'Female',
      phone: '+91 98110 31002',
      parentName: 'Mukesh Choudhary (Father)',
      parentPhone: '+91 99110 31002',
      address: 'Mangolpuri Block B, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mp-9-3',
      name: 'Siddharth Jain',
      rollNo: 3,
      classId: 'c9-mp',
      className: '9th',
      batchId: '9-MP',
      batchName: 'Batch 9-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-08-05',
      gender: 'Male',
      phone: '+91 98110 31003',
      parentName: 'Vipul Jain (Father)',
      parentPhone: '+91 99110 31003',
      address: 'Mangolpuri Industrial Area, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mp-9-4',
      name: 'Tanvi Bhatia',
      rollNo: 4,
      classId: 'c9-mp',
      className: '9th',
      batchId: '9-MP',
      batchName: 'Batch 9-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-10-27',
      gender: 'Female',
      phone: '+91 98110 31004',
      parentName: 'Rekha Bhatia (Mother)',
      parentPhone: '+91 99110 31004',
      address: 'Mangolpuri Block D, Delhi',
      createdAt: '2026-04-01',
    },

    // Class 10th — Batch 10-MP
    {
      id: 's-mp-10-1',
      name: 'Utkarsh Saxena',
      rollNo: 1,
      classId: 'c10-mp',
      className: '10th',
      batchId: '10-MP',
      batchName: 'Batch 10-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-02-18',
      gender: 'Male',
      phone: '+91 98110 32001',
      parentName: 'Mahesh Saxena (Father)',
      parentPhone: '+91 99110 32001',
      address: 'Mangolpuri Block C, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mp-10-2',
      name: 'Vanshika Tiwari',
      rollNo: 2,
      classId: 'c10-mp',
      className: '10th',
      batchId: '10-MP',
      batchName: 'Batch 10-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-05-14',
      gender: 'Female',
      phone: '+91 98110 32002',
      parentName: 'Pradeep Tiwari (Father)',
      parentPhone: '+91 99110 32002',
      address: 'Avantika, Rohini Sector 1, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mp-10-3',
      name: 'Yash Mittal',
      rollNo: 3,
      classId: 'c10-mp',
      className: '10th',
      batchId: '10-MP',
      batchName: 'Batch 10-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-07-29',
      gender: 'Male',
      phone: '+91 98110 32003',
      parentName: 'Sunil Mittal (Father)',
      parentPhone: '+91 99110 32003',
      address: 'Mangolpuri Block K, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mp-10-4',
      name: 'Zoya Khan',
      rollNo: 4,
      classId: 'c10-mp',
      className: '10th',
      batchId: '10-MP',
      batchName: 'Batch 10-MP',
      branchId: 'mangolpuri',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2010-12-04',
      gender: 'Female',
      phone: '+91 98110 32004',
      parentName: 'Tariq Khan (Father)',
      parentPhone: '+91 99110 32004',
      address: 'Mangolpuri Block H, Delhi',
      createdAt: '2026-04-01',
    },

    // -------------------------------------------------------------
    // MUKHERJEE NAGAR BRANCH (Total: 8 Students, 4 per batch)
    // -------------------------------------------------------------
    // Class 11th — Batch 11-MN
    {
      id: 's-mn-11-1',
      name: 'Raghav Bansal',
      rollNo: 1,
      classId: 'c11-mn',
      className: '11th',
      batchId: '11-MN',
      batchName: 'Batch 11-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-03-09',
      gender: 'Male',
      phone: '+91 98110 41001',
      parentName: 'Hari Bansal (Father)',
      parentPhone: '+91 99110 41001',
      address: 'Commercial Complex, Mukherjee Nagar, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mn-11-2',
      name: 'Riddhi Chopra',
      rollNo: 2,
      classId: 'c11-mn',
      className: '11th',
      batchId: '11-MN',
      batchName: 'Batch 11-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-06-22',
      gender: 'Female',
      phone: '+91 98110 41002',
      parentName: 'Deepak Chopra (Father)',
      parentPhone: '+91 99110 41002',
      address: 'Batra Cinema Road, Mukherjee Nagar, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mn-11-3',
      name: 'Rishabh Tyagi',
      rollNo: 3,
      classId: 'c11-mn',
      className: '11th',
      batchId: '11-MN',
      batchName: 'Batch 11-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-08-16',
      gender: 'Male',
      phone: '+91 98110 41003',
      parentName: 'Devendra Tyagi (Father)',
      parentPhone: '+91 99110 41003',
      address: 'Indra Vihar, Mukherjee Nagar, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mn-11-4',
      name: 'Samaira Dutta',
      rollNo: 4,
      classId: 'c11-mn',
      className: '11th',
      batchId: '11-MN',
      batchName: 'Batch 11-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-11-30',
      gender: 'Female',
      phone: '+91 98110 41004',
      parentName: 'Gautam Dutta (Father)',
      parentPhone: '+91 99110 41004',
      address: 'Hudson Lane, Kingsway Camp, Delhi',
      createdAt: '2026-04-01',
    },

    // Class 12th — Batch 12-MN
    {
      id: 's-mn-12-1',
      name: 'Saurabh Chandra',
      rollNo: 1,
      classId: 'c12-mn',
      className: '12th',
      batchId: '12-MN',
      batchName: 'Batch 12-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-02-11',
      gender: 'Male',
      phone: '+91 98110 42001',
      parentName: 'Bipin Chandra (Father)',
      parentPhone: '+91 99110 42001',
      address: 'Mukherjee Nagar West, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mn-12-2',
      name: 'Shubham Jindal',
      rollNo: 2,
      classId: 'c12-mn',
      className: '12th',
      batchId: '12-MN',
      batchName: 'Batch 12-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-04-25',
      gender: 'Male',
      phone: '+91 98110 42002',
      parentName: 'Omprakash Jindal (Father)',
      parentPhone: '+91 99110 42002',
      address: 'Nehru Vihar, Mukherjee Nagar, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mn-12-3',
      name: 'Simran Bedi',
      rollNo: 3,
      classId: 'c12-mn',
      className: '12th',
      batchId: '12-MN',
      batchName: 'Batch 12-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-07-19',
      gender: 'Female',
      phone: '+91 98110 42003',
      parentName: 'Harpreet Bedi (Father)',
      parentPhone: '+91 99110 42003',
      address: 'Model Town-3, Delhi',
      createdAt: '2026-04-01',
    },
    {
      id: 's-mn-12-4',
      name: 'Yuvraj Thakur',
      rollNo: 4,
      classId: 'c12-mn',
      className: '12th',
      batchId: '12-MN',
      batchName: 'Batch 12-MN',
      branchId: 'mukherjee-nagar',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2008-10-08',
      gender: 'Male',
      phone: '+91 98110 42004',
      parentName: 'Ranveer Thakur (Father)',
      parentPhone: '+91 99110 42004',
      address: 'Mukherjee Nagar Main, Delhi',
      createdAt: '2026-04-01',
    },
  ];

  return students.map(s => ({ ...s, isDemo: true }));
}

export const SEED_SCHEDULE_ITEMS: TScheduleItem[] = [
  {
    id: 'sch-1',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    durationMinutes: 60,
    classId: 'c10',
    className: '10th',
    batchId: '10A',
    batchName: '10A',
    subject: 'Mathematics',
    teacherId: 't2',
    teacherName: 'Nitin Vijay Sir',
    type: 'regular',
    status: 'Completed',
    room: 'Hall A',
    isDemo: true,
  },
  {
    id: 'sch-2',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    durationMinutes: 60,
    classId: 'c11',
    className: '11th',
    batchId: '11A',
    batchName: '11A',
    subject: 'Physics',
    teacherId: 't1',
    teacherName: 'Amod Sharma',
    type: 'regular',
    status: 'Completed',
    room: 'Lab 1',
    isDemo: true,
  },
  {
    id: 'sch-3',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '12:00 PM',
    endTime: '01:00 PM',
    durationMinutes: 60,
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Science',
    teacherId: 't3',
    teacherName: 'Rakesh Sir',
    type: 'regular',
    status: 'Completed',
    room: 'Room 101',
    isDemo: true,
  },
  {
    id: 'sch-4',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '04:00 PM',
    endTime: '06:00 PM',
    durationMinutes: 120,
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    teacherId: 't1',
    teacherName: 'Amod Sharma',
    type: 'regular',
    status: 'Ongoing',
    room: 'Room 101',
    isDemo: true,
  },
  {
    id: 'sch-5',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '05:00 PM',
    endTime: '06:00 PM',
    durationMinutes: 60,
    classId: 'c9',
    className: '9th',
    batchId: '9B',
    batchName: '9B',
    subject: 'English',
    teacherId: 't2',
    teacherName: 'Nitin Vijay Sir',
    type: 'regular',
    status: 'Upcoming',
    room: 'Room 102',
    isDemo: true,
  },
  {
    id: 'sch-6',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    durationMinutes: 60,
    classId: 'c10',
    className: '10th',
    batchId: '10B',
    batchName: '10B',
    subject: 'Science',
    teacherId: 't3',
    teacherName: 'Rakesh Sir',
    type: 'one_time',
    status: 'Upcoming',
    room: 'Hall B',
    isDemo: true,
  },
  {
    id: 'sch-7',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '07:00 PM',
    endTime: '08:00 PM',
    durationMinutes: 60,
    classId: 'c12',
    className: '12th',
    batchId: '12A',
    batchName: '12A',
    subject: 'Chemistry',
    teacherId: 't4',
    teacherName: 'Priya Ma\'am',
    type: 'extra',
    status: 'Upcoming',
    room: 'Auditorium',
    isDemo: true,
  },
  {
    id: 'sch-8',
    date: '2026-09-11',
    dayOfWeek: 4,
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    durationMinutes: 90,
    classId: 'c11',
    className: '11th',
    batchId: '11A',
    batchName: '11A',
    subject: 'Mathematics',
    teacherId: 't1',
    teacherName: 'Amod Sharma',
    type: 'regular',
    status: 'Completed',
    room: 'Lab 1',
    isDemo: true,
  },
];

// Active Live Attendance: Initial populated session across seeded students
export function generateInitialLiveSession(students: TStudent[]): TClassSession {
  const activeStudents = students.filter(s => s.status === 'active');
  const studentRecords: Record<string, TStudentSessionRecord> = {};

  activeStudents.forEach((st, idx) => {
    // Distribute realistic initial statuses across all batches:
    // Roll 1: present, Roll 2: present, Roll 3: absent, Roll 4: present/leave
    const mod = (st.rollNo || (idx % 4) + 1) % 4;
    let stStatus: StudentStatus = 'present';
    let checkIn: string | undefined = '09:00 AM';

    if (mod === 1) {
      stStatus = 'present';
      checkIn = '04:00 PM';
    } else if (mod === 2) {
      stStatus = 'present';
      checkIn = '04:05 PM';
    } else if (mod === 3) {
      stStatus = 'absent';
      checkIn = undefined;
    } else {
      stStatus = (idx % 8 === 0) ? 'leave' : 'present';
      checkIn = stStatus === 'leave' ? undefined : '04:12 PM';
    }

    const timing = checkIn
      ? calculateStudentAttendanceTiming('04:00 PM', '06:00 PM', checkIn)
      : { attendedMinutes: 0, missedMinutes: 0, extraMinutes: 0 };

    studentRecords[st.id] = {
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      status: stStatus,
      checkInTime: checkIn,
      attendedMinutes: timing.attendedMinutes,
      missedMinutes: timing.missedMinutes,
      extraMinutes: timing.extraMinutes,
      isOngoing: stStatus === 'present',
      isDemo: true,
    };
  });

  return {
    id: 'session-live-master',
    scheduleId: 'sch-live-master',
    date: '2026-09-11',
    classId: 'all',
    className: 'All Classes',
    batchId: 'all',
    batchName: 'All Batches',
    subject: 'Live Sessions',
    teacherName: 'Faculty Team',
    scheduledStartTime: '09:00 AM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 540,
    sessionStatus: 'Ongoing',
    startedAt: '09:00 AM',
    studentRecords,
    isDemo: true,
  };
}

export const SEED_LEAVE_REQUESTS: TLeaveRequest[] = [
  {
    id: 'lr-1',
    date: '2026-09-11',
    studentId: 's-9a-8',
    studentName: 'Mohit Verma',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    reason: 'Family Function',
    informedBy: 'Parent',
    status: 'Approved',
    remark: 'Informed in advance by father.',
    appliedOn: '2026-09-10',
  },
  {
    id: 'lr-2',
    date: '2026-09-10',
    studentId: 's-9b-1',
    studentName: 'Diya Singh',
    classId: 'c9',
    className: '9th',
    batchId: '9B',
    batchName: '9B',
    subject: 'English',
    reason: 'Fever',
    informedBy: 'Parent',
    status: 'Approved',
    remark: 'Medical rest advised.',
    appliedOn: '2026-09-09',
  },
  {
    id: 'lr-3',
    date: '2026-09-09',
    studentId: 's-9a-3',
    studentName: 'Karan Mehta',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    reason: 'Personal Work',
    informedBy: 'Student',
    status: 'Pending',
    remark: 'Waiting for parent confirmation.',
    appliedOn: '2026-09-09',
  },
  {
    id: 'lr-4',
    date: '2026-09-07',
    studentId: 's-9b-10',
    studentName: 'Neha Sharma',
    classId: 'c9',
    className: '9th',
    batchId: '9B',
    batchName: '9B',
    reason: 'Medical',
    informedBy: 'Parent',
    status: 'Approved',
    remark: 'Doctor appointment.',
    appliedOn: '2026-09-06',
  },
];

export const SEED_ABSENT_FOLLOWUPS: TAbsenceFollowUp[] = [
  {
    id: 'af-1',
    date: '2026-09-11',
    studentId: 's-9a-7',
    studentName: 'Aman Kumar',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    missedHours: '2h',
    callStatus: 'Not Contacted',
    contactNumber: '+91 99110 20006',
    remark: 'Needs immediate follow-up before evening session ends.',
  },
  {
    id: 'af-2',
    date: '2026-09-11',
    studentId: 's-9b-2',
    studentName: 'Rohit Kumar',
    classId: 'c9',
    className: '9th',
    batchId: '9B',
    batchName: '9B',
    subject: 'Science',
    missedHours: '1h',
    callStatus: 'Contacted',
    spokeTo: 'Father',
    parentReason: 'Mild fever. Will come tomorrow.',
    remark: 'Father confirmed attendance tomorrow.',
    lastContactedAt: '01:30 PM',
    contactNumber: '+91 99111 20001',
  },
  {
    id: 'af-3',
    date: '2026-09-10',
    studentId: 's-9a-3',
    studentName: 'Karan Mehta',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    missedHours: '2h',
    callStatus: 'Contacted',
    spokeTo: 'Mother',
    parentReason: 'Out of station for family emergency.',
    remark: 'Will return on Monday.',
    lastContactedAt: 'Yesterday 05:45 PM',
    contactNumber: '+91 99110 20002',
  },
  {
    id: 'af-4',
    date: '2026-09-09',
    studentId: 's-10a-2',
    studentName: 'Akash Tripathi',
    classId: 'c10',
    className: '10th',
    batchId: '10A',
    batchName: '10A',
    subject: 'Mathematics',
    missedHours: '1.5h',
    callStatus: 'Busy',
    contactNumber: '+91 98112 10001',
    remark: 'Call rang twice, busy. Need callback.',
  },
];

export interface TStudentHistoryRecord {
  id: string;
  date: string;
  subject: string;
  scheduledTime: string;
  duration: string;
  checkIn?: string;
  checkOut?: string;
  attended: string;
  missed: string;
  status: 'Present' | 'Absent' | 'Leave';
  reason?: string;
}

export const AMAN_KUMAR_HISTORY: TStudentHistoryRecord[] = [
  { id: 'h-1', date: '02 Sep 2026', subject: 'Mathematics', scheduledTime: '04:00–06:00 PM', duration: '2h', checkIn: '04:02 PM', checkOut: '06:00 PM', attended: '1h 58m', missed: '2m', status: 'Present' },
  { id: 'h-2', date: '03 Sep 2026', subject: 'Science', scheduledTime: '05:00–06:00 PM', duration: '1h', checkIn: '-', checkOut: '-', attended: '0h', missed: '1h', status: 'Absent', reason: 'Fever (Father informed)' },
  { id: 'h-3', date: '04 Sep 2026', subject: 'Mathematics', scheduledTime: '04:00–06:00 PM', duration: '2h', checkIn: '-', checkOut: '-', attended: '0h', missed: '2h', status: 'Leave', reason: 'Family function' },
  { id: 'h-4', date: '05 Sep 2026', subject: 'English', scheduledTime: '06:00–07:00 PM', duration: '1h', checkIn: '05:58 PM', checkOut: '07:00 PM', attended: '1h', missed: '0m', status: 'Present' },
  { id: 'h-5', date: '08 Sep 2026', subject: 'Science', scheduledTime: '05:00–06:00 PM', duration: '1h', checkIn: '05:05 PM', checkOut: '06:00 PM', attended: '55m', missed: '5m', status: 'Present' },
  { id: 'h-6', date: '09 Sep 2026', subject: 'Mathematics', scheduledTime: '04:00–06:00 PM', duration: '2h', checkIn: '04:00 PM', checkOut: '06:00 PM', attended: '2h', missed: '0m', status: 'Present' },
  { id: 'h-7', date: '10 Sep 2026', subject: 'Social Science', scheduledTime: '06:00–07:30 PM', duration: '1.5h', checkIn: '06:04 PM', checkOut: '07:30 PM', attended: '1h 26m', missed: '4m', status: 'Present' },
  { id: 'h-8', date: '11 Sep 2026', subject: 'Science', scheduledTime: '12:00–01:00 PM', duration: '1h', checkIn: '12:01 PM', checkOut: '01:00 PM', attended: '59m', missed: '1m', status: 'Present' },
];

export const AMAN_KUMAR_SUBJECT_STATS = [
  { subject: 'Mathematics', attendancePercent: 92, totalHours: 18, attendedHours: 16.5, missedHours: 1.5 },
  { subject: 'Science', attendancePercent: 84, totalHours: 14, attendedHours: 11.8, missedHours: 2.2 },
  { subject: 'English', attendancePercent: 95, totalHours: 10, attendedHours: 9.5, missedHours: 0.5 },
  { subject: 'Social Science', attendancePercent: 88, totalHours: 12, attendedHours: 10.5, missedHours: 1.5 },
];

export const SEED_ATTENDANCE_SESSIONS: TClassSession[] = [
  {
    id: 'session-seed-1',
    scheduleId: 'sch-seed-1',
    date: '2026-09-02',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    teacherName: 'Amod Sharma',
    scheduledStartTime: '04:00 PM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 120,
    sessionStatus: 'Completed',
    startedAt: '04:00 PM',
    endedAt: '06:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'present',
        checkInTime: '04:02 PM',
        checkOutTime: '06:00 PM',
        attendedMinutes: 118,
        missedMinutes: 2,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-2',
    scheduleId: 'sch-seed-2',
    date: '2026-09-03',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Science',
    teacherName: 'Rakesh Sir',
    scheduledStartTime: '05:00 PM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 60,
    sessionStatus: 'Completed',
    startedAt: '05:00 PM',
    endedAt: '06:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'absent',
        absenceRemark: 'Fever (Father informed)',
        attendedMinutes: 0,
        missedMinutes: 60,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-3',
    scheduleId: 'sch-seed-3',
    date: '2026-09-04',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    teacherName: 'Amod Sharma',
    scheduledStartTime: '04:00 PM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 120,
    sessionStatus: 'Completed',
    startedAt: '04:00 PM',
    endedAt: '06:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'leave',
        leaveReason: 'Family Function',
        attendedMinutes: 0,
        missedMinutes: 0,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-4',
    scheduleId: 'sch-seed-4',
    date: '2026-09-05',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'English',
    teacherName: 'Nitin Vijay Sir',
    scheduledStartTime: '06:00 PM',
    scheduledEndTime: '07:00 PM',
    scheduledDurationMinutes: 60,
    sessionStatus: 'Completed',
    startedAt: '06:00 PM',
    endedAt: '07:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'present',
        checkInTime: '05:58 PM',
        checkOutTime: '07:00 PM',
        attendedMinutes: 60,
        missedMinutes: 0,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-5',
    scheduleId: 'sch-seed-5',
    date: '2026-09-08',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Science',
    teacherName: 'Rakesh Sir',
    scheduledStartTime: '05:00 PM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 60,
    sessionStatus: 'Completed',
    startedAt: '05:00 PM',
    endedAt: '06:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'present',
        checkInTime: '05:05 PM',
        checkOutTime: '06:00 PM',
        attendedMinutes: 55,
        missedMinutes: 5,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-6',
    scheduleId: 'sch-seed-6',
    date: '2026-09-09',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    teacherName: 'Amod Sharma',
    scheduledStartTime: '04:00 PM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 120,
    sessionStatus: 'Completed',
    startedAt: '04:00 PM',
    endedAt: '06:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'present',
        checkInTime: '04:00 PM',
        checkOutTime: '06:00 PM',
        attendedMinutes: 120,
        missedMinutes: 0,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-7',
    scheduleId: 'sch-seed-7',
    date: '2026-09-10',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Social Science',
    teacherName: 'Sanjay Verma Sir',
    scheduledStartTime: '06:00 PM',
    scheduledEndTime: '07:30 PM',
    scheduledDurationMinutes: 90,
    sessionStatus: 'Completed',
    startedAt: '06:00 PM',
    endedAt: '07:30 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'present',
        checkInTime: '06:04 PM',
        checkOutTime: '07:30 PM',
        attendedMinutes: 86,
        missedMinutes: 4,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
  {
    id: 'session-seed-8',
    scheduleId: 'sch-seed-8',
    date: '2026-09-11',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Science',
    teacherName: 'Rakesh Sir',
    scheduledStartTime: '12:00 PM',
    scheduledEndTime: '01:00 PM',
    scheduledDurationMinutes: 60,
    sessionStatus: 'Completed',
    startedAt: '12:00 PM',
    endedAt: '01:00 PM',
    studentRecords: {
      's-9a-7': {
        studentId: 's-9a-7',
        studentName: 'Aman Kumar',
        rollNo: 12,
        status: 'present',
        checkInTime: '12:01 PM',
        checkOutTime: '01:00 PM',
        attendedMinutes: 59,
        missedMinutes: 1,
        extraMinutes: 0,
        isDemo: true,
      },
    },
    isDemo: true,
  },
];

export interface TStudentAttendanceSummary {
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  presentPercent: number;
  absentPercent: number;
  leavePercent: number;
  overallAttendancePercent: number;
  scheduledMinutes: number;
  attendedMinutes: number;
  missedMinutes: number;
  scheduledHoursDisplay: string;
  attendedHoursDisplay: string;
  missedHoursDisplay: string;
  records: TStudentHistoryRecord[];
  subjectStats: Array<{
    subject: string;
    totalClasses: number;
    totalHours: number;
    attendedHours: number;
    missedHours: number;
    attendancePercent: number;
  }>;
  isEmpty: boolean;
}

export function calculateStudentAttendanceSummary(options: {
  student: TStudent;
  schedules: TScheduleItem[];
  attendanceSessions: TClassSession[];
  liveSession: TClassSession | null;
  leaveRequests: TLeaveRequest[];
  holidays?: THoliday[];
  fromDate: string;
  toDate: string;
}): TStudentAttendanceSummary {
  const { student, schedules, attendanceSessions, liveSession, leaveRequests, holidays, fromDate, toDate } = options;
  const fromNorm = normalizeDateString(fromDate);
  const toNorm = normalizeDateString(toDate);

  // Combine attendance sessions
  const allSessions: TClassSession[] = [...(attendanceSessions || [])];
  if (liveSession) {
    if (!allSessions.some(s => s.id === liveSession.id)) {
      allSessions.push(liveSession);
    }
  }

  // Filter sessions applicable to this student in the date range
  const applicableSessions = allSessions.filter(sess => {
    const sessDateNorm = normalizeDateString(sess.date);
    if (fromNorm && sessDateNorm < fromNorm) return false;
    if (toNorm && sessDateNorm > toNorm) return false;
    return isClassApplicableToStudent(student, sess.date, sess.batchId || sess.batchName);
  });

  // Also find applicable schedules that don't have a matching session yet
  const applicableSchedules = (schedules || []).filter(sch => {
    if (sch.status === 'Cancelled' || sch.status === 'Holiday') return false;
    if (isHolidayOnDate(holidays, sch.date, sch.batchId || sch.batchName)) return false;
    const schDateNorm = normalizeDateString(sch.date);
    if (fromNorm && schDateNorm < fromNorm) return false;
    if (toNorm && schDateNorm > toNorm) return false;
    if (!isClassApplicableToStudent(student, sch.date, sch.batchId || sch.batchName)) return false;

    const hasSession = applicableSessions.some(
      sess =>
        sess.scheduleId === sch.id ||
        (sess.date === sch.date &&
          sess.subject === sch.subject &&
          (sess.batchId === sch.batchId || sess.batchName === sch.batchName))
    );
    return !hasSession;
  });

  const records: TStudentHistoryRecord[] = [];
  let scheduledMinutes = 0;
  let attendedMinutes = 0;
  let missedMinutes = 0;
  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  // Process applicable sessions
  for (const session of applicableSessions) {
    const duration = session.scheduledDurationMinutes || 60;
    const studentRec = session.studentRecords ? session.studentRecords[student.id] : undefined;

    // Check if student has approved leave request for this date
    const leaveReq = (leaveRequests || []).find(
      l =>
        l.studentId === student.id &&
        normalizeDateString(l.date) === normalizeDateString(session.date) &&
        l.status === 'Approved'
    );

    // Check if session falls on a declared holiday
    const isHoliday = isHolidayOnDate(holidays, session.date, session.batchId || session.batchName);

    let status: 'Present' | 'Absent' | 'Leave' = 'Absent';
    let recordAttended = '0h';
    let recordMissed = formatMinutesToDuration(duration);
    let checkIn = '-';
    let checkOut = '-';
    let reason = '';

    scheduledMinutes += duration;

    const recStatus = (studentRec?.status || '').toLowerCase();
    if (studentRec && (recStatus === 'present' || recStatus === 'late' || recStatus === 'left')) {
      status = 'Present';
      presentCount++;
      const attMins = studentRec.attendedMinutes > 0 ? studentRec.attendedMinutes : duration;
      const misMins = studentRec.missedMinutes || 0;
      attendedMinutes += attMins;
      missedMinutes += misMins;
      recordAttended = formatMinutesToDuration(attMins);
      recordMissed = formatMinutesToDuration(misMins);
      checkIn = studentRec.checkInTime || '-';
      checkOut = studentRec.checkOutTime || '-';
    } else if (leaveReq || recStatus === 'leave') {
      status = 'Leave';
      leaveCount++;
      recordAttended = '0h';
      recordMissed = '0h';
      reason = studentRec?.leaveReason || leaveReq?.reason || 'Approved leave';
    } else if (isHoliday) {
      status = 'Leave';
      recordAttended = '0h';
      recordMissed = '0h';
      reason = isHoliday.title || isHoliday.reason || 'Institute Holiday';
    } else if (recStatus === 'absent') {
      status = 'Absent';
      absentCount++;
      missedMinutes += duration;
      recordAttended = '0h';
      recordMissed = formatMinutesToDuration(duration);
      reason = studentRec?.absenceRemark || 'Absent';
    } else if (session.sessionStatus === 'Completed') {
      // Unmarked student in completed session defaults to absent
      status = 'Absent';
      absentCount++;
      missedMinutes += duration;
      recordAttended = '0h';
      recordMissed = formatMinutesToDuration(duration);
      reason = 'Did not attend';
    } else {
      // Ongoing or upcoming with not_arrived
      status = 'Absent';
      missedMinutes += duration;
      recordAttended = '0h';
      recordMissed = formatMinutesToDuration(duration);
      reason = 'Not arrived yet';
    }

    records.push({
      id: `rec-${session.id}`,
      date: formatDateDisplay(session.date),
      subject: session.subject,
      scheduledTime: `${session.scheduledStartTime}–${session.scheduledEndTime}`,
      duration: formatMinutesToDuration(duration),
      checkIn,
      checkOut,
      attended: recordAttended,
      missed: recordMissed,
      status,
      reason,
    });
  }

  // Process standalone upcoming/scheduled classes without attendance session yet
  for (const sch of applicableSchedules) {
    const duration = sch.durationMinutes || 60;
    scheduledMinutes += duration;

    const leaveReq = (leaveRequests || []).find(
      l =>
        l.studentId === student.id &&
        normalizeDateString(l.date) === normalizeDateString(sch.date) &&
        l.status === 'Approved'
    );

    if (leaveReq) {
      leaveCount++;
      records.push({
        id: `rec-sch-${sch.id}`,
        date: formatDateDisplay(sch.date),
        subject: sch.subject,
        scheduledTime: `${sch.startTime}–${sch.endTime}`,
        duration: formatMinutesToDuration(duration),
        checkIn: '-',
        checkOut: '-',
        attended: '0h',
        missed: '0h',
        status: 'Leave',
        reason: leaveReq.reason,
      });
    }
  }

  const totalClasses =
    records.length > 0
      ? records.length
      : scheduledMinutes > 0
      ? applicableSessions.length + applicableSchedules.length
      : 0;
  const totalMarked = presentCount + absentCount + leaveCount;
  const presentPercent = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;
  const absentPercent = totalMarked > 0 ? Math.round((absentCount / totalMarked) * 100) : 0;
  const leavePercent = totalMarked > 0 ? Math.round((leaveCount / totalMarked) * 100) : 0;
  const overallAttendancePercent =
    scheduledMinutes > 0
      ? Math.min(100, Math.round((attendedMinutes / scheduledMinutes) * 100))
      : totalMarked > 0
      ? presentPercent
      : 0;

  // Subject-wise stats
  const subjectMap = new Map<
    string,
    { totalClasses: number; scheduledMins: number; attendedMins: number; missedMins: number }
  >();

  for (const rec of records) {
    const sub = rec.subject;
    const existing = subjectMap.get(sub) || {
      totalClasses: 0,
      scheduledMins: 0,
      attendedMins: 0,
      missedMins: 0,
    };
    existing.totalClasses++;
    subjectMap.set(sub, existing);
  }

  for (const sess of applicableSessions) {
    const sub = sess.subject;
    const duration = sess.scheduledDurationMinutes || 60;
    const studentRec = sess.studentRecords ? sess.studentRecords[student.id] : undefined;
    const existing = subjectMap.get(sub) || {
      totalClasses: 0,
      scheduledMins: 0,
      attendedMins: 0,
      missedMins: 0,
    };
    existing.scheduledMins += duration;
    if (studentRec && (studentRec.status === 'present' || studentRec.status === 'late')) {
      existing.attendedMins += studentRec.attendedMinutes > 0 ? studentRec.attendedMinutes : duration;
      existing.missedMins += studentRec.missedMinutes || 0;
    } else if (studentRec && studentRec.status === 'absent') {
      existing.missedMins += duration;
    }
    subjectMap.set(sub, existing);
  }

  for (const sch of applicableSchedules) {
    const sub = sch.subject;
    const duration = sch.durationMinutes || 60;
    const existing = subjectMap.get(sub) || {
      totalClasses: 0,
      scheduledMins: 0,
      attendedMins: 0,
      missedMins: 0,
    };
    existing.scheduledMins += duration;
    subjectMap.set(sub, existing);
  }

  const subjectStats = Array.from(subjectMap.entries()).map(([subject, data]) => {
    const totalHours = Math.round((data.scheduledMins / 60) * 10) / 10;
    const attendedHours = Math.round((data.attendedMins / 60) * 10) / 10;
    const missedHours = Math.round((data.missedMins / 60) * 10) / 10;
    const attendancePercent =
      data.scheduledMins > 0 ? Math.round((data.attendedMins / data.scheduledMins) * 100) : 0;
    return {
      subject,
      totalClasses: data.totalClasses,
      totalHours,
      attendedHours,
      missedHours,
      attendancePercent,
    };
  });

  // Sort records chronologically descending (latest first)
  records.sort((a, b) => normalizeDateString(b.date).localeCompare(normalizeDateString(a.date)));

  return {
    totalClasses,
    presentCount,
    absentCount,
    leaveCount,
    presentPercent,
    absentPercent,
    leavePercent,
    overallAttendancePercent,
    scheduledMinutes,
    attendedMinutes,
    missedMinutes,
    scheduledHoursDisplay: formatMinutesToHoursDisplay(scheduledMinutes),
    attendedHoursDisplay: formatMinutesToHoursDisplay(attendedMinutes),
    missedHoursDisplay: formatMinutesToHoursDisplay(missedMinutes),
    records,
    subjectStats,
    isEmpty: totalClasses === 0 && scheduledMinutes === 0 && records.length === 0,
  };
}

// -----------------------------------------------------------------------------
// DASHBOARD AGGREGATED STATS (REAL TIME & CONSISTENT)
// -----------------------------------------------------------------------------

export interface TDashboardStats {
  totalStudents: number;
  todayClassesCount: number;
  completedClassesCount: number;
  ongoingClassesCount: number;
  upcomingClassesCount: number;
  todayPresentCount: number;
  todayAbsentCount: number;
  todayLeaveCount: number;
  todayPresentPercent: number;
  todayAbsentPercent: number;
  todayLeavePercent: number;
  todayClassesOverview: Array<{
    id: string;
    startTime: string;
    endTime: string;
    className: string;
    batchName: string;
    subject: string;
    teacherName: string;
    durationMinutes: number;
    status: 'Completed' | 'Ongoing' | 'Upcoming' | 'Cancelled' | 'Holiday';
    presentCount: number;
    totalEnrolled: number;
  }>;
  todayAbsentStudents: Array<{
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    batchName: string;
    subject: string;
    missedHours: string;
    contactNumber: string;
    callStatus: CallStatus;
    spokeTo?: SpokeTo;
    parentReason?: string;
    remark?: string;
  }>;
  attendanceTrend: Array<{
    day: string;
    date: string;
    attendance: number;
  }>;
  trendAverage: number;
}

export function calculateDashboardStats(params: {
  todayDate: string;
  students: TStudent[];
  schedules: TScheduleItem[];
  attendanceSessions: TClassSession[];
  liveSession: TClassSession | null;
  leaveRequests: TLeaveRequest[];
  absentFollowUps: TAbsenceFollowUp[];
  holidays?: THoliday[];
}): TDashboardStats {
  const {
    todayDate,
    students,
    schedules,
    attendanceSessions,
    liveSession,
    leaveRequests,
    absentFollowUps,
    holidays,
  } = params;

  const todayNorm = normalizeDateString(todayDate);
  const activeStudents = (students || []).filter(s => s.status === 'active');

  // Schedules for today (excluding cancelled or declared holidays)
  const todaySchedules = (schedules || []).filter(s => {
    const schDateNorm = normalizeDateString(s.date);
    return schDateNorm === todayNorm;
  });

  const todayActiveSchedules = todaySchedules.filter(s => s.status !== 'Cancelled' && s.status !== 'Holiday');
  const todayClassesCount = todayActiveSchedules.length;
  const completedClassesCount = todayActiveSchedules.filter(s => s.status === 'Completed').length;
  const ongoingClassesCount = todayActiveSchedules.filter(s => s.status === 'Ongoing').length;
  const upcomingClassesCount = todayActiveSchedules.filter(s => s.status === 'Upcoming').length;

  // Combine today's sessions
  const todaySessions: TClassSession[] = (attendanceSessions || []).filter(
    s => normalizeDateString(s.date) === todayNorm
  );
  if (liveSession && normalizeDateString(liveSession.date) === todayNorm) {
    if (!todaySessions.some(s => s.id === liveSession.id)) {
      todaySessions.push(liveSession);
    }
  }

  // Calculate unique student counts for today
  const presentStudentIds = new Set<string>();
  const absentStudentIds = new Set<string>();
  const leaveStudentIds = new Set<string>();

  // Leaves approved for today
  for (const lr of leaveRequests || []) {
    if (lr.status === 'Approved' && normalizeDateString(lr.date) === todayNorm) {
      leaveStudentIds.add(lr.studentId);
    }
  }

  // Student statuses from today's sessions
  for (const session of todaySessions) {
    if (!session.studentRecords) continue;
    for (const [stId, rec] of Object.entries(session.studentRecords)) {
      const st = (rec.status || '').toLowerCase();
      if (st === 'present' || st === 'late' || st === 'left' || st === 'live') {
        presentStudentIds.add(stId);
        absentStudentIds.delete(stId);
      } else if (st === 'leave') {
        leaveStudentIds.add(stId);
      } else if (st === 'absent') {
        if (!presentStudentIds.has(stId) && !leaveStudentIds.has(stId)) {
          absentStudentIds.add(stId);
        }
      }
    }
  }

  const todayPresentCount = presentStudentIds.size;
  const todayAbsentCount = absentStudentIds.size;
  const todayLeaveCount = leaveStudentIds.size;
  const totalMarkedToday = todayPresentCount + todayAbsentCount + todayLeaveCount;

  const todayPresentPercent = totalMarkedToday > 0 ? Math.round((todayPresentCount / totalMarkedToday) * 1000) / 10 : 0;
  const todayAbsentPercent = totalMarkedToday > 0 ? Math.round((todayAbsentCount / totalMarkedToday) * 1000) / 10 : 0;
  const todayLeavePercent = totalMarkedToday > 0 ? Math.round((todayLeaveCount / totalMarkedToday) * 1000) / 10 : 0;

  // Today's classes overview
  const todayClassesOverview = todaySchedules.map(item => {
    // Determine enrolled students in this batch today
    const enrolled = activeStudents.filter(st =>
      isClassApplicableToStudent(st, item.date, item.batchId || item.batchName)
    ).length;

    // Find matching session
    let presentInClass = 0;
    const isOngoing = item.status === 'Ongoing';

    if (isOngoing && liveSession && (liveSession.scheduleId === item.id || (normalizeDateString(liveSession.date) === normalizeDateString(item.date) && (liveSession.batchId === item.batchId || liveSession.batchName === item.batchName)))) {
      presentInClass = Object.values(liveSession.studentRecords || {}).filter(
        r => {
          const s = (r.status || '').toLowerCase();
          return s === 'present' || s === 'late' || s === 'left';
        }
      ).length;
    } else {
      const matchingSession = (attendanceSessions || []).find(
        s => s.scheduleId === item.id || (normalizeDateString(s.date) === normalizeDateString(item.date) && (s.batchId === item.batchId || s.batchName === item.batchName) && s.subject === item.subject)
      );
      if (matchingSession && matchingSession.studentRecords) {
        presentInClass = Object.values(matchingSession.studentRecords).filter(
          r => {
            const s = (r.status || '').toLowerCase();
            return s === 'present' || s === 'late' || s === 'left';
          }
        ).length;
      }
    }

    return {
      id: item.id,
      startTime: item.startTime,
      endTime: item.endTime,
      className: item.className,
      batchName: item.batchName,
      subject: item.subject,
      teacherName: item.teacherName,
      durationMinutes: item.durationMinutes,
      status: item.status,
      presentCount: presentInClass,
      totalEnrolled: enrolled,
    };
  });

  // Today's absent students
  const todayAbsentStudentsMap = new Map<string, TDashboardStats['todayAbsentStudents'][0]>();

  // Add from absent follow-ups
  for (const af of absentFollowUps || []) {
    if (normalizeDateString(af.date) === todayNorm) {
      todayAbsentStudentsMap.set(af.studentId, {
        id: af.id,
        studentId: af.studentId,
        studentName: af.studentName,
        className: af.className,
        batchName: af.batchName,
        subject: af.subject,
        missedHours: af.missedHours,
        contactNumber: af.contactNumber,
        callStatus: af.callStatus,
        spokeTo: af.spokeTo,
        parentReason: af.parentReason,
        remark: af.remark,
      });
    }
  }

  // Add from today's sessions if any student is marked absent and not in map
  for (const session of todaySessions) {
    if (!session.studentRecords) continue;
    for (const [stId, rec] of Object.entries(session.studentRecords)) {
      if ((rec.status || '').toLowerCase() === 'absent' && !todayAbsentStudentsMap.has(stId)) {
        const studentObj = activeStudents.find(s => s.id === stId);
        todayAbsentStudentsMap.set(stId, {
          id: `af-dyn-${stId}`,
          studentId: stId,
          studentName: rec.studentName || studentObj?.name || 'Student',
          className: session.className || studentObj?.className || '',
          batchName: session.batchName || studentObj?.batchName || '',
          subject: session.subject,
          missedHours: formatMinutesToHoursDisplay(rec.missedMinutes || session.scheduledDurationMinutes || 60),
          contactNumber: studentObj?.parentPhone || studentObj?.phone || '+91 99999 00000',
          callStatus: 'Not Contacted',
          remark: rec.absenceRemark || 'Unexcused absence today',
        });
      }
    }
  }

  const todayAbsentStudents = Array.from(todayAbsentStudentsMap.values());

  // Attendance Trend from real attendance sessions
  const dateMap = new Map<string, { attended: number; scheduled: number; present: number; total: number }>();
  for (const sess of attendanceSessions || []) {
    if (sess.sessionStatus !== 'Completed') continue;
    const d = normalizeDateString(sess.date);
    if (!d) continue;

    const existing = dateMap.get(d) || { attended: 0, scheduled: 0, present: 0, total: 0 };
    for (const rec of Object.values(sess.studentRecords || {})) {
      const st = (rec.status || '').toLowerCase();
      existing.total++;
      if (st === 'present' || st === 'late' || st === 'left' || st === 'live') {
        existing.present++;
        existing.attended += rec.attendedMinutes > 0 ? rec.attendedMinutes : (sess.scheduledDurationMinutes || 60);
      }
      existing.scheduled += sess.scheduledDurationMinutes || 60;
    }
    dateMap.set(d, existing);
  }

  const sortedDates = Array.from(dateMap.keys()).sort();
  const attendanceTrend = sortedDates.map(dateKey => {
    const data = dateMap.get(dateKey)!;
    const rate = data.total > 0 ? Math.round((data.present / data.total) * 1000) / 10 : 0;
    return {
      day: formatDateDisplay(dateKey),
      date: dateKey,
      attendance: rate,
    };
  });

  const trendAverage =
    attendanceTrend.length > 0
      ? Math.round(
          (attendanceTrend.reduce((acc, curr) => acc + curr.attendance, 0) / attendanceTrend.length) * 10
        ) / 10
      : 0;

  return {
    totalStudents: activeStudents.length,
    todayClassesCount,
    completedClassesCount,
    ongoingClassesCount,
    upcomingClassesCount,
    todayPresentCount,
    todayAbsentCount,
    todayLeaveCount,
    todayPresentPercent,
    todayAbsentPercent,
    todayLeavePercent,
    todayClassesOverview,
    todayAbsentStudents,
    attendanceTrend,
    trendAverage,
  };
}

// -----------------------------------------------------------------------------
// INSTITUTE REPORTS ENGINE (DYNAMIC & 100% FROM ACTUAL DATA)
// -----------------------------------------------------------------------------

export interface TInstituteReport {
  totalStudents: number;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  presentPercent: number;
  absentPercent: number;
  leavePercent: number;
  totalHours: string;
  attendanceTrend: Array<{ day: string; percent: number }>;
  subjectWiseAttendance: Array<{ subject: string; percent: number; color: string; classesCount: number }>;
  rankedStudents: Array<{ rank: number; id: string; name: string; batch: string; attendance: number; status: 'high' | 'normal' | 'low'; rollNo: number }>;
  isEmpty: boolean;
}

export function calculateInstituteReports(params: {
  students: TStudent[];
  schedules: TScheduleItem[];
  attendanceSessions: TClassSession[];
  leaveRequests: TLeaveRequest[];
  holidays?: THoliday[];
  period: string; // 'daily' | 'weekly' | 'monthly' | 'custom' | 'yearly'
  selectedMonth: string; // e.g. "September 2026"
  selectedClass: string; // 'all' or "9th"
  selectedBatch: string; // 'all' or "9A"
  selectedSubject: string; // 'all' or "Mathematics"
}): TInstituteReport {
  const {
    students,
    schedules,
    attendanceSessions,
    leaveRequests,
    holidays,
    period,
    selectedMonth,
    selectedClass,
    selectedBatch,
    selectedSubject,
  } = params;

  // Derive date filter prefix or range based on month
  let monthPrefix = '2026-09';
  if (selectedMonth.includes('August')) monthPrefix = '2026-08';
  else if (selectedMonth.includes('July')) monthPrefix = '2026-07';
  else if (selectedMonth.includes('October')) monthPrefix = '2026-10';

  // Filter students matching class & batch
  const enrolledStudents = (students || []).filter(st => {
    if (st.status !== 'active') return false;
    if (selectedClass !== 'all' && st.className !== selectedClass) return false;
    if (selectedBatch !== 'all' && (st.batchId !== selectedBatch && st.batchName !== selectedBatch)) return false;
    return true;
  });

  const enrolledStudentIds = new Set(enrolledStudents.map(s => s.id));

  // Filter attendance sessions matching period, class, batch, subject
  const matchingSessions = (attendanceSessions || []).filter(sess => {
    const dNorm = normalizeDateString(sess.date);
    if (period === 'monthly' && !dNorm.startsWith(monthPrefix)) return false;
    if (selectedClass !== 'all' && sess.className !== selectedClass) return false;
    if (selectedBatch !== 'all' && sess.batchId !== selectedBatch && sess.batchName !== selectedBatch) return false;
    if (selectedSubject !== 'all' && sess.subject !== selectedSubject) return false;
    return true;
  });

  // Calculate student attendance aggregations
  let totalScheduledMinutes = 0;
  let totalAttendedMinutes = 0;
  let totalPresentMarks = 0;
  let totalAbsentMarks = 0;
  let totalLeaveMarks = 0;

  // Date map for trend
  const trendMap = new Map<string, { present: number; total: number }>();
  // Subject map for breakdown
  const subjectMap = new Map<string, { attendedMins: number; scheduledMins: number; classes: Set<string> }>();
  // Student map for ranking
  const studentStatsMap = new Map<string, { attendedMins: number; scheduledMins: number; present: number; total: number }>();

  for (const sess of matchingSessions) {
    const duration = sess.scheduledDurationMinutes || 60;
    const dKey = formatDateDisplay(sess.date);
    const sub = sess.subject || 'General';

    const subEntry = subjectMap.get(sub) || { attendedMins: 0, scheduledMins: 0, classes: new Set() };
    subEntry.classes.add(sess.id);

    const trendEntry = trendMap.get(dKey) || { present: 0, total: 0 };

    for (const [stId, rec] of Object.entries(sess.studentRecords || {})) {
      // Check if student is within target enrolled students
      if (enrolledStudents.length > 0 && !enrolledStudentIds.has(stId)) continue;

      const st = (rec.status || '').toLowerCase();
      totalScheduledMinutes += duration;
      subEntry.scheduledMins += duration;
      trendEntry.total++;

      const stStat = studentStatsMap.get(stId) || { attendedMins: 0, scheduledMins: 0, present: 0, total: 0 };
      stStat.scheduledMins += duration;
      stStat.total++;

      if (st === 'present' || st === 'late' || st === 'left' || st === 'live') {
        totalPresentMarks++;
        const attMins = rec.attendedMinutes > 0 ? rec.attendedMinutes : duration;
        totalAttendedMinutes += attMins;
        subEntry.attendedMins += attMins;
        trendEntry.present++;
        stStat.attendedMins += attMins;
        stStat.present++;
      } else if (st === 'leave') {
        totalLeaveMarks++;
      } else {
        totalAbsentMarks++;
      }

      studentStatsMap.set(stId, stStat);
    }

    subjectMap.set(sub, subEntry);
    trendMap.set(dKey, trendEntry);
  }

  const totalMarks = totalPresentMarks + totalAbsentMarks + totalLeaveMarks;
  const presentPercent = totalMarks > 0 ? Math.round((totalPresentMarks / totalMarks) * 1000) / 10 : 0;
  const absentPercent = totalMarks > 0 ? Math.round((totalAbsentMarks / totalMarks) * 1000) / 10 : 0;
  const leavePercent = totalMarks > 0 ? Math.round((totalLeaveMarks / totalMarks) * 1000) / 10 : 0;

  // Trend array
  const attendanceTrend = Array.from(trendMap.entries()).map(([day, data]) => ({
    day,
    percent: data.total > 0 ? Math.round((data.present / data.total) * 1000) / 10 : 0,
  }));

  // Subject-wise colors
  const PALETTE = ['#2563eb', '#0284c7', '#16a34a', '#7c3aed', '#f59e0b', '#ec4899', '#0d9488'];
  const subjectWiseAttendance = Array.from(subjectMap.entries()).map(([subject, data], idx) => ({
    subject,
    percent: data.scheduledMins > 0 ? Math.round((data.attendedMins / data.scheduledMins) * 100) : 0,
    color: PALETTE[idx % PALETTE.length],
    classesCount: data.classes.size,
  }));

  // Ranked students
  const rankedStudents = enrolledStudents
    .map(st => {
      const stats = studentStatsMap.get(st.id);
      let pct = 0;
      if (stats && stats.scheduledMins > 0) {
        pct = Math.round((stats.attendedMins / stats.scheduledMins) * 1000) / 10;
      }
      return {
        id: st.id,
        name: st.name,
        batch: st.batchName || st.batchId,
        attendance: pct,
        status: (pct >= 90 ? 'high' : pct >= 75 ? 'normal' : 'low') as 'high' | 'normal' | 'low',
        rollNo: st.rollNo,
      };
    })
    .sort((a, b) => b.attendance - a.attendance)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  const isEmpty = matchingSessions.length === 0 && totalMarks === 0;

  return {
    totalStudents: enrolledStudents.length,
    totalClasses: matchingSessions.length,
    presentCount: totalPresentMarks,
    absentCount: totalAbsentMarks,
    leaveCount: totalLeaveMarks,
    presentPercent,
    absentPercent,
    leavePercent,
    totalHours: formatMinutesToHoursDisplay(totalScheduledMinutes),
    attendanceTrend,
    subjectWiseAttendance,
    rankedStudents,
    isEmpty,
  };
}
