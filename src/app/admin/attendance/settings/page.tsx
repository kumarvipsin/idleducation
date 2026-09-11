'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Settings,
  Sliders,
  Shield,
  RotateCcw,
  Check,
  Sparkles,
  Building2,
  Trash2,
  AlertTriangle,
  UserCheck,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AttendanceSettingsPage() {
  const { resetToSeedData, clearAllDemoData, isDemoData, currentRole } = useAttendance();
  const [threshold, setThreshold] = useState('75');
  const [instituteName, setInstituteName] = useState('IDL EDUCATION');
  const [tagline, setTagline] = useState('Learn Today, Lead Tomorrow');
  const [branch, setBranch] = useState('Main Branch (Delhi)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all classes, batches, students, teachers, schedules, and attendance to default demo sample data?')) {
      resetToSeedData();
    }
  };

  const handleClear = () => {
    if (confirm('WARNING: Are you sure you want to CLEAR ALL DEMO DATA?\n\nThis will wipe out sample classes, students, teachers, and attendance records so you can start with a clean blank database for real institute onboarding.\n\nYou can restore sample data anytime by clicking "Reset Demo Data".')) {
      clearAllDemoData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              System Settings &amp; Configuration
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              Institute Policy
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Configure institute details, attendance threshold rules, role permissions, and database demo mode.
          </p>
        </div>

        <Link href="/admin/attendance">
          <Button variant="outline" size="sm" className="text-xs font-semibold">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Institute Identity */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Institute Brand &amp; Branch Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5 text-xs">
            <div>
              <Label className="text-xs font-semibold">Institute Name</Label>
              <Input
                value={instituteName}
                onChange={e => setInstituteName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Brand Tagline</Label>
              <Input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Primary Branch Location</Label>
              <Input
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rules & Thresholds */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Attendance Rules &amp; Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5 text-xs">
            <div>
              <Label className="text-xs font-semibold">Mandatory Attendance Threshold (%)</Label>
              <Input
                type="number"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                className="mt-1 h-9 text-xs max-w-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Students below this threshold will be flagged in Red across class reports and trigger parent notifications.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role-Based Permissions Overview */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-600" />
              Role-Based Access Control (RBAC) Matrix
            </CardTitle>
            <CardDescription className="text-xs">
              Current active preview role: <span className="font-bold text-blue-700">{currentRole}</span> (switch roles in top navigation bar)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Feature / Capability</th>
                  <th className="py-2.5 px-3 text-center">Super Admin</th>
                  <th className="py-2.5 px-3 text-center">Admin</th>
                  <th className="py-2.5 px-3 text-center">Teacher</th>
                  <th className="py-2.5 px-3 text-center">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Live Attendance Session &amp; Mark Present/Late/Absent</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Attendance Correction &amp; Void (Requires Reason &amp; Audit Log)</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Classes, Batches &amp; Subjects Management</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">View Only</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">View Only</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Student Enrolment, Archive &amp; Batch Transfer</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">View Only</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Leave Approval &amp; Parent Follow-up Call Recording</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">View Administrative Audit Trail</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Clear / Reset Demo Database</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                  <td className="py-2.5 px-3 text-center text-slate-300">—</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Demo Data & Database Controls */}
        <Card className="border-amber-200 bg-amber-50/30 shadow-xs">
          <CardHeader className="p-4 border-b border-amber-100">
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Database &amp; Demo Data Controls
              </span>
              <Badge className={isDemoData ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'}>
                {isDemoData ? 'Demo Seed Mode Active' : 'Clean Slate Database'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-amber-800/80">
              Easily clear out sample records to start real institute onboarding, or reload clean seed data for testing.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-amber-200/70">
              <div>
                <span className="font-bold text-slate-900 block">Clear All Demo Data (Clean Slate)</span>
                <span className="text-slate-500 text-[11px]">
                  Empties all sample classes, students, teachers, and attendance history so you can onboard your real school/coaching data.
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-xs font-bold text-rose-600 border-rose-300 hover:bg-rose-50 gap-1.5 shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All Demo Data
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Reset Demo Sample Data</span>
                <span className="text-slate-500 text-[11px]">
                  Restores realistic demo classes (9th, 10th, 11th, 12th), batches, student profiles, and live sessions.
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs font-bold text-blue-700 border-blue-300 hover:bg-blue-50 gap-1.5 shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex items-center justify-end pt-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-6 gap-1.5">
            {saved ? <Check className="h-4 w-4" /> : null}
            {saved ? 'Settings Saved!' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
