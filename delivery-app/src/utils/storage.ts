const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const DRIVER_TOKEN_KEY = 'driverToken';
const DRIVER_KEY = 'driverData';
// Driver's dynamically-resolved business_id (from OTP verify response,
// NOT a hardcoded constant) — every delivery-app API call after login
// should read this instead of any fixed env var.
const DRIVER_BUSINESS_ID_KEY = 'driverBusinessId';

// Generic localStorage helpers (JSON-encoded values)
const storeData = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    return false;
  }
};

const getData = (key: string): any => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

const removeData = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

// Token functions (plain string, not JSON-encoded)
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Alias in case other files import the older async-flavored name
export const storeToken = setToken;

// User functions
export const setUser = (user: any): void => {
  storeData(USER_KEY, user);
};

export const getUser = (): any | null => {
  return getData(USER_KEY);
};

export const removeUser = (): void => {
  removeData(USER_KEY);
};

// Alias in case other files import the older async-flavored name
export const storeUser = setUser;

// Driver token functions
export const storeDriverToken = (token: string): boolean => {
  try {
    localStorage.setItem(DRIVER_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving driver token:', error);
    return false;
  }
};

export const getDriverToken = (): string | null => {
  try {
    return localStorage.getItem(DRIVER_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting driver token:', error);
    return null;
  }
};

export const removeDriverToken = (): boolean => {
  return removeData(DRIVER_TOKEN_KEY);
};

// Driver data functions
export const storeDriver = (driver: any): boolean => {
  return storeData(DRIVER_KEY, driver);
};

export const getDriver = (): any => {
  return getData(DRIVER_KEY);
};

export const removeDriver = (): boolean => {
  return removeData(DRIVER_KEY);
};

// ---- Driver business_id (dynamic, resolved at login — NOT hardcoded) ----
export const storeBusinessId = (businessId: number): boolean => {
  try {
    localStorage.setItem(DRIVER_BUSINESS_ID_KEY, String(businessId));
    return true;
  } catch (error) {
    console.error('Error saving business id:', error);
    return false;
  }
};

export const getBusinessId = (): number | null => {
  try {
    const raw = localStorage.getItem(DRIVER_BUSINESS_ID_KEY);
    return raw ? Number(raw) : null;
  } catch (error) {
    console.error('Error getting business id:', error);
    return null;
  }
};

export const removeBusinessId = (): boolean => {
  return removeData(DRIVER_BUSINESS_ID_KEY);
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};

// Clear all driver auth data (call this on driver logout)
export const clearDriverAuthData = (): void => {
  removeDriverToken();
  removeDriver();
  removeBusinessId();
};