
import type { Metadata, Viewport } from 'next';
import { Josefin_Sans } from 'next/font/google';
import './globals.css';
import { AppContent } from '@/components/app-content';
import { AuthProvider } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/components/theme-provider';

const josefin_sans = Josefin_Sans({
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
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${josefin_sans.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <AppContent>
                {children}
              </AppContent>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
