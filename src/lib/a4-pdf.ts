'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/** Builds a safe localStorage draft persistence helper for multi-step form previews. */
export function createDraftStorage<T extends { values: unknown }>(storageKey: string) {
  return {
    save(draft: T): void {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {
        // Ignore storage quota errors cleanly
      }
    },
    load(): T | null {
      if (typeof window === 'undefined') return null;
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as T;
        if (!parsed || typeof parsed !== 'object' || !parsed.values) return null;
        return parsed;
      } catch {
        return null;
      }
    },
    clear(): void {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Ignore storage removal errors
      }
    },
  };
}

/** Captures an A4 institutional preview node (794px wide) and downloads a portrait A4 PDF. */
export async function downloadElementAsA4Pdf(
  contentToCapture: HTMLElement | null,
  fileName: string,
  sheetSelector = '[data-a4-preview="true"]'
): Promise<boolean> {
  if (!contentToCapture) return false;

  const canvas = await html2canvas(contentToCapture, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    logging: false,
    windowWidth: 794,
    backgroundColor: '#ffffff',
    imageTimeout: 15000,
    removeContainer: true,
    onclone: (clonedDoc) => {
      const clonedSheet = clonedDoc.querySelector(sheetSelector) as HTMLElement | null;
      if (!clonedSheet) return;
      clonedSheet.style.transform = 'none';
      clonedSheet.style.boxShadow = 'none';
      clonedSheet.style.border = 'none';
      clonedSheet.style.backgroundColor = '#ffffff';
      const scaleBox = clonedSheet.parentElement;
      if (scaleBox) {
        scaleBox.style.width = '794px';
        scaleBox.style.height = 'auto';
        scaleBox.style.boxShadow = 'none';
      }
    },
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeightPx = Math.floor((canvas.width * pdfHeight) / pdfWidth);

  if (canvas.height <= pageHeightPx + 6) {
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight), '', 'FAST');
  } else {
    let offsetY = 0;
    let pageIndex = 0;
    while (offsetY < canvas.height) {
      const sliceHeightPx = Math.min(pageHeightPx, canvas.height - offsetY);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, offsetY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
      }
      if (pageIndex > 0) pdf.addPage('a4', 'portrait');
      const sliceHeightMm = (sliceHeightPx * pdfWidth) / canvas.width;
      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, sliceHeightMm, '', 'FAST');
      offsetY += sliceHeightPx;
      pageIndex += 1;
    }
  }

  pdf.save(fileName);
  return true;
}
