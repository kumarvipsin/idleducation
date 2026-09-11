'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Archive,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Users,
  Layers,
  Calendar,
  FileText,
  Phone,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { DependencySummary } from '@/context/attendance-context';
import type { UserRole } from '@/lib/attendance-store';

interface SmartDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  entityType: 'Class' | 'Batch' | 'Student' | 'Teacher' | 'Subject' | 'Schedule';
  entityName: string;
  entityId: string;
  isDemoMode: boolean;
  currentRole: UserRole;
  dependencies: DependencySummary;
  onArchive?: () => void;
  onForceDelete: (reason: string) => void;
}

function DepRow({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-slate-700">
      <span className="text-slate-400">{icon}</span>
      <span className="font-semibold text-slate-800">{count}</span>
      <span>{label}</span>
    </div>
  );
}

export function SmartDeleteDialog({
  open,
  onClose,
  entityType,
  entityName,
  entityId,
  isDemoMode,
  currentRole,
  dependencies,
  onArchive,
  onForceDelete,
}: SmartDeleteDialogProps) {
  const [reason, setReason] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const totalDeps =
    dependencies.batches +
    dependencies.students +
    dependencies.schedules +
    dependencies.attendanceSessions +
    dependencies.leaveRecords +
    dependencies.callRecords;

  const hasDependencies = totalDeps > 0;
  const isHighImpact = totalDeps >= 10;
  const isSuperAdmin = currentRole === 'Super Admin';
  const canForceDelete = isDemoMode || isSuperAdmin;
  const needsTypedConfirm = !isDemoMode && isHighImpact && isSuperAdmin;
  const deleteConfirmValid = !needsTypedConfirm || deleteConfirmText === 'DELETE';
  const reasonValid = isDemoMode ? true : reason.trim().length >= 5;
  const canSubmit = deleteConfirmValid && reasonValid;

  const handleDelete = () => {
    if (!canSubmit) return;
    onForceDelete(reason.trim() || (isDemoMode ? 'Demo data removed' : 'Permanent deletion'));
    setReason('');
    setDeleteConfirmText('');
    onClose();
  };

  const handleArchive = () => {
    onArchive?.();
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setDeleteConfirmText('');
    onClose();
  };

  // ── Zero dependencies: simple confirmation ──
  if (!hasDependencies) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Trash2 className="h-4 w-4 text-red-500" />
              Delete {entityType}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Delete <span className="font-semibold text-slate-800">{entityName}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {isDemoMode && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-medium text-amber-700">
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
              Demo Mode — this record will be permanently removed.
            </div>
          )}

          {!isDemoMode && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Reason (optional)</Label>
              <Textarea
                placeholder="Why is this being deleted?"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="h-16 text-xs resize-none"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Has dependencies ──
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            {isDemoMode
              ? <><Sparkles className="h-4 w-4 text-amber-500" /> Delete Demo {entityType}</>
              : <><AlertTriangle className="h-4 w-4 text-orange-500" /> Delete {entityType}</>
            }
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            <span className="font-semibold text-slate-800">{entityName}</span> has linked records.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Demo Mode banner */}
          {isDemoMode && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                <span className="text-xs font-bold text-amber-700">DEMO MODE — Cascade Delete Allowed</span>
              </div>
              <p className="text-xs text-amber-600 ml-5">
                All linked demo records below will also be permanently removed. This is safe in demo mode.
              </p>
            </div>
          )}

          {/* Real mode — Super Admin warning */}
          {!isDemoMode && isSuperAdmin && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                <span className="text-xs font-bold text-red-700">Super Admin — Permanent Deletion</span>
              </div>
              <p className="text-xs text-red-600 ml-5">
                This will permanently remove {entityName} and may affect the records listed below.
              </p>
            </div>
          )}

          {/* Real mode — Admin (not super admin) */}
          {!isDemoMode && !isSuperAdmin && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <Archive className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-bold text-blue-700">Archive Recommended</span>
              </div>
              <p className="text-xs text-blue-600 ml-5">
                {entityName} has linked records. Archive to preserve history. Permanent deletion requires Super Admin.
              </p>
            </div>
          )}

          {/* Dependency list */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 space-y-1.5">
            <p className="text-xs font-bold text-slate-600 mb-2">{entityName} is linked to:</p>
            <DepRow icon={<Layers className="h-3.5 w-3.5" />} label="batches" count={dependencies.batches} />
            <DepRow icon={<Users className="h-3.5 w-3.5" />} label="students" count={dependencies.students} />
            <DepRow icon={<Calendar className="h-3.5 w-3.5" />} label="class schedules" count={dependencies.schedules} />
            <DepRow icon={<Clock className="h-3.5 w-3.5" />} label="attendance session(s)" count={dependencies.attendanceSessions} />
            <DepRow icon={<FileText className="h-3.5 w-3.5" />} label="leave records" count={dependencies.leaveRecords} />
            <DepRow icon={<Phone className="h-3.5 w-3.5" />} label="parent call records" count={dependencies.callRecords} />
          </div>

          {/* Reason (required in real mode) */}
          {!isDemoMode && canForceDelete && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder={`Why is ${entityName} being permanently deleted?`}
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="h-16 text-xs resize-none"
              />
              {reason.trim().length > 0 && reason.trim().length < 5 && (
                <p className="text-xs text-red-500">Please provide a reason (min 5 characters).</p>
              )}
            </div>
          )}

          {/* Type DELETE confirmation for high-impact real data */}
          {needsTypedConfirm && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Type <span className="font-mono bg-slate-100 px-1 rounded text-red-600 font-bold">DELETE</span> to confirm
              </Label>
              <Input
                placeholder="Type DELETE"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                className={`text-xs font-mono ${deleteConfirmText === 'DELETE' ? 'border-green-400 bg-green-50' : ''}`}
              />
              {deleteConfirmText === 'DELETE' && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Confirmed
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button variant="outline" size="sm" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>

          {/* Archive button — always shown when handler provided and not demo */}
          {onArchive && !isDemoMode && (
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
              onClick={handleArchive}
            >
              <Archive className="h-3.5 w-3.5 mr-1.5" />
              Archive Instead
            </Button>
          )}

          {/* Force delete — shown in demo mode always, or Super Admin in real mode */}
          {canForceDelete && (
            <Button
              size="sm"
              disabled={!canSubmit}
              className={`w-full sm:w-auto text-white ${
                isDemoMode
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete Permanently
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
