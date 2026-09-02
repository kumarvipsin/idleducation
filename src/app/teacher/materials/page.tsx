'use client';

import { useState } from "react";
import { 
  Upload, FileText, Download, Trash2, Eye, Plus, 
  Search, Filter, BookOpen, ExternalLink, Sparkles 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TeacherMaterialsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [batch, setBatch] = useState("UPSC GS Foundation (Batch A)");
  const [type, setType] = useState("PDF Notes");

  const [materialsList, setMaterialsList] = useState([
    {
      id: "mat-1",
      title: "Indian Polity: Complete Fundamental Rights Handout & Case Laws",
      batch: "UPSC GS Foundation (Batch A)",
      type: "PDF Notes",
      size: "4.8 MB",
      uploadedAt: "Today, 10:30 AM",
      downloads: 42,
    },
    {
      id: "mat-2",
      title: "Modern History: 1857 to 1947 Timeline & Governor-Generals Summary",
      batch: "BPSC 70th CCE Target Batch",
      type: "PDF Notes",
      size: "6.2 MB",
      uploadedAt: "Yesterday",
      downloads: 58,
    },
    {
      id: "mat-3",
      title: "Ethics Case Studies Practice Sheet with Model Answers",
      batch: "Ethics, Integrity & Aptitude (GS IV)",
      type: "Assignment Sheet",
      size: "2.1 MB",
      uploadedAt: "Aug 29, 2026",
      downloads: 36,
    },
    {
      id: "mat-4",
      title: "Physical Geography Map Work & World Climate Diagrams",
      batch: "NCERT Comprehensive Foundation",
      type: "Diagrams & Maps",
      size: "12.4 MB",
      uploadedAt: "Aug 25, 2026",
      downloads: 71,
    },
  ]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast({ variant: "destructive", title: "Missing title", description: "Please enter a material title." });
      return;
    }

    const newMat = {
      id: `mat-${Date.now()}`,
      title,
      batch,
      type,
      size: "3.5 MB",
      uploadedAt: "Just now",
      downloads: 0,
    };

    setMaterialsList([newMat, ...materialsList]);
    toast({ title: "Material Uploaded", description: `"${title}" has been shared with ${batch}.` });
    setTitle("");
    setIsUploadModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setMaterialsList(materialsList.filter(m => m.id !== id));
    toast({ title: "Material Removed", description: "Resource has been deleted from the portal." });
  };

  const filteredMaterials = materialsList.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || m.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <span>Course Notes & Study Materials</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload PDFs, test papers, lecture notes, and diagrams directly to student portals.
          </p>
        </div>

        <Button 
          onClick={() => setIsUploadModalOpen(true)}
          className="h-9 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Upload Material
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search material title or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white border-slate-200/80 rounded-xl text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "PDF Notes", "Assignment Sheet", "Diagrams & Maps"].map((t) => (
            <Button
              key={t}
              onClick={() => setSelectedType(t)}
              variant={selectedType === t ? "default" : "outline"}
              size="sm"
              className={`h-9 text-xs rounded-xl ${
                selectedType === t 
                  ? "bg-primary text-white font-bold" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none overflow-hidden">
        <CardContent className="p-0 divide-y divide-slate-100">
          {filteredMaterials.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs font-semibold">
              No materials found matching your query.
            </div>
          ) : (
            filteredMaterials.map((mat) => (
              <div key={mat.id} className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{mat.title}</h4>
                      <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/20 bg-primary/5">
                        {mat.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="font-semibold text-slate-700">{mat.batch}</span>
                      <span>•</span>
                      <span>{mat.size}</span>
                      <span>•</span>
                      <span>Uploaded {mat.uploadedAt}</span>
                      <span>•</span>
                      <span>📥 {mat.downloads} student downloads</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toast({ title: "Opening File", description: `Downloading ${mat.title}` })}
                    className="h-8 text-xs font-semibold rounded-lg text-slate-600 border-slate-200 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDelete(mat.id)}
                    className="h-8 text-xs font-semibold rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* --- Upload Modal --- */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Upload Study Resource</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Attach PDFs or worksheets for your students to download.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Target Batch</Label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800"
              >
                <option value="UPSC GS Foundation (Batch A)">UPSC GS Foundation (Batch A)</option>
                <option value="BPSC 70th CCE Target Batch">BPSC 70th CCE Target Batch</option>
                <option value="Ethics, Integrity & Aptitude (GS IV)">Ethics, Integrity & Aptitude (GS IV)</option>
                <option value="NCERT Comprehensive Foundation">NCERT Comprehensive Foundation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Material Type</Label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800"
              >
                <option value="PDF Notes">PDF Notes</option>
                <option value="Assignment Sheet">Assignment Sheet</option>
                <option value="Diagrams & Maps">Diagrams & Maps</option>
                <option value="Test Solution">Test Solution</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Document Title</Label>
              <Input 
                placeholder="e.g. Fundamental Rights Detailed Notes PDF"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Choose File</Label>
              <Input 
                type="file" 
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg cursor-pointer" 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-primary hover:bg-primary/95 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                Publish Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
