
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/language-context';
import { ChatBot } from '@/components/chat-bot';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'IDL EDUCATION',
  description: 'An interactive educational platform for students and teachers.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
              <ChatBot />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
