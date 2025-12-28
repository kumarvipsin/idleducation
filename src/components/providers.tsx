
'use client';

import { AuthProvider } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/components/theme-provider';
import { AppContent } from '@/components/app-content';
import { CartProvider } from '@/context/cart-context';
import { StoreAuthProvider } from '@/context/store-auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StoreAuthProvider>
          <CartProvider>
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
          </CartProvider>
        </StoreAuthProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
