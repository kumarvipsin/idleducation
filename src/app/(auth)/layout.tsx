import { ReactNode } from 'react';
import { Header } from '@/components/header';
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
    <Header></Header>
    <main className="flex flex-col flex-grow items-center justify-center bg-muted/40">
      {children}
    </main>
    </>
  );
}
