'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import { Building2, Plus, Calendar, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function HolidaysPage() {
  const { holidays, addHoliday } = useAttendance();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-16');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHoliday({
      date,
      title,
      type: 'Institute Holiday',
      reason: reason || 'Institute closed.',
    });
    setTitle('');
    setReason('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Holidays &amp; Institute Off Days
            </h1>
            <Badge className="bg-amber-50 text-amber-800 border-amber-200 font-bold text-xs">
              Attendance Protection Rule
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Declared institute holidays and emergency cancellations NEVER count as student absences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Declare Holiday
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map(h => (
          <Card key={h.id} className="border-amber-200 bg-amber-50/30 shadow-xs">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[10px]">
                {h.type}
              </Badge>
              <span className="font-mono text-xs font-bold text-slate-700">{h.date}</span>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
              <CardTitle className="text-base font-bold text-slate-900">{h.title}</CardTitle>
              <p className="text-xs text-slate-600 font-medium">{h.reason}</p>
              <div className="pt-2 border-t border-amber-100 text-[11px] text-amber-800 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Zero absence penalty applied to all batches
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Holiday Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Declare Institute Holiday</DialogTitle>
            <DialogDescription className="text-xs">
              Students and batches will not be penalized for classes scheduled on this day.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Occasion / Title</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Ganesh Chaturthi"
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Official Reason / Remark</Label>
              <Textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Festival or institutional holiday..."
                className="mt-1 text-xs h-20"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Declare Holiday
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
