'use client';

import React from 'react';
import { format } from 'date-fns';
import { A4SectionHeader } from '@/components/a4-section-header';
import { createDraftStorage, downloadElementAsA4Pdf } from '@/lib/a4-pdf';
import { cn } from '@/lib/utils';

export const ADMISSION_PREVIEW_DRAFT_KEY = 'idl_admission_preview_draft_v1';
export const ADMISSION_SUBMITTED_MESSAGE = 'IDL_ADMISSION_SUBMITTED';

export interface AdmissionPreviewDraftValues {
  studentId: string;
  admissionSession?: string;
  branch: string;
  studentName: string;
  fatherName: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  dob?: string;
  dobInput?: string;
  gender?: string;
  aadharNumber?: string;
  apaarId?: string;
  classApplied: string;
  board?: string;
  otherBoard?: string;
  medium?: string;
  mode?: string;
  program?: string;
  stream?: string;
  selectedStreamSubjects?: string[];
  fatherPhone: string;
  motherPhone?: string;
  studentPhone?: string;
  email?: string;
  parentEmail?: string;
  address: string;
  city?: string;
  customCity?: string;
  state?: string;
  pincode?: string;
  acceptedTerms?: boolean;
  emergencyContact?: string;
  previousSchool?: string;
  previousClass?: string;
  previousPercentage?: string;
  scholarshipTest?: string;
  transactionId?: string;
  telephone?: string;
  country?: string;
  bloodGroup?: string;
  additionalInfo?: string;
}

export interface AdmissionPreviewDraft {
  values: AdmissionPreviewDraftValues;
  photoPreview: string | null;
  applicationDate: string;
  savedAt: number;
}

export const formatDateForDisplay = (date: Date | string | undefined) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return format(dateObj, 'dd-MM-yyyy');
};

const admissionDraftStorage = createDraftStorage<AdmissionPreviewDraft>(ADMISSION_PREVIEW_DRAFT_KEY);

export function saveAdmissionPreviewDraft(draft: AdmissionPreviewDraft): void {
  admissionDraftStorage.save(draft);
}

export function loadAdmissionPreviewDraft(): AdmissionPreviewDraft | null {
  return admissionDraftStorage.load();
}

export function clearAdmissionPreviewDraft(): void {
  admissionDraftStorage.clear();
}

export async function dataUrlToFile(dataUrl: string, fileName = 'student-photo.jpg'): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
}

export async function downloadAdmissionA4Pdf(
  contentToCapture: HTMLElement | null,
  studentName?: string
): Promise<boolean> {
  return downloadElementAsA4Pdf(
    contentToCapture,
    `${studentName || 'Student'}_Admission_Form.pdf`
  );
}

function A4PreviewField({
  label,
  value,
  colSpanClass,
  valueClassName,
  isStudentName = false,
}: {
  label: string;
  value: string;
  colSpanClass: string;
  valueClassName?: string;
  isStudentName?: boolean;
}) {
  return (
    <div className={colSpanClass}>
      <span className="block text-[9.5px] font-normal text-[#737373] leading-snug mb-0.5">
        {label}
      </span>
      <p
        {...(isStudentName ? { 'data-preview-student-name': 'true' } : {})}
        className={cn('text-[11.5px] font-medium text-[#262626] leading-[1.45]', valueClassName)}
      >
        {value || '—'}
      </p>
    </div>
  );
}

