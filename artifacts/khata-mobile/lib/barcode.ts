// Thin wrapper around jsbarcode's CODE128 auto-encoder. jsbarcode's encoder
// classes are pure JS (no DOM/canvas needed) — we only use them to get the
// raw bar pattern, then render bars ourselves with react-native-svg so this
// works identically on native and web.
// @ts-ignore - jsbarcode ships without type declarations for this subpath
import { CODE128 } from 'jsbarcode/bin/barcodes/CODE128';

export type BarcodeEncoding = {
  /** '1' = bar (black), '0' = space (white) */
  pattern: string;
  text: string;
};

export function encodeBarcode(value: string): BarcodeEncoding | null {
  const clean = (value || '').trim();
  if (!clean) return null;
  try {
    const encoder = new CODE128(clean, {});
    if (!encoder.valid()) return null;
    const result = encoder.encode();
    return { pattern: result.data, text: result.text };
  } catch (e) {
    console.warn('Barcode encoding failed:', e);
    return null;
  }
}