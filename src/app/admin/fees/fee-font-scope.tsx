'use client';

import { useEffect } from 'react';

interface FeeFontScopeProps {
  fontFamily: string;
  variableClass: string;
  interClass: string;
}

/**
 * FeeFontScope guarantees that ONLY the Fee Management Dashboard (and its
 * child portals, dialogs, selects, and sheets) uses the Inter font family.
 * When the user navigates away to any other page, previous styles are cleanly restored.
 */
export function FeeFontScope({ fontFamily, variableClass, interClass }: FeeFontScopeProps) {
  useEffect(() => {
    const prevFontFamily = document.body.style.fontFamily;
    const prevFontSans = document.body.style.getPropertyValue('--font-sans');

    // Scoped application to body so all modals/portals inherit Inter
    document.body.classList.add(variableClass);
    document.body.classList.add(interClass);
    document.body.classList.add('fee-management-font-inter');
    document.body.style.setProperty('--font-sans', `'Inter', ${fontFamily}, sans-serif`);
    document.body.style.fontFamily = `'Inter', ${fontFamily}, sans-serif`;

    return () => {
      // Revert completely when unmounted / navigated away
      document.body.classList.remove(variableClass);
      document.body.classList.remove(interClass);
      document.body.classList.remove('fee-management-font-inter');
      if (prevFontSans) {
        document.body.style.setProperty('--font-sans', prevFontSans);
      } else {
        document.body.style.removeProperty('--font-sans');
      }
      document.body.style.fontFamily = prevFontFamily;
    };
  }, [fontFamily, variableClass, interClass]);

  return null;
}

