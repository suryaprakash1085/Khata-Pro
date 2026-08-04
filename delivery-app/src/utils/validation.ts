/**
 * Validation utilities for QuickBite application
 * Contains validation functions for various input fields
 */

/**
 * Validate email address
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Validate phone number (10 digits for India)
 * @param phone - Phone number string to validate
 * @returns boolean indicating if phone is valid
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.trim());
};

/**
 * Validate password (minimum 6 characters)
 * @param password - Password string to validate
 * @returns boolean indicating if password is valid
 */
export const validatePassword = (password: string): boolean => {
  if (!password) return false;
  return password.trim().length >= 6;
};

/**
 * Validate password strength (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
 * @param password - Password string to validate
 * @returns boolean indicating if password is strong
 */
export const validateStrongPassword = (password: string): boolean => {
  if (!password) return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Validate name (minimum 2 characters)
 * @param name - Name string to validate
 * @returns boolean indicating if name is valid
 */
export const validateName = (name: string): boolean => {
  if (!name) return false;
  return name.trim().length >= 2;
};

/**
 * Validate full name (minimum 2 words)
 * @param name - Full name string to validate
 * @returns boolean indicating if full name is valid
 */
export const validateFullName = (name: string): boolean => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.split(' ').length >= 2;
};

/**
 * Validate address (minimum 10 characters)
 * @param address - Address string to validate
 * @returns boolean indicating if address is valid
 */
export const validateAddress = (address: string): boolean => {
  if (!address) return false;
  return address.trim().length >= 10;
};

/**
 * Validate pincode (6 digits for India)
 * @param pincode - Pincode string to validate
 * @returns boolean indicating if pincode is valid
 */
export const validatePincode = (pincode: string): boolean => {
  if (!pincode) return false;
  const regex = /^[0-9]{6}$/;
  return regex.test(pincode.trim());
};

/**
 * Validate card number (16 digits)
 * @param cardNumber - Card number string to validate
 * @returns boolean indicating if card number is valid
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  if (!cardNumber) return false;
  const cleaned = cardNumber.replace(/\s/g, '');
  const regex = /^[0-9]{16}$/;
  return regex.test(cleaned);
};

/**
 * Validate CVV (3-4 digits)
 * @param cvv - CVV string to validate
 * @returns boolean indicating if CVV is valid
 */
export const validateCVV = (cvv: string): boolean => {
  if (!cvv) return false;
  const regex = /^[0-9]{3,4}$/;
  return regex.test(cvv.trim());
};

/**
 * Validate expiry date (MM/YY format)
 * @param expiry - Expiry date string to validate
 * @returns boolean indicating if expiry date is valid
 */
export const validateExpiryDate = (expiry: string): boolean => {
  if (!expiry) return false;
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(expiry.trim())) return false;
  
  const [month, year] = expiry.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  
  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;
  if (yearNum > currentYear + 10) return false;
  
  return true;
};

/**
 * Validate amount (positive number)
 * @param amount - Amount to validate
 * @returns boolean indicating if amount is valid
 */
export const validateAmount = (amount: number): boolean => {
  if (amount === undefined || amount === null) return false;
  return amount > 0 && isFinite(amount);
};

/**
 * Validate OTP (6 digits)
 * @param otp - OTP string to validate
 * @returns boolean indicating if OTP is valid
 */
export const validateOTP = (otp: string): boolean => {
  if (!otp) return false;
  const regex = /^[0-9]{6}$/;
  return regex.test(otp.trim());
};

/**
 * Validate URL
 * @param url - URL string to validate
 * @returns boolean indicating if URL is valid
 */
export const validateUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate rating (1-5)
 * @param rating - Rating number to validate
 * @returns boolean indicating if rating is valid
 */
export const validateRating = (rating: number): boolean => {
  if (rating === undefined || rating === null) return false;
  return rating >= 1 && rating <= 5;
};

/**
 * Validate search query (minimum 1 character)
 * @param query - Search query string to validate
 * @returns boolean indicating if query is valid
 */
