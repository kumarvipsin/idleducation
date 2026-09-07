'use client';

import { BlogManager } from '@/components/blog-manager';

export default function TeacherBlogPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <BlogManager 
        role="teacher" 
        title="Faculty Article & Blog Hub"
        description="Share expert study strategies, syllabus updates, and subject guidance with IDL students."
      />
    </div>
  );
}
