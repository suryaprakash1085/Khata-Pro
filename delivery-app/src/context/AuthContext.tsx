// // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // TODO: replace with your api-server's actual base URL
// // const API_BASE_URL = 'http://localhost:3000';

// // // TODO: confirm this against: select id, name from businesses where name ilike '%green cart%';
// // const GREEN_CART_BUSINESS_ID = 8;

// // interface User {
// //   id: number;
// //   name: string;
// //   phone: string;
// //   email: string | null;
// //     address?: string; 
// //   business_id?: number;
// //   business_name?: string;
// //   business_plan?: string;
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   loading: boolean;
// //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// //   login: (phone: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// //   // logout: () => void;
// //   // updateUser: (userData: User) => Promise<boolean>;
// //   logout: () => Promise<void>;
// //   updateUser: (userData: Partial<User>) => Promise<boolean>;
// //   checkAuth: () => Promise<void>;
// //   refreshUser: () => Promise<void>;
// // }

// // export const AuthContext = createContext<AuthContextType>({
// //   user: null,
// //   loading: true,
// //   signup: async () => ({ success: false, message: '' }),
// //   login: async () => ({ success: false, message: '' }),
// //   // logout: () => {},
// //    logout: async () => {},
// //   updateUser: async () => false,
// //   checkAuth: async () => {},
// //   refreshUser: async () => {},
// // });

// // interface AuthProviderProps {
// //   children: ReactNode;
// // }

// // // Simple in-memory token holder — swap for AsyncStorage persistence below
// // // let authToken: string | null = null;

// // // async function apiRequest(path: string, body: any) {
// // //   const res = await fetch(`${API_BASE_URL}${path}`, {
// // //     method: 'POST',
// // //     headers: { 'Content-Type': 'application/json' },
// // //     body: JSON.stringify(body),
// // //   });
// // //   const json = await res.json();
// // //   if (!res.ok) {
// // //     throw new Error(json.error || 'Request failed');
// // //   }
// // //   return json;
// // // }
// // // Token management
// // let authToken: string | null = null;

// // // Helper: Get auth headers
// // const getAuthHeaders = () => {
// //   const headers: Record<string, string> = {
// //     'Content-Type': 'application/json',
// //   };
// //   if (authToken) {
// //     headers['Authorization'] = `Bearer ${authToken}`;
// //   }
// //   return headers;
// // };

// // // API request with auth support for different methods
// // async function apiRequestWithAuth(path: string, body: any, method: string = 'POST') {
// //   const options: RequestInit = {
// //     method,
// //     headers: getAuthHeaders(),
// //   };
  
// //   if (method !== 'GET') {
// //     options.body = JSON.stringify(body);
// //   }
  
// //   const res = await fetch(`${API_BASE_URL}${path}`, options);
// //   const json = await res.json();
// //   if (!res.ok) {
// //     throw new Error(json.error || 'Request failed');
// //   }
// //   return json;
// // }

// // // API request without auth (for login/signup)
// // async function apiRequestWithoutAuth(path: string, body: any) {
// //   const res = await fetch(`${API_BASE_URL}${path}`, {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body: JSON.stringify(body),
// //   });
// //   const json = await res.json();
// //   if (!res.ok) {
// //     throw new Error(json.error || 'Request failed');
// //   }
// //   return json;
// // }
// // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);

// //   useEffect(() => {
// //     checkAuth();
// //   }, []);

// //   const checkAuth = async () => {
// //     try {
// //       setLoading(true);
// //       // TODO: load persisted token from AsyncStorage here and call /customer-auth/me
// //       // to restore session on app start

// //        const token = await AsyncStorage.getItem('authToken');
// //     const userData = await AsyncStorage.getItem('userData');
    
// //     if (token && userData) {
// //       authToken = token;
// //       setUser(JSON.parse(userData));
// //     }
// //     } catch (error) {
// //       console.error('Check auth error:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// //   //   try {
// //   //     setLoading(true);

// //   //     if (data.password.length < 6) {
// //   //       return { success: false, message: 'Password must be at least 6 characters' };
// //   //     }

// //   //     const result = await apiRequest('/customer-auth/signup', {
// //   //       businessId: GREEN_CART_BUSINESS_ID,
// //   //       name: data.name,
// //   //       phone: data.phone,
// //   //       email: data.email,
// //   //       password: data.password,
// //   //     });

// //   //     authToken = result.token;
// //   //     // TODO: persist authToken to AsyncStorage here

