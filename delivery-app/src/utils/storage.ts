import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const removeData = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

export const clearAll = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const storeToken = async (token: string): Promise<boolean> => {
  return storeData('authToken', token);
};

export const getToken = async (): Promise<any> => {
  return getData('authToken');
};

export const removeToken = async (): Promise<boolean> => {
  return removeData('authToken');
};

export const storeUser = async (user: any): Promise<boolean> => {
  return storeData('userData', user);
};

export const getUser = async (): Promise<any> => {
  return getData('userData');
};

export const removeUser = async (): Promise<boolean> => {
  return removeData('userData');
};


export const storeDriverToken = async (token: string): Promise<boolean> => {
  return storeData('driverToken', token);
};

export const getDriverToken = async (): Promise<any> => {
  return getData('driverToken');
};

export const removeDriverToken = async (): Promise<boolean> => {
  return removeData('driverToken');
};

export const storeDriver = async (driver: any): Promise<boolean> => {
  return storeData('driverData', driver);
};

export const getDriver = async (): Promise<any> => {
  return getData('driverData');
};

export const removeDriver = async (): Promise<boolean> => {
  return removeData('driverData');
};