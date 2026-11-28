'use client';

import React from 'react';
import { format } from 'date-fns';
import { A4SectionHeader } from '@/components/a4-section-header';
import { createDraftStorage, downloadElementAsA4Pdf } from '@/lib/a4-pdf';
import { formatFeeBadge, SCHOLARSHIP_APPLICATION_FEE_INR } from '@/lib/form-fees';
import { cn } from '@/lib/utils';

export const SCHOLARSHIP_PREVIEW_DRAFT_KEY = 'idl_scholarship_preview_draft_v1';
export const SCHOLARSHIP_SUBMITTED_MESSAGE = 'IDL_SCHOLARSHIP_SUBMITTED';

export interface ScholarshipPreviewDraftValues {
  registrationId: string;
  studentName: string;
  fatherName: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  dob: string;
  gender: 'male' | 'female' | 'other' | string;
  fatherPhone: string;
  motherPhone?: string;
  studentPhone?: string;
  email?: string;
  address: string;
  branch: string;
  classCourse: string;
  programTitle: string;
  targetStream?: string;
  selectedStreamSubjects?: string[];
  previousSchool?: string;
  previousSubjects: string;
  previousMarks: string;
  scholarshipReason: string;
  customScholarshipReason?: string;
  feeAmount?: number;
  transactionId?: string;
}

export interface ScholarshipPreviewDraft {
  values: ScholarshipPreviewDraftValues;
  applicationDate: string;
  savedAt: number;
}

const scholarshipDraftStorage = createDraftStorage<ScholarshipPreviewDraft>(SCHOLARSHIP_PREVIEW_DRAFT_KEY);

export function saveScholarshipPreviewDraft(draft: ScholarshipPreviewDraft): void {
  scholarshipDraftStorage.save(draft);
}

export function loadScholarshipPreviewDraft(): ScholarshipPreviewDraft | null {
  return scholarshipDraftStorage.load();
}

export function clearScholarshipPreviewDraft(): void {
  scholarshipDraftStorage.clear();
}

export async function downloadScholarshipA4Pdf(
  contentToCapture: HTMLElement | null,
  studentName?: string
): Promise<boolean> {
  return downloadElementAsA4Pdf(
    contentToCapture,
    `${studentName || 'Student'}_Scholarship_Form.pdf`,
    '[data-scholarship-a4-preview="true"]'
  );
}

function A4Field({
  label,
  value,
  colSpanClass,
  valueClassName,
}: {
  label: string;
  value?: string;
  colSpanClass: string;
  valueClassName?: string;
}) {
  return (
    <div className={colSpanClass}>
      <span className="block text-[9.5px] font-normal text-[#737373] leading-snug mb-0.5">
        {label}
      </span>
      <p className={cn('text-[11.5px] font-medium text-[#262626] leading-[1.45] break-words', valueClassName)}>
        {value?.trim() || '—'}
      </p>
    </div>
  );
}

