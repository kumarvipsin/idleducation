import { Suspense } from 'react';
import { Metadata } from 'next';
import { CourseDetailClient } from './course-detail-client';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const formattedTitle = slug ? slug.replace('-', ' ').toUpperCase() : 'Course Details';
    return {
        title: `${formattedTitle} | IDL Education Classroom Program`,
        description: `Enroll in IDL Education ${formattedTitle} course with top faculties, printed study material, test series, and comprehensive guidance.`,
    };
}

export default async function CourseDetailPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F4F8FC] dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        }>
            <CourseDetailClient slug={slug} />
        </Suspense>
    );
}
