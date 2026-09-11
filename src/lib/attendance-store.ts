// IDL EDUCATION - Attendance Management System Data Store
// Core domain entities, calculations, audit logging, and reactive state management

export type StudentStatus = 'not_arrived' | 'present' | 'late' | 'absent' | 'leave' | 'left';

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
  admissionDate: string; // "YYYY-MM-DD" e.g. "2026-08-10"
  exitDate?: string;
  status: 'active' | 'archived';
  dob?: string;
  gender?: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  address?: string;
  avatar?: string;
  targetExam?: string;
  notes?: string;
  batchHistory?: TStudentBatchTransfer[];
  createdAt?: string;
}

export interface TClass {
  id: string;
  name: string; // "9th", "10th", "11th", "12th"
  displayName: string;
  batches: string[];
  status: 'active' | 'archived';
  description?: string;
  createdAt?: string;
}

export interface TBatch {
  id: string;
  name: string; // "9A", "9B", "10A", etc.
  classId: string;
  className: string;
  room: string;
  status: 'active' | 'archived';
  startDate?: string;
  endDate?: string;
  description?: string;
  createdAt?: string;
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
}

export interface TSubject {
  id: string;
  name: string;
  code: string;
  classes: string[];
  teachers: string[];
  status: 'active' | 'archived';
  description?: string;
  avgAttendance?: string;
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
}

export interface THoliday {
  id: string;
  date: string;
  title: string;
  type: 'Institute Holiday' | 'Class Cancelled' | 'Teacher Unavailable' | 'Other';
  reason: string;
  status?: 'active' | 'archived';
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
    | 'Attendance Edited'
    | 'Attendance Voided'
    | 'Holiday Declared'
    | 'Holiday Deleted'
    | 'Demo Data Reset'
    | 'Demo Data Cleared';
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
// SEED DATA - REALISTIC EDUCATIONAL INSTITUTE
// -----------------------------------------------------------------------------

export const SEED_CLASSES: TClass[] = [
  { id: 'c9', name: '9th', displayName: 'Class 9th (CBSE)', batches: ['9A', '9B'], status: 'active', createdAt: '2026-03-01' },
  { id: 'c10', name: '10th', displayName: 'Class 10th (CBSE Board)', batches: ['10A', '10B'], status: 'active', createdAt: '2026-03-01' },
  { id: 'c11', name: '11th', displayName: 'Class 11th (JEE/NEET)', batches: ['11A'], status: 'active', createdAt: '2026-03-01' },
  { id: 'c12', name: '12th', displayName: 'Class 12th (Board & Entrance)', batches: ['12A'], status: 'active', createdAt: '2026-03-01' },
];

export const SEED_BATCHES: TBatch[] = [
  { id: '9A', name: '9A', classId: 'c9', className: '9th', room: 'Room 101', status: 'active', startDate: '2026-04-01', description: 'Morning foundational batch' },
  { id: '9B', name: '9B', classId: 'c9', className: '9th', room: 'Room 102', status: 'active', startDate: '2026-04-01', description: 'Afternoon standard batch' },
  { id: '10A', name: '10A', classId: 'c10', className: '10th', room: 'Hall A', status: 'active', startDate: '2026-03-25', description: 'Board examination primary batch' },
  { id: '10B', name: '10B', classId: 'c10', className: '10th', room: 'Hall B', status: 'active', startDate: '2026-04-01', description: 'Board examination evening batch' },
  { id: '11A', name: '11A', classId: 'c11', className: '11th', room: 'Lab 1', status: 'active', startDate: '2026-04-01', description: 'Science & Entrance intensive' },
  { id: '12A', name: '12A', classId: 'c12', className: '12th', room: 'Auditorium', status: 'active', startDate: '2026-04-01', description: 'Target 2027 competitive batch' },
];

export const SEED_TEACHERS: TTeacher[] = [
  { id: 't1', name: 'Amod Sharma', subject: 'Mathematics', phone: '+91 98765 43210', email: 'amod@idleducation.com', status: 'active', joiningDate: '2024-06-01', assignedClasses: ['9th', '11th'], assignedBatches: ['9A', '11A'], notes: 'Academic Director & Math Head' },
  { id: 't2', name: 'Nitin Vijay Sir', subject: 'English & Physics', phone: '+91 98765 43211', email: 'nitin@idleducation.com', status: 'active', joiningDate: '2024-07-15', assignedClasses: ['9th', '10th'], assignedBatches: ['9B', '10A'] },
  { id: 't3', name: 'Rakesh Sir', subject: 'Science & Chemistry', phone: '+91 98765 43212', email: 'rakesh@idleducation.com', status: 'active', joiningDate: '2025-01-10', assignedClasses: ['9th', '10th'], assignedBatches: ['9A', '10B'] },
  { id: 't4', name: 'Priya Ma\'am', subject: 'Biology & Chemistry', phone: '+91 98765 43213', email: 'priya@idleducation.com', status: 'active', joiningDate: '2025-03-01', assignedClasses: ['11th', '12th'], assignedBatches: ['12A'] },
  { id: 't5', name: 'Sanjay Verma Sir', subject: 'Social Science (SST)', phone: '+91 98765 43214', email: 'sanjay@idleducation.com', status: 'active', joiningDate: '2025-04-01', assignedClasses: ['9th', '10th'], assignedBatches: ['9A', '9B'] },
];

export const SEED_SUBJECTS: TSubject[] = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH-01', classes: ['9th', '10th', '11th', '12th'], teachers: ['Amod Sharma', 'Nitin Vijay Sir'], status: 'active', avgAttendance: '88%' },
  { id: 'sub-2', name: 'Science', code: 'SCI-01', classes: ['9th', '10th'], teachers: ['Rakesh Sir'], status: 'active', avgAttendance: '82%' },
  { id: 'sub-3', name: 'Physics', code: 'PHY-01', classes: ['11th', '12th'], teachers: ['Nitin Vijay Sir', 'Amod Sharma'], status: 'active', avgAttendance: '91%' },
  { id: 'sub-4', name: 'Chemistry', code: 'CHEM-01', classes: ['11th', '12th'], teachers: ['Priya Ma\'am', 'Rakesh Sir'], status: 'active', avgAttendance: '86%' },
  { id: 'sub-5', name: 'Biology', code: 'BIO-01', classes: ['11th', '12th'], teachers: ['Priya Ma\'am'], status: 'active', avgAttendance: '90%' },
  { id: 'sub-6', name: 'English', code: 'ENG-01', classes: ['9th', '10th'], teachers: ['Nitin Vijay Sir'], status: 'active', avgAttendance: '93%' },
  { id: 'sub-7', name: 'Social Science (SST)', code: 'SST-01', classes: ['9th', '10th'], teachers: ['Sanjay Verma Sir'], status: 'active', avgAttendance: '85%' },
];

