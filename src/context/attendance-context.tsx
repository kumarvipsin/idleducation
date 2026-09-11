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
  generateSeedStudents,
  generateInitialLiveSession,
  calculateStudentAttendanceTiming,
  getCurrentTimeFormatted,
} from '@/lib/attendance-store';

export interface DependencySummary {
  batches: number;
  students: number;
  schedules: number;
  attendanceSessions: number;
  leaveRecords: number;
  callRecords: number;
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
  liveSession: TClassSession;
  leaveRequests: TLeaveRequest[];
  absentFollowUps: TAbsenceFollowUp[];
  auditLogs: TAuditLog[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isDemoData: boolean;

  // Dependency summary (for smart delete dialog)
  getDependencySummary: (entityType: 'class' | 'batch' | 'student' | 'teacher' | 'subject' | 'schedule', entityId: string) => DependencySummary;

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
  deleteHoliday: (id: string) => void;

  // Audit Log & Demo Data
  addAuditLog: (entry: Omit<TAuditLog, 'id' | 'timestamp' | 'user' | 'role'>) => void;
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

  // Initialize from localStorage or seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setClasses(parsed.classes || SEED_CLASSES);
        setBatches(parsed.batches || SEED_BATCHES);
        setTeachers(parsed.teachers || SEED_TEACHERS);
        setSubjects(parsed.subjects || SEED_SUBJECTS);
        setStudents(parsed.students || generateSeedStudents());
        setSchedules(parsed.schedules || SEED_SCHEDULE_ITEMS);
        setLiveSession(parsed.liveSession || generateInitialLiveSession(parsed.students || generateSeedStudents()));
        setLeaveRequests(parsed.leaveRequests || SEED_LEAVE_REQUESTS);
        setAbsentFollowUps(parsed.absentFollowUps || SEED_ABSENT_FOLLOWUPS);
        setHolidays(parsed.holidays || SEED_HOLIDAYS);
        setAuditLogs(parsed.auditLogs || SEED_AUDIT_LOGS);
        setIsDemoData(parsed.isDemoData ?? true);
      } else {
        const seedSt = generateSeedStudents();
        setStudents(seedSt);
        setLiveSession(generateInitialLiveSession(seedSt));
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
      const seedSt = generateSeedStudents();
      setStudents(seedSt);
      setLiveSession(generateInitialLiveSession(seedSt));
    }
    setIsInitialized(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (!isInitialized || !liveSession) return;
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
  }, [classes, batches, teachers, subjects, students, schedules, liveSession, leaveRequests, absentFollowUps, holidays, auditLogs, isDemoData, isInitialized]);

  // -------------------------------------------------------------
  // DEPENDENCY SUMMARY (used by SmartDeleteDialog)
  // -------------------------------------------------------------
  const getDependencySummary = (
    entityType: 'class' | 'batch' | 'student' | 'teacher' | 'subject' | 'schedule',
    entityId: string
  ): DependencySummary => {
    const empty: DependencySummary = { batches: 0, students: 0, schedules: 0, attendanceSessions: 0, leaveRecords: 0, callRecords: 0 };

    if (entityType === 'class') {
      const cls = classes.find(c => c.id === entityId);
      if (!cls) return empty;
      const classBatches = batches.filter(b => b.classId === entityId);
      const classBatchIds = classBatches.map(b => b.id);
      const classStudents = students.filter(s => s.classId === entityId);
      const classSchedules = schedules.filter(s => s.classId === entityId);
      const classLeaves = leaveRequests.filter(l => l.classId === entityId);
      const classFollowUps = absentFollowUps.filter(f => f.classId === entityId);
      return {
        batches: classBatches.length,
        students: classStudents.length,
        schedules: classSchedules.length,
        attendanceSessions: liveSession && liveSession.classId === entityId ? 1 : 0,
        leaveRecords: classLeaves.length,
        callRecords: classFollowUps.length,
      };
    }

    if (entityType === 'batch') {
      const batch = batches.find(b => b.id === entityId);
      if (!batch) return empty;
      const batchStudents = students.filter(s => s.batchId === entityId);
      const batchSchedules = schedules.filter(s => s.batchId === entityId);
      const batchLeaves = leaveRequests.filter(l => l.batchId === entityId);
      const batchFollowUps = absentFollowUps.filter(f => f.batchId === entityId);
      return {
        batches: 0,
        students: batchStudents.length,
        schedules: batchSchedules.length,
        attendanceSessions: liveSession && liveSession.batchId === entityId ? 1 : 0,
        leaveRecords: batchLeaves.length,
        callRecords: batchFollowUps.length,
      };
    }

    if (entityType === 'student') {
      const sessionCount = liveSession && liveSession.studentRecords[entityId] ? 1 : 0;
      const leaves = leaveRequests.filter(l => l.studentId === entityId);
      const followUps = absentFollowUps.filter(f => f.studentId === entityId);
      return {
        batches: 0,
        students: 0,
        schedules: 0,
        attendanceSessions: sessionCount,
        leaveRecords: leaves.length,
        callRecords: followUps.length,
      };
    }

    if (entityType === 'teacher') {
      const teacherSchedules = schedules.filter(s => s.teacherId === entityId);
      return { ...empty, schedules: teacherSchedules.length };
    }

    if (entityType === 'subject') {
      const sub = subjects.find(s => s.id === entityId);
      if (!sub) return empty;
      const subSchedules = schedules.filter(s => s.subject === sub.name);
      return { ...empty, schedules: subSchedules.length };
    }

    if (entityType === 'schedule') {
      const hasSessions = liveSession && liveSession.scheduleId === entityId ? 1 : 0;
      return { ...empty, attendanceSessions: hasSessions };
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

    // Dependency check: Active batches or students
    const activeBatches = batches.filter(b => b.classId === id && b.status === 'active');
    if (activeBatches.length > 0) {
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

    const activeStudents = students.filter(s => s.batchId === batch.name && s.status === 'active');
    if (activeStudents.length > 0) {
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

    // Check if attendance records exist
    const hasPastSession = liveSession && liveSession.studentRecords[id]?.status === 'present';
    if (hasPastSession) {
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

    const hasClasses = schedules.some(s => s.teacherId === id || s.teacherName === t.name);
    if (hasClasses) {
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

    const hasSchedules = schedules.some(sch => sch.subject === s.name);
    if (hasSchedules) {
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

    // Cascade: collect all dependents
    const classBatchIds = batches.filter(b => b.classId === id).map(b => b.id);
    const classStudentIds = students.filter(s => s.classId === id).map(s => s.id);

    let removed = 0;

    // Remove students in this class
    setStudents(prev => { const next = prev.filter(s => !classStudentIds.includes(s.id)); removed += prev.length - next.length; return next; });
    // Remove batches in this class
    setBatches(prev => prev.filter(b => b.classId !== id));
    // Remove schedules
    setSchedules(prev => prev.filter(s => s.classId !== id));
    // Remove leave requests
    setLeaveRequests(prev => prev.filter(l => l.classId !== id));
    // Remove followups
    setAbsentFollowUps(prev => prev.filter(f => f.classId !== id));
    // Remove class
    setClasses(prev => prev.filter(c => c.id !== id));

    const totalRemoved = classBatchIds.length + classStudentIds.length;
    addAuditLog({
      action: 'Class Deleted',
      entity: 'Class',
      entityId: id,
      previousValue: cls.name,
      reason,
      dependentRecordsDeleted: totalRemoved,
    });
    showToast(`Class "${cls.name}" and all dependent records permanently deleted.`, 'warning');
  };

  const forceDeleteBatch = (id: string, reason: string) => {
    const batch = batches.find(b => b.id === id);
    if (!batch) return;

    const batchStudentIds = students.filter(s => s.batchId === id).map(s => s.id);

    setStudents(prev => prev.filter(s => !batchStudentIds.includes(s.id)));
    setSchedules(prev => prev.filter(s => s.batchId !== id));
    setLeaveRequests(prev => prev.filter(l => l.batchId !== id));
    setAbsentFollowUps(prev => prev.filter(f => f.batchId !== id));
    setBatches(prev => prev.filter(b => b.id !== id));

    // Update parent class batch list
    setClasses(prev =>
      prev.map(c => c.id === batch.classId ? { ...c, batches: c.batches.filter(n => n !== batch.name) } : c)
    );

    const totalRemoved = batchStudentIds.length;
    addAuditLog({
      action: 'Batch Deleted',
      entity: 'Batch',
      entityId: id,
      previousValue: batch.name,
      reason,
      dependentRecordsDeleted: totalRemoved,
    });
    showToast(`Batch "${batch.name}" and ${totalRemoved} student(s) permanently deleted.`, 'warning');
  };

  const forceDeleteStudent = (id: string, reason: string) => {
    const st = students.find(s => s.id === id);
    if (!st) return;

    const leaveCount = leaveRequests.filter(l => l.studentId === id).length;
    const followUpCount = absentFollowUps.filter(f => f.studentId === id).length;

    setStudents(prev => prev.filter(s => s.id !== id));
    setLeaveRequests(prev => prev.filter(l => l.studentId !== id));
    setAbsentFollowUps(prev => prev.filter(f => f.studentId !== id));

    const totalRemoved = leaveCount + followUpCount;
    addAuditLog({
      action: 'Student Deleted',
      entity: 'Student',
      entityId: id,
      previousValue: st.name,
      reason,
      dependentRecordsDeleted: totalRemoved,
    });
    showToast(`Student "${st.name}" permanently deleted.`, 'warning');
  };

  const forceDeleteTeacher = (id: string, reason: string) => {
    const t = teachers.find(item => item.id === id);
    if (!t) return;

    const schedCount = schedules.filter(s => s.teacherId === id).length;

    // Don't cascade-delete schedules — just orphan teacher name (history preserved)
    setSchedules(prev =>
      prev.map(s => s.teacherId === id ? { ...s, teacherName: `${t.name} (Removed)`, teacherId: '' } : s)
    );
    setTeachers(prev => prev.filter(item => item.id !== id));

    addAuditLog({
      action: 'Teacher Deleted',
      entity: 'Teacher',
      entityId: id,
      previousValue: t.name,
      reason,
      dependentRecordsDeleted: schedCount,
    });
    showToast(`Teacher "${t.name}" permanently deleted. ${schedCount} schedule(s) now show "Removed" as teacher.`, 'warning');
  };

  const forceDeleteSubject = (id: string, reason: string) => {
    const s = subjects.find(item => item.id === id);
    if (!s) return;

    const schedCount = schedules.filter(sch => sch.subject === s.name).length;

    // Orphan schedules (subject name preserved as string in history)
    setSubjects(prev => prev.filter(item => item.id !== id));

    addAuditLog({
      action: 'Subject Deleted',
      entity: 'Subject',
      entityId: id,
      previousValue: s.name,
      reason,
      dependentRecordsDeleted: schedCount,
    });
    showToast(`Subject "${s.name}" permanently deleted.`, 'warning');
  };

  const forceDeleteScheduleItem = (id: string, reason: string) => {
    const orig = schedules.find(s => s.id === id);
    if (!orig) return;

    setSchedules(prev => prev.filter(s => s.id !== id));

    addAuditLog({
      action: 'Schedule Cancelled',
      entity: 'Class Schedule',
      entityId: id,
      previousValue: `${orig.className} ${orig.batchName} — ${orig.subject}`,
      reason,
    });
    showToast(`Class session permanently deleted.`, 'warning');
  };

  // -------------------------------------------------------------
  // ATTENDANCE VOID & CORRECTION WITH AUDIT TRAIL
  // -------------------------------------------------------------
  const editAttendanceRecord = (
    sessionId: string,
    studentId: string,
    updates: { checkInTime?: string; checkOutTime?: string; status?: StudentStatus },
    reason: string
  ) => {
    if (!liveSession) return;
    const student = students.find(s => s.id === studentId);
    const prevRec = liveSession.studentRecords[studentId];

    const newStatus = updates.status || prevRec?.status || 'present';
    const checkIn = updates.checkInTime || prevRec?.checkInTime;
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

    addAuditLog({
      action: 'Attendance Edited',
      entity: 'Student Attendance',
      entityId: studentId,
      previousValue: `${prevRec?.status} (${prevRec?.checkInTime || '-'})`,
      newValue: `${newStatus} (${checkIn || '-'})`,
      reason,
    });

    showToast(`Attendance updated for ${student?.name}. Logged in audit trail.`);
  };

  const voidAttendanceRecord = (sessionId: string, studentId: string, reason: string) => {
    if (!liveSession) return;
    const student = students.find(s => s.id === studentId);
    const prevRec = liveSession.studentRecords[studentId];

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

    addAuditLog({
      action: 'Attendance Voided',
      entity: 'Student Attendance',
      entityId: studentId,
      previousValue: `${prevRec?.status} (Check-in ${prevRec?.checkInTime})`,
      newValue: 'Voided (Not Arrived)',
      reason,
    });

    showToast(`Attendance record voided for ${student?.name}.`, 'warning');
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
    setLiveSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        sessionStatus: 'Completed',
        endedAt: getCurrentTimeFormatted(),
      };
    });
    setSchedules(prev =>
      prev.map(s => (s.id === liveSession.scheduleId ? { ...s, status: 'Completed' } : s))
    );
    showToast(`Session completed and attendance synchronized.`);
  };

  const startLiveSession = (scheduleId: string) => {
    const sch = schedules.find(s => s.id === scheduleId);
    if (!sch) return;
    const batchStudents = students.filter(st => st.batchId === sch.batchId && st.status === 'active');
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
    };

    setLiveSession(newSession);
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

  const deleteScheduleItemSafe = (id: string) => {
    const orig = schedules.find(s => s.id === id);
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
    setHolidays(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
    showToast(`Holiday updated.`);
  };

  const deleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
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
    setClasses([]);
    setBatches([]);
    setTeachers([]);
    setSubjects([]);
    setStudents([]);
    setSchedules([]);
    setLiveSession(null);
    setLeaveRequests([]);
    setAbsentFollowUps([]);
    setHolidays([]);
    setIsDemoData(false);
    localStorage.removeItem(STORAGE_KEY);
    addAuditLog({
      action: 'Demo Data Cleared',
      entity: 'Database',
      entityId: 'root',
      reason: 'Administrator cleared all demo records to start fresh.',
    });
    showToast(`All sample data cleared. Database is now in fresh setup mode.`, 'warning');
  };

  const resetToSeedData = () => {
    const seedSt = generateSeedStudents();
    setClasses(SEED_CLASSES);
    setBatches(SEED_BATCHES);
    setTeachers(SEED_TEACHERS);
    setSubjects(SEED_SUBJECTS);
    setStudents(seedSt);
    setSchedules(SEED_SCHEDULE_ITEMS);
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

  const currentLive = liveSession || generateInitialLiveSession(students.length ? students : generateSeedStudents());

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
        liveSession: currentLive,
        leaveRequests,
        absentFollowUps,
        auditLogs,
        selectedDate,
        setSelectedDate,
        isDemoData,
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
        addAuditLog,
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
