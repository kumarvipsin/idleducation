import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Terms & Conditions | IDL Education',
  description:
    'Institutional Terms and Conditions for admission, classes, attendance, fee payments, and code of conduct at IDL Education.',
};

const SECTIONS = [
  {
    title: '1. Accuracy of Information & Eligibility',
    body: 'Applicants and parents/guardians must provide accurate personal, academic, identity, and contact details during admission. IDL Education reserves the right to verify supporting documents and cancel admission in case of false or misleading disclosures.',
  },
  {
    title: '2. Enrollment, Session & Batch Allocation',
    body: 'Admission is valid strictly for the selected academic session, branch center, class/course, medium, and learning mode (Offline Classroom or Online Classroom). Batch timings and center allocation are managed by IDL Education academics administration.',
  },
  {
    title: '3. Registration & Tuition Fee Policy',
    body: 'Registration, processing, and tuition fees once paid are non-refundable and non-transferable unless explicitly permitted under written institutional scholarship or refund guidelines. Fee schedules must be cleared within due dates.',
  },
  {
    title: '4. Attendance, Discipline & Study Material',
    body: 'Students are expected to maintain regular attendance, complete tests and assignments on schedule, and uphold respectful conduct in classrooms and online sessions. IDL printed notes, DPPs, and digital study materials are for individual student use only.',
  },
  {
    title: '5. Communication & Privacy',
    body: 'Parent and student contact numbers or email addresses provided in the form may be used by IDL Education for attendance updates, exam schedules, fee reminders, and academic progress communication.',
  },
] as const;

export default function TermsConditionsPage() {
  return (
    <main className="min-h-[70vh] bg-[#F8FAFD] dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-9 text-left">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#2864E8]">
              IDL Education • Institutional Policy
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] dark:text-white mt-1">
              Terms &amp; Conditions
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2864E8] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-5 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {SECTIONS.map((sec) => (
            <section key={sec.title} className="space-y-1.5">
              <h2 className="text-[14.5px] font-bold text-[#0B1F4B] dark:text-white">{sec.title}</h2>
              <p>{sec.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>Questions? Email info@idleducation.in or call +91 88600 40010.</span>
          <Button asChild variant="outline" size="sm" className="rounded-lg h-8 text-xs font-semibold">
            <Link href="/admission">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Admission Form
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
