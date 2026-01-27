
import type { Metadata, Viewport } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const josefin_sans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'IDL EDUCATION',
  description: 'An interactive educational platform for students and teachers.',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${josefin_sans.variable} font-sans font-bold antialiased flex flex-col min-h-screen bg-background`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
