
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
import { getStudents, getTeachers, assignTeachersToStudent } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap, Briefcase, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  teacherIds?: string[];
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

  const handleAssignTeachers = async (studentId: string, teacherIds: string[]) => {
    const result = await assignTeachersToStudent(studentId, teacherIds);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, teacherIds } : s));
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const getTeacherNames = (teacherIds: string[] = []) => {
    if (teacherIds.length === 0) return "Not Assigned";
    return teacherIds.map(id => teachers.find(t => t.id === id)?.name).filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Assign or unassign teachers to students. To remove a teacher, simply uncheck their name from the list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Teachers</TableHead>
                <TableHead className="w-[250px]">Manage Teachers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium flex items-center gap-2"><GraduationCap className="h-4 w-4"/> {student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{getTeacherNames(student.teacherIds)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Manage Assignments <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {teachers.map(teacher => (
                          <DropdownMenuCheckboxItem
                            key={teacher.id}
                            checked={student.teacherIds?.includes(teacher.id)}
                            onCheckedChange={(checked) => {
                              const currentTeacherIds = student.teacherIds || [];
                              const newTeacherIds = checked
                                ? [...currentTeacherIds, teacher.id]
                                : currentTeacherIds.filter(id => id !== teacher.id);
                              handleAssignTeachers(student.id, newTeacherIds);
                            }}
                          >
                            {teacher.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
