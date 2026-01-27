
import { ReactNode } from 'react';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="relative z-10">
            {children}
        </div>
    </div>
  );
}
