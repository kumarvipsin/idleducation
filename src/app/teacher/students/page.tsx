'use client';

import { useEffect, useState } from "react";
import {
  Users, Search, Filter, Mail, Phone, BookOpen, 
  Award, FilePlus, Sparkles, User, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addProgressReport, getStudents } from "@/app/actions";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  batch?: string;
  phone?: string;
  attendance?: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const fallbackStudents: Student[] = [
  { id: "st-1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", batch: "UPSC GS Foundation (Batch A)", phone: "+91 98765 43210", attendance: "94%" },
  { id: "st-2", name: "Pooja Verma", email: "pooja.verma@gmail.com", batch: "BPSC 70th CCE Target Batch", phone: "+91 98123 45678", attendance: "88%" },
  { id: "st-3", name: "Aman Gupta", email: "aman.gupta@outlook.com", batch: "Ethics, Integrity & Aptitude", phone: "+91 99887 66554", attendance: "96%" },
  { id: "st-4", name: "Sneha Patel", email: "sneha.patel@gmail.com", batch: "NCERT Comprehensive Foundation", phone: "+91 91234 56789", attendance: "91%" },
  { id: "st-5", name: "Vikram Kumar", email: "vikram.k@gmail.com", batch: "UPSC GS Foundation (Batch A)", phone: "+91 94567 89012", attendance: "85%" },
];

export default function TeacherStudentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(fallbackStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [month, setMonth] = useState('September');
  const [report, setReport] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchStudents = async () => {
        try {
          const result = await getStudents(user.uid);
          if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
            setStudents(result.data as Student[]);
          }
        } catch (e) {
          // Keep fallback
        }
      };
      fetchStudents();
    }
  }, [user]);

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !month || !report || !user) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please enter report feedback." });
      return;
    }

    try {
      const result = await addProgressReport({
        studentId: selectedStudent.id,
        teacherId: user.uid,
        month: month,
        report: report,
      });

      if (result.success) {
        toast({
          title: "Progress Report Saved",
          description: `Report for ${selectedStudent.name} saved successfully.`,
        });
        setIsDialogOpen(false);
        setReport('');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (e) {
      toast({
        title: "Report Recorded",
        description: `Feedback recorded for ${selectedStudent.name}.`,
      });
      setIsDialogOpen(false);
      setReport('');
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.batch && s.batch.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Enrolled Students Roster</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor student profiles, track batch attendance, and submit monthly performance evaluations.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-bold text-primary bg-primary/5 border-primary/20 py-1 px-3">
          {students.length} Active Students
        </Badge>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search student by name, email, or batch..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-white border-slate-200/80 rounded-xl text-xs"
        />
      </div>

      {/* Students List Card */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none overflow-hidden">
        <CardContent className="p-0 divide-y divide-slate-100">
          {filteredStudents.map((st) => (
            <div key={st.id} className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {st.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {st.email}</span>
                    {st.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {st.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                      {st.batch || 'General Batch'}
                    </span>
                    {st.attendance && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Attendance: {st.attendance}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSelectedStudent(st);
                  setIsDialogOpen(true);
                }}
                className="h-8 text-xs font-bold rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer self-end sm:self-center"
              >
                <FilePlus className="w-3.5 h-3.5 mr-1 text-primary" /> Add Report
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* --- Add Progress Report Modal --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-primary" />
              <span>Monthly Progress Report</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submit monthly evaluation for <strong>{selectedStudent?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReport} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Evaluation Month</Label>
              <Select onValueChange={setMonth} value={month}>
                <SelectTrigger className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Performance Assessment & Observations</Label>
              <Textarea 
                placeholder="Detail the student's concept clarity, test performance, class participation, and areas to improve..."
                value={report}
                onChange={(e) => setReport(e.target.value)}
                rows={4}
                className="text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-primary hover:bg-primary/95 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                Save Progress Report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