// //   //     const userWithBusiness: User = {
// //   //       id: result.customer.id,
// //   //       name: result.customer.name,
// //   //       phone: result.customer.phone,
// //   //       email: result.customer.email,
// //   //       business_id: result.customer.business_id,
// //   //       business_name: 'The Green Cart',
// //   //       business_plan: 'FREE',
// //   //     };

// //   //     setUser(userWithBusiness);
// //   //     return { success: true, message: 'Account created successfully!', user: userWithBusiness };

// //   //   } catch (error: any) {
// //   //     console.error('Signup error:', error);
// //   //     return { success: false, message: error.message || 'Something went wrong' };
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };
// // const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// //   try {
// //     setLoading(true);

// //     if (data.password.length < 6) {
// //       return { success: false, message: 'Password must be at least 6 characters' };
// //     }

// //     const result = await apiRequestWithoutAuth('/customer-auth/signup', {
// //       businessId: GREEN_CART_BUSINESS_ID,
// //       name: data.name,
// //       phone: data.phone,
// //       email: data.email,
// //       password: data.password,
// //     });

// //     authToken = result.token;
// //     await AsyncStorage.setItem('authToken', result.token);

// //     const userWithBusiness: User = {
// //       id: result.customer.id,
// //       name: result.customer.name,
// //       phone: result.customer.phone,
// //       email: result.customer.email,
// //       business_id: result.customer.business_id,
// //       business_name: 'The Green Cart',
// //       business_plan: 'FREE',
// //     };

// //     setUser(userWithBusiness);
// //     await AsyncStorage.setItem('userData', JSON.stringify(userWithBusiness));
    
// //     return { success: true, message: 'Account created successfully!', user: userWithBusiness };

// //   } catch (error: any) {
// //     console.error('Signup error:', error);
// //     return { success: false, message: error.message || 'Something went wrong' };
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //   // const login = async (phone: string, password: string) => {
// //   //   try {
// //   //     setLoading(true);

// //   //     const result = await apiRequest('/customer-auth/login', { phone, password });

// //   //     authToken = result.token;
// //   //     // TODO: persist authToken to AsyncStorage here

// //   //     const userWithBusiness: User = {
// //   //       id: result.customer.id,
// //   //       name: result.customer.name,
// //   //       phone: result.customer.phone,
// //   //       email: result.customer.email,
// //   //       business_id: result.customer.business_id,
// //   //       business_name: 'The Green Cart',
// //   //       business_plan: 'FREE',
// //   //     };

// //   //     setUser(userWithBusiness);
// //   //     return { success: true, message: 'Logged in successfully!', user: userWithBusiness };

// //   //   } catch (error: any) {
// //   //     console.error('Login error:', error);
// //   //     return { success: false, message: error.message || 'Login failed' };
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };
// // const login = async (phone: string, password: string) => {
// //   try {
// //     setLoading(true);

// //     const result = await apiRequestWithoutAuth('/customer-auth/login', { phone, password });

// //     authToken = result.token;
// //     await AsyncStorage.setItem('authToken', result.token);

// //     // const userWithBusiness: User = {
// //     //   id: result.customer.id,
// //     //   name: result.customer.name,
// //     //   phone: result.customer.phone,
// //     //   email: result.customer.email,
// //     //   business_id: result.customer.business_id,
// //     //   business_name: 'The Green Cart',
// //     //   business_plan: 'FREE',
// //     // };
// // const userWithBusiness: User = {
// //   id: result.customer.id,
// //   name: result.customer.name,
// //   phone: result.customer.phone,
// //   email: result.customer.email,
// //   business_id: result.customer.business_id,
// //   business_name: result.customer.business_name || result.business?.business_name || 'Unknown Store',
// //   business_plan: result.customer.business_plan || result.business?.plan || 'FREE',
// // };
// //     setUser(userWithBusiness);
// //     await AsyncStorage.setItem('userData', JSON.stringify(userWithBusiness));
    
// //     return { success: true, message: 'Logged in successfully!', user: userWithBusiness };

// //   } catch (error: any) {
// //     console.error('Login error:', error);
// //     return { success: false, message: error.message || 'Login failed' };
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //   const refreshUser = async () => {
// //     // Business is fixed (Green Cart) for now — nothing to refresh from a "latest business" lookup anymore
// //   };

// //   // const logout = () => {
// //   const logout = async () => {
// //     authToken = null;
// //     // TODO: clear AsyncStorage token here
// //     await AsyncStorage.removeItem('authToken');
// //   await AsyncStorage.removeItem('userData');
// //     setUser(null);
// //   };

// //   // const updateUser = async (userData: User): Promise<boolean> => {
// //   //   try {
// //   //     setUser(userData);
// //   //     return true;
// //   //   } catch (error) {
// //   //     console.error('Update user error:', error);
// //   //     return false;
// //   //   }
// //   // };
// // // const updateUser = async (userData: Partial<User>): Promise<boolean> => {
// // //   try {
// // //     setLoading(true);

