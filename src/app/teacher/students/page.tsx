
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProgressReport, getStudents } from "@/app/actions";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { FilePlus } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TeacherStudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [month, setMonth] = useState('');
  const [report, setReport] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchStudents = async () => {
        const result = await getStudents(user.uid);
        if (result.success && result.data) {
          setStudents(result.data as Student[]);
        }
      };
      fetchStudents();
    }
  }, [user]);

  const handleAddReport = async () => {
    if (!selectedStudent || !month || !report || !user) return;

    const result = await addProgressReport({
      studentId: selectedStudent.id,
      teacherId: user.uid,
      month: month,
      report: report,
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Progress report added successfully.",
      });
      setIsDialogOpen(false);
      setMonth('');
      setReport('');
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <CardTitle>My Students</CardTitle>
          <CardDescription>View your assigned students and add their monthly progress reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-right">
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                          <FilePlus className="mr-2 h-4 w-4" />
                          Add Report
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    You have not been assigned any students yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Progress Report</DialogTitle>
          <DialogDescription>
            Add a monthly progress report for <strong>{selectedStudent?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="month" className="text-right">
              Month
            </Label>
            <Select onValueChange={setMonth} value={month}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                    {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report" className="text-right">
              Report
            </Label>
            <Textarea
              id="report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="col-span-3"
              placeholder="Enter student's progress details..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddReport}>Save Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
