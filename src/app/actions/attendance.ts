'use server';

import { db } from "@/lib/firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
  getDocs, query, orderBy, where, getDoc, writeBatch, Timestamp
} from "firebase/firestore";
import { serializeFirestoreData } from './utils';

// ============================================================
// ACADEMIC YEAR
// ============================================================

export async function getAcademicYears() {
  try {
    const q = query(collection(db, "academicYears"), orderBy("startDate", "desc"));
    const snap = await getDocs(q);
    return { success: true, data: snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) })) };
  } catch (error: any) {
    console.error("Error fetching academic years:", error);
    return { success: false, message: error.message };
  }
}

export async function addAcademicYear(data: { name: string; startDate: string; endDate: string }) {
  try {
    await addDoc(collection(db, "academicYears"), {
      ...data, status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Academic year created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateAcademicYear(id: string, data: Partial<{ name: string; startDate: string; endDate: string; status: string }>) {
  try {
    await updateDoc(doc(db, "academicYears", id), { ...data, updatedAt: serverTimestamp() });
    return { success: true, message: "Academic year updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// CLASSES
// ============================================================

export async function getAttendanceClasses(academicYearId?: string) {
  try {
    let q;
    if (academicYearId) {
      q = query(collection(db, "attendanceClasses"), where("academicYearId", "==", academicYearId));
    } else {
      q = query(collection(db, "attendanceClasses"));
    }
    const snap = await getDocs(q);
    const classes = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    classes.sort((a: any, b: any) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return { success: true, data: classes };
  } catch (error: any) {
    console.error("Error fetching classes:", error);
    return { success: false, message: error.message };
  }
}

export async function addAttendanceClass(data: { name: string; displayName?: string; academicYearId: string; order: number }) {
  try {
    await addDoc(collection(db, "attendanceClasses"), {
      ...data, status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Class created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateAttendanceClass(id: string, data: Partial<{ name: string; displayName: string; status: string; order: number }>) {
  try {
    await updateDoc(doc(db, "attendanceClasses", id), { ...data, updatedAt: serverTimestamp() });
    return { success: true, message: "Class updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteAttendanceClass(id: string) {
  try {
    await deleteDoc(doc(db, "attendanceClasses", id));
    return { success: true, message: "Class deleted." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteBatch(id: string) {
  try {
    await deleteDoc(doc(db, "batches", id));
    return { success: true, message: "Batch deleted." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// BATCHES
// ============================================================

export async function getBatches(classId?: string, academicYearId?: string) {
  try {
    let q;
    if (classId) {
      q = query(collection(db, "batches"), where("classId", "==", classId));
    } else if (academicYearId) {
      q = query(collection(db, "batches"), where("academicYearId", "==", academicYearId));
    } else {
      q = query(collection(db, "batches"));
    }
    const snap = await getDocs(q);
    const batches = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    batches.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
    return { success: true, data: batches };
  } catch (error: any) {
    console.error("Error fetching batches:", error);
    return { success: false, message: error.message };
  }
}

export async function addBatch(data: { classId: string; academicYearId: string; name: string; startTime: string; endTime: string; daysOfWeek: string[] }) {
  try {
    await addDoc(collection(db, "batches"), {
      ...data, status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Batch created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateBatch(id: string, data: Partial<{ name: string; startTime: string; endTime: string; daysOfWeek: string[]; status: string }>) {
  try {
    await updateDoc(doc(db, "batches", id), { ...data, updatedAt: serverTimestamp() });
    return { success: true, message: "Batch updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// SUBJECTS
// ============================================================

export async function getSubjects() {
  try {
    const q = query(collection(db, "attendanceSubjects"), orderBy("name", "asc"));
    const snap = await getDocs(q);
    return { success: true, data: snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) })) };
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    return { success: false, message: error.message };
  }
}

export async function addSubject(data: { name: string; shortName?: string }) {
  try {
    await addDoc(collection(db, "attendanceSubjects"), {
      ...data, status: 'active', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Subject created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSubject(id: string, data: Partial<{ name: string; shortName: string; status: string }>) {
  try {
    await updateDoc(doc(db, "attendanceSubjects", id), { ...data, updatedAt: serverTimestamp() });
    return { success: true, message: "Subject updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// STUDENTS (Attendance enrollment — extends existing users)
// ============================================================

export async function getAttendanceStudents(classId?: string, batchId?: string) {
  try {
    let q;
    if (classId && batchId) {
      q = query(collection(db, "users"), where("role", "==", "student"), where("classId", "==", classId), where("batchId", "==", batchId));
    } else if (classId) {
      q = query(collection(db, "users"), where("role", "==", "student"), where("classId", "==", classId));
    } else {
      q = query(collection(db, "users"), where("role", "==", "student"));
    }
    const snap = await getDocs(q);
    const students = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    // Include students that are not explicitly inactive/disabled
    return {
      success: true,
      data: students.filter((s: any) => s.status !== 'inactive' && s.status !== 'disabled'),
    };
  } catch (error: any) {
    console.error("Error fetching attendance students:", error);
    return { success: false, message: error.message };
  }
}

export async function createAttendanceStudent(data: {
  name: string;
  studentCode?: string;
  email?: string;
  phone?: string;
  parentPhone?: string;
  classId: string;
  batchId?: string;
  academicYearId?: string;
}) {
  try {
    let resolvedBatchId = data.batchId?.trim() || '';
    if (!resolvedBatchId && data.classId) {
      // Find a batch for this class if exists
      const bSnap = await getDocs(query(collection(db, "batches"), where("classId", "==", data.classId)));
      if (!bSnap.empty) {
        resolvedBatchId = bSnap.docs[0].id;
      }
    }

    const email = data.email?.trim() || `${data.studentCode ? data.studentCode.toLowerCase().replace(/\s+/g, '') : 'student_' + Date.now()}@idleducation.internal`;
    const docRef = await addDoc(collection(db, "users"), {
      name: data.name.trim(),
      studentCode: data.studentCode?.trim() || '',
      email: email,
      phone: data.phone?.trim() || '',
      parentPhone: data.parentPhone?.trim() || '',
      classId: data.classId || '',
      batchId: resolvedBatchId,
      academicYearId: data.academicYearId || '',
      role: 'student',
      status: 'approved',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id, message: "Student added and enrolled successfully." };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, message: error.message };
  }
}

export async function updateAttendanceStudent(id: string, data: Partial<{
  name: string;
  studentCode: string;
  email: string;
  phone: string;
  parentPhone: string;
  classId: string;
  batchId: string;
  academicYearId: string;
  status: string;
}>) {
  try {
    const cleanData: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    }
    cleanData.updatedAt = serverTimestamp();

    await updateDoc(doc(db, "users", id), cleanData);
    return { success: true, message: "Student updated successfully." };
  } catch (error: any) {
    console.error("Error updating student:", error);
    return { success: false, message: error.message };
  }
}

export async function unenrollAttendanceStudent(studentId: string) {
  try {
    await updateDoc(doc(db, "users", studentId), {
      classId: null,
      batchId: null,
      academicYearId: null,
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Student unenrolled from class." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteAttendanceStudent(studentId: string) {
  try {
    await deleteDoc(doc(db, "users", studentId));
    return { success: true, message: "Student deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return { success: false, message: error.message };
  }
}

export async function getAllStudentsForEnrollment() {
  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snap = await getDocs(q);
    const students = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    return { success: true, data: students };
  } catch (error: any) {
    console.error("Error fetching all students for enrollment:", error);
    return { success: false, message: error.message };
  }
}

export async function enrollExistingStudents(studentIds: string[], data: { classId: string; batchId: string; academicYearId: string }) {
  try {
    const batch = writeBatch(db);
    for (const id of studentIds) {
      batch.update(doc(db, "users", id), {
        classId: data.classId,
        batchId: data.batchId,
        academicYearId: data.academicYearId,
        status: 'approved',
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
    return { success: true, message: `${studentIds.length} student(s) enrolled successfully.` };
  } catch (error: any) {
    console.error("Error enrolling students:", error);
    return { success: false, message: error.message };
  }
}

export async function quickCreateBatch(classId: string, academicYearId: string, name = "Regular Batch") {
  try {
    const docRef = await addDoc(collection(db, "batches"), {
      classId,
      academicYearId,
      name,
      startTime: "09:00",
      endTime: "10:00",
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id, message: `Batch "${name}" created successfully.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function assignStudentToClass(studentId: string, data: { classId: string; batchId: string; academicYearId: string; studentCode?: string; parentPhone?: string }) {
  try {
    await updateDoc(doc(db, "users", studentId), { ...data, status: 'approved', updatedAt: serverTimestamp() });
    return { success: true, message: "Student assigned." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function disableStudent(studentId: string, reason?: string) {
  try {
    await updateDoc(doc(db, "users", studentId), {
      status: 'inactive',
      disableReason: reason || '',
      disabledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Student disabled. Historical data preserved." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function reactivateStudent(studentId: string) {
  try {
    await updateDoc(doc(db, "users", studentId), {
      status: 'approved',
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Student reactivated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// SESSIONS
// ============================================================

export async function getSessions(filters?: { academicYearId?: string; classId?: string; batchId?: string; subjectId?: string; date?: string; status?: string }) {
  try {
    const constraints: any[] = [];
    if (filters?.academicYearId) constraints.push(where("academicYearId", "==", filters.academicYearId));
    if (filters?.classId) constraints.push(where("classId", "==", filters.classId));
    if (filters?.batchId) constraints.push(where("batchId", "==", filters.batchId));
    if (filters?.subjectId) constraints.push(where("subjectId", "==", filters.subjectId));
    if (filters?.date) constraints.push(where("sessionDate", "==", filters.date));
    if (filters?.status) constraints.push(where("status", "==", filters.status));

    const q = query(collection(db, "sessions"), ...constraints);
    const snap = await getDocs(q);
    const sessions = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    sessions.sort((a: any, b: any) => (b.sessionDate || '').localeCompare(a.sessionDate || ''));
    return { success: true, data: sessions };
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return { success: false, message: error.message };
  }
}

export async function addSession(data: {
  academicYearId: string; classId: string; batchId: string; subjectId: string;
  sessionDate: string; startTime: string; endTime: string; notes?: string;
  className?: string; batchName?: string; subjectName?: string;
}) {
  try {
    await addDoc(collection(db, "sessions"), {
      ...data, status: 'scheduled', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Session created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateSession(id: string, data: Partial<{ sessionDate: string; startTime: string; endTime: string; status: string; notes: string; subjectId: string }>) {
  try {
    await updateDoc(doc(db, "sessions", id), { ...data, updatedAt: serverTimestamp() });
    return { success: true, message: "Session updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function cancelSession(id: string) {
  try {
    await updateDoc(doc(db, "sessions", id), { status: 'cancelled', updatedAt: serverTimestamp() });
    return { success: true, message: "Session cancelled." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// ATTENDANCE MARKING (Period / Coaching Model)
// ============================================================

export async function markPeriodAttendance(data: {
  classId: string;
  className?: string;
  sessionDate?: string; // "YYYY-MM-DD"
  date?: string;
  periodIndex: number; // 1, 2, or 3
  subjectId: string;
  subjectName?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  records: Array<{
    studentId: string;
    studentName?: string;
    studentCode?: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE';
    inTime?: string;
    outTime?: string;
    remark?: string;
    absenceReason?: string;
  }>;
  markedBy?: string;
}) {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const effectiveDate = data.sessionDate || data.date || now.slice(0, 10);

    // Fetch existing records for this class and date
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", data.classId),
      where("sessionDate", "==", effectiveDate)
    );
    const snap = await getDocs(q);
    const existingForPeriod = snap.docs.filter(d => (d.data().periodIndex || 1) === data.periodIndex);

    for (const record of data.records) {
      const existingDoc = existingForPeriod.find(d => d.data().studentId === record.studentId);

      const payload: any = {
        classId: data.classId,
        className: data.className || '',
        sessionDate: effectiveDate,
        periodIndex: data.periodIndex,
        subjectId: data.subjectId,
        subjectName: data.subjectName || '',
        studentId: record.studentId,
        studentName: record.studentName || '',
        studentCode: record.studentCode || '',
        status: record.status,
        inTime: record.inTime || null,
        outTime: record.outTime || null,
        entryTime: record.inTime || null,
        remark: record.remark || null,
        absenceReason: record.absenceReason || null,
        updatedAt: now,
        updatedBy: data.markedBy || 'admin',
      };

      if (existingDoc) {
        batch.update(existingDoc.ref, payload);
      } else {
        const newRef = doc(collection(db, "attendance"));
        batch.set(newRef, {
          ...payload,
          markedAt: now,
          markedBy: data.markedBy || 'admin',
        });
      }
    }

    await batch.commit();

    const presentCount = data.records.filter(r => r.status === 'PRESENT').length;
    const absentCount = data.records.filter(r => r.status === 'ABSENT').length;
    const lateCount = data.records.filter(r => r.status === 'LATE').length;

    return {
      success: true,
      message: `Hour ${data.periodIndex} (${data.subjectName || 'Subject'}) attendance saved — ${presentCount} Present · ${absentCount} Absent · ${lateCount} Late`,
    };
  } catch (error: any) {
    console.error("Error marking period attendance:", error);
    return { success: false, message: error.message };
  }
}

export async function getAttendanceForPeriod(classId: string, sessionDate: string, periodIndex: number) {
  try {
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId),
      where("sessionDate", "==", sessionDate)
    );
    const snap = await getDocs(q);
    const records = snap.docs
      .map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }))
      .filter((r: any) => (r.periodIndex || 1) === periodIndex);
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getClassWeeklyAttendance(classId: string, fromDate: string, toDate: string) {
  try {
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId)
    );
    const snap = await getDocs(q);
    const records = snap.docs
      .map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }))
      .filter((r: any) => r.sessionDate >= fromDate && r.sessionDate <= toDate);
    records.sort((a: any, b: any) => (a.sessionDate || '').localeCompare(b.sessionDate || ''));
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getClassMonthlyAttendance(classId: string, yearMonth: string) {
  try {
    const q = query(
      collection(db, "attendance"),
      where("classId", "==", classId)
    );
    const snap = await getDocs(q);
    const records = snap.docs
      .map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }))
      .filter((r: any) => (r.sessionDate || '').startsWith(yearMonth));
    records.sort((a: any, b: any) => (a.sessionDate || '').localeCompare(b.sessionDate || ''));
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// ATTENDANCE MARKING (Core / Legacy compatibility)
// ============================================================

export async function markAttendance(sessionId: string, records: Array<{
  studentId: string; status: string; entryTime?: string; remark?: string; absenceReason?: string;
}>, sessionContext: {
  academicYearId: string; classId: string; batchId: string; subjectId: string; sessionDate: string;
}, markedBy: string) {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    for (const record of records) {
      // Check for existing attendance for this student+session
      const existingQuery = query(
        collection(db, "attendance"),
        where("sessionId", "==", sessionId),
        where("studentId", "==", record.studentId)
      );
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        const existingDoc = existingSnap.docs[0];
        batch.update(existingDoc.ref, {
          status: record.status,
          entryTime: record.entryTime || null,
          remark: record.remark || null,
          absenceReason: record.absenceReason || null,
          updatedAt: now,
          updatedBy: markedBy,
        });
      } else {
        const newRef = doc(collection(db, "attendance"));
        batch.set(newRef, {
          sessionId,
          studentId: record.studentId,
          ...sessionContext,
          status: record.status,
          entryTime: record.entryTime || null,
          remark: record.remark || null,
          absenceReason: record.absenceReason || null,
          markedAt: now,
          markedBy,
          updatedAt: now,
          updatedBy: markedBy,
        });
      }
    }

    // Mark session as completed
    batch.update(doc(db, "sessions", sessionId), { status: 'completed', updatedAt: serverTimestamp() });

    await batch.commit();

    const presentCount = records.filter(r => r.status === 'PRESENT').length;
    const absentCount = records.filter(r => r.status === 'ABSENT').length;
    const lateCount = records.filter(r => r.status === 'LATE').length;
    const leaveCount = records.filter(r => r.status === 'ON_LEAVE').length;

    return {
      success: true,
      message: `Attendance saved — ${records.length} students · ${presentCount} present · ${absentCount} absent · ${lateCount} late · ${leaveCount} on leave`,
    };
  } catch (error: any) {
    console.error("Error marking attendance:", error);
    return { success: false, message: error.message };
  }
}

export async function getAttendanceBySession(sessionId: string) {
  try {
    const q = query(collection(db, "attendance"), where("sessionId", "==", sessionId));
    const snap = await getDocs(q);
    return { success: true, data: snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) })) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAttendanceByStudent(studentId: string, filters?: { academicYearId?: string; classId?: string; subjectId?: string; fromDate?: string; toDate?: string }) {
  try {
    const constraints: any[] = [where("studentId", "==", studentId)];
    if (filters?.academicYearId) constraints.push(where("academicYearId", "==", filters.academicYearId));
    if (filters?.classId) constraints.push(where("classId", "==", filters.classId));
    if (filters?.subjectId) constraints.push(where("subjectId", "==", filters.subjectId));

    const q = query(collection(db, "attendance"), ...constraints);
    const snap = await getDocs(q);
    let records = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    records.sort((a: any, b: any) => (b.sessionDate || '').localeCompare(a.sessionDate || ''));

    if (filters?.fromDate) records = records.filter((r: any) => r.sessionDate >= filters.fromDate!);
    if (filters?.toDate) records = records.filter((r: any) => r.sessionDate <= filters.toDate!);

    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAttendanceByFilters(filters: {
  academicYearId?: string; classId?: string; batchId?: string; subjectId?: string;
  fromDate?: string; toDate?: string; status?: string;
}) {
  try {
    const constraints: any[] = [];
    if (filters.academicYearId) constraints.push(where("academicYearId", "==", filters.academicYearId));
    if (filters.classId) constraints.push(where("classId", "==", filters.classId));
    if (filters.batchId) constraints.push(where("batchId", "==", filters.batchId));
    if (filters.subjectId) constraints.push(where("subjectId", "==", filters.subjectId));
    if (filters.status) constraints.push(where("status", "==", filters.status));

    const q = query(collection(db, "attendance"), ...constraints);
    const snap = await getDocs(q);
    let records = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    records.sort((a: any, b: any) => (b.sessionDate || '').localeCompare(a.sessionDate || ''));

    if (filters.fromDate) records = records.filter((r: any) => r.sessionDate >= filters.fromDate!);
    if (filters.toDate) records = records.filter((r: any) => r.sessionDate <= filters.toDate!);

    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function editAttendanceRecord(id: string, data: { status: string; entryTime?: string; remark?: string; absenceReason?: string }, updatedBy: string) {
  try {
    await updateDoc(doc(db, "attendance", id), {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy,
    });
    return { success: true, message: "Attendance record updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// LEAVES
// ============================================================

export async function getLeaves(studentId?: string, status?: string) {
  try {
    const constraints: any[] = [];
    if (studentId) constraints.push(where("studentId", "==", studentId));
    if (status) constraints.push(where("status", "==", status));

    const q = query(collection(db, "leaves"), ...constraints, orderBy("fromDate", "desc"));
    const snap = await getDocs(q);
    return { success: true, data: snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) })) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function addLeave(data: { studentId: string; classId: string; batchId: string; academicYearId: string; fromDate: string; toDate: string; reason: string }) {
  try {
    await addDoc(collection(db, "leaves"), {
      ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Leave request created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateLeaveStatus(id: string, status: 'approved' | 'cancelled') {
  try {
    await updateDoc(doc(db, "leaves", id), { status, updatedAt: serverTimestamp() });
    return { success: true, message: `Leave ${status}.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================
// FOLLOW-UPS
// ============================================================

export async function getFollowUps(filters?: { studentId?: string; status?: string }) {
  try {
    const constraints: any[] = [];
    if (filters?.studentId) constraints.push(where("studentId", "==", filters.studentId));
    if (filters?.status) constraints.push(where("status", "==", filters.status));

    const q = query(collection(db, "followUps"), ...constraints);
    const snap = await getDocs(q);
    const followUps = snap.docs.map(d => ({ id: d.id, ...serializeFirestoreData(d.data()) }));
    followUps.sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return { success: true, data: followUps };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function addFollowUp(data: {
  attendanceId: string; studentId: string; sessionId: string;
  type: string; callStatus?: string; callRemark?: string;
  messageStatus?: string; messageRemark?: string; parentResponse?: string;
}) {
  try {
    await addDoc(collection(db, "followUps"), {
      ...data,
      status: 'OPEN',
      priority: 'NORMAL',
      callTime: data.callStatus ? new Date().toISOString() : null,
      messageTime: data.messageStatus ? new Date().toISOString() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Follow-up created." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateFollowUp(id: string, data: Partial<{
  status: string; callStatus: string; callRemark: string;
  messageStatus: string; messageRemark: string; parentResponse: string;
  priority: string; resolvedAt: string;
}>) {
  try {
    const updateData: any = { ...data, updatedAt: serverTimestamp() };
    if (data.status === 'RESOLVED') updateData.resolvedAt = new Date().toISOString();
    await updateDoc(doc(db, "followUps", id), updateData);
    return { success: true, message: "Follow-up updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