// // //     if (!user) {
// // //       console.error('No user logged in');
// // //       return false;
// // //     }

// // //     // Prepare update data - only send fields that are provided
// // //     const updatePayload: any = {};
// // //     if (userData.name !== undefined) updatePayload.name = userData.name;
// // //     if (userData.email !== undefined) updatePayload.email = userData.email;
// // //     if (userData.phone !== undefined) updatePayload.phone = userData.phone;

// // //     // Make PUT request to update customer
// // //     const result = await apiRequestWithAuth(
// // //       `/customers/${user.id}`,
// // //       updatePayload,
// // //       'PUT'
// // //     );

// // //     // Format the response to match your user structure
// // //     const updatedUser: User = {
// // //       id: result.id,
// // //       name: result.name,
// // //       phone: result.phone,
// // //       email: result.email,
// // //       business_id: user.business_id || GREEN_CART_BUSINESS_ID,
// // //       business_name: user.business_name || 'The Green Cart',
// // //       business_plan: user.business_plan || 'FREE',
// // //     };

// // //     // Update state and storage
// // //     setUser(updatedUser);
// // //     await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    
// // //     return true;

// // //   } catch (error: any) {
// // //     console.error('Update user error:', error);
// // //     return false;
// // //   } finally {
// // //     setLoading(false);
// // //   }
// // // };
// // const updateUser = async (userData: Partial<User>): Promise<boolean> => {
// //   try {
// //     setLoading(true);

// //     if (!user) {
// //       console.error('No user logged in');
// //       return false;
// //     }

// //     // Prepare update data - only send fields that are provided
// //     const updatePayload: any = {};
// //     if (userData.name !== undefined) updatePayload.name = userData.name;
// //     if (userData.email !== undefined) updatePayload.email = userData.email;
// //     if (userData.phone !== undefined) updatePayload.phone = userData.phone;
// //     if (userData.address !== undefined) updatePayload.address = userData.address; // ✅ Add this line

// //     // Make PUT request to update customer
// //     const result = await apiRequestWithAuth(
// //       `/customers/${user.id}`,
// //       updatePayload,
// //       'PUT'
// //     );

// //     // Format the response to match your user structure
// //     const updatedUser: User = {
// //       id: result.id,
// //       name: result.name,
// //       phone: result.phone,
// //       email: result.email,
// //       address: result.address || user.address || '', // ✅ Add this line
// //       business_id: user.business_id || GREEN_CART_BUSINESS_ID,
// //       business_name: user.business_name || 'The Green Cart',
// //       business_plan: user.business_plan || 'FREE',
// //     };

// //     // Update state and storage
// //     setUser(updatedUser);
// //     await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    
// //     return true;

// //   } catch (error: any) {
// //     console.error('Update user error:', error);
// //     return false;
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// //   return (
// //     <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser, checkAuth, refreshUser }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };
// import React, { createContext, useState, ReactNode, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // TODO: replace with your api-server's actual base URL
// const API_BASE_URL = 'http://localhost:3000';

// interface User {
//   id: number;
//   name: string;
//   phone: string;
//   email: string | null;
//   address?: string;
//   business_id?: number;
//   business_name?: string;
//   business_plan?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
//   login: (phone: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
//   logout: () => Promise<void>;
//   updateUser: (userData: Partial<User>) => Promise<boolean>;
//   checkAuth: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signup: async () => ({ success: false, message: '' }),
//   login: async () => ({ success: false, message: '' }),
//   logout: async () => {},
//   updateUser: async () => false,
//   checkAuth: async () => {},
//   refreshUser: async () => {},
// });

// interface AuthProviderProps {
//   children: ReactNode;
// }

// // Token management
// let authToken: string | null = null;

// // Helper: Get auth headers
// const getAuthHeaders = () => {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//   };
//   if (authToken) {
//     headers['Authorization'] = `Bearer ${authToken}`;
//   }
//   return headers;
// };

// // API request with auth support for different methods
// async function apiRequestWithAuth(path: string, body: any, method: string = 'POST') {
//   const options: RequestInit = {
//     method,
//     headers: getAuthHeaders(),
//   };

//   if (method !== 'GET') {
//     options.body = JSON.stringify(body);
//   }

//   const res = await fetch(`${API_BASE_URL}${path}`, options);
//   const json = await res.json();
//   if (!res.ok) {
//     throw new Error(json.error || 'Request failed');
//   }
//   return json;
// }