/** Pure white 794x1123 (A4 portrait) institutional Scholarship Application document. */
export function ScholarshipA4Document({
  values,
  applicationDate,
  previewScale = 1,
  previewSheetHeight = 1123,
  sheetRef,
}: {
  values: ScholarshipPreviewDraftValues;
  applicationDate?: string;
  previewScale?: number;
  previewSheetHeight?: number;
  sheetRef?: React.Ref<HTMLDivElement>;
}) {
  const feeValue = values.feeAmount ?? SCHOLARSHIP_APPLICATION_FEE_INR;
  const resolvedPurpose =
    values.scholarshipReason === 'Other'
      ? values.customScholarshipReason?.trim() || 'Other'
      : values.scholarshipReason;

  return (
    <div
      ref={sheetRef}
      data-a4-preview="true"
      data-scholarship-a4-preview="true"
      className="bg-white text-[#262626] w-[794px] min-h-[1123px] px-[46px] py-[38px] flex flex-col justify-between box-border text-[11px] leading-[1.45] select-none origin-top-left"
      style={{
        width: '794px',
        minHeight: '1123px',
        transform: previewScale < 1 ? `scale(${previewScale})` : undefined,
        transformOrigin: 'top left',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div>
        {/* Clean Institutional Header */}
        <div className="border-b border-neutral-200 pb-3.5 mb-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 text-left min-w-0">
            <img src="/idllogo.png" alt="IDL Logo" className="h-10 w-auto object-contain shrink-0" />
            <div className="border-l border-neutral-200 pl-3.5">
              <p className="text-[13px] font-semibold text-[#171717] tracking-normal">
                IDL Education
              </p>
              <div className="flex items-center gap-2 text-[9.5px] text-[#737373] font-normal mt-0.5 whitespace-nowrap">
                <span>Tel: 011 45035713</span>
                <span className="text-neutral-300">•</span>
                <span>info@idleducation.in</span>
                <span className="text-neutral-300">•</span>
                <span>www.idleducation.in</span>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end justify-center shrink-0">
            <span className="text-[13px] font-semibold text-[#171717] tracking-normal leading-none uppercase whitespace-nowrap">
              SCHOLARSHIP FORM 2026–27
            </span>
            <span className="text-[8.5px] font-normal text-[#737373] tracking-[0.02em] mt-1.5 uppercase whitespace-nowrap">
              (IDL ADMISSION &amp; SCHOLARSHIP TEST)
            </span>
          </div>
        </div>

        {/* Summary Block */}
        <div className="rounded-lg border border-neutral-200 bg-white px-5 py-3 mb-4 grid grid-cols-4 gap-5 text-left">
          <div>
            <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
              REGISTRATION ID
            </span>
            <span className="font-semibold text-[12px] text-[#171717] font-mono tracking-normal whitespace-nowrap">
              {values.registrationId || 'SCH-2026-101'}
            </span>
          </div>
          <div>
            <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
              PREFERRED BRANCH
            </span>
            <span className="font-medium text-[11.5px] text-[#262626] whitespace-nowrap">
              {values.branch?.split(',')[0] || '—'}
            </span>
          </div>
          <div>
            <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
              APPLICATION DATE
            </span>
            <span className="font-medium text-[11.5px] text-[#262626] whitespace-nowrap">
              {applicationDate || format(new Date(), 'dd MMMM yyyy')}
            </span>
          </div>
          <div>
            <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
              EXAM REGISTRATION FEE
            </span>
            <span className="font-semibold text-[11.5px] text-[#171717] whitespace-nowrap">
              {formatFeeBadge(feeValue)} {feeValue <= 0 ? '(Fee Waived)' : '(Paid)'}
            </span>
          </div>
        </div>

        <div className="space-y-3.5 text-left">
          {/* Section 1: Student & Parent Details */}
          <section className="rounded-lg border border-neutral-200 bg-white px-5 py-3.5">
            <A4SectionHeader step={1} title="Student & Parent Details" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5">
              <A4Field
                label="Student Full Name"
                value={values.studentName}
                colSpanClass="col-span-6"
                valueClassName="text-[12.5px] font-semibold text-[#171717]"
              />
              <A4Field
                label="Date of Birth"
                value={values.dob}
                colSpanClass="col-span-3"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4Field
                label="Gender"
                value={values.gender}
                colSpanClass="col-span-3"
                valueClassName="capitalize whitespace-nowrap"
              />
              <A4Field
                label="Class / Course & Title"
                value={
                  values.classCourse
                    ? `${values.classCourse}${values.programTitle ? ` — ${values.programTitle}` : ''}`
                    : ''
                }
                colSpanClass="col-span-6"
              />
              <A4Field
                label="Target Subject(s) / Stream"
                value={values.targetStream || ''}
                colSpanClass="col-span-6"
              />
              <A4Field label="Father Name" value={values.fatherName} colSpanClass="col-span-4" />
              <A4Field label="Father Occupation" value={values.fatherOccupation} colSpanClass="col-span-2" />
              <A4Field label="Mother Name" value={values.motherName} colSpanClass="col-span-4" />
              <A4Field label="Mother Occupation" value={values.motherOccupation} colSpanClass="col-span-2" />
            </div>
          </section>

          {/* Section 2: Contact & Address Information */}
          <section className="rounded-lg border border-neutral-200 bg-white px-5 py-3.5">
            <A4SectionHeader step={2} title="Contact & Address Information" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5">
              <A4Field
                label="Father Contact"
                value={values.fatherPhone ? `+91 ${values.fatherPhone}` : ''}
                colSpanClass="col-span-4"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4Field
                label="Mother Contact"
                value={values.motherPhone ? `+91 ${values.motherPhone}` : ''}
                colSpanClass="col-span-4"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4Field
                label="Student Contact"
                value={values.studentPhone ? `+91 ${values.studentPhone}` : ''}
                colSpanClass="col-span-4"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4Field
                label="Email Address"
                value={values.email}
                colSpanClass="col-span-5"
                valueClassName="break-all"
              />
              <A4Field
                label="Full Residential Address"
                value={values.address}
                colSpanClass="col-span-7"
              />
            </div>
          </section>

          {/* Section 3: Academic Background & Scholarship Test Details */}
          <section className="rounded-lg border border-neutral-200 bg-white px-5 py-3.5">
            <A4SectionHeader step={3} title="Academic Background & Exam Purpose" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5">
              <A4Field label="Previous School Name" value={values.previousSchool} colSpanClass="col-span-5" />
              <A4Field
                label="Subjects Studied (Previous Class)"
                value={values.previousSubjects}
                colSpanClass="col-span-4"
              />
              <A4Field label="Previous Class Marks / %" value={values.previousMarks} colSpanClass="col-span-3" />
              <A4Field
                label="Purpose of Scholarship Exam"
                value={resolvedPurpose}
                colSpanClass="col-span-12"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Declaration & Signatures */}
      <div className="pt-5 mt-5 text-left break-inside-avoid">
        <p className="text-[9.5px] text-[#525252] mb-9 leading-[1.55] text-justify">
          <strong className="font-semibold text-[#262626]">Declaration:</strong> I hereby declare that the
          information provided in this Scholarship Exam Registration Form is true and correct. I agree to abide by the
          examination guidelines and rules of IDL Education.
        </p>

        <div className="grid grid-cols-3 gap-8 text-center items-end pt-2">
          <div>
            <div className="border-b border-neutral-400 w-40 mx-auto mb-1.5" />
            <span className="text-[9.5px] font-medium text-[#262626] block">Student Signature</span>
            <span className="text-[8px] text-[#737373] block mt-0.5">(Applicant)</span>
          </div>
          <div>
            <div className="border-b border-neutral-400 w-40 mx-auto mb-1.5" />
            <span className="text-[9.5px] font-medium text-[#262626] block">Parent / Guardian Signature</span>
            <span className="text-[8px] text-[#737373] block mt-0.5">(Father / Mother / Guardian)</span>
          </div>
          <div>
            <div className="border-b border-neutral-400 w-40 mx-auto mb-1.5" />
            <span className="text-[9.5px] font-medium text-[#262626] block">Authorized IDL Stamp &amp; Sign</span>
            <span className="text-[8px] text-[#737373] block mt-0.5">(Exam Cell / Center Head)</span>
          </div>
        </div>

        <div className="mt-5 pt-2 flex items-center justify-end text-[8.5px] text-[#737373]">
          <span>Page 1 of {Math.max(1, Math.ceil((previewSheetHeight - 6) / 1123))}</span>
        </div>
      </div>
    </div>
  );
}
