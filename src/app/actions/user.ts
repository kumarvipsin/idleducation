// src/app/actions/user.ts
'use server';

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { serializeFirestoreData } from './utils';
import {
  getServerAdminContext,
  getVerifiedSessionUserProfile,
  scopeRecordsToBranchAdmin,
} from '@/lib/server-admin-auth';

export async function getStudents(teacherId?: string, narrowBranchId?: string) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx) {
      if (!teacherId) {
        return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
      }
      const sessionUser = await getVerifiedSessionUserProfile();
      if (!sessionUser || sessionUser.uid !== teacherId) {
        return { success: false, message: "Unauthorized: Teacher session required.", data: [] };
      }
    }

    let studentsQuery;
    if (teacherId) {
      studentsQuery = query(
        collection(db, "users"), 
        where("role", "==", "student"),
        where("teacherIds", "array-contains", teacherId)
      );
    } else {
      studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    }
    const querySnapshot = await getDocs(studentsQuery);
    const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    if (teacherId && !adminCtx) {
      return { success: true, data: students };
    }
    return {
      success: true,
      data: scopeRecordsToBranchAdmin(students, adminCtx, { narrowBranchId }),
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, message: "Failed to fetch students." };
  }
}

export async function getTeachers(options?: { publicDirectory?: boolean; narrowBranchId?: string }) {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx && !options?.publicDirectory) {
      return { success: false, message: "Unauthorized: Administrator session required.", data: [] };
    }

    const teachersQuery = query(collection(db, "users"), where("role", "==", "teacher"));
    const querySnapshot = await getDocs(teachersQuery);
    const teachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));

    if (options?.publicDirectory && !adminCtx) {
      return {
        success: true,
        data: teachers.filter((teacher: any) => String(teacher.status || '').toLowerCase() === 'approved'),
      };
    }

    return {
      success: true,
      data: scopeRecordsToBranchAdmin(teachers, adminCtx, { narrowBranchId: options?.narrowBranchId }),
    };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, message: "Failed to fetch teachers." };
  }
}

export async function getAdmins() {
  try {
    const adminCtx = await getServerAdminContext();
    if (!adminCtx || adminCtx.isBranchAdmin) {
      return { success: false, message: "Forbidden: Super Admin access required.", data: [] };
    }
    const adminsQuery = query(collection(db, "users"), where("role", "==", "admin"));
    const querySnapshot = await getDocs(adminsQuery);
    const admins = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: admins };
  } catch (error) {
    console.error("Error fetching admins:", error);
    return { success: false, message: "Failed to fetch admins." };
  }
}


export async function getStudentProgressReports(studentId: string) {
  try {
    const reportsQuery = query(collection(db, "progressReports"), where("studentId", "==", studentId));
    const querySnapshot = await getDocs(reportsQuery);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    return { success: false, message: "Failed to fetch progress reports." };
  }
}

export async function getProgressReportsForTeacher(teacherId: string) {
  try {
    const reportsQuery = query(collection(db, "progressReports"), where("teacherId", "==", teacherId));
    const querySnapshot = await getDocs(reportsQuery);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    return { success: false, message: "Failed to fetch progress reports." };
  }
}

  
