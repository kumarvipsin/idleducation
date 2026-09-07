'use client';

import { BlogManager } from '@/components/blog-manager';

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <BlogManager role="admin" />
    </div>
  );
}
