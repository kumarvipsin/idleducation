import { Suspense } from 'react';
import { Metadata } from 'next';
import { CoursesClient } from './courses-client';

export const metadata: Metadata = {
    title: 'Foundation & Classroom Courses | IDL Education',
    description: 'Explore Classes 6 to 10 Foundation and Senior Secondary courses at IDL Education Centers. Top faculties, printed study material, test series, and comprehensive guidance.',
};

export default function CoursesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        }>
            <CoursesClient />
        </Suspense>
    );
}
