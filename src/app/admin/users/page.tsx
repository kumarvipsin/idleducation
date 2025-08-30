
'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudents, getTeachers, assignTeacherToStudent } from "@/app/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap, Briefcase } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  teacherId?: string;
}

export default function AdminUsersPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const studentsResult = await getStudents();
      if (studentsResult.success && studentsResult.data) {
        setStudents(studentsResult.data as User[]);
      }
      const teachersResult = await getTeachers();
      if (teachersResult.success && teachersResult.data) {
        setTeachers(teachersResult.data as User[]);
      }
    };
    fetchUsers();
  }, []);

  const handleAssignTeacher = async (studentId: string, teacherId: string) => {
    if (!teacherId) {
      toast({ variant: "destructive", title: "Please select a teacher." });
      return;
    }
    const result = await assignTeacherToStudent(studentId, teacherId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      // Update local state to reflect the change
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, teacherId } : s));
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };
  
  const getTeacherName = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId)?.name || "Not Assigned";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Assign teachers to students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Teacher</TableHead>
                <TableHead className="w-[250px]">Assign Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium flex items-center gap-2"><GraduationCap className="h-4 w-4"/> {student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.teacherId ? getTeacherName(student.teacherId) : "Not Assigned"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(teacherId) => handleAssignTeacher(student.id, teacherId)} defaultValue={student.teacherId}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                          <SelectContent>
                              {teachers.map(teacher => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Teacher List</CardTitle>
          <CardDescription>A list of all registered teachers.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium flex items-center gap-2"><Briefcase className="h-4 w-4"/> {teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
