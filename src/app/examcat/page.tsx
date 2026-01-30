'use client';

import { Suspense } from 'react';

function ExamcatPageContent() {
  return <div className="container mx-auto py-12 px-4 md:px-6" />;
}

export default function ExamcatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExamcatPageContent />
        </Suspense>
    )
}
