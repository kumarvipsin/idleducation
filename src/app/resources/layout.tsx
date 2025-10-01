import { ReactNode } from 'react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="bg-gray-100 dark:bg-gray-800 min-h-screen">{children}</div>;
}
