import { ReactNode } from 'react';
import { Header } from '@/components/header';
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
    <Header></Header>
    <main className="flex-grow">
      {children}
    </main>
    </>
  );
}
