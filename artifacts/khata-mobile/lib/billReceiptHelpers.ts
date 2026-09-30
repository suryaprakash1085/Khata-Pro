import { Alert, Platform, Share } from 'react-native';
import { jsPDF } from 'jspdf';

// ---------------------------------------------------------------------------
// Web-safe alert / confirm
// ---------------------------------------------------------------------------
// react-native-web does NOT implement Alert.alert — it silently no-ops in the
// browser. That's almost certainly why "Delete" looked broken: the confirm
// dialog it was waiting on never appeared, so the delete request never ran.
// These wrappers fall back to window.alert/window.confirm on web and use the
// real native Alert everywhere else.
// ---------------------------------------------------------------------------
export function notify(title: string, message?: string) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

export function confirmAsync(title: string, message?: string, confirmLabel = 'Confirm'): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

// ---------------------------------------------------------------------------
// Receipt data + PDF/share generation — single source of truth used by both
// the Billing List screen and the Customer Ledger receipt popup.
// ---------------------------------------------------------------------------
export interface ReceiptItem {
  name: string;
  qty: number;
  unit?: string;
  unitPrice: number;
}

export interface ReceiptBill {
  invoiceNumber: string;
  entryDate: string;
  customerName: string;
  customerPhone?: string;
  paymentMode: string;
  /** Structured line items — when present, the PDF renders a proper
   * Item/Qty/Price/Total table matching the on-screen receipt card. */
  items?: ReceiptItem[];
  /** Fallback plain-text item list, used only when `items` isn't available. */
  description?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  gstRate?: number;
  amount: number;
  paidAmount: number;
  balanceDue?: number;
}

export function paymentModeLabel(mode: string) {
  switch (mode) {
    case 'cash':
      return 'Cash';
    case 'upi':
      return 'UPI';
    case 'online':
      return 'Online';
    default:
      return mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '-';
  }
}

export function generateReceiptText(bill: ReceiptBill, businessName: string) {
  let text = '================================\n';
  text += `        ${businessName}\n`;
  text += '================================\n';
  text += `Invoice: ${bill.invoiceNumber}\n`;
  text += `Date: ${bill.entryDate}\n`;
  text += `Customer: ${bill.customerName}\n`;
  text += `Payment Mode: ${paymentModeLabel(bill.paymentMode)}\n`;
  text += '--------------------------------\n';
  if (bill.items && bill.items.length > 0) {
    bill.items.forEach((i) => {
      text += `${i.name} x${i.qty}${i.unit ? ` ${i.unit}` : ''} @ ${i.unitPrice.toFixed(2)} = ${(i.qty * i.unitPrice).toFixed(2)}\n`;
    });
  } else if (bill.description) {
    text += `${bill.description}\n`;
  }
  text += '--------------------------------\n';
  if (bill.subtotal != null) text += `Subtotal: Rs.${bill.subtotal.toFixed(2)}\n`;
  if (bill.discount) text += `Discount: -Rs.${bill.discount.toFixed(2)}\n`;
  if (bill.tax != null) text += `GST${bill.gstRate ? ` (${bill.gstRate.toFixed(1)}%)` : ''}: Rs.${bill.tax.toFixed(2)}\n`;
  text += `TOTAL: Rs.${bill.amount.toFixed(2)}\n`;
  text += `PAID:  Rs.${bill.paidAmount.toFixed(2)}\n`;
  if (bill.balanceDue) text += `BALANCE DUE: Rs.${bill.balanceDue.toFixed(2)}\n`;
  text += '================================\n';
  text += '      Thank you for your visit!\n';
  text += '================================\n';
  return text;
}

