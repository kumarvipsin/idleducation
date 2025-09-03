
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileBottomNavProps {
  links: NavLink[];
}

export function MobileBottomNav({ links }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-full transition-colors group-hover:bg-primary/10",
                isActive ? "bg-primary/10" : ""
              )}>
                {icon}
              </div>
              <span className={cn(
                "text-xs mt-1 transition-colors",
                isActive ? "font-semibold" : ""
              )}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
