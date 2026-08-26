
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';   // matches what AuthContext.tsx already writes
const USER_KEY = 'userData';     // matches what AuthContext.tsx already writes
const DRIVER_TOKEN_KEY = 'driverToken';
const DRIVER_KEY = 'driverData';
const DRIVER_BUSINESS_ID_KEY = 'driverBusinessId';

const storeData = async (key: string, value: any): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    return false;
  }
};

const getData = async (key: string): Promise<any> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

const removeData = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    return false;
  }
};

// Token functions (plain string, not JSON-encoded)
export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const storeToken = setToken;

// User functions
export const setUser = async (user: any): Promise<boolean> => storeData(USER_KEY, user);
export const getUser = async (): Promise<any | null> => getData(USER_KEY);
export const removeUser = async (): Promise<boolean> => removeData(USER_KEY);
export const storeUser = setUser;

// Driver token functions
export const storeDriverToken = async (token: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(DRIVER_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving driver token:', error);
    return false;
  }
};
export const getDriverToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(DRIVER_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting driver token:', error);
    return null;
  }
};
export const removeDriverToken = async (): Promise<boolean> => removeData(DRIVER_TOKEN_KEY);

// Driver data functions
export const storeDriver = async (driver: any): Promise<boolean> => storeData(DRIVER_KEY, driver);
export const getDriver = async (): Promise<any> => getData(DRIVER_KEY);
export const removeDriver = async (): Promise<boolean> => removeData(DRIVER_KEY);

// Driver business_id
export const storeBusinessId = async (businessId: number): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(DRIVER_BUSINESS_ID_KEY, String(businessId));
    return true;
  } catch (error) {
    console.error('Error saving business id:', error);
    return false;
  }
};
export const getBusinessId = async (): Promise<number | null> => {
  try {
    const raw = await AsyncStorage.getItem(DRIVER_BUSINESS_ID_KEY);
    return raw ? Number(raw) : null;
  } catch (error) {
    console.error('Error getting business id:', error);
    return null;
  }
};
export const removeBusinessId = async (): Promise<boolean> => removeData(DRIVER_BUSINESS_ID_KEY);

// Clear all auth data
export const clearAuthData = async (): Promise<void> => {
  await removeToken();
  await removeUser();
};

export const clearDriverAuthData = async (): Promise<void> => {
  await removeDriverToken();
  await removeDriver();
  await removeBusinessId();
};