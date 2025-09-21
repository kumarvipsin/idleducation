// src/app/actions/user.ts
'use server';

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { serializeFirestoreData } from './utils';

export async function getStudents(teacherId?: string) {
  try {
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
    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, message: "Failed to fetch students." };
  }
}

export async function getTeachers() {
  try {
    const teachersQuery = query(collection(db, "users"), where("role", "==", "teacher"));
    const querySnapshot = await getDocs(teachersQuery);
    const teachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: teachers };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, message: "Failed to fetch teachers." };
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