// // API request without auth (for login/signup)
// async function apiRequestWithoutAuth(path: string, body: any) {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//   const json = await res.json();
//   if (!res.ok) {
//     throw new Error(json.error || 'Request failed');
//   }
//   return json;
// }

// // Fetch whichever business was most recently registered — no hardcoding.
// // Uses the public, unauthenticated /public/businesses endpoint which is
// // already ordered by createdAt desc, so data[0] is always the latest one.
// async function getCurrentBusinessId(): Promise<number> {
//   const res = await fetch(`${API_BASE_URL}/public/businesses?limit=1`);
//   const json = await res.json();
//   if (!res.ok || !json.data?.length) {
//     throw new Error('No registered business found');
//   }
//   return json.data[0].id;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       setLoading(true);

//       const token = await AsyncStorage.getItem('authToken');
//       const userData = await AsyncStorage.getItem('userData');

//       if (token && userData) {
//         authToken = token;
//         setUser(JSON.parse(userData));
//       }
//     } catch (error) {
//       console.error('Check auth error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
//     try {
//       setLoading(true);

//       if (data.password.length < 6) {
//         return { success: false, message: 'Password must be at least 6 characters' };
//       }

//       const businessId = await getCurrentBusinessId(); // 👈 dynamic, no hardcoding

//       const result = await apiRequestWithoutAuth('/customer-auth/signup', {
//         businessId,
//         name: data.name,
//         phone: data.phone,
//         email: data.email,
//         password: data.password,
//       });

//       authToken = result.token;
//       await AsyncStorage.setItem('authToken', result.token);

//       const userWithBusiness: User = {
//         id: result.customer.id,
//         name: result.customer.name,
//         phone: result.customer.phone,
//         email: result.customer.email,
//         business_id: result.customer.business_id,
//         business_name: result.customer.business_name || 'Unknown Store',
//         business_plan: result.customer.business_plan || 'FREE',
//       };

//       setUser(userWithBusiness);
//       await AsyncStorage.setItem('userData', JSON.stringify(userWithBusiness));

//       return { success: true, message: 'Account created successfully!', user: userWithBusiness };

//     } catch (error: any) {
//       console.error('Signup error:', error);
//       return { success: false, message: error.message || 'Something went wrong' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (phone: string, password: string) => {
//     try {
//       setLoading(true);

//       const result = await apiRequestWithoutAuth('/customer-auth/login', { phone, password });

//       authToken = result.token;
//       await AsyncStorage.setItem('authToken', result.token);

//       const userWithBusiness: User = {
//         id: result.customer.id,
//         name: result.customer.name,
//         phone: result.customer.phone,
//         email: result.customer.email,
//         business_id: result.customer.business_id,
//         business_name: result.customer.business_name || 'Unknown Store',
//         business_plan: result.customer.business_plan || 'FREE',
//       };

//       setUser(userWithBusiness);
//       await AsyncStorage.setItem('userData', JSON.stringify(userWithBusiness));

//       return { success: true, message: 'Logged in successfully!', user: userWithBusiness };

//     } catch (error: any) {
//       console.error('Login error:', error);
//       return { success: false, message: error.message || 'Login failed' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     // Nothing to refresh from a "latest business" lookup here —
//     // the business tied to this customer is fixed at signup time.
//   };

//   const logout = async () => {
//     authToken = null;
//     await AsyncStorage.removeItem('authToken');
//     await AsyncStorage.removeItem('userData');
//     setUser(null);
//   };

//   const updateUser = async (userData: Partial<User>): Promise<boolean> => {
//     try {
//       setLoading(true);

//       if (!user) {
//         console.error('No user logged in');
//         return false;
//       }

//       // Prepare update data - only send fields that are provided
//       const updatePayload: any = {};
//       if (userData.name !== undefined) updatePayload.name = userData.name;
//       if (userData.email !== undefined) updatePayload.email = userData.email;
//       if (userData.phone !== undefined) updatePayload.phone = userData.phone;
//       if (userData.address !== undefined) updatePayload.address = userData.address;

//       // Make PUT request to update customer
//       const result = await apiRequestWithAuth(
//         `/customers/${user.id}`,
//         updatePayload,
//         'PUT'
//       );

//       // Format the response to match your user structure
//       const updatedUser: User = {
//         id: result.id,
//         name: result.name,
//         phone: result.phone,
//         email: result.email,
//         address: result.address || user.address || '',
//         business_id: user.business_id,
//         business_name: result.business_name || user.business_name || 'Unknown Store',
//         business_plan: result.business_plan || user.business_plan || 'FREE',
//       };

//       // Update state and storage
//       setUser(updatedUser);
//       await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