// Builds and downloads a real PDF receipt using jsPDF (web only). Renders an
// itemized table (Item / Qty / Price / Total) when `bill.items` is provided
// — matching the on-screen receipt card layout — and falls back to a plain
// description block otherwise.
export function downloadPdfReceipt(bill: ReceiptBill, businessName: string) {
  const pageWidth = 340;
  const marginX = 24;
  const itemCount = bill.items?.length ?? 0;
  // Rough height estimate so the page isn't awkwardly short/tall.
  const pageHeight = Math.max(460, 300 + itemCount * 16);

  const doc = new jsPDF({ unit: 'pt', format: [pageWidth, pageHeight] });
  let y = 34;

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text(businessName, pageWidth / 2, y, { align: 'center' });
  y += 18;

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(110);
  doc.text(`Invoice: ${bill.invoiceNumber}`, pageWidth / 2, y, { align: 'center' });
  y += 12;
  doc.text(bill.entryDate, pageWidth / 2, y, { align: 'center' });
  y += 14;
  doc.setTextColor(0);

  doc.setDrawColor(210);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 16;

  doc.setFontSize(8.5);
  doc.setTextColor(130);
  doc.text('CUSTOMER', marginX, y);
  y += 12;
  doc.setTextColor(0);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text(bill.customerName, marginX, y);
  y += 13;
  if (bill.customerPhone) {
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(110);
    doc.text(bill.customerPhone, marginX, y);
    doc.setTextColor(0);
    y += 12;
  }
  y += 4;

  doc.line(marginX, y, pageWidth - marginX, y);
  y += 16;

  // ---- Item table ----
  const qtyX = pageWidth - 172;
  const priceX = pageWidth - 108;
  const totalX = pageWidth - marginX;
  const itemMaxWidth = qtyX - marginX - 10;

  if (bill.items && bill.items.length > 0) {
    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 180);
    doc.text('ITEM', marginX, y);
    doc.text('QTY', qtyX, y, { align: 'center' });
    doc.text('PRICE', priceX, y, { align: 'right' });
    doc.text('TOTAL', totalX, y, { align: 'right' });
    doc.setTextColor(0);
    y += 6;
    doc.setDrawColor(230);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 14;

    doc.setFontSize(9.5);
    bill.items.forEach((item) => {
      doc.setFont('times', 'normal');
      const nameLines = doc.splitTextToSize(item.name, itemMaxWidth);
      doc.text(nameLines, marginX, y);
      doc.text(`${item.qty}${item.unit ? ` ${item.unit}` : ''}`, qtyX, y, { align: 'center' });
      doc.text(item.unitPrice.toFixed(2), priceX, y, { align: 'right' });
      doc.setFont('times', 'bold');
      doc.text((item.unitPrice * item.qty).toFixed(2), totalX, y, { align: 'right' });
      const lineHeight = Math.max(14, nameLines.length * 11 + 3);
      y += lineHeight;
      doc.setDrawColor(240);
      doc.line(marginX, y - 5, pageWidth - marginX, y - 5);
    });
    y += 4;
  } else if (bill.description) {
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const wrapped = doc.splitTextToSize(bill.description, pageWidth - marginX * 2);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 13 + 6;
  }

  doc.setDrawColor(210);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 18;

  const totalsRow = (label: string, value: string, opts: { bold?: boolean; big?: boolean; color?: [number, number, number] } = {}) => {
    doc.setFont('times', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(opts.big ? 13 : 10.5);
    if (opts.color) doc.setTextColor(...opts.color);
    doc.text(label, marginX, y);
    doc.text(value, pageWidth - marginX, y, { align: 'right' });
    doc.setTextColor(0);
    y += opts.big ? 20 : 16;
  };

  if (bill.subtotal != null) totalsRow('Subtotal', bill.subtotal.toFixed(2));
  if (bill.discount) totalsRow('Discount', `- ${bill.discount.toFixed(2)}`, { color: [22, 163, 74] });
  if (bill.tax != null) totalsRow(`GST${bill.gstRate ? ` (${bill.gstRate.toFixed(1)}%)` : ''}`, bill.tax.toFixed(2));

  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;
  totalsRow('TOTAL', `Rs.${bill.amount.toFixed(2)}`, { bold: true, big: true });

  doc.line(marginX, y, pageWidth - marginX, y);
  y += 18;

  totalsRow('Payment method', paymentModeLabel(bill.paymentMode));
  totalsRow('Paid', `Rs.${bill.paidAmount.toFixed(2)}`, { bold: true, color: [22, 163, 74] });
  if (bill.balanceDue && bill.balanceDue > 0.01) {
    totalsRow('Balance due', `Rs.${bill.balanceDue.toFixed(2)}`, { bold: true, color: [220, 38, 38] });
  }

  y += 10;
  doc.setFont('times', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(110);
  doc.text('Thank you for your visit!', pageWidth / 2, y, { align: 'center' });

  doc.save(`${bill.invoiceNumber}-receipt.pdf`);
}

// Web -> downloads a PDF. Native -> opens the share sheet with plain text.
export async function downloadReceipt(bill: ReceiptBill, businessName: string) {
  if (Platform.OS === 'web') {
    try {
      downloadPdfReceipt(bill, businessName);
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      notify('Could not generate receipt', 'Something went wrong building the PDF.');
    }
  } else {
    try {
      await Share.share({ message: generateReceiptText(bill, businessName), title: `Receipt ${bill.invoiceNumber}` });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  }
}

// ---------------------------------------------------------------------------
// WhatsApp deep link
// ---------------------------------------------------------------------------
// wa.me needs the number in international format with no leading zero/plus/
// spaces. Numbers typed into this app are bare 10-digit local numbers, so
// default to India (+91) when we see exactly 10 digits.
const DEFAULT_COUNTRY_CODE = '91';

export function buildWhatsAppUrl(rawPhone: string, message: string) {
  const digits = rawPhone.replace(/\D/g, '');
  const withCountryCode = digits.length === 10 ? `${DEFAULT_COUNTRY_CODE}${digits}` : digits;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}