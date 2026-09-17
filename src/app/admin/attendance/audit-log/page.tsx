'use client';

import React, { useState, useMemo } from 'react';
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
  Trash2,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AuditLogPage() {
  const { auditLogs, clearAllAuditLogs, deleteAuditLog, currentRole } = useAttendance();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'last7' | 'last30'>('all');

  // Clear all logs modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearConfirmationText, setClearConfirmationText] = useState('');
  const [clearReason, setClearReason] = useState('');

  // Single log delete modal
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);

  const isSuperAdmin = currentRole === 'Super Admin';

  const handleOpenClearModal = () => {
    setClearConfirmationText('');
    setClearReason('');
    setIsClearModalOpen(true);
  };

  const handleConfirmClearAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (clearConfirmationText.trim() !== 'CLEAR ALL LOGS') return;
    clearAllAuditLogs(clearReason.trim() || 'Super Admin cleared audit log');
    setIsClearModalOpen(false);
  };

  const handleConfirmDeleteSingle = () => {
    if (!deleteLogId) return;
    deleteAuditLog(deleteLogId);
    setDeleteLogId(null);
  };

  const filteredLogs = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date().getTime();

    return auditLogs.filter(log => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          (log.entity && log.entity.toLowerCase().includes(q)) ||
          (log.user && log.user.toLowerCase().includes(q)) ||
          (log.action && log.action.toLowerCase().includes(q)) ||
          (log.reason && log.reason.toLowerCase().includes(q)) ||
          (log.newValue && log.newValue.toLowerCase().includes(q)) ||
          (log.previousValue && log.previousValue.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Action Filter
      if (actionFilter !== 'all') {
        const act = log.action.toLowerCase();
        if (actionFilter === 'attendance' && !act.includes('attendance') && !act.includes('voided') && !act.includes('exit')) {
          return false;
        }
        if (actionFilter === 'student' && !act.includes('student')) {
          return false;
        }
        if (actionFilter === 'batch' && !act.includes('batch')) {
          return false;
        }
        if (actionFilter === 'class' && !act.includes('class')) {
          return false;
        }
        if (actionFilter === 'schedule' && !act.includes('schedule')) {
          return false;
        }
        if (actionFilter === 'holiday' && !act.includes('holiday')) {
          return false;
        }
      }

      // Date Filter
      if (dateFilter !== 'all') {
        const logDateStr = log.timestamp ? log.timestamp.split(' ')[0] : '';
        if (dateFilter === 'today') {
          if (!log.timestamp?.includes(todayStr) && !logDateStr.includes(todayStr)) {
            return false;
          }
        } else if (dateFilter === 'last7' || dateFilter === 'last30') {
          const daysLimit = dateFilter === 'last7' ? 7 : 30;
          const logTime = new Date(log.timestamp).getTime();
          if (!isNaN(logTime) && now - logTime > daysLimit * 24 * 60 * 60 * 1000) {
            return false;
          }
        }
      }

      return true;
    });
  }, [auditLogs, search, actionFilter, dateFilter]);

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
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              Role: {currentRole}
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Permanent, tamper-evident record of all administrative changes, student transfers, attendance edits, and archive actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && auditLogs.length > 0 && (
            <Button
              onClick={handleOpenClearModal}
              variant="outline"
              size="sm"
              className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold text-xs h-9 gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All Logs
            </Button>
          )}

          <Link href="/admin/attendance">
            <Button variant="outline" size="sm" className="text-xs font-semibold h-9">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by entity, user, action or reason..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
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
                <SelectItem value="holiday">Holiday Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
              <SelectTrigger className="h-9 text-xs font-medium">
                <SelectValue placeholder="Date Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last7">Last 7 Days</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
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
              Showing {filteredLogs.length} of {auditLogs.length} logged events
            </CardDescription>
          </div>
          <span className="text-xs text-slate-400 font-medium">Strict Audit Protocol Active</span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <History className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">No Audit Records Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {auditLogs.length === 0
                  ? 'The audit log is completely empty. New administrative actions and edits will be automatically recorded here.'
                  : 'No records match your active search query or filter selection.'}
              </p>
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
                  {isSuperAdmin && <th className="py-3 px-3 text-right">Delete</th>}
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
                          <span className="italic bg-slate-50 px-2 py-1 rounded border border-slate-200 inline-block text-[11px]">
                            &ldquo;{log.reason}&rdquo;
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      {isSuperAdmin && (
                        <td className="py-3 px-3 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteLogId(log.id)}
                            className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete this audit record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Clear All Logs Modal */}
      <Dialog open={isClearModalOpen} onOpenChange={setIsClearModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Clear All Audit Logs?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              This action is permanent and completely irreversible. All {auditLogs.length} audit trail records will be removed from the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmClearAll} className="space-y-3.5 py-2 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 text-xs space-y-1">
              <p className="font-bold">Caution: Super Admin Authorization Required</p>
              <p className="text-[11px] text-rose-800">
                To prevent accidental purge of institute compliance logs, please confirm by typing <strong>CLEAR ALL LOGS</strong> below.
              </p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Reason for Purge *</Label>
              <Input
                value={clearReason}
                onChange={e => setClearReason(e.target.value)}
                placeholder="e.g. Annual academic rollover / test data reset..."
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Type <span className="font-mono font-bold text-rose-600">CLEAR ALL LOGS</span> to confirm:
              </Label>
              <Input
                value={clearConfirmationText}
                onChange={e => setClearConfirmationText(e.target.value)}
                placeholder="CLEAR ALL LOGS"
                className="mt-1 h-9 text-xs font-mono"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsClearModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={clearConfirmationText.trim() !== 'CLEAR ALL LOGS'}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs disabled:opacity-50"
              >
                Permanently Clear All Logs
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Single Log Delete Confirmation Modal */}
      <Dialog open={!!deleteLogId} onOpenChange={open => !open && setDeleteLogId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-rose-700 flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-600" />
              Delete Audit Record?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to remove this individual audit log entry?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteLogId(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmDeleteSingle} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs">
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
