'use client';

import { BlogManager } from '@/components/blog-manager';

export default function StudentBlogPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <BlogManager 
        role="student" 
        title="Student Community Articles"
        description="Publish your exam preparation journeys, notes summary, and learning tips."
      />
    </div>
  );
}
