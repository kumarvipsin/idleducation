
import { ReactNode } from 'react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full bg-white dark:bg-background">
        <div className="relative z-10">
            {children}
        </div>
    </div>
  );
}