export const validateSearchQuery = (query: string): boolean => {
  if (!query) return false;
  return query.trim().length >= 1;
};

/**
 * Validate promo code (minimum 4 characters, alphanumeric)
 * @param code - Promo code string to validate
 * @returns boolean indicating if promo code is valid
 */
export const validatePromoCode = (code: string): boolean => {
  if (!code) return false;
  const regex = /^[A-Z0-9]{4,20}$/;
  return regex.test(code.trim().toUpperCase());
};

/**
 * Validate special instructions (maximum 200 characters)
 * @param instructions - Instructions string to validate
 * @returns boolean indicating if instructions are valid
 */
export const validateInstructions = (instructions: string): boolean => {
  if (!instructions) return true; // Optional field
  return instructions.trim().length <= 200;
};

/**
 * Get validation error message for email
 */
export const getEmailErrorMessage = (email: string): string => {
  if (!email) return 'Email is required';
  if (!validateEmail(email)) return 'Please enter a valid email address';
  return '';
};

/**
 * Get validation error message for phone
 */
export const getPhoneErrorMessage = (phone: string): string => {
  if (!phone) return 'Phone number is required';
  if (!validatePhone(phone)) return 'Please enter a valid 10-digit phone number';
  return '';
};

/**
 * Get validation error message for password
 */
export const getPasswordErrorMessage = (password: string): string => {
  if (!password) return 'Password is required';
  if (!validatePassword(password)) return 'Password must be at least 6 characters';
  return '';
};

/**
 * Get validation error message for name
 */
export const getNameErrorMessage = (name: string): string => {
  if (!name) return 'Name is required';
  if (!validateName(name)) return 'Name must be at least 2 characters';
  return '';
};

/**
 * Get validation error message for address
 */
export const getAddressErrorMessage = (address: string): string => {
  if (!address) return 'Address is required';
  if (!validateAddress(address)) return 'Please enter a complete address';
  return '';
};

/**
 * Get validation error message for pincode
 */
export const getPincodeErrorMessage = (pincode: string): string => {
  if (!pincode) return 'Pincode is required';
  if (!validatePincode(pincode)) return 'Please enter a valid 6-digit pincode';
  return '';
};

/**
 * Get validation error message for card number
 */
export const getCardNumberErrorMessage = (cardNumber: string): string => {
  if (!cardNumber) return 'Card number is required';
  if (!validateCardNumber(cardNumber)) return 'Please enter a valid 16-digit card number';
  return '';
};

/**
 * Get validation error message for CVV
 */
export const getCVVErrorMessage = (cvv: string): string => {
  if (!cvv) return 'CVV is required';
  if (!validateCVV(cvv)) return 'Please enter a valid 3-4 digit CVV';
  return '';
};

/**
 * Get validation error message for expiry date
 */
export const getExpiryErrorMessage = (expiry: string): string => {
  if (!expiry) return 'Expiry date is required';
  if (!validateExpiryDate(expiry)) return 'Please enter a valid expiry date (MM/YY)';
  return '';
};

/**
 * Get validation error message for OTP
 */
export const getOTPErrorMessage = (otp: string): string => {
  if (!otp) return 'OTP is required';
  if (!validateOTP(otp)) return 'Please enter a valid 6-digit OTP';
  return '';
};

/**
 * Get validation error message for promo code
 */
export const getPromoCodeErrorMessage = (code: string): string => {
  if (!code) return 'Promo code is required';
  if (!validatePromoCode(code)) return 'Please enter a valid promo code';
  return '';
};

/**
 * Validate entire form with multiple fields
 * @param fields - Object containing field validators and values
 * @returns Object with validation results
 */
