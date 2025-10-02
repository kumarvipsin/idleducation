import { Home } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-12">
            {children}
        </div>
    </div>
  );
}
