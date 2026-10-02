'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Upload,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Layers,
  Database,
  Cpu,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KnowledgeStatus {
  isAvailable: boolean;
  totalQAs: number;
  totalChunks: number;
  sourcesCount: number;
  sources: {
    filename: string;
    filesize: number;
    parsedAt: string;
    qaCount: number;
    chunkCount: number;
  }[];
  lastUpdated: string;
  vectorStore?: {
    totalVectors: number;
    model: string;
    dimensions: number;
    lastUpdated?: string;
  };
}

export default function AdminAIKnowledgePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<KnowledgeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  // Search Tester state
  const [testQuery, setTestQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/knowledge/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load knowledge base status.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please upload a PDF document containing Questions & Answers.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/knowledge/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: 'PDF Uploaded & Indexed!',
          description: data.message,
        });
        await fetchStatus();
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: data.message || 'Could not parse the PDF.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Network error while uploading PDF.',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    try {
      const res = await fetch('/api/admin/knowledge/reindex', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Re-indexing Complete',
          description: data.message,
        });
        await fetchStatus();
      } else {
        toast({
          variant: 'destructive',
          title: 'Re-index Failed',
          description: data.message,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to trigger re-index.',
      });
    } finally {
      setReindexing(false);
    }
  };

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim() || searching) return;

    setSearching(true);
    try {
      const res = await fetch('/api/admin/knowledge/test-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResult(data.data);
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Test Failed',
        description: 'Failed to query knowledge base.',
      });
    } finally {
      setSearching(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1F4B] to-[#1D4ED8] p-6 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h1 className="text-2xl font-bold tracking-tight">AI Chatbot Knowledge Base (PDF Q&A)</h1>
          </div>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
            Upload your Question & Answer PDF documents. The AI chatbot automatically extracts questions, indexes them, and answers student questions accurately using Google Gemini.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReindex}
            disabled={reindexing}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-10 px-4 rounded-xl cursor-pointer"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", reindexing && "animate-spin")} />
            {reindexing ? 'Re-indexing...' : 'Re-index Files'}
          </Button>

          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Processing PDF...' : 'Upload PDF'}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Questions</p>
              <h3 className="text-xl font-bold text-[#0B1F4B] dark:text-blue-400 mt-0.5">
                {loading ? '...' : status?.totalQAs ?? 0}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#1D4ED8] dark:text-blue-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Document Chunks</p>
              <h3 className="text-xl font-bold text-[#0B1F4B] dark:text-blue-400 mt-0.5">
                {loading ? '...' : status?.totalChunks ?? 0}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Vector Embeddings</p>
              <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {loading ? '...' : status?.vectorStore?.totalVectors ?? 0}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">768-D text-embedding-004</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Database className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PDF Sources</p>
              <h3 className="text-xl font-bold text-[#0B1F4B] dark:text-blue-400 mt-0.5">
                {loading ? '...' : status?.sourcesCount ?? 0}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">RAG Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {status?.isAvailable ? 'Hybrid Vector Ready' : 'Waiting for PDF'}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drag & Drop / Upload Area & Sources List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Card */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-[#0B1F4B] dark:text-white">
                Upload New Q&A PDF
              </CardTitle>
              <CardDescription>
                Upload any document with Questions & Answers (e.g. FAQ, Admission Guidelines, Course syllabus, Exam Q&As).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 dark:border-slate-700 hover:border-[#1D4ED8] bg-[#F8FAFD] dark:bg-slate-900/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#1D4ED8] dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#0B1F4B] dark:text-slate-200">
                  Click to choose a PDF or drag and drop here
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports .pdf files up to 25MB • Questions & Answers are automatically extracted
                </p>
                <span className="mt-3 text-[11px] font-semibold text-[#1D4ED8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-md">
                  Pro-tip: You can also drop PDF files directly into <code>src/data/knowledge-base/</code>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Indexed PDF Sources */}
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-[#0B1F4B] dark:text-white">
                Active Knowledge Documents
              </CardTitle>
              <CardDescription>
                Files currently providing Question & Answer answers to the AI Chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500 py-4 text-center">Loading sources...</p>
              ) : !status?.sources || status.sources.length === 0 ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="font-semibold text-sm">No PDF sources indexed yet</p>
                  <p className="text-xs mt-1">Upload a PDF above to begin answering student questions.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {status.sources.map((src, i) => (
                    <div key={i} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#0B1F4B] dark:text-slate-200 truncate">
                            {src.filename}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {formatFileSize(src.filesize)} • Indexed on {new Date(src.parsedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full">
                          {src.qaCount} Q&As
                        </span>
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                          {src.chunkCount} Sections
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Search Tester (Playground) */}
        <div className="space-y-6">
          <Card className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-[#0B1F4B] dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1D4ED8]" />
                Test Q&A Search
              </CardTitle>
              <CardDescription>
                Ask a question to see what answers the AI will retrieve from the PDF knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <form onSubmit={handleTestSearch} className="space-y-3">
                <div className="relative">
                  <Input
                    placeholder="e.g. What is the admission fee? or courses offered"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="h-11 rounded-xl text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={searching || !testQuery.trim()}
                  className="w-full h-10 rounded-xl bg-[#0B1F4B] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {searching ? 'Searching...' : 'Test Knowledge Match'}
                </Button>
              </form>

              {/* Quick sample prompt buttons */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  'Admission 2026-27',
                  'Scholarship test',
                  'Branch locations',
                  'Foundation courses',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setTestQuery(tag);
                    }}
                    className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Search Result Display */}
              <div className="mt-4 flex-1">
                {searchResult ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Matches Found ({searchResult.matchedQAs?.length || 0})
                    </p>

                    {searchResult.directMatch ? (
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                            Best Grounded Match
                          </span>
                          {searchResult.directMatch.similarity && (
                            <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-200/60 dark:bg-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500" />
                              {(searchResult.directMatch.similarity * 100).toFixed(1)}% Vector Similarity
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 mt-1.5">
                          Q: {searchResult.directMatch.question}
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                          {searchResult.directMatch.answer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                        No direct match found. Model will use semantic context.
                      </p>
                    )}

                    {searchResult.matchedQAs?.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {searchResult.matchedQAs.map((qa: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <strong className="text-[#0B1F4B] dark:text-blue-300 block">Q: {qa.question}</strong>
                              {qa.similarity && (
                                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded shrink-0">
                                  {(qa.similarity * 100).toFixed(0)}% Match
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-3">{qa.answer}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">Source: {qa.source}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-slate-400 border border-dashed rounded-xl mt-2">
                    Enter a question above to test matching Q&As.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
