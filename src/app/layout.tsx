
import type { Metadata, Viewport } from 'next';
import { Inter, Dancing_Script, Josefin_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin-sans',
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
      <body className={`${inter.variable} ${dancingScript.variable} ${josefinSans.variable} font-sans antialiased flex flex-col min-h-screen bg-background`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