export const SEED_HOLIDAYS: THoliday[] = [
  { id: 'h1', date: '2026-09-16', title: 'Ganesh Chaturthi', type: 'Institute Holiday', reason: 'Festival Holiday for all batches and staff.', status: 'active' },
  { id: 'h2', date: '2026-10-02', title: 'Gandhi Jayanti', type: 'Institute Holiday', reason: 'National Holiday', status: 'active' },
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

// Generate 20-35 students per batch to reach 245 active students
export function generateSeedStudents(): TStudent[] {
  const students: TStudent[] = [];
  
  const studentNames9A = [
    'Aarav Sharma', 'Bhavya Singh', 'Karan Mehta', 'Neha Sharma', 'Rohan Verma',
    'Sakshi Gupta', 'Aman Kumar', 'Mohit Verma', 'Ananya Patel', 'Devansh Joshi',
    'Ishita Roy', 'Kabir Malhotra', 'Meera Nair', 'Pranav Rao', 'Riya Choudhary',
    'Siddharth Jain', 'Tanvi Bhatia', 'Utkarsh Saxena', 'Vanshika Tiwari', 'Yash Mittal'
  ];

  const studentNames9B = [
    'Diya Singh', 'Rohit Kumar', 'Aditi Chauhan', 'Ayush Bajpai', 'Chirag Sethi',
    'Deepak Yadav', 'Divya Rajput', 'Gaurav Aggarwal', 'Harshita Pandey', 'Jatin Goyal',
    'Khushi Kaushik', 'Lakshay Chhabra', 'Mansi Rawat', 'Nikhil Soni', 'Pooja Kashyap',
    'Rahul Saini', 'Shreya Mishra', 'Tushar Garg', 'Varun Singhania', 'Zoya Khan', 'Ravi Kant'
  ];

  const studentNames10A = [
    'Aryan Kapoor', 'Akash Tripathi', 'Disha Mathur', 'Farhan Ali', 'Isha Batra',
    'Keshav Goyal', 'Lavanya Saxena', 'Manish Bisht', 'Muskan Arora', 'Naman Agrawal',
    'Ojasvi Sen', 'Parth Shukla', 'Payal Ghosh', 'Raghav Bansal', 'Riddhi Chopra',
    'Rishabh Tyagi', 'Samaira Dutta', 'Saurabh Chandra', 'Shubham Jindal', 'Simran Bedi',
    'Sneha Bhattacharya', 'Sparsh Khandelwal', 'Tarun Nanda', 'Vaibhav Rastogi', 'Vidhi Singla',
    'Vipin Mishra', 'Vivek Dubey', 'Yuvraj Thakur'
  ];

  // Batch 9A (20 students)
  studentNames9A.forEach((name, idx) => {
    students.push({
      id: `s-9a-${idx + 1}`,
      name,
      rollNo: idx + 1,
      classId: 'c9',
      className: '9th',
      batchId: '9A',
      batchName: '9A',
      admissionDate: idx === 6 ? '2026-08-10' : '2026-04-01',
      status: 'active',
      dob: '2011-05-14',
      phone: `+91 98110 ${10000 + idx}`,
      parentName: `${name.split(' ')[1] || 'Kumar'} (Father)`,
      parentPhone: `+91 99110 ${20000 + idx}`,
      address: 'Preet Vihar, New Delhi',
      createdAt: '2026-04-01',
    });
  });

  // Batch 9B (21 students)
  studentNames9B.forEach((name, idx) => {
    students.push({
      id: `s-9b-${idx + 1}`,
      name,
      rollNo: idx + 1,
      classId: 'c9',
      className: '9th',
      batchId: '9B',
      batchName: '9B',
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2011-08-20',
      phone: `+91 98111 ${10000 + idx}`,
      parentName: `${name.split(' ')[1] || 'Singh'} (Parent)`,
      parentPhone: `+91 99111 ${20000 + idx}`,
      address: 'Laxmi Nagar, New Delhi',
      createdAt: '2026-04-01',
    });
  });

  // Batch 10A (28 students)
  studentNames10A.forEach((name, idx) => {
    students.push({
      id: `s-10a-${idx + 1}`,
      name,
      rollNo: idx + 1,
      classId: 'c10',
      className: '10th',
      batchId: '10A',
      batchName: '10A',
      admissionDate: '2026-03-25',
      status: 'active',
      dob: '2010-09-12',
      phone: `+91 98112 ${10000 + idx}`,
      parentName: `${name.split(' ')[1] || 'Sharma'} (Parent)`,
      parentPhone: `+91 99112 ${20000 + idx}`,
      address: 'Mayur Vihar, New Delhi',
      createdAt: '2026-03-25',
    });
  });

  // Additional batches to bring total to 245
  const remainingCount = 245 - students.length;
  const batchesPool = [
    { batch: '10B', classId: 'c10', className: '10th' },
    { batch: '11A', classId: 'c11', className: '11th' },
    { batch: '12A', classId: 'c12', className: '12th' },
  ];

  for (let i = 0; i < remainingCount; i++) {
    const target = batchesPool[i % batchesPool.length];
    const roll = Math.floor(i / batchesPool.length) + 1;
    students.push({
      id: `s-${target.batch.toLowerCase()}-${roll}`,
      name: `Student ${target.batch}-${roll}`,
      rollNo: roll,
      classId: target.classId,
      className: target.className,
      batchId: target.batch,
      batchName: target.batch,
      admissionDate: '2026-04-01',
      status: 'active',
      dob: '2009-02-18',
      phone: `+91 98200 ${10000 + i}`,
      parentName: `Parent of ${target.batch}-${roll}`,
      parentPhone: `+91 99200 ${20000 + i}`,
      address: 'Delhi NCR',
      createdAt: '2026-04-01',
    });
  }

  return students;
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
    room: 'Hall A'
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
    room: 'Lab 1'
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
    room: 'Room 101'
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
    room: 'Room 101'
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
    room: 'Room 102'
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
    room: 'Hall B'
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
    room: 'Auditorium'
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
    room: 'Lab 1'
  },
];

