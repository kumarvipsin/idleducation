import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StudyResourcesView } from '@/components/study-resources/study-resources-view';

export const metadata: Metadata = {
  title: 'Study Resources | IDL Education',
  description: 'Chapter-wise notes and study material for better preparation. Choose your class to explore revision notes.',
};

export default function StudyResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#155EEF] border-t-transparent animate-spin" />
        </div>
      }
    >
      <StudyResourcesView />
    </Suspense>
  );
}
