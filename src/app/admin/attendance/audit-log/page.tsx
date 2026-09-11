'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  History,
  Search,
  Filter,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AuditLogPage() {
  const { auditLogs } = useAttendance();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        log.entity.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        (log.reason && log.reason.toLowerCase().includes(q)) ||
        (log.newValue && log.newValue.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (actionFilter !== 'all' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Admin Activity &amp; Audit Log
            </h1>
            <Badge className="bg-slate-900 text-white font-mono text-xs">
              {auditLogs.length} Events Tracked
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Permanent, tamper-evident record of all administrative changes, student transfers, attendance edits, and archive actions.
          </p>
        </div>

        <Link href="/admin/attendance">
          <Button variant="outline" size="sm" className="text-xs font-semibold">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by entity, user, or reason..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="h-9 text-xs font-medium">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="attendance">Attendance Modifications</SelectItem>
                <SelectItem value="student">Student Operations</SelectItem>
                <SelectItem value="batch">Batch Operations</SelectItem>
                <SelectItem value="class">Class Operations</SelectItem>
                <SelectItem value="schedule">Schedule Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="h-4 w-4 text-blue-600" />
              Administrative Change Records
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Complete chronological audit trail
            </CardDescription>
          </div>
          <span className="text-xs text-slate-400">Strict Audit Protocol Active</span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No audit records found matching your filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-3">Admin User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Previous Value</th>
                  <th className="py-3 px-4">New Value</th>
                  <th className="py-3 px-4">Required Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => {
                  let badgeStyle = 'bg-slate-100 text-slate-800';
                  if (log.action.includes('Voided') || log.action.includes('Deleted')) {
                    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                  } else if (log.action.includes('Archived')) {
                    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                  } else if (log.action.includes('Added') || log.action.includes('Restored')) {
                    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  } else if (log.action.includes('Transferred')) {
                    badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
                  } else if (log.action.includes('Edited')) {
                    badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{log.user}</div>
                        <span className="text-[10px] text-slate-400">{log.role}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] font-bold ${badgeStyle}`}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {log.entity}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {log.previousValue || '-'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-[11px]">
                        {log.newValue || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        {log.reason ? (
                          <span className="italic bg-slate-50 px-2 py-1 rounded border border-slate-200 inline-block">
                            &ldquo;{log.reason}&rdquo;
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
