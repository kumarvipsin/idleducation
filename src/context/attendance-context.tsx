'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  TStudent,
  TClass,
  TBatch,
  TTeacher,
  TSubject,
  TScheduleItem,
  TClassSession,
  TLeaveRequest,
  TAbsenceFollowUp,
  THoliday,
  TAuditLog,
  UserRole,
  StudentStatus,
  CallStatus,
  SpokeTo,
  LeaveReason,
  SEED_CLASSES,
  SEED_BATCHES,
  SEED_TEACHERS,
  SEED_SUBJECTS,
  SEED_HOLIDAYS,
  SEED_SCHEDULE_ITEMS,
  SEED_LEAVE_REQUESTS,
  SEED_ABSENT_FOLLOWUPS,
  SEED_AUDIT_LOGS,
  SEED_ATTENDANCE_SESSIONS,
  generateSeedStudents,
  generateInitialLiveSession,
  calculateStudentAttendanceTiming,
  getCurrentTimeFormatted,
  isClassApplicableToStudent,
} from '@/lib/attendance-store';

export interface DependencySummary {
  batches: number;
  students: number;
  schedules: number;
  attendanceSessions: number;
  leaveRecords: number;
  callRecords: number;
  isDemoEntity?: boolean;
}

export interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AttendanceContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Entities
  classes: TClass[];
  batches: TBatch[];
  teachers: TTeacher[];
  subjects: TSubject[];
  holidays: THoliday[];
  students: TStudent[];
  schedules: TScheduleItem[];
  attendanceSessions: TClassSession[];
  liveSession: TClassSession | null;
  leaveRequests: TLeaveRequest[];
  absentFollowUps: TAbsenceFollowUp[];
  auditLogs: TAuditLog[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isDemoData: boolean;
  setIsDemoData: (value: boolean) => void;

  // Dependency summary (for smart delete dialog)
  getDependencySummary: (entityType: string, entityId: string) => DependencySummary;

  // Class Management CRUD
  addClass: (cls: Omit<TClass, 'id'>) => { success: boolean; message: string };
  updateClass: (id: string, cls: Partial<TClass>) => void;
  archiveClass: (id: string) => void;
  restoreClass: (id: string) => void;
  deleteClassSafe: (id: string) => { success: boolean; message: string };
  forceDeleteClass: (id: string, reason: string) => void;

  // Batch Management CRUD
  addBatch: (batch: Omit<TBatch, 'id'>) => { success: boolean; message: string };
  updateBatch: (id: string, batch: Partial<TBatch>) => void;
  archiveBatch: (id: string) => void;
  restoreBatch: (id: string) => void;
  deleteBatchSafe: (id: string) => { success: boolean; message: string };
  forceDeleteBatch: (id: string, reason: string) => void;

  // Student Management CRUD & Transfers
  addStudent: (student: Omit<TStudent, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<TStudent>) => void;
  archiveStudent: (id: string, reason?: string) => void;
  restoreStudent: (id: string, newBatchId?: string) => void;
  transferStudentBatch: (studentId: string, toBatchId: string, effectiveDate: string, reason?: string) => void;
  deleteStudentSafe: (id: string) => { success: boolean; message: string };
  forceDeleteStudent: (id: string, reason: string) => void;
  bulkArchiveStudents: (studentIds: string[]) => void;
  bulkTransferStudents: (studentIds: string[], toBatchId: string, effectiveDate: string) => void;

  // Teacher Management CRUD
  addTeacher: (teacher: Omit<TTeacher, 'id'>) => void;
  updateTeacher: (id: string, updates: Partial<TTeacher>) => void;
  archiveTeacher: (id: string) => void;
  restoreTeacher: (id: string) => void;
  deleteTeacherSafe: (id: string) => { success: boolean; message: string };
  forceDeleteTeacher: (id: string, reason: string) => void;

  // Subject Management CRUD
  addSubject: (sub: Omit<TSubject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<TSubject>) => void;
  archiveSubject: (id: string) => void;
  restoreSubject: (id: string) => void;
  deleteSubjectSafe: (id: string) => { success: boolean; message: string };
  forceDeleteSubject: (id: string, reason: string) => void;

  // Live Attendance Actions
  markStudentPresent: (studentId: string, customTime?: string) => void;
  markStudentStatus: (studentId: string, status: StudentStatus, reason?: string) => void;
  bulkMarkPresent: (studentIds: string[]) => void;
  markStudentExit: (studentId: string, customTime?: string) => void;
  markExitAllPresent: (customTime?: string) => void;
  endLiveSession: () => void;
  startLiveSession: (scheduleId: string) => void;
  bulkResolveUnmarked: (action: 'absent' | 'leave', reason?: string) => void;

  // Attendance Void & Correction with Audit Trail
  editAttendanceRecord: (
    sessionId: string,
    studentId: string,
    updates: { checkInTime?: string; checkOutTime?: string; status?: StudentStatus },
    reason: string
  ) => void;
  voidAttendanceRecord: (sessionId: string, studentId: string, reason: string) => void;

  // Follow Up Actions
  logCallFollowUp: (data: {
    id: string;
    callStatus: CallStatus;
    spokeTo?: SpokeTo;
    parentReason?: string;
    remark?: string;
  }) => void;

  // Leave Actions
  addLeaveRequest: (req: Omit<TLeaveRequest, 'id' | 'appliedOn'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  updateLeaveRequest: (id: string, updates: Partial<TLeaveRequest>) => void;
  deleteLeaveRequest: (id: string) => void;
  deleteAbsentFollowUp: (id: string) => void;

  // Schedule Actions
  addScheduleItem: (item: Omit<TScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updates: Partial<TScheduleItem>) => void;
  duplicateScheduleItem: (id: string, newDate: string) => void;
  rescheduleClass: (id: string, newDate: string, newStartTime: string, newEndTime: string) => void;
  cancelClass: (id: string, reason: string) => void;
  deleteScheduleItemSafe: (id: string) => { success: boolean; message: string };
  forceDeleteScheduleItem: (id: string, reason: string) => void;

  // Holiday Actions
  addHoliday: (holiday: Omit<THoliday, 'id'>) => void;
  updateHoliday: (id: string, updates: Partial<THoliday>) => void;
  deleteHoliday: (id: string, reason?: string) => void;
  archiveHoliday: (id: string) => void;

  // Audit Log & Demo Data
  addAuditLog: (entry: Omit<TAuditLog, 'id' | 'timestamp' | 'user' | 'role'>) => void;
  clearAllAuditLogs: (reason: string) => { success: boolean; message: string };
  deleteAuditLog: (id: string) => void;
  clearAllDemoData: () => void;
  resetToSeedData: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | null>(null);

const STORAGE_KEY = 'idl_attendance_state_v2';

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const [classes, setClasses] = useState<TClass[]>(SEED_CLASSES);
  const [batches, setBatches] = useState<TBatch[]>(SEED_BATCHES);
  const [teachers, setTeachers] = useState<TTeacher[]>(SEED_TEACHERS);
  const [subjects, setSubjects] = useState<TSubject[]>(SEED_SUBJECTS);
  const [students, setStudents] = useState<TStudent[]>([]);
  const [schedules, setSchedules] = useState<TScheduleItem[]>(SEED_SCHEDULE_ITEMS);
  const [attendanceSessions, setAttendanceSessions] = useState<TClassSession[]>(SEED_ATTENDANCE_SESSIONS);
  const [liveSession, setLiveSession] = useState<TClassSession | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<TLeaveRequest[]>(SEED_LEAVE_REQUESTS);
  const [absentFollowUps, setAbsentFollowUps] = useState<TAbsenceFollowUp[]>(SEED_ABSENT_FOLLOWUPS);
  const [holidays, setHolidays] = useState<THoliday[]>(SEED_HOLIDAYS);
  const [auditLogs, setAuditLogs] = useState<TAuditLog[]>(SEED_AUDIT_LOGS);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-11');
  const [isDemoData, setIsDemoData] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (entry: Omit<TAuditLog, 'id' | 'timestamp' | 'user' | 'role'>) => {
    const newLog: TAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().split('T')[0]} ${getCurrentTimeFormatted()}`,
      user: 'Amod Sharma',
      role: currentRole,
      ...entry,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const clearAllAuditLogs = (reason: string): { success: boolean; message: string } => {
    if (currentRole !== 'Super Admin') {
      showToast('Only Super Admin can clear the audit log.', 'error');
      return { success: false, message: 'Unauthorized. Super Admin role required.' };
    }
    setAuditLogs([]);
    showToast('All audit logs have been cleared.');
    return { success: true, message: 'All audit logs cleared.' };
  };

  const deleteAuditLog = (id: string) => {
    if (currentRole !== 'Super Admin') {
      showToast('Only Super Admin can delete audit records.', 'error');
      return;
    }
    setAuditLogs(prev => prev.filter(l => l.id !== id));
    showToast('Audit record deleted.');
  };

  // Initialize from localStorage or seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isDemoSaved = parsed.isDemoData ?? true;
        const normalizeDemo = (arr: any[]) =>
          (arr || []).map(item => ({
            ...item,
            isDemo: item.isDemo !== undefined ? item.isDemo : isDemoSaved,
          }));

        setClasses(normalizeDemo(parsed.classes || SEED_CLASSES));
        setBatches(normalizeDemo(parsed.batches || SEED_BATCHES));
        setTeachers(normalizeDemo(parsed.teachers || SEED_TEACHERS));
        setSubjects(normalizeDemo(parsed.subjects || SEED_SUBJECTS));
        setStudents(normalizeDemo(parsed.students || generateSeedStudents()));
        setSchedules(normalizeDemo(parsed.schedules || SEED_SCHEDULE_ITEMS));
        setAttendanceSessions(normalizeDemo(parsed.attendanceSessions || SEED_ATTENDANCE_SESSIONS));
        setLiveSession(parsed.liveSession || (isDemoSaved ? generateInitialLiveSession(parsed.students || generateSeedStudents()) : null));
        setLeaveRequests(normalizeDemo(parsed.leaveRequests || SEED_LEAVE_REQUESTS));
        setAbsentFollowUps(normalizeDemo(parsed.absentFollowUps || SEED_ABSENT_FOLLOWUPS));
        setHolidays(normalizeDemo(parsed.holidays || SEED_HOLIDAYS));
        setAuditLogs(parsed.auditLogs || SEED_AUDIT_LOGS);
        setIsDemoData(isDemoSaved);
      } else {
        const seedSt = generateSeedStudents();
        setStudents(seedSt);
        setAttendanceSessions(SEED_ATTENDANCE_SESSIONS);
        setLiveSession(generateInitialLiveSession(seedSt));
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
      const seedSt = generateSeedStudents();
      setStudents(seedSt);
      setAttendanceSessions(SEED_ATTENDANCE_SESSIONS);
      setLiveSession(generateInitialLiveSession(seedSt));
    }
    setIsInitialized(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          classes,
          batches,
          teachers,
          subjects,
          students,
          schedules,
          attendanceSessions,
          liveSession,
          leaveRequests,
          absentFollowUps,
          holidays,
          auditLogs,
          isDemoData,
        })
      );
    } catch (e) {
      console.error('Failed to persist attendance state:', e);
    }
  }, [classes, batches, teachers, subjects, students, schedules, attendanceSessions, liveSession, leaveRequests, absentFollowUps, holidays, auditLogs, isDemoData, isInitialized]);

  // -------------------------------------------------------------
  // DEPENDENCY SUMMARY (used by SmartDeleteDialog)
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // DEPENDENCY SUMMARY (used by SmartDeleteDialog)
  // -------------------------------------------------------------
  const getDependencySummary = (
    entityType: string,
    entityId: string
  ): DependencySummary => {
    const empty: DependencySummary = { batches: 0, students: 0, schedules: 0, attendanceSessions: 0, leaveRecords: 0, callRecords: 0, isDemoEntity: isDemoData };
    const type = (entityType || '').toLowerCase();

    if (type === 'class') {
      const cls = classes.find(c => c.id === entityId);
      if (!cls) return empty;
      const isDemo = cls.isDemo ?? isDemoData;
      const classBatches = batches.filter(b => b.classId === entityId);
      const classBatchIds = classBatches.map(b => b.id);
      const classStudents = students.filter(s => s.classId === entityId || classBatchIds.includes(s.batchId));
      const classSchedules = schedules.filter(s => s.classId === entityId || classBatchIds.includes(s.batchId));
      const classLeaves = leaveRequests.filter(l => l.classId === entityId || classBatchIds.includes(l.batchId));
      const classFollowUps = absentFollowUps.filter(f => f.classId === entityId || classBatchIds.includes(f.batchId));
      const sessionCount = attendanceSessions.filter(s => s.classId === entityId || classBatchIds.includes(s.batchId)).length +
        (liveSession && (liveSession.classId === entityId || classBatchIds.includes(liveSession.batchId)) ? 1 : 0);
      return {
        batches: classBatches.length,
        students: classStudents.length,
        schedules: classSchedules.length,
        attendanceSessions: sessionCount,
        leaveRecords: classLeaves.length,
        callRecords: classFollowUps.length,
        isDemoEntity: isDemo,
      };
    }

    if (type === 'batch') {
      const batch = batches.find(b => b.id === entityId);
      if (!batch) return empty;
      const isDemo = batch.isDemo ?? isDemoData;
      const batchStudents = students.filter(s => s.batchId === entityId);
      const batchSchedules = schedules.filter(s => s.batchId === entityId);
      const batchLeaves = leaveRequests.filter(l => l.batchId === entityId);
      const batchFollowUps = absentFollowUps.filter(f => f.batchId === entityId);
      const sessionCount = attendanceSessions.filter(s => s.batchId === entityId || s.batchName === entityId).length +
        (liveSession && (liveSession.batchId === entityId || liveSession.batchName === entityId) ? 1 : 0);
      return {
        batches: 0,
        students: batchStudents.length,
        schedules: batchSchedules.length,
        attendanceSessions: sessionCount,
        leaveRecords: batchLeaves.length,
        callRecords: batchFollowUps.length,
        isDemoEntity: isDemo,
      };
    }

    if (type === 'student') {
      const st = students.find(s => s.id === entityId);
      const isDemo = st?.isDemo ?? isDemoData;
      const sessionCount = attendanceSessions.filter(s => s.studentRecords && s.studentRecords[entityId]).length +
        (liveSession && liveSession.studentRecords && liveSession.studentRecords[entityId] ? 1 : 0);
      const leaves = leaveRequests.filter(l => l.studentId === entityId);
      const followUps = absentFollowUps.filter(f => f.studentId === entityId);
      return {
        batches: 0,
        students: 0,
        schedules: 0,
        attendanceSessions: sessionCount,
        leaveRecords: leaves.length,
        callRecords: followUps.length,
        isDemoEntity: isDemo,
      };
    }

    if (type === 'teacher') {
      const t = teachers.find(item => item.id === entityId);
      const isDemo = t?.isDemo ?? isDemoData;
      const teacherSchedules = schedules.filter(s => s.teacherId === entityId || s.teacherName === t?.name);
      return { ...empty, schedules: teacherSchedules.length, isDemoEntity: isDemo };
    }

    if (type === 'subject') {
      const sub = subjects.find(s => s.id === entityId);
      if (!sub) return empty;
      const isDemo = sub.isDemo ?? isDemoData;
      const subSchedules = schedules.filter(s => s.subject === sub.name);
      return { ...empty, schedules: subSchedules.length, isDemoEntity: isDemo };
    }

    if (type === 'schedule') {
      const sch = schedules.find(s => s.id === entityId);
      const isDemo = sch?.isDemo ?? isDemoData;
      const hasSessions = attendanceSessions.filter(s => s.scheduleId === entityId).length +
        (liveSession && liveSession.scheduleId === entityId ? 1 : 0);
      return { ...empty, attendanceSessions: hasSessions, isDemoEntity: isDemo };
    }

    if (type === 'holiday') {
      const hol = holidays.find(h => h.id === entityId);
      const isDemo = hol?.isDemo ?? isDemoData;
      const matchingSchedules = hol ? schedules.filter(s => s.date === hol.date) : [];
      const matchingSessions = hol ? attendanceSessions.filter(s => s.date === hol.date) : [];
      return {
        ...empty,
        schedules: matchingSchedules.length,
        attendanceSessions: matchingSessions.length,
        isDemoEntity: isDemo,
      };
    }

    return empty;
  };

  // -------------------------------------------------------------
  // CLASSES CRUD
  // -------------------------------------------------------------
  const addClass = (cls: Omit<TClass, 'id'>) => {
    const id = `cls-${Date.now()}`;
    const newClass: TClass = {
      ...cls,
      id,
      batches: cls.batches || [],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      isDemo: cls.isDemo !== undefined ? cls.isDemo : isDemoData,
    };
    setClasses(prev => [...prev, newClass]);
    addAuditLog({
      action: 'Class Added',
      entity: 'Class',
      entityId: id,
      newValue: `${cls.name} (${cls.displayName})`,
    });
    showToast(`Class "${cls.name}" added successfully.`);
    return { success: true, message: 'Class created.' };
  };

  const updateClass = (id: string, updates: Partial<TClass>) => {
    const existing = classes.find(c => c.id === id);
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    addAuditLog({
      action: 'Class Edited',
      entity: 'Class',
      entityId: id,
      previousValue: existing?.displayName,
      newValue: updates.displayName || updates.name,
    });
    showToast(`Class updated successfully.`);
  };

  const archiveClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, status: 'archived' } : c)));
    addAuditLog({
      action: 'Class Archived',
      entity: 'Class',
      entityId: id,
      previousValue: cls?.name,
      reason: 'Archived by administrator.',
    });
    showToast(`Class "${cls?.name}" moved to archives.`);
  };

  const restoreClass = (id: string) => {
    const cls = classes.find(c => c.id === id);
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, status: 'active' } : c)));
    addAuditLog({
      action: 'Class Restored',
      entity: 'Class',
      entityId: id,
      newValue: cls?.name,
    });
    showToast(`Class "${cls?.name}" restored to active status.`);
  };

  const deleteClassSafe = (id: string) => {
    const cls = classes.find(c => c.id === id);
    if (!cls) return { success: false, message: 'Class not found.' };

    const isDemo = isDemoData || Boolean(cls.isDemo);
    if (isDemo) {
      forceDeleteClass(id, 'Demo class cascade deletion.');
      return { success: true, message: `Demo class "${cls.name}" deleted.` };
    }

    // Dependency check: Active batches or students
    const activeBatches = batches.filter(b => b.classId === id && b.status === 'active');
    if (activeBatches.length > 0) {
      if (currentRole === 'Super Admin') {
        forceDeleteClass(id, 'Super Admin permanent deletion of class.');
        return { success: true, message: 'Class deleted by Super Admin.' };
      }
      showToast(`Cannot delete class with ${activeBatches.length} active batches. Archive it instead.`, 'error');
      return { success: false, message: 'Class contains active batches.' };
    }

    setClasses(prev => prev.filter(c => c.id !== id));
    addAuditLog({
      action: 'Class Deleted',
      entity: 'Class',
      entityId: id,
      previousValue: cls.name,
      reason: 'Permanently deleted (zero dependencies).',
    });
    showToast(`Class "${cls.name}" deleted permanently.`);
    return { success: true, message: 'Class deleted.' };
  };

  // -------------------------------------------------------------
  // BATCHES CRUD
  // -------------------------------------------------------------
  const addBatch = (batch: Omit<TBatch, 'id'>) => {
    const id = batch.name.replace(/\s+/g, '');
    const newBatch: TBatch = {
      ...batch,
      id,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      isDemo: batch.isDemo !== undefined ? batch.isDemo : isDemoData,
    };
    setBatches(prev => [...prev, newBatch]);

    // Update parent class batches list
    setClasses(prev =>
      prev.map(c => (c.id === batch.classId ? { ...c, batches: [...c.batches, newBatch.name] } : c))
    );

    addAuditLog({
      action: 'Batch Added',
      entity: 'Batch',
      entityId: id,
      newValue: `Batch ${batch.name} (${batch.className})`,
    });
    showToast(`Batch "${batch.name}" created successfully.`);
    return { success: true, message: 'Batch created.' };
  };

  const updateBatch = (id: string, updates: Partial<TBatch>) => {
    const existing = batches.find(b => b.id === id);
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    addAuditLog({
      action: 'Batch Edited',
      entity: 'Batch',
      entityId: id,
      previousValue: existing?.name,
      newValue: updates.name,
    });
    showToast(`Batch updated successfully.`);
  };

  const archiveBatch = (id: string) => {
    const batch = batches.find(b => b.id === id);
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, status: 'archived' } : b)));
    addAuditLog({
      action: 'Batch Archived',
      entity: 'Batch',
      entityId: id,
      previousValue: batch?.name,
    });
    showToast(`Batch "${batch?.name}" moved to archives.`);
  };

  const restoreBatch = (id: string) => {
    const batch = batches.find(b => b.id === id);
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, status: 'active' } : b)));
    addAuditLog({
      action: 'Batch Restored',
      entity: 'Batch',
      entityId: id,
      newValue: batch?.name,
    });
    showToast(`Batch "${batch?.name}" restored.`);
  };

  const deleteBatchSafe = (id: string) => {
    const batch = batches.find(b => b.id === id);
    if (!batch) return { success: false, message: 'Batch not found.' };

    const isDemo = isDemoData || Boolean(batch.isDemo);
    if (isDemo) {
      forceDeleteBatch(id, 'Demo batch cascade deletion.');
      return { success: true, message: `Demo batch "${batch.name}" deleted.` };
    }

    const activeStudents = students.filter(s => s.batchId === batch.name && s.status === 'active');
    if (activeStudents.length > 0) {
      if (currentRole === 'Super Admin') {
        forceDeleteBatch(id, 'Super Admin permanent deletion of batch.');
        return { success: true, message: 'Batch deleted by Super Admin.' };
      }
      showToast(`Cannot delete batch with ${activeStudents.length} active students. Transfer students or archive batch.`, 'error');
      return { success: false, message: 'Batch has enrolled students.' };
    }

    setBatches(prev => prev.filter(b => b.id !== id));
    addAuditLog({
      action: 'Batch Deleted',
      entity: 'Batch',
      entityId: id,
      previousValue: batch.name,
      reason: 'Permanently deleted (zero students enrolled).',
    });
    showToast(`Batch "${batch.name}" deleted permanently.`);
    return { success: true, message: 'Batch deleted.' };
  };

  // -------------------------------------------------------------
  // STUDENTS CRUD & BATCH TRANSFERS
  // -------------------------------------------------------------
  const addStudent = (student: Omit<TStudent, 'id'>) => {
    const id = `st-${Date.now()}`;
    const newStudent: TStudent = {
      ...student,
      id,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      batchHistory: [],
      isDemo: student.isDemo !== undefined ? student.isDemo : isDemoData,
    };
    setStudents(prev => [newStudent, ...prev]);
    addAuditLog({
      action: 'Student Added',
      entity: 'Student',
      entityId: id,
      newValue: `${student.name} in Class ${student.className} (${student.batchName})`,
    });
    showToast(`Student "${student.name}" enrolled successfully.`);
  };

  const updateStudent = (id: string, updates: Partial<TStudent>) => {
    const existing = students.find(s => s.id === id);
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    addAuditLog({
      action: 'Student Edited',
      entity: 'Student',
      entityId: id,
      previousValue: existing?.name,
      newValue: updates.name || 'Updated details',
    });
    showToast(`Student records updated.`);
  };

  const archiveStudent = (id: string, reason?: string) => {
    const st = students.find(s => s.id === id);
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status: 'archived' } : s)));
    addAuditLog({
      action: 'Student Archived',
      entity: 'Student',
      entityId: id,
      previousValue: st?.name,
      reason: reason || 'Student deactivated/archived.',
    });
    showToast(`Student "${st?.name}" deactivated and archived.`);
  };

  const restoreStudent = (id: string, newBatchId?: string) => {
    const st = students.find(s => s.id === id);
    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'active',
            batchId: newBatchId || s.batchId,
            batchName: newBatchId || s.batchName,
          };
        }
        return s;
      })
    );
    addAuditLog({
      action: 'Student Restored',
      entity: 'Student',
      entityId: id,
      newValue: `${st?.name} reactivated`,
    });
    showToast(`Student "${st?.name}" restored to active status.`);
  };

  const transferStudentBatch = (studentId: string, toBatchId: string, effectiveDate: string, reason?: string) => {
    const st = students.find(s => s.id === studentId);
    const toBatch = batches.find(b => b.name === toBatchId || b.id === toBatchId);
    if (!st || !toBatch) return;

    const fromBatchName = st.batchName;
    const transferRecord = {
      fromBatchId: st.batchId,
      fromBatchName,
      toBatchId: toBatch.id,
      toBatchName: toBatch.name,
      effectiveDate,
      transferredAt: getCurrentTimeFormatted(),
      transferredBy: `Amod Sharma (${currentRole})`,
      reason: reason || 'Batch transfer requested',
    };

    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            batchId: toBatch.id,
            batchName: toBatch.name,
            classId: toBatch.classId,
            className: toBatch.className,
            batchHistory: [...(s.batchHistory || []), transferRecord],
          };
        }
        return s;
      })
    );

    addAuditLog({
      action: 'Student Transferred',
      entity: 'Student Batch Transfer',
      entityId: studentId,
      previousValue: `Batch ${fromBatchName}`,
      newValue: `Batch ${toBatch.name} (Effective ${effectiveDate})`,
      reason,
    });

    showToast(`Student "${st.name}" transferred to Batch ${toBatch.name} effective ${effectiveDate}.`);
  };

  const deleteStudentSafe = (id: string) => {
    const st = students.find(s => s.id === id);
    if (!st) return { success: false, message: 'Student not found.' };

    const isDemo = isDemoData || Boolean(st.isDemo);
    if (isDemo) {
      forceDeleteStudent(id, 'Demo student cascade deletion.');
      return { success: true, message: `Demo student "${st.name}" deleted.` };
    }

    // Check if attendance records exist for real data
    const hasPastSession = (liveSession && liveSession.studentRecords[id]?.status === 'present') ||
      leaveRequests.some(l => l.studentId === id) ||
      absentFollowUps.some(f => f.studentId === id);

    if (hasPastSession) {
      if (currentRole === 'Super Admin') {
        forceDeleteStudent(id, 'Super Admin permanent deletion of student.');
        return { success: true, message: `Student "${st.name}" deleted by Super Admin.` };
      }
      showToast(`Cannot delete student with attendance records. Use "Archive / Deactivate" instead.`, 'error');
      return { success: false, message: 'Student has recorded attendance.' };
    }

    setStudents(prev => prev.filter(s => s.id !== id));
    addAuditLog({
      action: 'Student Deleted',
      entity: 'Student',
      entityId: id,
      previousValue: st.name,
      reason: 'Permanently deleted (zero historical records).',
    });
    showToast(`Student "${st.name}" permanently deleted.`);
    return { success: true, message: 'Student deleted.' };
  };

  const bulkArchiveStudents = (studentIds: string[]) => {
    setStudents(prev =>
      prev.map(s => (studentIds.includes(s.id) ? { ...s, status: 'archived' } : s))
    );
    showToast(`${studentIds.length} students moved to archives.`);
  };

  const bulkTransferStudents = (studentIds: string[], toBatchId: string, effectiveDate: string) => {
    const toBatch = batches.find(b => b.name === toBatchId || b.id === toBatchId);
    if (!toBatch) return;

    setStudents(prev =>
      prev.map(s => {
        if (studentIds.includes(s.id)) {
          return {
            ...s,
            batchId: toBatch.id,
            batchName: toBatch.name,
            classId: toBatch.classId,
            className: toBatch.className,
            batchHistory: [
              ...(s.batchHistory || []),
              {
                fromBatchId: s.batchId,
                fromBatchName: s.batchName,
                toBatchId: toBatch.id,
                toBatchName: toBatch.name,
                effectiveDate,
                transferredAt: getCurrentTimeFormatted(),
                reason: 'Bulk batch transfer',
              },
            ],
          };
        }
        return s;
      })
    );
    showToast(`${studentIds.length} students transferred to Batch ${toBatch.name}.`);
  };

    // Bulk Delete Students (selected IDs)
  const bulkDeleteStudents = (studentIds: string[]) => {
    studentIds.forEach(id => {
      const st = students.find(s => s.id === id);
      if (!st) return;
      const isDemo = isDemoData || Boolean(st.isDemo);
      if (isDemo) {
        // Force delete demo student to cascade delete related demo records
        forceDeleteStudent(id, 'Demo student cascade deletion.');
      } else {
        // Safe delete for real data respecting constraints
        deleteStudentSafe(id);
      }
    });
    showToast(`${studentIds.length} student(s) deleted ${isDemoData ? '(demo)' : ''}.`);
  };

  // -------------------------------------------------------------
  // TEACHERS CRUD
  // -------------------------------------------------------------
  const addTeacher = (teacher: Omit<TTeacher, 'id'>) => {
    const id = `t-${Date.now()}`;
    const newT: TTeacher = {
      ...teacher,
      id,
      status: 'active',
      joiningDate: teacher.joiningDate || new Date().toISOString().split('T')[0],
      isDemo: teacher.isDemo !== undefined ? teacher.isDemo : isDemoData,
    };
    setTeachers(prev => [...prev, newT]);
    addAuditLog({
      action: 'Teacher Added',
      entity: 'Teacher',
      entityId: id,
      newValue: `${teacher.name} (${teacher.subject})`,
    });
    showToast(`Teacher "${teacher.name}" added successfully.`);
  };

  const updateTeacher = (id: string, updates: Partial<TTeacher>) => {
    const existing = teachers.find(t => t.id === id);
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    addAuditLog({
      action: 'Teacher Edited',
      entity: 'Teacher',
      entityId: id,
      previousValue: existing?.name,
      newValue: updates.name,
    });
    showToast(`Teacher updated successfully.`);
  };

  const archiveTeacher = (id: string) => {
    const t = teachers.find(item => item.id === id);
    setTeachers(prev => prev.map(item => (item.id === id ? { ...item, status: 'archived' } : item)));
    addAuditLog({
      action: 'Teacher Archived',
      entity: 'Teacher',
      entityId: id,
      previousValue: t?.name,
      reason: 'Archived from active faculty. Historical classes preserved.',
    });
    showToast(`Teacher "${t?.name}" archived.`);
  };

  const restoreTeacher = (id: string) => {
    const t = teachers.find(item => item.id === id);
    setTeachers(prev => prev.map(item => (item.id === id ? { ...item, status: 'active' } : item)));
    addAuditLog({
      action: 'Teacher Restored',
      entity: 'Teacher',
      entityId: id,
      newValue: t?.name,
    });
    showToast(`Teacher "${t?.name}" restored to active.`);
  };

  const deleteTeacherSafe = (id: string) => {
    const t = teachers.find(item => item.id === id);
    if (!t) return { success: false, message: 'Teacher not found.' };

    const isDemo = isDemoData || Boolean(t.isDemo);
    if (isDemo) {
      forceDeleteTeacher(id, 'Demo teacher cascade deletion.');
      return { success: true, message: `Demo teacher "${t.name}" deleted.` };
    }

    const hasClasses = schedules.some(s => s.teacherId === id || s.teacherName === t.name);
    if (hasClasses) {
      if (currentRole === 'Super Admin') {
        forceDeleteTeacher(id, 'Super Admin permanent deletion of teacher.');
        return { success: true, message: `Teacher "${t.name}" deleted by Super Admin.` };
      }
      showToast(`Cannot delete teacher assigned to classes. Use "Archive" to preserve history.`, 'error');
      return { success: false, message: 'Teacher has assigned classes.' };
    }

    setTeachers(prev => prev.filter(item => item.id !== id));
    addAuditLog({
      action: 'Teacher Deleted',
      entity: 'Teacher',
      entityId: id,
      previousValue: t.name,
      reason: 'Permanently deleted (zero teaching history).',
    });
    showToast(`Teacher "${t.name}" deleted.`);
    return { success: true, message: 'Teacher deleted.' };
  };

  // -------------------------------------------------------------
  // SUBJECTS CRUD
  // -------------------------------------------------------------
  const addSubject = (sub: Omit<TSubject, 'id'>) => {
    const id = `sub-${Date.now()}`;
    const newSub: TSubject = {
      ...sub,
      id,
      status: 'active',
      avgAttendance: '85%',
      isDemo: sub.isDemo !== undefined ? sub.isDemo : isDemoData,
    };
    setSubjects(prev => [...prev, newSub]);
    addAuditLog({
      action: 'Subject Added',
      entity: 'Subject',
      entityId: id,
      newValue: `${sub.name} (${sub.code})`,
    });
    showToast(`Subject "${sub.name}" added successfully.`);
  };

  const updateSubject = (id: string, updates: Partial<TSubject>) => {
    const existing = subjects.find(s => s.id === id);
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    addAuditLog({
      action: 'Subject Edited',
      entity: 'Subject',
      entityId: id,
      previousValue: existing?.name,
      newValue: updates.name,
    });
    showToast(`Subject updated.`);
  };

  const archiveSubject = (id: string) => {
    const s = subjects.find(item => item.id === id);
    setSubjects(prev => prev.map(item => (item.id === id ? { ...item, status: 'archived' } : item)));
    addAuditLog({
      action: 'Subject Archived',
      entity: 'Subject',
      entityId: id,
      previousValue: s?.name,
      reason: 'Archived from curriculum. Historical records intact.',
    });
    showToast(`Subject "${s?.name}" archived.`);
  };

  const restoreSubject = (id: string) => {
    const s = subjects.find(item => item.id === id);
    setSubjects(prev => prev.map(item => (item.id === id ? { ...item, status: 'active' } : item)));
    addAuditLog({
      action: 'Subject Restored',
      entity: 'Subject',
      entityId: id,
      newValue: s?.name,
    });
    showToast(`Subject "${s?.name}" restored.`);
  };

  const deleteSubjectSafe = (id: string) => {
    const s = subjects.find(item => item.id === id);
    if (!s) return { success: false, message: 'Subject not found.' };

    const isDemo = isDemoData || Boolean(s.isDemo);
    if (isDemo) {
      forceDeleteSubject(id, 'Demo subject cascade deletion.');
      return { success: true, message: `Demo subject "${s.name}" deleted.` };
    }

    const hasSchedules = schedules.some(sch => sch.subject === s.name);
    if (hasSchedules) {
      if (currentRole === 'Super Admin') {
        forceDeleteSubject(id, 'Super Admin permanent deletion of subject.');
        return { success: true, message: `Subject "${s.name}" deleted by Super Admin.` };
      }
      showToast(`Cannot delete subject scheduled in classes. Use Archive instead.`, 'error');
      return { success: false, message: 'Subject used in timetable.' };
    }

    setSubjects(prev => prev.filter(item => item.id !== id));
    addAuditLog({
      action: 'Subject Deleted',
      entity: 'Subject',
      entityId: id,
      previousValue: s.name,
      reason: 'Deleted (zero dependencies).',
    });
    showToast(`Subject "${s.name}" deleted.`);
    return { success: true, message: 'Subject deleted.' };
  };

  // -------------------------------------------------------------
  // FORCE DELETE FUNCTIONS (cascade-safe permanent deletion)
  // Used by SmartDeleteDialog for Demo Mode or Super Admin action
  // -------------------------------------------------------------

  const forceDeleteClass = (id: string, reason: string) => {
    const cls = classes.find(c => c.id === id);
    if (!cls) return;

    const isDemo = isDemoData || Boolean(cls.isDemo);

    // Cascade: collect all dependents
    const classBatches = batches.filter(b => b.classId === id && (!isDemo || b.isDemo !== false));
    const classBatchIds = classBatches.map(b => b.id);
    const classStudents = students.filter(s => (s.classId === id || classBatchIds.includes(s.batchId)) && (!isDemo || s.isDemo !== false));
    const classStudentIds = classStudents.map(s => s.id);

    // Remove students in this class
    setStudents(prev => prev.filter(s => !(s.classId === id || classBatchIds.includes(s.batchId))));
    // Remove batches in this class
    setBatches(prev => prev.filter(b => b.classId !== id));
    // Remove schedules
    setSchedules(prev => prev.filter(s => !(s.classId === id || classBatchIds.includes(s.batchId))));
    // Remove leave requests
    setLeaveRequests(prev => prev.filter(l => !(l.classId === id || classBatchIds.includes(l.batchId))));
    // Remove followups
    setAbsentFollowUps(prev => prev.filter(f => !(f.classId === id || classBatchIds.includes(f.batchId))));
    // Remove class
    setClasses(prev => prev.filter(c => c.id !== id));

    // Reset or clean liveSession if it belongs to this class
    setLiveSession(prev => {
      if (!prev) return null;
      if (prev.classId === id || classBatchIds.includes(prev.batchId)) {
        return null;
      }
      const nextRecords = { ...prev.studentRecords };
      let changed = false;
      classStudentIds.forEach(stId => {
        if (nextRecords[stId]) {
          delete nextRecords[stId];
          changed = true;
        }
      });
      return changed ? { ...prev, studentRecords: nextRecords } : prev;
    });

    const totalRemoved = classBatchIds.length + classStudentIds.length;
    addAuditLog({
      action: 'Class Deleted',
      entity: 'Class',
      entityId: id,
      previousValue: cls.name,
      reason,
      dependentRecordsDeleted: totalRemoved,
    });
    showToast(`Class "${cls.name}" and all dependent records permanently deleted.`, isDemo ? 'success' : 'warning');
  };

  const forceDeleteBatch = (id: string, reason: string) => {
    const batch = batches.find(b => b.id === id);
    if (!batch) return;

    const isDemo = isDemoData || Boolean(batch.isDemo);
    const batchStudents = students.filter(s => s.batchId === id && (!isDemo || s.isDemo !== false));
    const batchStudentIds = batchStudents.map(s => s.id);

    setStudents(prev => prev.filter(s => !(s.batchId === id && (!isDemo || s.isDemo !== false))));
    setSchedules(prev => prev.filter(s => s.batchId !== id));
    setLeaveRequests(prev => prev.filter(l => l.batchId !== id));
    setAbsentFollowUps(prev => prev.filter(f => f.batchId !== id));
    setBatches(prev => prev.filter(b => b.id !== id));

    // Update parent class batch list
    setClasses(prev =>
      prev.map(c => c.id === batch.classId ? { ...c, batches: c.batches.filter(n => n !== batch.name && n !== batch.id) } : c)
    );

    // Reset or clean liveSession if it belongs to this batch
    setLiveSession(prev => {
      if (!prev) return null;
      if (prev.batchId === id) {
        return null;
      }
      const nextRecords = { ...prev.studentRecords };
      let changed = false;
      batchStudentIds.forEach(stId => {
        if (nextRecords[stId]) {
          delete nextRecords[stId];
          changed = true;
        }
      });
      return changed ? { ...prev, studentRecords: nextRecords } : prev;
    });

    const totalRemoved = batchStudentIds.length;
    addAuditLog({
      action: 'Batch Deleted',
      entity: 'Batch',
      entityId: id,
      previousValue: batch.name,
      reason,
      dependentRecordsDeleted: totalRemoved,
    });
    showToast(`Batch "${batch.name}" and ${totalRemoved} student(s) permanently deleted.`, isDemo ? 'success' : 'warning');
  };

  const forceDeleteStudent = (id: string, reason: string) => {
    const st = students.find(s => s.id === id);
    if (!st) return;

    const isDemo = isDemoData || Boolean(st.isDemo);
    const sessionCount = liveSession && liveSession.studentRecords[id] ? 1 : 0;
    const leaveCount = leaveRequests.filter(l => l.studentId === id).length;
    const followUpCount = absentFollowUps.filter(f => f.studentId === id).length;

    setStudents(prev => prev.filter(s => s.id !== id));
    setLeaveRequests(prev => prev.filter(l => l.studentId !== id));
    setAbsentFollowUps(prev => prev.filter(f => f.studentId !== id));

    // Clean up student from liveSession
    setLiveSession(prev => {
      if (!prev || !prev.studentRecords[id]) return prev;
      const nextRecords = { ...prev.studentRecords };
      delete nextRecords[id];
      return {
        ...prev,
        studentRecords: nextRecords,
      };
    });

    const totalRemoved = sessionCount + leaveCount + followUpCount;
    addAuditLog({
      action: 'Student Deleted',
      entity: 'Student',
      entityId: id,
      previousValue: st.name,
      reason,
      dependentRecordsDeleted: totalRemoved,
    });
    showToast(`Student "${st.name}" and all related demo records permanently deleted.`, isDemo ? 'success' : 'warning');
  };

  const forceDeleteTeacher = (id: string, reason: string) => {
    const t = teachers.find(item => item.id === id);
    if (!t) return;

    const isDemo = isDemoData || Boolean(t.isDemo);
    const schedCount = schedules.filter(s => s.teacherId === id || s.teacherName === t.name).length;

    if (isDemo) {
      // In demo mode: remove demo schedules assigned to this teacher
      setSchedules(prev => prev.filter(s => !(s.teacherId === id || s.teacherName === t.name)));
      setLiveSession(prev => {
        if (!prev) return null;
        if (prev.teacherName === t.name) {
          return { ...prev, teacherName: 'Unassigned Faculty' };
        }
        return prev;
      });
    } else {
      // Real mode: orphan schedules (history preserved)
      setSchedules(prev =>
        prev.map(s => (s.teacherId === id || s.teacherName === t.name) ? { ...s, teacherName: `${t.name} (Removed)`, teacherId: '' } : s)
      );
    }

    setTeachers(prev => prev.filter(item => item.id !== id));

    addAuditLog({
      action: 'Teacher Deleted',
      entity: 'Teacher',
      entityId: id,
      previousValue: t.name,
      reason,
      dependentRecordsDeleted: schedCount,
    });
    showToast(`Teacher "${t.name}" permanently deleted.`, isDemo ? 'success' : 'warning');
  };

  const forceDeleteSubject = (id: string, reason: string) => {
    const s = subjects.find(item => item.id === id);
    if (!s) return;

    const isDemo = isDemoData || Boolean(s.isDemo);
    const schedCount = schedules.filter(sch => sch.subject === s.name).length;

    if (isDemo) {
      // In demo mode: remove demo schedules for this subject
      setSchedules(prev => prev.filter(sch => sch.subject !== s.name));
      setLiveSession(prev => (prev && prev.subject === s.name ? null : prev));
    }

    setSubjects(prev => prev.filter(item => item.id !== id));

    addAuditLog({
      action: 'Subject Deleted',
      entity: 'Subject',
      entityId: id,
      previousValue: s.name,
      reason,
      dependentRecordsDeleted: schedCount,
    });
    showToast(`Subject "${s.name}" permanently deleted.`, isDemo ? 'success' : 'warning');
  };

  const forceDeleteScheduleItem = (id: string, reason: string) => {
    const orig = schedules.find(s => s.id === id);
    if (!orig) return;

    // If live session is this schedule, clear it
    setLiveSession(prev => (prev && prev.scheduleId === id ? null : prev));
    setSchedules(prev => prev.filter(s => s.id !== id));

    addAuditLog({
      action: 'Schedule Cancelled',
      entity: 'Class Schedule',
      entityId: id,
      previousValue: `${orig.className} ${orig.batchName} — ${orig.subject}`,
      reason,
    });
    showToast(`Class session permanently deleted.`, 'success');
  };

  const editAttendanceRecord = (
    sessionId: string,
    studentId: string,
    updates: { checkInTime?: string; checkOutTime?: string; status?: StudentStatus },
    reason: string
  ) => {
    const student = students.find(s => s.id === studentId);
    let prevRec: any = null;
    let newStatus: StudentStatus = 'present';
    let checkIn: string | undefined;

    if (liveSession && liveSession.id === sessionId) {
      prevRec = liveSession.studentRecords[studentId];
      newStatus = updates.status || prevRec?.status || 'present';
      checkIn = updates.checkInTime || prevRec?.checkInTime;
      const checkOut = updates.checkOutTime || prevRec?.checkOutTime;

      const timing = calculateStudentAttendanceTiming(
        liveSession.scheduledStartTime,
        liveSession.scheduledEndTime,
        checkIn,
        checkOut,
        !!checkOut
      );

      setLiveSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          studentRecords: {
            ...prev.studentRecords,
            [studentId]: {
              ...prev.studentRecords[studentId],
              status: newStatus,
              checkInTime: checkIn,
              checkOutTime: checkOut,
              attendedMinutes: timing.attendedMinutes,
              missedMinutes: timing.missedMinutes,
              extraMinutes: timing.extraMinutes,
              lastEditedAt: getCurrentTimeFormatted(),
              lastEditedBy: 'Amod Sharma (Admin)',
              editReason: reason,
            },
          },
        };
      });
    }

    setAttendanceSessions(prev =>
      prev.map(sess => {
        if (sess.id === sessionId && sess.studentRecords && sess.studentRecords[studentId]) {
          const rec = sess.studentRecords[studentId];
          prevRec = prevRec || rec;
          newStatus = updates.status || rec.status || 'present';
          checkIn = updates.checkInTime || rec.checkInTime;
          const checkOut = updates.checkOutTime || rec.checkOutTime;
          const timing = calculateStudentAttendanceTiming(
            sess.scheduledStartTime,
            sess.scheduledEndTime,
            checkIn,
            checkOut,
            true
          );
          return {
            ...sess,
            studentRecords: {
              ...sess.studentRecords,
              [studentId]: {
                ...rec,
                status: newStatus,
                checkInTime: checkIn,
                checkOutTime: checkOut,
                attendedMinutes: timing.attendedMinutes,
                missedMinutes: timing.missedMinutes,
                extraMinutes: timing.extraMinutes,
                lastEditedAt: getCurrentTimeFormatted(),
                lastEditedBy: 'Amod Sharma (Admin)',
                editReason: reason,
              },
            },
          };
        }
        return sess;
      })
    );

    addAuditLog({
      action: 'Attendance Edited',
      entity: 'Student Attendance',
      entityId: studentId,
      previousValue: `${prevRec?.status || 'Unknown'} (${prevRec?.checkInTime || '-'})`,
      newValue: `${newStatus} (${checkIn || '-'})`,
      reason,
    });

    showToast(`Attendance updated for ${student?.name || 'student'}. Logged in audit trail.`);
  };

  const voidAttendanceRecord = (sessionId: string, studentId: string, reason: string) => {
    const student = students.find(s => s.id === studentId);
    let prevRec: any = null;

    if (liveSession && liveSession.id === sessionId) {
      prevRec = liveSession.studentRecords[studentId];
      setLiveSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          studentRecords: {
            ...prev.studentRecords,
            [studentId]: {
              ...prev.studentRecords[studentId],
              status: 'not_arrived',
              isVoided: true,
              voidReason: reason,
              voidedBy: 'Amod Sharma (Admin)',
              attendedMinutes: 0,
              missedMinutes: 0,
              extraMinutes: 0,
              checkInTime: undefined,
              checkOutTime: undefined,
              isOngoing: false,
            },
          },
        };
      });
    }

    setAttendanceSessions(prev =>
      prev.map(sess => {
        if (sess.id === sessionId && sess.studentRecords && sess.studentRecords[studentId]) {
          const rec = sess.studentRecords[studentId];
          prevRec = prevRec || rec;
          return {
            ...sess,
            studentRecords: {
              ...sess.studentRecords,
              [studentId]: {
                ...rec,
                status: 'not_arrived',
                isVoided: true,
                voidReason: reason,
                voidedBy: 'Amod Sharma (Admin)',
                attendedMinutes: 0,
                missedMinutes: 0,
                extraMinutes: 0,
                checkInTime: undefined,
                checkOutTime: undefined,
                isOngoing: false,
              },
            },
          };
        }
        return sess;
      })
    );

    addAuditLog({
      action: 'Attendance Voided',
      entity: 'Student Attendance',
      entityId: studentId,
      previousValue: `${prevRec?.status || 'Unknown'} (Check-in ${prevRec?.checkInTime || '-'})`,
      newValue: 'Voided (Not Arrived)',
      reason,
    });

    showToast(`Attendance record voided for ${student?.name || 'student'}.`, 'warning');
  };

  // -------------------------------------------------------------
  // LIVE ATTENDANCE (STANDARD WORKFLOW)
  // -------------------------------------------------------------
  const markStudentPresent = (studentId: string, customTime?: string) => {
    if (!liveSession) return;
    const time = customTime || getCurrentTimeFormatted();
    const timing = calculateStudentAttendanceTiming(
      liveSession.scheduledStartTime,
      liveSession.scheduledEndTime,
      time
    );

    setLiveSession(prev => {
      if (!prev) return prev;
      const rec = prev.studentRecords[studentId];
      if (!rec) return prev;
      return {
        ...prev,
        studentRecords: {
          ...prev.studentRecords,
          [studentId]: {
            ...rec,
            status: 'present',
            checkInTime: time,
            attendedMinutes: timing.attendedMinutes,
            missedMinutes: timing.missedMinutes,
            extraMinutes: timing.extraMinutes,
            isOngoing: true,
          },
        },
      };
    });
    showToast(`Marked present at ${time}.`);
  };

  const markStudentStatus = (studentId: string, status: StudentStatus, reason?: string) => {
    if (!liveSession) return;
    setLiveSession(prev => {
      if (!prev) return prev;
      const rec = prev.studentRecords[studentId];
      if (!rec) return prev;
      return {
        ...prev,
        studentRecords: {
          ...prev.studentRecords,
          [studentId]: {
            ...rec,
            status,
            leaveReason: status === 'leave' ? reason : undefined,
            absenceRemark: status === 'absent' ? reason : undefined,
            checkInTime: status === 'present' ? (rec.checkInTime || getCurrentTimeFormatted()) : undefined,
            isOngoing: status === 'present',
          },
        },
      };
    });

    if (status === 'absent') {
      const student = students.find(s => s.id === studentId);
      if (student) {
        setAbsentFollowUps(prev => {
          if (prev.some(f => f.studentId === studentId && f.date === liveSession.date)) return prev;
          return [
            {
              id: `af-${Date.now()}-${studentId}`,
              date: liveSession.date,
              studentId: student.id,
              studentName: student.name,
              classId: student.classId,
              className: student.className,
              batchId: student.batchId,
              batchName: student.batchName,
              subject: liveSession.subject,
              missedHours: `${Math.round(liveSession.scheduledDurationMinutes / 60)}h`,
              callStatus: 'Not Contacted',
              contactNumber: student.parentPhone,
              remark: 'Marked absent in live session.',
            },
            ...prev,
          ];
        });
      }
    }
  };

  const bulkMarkPresent = (studentIds: string[]) => {
    if (!liveSession) return;
    const nowTime = getCurrentTimeFormatted();
    setLiveSession(prev => {
      if (!prev) return prev;
      const updatedRecords = { ...prev.studentRecords };
      studentIds.forEach(id => {
        const rec = updatedRecords[id];
        if (rec && rec.status !== 'present') {
          const timing = calculateStudentAttendanceTiming(
            prev.scheduledStartTime,
            prev.scheduledEndTime,
            nowTime
          );
          updatedRecords[id] = {
            ...rec,
            status: 'present',
            checkInTime: nowTime,
            attendedMinutes: timing.attendedMinutes,
            missedMinutes: timing.missedMinutes,
            extraMinutes: timing.extraMinutes,
            isOngoing: true,
          };
        }
      });
      return { ...prev, studentRecords: updatedRecords };
    });
    showToast(`${studentIds.length} students checked in at ${nowTime}.`);
  };

  const markStudentExit = (studentId: string, customTime?: string) => {
    if (!liveSession) return;
    const exitTime = customTime || getCurrentTimeFormatted();

    setLiveSession(prev => {
      if (!prev) return prev;
      const rec = prev.studentRecords[studentId];
      if (!rec || !rec.checkInTime) return prev;

      const timing = calculateStudentAttendanceTiming(
        prev.scheduledStartTime,
        prev.scheduledEndTime,
        rec.checkInTime,
        exitTime,
        true
      );

      return {
        ...prev,
        studentRecords: {
          ...prev.studentRecords,
          [studentId]: {
            ...rec,
            checkOutTime: exitTime,
            attendedMinutes: timing.attendedMinutes,
            missedMinutes: timing.missedMinutes,
            extraMinutes: timing.extraMinutes,
            isOngoing: false,
          },
        },
      };
    });
    showToast(`Exit recorded at ${exitTime}.`);
  };

  const markExitAllPresent = (customTime?: string) => {
    if (!liveSession) return;
    const exitTime = customTime || getCurrentTimeFormatted();

    setLiveSession(prev => {
      if (!prev) return prev;
      const updatedRecords = { ...prev.studentRecords };

      Object.keys(updatedRecords).forEach(id => {
        const rec = updatedRecords[id];
        if (rec.status === 'present' && !rec.checkOutTime) {
          const timing = calculateStudentAttendanceTiming(
            prev.scheduledStartTime,
            prev.scheduledEndTime,
            rec.checkInTime,
            exitTime,
            true
          );
          updatedRecords[id] = {
            ...rec,
            checkOutTime: exitTime,
            attendedMinutes: timing.attendedMinutes,
            missedMinutes: timing.missedMinutes,
            extraMinutes: timing.extraMinutes,
            isOngoing: false,
          };
        }
      });
      return { ...prev, studentRecords: updatedRecords };
    });
    showToast(`All present students checked out at ${exitTime}.`);
  };

  const bulkResolveUnmarked = (action: 'absent' | 'leave', reason?: string) => {
    if (!liveSession) return;
    setLiveSession(prev => {
      if (!prev) return prev;
      const updatedRecords = { ...prev.studentRecords };
      const newFollowUps: TAbsenceFollowUp[] = [];

      Object.keys(updatedRecords).forEach(id => {
        const rec = updatedRecords[id];
        if (rec.status === 'not_arrived') {
          updatedRecords[id] = {
            ...rec,
            status: action,
            leaveReason: action === 'leave' ? (reason || 'Informed via parent') : undefined,
            absenceRemark: action === 'absent' ? (reason || 'Unmarked at session end') : undefined,
            attendedMinutes: 0,
            missedMinutes: prev.scheduledDurationMinutes,
            extraMinutes: 0,
          };

          if (action === 'absent') {
            const st = students.find(s => s.id === id);
            if (st) {
              newFollowUps.push({
                id: `af-${Date.now()}-${id}`,
                date: prev.date,
                studentId: st.id,
                studentName: st.name,
                classId: st.classId,
                className: st.className,
                batchId: st.batchId,
                batchName: st.batchName,
                subject: prev.subject,
                missedHours: `${Math.round(prev.scheduledDurationMinutes / 60)}h`,
                callStatus: 'Not Contacted',
                contactNumber: st.parentPhone,
                remark: 'Auto-marked absent at session end.',
              });
            }
          }
        }
      });

      if (newFollowUps.length > 0) {
        setAbsentFollowUps(f => [...newFollowUps, ...f]);
      }
      return { ...prev, studentRecords: updatedRecords };
    });
  };

  const endLiveSession = () => {
    if (!liveSession) return;
    markExitAllPresent();
    const completedSession: TClassSession = {
      ...liveSession,
      sessionStatus: 'Completed',
      endedAt: getCurrentTimeFormatted(),
    };
    setLiveSession(completedSession);
    setAttendanceSessions(prev => {
      const idx = prev.findIndex(s => s.id === completedSession.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = completedSession;
        return next;
      }
      return [completedSession, ...prev];
    });
    setSchedules(prev =>
      prev.map(s => (s.id === liveSession.scheduleId ? { ...s, status: 'Completed' } : s))
    );
    showToast(`Session completed and attendance synchronized.`);
  };

  const startLiveSession = (scheduleId: string) => {
    const sch = schedules.find(s => s.id === scheduleId);
    if (!sch) return;
    const batchStudents = students.filter(
      st =>
        st.status === 'active' &&
        isClassApplicableToStudent(st, sch.date, sch.batchId || sch.batchName)
    );
    const studentRecords: Record<string, any> = {};

    batchStudents.forEach(st => {
      studentRecords[st.id] = {
        studentId: st.id,
        studentName: st.name,
        rollNo: st.rollNo,
        status: 'not_arrived',
        attendedMinutes: 0,
        missedMinutes: 0,
        extraMinutes: 0,
      };
    });

    const newSession: TClassSession = {
      id: `session-${Date.now()}`,
      scheduleId: sch.id,
      date: sch.date,
      classId: sch.classId,
      className: sch.className,
      batchId: sch.batchId,
      batchName: sch.batchName,
      subject: sch.subject,
      teacherName: sch.teacherName,
      scheduledStartTime: sch.startTime,
      scheduledEndTime: sch.endTime,
      scheduledDurationMinutes: sch.durationMinutes,
      sessionStatus: 'Ongoing',
      startedAt: getCurrentTimeFormatted(),
      studentRecords,
      isDemo: sch.isDemo !== undefined ? sch.isDemo : isDemoData,
    };

    setLiveSession(newSession);
    setAttendanceSessions(prev => {
      const idx = prev.findIndex(s => s.id === newSession.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newSession;
        return next;
      }
      return [newSession, ...prev];
    });
    setSchedules(prev =>
      prev.map(s => (s.id === scheduleId ? { ...s, status: 'Ongoing' } : s))
    );
    showToast(`Live session started for Batch ${sch.batchName} (${sch.subject}).`);
  };

  // -------------------------------------------------------------
  // SCHEDULE & HOLIDAYS
  // -------------------------------------------------------------
  const addScheduleItem = (item: Omit<TScheduleItem, 'id'>) => {
    const newItem: TScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
      isDemo: item.isDemo !== undefined ? item.isDemo : isDemoData,
    };
    setSchedules(prev => [...prev, newItem]);
    addAuditLog({
      action: 'Schedule Added',
      entity: 'Class Schedule',
      entityId: newItem.id,
      newValue: `${item.className} ${item.batchName} - ${item.subject} (${item.startTime}-${item.endTime})`,
    });
    showToast(`Class session scheduled successfully.`);
  };

  const updateScheduleItem = (id: string, updates: Partial<TScheduleItem>) => {
    setSchedules(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast(`Schedule item updated.`);
  };

  const duplicateScheduleItem = (id: string, newDate: string) => {
    const orig = schedules.find(s => s.id === id);
    if (!orig) return;
    const newId = `sch-${Date.now()}`;
    const duplicated: TScheduleItem = {
      ...orig,
      id: newId,
      date: newDate,
      status: 'Upcoming',
      type: 'extra',
      isDemo: orig.isDemo !== undefined ? orig.isDemo : isDemoData,
    };
    setSchedules(prev => [...prev, duplicated]);
    showToast(`Session duplicated for ${newDate}.`);
  };

  const rescheduleClass = (id: string, newDate: string, newStartTime: string, newEndTime: string) => {
    const orig = schedules.find(s => s.id === id);
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            date: newDate,
            startTime: newStartTime,
            endTime: newEndTime,
            type: 'rescheduled',
          };
        }
        return s;
      })
    );
    addAuditLog({
      action: 'Schedule Rescheduled',
      entity: 'Class Schedule',
      entityId: id,
      previousValue: `${orig?.date} ${orig?.startTime}`,
      newValue: `${newDate} ${newStartTime}`,
    });
    showToast(`Class session rescheduled.`);
  };

  const cancelClass = (id: string, reason: string) => {
    const orig = schedules.find(s => s.id === id);
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Cancelled',
            type: 'cancelled',
            cancellationReason: reason,
          };
        }
        return s;
      })
    );
    addAuditLog({
      action: 'Schedule Cancelled',
      entity: 'Class Schedule',
      entityId: id,
      previousValue: orig?.subject,
      reason,
    });
    showToast(`Class session cancelled. Does not count as student absence.`);
  };

  const deleteScheduleItemSafe = (id: string): { success: boolean; message: string } => {
    const orig = schedules.find(s => s.id === id);
    if (isDemoData || orig?.isDemo) {
      forceDeleteScheduleItem(id, 'Demo schedule item removed');
      return { success: true, message: 'Deleted demo schedule.' };
    }
    if (orig?.status === 'Completed') {
      showToast(`Cannot delete completed session with attendance history. Cancel it instead.`, 'error');
      return { success: false, message: 'Session is completed.' };
    }
    setSchedules(prev => prev.filter(s => s.id !== id));
    showToast(`Scheduled class removed.`);
    return { success: true, message: 'Deleted.' };
  };

  const addHoliday = (holiday: Omit<THoliday, 'id'>) => {
    const newH: THoliday = {
      ...holiday,
      id: `h-${Date.now()}`,
      status: 'active',
      isDemo: holiday.isDemo !== undefined ? holiday.isDemo : isDemoData,
    };
    setHolidays(prev => [...prev, newH]);
    addAuditLog({
      action: 'Holiday Declared',
      entity: 'Holiday',
      entityId: newH.id,
      newValue: `${holiday.title} on ${holiday.date}`,
      reason: holiday.reason,
    });
    showToast(`Institute holiday declared: "${holiday.title}".`);
  };

  const updateHoliday = (id: string, updates: Partial<THoliday>) => {
    const orig = holidays.find(h => h.id === id);
    setHolidays(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
    addAuditLog({
      action: 'Holiday Edited',
      entity: 'Holiday',
      entityId: id,
      previousValue: orig?.title,
      newValue: updates.title || orig?.title,
      reason: updates.reason || 'Holiday details updated',
    });
    showToast(`Holiday updated.`);
  };

  const archiveHoliday = (id: string) => {
    const orig = holidays.find(h => h.id === id);
    setHolidays(prev => prev.map(h => (h.id === id ? { ...h, status: 'archived' } : h)));
    addAuditLog({
      action: 'Holiday Archived',
      entity: 'Holiday',
      entityId: id,
      previousValue: orig?.title,
      reason: 'Holiday deactivated / archived',
    });
    showToast(`Holiday archived.`);
  };

  const deleteHoliday = (id: string, reason = 'Holiday removed') => {
    const orig = holidays.find(h => h.id === id);
    setHolidays(prev => prev.filter(h => h.id !== id));
    addAuditLog({
      action: 'Holiday Deleted',
      entity: 'Holiday',
      entityId: id,
      previousValue: orig?.title,
      reason,
    });
    showToast(`Holiday removed.`);
  };

  // -------------------------------------------------------------
  // LEAVES & FOLLOW UPS
  // -------------------------------------------------------------
  const addLeaveRequest = (req: Omit<TLeaveRequest, 'id' | 'appliedOn'>) => {
    const newReq: TLeaveRequest = {
      ...req,
      id: `lr-${Date.now()}`,
      appliedOn: new Date().toISOString().split('T')[0],
      isDemo: req.isDemo !== undefined ? req.isDemo : isDemoData,
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    showToast(`Leave request submitted for ${req.studentName}.`);
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    showToast(`Leave status updated to ${status}.`);
  };

  const updateLeaveRequest = (id: string, updates: Partial<TLeaveRequest>) => {
    setLeaveRequests(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
    showToast(`Leave request updated.`);
  };

  const deleteLeaveRequest = (id: string) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id));
    showToast(`Leave request removed.`);
  };

  const deleteAbsentFollowUp = (id: string) => {
    setAbsentFollowUps(prev => prev.filter(f => f.id !== id));
    showToast(`Follow-up record removed.`);
  };

  const logCallFollowUp = (data: {
    id: string;
    callStatus: CallStatus;
    spokeTo?: SpokeTo;
    parentReason?: string;
    remark?: string;
  }) => {
    setAbsentFollowUps(prev =>
      prev.map(item => {
        if (item.id === data.id) {
          return {
            ...item,
            callStatus: data.callStatus,
            spokeTo: data.spokeTo || item.spokeTo,
            parentReason: data.parentReason || item.parentReason,
            remark: data.remark || item.remark,
            lastContactedAt: getCurrentTimeFormatted(),
          };
        }
        return item;
      })
    );
    showToast(`Parent follow-up call recorded.`);
  };

  // -------------------------------------------------------------
  // DEMO DATA MANAGEMENT
  // -------------------------------------------------------------
  const clearAllDemoData = () => {
    setClasses(prev => prev.filter(c => c.isDemo === false));
    setBatches(prev => prev.filter(b => b.isDemo === false));
    setTeachers(prev => prev.filter(t => t.isDemo === false));
    setSubjects(prev => prev.filter(s => s.isDemo === false));
    setStudents(prev => prev.filter(st => st.isDemo === false));
    setSchedules(prev => prev.filter(s => s.isDemo === false));
    setAttendanceSessions(prev => prev.filter(s => s.isDemo === false));
    setLiveSession(prev => (prev?.isDemo ? null : prev));
    setLeaveRequests(prev => prev.filter(l => l.isDemo === false));
    setAbsentFollowUps(prev => prev.filter(f => f.isDemo === false));
    setHolidays(prev => prev.filter(h => h.isDemo === false));
    setIsDemoData(false);
    localStorage.removeItem(STORAGE_KEY);
    addAuditLog({
      action: 'Demo Data Cleared',
      entity: 'Database',
      entityId: 'root',
      reason: 'Administrator cleared all demo records.',
    });
    showToast(`All demo data cleared. Clean state established.`, 'warning');
  };

  const resetToSeedData = () => {
    const seedSt = generateSeedStudents();
    setClasses(SEED_CLASSES);
    setBatches(SEED_BATCHES);
    setTeachers(SEED_TEACHERS);
    setSubjects(SEED_SUBJECTS);
    setStudents(seedSt);
    setSchedules(SEED_SCHEDULE_ITEMS);
    setAttendanceSessions(SEED_ATTENDANCE_SESSIONS);
    setLiveSession(generateInitialLiveSession(seedSt));
    setLeaveRequests(SEED_LEAVE_REQUESTS);
    setAbsentFollowUps(SEED_ABSENT_FOLLOWUPS);
    setHolidays(SEED_HOLIDAYS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setIsDemoData(true);
    localStorage.removeItem(STORAGE_KEY);
    addAuditLog({
      action: 'Demo Data Reset',
      entity: 'Database',
      entityId: 'root',
      reason: 'Restored default demo seed dataset.',
    });
    showToast(`Restored IDL Education official demo dataset.`);
  };

  const currentLive = liveSession;

  return (
    <AttendanceContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        toasts,
        showToast,
        removeToast,
        classes,
        batches,
        teachers,
        subjects,
        holidays,
        students,
        schedules,
        attendanceSessions,
        liveSession: currentLive,
        leaveRequests,
        absentFollowUps,
        auditLogs,
        selectedDate,
        setSelectedDate,
        isDemoData,
        setIsDemoData,
        getDependencySummary,
        addClass,
        updateClass,
        archiveClass,
        restoreClass,
        deleteClassSafe,
        forceDeleteClass,
        addBatch,
        updateBatch,
        archiveBatch,
        restoreBatch,
        deleteBatchSafe,
        forceDeleteBatch,
        addStudent,
        updateStudent,
        archiveStudent,
        restoreStudent,
        transferStudentBatch,
        deleteStudentSafe,
        forceDeleteStudent,
        bulkArchiveStudents,
        bulkTransferStudents,
        addTeacher,
        updateTeacher,
        archiveTeacher,
        restoreTeacher,
        deleteTeacherSafe,
        forceDeleteTeacher,
        addSubject,
        updateSubject,
        archiveSubject,
        restoreSubject,
        deleteSubjectSafe,
        forceDeleteSubject,
        markStudentPresent,
        markStudentStatus,
        bulkMarkPresent,
        markStudentExit,
        markExitAllPresent,
        endLiveSession,
        startLiveSession,
        bulkResolveUnmarked,
        editAttendanceRecord,
        voidAttendanceRecord,
        logCallFollowUp,
        deleteAbsentFollowUp,
        addLeaveRequest,
        updateLeaveStatus,
        updateLeaveRequest,
        deleteLeaveRequest,
        addScheduleItem,
        updateScheduleItem,
        duplicateScheduleItem,
        rescheduleClass,
        cancelClass,
        deleteScheduleItemSafe,
        forceDeleteScheduleItem,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        archiveHoliday,
        addAuditLog,
        clearAllAuditLogs,
        deleteAuditLog,
        clearAllDemoData,
        resetToSeedData,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
