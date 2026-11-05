import { useCallback, useState } from 'react';

export type VendorFormValues = {
  name: string;
  companyName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  panNumber: string;
  openingBalance: string;
  openingBalanceType: 'payable' | 'receivable';
  paymentTermsDays: number;
};

export type VendorFormErrors = Partial<Record<keyof VendorFormValues, string>>;

export const EMPTY_VENDOR_FORM: VendorFormValues = {
  name: '',
  companyName: '',
  phone: '',
  alternatePhone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  gstNumber: '',
  panNumber: '',
  openingBalance: '',
  openingBalanceType: 'payable',
  paymentTermsDays: 0,
};

const ALL_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];
// Tamil Nadu first, since most vendors are local
export const INDIAN_STATES = ['Tamil Nadu', ...ALL_STATES.filter((s) => s !== 'Tamil Nadu')];

// First two digits of a GSTIN = state code
export const GST_STATE_CODES: Record<string, string> = {
  '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
  '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
  '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur',
  '15': 'Mizoram', '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
  '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu', '27': 'Maharashtra', '29': 'Karnataka', '30': 'Goa',
  '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu', '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands', '36': 'Telangana', '37': 'Andhra Pradesh', '38': 'Ladakh',
};

export const PAYMENT_TERMS_OPTIONS: { label: string; days: number }[] = [
  { label: 'Cash', days: 0 },
  { label: '7 days', days: 7 },
  { label: '15 days', days: 15 },
  { label: '30 days', days: 30 },
  { label: '45 days', days: 45 },
  { label: '60 days', days: 60 },
];

// Same rules as the backend (api-server/src/routes/vendors.ts)
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const PINCODE_RE = /^[1-9][0-9]{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const digitsOf = (s: string) => s.replace(/\D/g, '');

export function validateVendorForm(v: VendorFormValues, opts: { requirePhone?: boolean } = {}): VendorFormErrors {
  const e: VendorFormErrors = {};
  if (v.name.trim().length < 2) e.name = 'Enter the vendor name';

  if (opts.requirePhone && !v.phone.trim()) e.phone = 'Enter a phone number';
  else if (v.phone.trim() && digitsOf(v.phone).length < 10) e.phone = 'Enter a valid phone number';

  if (v.alternatePhone.trim() && digitsOf(v.alternatePhone).length < 10) {
    e.alternatePhone = 'Enter a valid phone number';
  }
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address';
  if (v.gstNumber && !GSTIN_RE.test(v.gstNumber)) e.gstNumber = 'GSTIN must be 15 characters, e.g. 33ABCDE1234F1Z5';
  if (v.panNumber && !PAN_RE.test(v.panNumber)) e.panNumber = 'PAN format: ABCDE1234F';
  if (v.pincode && !PINCODE_RE.test(v.pincode)) e.pincode = 'Pincode must be 6 digits';
  if (v.openingBalance.trim() && (isNaN(Number(v.openingBalance)) || Number(v.openingBalance) < 0)) {
    e.openingBalance = 'Enter a valid amount';
  }
  return e;
}

export function buildVendorPayload(v: VendorFormValues, businessId: number) {
  const opt = (s: string) => (s.trim() ? s.trim() : undefined);
  const phone = (s: string) => (s.trim() ? s.replace(/[\s-]/g, '') : undefined); // "98765 43210" -> "9876543210"
  return {
    business_id: businessId,
    name: v.name.trim(),
    company_name: opt(v.companyName),
    phone: phone(v.phone),
    alternate_phone: phone(v.alternatePhone),
    email: opt(v.email),
    address: opt(v.address),
    city: opt(v.city),
    state: opt(v.state),
    pincode: opt(v.pincode),
    gst_number: opt(v.gstNumber)?.toUpperCase(),
    pan_number: opt(v.panNumber)?.toUpperCase(),
    opening_balance: parseFloat(v.openingBalance) || 0,
    opening_balance_type: v.openingBalanceType,
    payment_terms_days: v.paymentTermsDays,
  };
}

const API_FIELD_MAP: Record<string, keyof VendorFormValues> = {
  phone: 'phone',
  gst_number: 'gstNumber',
};

// Reads the backend's { error, field } body (400 / 409) out of whatever the fetch layer throws
export function getApiErrorInfo(err: any): { message: string; field?: keyof VendorFormValues } {
  const data = err?.data ?? err?.response?.data;
  const message =
    (typeof data?.error === 'string' && data.error) ||
    (typeof data?.message === 'string' && data.message) ||
    'Could not save vendor. Please try again.';
  const field = typeof data?.field === 'string' ? API_FIELD_MAP[data.field] : undefined;
  return { message, field };
}

export function useVendorForm() {
  const [values, setValues] = useState<VendorFormValues>(EMPTY_VENDOR_FORM);
  const [errors, setErrors] = useState<VendorFormErrors>({});

  // Updates fields and clears the error of any field being edited
  const onChange = useCallback((patch: Partial<VendorFormValues>) => {
    setValues((p) => ({ ...p, ...patch }));
    setErrors((p) => {
      const n = { ...p };
      (Object.keys(patch) as (keyof VendorFormValues)[]).forEach((k) => delete n[k]);
      return n;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(EMPTY_VENDOR_FORM);
    setErrors({});
  }, []);

  return { values, errors, setErrors, onChange, reset };
}