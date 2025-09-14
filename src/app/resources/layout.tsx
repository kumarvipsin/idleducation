import { ReactNode } from 'react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto py-12 px-4 md:px-6" style={{ maxWidth: '79%' }}>{children}</div>;
}
