import { ReactNode } from 'react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="py-12 px-4 md:px-[10%] bg-gray-100 dark:bg-gray-800">{children}</div>;
}
