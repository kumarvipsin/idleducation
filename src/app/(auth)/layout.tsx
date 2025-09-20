import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-muted/40">
      {children}
    </main>
  );
}