/** Pure white 794x1123 (A4 portrait) institutional admission document copy. */
export function AdmissionA4Document({
  values,
  photoPreview,
  applicationDate,
  previewScale = 1,
  previewSheetHeight = 1123,
  sheetRef,
}: {
  values: AdmissionPreviewDraftValues;
  photoPreview: string | null;
  applicationDate?: string;
  previewScale?: number;
  previewSheetHeight?: number;
  sheetRef?: React.Ref<HTMLDivElement>;
}) {
  const dobText = formatDateForDisplay(values.dob) || values.dobInput || '';
  const resolvedBoard =
    values.board === 'OTHER' && values.otherBoard?.trim()
      ? values.otherBoard.trim()
      : values.board || '';
  const resolvedCity =
    values.city === 'Other' && values.customCity?.trim()
      ? values.customCity.trim()
      : values.city || '';
  const sessionLabel = values.admissionSession || '2026-2027';
  const modeLabel = values.mode || 'Offline Classroom';

  return (
    <div
      ref={sheetRef}
      data-a4-preview="true"
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
              ADMISSION FORM {sessionLabel}
            </span>
            <span className="text-[8.5px] font-normal text-[#737373] tracking-[0.02em] mt-1.5 uppercase whitespace-nowrap">
              ({modeLabel})
            </span>
          </div>
        </div>

        {/* Admission Summary Block & Photograph */}
        <div className="rounded-lg border border-neutral-200 bg-white px-5 py-3 mb-4 flex items-center justify-between gap-6">
          <div className="grid grid-cols-3 gap-6 text-left flex-1">
            <div>
              <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
                ADMISSION NUMBER
              </span>
              <span className="font-semibold text-[12.5px] text-[#171717] font-mono tracking-normal whitespace-nowrap">
                {values.studentId || 'PROV-2026-001'}
              </span>
            </div>
            <div>
              <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
                ADMISSION BRANCH
              </span>
              <span className="font-medium text-[11.5px] text-[#262626] whitespace-nowrap">
                {values.branch?.split(',')[0] || '—'}
              </span>
            </div>
            <div>
              <span className="text-[8.5px] font-medium uppercase tracking-[0.02em] text-[#737373] block mb-0.5">
                DATE OF APPLICATION
              </span>
              <span className="font-medium text-[11.5px] text-[#262626] whitespace-nowrap">
                {applicationDate || format(new Date(), 'dd MMMM yyyy')}
              </span>
            </div>
          </div>

          <div className="w-[70px] h-[90px] rounded-[4px] border border-neutral-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[8px] text-[#737373] font-normal text-center px-1.5 leading-tight">
                Affix Recent Photo
              </span>
            )}
          </div>
        </div>

        {/* Structured Pure-White Section Blocks */}
        <div className="space-y-3.5 text-left">
          {/* Section 1: Student Identity & Details */}
          <section className="rounded-lg border border-neutral-200 bg-white px-5 py-3.5">
            <A4SectionHeader step={1} title="Student Identity & Details" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5">
              <A4PreviewField
                label="Student Full Name"
                value={values.studentName}
                colSpanClass="col-span-6"
                valueClassName="text-[12.5px] font-semibold text-[#171717] break-words"
                isStudentName
              />
              <A4PreviewField
                label="Date of Birth"
                value={dobText}
                colSpanClass="col-span-3"
                valueClassName="whitespace-nowrap"
              />
              <A4PreviewField
                label="Gender"
                value={values.gender || ''}
                colSpanClass="col-span-3"
                valueClassName="capitalize whitespace-nowrap"
              />
              <A4PreviewField
                label="Class / Course & Title"
                value={
                  values.classApplied
                    ? `${values.classApplied}${values.program ? ` — ${values.program}` : ''}`
                    : ''
                }
                colSpanClass="col-span-6"
                valueClassName="break-words"
              />
              <A4PreviewField
                label="Board"
                value={resolvedBoard}
                colSpanClass="col-span-3"
                valueClassName="whitespace-nowrap"
              />
              <A4PreviewField
                label="Medium"
                value={values.medium || ''}
                colSpanClass="col-span-3"
                valueClassName="whitespace-nowrap"
              />
              <A4PreviewField
                label="Academic Session"
                value={sessionLabel}
                colSpanClass="col-span-3"
                valueClassName="whitespace-nowrap"
              />
              <A4PreviewField
                label="Mode"
                value={modeLabel}
                colSpanClass="col-span-3"
                valueClassName="whitespace-nowrap"
              />
              <A4PreviewField
                label="Aadhar No."
                value={values.aadharNumber || ''}
                colSpanClass="col-span-3"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4PreviewField
                label="APAAR ID"
                value={values.apaarId || ''}
                colSpanClass="col-span-3"
                valueClassName="whitespace-nowrap"
              />
              {values.stream && (
                <A4PreviewField
                  label="Selected Subjects / Stream"
                  value={values.stream || ''}
                  colSpanClass="col-span-12"
                />
              )}
            </div>
          </section>

          {/* Section 2: Parent / Guardian & Contact Information */}
          <section className="rounded-lg border border-neutral-200 bg-white px-5 py-3.5">
            <A4SectionHeader step={2} title="Parent / Guardian & Contact Information" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5">
              <A4PreviewField label="Father Name" value={values.fatherName} colSpanClass="col-span-4" />
              <A4PreviewField
                label="Father Occupation"
                value={values.fatherOccupation || ''}
                colSpanClass="col-span-4"
              />
              <A4PreviewField
                label="Father Contact"
                value={values.fatherPhone ? `+91 ${values.fatherPhone}` : ''}
                colSpanClass="col-span-4"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4PreviewField label="Mother Name" value={values.motherName || ''} colSpanClass="col-span-4" />
              <A4PreviewField
                label="Mother Occupation"
                value={values.motherOccupation || ''}
                colSpanClass="col-span-4"
              />
              <A4PreviewField
                label="Mother Contact"
                value={values.motherPhone ? `+91 ${values.motherPhone}` : ''}
                colSpanClass="col-span-4"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4PreviewField
                label="Student Contact"
                value={values.studentPhone ? `+91 ${values.studentPhone}` : ''}
                colSpanClass="col-span-4"
                valueClassName="tabular-nums whitespace-nowrap"
              />
              <A4PreviewField
                label="Email Address"
                value={values.email || values.parentEmail || ''}
                colSpanClass="col-span-8"
                valueClassName="break-all"
              />
              <A4PreviewField label="Full Residential Address" value={values.address} colSpanClass="col-span-6" />
              <A4PreviewField label="State" value={values.state || ''} colSpanClass="col-span-3" />
              <A4PreviewField label="City" value={resolvedCity} colSpanClass="col-span-3" />
            </div>
          </section>

          {/* Section 3: Academic Background */}
          <section className="rounded-lg border border-neutral-200 bg-white px-5 py-3.5">
            <A4SectionHeader step={3} title="Academic Background" />
            <div className="grid grid-cols-12 gap-x-6 gap-y-2.5">
              <A4PreviewField
                label="Previous School Name"
                value={values.previousSchool || ''}
                colSpanClass="col-span-5"
              />
              <A4PreviewField
                label="Percentage / Grade"
                value={values.previousPercentage || ''}
                colSpanClass="col-span-3"
              />
              <A4PreviewField
                label="Scholarship / Entrance Test"
                value={values.scholarshipTest || ''}
                colSpanClass="col-span-4"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Declaration, Clean Signatures & Subtle Page Indicator */}
      <div className="pt-5 mt-5 text-left break-inside-avoid">
        <p className="text-[9.5px] text-[#525252] mb-9 leading-[1.55] text-justify">
          <strong className="font-semibold text-[#262626]">Declaration:</strong> I hereby declare that I have read the
          Terms &amp; Conditions of IDL Education. The details mentioned above in the form are correct to the best of my
          knowledge and belief. Fees once paid for registration are non-refundable.
        </p>

        <div className="grid grid-cols-3 gap-8 text-center items-end pt-2">
          <div>
            <div className="border-b border-neutral-400 w-40 mx-auto mb-1.5" />
            <span className="text-[9.5px] font-medium text-[#262626] block">Student Signature</span>
            <span className="text-[8px] text-[#737373] block mt-0.5">(Sign inside boundary)</span>
          </div>
          <div>
            <div className="border-b border-neutral-400 w-40 mx-auto mb-1.5" />
            <span className="text-[9.5px] font-medium text-[#262626] block">Parent / Guardian Signature</span>
            <span className="text-[8px] text-[#737373] block mt-0.5">(Father / Mother / Guardian)</span>
          </div>
          <div>
            <div className="border-b border-neutral-400 w-40 mx-auto mb-1.5" />
            <span className="text-[9.5px] font-medium text-[#262626] block">Authorized IDL Stamp &amp; Sign</span>
            <span className="text-[8px] text-[#737373] block mt-0.5">(Center Head / Admin)</span>
          </div>
        </div>

        <div className="mt-5 pt-2 flex items-center justify-end text-[8.5px] text-[#737373]">
          <span>Page 1 of {Math.max(1, Math.ceil((previewSheetHeight - 6) / 1123))}</span>
        </div>
      </div>
    </div>
  );
}