// Active Live Class Session: 9th A Mathematics (Ongoing)
export function generateInitialLiveSession(students: TStudent[]): TClassSession {
  const batch9AStudents = students.filter(s => s.batchId === '9A' && s.status === 'active');
  const studentRecords: Record<string, TStudentSessionRecord> = {};

  // First 6 students present as per reference UI
  const presentPreset = [
    { name: 'Aarav Sharma', checkIn: '04:00 PM' },
    { name: 'Bhavya Singh', checkIn: '04:01 PM' },
    { name: 'Karan Mehta', checkIn: '04:05 PM' },
    { name: 'Neha Sharma', checkIn: '04:10 PM' },
    { name: 'Rohan Verma', checkIn: '04:12 PM' },
    { name: 'Sakshi Gupta', checkIn: '04:15 PM' },
  ];

  batch9AStudents.forEach(st => {
    const matched = presentPreset.find(p => p.name === st.name);
    if (matched) {
      const timing = calculateStudentAttendanceTiming('04:00 PM', '06:00 PM', matched.checkIn);
      studentRecords[st.id] = {
        studentId: st.id,
        studentName: st.name,
        rollNo: st.rollNo,
        status: 'present',
        checkInTime: matched.checkIn,
        attendedMinutes: timing.attendedMinutes,
        missedMinutes: timing.missedMinutes,
        extraMinutes: timing.extraMinutes,
        isOngoing: true,
      };
    } else {
      // Remaining students start as NOT ARRIVED (strictly complying with user requirement)
      studentRecords[st.id] = {
        studentId: st.id,
        studentName: st.name,
        rollNo: st.rollNo,
        status: 'not_arrived',
        attendedMinutes: 0,
        missedMinutes: 0,
        extraMinutes: 0,
      };
    }
  });

  return {
    id: 'session-live-9a-maths',
    scheduleId: 'sch-4',
    date: '2026-09-11',
    classId: 'c9',
    className: '9th',
    batchId: '9A',
    batchName: '9A',
    subject: 'Mathematics',
    teacherName: 'Amod Sharma',
    scheduledStartTime: '04:00 PM',
    scheduledEndTime: '06:00 PM',
    scheduledDurationMinutes: 120,
    sessionStatus: 'Ongoing',
    startedAt: '04:00 PM',
    studentRecords,
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
