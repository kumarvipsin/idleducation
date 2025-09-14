import { ReactNode } from 'react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="py-12 px-4 md:px-6 lg:container lg:mx-auto">{children}</div>;
}