//       return true;

//     } catch (error: any) {
//       console.error('Update user error:', error);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser, checkAuth, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: replace with your api-server's actual base URL
const API_BASE_URL = 'http://localhost:3000';

interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address?: string;
  business_id?: number;
  business_name?: string;
  business_plan?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => ({ success: false, message: '' }),
  login: async () => ({ success: false, message: '' }),
  logout: async () => {},
  updateUser: async () => false,
  checkAuth: async () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Token management
let authToken: string | null = null;

// Helper: Get auth headers
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// API request with auth support for different methods
async function apiRequestWithAuth(path: string, body: any, method: string = 'POST') {
  const options: RequestInit = {
    method,
    headers: getAuthHeaders(),
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

// API request without auth (for login/signup)
async function apiRequestWithoutAuth(path: string, body: any) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Request failed');
  }
  return json;
}

// Fetch whichever business was most recently registered — no hardcoding.
// Uses the public, unauthenticated /public/businesses endpoint which is
// already ordered by createdAt desc, so data[0] is always the latest one.
async function getCurrentBusinessId(): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/public/businesses?limit=1`);
  const json = await res.json();
  if (!res.ok || !json.data?.length) {
    throw new Error('No registered business found');
  }
  return json.data[0].id;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        authToken = token;
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      setLoading(true);

      if (data.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      const businessId = await getCurrentBusinessId(); // 👈 dynamic, no hardcoding
      console.log('🏪 SIGNUP - using business ID:', businessId);

      const result = await apiRequestWithoutAuth('/customer-auth/signup', {
        businessId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });

      console.log('🔑 SIGNUP RESULT:', JSON.stringify(result)); // 👈 debug log

      authToken = result.token;
      await AsyncStorage.setItem('authToken', result.token);

      const userWithBusiness: User = {
        id: result.customer.id,
        name: result.customer.name,
        phone: result.customer.phone,
        email: result.customer.email,
        business_id: result.customer.business_id,
        business_name: result.customer.business_name || 'Unknown Store',
        business_plan: result.customer.business_plan || 'FREE',
      };

      console.log('👤 SIGNUP - USER WITH BUSINESS:', JSON.stringify(userWithBusiness)); // 👈 debug log

      setUser(userWithBusiness);
      await AsyncStorage.setItem('userData', JSON.stringify(userWithBusiness));

      return { success: true, message: 'Account created successfully!', user: userWithBusiness };

    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'Something went wrong' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);

      const result = await apiRequestWithoutAuth('/customer-auth/login', { phone, password });
      console.log('🔑 LOGIN RESULT:', JSON.stringify(result)); // 👈 debug log

      authToken = result.token;
      await AsyncStorage.setItem('authToken', result.token);

      const userWithBusiness: User = {
        id: result.customer.id,
        name: result.customer.name,
        phone: result.customer.phone,
        email: result.customer.email,
        business_id: result.customer.business_id,
        business_name: result.customer.business_name || 'Unknown Store',
        business_plan: result.customer.business_plan || 'FREE',
      };

      console.log('👤 LOGIN - USER WITH BUSINESS:', JSON.stringify(userWithBusiness)); // 👈 debug log

      setUser(userWithBusiness);
      await AsyncStorage.setItem('userData', JSON.stringify(userWithBusiness));

      return { success: true, message: 'Logged in successfully!', user: userWithBusiness };

    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    // Nothing to refresh from a "latest business" lookup here —
    // the business tied to this customer is fixed at signup time.
  };

  const logout = async () => {
    authToken = null;
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);

      if (!user) {
        console.error('No user logged in');
        return false;
      }

      // Prepare update data - only send fields that are provided
      const updatePayload: any = {};
      if (userData.name !== undefined) updatePayload.name = userData.name;
      if (userData.email !== undefined) updatePayload.email = userData.email;
      if (userData.phone !== undefined) updatePayload.phone = userData.phone;
      if (userData.address !== undefined) updatePayload.address = userData.address;

      // Make PUT request to update customer
      const result = await apiRequestWithAuth(
        `/customers/${user.id}`,
        updatePayload,
        'PUT'
      );

      // Format the response to match your user structure
      const updatedUser: User = {
        id: result.id,
        name: result.name,
        phone: result.phone,
        email: result.email,
        address: result.address || user.address || '',
        business_id: user.business_id,
        business_name: result.business_name || user.business_name || 'Unknown Store',
        business_plan: result.business_plan || user.business_plan || 'FREE',
      };

      // Update state and storage
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      return true;

    } catch (error: any) {
      console.error('Update user error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser, checkAuth, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};