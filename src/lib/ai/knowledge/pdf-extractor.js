/**
 * Standalone Node.js worker to extract text from PDF files.
 * This runs in a pure Node process to bypass Next.js / Turbopack bundling issues with pdfjs-dist workers.
 */
const fs = require('fs');
const path = require('path');

async function extract() {
  const filePath = process.argv[2];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(JSON.stringify({ error: `File not found: ${filePath}` }));
    process.exit(1);
  }

  try {
    const { PDFParse } = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    const res = await parser.getText();
    const text = typeof res === 'string' ? res : (res?.text || '');
    if (typeof parser.destroy === 'function') {
      await parser.destroy();
    }
    console.log(JSON.stringify({ text }));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message || String(err) }));
    process.exit(1);
  }
}

extract();
