// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // export const storeData = async (key: string, value: any): Promise<boolean> => {
// //   try {
// //     const jsonValue = JSON.stringify(value);
// //     await AsyncStorage.setItem(key, jsonValue);
// //     return true;
// //   } catch (error) {
// //     console.error('Error storing data:', error);
// //     return false;
// //   }
// // };

// // export const getData = async (key: string): Promise<any> => {
// //   try {
// //     const jsonValue = await AsyncStorage.getItem(key);
// //     return jsonValue != null ? JSON.parse(jsonValue) : null;
// //   } catch (error) {
// //     console.error('Error getting data:', error);
// //     return null;
// //   }
// // };

// // export const removeData = async (key: string): Promise<boolean> => {
// //   try {
// //     await AsyncStorage.removeItem(key);
// //     return true;
// //   } catch (error) {
// //     console.error('Error removing data:', error);
// //     return false;
// //   }
// // };

// // export const clearAll = async (): Promise<boolean> => {
// //   try {
// //     await AsyncStorage.clear();
// //     return true;
// //   } catch (error) {
// //     console.error('Error clearing data:', error);
// //     return false;
// //   }
// // };

// // export const storeToken = async (token: string): Promise<boolean> => {
// //   return storeData('authToken', token);
// // };

// // export const getToken = async (): Promise<any> => {
// //   return getData('authToken');
// // };

// // export const removeToken = async (): Promise<boolean> => {
// //   return removeData('authToken');
// // };

// // export const storeUser = async (user: any): Promise<boolean> => {
// //   return storeData('userData', user);
// // };

// // export const getUser = async (): Promise<any> => {
// //   return getData('userData');
// // };

// // export const removeUser = async (): Promise<boolean> => {
// //   return removeData('userData');
// // };
// const TOKEN_KEY = 'auth_token';
// const USER_KEY = 'auth_user';

// // Token functions
// export const setToken = (token: string): void => {
//   try {
//     localStorage.setItem(TOKEN_KEY, token);
//   } catch (error) {
//     console.error('Error saving token:', error);
//   }
// };

// export const getToken = (): string | null => {
//   try {
//     return localStorage.getItem(TOKEN_KEY);
//   } catch (error) {
//     console.error('Error getting token:', error);
//     return null;
//   }
// };

// export const removeToken = (): void => {
//   try {
//     localStorage.removeItem(TOKEN_KEY);
//   } catch (error) {
//     console.error('Error removing token:', error);
//   }
// };

// // User functions
// export const setUser = (user: any): void => {
//   try {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//   } catch (error) {
//     console.error('Error saving user:', error);
//   }
// };

// export const getUser = (): any | null => {
//   try {
//     const userStr = localStorage.getItem(USER_KEY);
//     return userStr ? JSON.parse(userStr) : null;
//   } catch (error) {
//     console.error('Error getting user:', error);
//     return null;
//   }
// };

// export const removeUser = (): void => {
//   try {
//     localStorage.removeItem(USER_KEY);
//   } catch (error) {
//     console.error('Error removing user:', error);
//   }
// };


// export const removeToken = async (): Promise<boolean> => {
//   return removeData('authToken');
// };

// export const storeUser = async (user: any): Promise<boolean> => {
//   return storeData('userData', user);
// };

// export const getUser = async (): Promise<any> => {
//   return getData('userData');
// };

// export const removeUser = async (): Promise<boolean> => {
//   return removeData('userData');
// };


// export const storeDriverToken = async (token: string): Promise<boolean> => {
//   return storeData('driverToken', token);
// };

// export const getDriverToken = async (): Promise<any> => {
//   return getData('driverToken');
// };

// export const removeDriverToken = async (): Promise<boolean> => {
//   return removeData('driverToken');
// };

// export const storeDriver = async (driver: any): Promise<boolean> => {
//   return storeData('driverData', driver);
// };

// export const getDriver = async (): Promise<any> => {
//   return getData('driverData');
// };

// export const removeDriver = async (): Promise<boolean> => {
//   return removeData('driverData');

// // Clear all auth data
// export const clearAuthData = (): void => {
//   removeToken();
//   removeUser();
// };

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const DRIVER_TOKEN_KEY = 'driverToken';
const DRIVER_KEY = 'driverData';

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

// Clear all auth data
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
};