export const validateForm = <T extends Record<string, any>>(
  fields: {
    [K in keyof T]: {
      value: T[K];
      validator: (value: T[K]) => boolean;
      message: string;
    };
  }
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const [key, field] of Object.entries(fields)) {
    if (!field.validator(field.value)) {
      errors[key as keyof T] = field.message;
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Validation rules object for common form fields
 */
export const validationRules = {
  email: {
    required: (value: string) => !!value,
    pattern: (value: string) => validateEmail(value),
    minLength: (value: string) => value.length >= 5,
    maxLength: (value: string) => value.length <= 100,
  },
  phone: {
    required: (value: string) => !!value,
    pattern: (value: string) => validatePhone(value),
    minLength: (value: string) => value.length === 10,
    maxLength: (value: string) => value.length === 10,
  },
  password: {
    required: (value: string) => !!value,
    minLength: (value: string) => value.length >= 6,
    pattern: (value: string) => validateStrongPassword(value),
  },
  name: {
    required: (value: string) => !!value,
    minLength: (value: string) => value.length >= 2,
    maxLength: (value: string) => value.length <= 50,
  },
  address: {
    required: (value: string) => !!value,
    minLength: (value: string) => value.length >= 10,
    maxLength: (value: string) => value.length <= 200,
  },
  pincode: {
    required: (value: string) => !!value,
    pattern: (value: string) => validatePincode(value),
    minLength: (value: string) => value.length === 6,
    maxLength: (value: string) => value.length === 6,
  },
};

/**
 * Password strength checker
 * @param password - Password to check
 * @returns Object with score and feedback
 */
export const checkPasswordStrength = (password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  feedback: string[];
} => {
  if (!password) {
    return { score: 0, label: 'Very Weak', feedback: ['Password is required'] };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  // Uppercase check
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('At least one uppercase letter');

  // Lowercase check
  if (/[a-z]/.test(password)) score++;
  else feedback.push('At least one lowercase letter');

  // Number check
  if (/\d/.test(password)) score++;
  else feedback.push('At least one number');

  // Special character check
  if (/[@$!%*?&]/.test(password)) score++;
  else feedback.push('At least one special character (@$!%*?&)');

  const labels: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'] = [
    'Very Weak',
    'Weak',
    'Medium',
    'Strong',
    'Very Strong',
  ];

  return {
    score: score as 0 | 1 | 2 | 3 | 4,
    label: labels[score],
    feedback,
  };
};

/**
 * Sanitize input string to prevent XSS
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

/**
 * Validate and sanitize form data
 * @param data - Form data object
 * @returns Sanitized form data
 */
export const sanitizeFormData = <T extends Record<string, any>>(
  data: T
): T => {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Check if field is empty
 * @param value - Value to check
 * @returns boolean indicating if empty
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if value is a valid number
 * @param value - Value to check
 * @returns boolean indicating if valid number
 */
export const isValidNumber = (value: any): boolean => {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
};

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSize - Maximum size in MB
 * @returns boolean indicating if size is valid
 */
export const validateFileSize = (size: number, maxSize: number = 5): boolean => {
  return size <= maxSize * 1024 * 1024;
};

/**
 * Validate file type
 * @param mimeType - File MIME type
 * @param allowedTypes - Array of allowed MIME types
 * @returns boolean indicating if type is valid
 */
export const validateFileType = (mimeType: string, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif']): boolean => {
  return allowedTypes.includes(mimeType);
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateStrongPassword,
  validateName,
  validateFullName,
  validateAddress,
  validatePincode,
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateAmount,
  validateOTP,
  validateUrl,
  validateRating,
  validateSearchQuery,
  validatePromoCode,
  validateInstructions,
  getEmailErrorMessage,
  getPhoneErrorMessage,
  getPasswordErrorMessage,
  getNameErrorMessage,
  getAddressErrorMessage,
  getPincodeErrorMessage,
  getCardNumberErrorMessage,
  getCVVErrorMessage,
  getExpiryErrorMessage,
  getOTPErrorMessage,
  getPromoCodeErrorMessage,
  validateForm,
  validationRules,
  checkPasswordStrength,
  sanitizeInput,
  sanitizeFormData,
  isEmpty,
  isValidNumber,
  validateFileSize,
  validateFileType,
};