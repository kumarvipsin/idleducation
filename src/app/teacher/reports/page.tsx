'use client';

import { useState } from "react";
import { 
  FileText, CheckCircle2, Award, Search, Filter, 
  Send, Eye, Download, Star, Sparkles, User, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TeacherReportsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);

  // Grade form
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const [submissionsList, setSubmissionsList] = useState([
    {
      id: "sub-1",
      studentName: "Rahul Sharma",
      studentRoll: "IDL-2026-081",
      batch: "UPSC GS Foundation (Batch A)",
      testName: "Answer Writing: Article 21 & Judicial Activism",
      submittedAt: "Today, 11:20 AM",
      status: "Pending Evaluation",
      score: null,
      feedback: null,
    },
    {
      id: "sub-2",
      studentName: "Pooja Verma",
      studentRoll: "IDL-2026-045",
      batch: "BPSC 70th CCE Target Batch",
      testName: "Modern History: 1857 Revolt Causes & Impact",
      submittedAt: "Yesterday",
      status: "Graded",
      score: "85/100",
      feedback: "Excellent structure and factual accuracy. Work on intro paragraph.",
    },
    {
      id: "sub-3",
      studentName: "Aman Gupta",
      studentRoll: "IDL-2026-092",
      batch: "Ethics, Integrity & Aptitude (GS IV)",
      testName: "Case Study 3: Conflict of Interest in Public Works",
      submittedAt: "Aug 30, 2026",
      status: "Graded",
      score: "78/100",
      feedback: "Good moral reasoning. Add more practical remedies.",
    },
    {
      id: "sub-4",
      studentName: "Sneha Patel",
      studentRoll: "IDL-2026-019",
      batch: "NCERT Comprehensive Foundation",
      testName: "Physical Geography Sectional Test 1",
      submittedAt: "Aug 28, 2026",
      status: "Pending Evaluation",
      score: null,
      feedback: null,
    },
  ]);

  const handleOpenGradeModal = (sub: any) => {
    setActiveSubmission(sub);
    setScore(sub.score ? sub.score.split('/')[0] : "");
    setFeedback(sub.feedback || "");
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!score) {
      toast({ variant: "destructive", title: "Score required", description: "Please enter a score." });
      return;
    }

    setSubmissionsList(submissionsList.map(s => {
      if (s.id === activeSubmission.id) {
        return {
          ...s,
          status: "Graded",
          score: `${score}/100`,
          feedback: feedback || "Well done!",
        };
      }
      return s;
    }));

    toast({
      title: "Evaluation Submitted",
      description: `Marks and feedback assigned to ${activeSubmission.studentName}.`,
    });
    setIsGradeModalOpen(false);
  };

  const filtered = submissionsList.filter(s => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || s.testName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === "All" || s.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span>Student Evaluations & Progress Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate test answer copies, assign marks, and write constructive feedback for your students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-bold text-amber-700 bg-amber-50 border-amber-200 py-1.5 px-3">
            2 Pending Review
          </Badge>
          <Badge variant="outline" className="text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200 py-1.5 px-3">
            2 Evaluated
          </Badge>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by student name, roll number, or test topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white border-slate-200/80 rounded-xl text-xs"
          />
        </div>
        <select 
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="h-10 px-3 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="All">All Batches</option>
          <option value="UPSC GS Foundation (Batch A)">UPSC GS Foundation (Batch A)</option>
          <option value="BPSC 70th CCE Target Batch">BPSC 70th CCE Target Batch</option>
          <option value="Ethics, Integrity & Aptitude (GS IV)">Ethics, Integrity & Aptitude (GS IV)</option>
          <option value="NCERT Comprehensive Foundation">NCERT Comprehensive Foundation</option>
        </select>
      </div>

      {/* Submissions List */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none overflow-hidden">
        <CardContent className="p-0 divide-y divide-slate-100">
          {filtered.map((sub) => (
            <div key={sub.id} className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{sub.studentName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">({sub.studentRoll})</span>
                    {sub.status === 'Graded' ? (
                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                        Score: {sub.score}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 text-[10px] font-bold">
                        Pending Evaluation
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{sub.testName}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="text-primary font-medium">{sub.batch}</span>
                    <span>•</span>
                    <span>Submitted {sub.submittedAt}</span>
                  </div>
                  {sub.feedback && (
                    <p className="text-[11px] text-slate-600 italic mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong>Feedback:</strong> "{sub.feedback}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center shrink-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => toast({ title: "Answer Copy Downloaded", description: `Downloading test copy of ${sub.studentName}.` })}
                  className="h-8 text-xs font-semibold rounded-lg text-slate-600 border-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> View Copy
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleOpenGradeModal(sub)}
                  className={`h-8 text-xs font-bold rounded-lg shadow-none cursor-pointer ${
                    sub.status === 'Graded' 
                      ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                      : 'bg-primary hover:bg-primary/95 text-white'
                  }`}
                >
                  {sub.status === 'Graded' ? 'Edit Marks' : 'Grade Copy'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* --- Evaluation & Grading Modal --- */}
      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Evaluate Answer Copy</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Grading test submission for <strong>{activeSubmission?.studentName}</strong> ({activeSubmission?.testName}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveGrade} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Marks (Out of 100)</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 85"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Constructive Feedback & Notes</Label>
              <Textarea 
                placeholder="Write specific suggestions on structure, factual accuracy, presentation, and intro/conclusion..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="text-xs bg-slate-50/70 border-slate-200 rounded-lg"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsGradeModalOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-primary hover:bg-primary/95 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                Save & Notify Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
