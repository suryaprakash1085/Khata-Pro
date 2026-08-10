// // // // // // // // // // // // // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // // // // // // // // // // // // import { authService } from '../services/authService';
// // // // // // // // // // // // // // import { getToken, getUser, removeToken, removeUser } from '../utils/storage';
// // // // // // // // // // // // // // import { User } from '../types';

// // // // // // // // // // // // // // interface AuthContextType {
// // // // // // // // // // // // // //   isAuthenticated: boolean;
// // // // // // // // // // // // // //   user: User | null;
// // // // // // // // // // // // // //   loading: boolean;
// // // // // // // // // // // // // //   login: (credentials: { email: string; password: string }) => Promise<boolean>;
// // // // // // // // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
// // // // // // // // // // // // // //   logout: () => Promise<boolean>;
// // // // // // // // // // // // // //   updateUser: (userData: Partial<User>) => Promise<boolean>;
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // // // // // // // //   isAuthenticated: false,
// // // // // // // // // // // // // //   user: null,
// // // // // // // // // // // // // //   loading: true,
// // // // // // // // // // // // // //   login: async () => false,
// // // // // // // // // // // // // //   signup: async () => false,
// // // // // // // // // // // // // //   logout: async () => false,
// // // // // // // // // // // // // //   updateUser: async () => false,
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // interface AuthProviderProps {
// // // // // // // // // // // // // //   children: ReactNode;
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
// // // // // // // // // // // // // //   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
// // // // // // // // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // // // // // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     checkAuthStatus();
// // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // //   const checkAuthStatus = async (): Promise<void> => {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //       const token = await getToken();
// // // // // // // // // // // // // //       const storedUser = await getUser();
// // // // // // // // // // // // // //       if (token && storedUser) {
// // // // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // // // //         setUser(storedUser);
// // // // // // // // // // // // // //       } else {
// // // // // // // // // // // // // //         setIsAuthenticated(false);
// // // // // // // // // // // // // //         setUser(null);
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // // //       console.error('Auth check failed:', error);
// // // // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // // // //     } finally {
// // // // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //       const response = await authService.login(credentials);
// // // // // // // // // // // // // //       if (response?.token && response?.user) {
// // // // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // // // //         setUser(response.user);
// // // // // // // // // // // // // //         return true;
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //       return false;
// // // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // // //       console.error('Login failed:', error);
// // // // // // // // // // // // // //       return false;
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //       const response = await authService.signup(data);
// // // // // // // // // // // // // //       if (response?.token && response?.user) {
// // // // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // // // //         setUser(response.user);
// // // // // // // // // // // // // //         return true;
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //       return false;
// // // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // // //       console.error('Signup failed:', error);
// // // // // // // // // // // // // //       return false;
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const logout = async (): Promise<boolean> => {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //       await authService.logout();
// // // // // // // // // // // // // //       await removeToken();
// // // // // // // // // // // // // //       await removeUser();
// // // // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // // // //       return true;
// // // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // // //       console.error('Logout failed:', error);
// // // // // // // // // // // // // //       return false;
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const updateUser = async (userData: Partial<User>): Promise<boolean> => {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //       if (!user) return false;
// // // // // // // // // // // // // //       const updatedUser = { ...user, ...userData };
// // // // // // // // // // // // // //       await authService.updateProfile(updatedUser);
// // // // // // // // // // // // // //       setUser(updatedUser);
// // // // // // // // // // // // // //       return true;
// // // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // // //       console.error('Update user failed:', error);
// // // // // // // // // // // // // //       return false;
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <AuthContext.Provider value={{
// // // // // // // // // // // // // //       isAuthenticated,
// // // // // // // // // // // // // //       user,
// // // // // // // // // // // // // //       loading,
// // // // // // // // // // // // // //       login,
// // // // // // // // // // // // // //       signup,
// // // // // // // // // // // // // //       logout,
// // // // // // // // // // // // // //       updateUser,
// // // // // // // // // // // // // //     }}>
// // // // // // // // // // // // // //       {children}
// // // // // // // // // // // // // //     </AuthContext.Provider>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }
// // // // // // // // // // // // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // // // // // // // // // // // import { authService } from '../services/authService';
// // // // // // // // // // // // // import { getToken, getUser, removeToken, removeUser } from '../utils/storage';
// // // // // // // // // // // // // import { User } from '../types';

// // // // // // // // // // // // // interface AuthContextType {
// // // // // // // // // // // // //   isAuthenticated: boolean;
// // // // // // // // // // // // //   user: User | null;
// // // // // // // // // // // // //   loading: boolean;
// // // // // // // // // // // // //   login: (credentials: { email: string; password: string }) => Promise<boolean>;
// // // // // // // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
// // // // // // // // // // // // //   logout: () => Promise<boolean>;
// // // // // // // // // // // // //   updateUser: (userData: Partial<User>) => Promise<boolean>;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // // // // // // //   isAuthenticated: false,
// // // // // // // // // // // // //   user: null,
// // // // // // // // // // // // //   loading: true,
// // // // // // // // // // // // //   login: async () => false,
// // // // // // // // // // // // //   signup: async () => false,
// // // // // // // // // // // // //   logout: async () => false,
// // // // // // // // // // // // //   updateUser: async () => false,
// // // // // // // // // // // // // });

// // // // // // // // // // // // // interface AuthProviderProps {
// // // // // // // // // // // // //   children: ReactNode;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
// // // // // // // // // // // // //   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
// // // // // // // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     checkAuthStatus();
// // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // //   const checkAuthStatus = async (): Promise<void> => {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const token = await getToken();
// // // // // // // // // // // // //       const storedUser = await getUser();
// // // // // // // // // // // // //       if (token && storedUser) {
// // // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // // //         setUser(storedUser);
// // // // // // // // // // // // //       } else {
// // // // // // // // // // // // //         setIsAuthenticated(false);
// // // // // // // // // // // // //         setUser(null);
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       console.error('Auth check failed:', error);
// // // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // // //     } finally {
// // // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const response = await authService.login(credentials);
// // // // // // // // // // // // //       // FIX: Access response.data instead of response directly
// // // // // // // // // // // // //       if (response?.data?.token && response?.data?.user) {
// // // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // // //         setUser(response.data.user);
// // // // // // // // // // // // //         return true;
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //       return false;
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       console.error('Login failed:', error);
// // // // // // // // // // // // //       return false;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const response = await authService.signup(data);
// // // // // // // // // // // // //       // FIX: Access response.data instead of response directly
// // // // // // // // // // // // //       if (response?.data?.token && response?.data?.user) {
// // // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // // //         setUser(response.data.user);
// // // // // // // // // // // // //         return true;
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //       return false;
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       console.error('Signup failed:', error);
// // // // // // // // // // // // //       return false;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const logout = async (): Promise<boolean> => {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       await authService.logout();
// // // // // // // // // // // // //       await removeToken();
// // // // // // // // // // // // //       await removeUser();
// // // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // // //       return true;
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       console.error('Logout failed:', error);
// // // // // // // // // // // // //       return false;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const updateUser = async (userData: Partial<User>): Promise<boolean> => {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       if (!user) return false;
// // // // // // // // // // // // //       const updatedUser = { ...user, ...userData };
// // // // // // // // // // // // //       await authService.updateProfile(updatedUser);
// // // // // // // // // // // // //       setUser(updatedUser);
// // // // // // // // // // // // //       return true;
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       console.error('Update user failed:', error);
// // // // // // // // // // // // //       return false;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <AuthContext.Provider value={{
// // // // // // // // // // // // //       isAuthenticated,
// // // // // // // // // // // // //       user,
// // // // // // // // // // // // //       loading,
// // // // // // // // // // // // //       login,
// // // // // // // // // // // // //       signup,
// // // // // // // // // // // // //       logout,
// // // // // // // // // // // // //       updateUser,
// // // // // // // // // // // // //     }}>
// // // // // // // // // // // // //       {children}
// // // // // // // // // // // // //     </AuthContext.Provider>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }
// // // // // // // // // // // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // // // // // // // // // // import { authService } from '../services/authService';
// // // // // // // // // // // // import { getToken, getUser, removeToken, removeUser, setToken, setUser } from '../utils/storage';
// // // // // // // // // // // // import { User } from '../types';

// // // // // // // // // // // // interface AuthContextType {
// // // // // // // // // // // //   isAuthenticated: boolean;
// // // // // // // // // // // //   user: User | null;
// // // // // // // // // // // //   loading: boolean;
// // // // // // // // // // // //   login: (credentials: { email: string; password: string }) => Promise<boolean>;
// // // // // // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
// // // // // // // // // // // //   logout: () => Promise<boolean>;
// // // // // // // // // // // //   updateUser: (userData: Partial<User>) => Promise<boolean>;
// // // // // // // // // // // //   checkAuth: () => Promise<void>;
// // // // // // // // // // // // }

// // // // // // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // // // // // //   isAuthenticated: false,
// // // // // // // // // // // //   user: null,
// // // // // // // // // // // //   loading: true,
// // // // // // // // // // // //   login: async () => false,
// // // // // // // // // // // //   signup: async () => false,
// // // // // // // // // // // //   logout: async () => false,
// // // // // // // // // // // //   updateUser: async () => false,
// // // // // // // // // // // //   checkAuth: async () => {},
// // // // // // // // // // // // });

// // // // // // // // // // // // interface AuthProviderProps {
// // // // // // // // // // // //   children: ReactNode;
// // // // // // // // // // // // }

// // // // // // // // // // // // export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
// // // // // // // // // // // //   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
// // // // // // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // // // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // // // // // // // // //   // Check auth status on mount
// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     checkAuth();
// // // // // // // // // // // //   }, []);

// // // // // // // // // // // //   // Check authentication status from backend
// // // // // // // // // // // //   const checkAuth = async (): Promise<void> => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       setLoading(true);
      
// // // // // // // // // // // //       // Get stored token and user
// // // // // // // // // // // //       const token = await getToken();
// // // // // // // // // // // //       const storedUser = await getUser();

// // // // // // // // // // // //       // If no token or user, not authenticated
// // // // // // // // // // // //       if (!token || !storedUser) {
// // // // // // // // // // // //         setIsAuthenticated(false);
// // // // // // // // // // // //         setUser(null);
// // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // //         return;
// // // // // // // // // // // //       }

// // // // // // // // // // // //       // Verify token with backend
// // // // // // // // // // // //       try {
// // // // // // // // // // // //         const response = await authService.getCurrentUser();
        
// // // // // // // // // // // //         if (response?.data) {
// // // // // // // // // // // //           // User is authenticated
// // // // // // // // // // // //           setIsAuthenticated(true);
// // // // // // // // // // // //           setUser(response.data);
// // // // // // // // // // // //           // Update stored user with latest data
// // // // // // // // // // // //           await setUser(response.data);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //           // Token invalid or expired
// // // // // // // // // // // //           await removeToken();
// // // // // // // // // // // //           await removeUser();
// // // // // // // // // // // //           setIsAuthenticated(false);
// // // // // // // // // // // //           setUser(null);
// // // // // // // // // // // //         }
// // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // //         // Backend returned error - token invalid
// // // // // // // // // // // //         console.error('Auth verification failed:', error);
// // // // // // // // // // // //         await removeToken();
// // // // // // // // // // // //         await removeUser();
// // // // // // // // // // // //         setIsAuthenticated(false);
// // // // // // // // // // // //         setUser(null);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error('Auth check failed:', error);
// // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   // Login function
// // // // // // // // // // // //   const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       setLoading(true);
// // // // // // // // // // // //       const response = await authService.login(credentials);
      
// // // // // // // // // // // //       // Check response structure - handle both direct and nested responses
// // // // // // // // // // // //       const token = response?.data?.token || response?.token;
// // // // // // // // // // // //       const userData = response?.data?.user || response?.user;
      
// // // // // // // // // // // //       if (token && userData) {
// // // // // // // // // // // //         // Store token and user
// // // // // // // // // // // //         await setToken(token);
// // // // // // // // // // // //         await setUser(userData);
        
// // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // //         setUser(userData);
// // // // // // // // // // // //         return true;
// // // // // // // // // // // //       }
// // // // // // // // // // // //       return false;
// // // // // // // // // // // //     } catch (error: any) {
// // // // // // // // // // // //       console.error('Login failed:', error);
// // // // // // // // // // // //       // Handle specific error messages
// // // // // // // // // // // //       if (error?.response?.data?.message) {
// // // // // // // // // // // //         throw new Error(error.response.data.message);
// // // // // // // // // // // //       }
// // // // // // // // // // // //       return false;
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   // Signup function
// // // // // // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       setLoading(true);
// // // // // // // // // // // //       const response = await authService.signup(data);
      
// // // // // // // // // // // //       // Check response structure
// // // // // // // // // // // //       const token = response?.data?.token || response?.token;
// // // // // // // // // // // //       const userData = response?.data?.user || response?.user;
      
// // // // // // // // // // // //       if (token && userData) {
// // // // // // // // // // // //         // Store token and user
// // // // // // // // // // // //         await setToken(token);
// // // // // // // // // // // //         await setUser(userData);
        
// // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // //         setUser(userData);
// // // // // // // // // // // //         return true;
// // // // // // // // // // // //       }
// // // // // // // // // // // //       return false;
// // // // // // // // // // // //     } catch (error: any) {
// // // // // // // // // // // //       console.error('Signup failed:', error);
// // // // // // // // // // // //       // Handle specific error messages
// // // // // // // // // // // //       if (error?.response?.data?.message) {
// // // // // // // // // // // //         throw new Error(error.response.data.message);
// // // // // // // // // // // //       }
// // // // // // // // // // // //       return false;
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   // Logout function
// // // // // // // // // // // //   const logout = async (): Promise<boolean> => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       setLoading(true);
// // // // // // // // // // // //       await authService.logout();
// // // // // // // // // // // //       await removeToken();
// // // // // // // // // // // //       await removeUser();
// // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // //       return true;
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error('Logout failed:', error);
// // // // // // // // // // // //       // Even if backend logout fails, clear local storage
// // // // // // // // // // // //       await removeToken();
// // // // // // // // // // // //       await removeUser();
// // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // //       setUser(null);
// // // // // // // // // // // //       return true;
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   // Update user function
// // // // // // // // // // // //   const updateUser = async (userData: Partial<User>): Promise<boolean> => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       if (!user) return false;
// // // // // // // // // // // //       const updatedUser = { ...user, ...userData };
// // // // // // // // // // // //       await authService.updateProfile(updatedUser);
// // // // // // // // // // // //       await setUser(updatedUser);
// // // // // // // // // // // //       setUser(updatedUser);
// // // // // // // // // // // //       return true;
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error('Update user failed:', error);
// // // // // // // // // // // //       return false;
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <AuthContext.Provider
// // // // // // // // // // // //       value={{
// // // // // // // // // // // //         isAuthenticated,
// // // // // // // // // // // //         user,
// // // // // // // // // // // //         loading,
// // // // // // // // // // // //         login,
// // // // // // // // // // // //         signup,
// // // // // // // // // // // //         logout,
// // // // // // // // // // // //         updateUser,
// // // // // // // // // // // //         checkAuth,
// // // // // // // // // // // //       }}
// // // // // // // // // // // //     >
// // // // // // // // // // // //       {children}
// // // // // // // // // // // //     </AuthContext.Provider>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }

// // // // // // // // // // // // // Custom hook to use auth context
// // // // // // // // // // // // export const useAuth = () => {
// // // // // // // // // // // //   const context = React.useContext(AuthContext);
// // // // // // // // // // // //   if (!context) {
// // // // // // // // // // // //     throw new Error('useAuth must be used within an AuthProvider');
// // // // // // // // // // // //   }
// // // // // // // // // // // //   return context;
// // // // // // // // // // // // };
// // // // // // // // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // // // // // // import React, { createContext, useState, ReactNode } from 'react';
// // // // // // // // // // // import { signupService } from '../services/signup.service';

// // // // // // // // // // // interface User {
// // // // // // // // // // //   id: number;
// // // // // // // // // // //   name: string;
// // // // // // // // // // //   phone: string;
// // // // // // // // // // //   email: string | null;
// // // // // // // // // // //   role: string;
// // // // // // // // // // // }

// // // // // // // // // // // interface AuthContextType {
// // // // // // // // // // //   user: User | null;
// // // // // // // // // // //   loading: boolean;
// // // // // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // // // // //   logout: () => void;
// // // // // // // // // // // }

// // // // // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // // // // //   user: null,
// // // // // // // // // // //   loading: false,
// // // // // // // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // // // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // // // // // // //   logout: () => {},
// // // // // // // // // // // });

// // // // // // // // // // // interface AuthProviderProps {
// // // // // // // // // // //   children: ReactNode;
// // // // // // // // // // // }

// // // // // // // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);

// // // // // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       setLoading(true);
// // // // // // // // // // //       const result = await signupService.signup({
// // // // // // // // // // //         ...data,
// // // // // // // // // // //         confirmPassword: data.password,
// // // // // // // // // // //       });

// // // // // // // // // // //       if (result.success && result.user) {
// // // // // // // // // // //         setUser(result.user);
// // // // // // // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // // // // // // //       }
// // // // // // // // // // //       return { success: false, message: result.message };
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error('Signup error:', error);
// // // // // // // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const login = async (email: string, password: string) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       setLoading(true);
// // // // // // // // // // //       const userData = await signupService.getUserByEmail(email);
      
// // // // // // // // // // //       if (userData) {
// // // // // // // // // // //         setUser(userData);
// // // // // // // // // // //         return { success: true, message: 'Login successful', user: userData };
// // // // // // // // // // //       }
// // // // // // // // // // //       return { success: false, message: 'User not found' };
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error('Login error:', error);
// // // // // // // // // // //       return { success: false, message: 'Login failed' };
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const logout = () => {
// // // // // // // // // // //     setUser(null);
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
// // // // // // // // // // //       {children}
// // // // // // // // // // //     </AuthContext.Provider>
// // // // // // // // // // //   );
// // // // // // // // // // // };
// // // // // // // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // // // // // import React, { createContext, useState, ReactNode } from 'react';
// // // // // // // // // // import { signupService } from '../services/signup.service';

// // // // // // // // // // interface User {
// // // // // // // // // //   id: number;
// // // // // // // // // //   name: string;
// // // // // // // // // //   phone: string;
// // // // // // // // // //   email: string | null;
// // // // // // // // // //   role: string;
// // // // // // // // // // }

// // // // // // // // // // interface AuthContextType {
// // // // // // // // // //   user: User | null;
// // // // // // // // // //   loading: boolean;
// // // // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // // // //   logout: () => void;
// // // // // // // // // // }

// // // // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // // // //   user: null,
// // // // // // // // // //   loading: false,
// // // // // // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // // // // // //   logout: () => {},
// // // // // // // // // // });

// // // // // // // // // // interface AuthProviderProps {
// // // // // // // // // //   children: ReactNode;
// // // // // // // // // // }

// // // // // // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);

// // // // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       const result = await signupService.signup({
// // // // // // // // // //         ...data,
// // // // // // // // // //         confirmPassword: data.password,
// // // // // // // // // //       });

// // // // // // // // // //       if (result.success && result.user) {
// // // // // // // // // //         setUser(result.user);
// // // // // // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // // // // // //       }
// // // // // // // // // //       return { success: false, message: result.message };
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error('Signup error:', error);
// // // // // // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // FIXED: Login now uses signupService.login which verifies password
// // // // // // // // // //   const login = async (email: string, password: string) => {
// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       const result = await signupService.login(email, password);
      
// // // // // // // // // //       if (result.success && result.user) {
// // // // // // // // // //         setUser(result.user);
// // // // // // // // // //       }
// // // // // // // // // //       return result;
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error('Login error:', error);
// // // // // // // // // //       return { success: false, message: 'Login failed' };
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const logout = () => {
// // // // // // // // // //     setUser(null);
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
// // // // // // // // // //       {children}
// // // // // // // // // //     </AuthContext.Provider>
// // // // // // // // // //   );
// // // // // // // // // // };
// // // // // // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // // // // import React, { createContext, useState, ReactNode } from 'react';
// // // // // // // // // import { signupService } from '../services/signup.service';

// // // // // // // // // interface User {
// // // // // // // // //   id: number;
// // // // // // // // //   name: string;
// // // // // // // // //   phone: string;
// // // // // // // // //   email: string | null;
// // // // // // // // //   role: string;
// // // // // // // // // }

// // // // // // // // // interface AuthContextType {
// // // // // // // // //   user: User | null;
// // // // // // // // //   loading: boolean;
// // // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // // //   logout: () => void;
// // // // // // // // // }

// // // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // // //   user: null,
// // // // // // // // //   loading: false,
// // // // // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // // // // //   logout: () => {},
// // // // // // // // // });

// // // // // // // // // interface AuthProviderProps {
// // // // // // // // //   children: ReactNode;
// // // // // // // // // }

// // // // // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);

// // // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       const result = await signupService.signup({
// // // // // // // // //         ...data,
// // // // // // // // //         confirmPassword: data.password,
// // // // // // // // //       });

// // // // // // // // //       if (result.success && result.user) {
// // // // // // // // //         setUser(result.user);
// // // // // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // // // // //       }
// // // // // // // // //       return { success: false, message: result.message };
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Signup error:', error);
// // // // // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // FIXED: Proper login with email and password strings
// // // // // // // // //   const login = async (email: string, password: string) => {
// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
      
// // // // // // // // //       // Use the login function from signupService
// // // // // // // // //       const result = await signupService.login(email, password);
      
// // // // // // // // //       if (result.success && result.user) {
// // // // // // // // //         setUser(result.user);
// // // // // // // // //       }
// // // // // // // // //       return result;
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Login error:', error);
// // // // // // // // //       return { success: false, message: 'Login failed' };
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const logout = () => {
// // // // // // // // //     setUser(null);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
// // // // // // // // //       {children}
// // // // // // // // //     </AuthContext.Provider>
// // // // // // // // //   );
// // // // // // // // // };
// // // // // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // // // // // // import { signupService } from '../services/signup.service';

// // // // // // // // interface User {
// // // // // // // //   id: number;
// // // // // // // //   name: string;
// // // // // // // //   phone: string;
// // // // // // // //   email: string | null;
// // // // // // // //   role: string;
// // // // // // // // }

// // // // // // // // interface AuthContextType {
// // // // // // // //   user: User | null;
// // // // // // // //   loading: boolean;
// // // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // // //   logout: () => void;
// // // // // // // //   checkAuth: () => Promise<void>;
// // // // // // // // }

// // // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // // //   user: null,
// // // // // // // //   loading: true,
// // // // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // // // //   logout: () => {},
// // // // // // // //   checkAuth: async () => {},
// // // // // // // // });

// // // // // // // // interface AuthProviderProps {
// // // // // // // //   children: ReactNode;
// // // // // // // // }

// // // // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // // // // //   // Check if user is already logged in on app start
// // // // // // // //   useEffect(() => {
// // // // // // // //     checkAuth();
// // // // // // // //   }, []);

// // // // // // // //   const checkAuth = async () => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       // You can add logic here to check if user token exists
// // // // // // // //       // For now, just set loading to false
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Check auth error:', error);
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       const result = await signupService.signup({
// // // // // // // //         ...data,
// // // // // // // //         confirmPassword: data.password,
// // // // // // // //       });

// // // // // // // //       if (result.success && result.user) {
// // // // // // // //         setUser(result.user);
// // // // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // // // //       }
// // // // // // // //       return { success: false, message: result.message };
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Signup error:', error);
// // // // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const login = async (email: string, password: string) => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       const result = await signupService.login(email, password);
      
// // // // // // // //       if (result.success && result.user) {
// // // // // // // //         setUser(result.user);
// // // // // // // //       }
// // // // // // // //       return result;
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Login error:', error);
// // // // // // // //       return { success: false, message: 'Login failed' };
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const logout = () => {
// // // // // // // //     setUser(null);
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <AuthContext.Provider value={{ user, loading, signup, login, logout, checkAuth }}>
// // // // // // // //       {children}
// // // // // // // //     </AuthContext.Provider>
// // // // // // // //   );
// // // // // // // // };
// // // // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // // // // // import { signupService } from '../services/signup.service';

// // // // // // // interface User {
// // // // // // //   id: number;
// // // // // // //   name: string;
// // // // // // //   phone: string;
// // // // // // //   email: string | null;
// // // // // // //   role: string;
// // // // // // // }

// // // // // // // interface AuthContextType {
// // // // // // //   user: User | null;
// // // // // // //   loading: boolean;
// // // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // // //   logout: () => void;
// // // // // // //   checkAuth: () => Promise<void>;
// // // // // // // }

// // // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // // //   user: null,
// // // // // // //   loading: true,
// // // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // // //   logout: () => {},
// // // // // // //   checkAuth: async () => {},
// // // // // // // });

// // // // // // // interface AuthProviderProps {
// // // // // // //   children: ReactNode;
// // // // // // // }

// // // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // // // //   useEffect(() => {
// // // // // // //     checkAuth();
// // // // // // //   }, []);

// // // // // // //   const checkAuth = async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       // Check if user is already logged in (from previous session)
// // // // // // //       // For now, just set loading to false
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Check auth error:', error);
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       const result = await signupService.signup({
// // // // // // //         ...data,
// // // // // // //         confirmPassword: data.password,
// // // // // // //       });

// // // // // // //       if (result.success && result.user) {
// // // // // // //         // ✅ IMPORTANT: DO NOT set user here - user must login separately
// // // // // // //         // setUser(result.user); // ← REMOVE THIS LINE
// // // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // // //       }
// // // // // // //       return { success: false, message: result.message };
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Signup error:', error);
// // // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const login = async (email: string, password: string) => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       const result = await signupService.login(email, password);
      
// // // // // // //       if (result.success && result.user) {
// // // // // // //         // ✅ Set user only on successful login
// // // // // // //         setUser(result.user);
// // // // // // //       }
// // // // // // //       return result;
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Login error:', error);
// // // // // // //       return { success: false, message: 'Login failed' };
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const logout = () => {
// // // // // // //     setUser(null);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <AuthContext.Provider value={{ user, loading, signup, login, logout, checkAuth }}>
// // // // // // //       {children}
// // // // // // //     </AuthContext.Provider>
// // // // // // //   );
// // // // // // // };
// // // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // // // // import { signupService } from '../services/signup.service';

// // // // // // interface User {
// // // // // //   id: number;
// // // // // //   name: string;
// // // // // //   phone: string;
// // // // // //   email: string | null;
// // // // // //   role: string;
// // // // // // }

// // // // // // interface AuthContextType {
// // // // // //   user: User | null;
// // // // // //   loading: boolean;
// // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // //   logout: () => void;
// // // // // //   updateUser: (userData: User) => Promise<boolean>; // ✅ ADDED
// // // // // //   checkAuth: () => Promise<void>;
// // // // // // }

// // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // //   user: null,
// // // // // //   loading: true,
// // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // //   logout: () => {},
// // // // // //   updateUser: async () => false, // ✅ ADDED
// // // // // //   checkAuth: async () => {},
// // // // // // });

// // // // // // interface AuthProviderProps {
// // // // // //   children: ReactNode;
// // // // // // }

// // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // // //   useEffect(() => {
// // // // // //     checkAuth();
// // // // // //   }, []);

// // // // // //   const checkAuth = async () => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       // Check if user is already logged in (from previous session)
// // // // // //       // For now, just set loading to false
// // // // // //     } catch (error) {
// // // // // //       console.error('Check auth error:', error);
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const result = await signupService.signup({
// // // // // //         ...data,
// // // // // //         confirmPassword: data.password,
// // // // // //       });

// // // // // //       if (result.success && result.user) {
// // // // // //         // ✅ IMPORTANT: DO NOT set user here - user must login separately
// // // // // //         // setUser(result.user); // ← REMOVE THIS LINE
// // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // //       }
// // // // // //       return { success: false, message: result.message };
// // // // // //     } catch (error) {
// // // // // //       console.error('Signup error:', error);
// // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const login = async (email: string, password: string) => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const result = await signupService.login(email, password);
      
// // // // // //       if (result.success && result.user) {
// // // // // //         // ✅ Set user only on successful login
// // // // // //         setUser(result.user);
// // // // // //       }
// // // // // //       return result;
// // // // // //     } catch (error) {
// // // // // //       console.error('Login error:', error);
// // // // // //       return { success: false, message: 'Login failed' };
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ ADDED: Update user function
// // // // // //   const updateUser = async (userData: User): Promise<boolean> => {
// // // // // //     try {
// // // // // //       setUser(userData);
// // // // // //       // If you have a backend API to update user, call it here
// // // // // //       // const response = await api.updateUser(userData);
// // // // // //       return true;
// // // // // //     } catch (error) {
// // // // // //       console.error('Update user error:', error);
// // // // // //       return false;
// // // // // //     }
// // // // // //   };

// // // // // //   const logout = () => {
// // // // // //     setUser(null);
// // // // // //   };

// // // // // //   return (
// // // // // //     <AuthContext.Provider value={{ 
// // // // // //       user, 
// // // // // //       loading, 
// // // // // //       signup, 
// // // // // //       login, 
// // // // // //       logout, 
// // // // // //       updateUser, // ✅ ADDED
// // // // // //       checkAuth 
// // // // // //     }}>
// // // // // //       {children}
// // // // // //     </AuthContext.Provider>
// // // // // //   );
// // // // // // };
// // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // // // // import { signupService } from '../services/signup.service';

// // // // // // interface User {
// // // // // //   id: number;
// // // // // //   name: string;
// // // // // //   phone: string;
// // // // // //   email: string | null;
// // // // // //   role: string;
// // // // // // }

// // // // // // interface AuthContextType {
// // // // // //   user: User | null;
// // // // // //   loading: boolean;
// // // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // // //   logout: () => void;
// // // // // //   updateUser: (userData: User) => Promise<boolean>;
// // // // // //   checkAuth: () => Promise<void>;
// // // // // // }

// // // // // // export const AuthContext = createContext<AuthContextType>({
// // // // // //   user: null,
// // // // // //   loading: true,
// // // // // //   signup: async () => ({ success: false, message: '' }),
// // // // // //   login: async () => ({ success: false, message: '' }),
// // // // // //   logout: () => {},
// // // // // //   updateUser: async () => false,
// // // // // //   checkAuth: async () => {},
// // // // // // });

// // // // // // interface AuthProviderProps {
// // // // // //   children: ReactNode;
// // // // // // }

// // // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // // //   const [user, setUser] = useState<User | null>(null);
// // // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // // //   useEffect(() => {
// // // // // //     checkAuth();
// // // // // //   }, []);

// // // // // //   const checkAuth = async () => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       // Check if user is already logged in (from previous session)
// // // // // //       // For now, just set loading to false
// // // // // //     } catch (error) {
// // // // // //       console.error('Check auth error:', error);
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const result = await signupService.signup({
// // // // // //         ...data,
// // // // // //         confirmPassword: data.password,
// // // // // //       });

// // // // // //       if (result.success && result.user) {
// // // // // //         // ✅ IMPORTANT: DO NOT set user here - user must login separately
// // // // // //         return { success: true, message: result.message, user: result.user };
// // // // // //       }
// // // // // //       return { success: false, message: result.message };
// // // // // //     } catch (error) {
// // // // // //       console.error('Signup error:', error);
// // // // // //       return { success: false, message: 'Something went wrong' };
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const login = async (email: string, password: string) => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       const result = await signupService.login(email, password);
      
// // // // // //       if (result.success && result.user) {
// // // // // //         // ✅ Set user only on successful login
// // // // // //         setUser(result.user);
// // // // // //       }
// // // // // //       return result;
// // // // // //     } catch (error) {
// // // // // //       console.error('Login error:', error);
// // // // // //       return { success: false, message: 'Login failed' };
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ FIXED: Proper logout - clears user state
// // // // // //   const logout = () => {
// // // // // //     console.log('🔴 Logging out...');
// // // // // //     setUser(null);
// // // // // //     // If you have AsyncStorage, clear it here
// // // // // //     // AsyncStorage.removeItem('user');
// // // // // //   };

// // // // // //   const updateUser = async (userData: User): Promise<boolean> => {
// // // // // //     try {
// // // // // //       setUser(userData);
// // // // // //       return true;
// // // // // //     } catch (error) {
// // // // // //       console.error('Update user error:', error);
// // // // // //       return false;
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <AuthContext.Provider value={{ 
// // // // // //       user, 
// // // // // //       loading, 
// // // // // //       signup, 
// // // // // //       login, 
// // // // // //       logout, 
// // // // // //       updateUser, 
// // // // // //       checkAuth 
// // // // // //     }}>
// // // // // //       {children}
// // // // // //     </AuthContext.Provider>
// // // // // //   );
// // // // // // };
// // // // // // delivery-app/src/context/AuthContext.tsx
// // // // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // // // import { signupService } from '../services/signup.service';

// // // // // interface User {
// // // // //   id: number;
// // // // //   name: string;
// // // // //   phone: string;
// // // // //   email: string | null;
// // // // //   role: string;
// // // // // }

// // // // // interface AuthContextType {
// // // // //   user: User | null;
// // // // //   loading: boolean;
// // // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // // //   logout: () => void;
// // // // //   updateUser: (userData: User) => Promise<boolean>;
// // // // //   checkAuth: () => Promise<void>;
// // // // // }

// // // // // export const AuthContext = createContext<AuthContextType>({
// // // // //   user: null,
// // // // //   loading: true,
// // // // //   signup: async () => ({ success: false, message: '' }),
// // // // //   login: async () => ({ success: false, message: '' }),
// // // // //   logout: () => {},
// // // // //   updateUser: async () => false,
// // // // //   checkAuth: async () => {},
// // // // // });

// // // // // interface AuthProviderProps {
// // // // //   children: ReactNode;
// // // // // }

// // // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // // //   const [user, setUser] = useState<User | null>(null);
// // // // //   const [loading, setLoading] = useState<boolean>(true);

// // // // //   useEffect(() => {
// // // // //     checkAuth();
// // // // //   }, []);

// // // // //   const checkAuth = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       // Check if user is already logged in (from previous session)
// // // // //       // For now, just set loading to false
// // // // //     } catch (error) {
// // // // //       console.error('Check auth error:', error);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const result = await signupService.signup({
// // // // //         ...data,
// // // // //         confirmPassword: data.password,
// // // // //       });

// // // // //       if (result.success && result.user) {
// // // // //         // ✅ IMPORTANT: DO NOT set user here - user must login separately
// // // // //         return { success: true, message: result.message, user: result.user };
// // // // //       }
// // // // //       return { success: false, message: result.message };
// // // // //     } catch (error) {
// // // // //       console.error('Signup error:', error);
// // // // //       return { success: false, message: 'Something went wrong' };
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const login = async (email: string, password: string) => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const result = await signupService.login(email, password);
      
// // // // //       if (result.success && result.user) {
// // // // //         // ✅ Set user only on successful login
// // // // //         setUser(result.user);
// // // // //       }
// // // // //       return result;
// // // // //     } catch (error) {
// // // // //       console.error('Login error:', error);
// // // // //       return { success: false, message: 'Login failed' };
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // ✅ FIXED: Proper logout - clears user state
// // // // //   const logout = () => {
// // // // //     console.log('🔴 Logging out...');
// // // // //     setUser(null);
// // // // //     // If you have AsyncStorage, clear it here
// // // // //     // AsyncStorage.removeItem('user');
// // // // //   };

// // // // //   const updateUser = async (userData: User): Promise<boolean> => {
// // // // //     try {
// // // // //       setUser(userData);
// // // // //       return true;
// // // // //     } catch (error) {
// // // // //       console.error('Update user error:', error);
// // // // //       return false;
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <AuthContext.Provider value={{ 
// // // // //       user, 
// // // // //       loading, 
// // // // //       signup, 
// // // // //       login, 
// // // // //       logout, 
// // // // //       updateUser, 
// // // // //       checkAuth 
// // // // //     }}>
// // // // //       {children}
// // // // //     </AuthContext.Provider>
// // // // //   );
// // // // // };
// // // // // delivery-app/src/context/AuthContext.tsx
// // // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // // import { signupService } from '../services/signup.service';
// // // // import { supabase } from '../lib/supabase';

// // // // interface User {
// // // //   id: number;
// // // //   name: string;
// // // //   phone: string;
// // // //   email: string | null;
// // // //   role: string;
// // // //   business_name?: string;
// // // //   business_id?: number;
// // // //   business_plan?: string;
// // // // }

// // // // interface AuthContextType {
// // // //   user: User | null;
// // // //   loading: boolean;
// // // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // // //   logout: () => void;
// // // //   updateUser: (userData: User) => Promise<boolean>;
// // // //   checkAuth: () => Promise<void>;
// // // //   refreshUser: () => Promise<void>;
// // // // }

// // // // export const AuthContext = createContext<AuthContextType>({
// // // //   user: null,
// // // //   loading: true,
// // // //   signup: async () => ({ success: false, message: '' }),
// // // //   login: async () => ({ success: false, message: '' }),
// // // //   logout: () => {},
// // // //   updateUser: async () => false,
// // // //   checkAuth: async () => {},
// // // //   refreshUser: async () => {},
// // // // });

// // // // interface AuthProviderProps {
// // // //   children: ReactNode;
// // // // }

// // // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // // //   const [user, setUser] = useState<User | null>(null);
// // // //   const [loading, setLoading] = useState<boolean>(true);

// // // //   useEffect(() => {
// // // //     checkAuth();
// // // //   }, []);

// // // //   const checkAuth = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //     } catch (error) {
// // // //       console.error('Check auth error:', error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // ✅ Fetch business from Supabase businesses table
// // // //   const fetchUserBusiness = async (userId: number) => {
// // // //     try {
// // // //       console.log('🔍 Fetching business for user:', userId);
      
// // // //       const { data, error } = await supabase
// // // //         .from('businesses')
// // // //         .select('id, business_name, plan, business_type')
// // // //         .eq('owner_id', userId)
// // // //         .maybeSingle();

// // // //       if (error) {
// // // //         console.error('❌ Fetch business error:', error);
// // // //         return null;
// // // //       }
      
// // // //       console.log('✅ Business found:', data);
// // // //       return data;
// // // //     } catch (error) {
// // // //       console.error('❌ Fetch business exception:', error);
// // // //       return null;
// // // //     }
// // // //   };

// // // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const result = await signupService.signup({
// // // //         ...data,
// // // //         confirmPassword: data.password,
// // // //       });

// // // //       if (result.success && result.user) {
// // // //         return { success: true, message: result.message, user: result.user };
// // // //       }
// // // //       return { success: false, message: result.message };
// // // //     } catch (error) {
// // // //       console.error('Signup error:', error);
// // // //       return { success: false, message: 'Something went wrong' };
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const login = async (email: string, password: string) => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const result = await signupService.login(email, password);
      
// // // //       if (result.success && result.user) {
// // // //         console.log('✅ User logged in:', result.user);
        
// // // //         // ✅ Fetch business from businesses table
// // // //         const business = await fetchUserBusiness(result.user.id);
        
// // // //         const userWithBusiness = {
// // // //           ...result.user,
// // // //           business_id: business?.id,
// // // //           business_name: business?.business_name || null,
// // // //           business_plan: business?.plan || 'FREE',
// // // //         };
        
// // // //         console.log('✅ User with business:', userWithBusiness);
// // // //         setUser(userWithBusiness);
// // // //       }
// // // //       return result;
// // // //     } catch (error) {
// // // //       console.error('Login error:', error);
// // // //       return { success: false, message: 'Login failed' };
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const refreshUser = async () => {
// // // //     if (user?.id) {
// // // //       const business = await fetchUserBusiness(user.id);
// // // //       if (business) {
// // // //         setUser({
// // // //           ...user,
// // // //           business_id: business.id,
// // // //           business_name: business.business_name,
// // // //           business_plan: business.plan,
// // // //         });
// // // //       }
// // // //     }
// // // //   };

// // // //   const logout = () => {
// // // //     console.log('🔴 Logging out...');
// // // //     setUser(null);
// // // //   };

// // // //   const updateUser = async (userData: User): Promise<boolean> => {
// // // //     try {
// // // //       setUser(userData);
// // // //       return true;
// // // //     } catch (error) {
// // // //       console.error('Update user error:', error);
// // // //       return false;
// // // //     }
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider value={{ 
// // // //       user, 
// // // //       loading, 
// // // //       signup, 
// // // //       login, 
// // // //       logout, 
// // // //       updateUser, 
// // // //       checkAuth,
// // // //       refreshUser
// // // //     }}>
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // };
// // // // delivery-app/src/context/AuthContext.tsx
// // // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // // import { signupService } from '../services/signup.service';
// // // import { supabase } from '../lib/supabase';
// // // import { businessService } from '../services/business.service';

// // // interface User {
// // //   id: number;
// // //   name: string;
// // //   phone: string;
// // //   email: string | null;
// // //   role: string;
// // //   business_name?: string;
// // //   business_id?: number;
// // //   business_plan?: string;
// // // }

// // // interface AuthContextType {
// // //   user: User | null;
// // //   loading: boolean;
// // //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// // //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// // //   logout: () => void;
// // //   updateUser: (userData: User) => Promise<boolean>;
// // //   checkAuth: () => Promise<void>;
// // //   refreshUser: () => Promise<void>;
// // //   forceRefreshBusiness: () => Promise<void>;
// // // }

// // // export const AuthContext = createContext<AuthContextType>({
// // //   user: null,
// // //   loading: true,
// // //   signup: async () => ({ success: false, message: '' }),
// // //   login: async () => ({ success: false, message: '' }),
// // //   logout: () => {},
// // //   updateUser: async () => false,
// // //   checkAuth: async () => {},
// // //   refreshUser: async () => {},
// // //   forceRefreshBusiness: async () => {},
// // // });

// // // interface AuthProviderProps {
// // //   children: ReactNode;
// // // }

// // // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [loading, setLoading] = useState<boolean>(true);

// // //   useEffect(() => {
// // //     checkAuth();
// // //   }, []);

// // //   const checkAuth = async () => {
// // //     try {
// // //       setLoading(true);
// // //     } catch (error) {
// // //       console.error('Check auth error:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// // //     try {
// // //       setLoading(true);
// // //       const result = await signupService.signup({
// // //         ...data,
// // //         confirmPassword: data.password,
// // //       });

// // //       if (result.success && result.user) {
// // //         const business = await businessService.getBusinessByOwnerId(result.user.id);
        
// // //         const userWithBusiness = {
// // //           ...result.user,
// // //           business_id: business?.id,
// // //           business_name: business?.business_name || 'QuickBite',
// // //           business_plan: business?.plan || 'FREE',
// // //         };
        
// // //         setUser(userWithBusiness);
// // //         return { success: true, message: result.message, user: userWithBusiness };
// // //       }
// // //       return { success: false, message: result.message };
// // //     } catch (error) {
// // //       console.error('Signup error:', error);
// // //       return { success: false, message: 'Something went wrong' };
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const login = async (email: string, password: string) => {
// // //     try {
// // //       setLoading(true);
// // //       console.log('🔐 Logging in user:', email);
      
// // //       const result = await signupService.login(email, password);
      
// // //       if (result.success && result.user) {
// // //         console.log('✅ User logged in, ID:', result.user.id);
        
// // //         // ✅ FETCH BUSINESS NAME
// // //         const business = await businessService.getBusinessByOwnerId(result.user.id);
// // //         console.log('📦 Business from DB:', business);
        
// // //         // ✅ If business exists, use its name, otherwise use QuickBite
// // //         const businessName = business?.business_name || 'QuickBite';
// // //         const plan = business?.plan || 'FREE';
        
// // //         console.log('🏪 Setting business name to:', businessName);
        
// // //         const userWithBusiness = {
// // //           ...result.user,
// // //           business_id: business?.id,
// // //           business_name: businessName,
// // //           business_plan: plan,
// // //         };
        
// // //         console.log('✅ Final user:', userWithBusiness);
// // //         setUser(userWithBusiness);
// // //         return { success: true, message: result.message, user: userWithBusiness };
// // //       }
// // //       return result;
// // //     } catch (error) {
// // //       console.error('Login error:', error);
// // //       return { success: false, message: 'Login failed' };
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const refreshUser = async () => {
// // //     if (user?.id) {
// // //       const business = await businessService.getBusinessByOwnerId(user.id);
// // //       if (business) {
// // //         setUser({
// // //           ...user,
// // //           business_id: business.id,
// // //           business_name: business.business_name || 'QuickBite',
// // //           business_plan: business.plan || 'FREE',
// // //         });
// // //       }
// // //     }
// // //   };

// // //   const forceRefreshBusiness = async () => {
// // //     if (user?.id) {
// // //       console.log('🔄 Force refreshing business...');
// // //       const business = await businessService.forceRefreshBusiness(user.id);
// // //       if (business) {
// // //         console.log('✅ Force refresh found:', business.business_name);
// // //         setUser({
// // //           ...user,
// // //           business_id: business.id,
// // //           business_name: business.business_name,
// // //           business_plan: business.plan || 'FREE',
// // //         });
// // //       } else {
// // //         console.log('⚠️ No business found in force refresh');
// // //       }
// // //     }
// // //   };

// // //   const logout = () => {
// // //     console.log('🔴 Logging out...');
// // //     setUser(null);
// // //   };

// // //   const updateUser = async (userData: User): Promise<boolean> => {
// // //     try {
// // //       setUser(userData);
// // //       return true;
// // //     } catch (error) {
// // //       console.error('Update user error:', error);
// // //       return false;
// // //     }
// // //   };

// // //   return (
// // //     <AuthContext.Provider value={{ 
// // //       user, 
// // //       loading, 
// // //       signup, 
// // //       login, 
// // //       logout, 
// // //       updateUser, 
// // //       checkAuth,
// // //       refreshUser,
// // //       forceRefreshBusiness
// // //     }}>
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // };
// // // delivery-app/src/context/AuthContext.tsx
// // import React, { createContext, useState, ReactNode, useEffect } from 'react';
// // import { signupService } from '../services/signup.service';
// // import { supabase } from '../lib/supabase';

// // interface User {
// //   id: number;
// //   name: string;
// //   phone: string;
// //   email: string | null;
// //   role: string;
// //   business_name?: string;
// //   business_id?: number;
// //   business_plan?: string;
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   loading: boolean;
// //   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
// //   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
// //   logout: () => void;
// //   updateUser: (userData: User) => Promise<boolean>;
// //   checkAuth: () => Promise<void>;
// //   refreshUser: () => Promise<void>;
// // }

// // export const AuthContext = createContext<AuthContextType>({
// //   user: null,
// //   loading: true,
// //   signup: async () => ({ success: false, message: '' }),
// //   login: async () => ({ success: false, message: '' }),
// //   logout: () => {},
// //   updateUser: async () => false,
// //   checkAuth: async () => {},
// //   refreshUser: async () => {},
// // });

// // interface AuthProviderProps {
// //   children: ReactNode;
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
// //     } catch (error) {
// //       console.error('Check auth error:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Fetch the MOST RECENTLY CREATED business
// //   const fetchLatestBusiness = async () => {
// //     try {
// //       console.log('🔍 Fetching latest business...');
      
// //       const { data, error } = await supabase
// //         .from('businesses')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(1)
// //         .maybeSingle();

// //       if (error) {
// //         console.error('❌ Fetch business error:', error);
// //         return null;
// //       }
      
// //       if (data) {
// //         console.log('✅ Latest business found:', data.business_name);
// //         console.log('📅 Created at:', data.created_at);
// //       } else {
// //         console.log('⚠️ No businesses found');
// //       }
      
// //       return data;
// //     } catch (error) {
// //       console.error('❌ Fetch business exception:', error);
// //       return null;
// //     }
// //   };

// //   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
// //     try {
// //       setLoading(true);
// //       const result = await signupService.signup({
// //         ...data,
// //         confirmPassword: data.password,
// //       });

// //       if (result.success && result.user) {
// //         const business = await fetchLatestBusiness();
        
// //         const userWithBusiness = {
// //           ...result.user,
// //           business_id: business?.id,
// //           business_name: business?.business_name || null,
// //           business_plan: business?.plan || 'FREE',
// //         };
        
// //         console.log('✅ User after signup:', userWithBusiness);
// //         setUser(userWithBusiness);
// //         return { success: true, message: result.message, user: userWithBusiness };
// //       }
// //       return { success: false, message: result.message };
// //     } catch (error) {
// //       console.error('Signup error:', error);
// //       return { success: false, message: 'Something went wrong' };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const login = async (email: string, password: string) => {
// //     try {
// //       setLoading(true);
// //       console.log('🔐 Logging in user:', email);
      
// //       const result = await signupService.login(email, password);
      
// //       if (result.success && result.user) {
// //         console.log('✅ User logged in, ID:', result.user.id);
        
// //         // ✅ FETCH THE LATEST BUSINESS
// //         const business = await fetchLatestBusiness();
        
// //         // ✅ Use the latest business name
// //         let businessName = null;
// //         let plan = 'FREE';
// //         let businessId = null;
        
// //         if (business) {
// //           businessName = business.business_name;
// //           plan = business.plan || 'FREE';
// //           businessId = business.id;
// //           console.log('🏪 Latest business name:', businessName);
// //         } else {
// //           console.log('⚠️ No businesses found');
// //         }
        
// //         // ✅ Set user with the latest business name
// //         const userWithBusiness = {
// //           ...result.user,
// //           business_id: businessId,
// //           business_name: businessName,
// //           business_plan: plan.toUpperCase(),
// //         };
        
// //         console.log('✅ Final user object:', userWithBusiness);
// //         console.log('🏪 Final business name:', userWithBusiness.business_name);
        
// //         setUser(userWithBusiness);
// //         return { success: true, message: result.message, user: userWithBusiness };
// //       }
// //       return result;
// //     } catch (error) {
// //       console.error('Login error:', error);
// //       return { success: false, message: 'Login failed' };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const refreshUser = async () => {
// //     const business = await fetchLatestBusiness();
// //     if (business && user) {
// //       setUser({
// //         ...user,
// //         business_id: business.id,
// //         business_name: business.business_name,
// //         business_plan: business.plan || 'FREE',
// //       });
// //     }
// //   };

// //   const logout = () => {
// //     console.log('🔴 Logging out...');
// //     setUser(null);
// //   };

// //   const updateUser = async (userData: User): Promise<boolean> => {
// //     try {
// //       setUser(userData);
// //       return true;
// //     } catch (error) {
// //       console.error('Update user error:', error);
// //       return false;
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider value={{ 
// //       user, 
// //       loading, 
// //       signup, 
// //       login, 
// //       logout, 
// //       updateUser, 
// //       checkAuth,
// //       refreshUser
// //     }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };
// import React, { createContext, useState, ReactNode, useEffect } from 'react';
// import { signupService } from '../services/signup.service';
// import { supabase } from '../lib/supabase';

// interface User {
//   id: number;
//   name: string;
//   phone: string;
//   email: string | null;
//   role: string;
//   business_name?: string;
//   business_id?: number;
//   business_plan?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
//   login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
//   logout: () => void;
//   updateUser: (userData: User) => Promise<boolean>;
//   checkAuth: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signup: async () => ({ success: false, message: '' }),
//   login: async () => ({ success: false, message: '' }),
//   logout: () => {},
//   updateUser: async () => false,
//   checkAuth: async () => {},
//   refreshUser: async () => {},
// });

// interface AuthProviderProps {
//   children: ReactNode;
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
//     } catch (error) {
//       console.error('Check auth error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch the MOST RECENTLY CREATED business
//   const fetchLatestBusiness = async () => {
//     try {
//       console.log('🔍 Fetching latest business...');

//       const { data, error } = await supabase
//         .from('businesses')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .maybeSingle();

//       if (error) {
//         console.error('❌ Fetch business error:', error);
//         return null;
//       }

//       if (data) {
//         console.log('✅ Latest business found:', data.business_name);
//         console.log('📅 Created at:', data.created_at);
//       } else {
//         console.log('⚠️ No businesses found');
//       }

//       return data;
//     } catch (error) {
//       console.error('❌ Fetch business exception:', error);
//       return null;
//     }
//   };

//   const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
//     try {
//       setLoading(true);
//       const result = await signupService.signup({
//         ...data,
//         confirmPassword: data.password,
//       });

//       if (result.success && result.user) {
//         const business = await fetchLatestBusiness();

//         // ✅ NEW: also insert this signed-up user as a customer of the business
//         if (business?.id) {
//           await signupService.createCustomer({
//             businessId: business.id,
//             name: result.user.name,
//             phone: result.user.phone,
//             email: result.user.email,
//           });
//         } else {
//           console.log('⚠️ No business found — skipped customer creation');
//         }

//         const userWithBusiness = {
//           ...result.user,
//           business_id: business?.id,
//           business_name: business?.business_name || null,
//           business_plan: business?.plan || 'FREE',
//         };

//         console.log('✅ User after signup:', userWithBusiness);
//         setUser(userWithBusiness);
//         return { success: true, message: result.message, user: userWithBusiness };
//       }
//       return { success: false, message: result.message };
//     } catch (error) {
//       console.error('Signup error:', error);
//       return { success: false, message: 'Something went wrong' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       console.log('🔐 Logging in user:', email);

//       const result = await signupService.login(email, password);

//       if (result.success && result.user) {
//         console.log('✅ User logged in, ID:', result.user.id);

//         // ✅ FETCH THE LATEST BUSINESS
//         const business = await fetchLatestBusiness();

//         // ✅ Use the latest business name
//         let businessName = null;
//         let plan = 'FREE';
//         let businessId = null;

//         if (business) {
//           businessName = business.business_name;
//           plan = business.plan || 'FREE';
//           businessId = business.id;
//           console.log('🏪 Latest business name:', businessName);
//         } else {
//           console.log('⚠️ No businesses found');
//         }

//         // ✅ Set user with the latest business name
//         const userWithBusiness = {
//           ...result.user,
//           business_id: businessId,
//           business_name: businessName,
//           business_plan: plan.toUpperCase(),
//         };

//         console.log('✅ Final user object:', userWithBusiness);
//         console.log('🏪 Final business name:', userWithBusiness.business_name);

//         setUser(userWithBusiness);
//         return { success: true, message: result.message, user: userWithBusiness };
//       }
//       return result;
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'Login failed' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     const business = await fetchLatestBusiness();
//     if (business && user) {
//       setUser({
//         ...user,
//         business_id: business.id,
//         business_name: business.business_name,
//         business_plan: business.plan || 'FREE',
//       });
//     }
//   };

//   const logout = () => {
//     console.log('🔴 Logging out...');
//     setUser(null);
//   };

//   const updateUser = async (userData: User): Promise<boolean> => {
//     try {
//       setUser(userData);
//       return true;
//     } catch (error) {
//       console.error('Update user error:', error);
//       return false;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       signup,
//       login,
//       logout,
//       updateUser,
//       checkAuth,
//       refreshUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { signupService } from '../services/signup.service';
import { supabase } from '../lib/supabase';

interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  business_id?: number;
  business_name?: string;
  business_plan?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string; user?: User }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateUser: (userData: User) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => ({ success: false, message: '' }),
  login: async () => ({ success: false, message: '' }),
  logout: () => {},
  updateUser: async () => false,
  checkAuth: async () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
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
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBusiness = async () => {
    try {
      console.log('🔍 Fetching latest business...');

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ Fetch business error:', error);
        return null;
      }

      if (data) {
        console.log('✅ Latest business found:', data.business_name);
      } else {
        console.log('⚠️ No businesses found');
      }

      return data;
    } catch (error) {
      console.error('❌ Fetch business exception:', error);
      return null;
    }
  };

  const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      setLoading(true);

      // 1. Validate password
      if (data.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // 2. Check if user already exists in customers table
      const exists = await signupService.checkUserExists(data.email, data.phone);
      if (exists) {
        return { success: false, message: 'Email or phone number already registered' };
      }

      // 3. Get the business
      const business = await fetchLatestBusiness();
      if (!business?.id) {
        return { success: false, message: 'No business found. Please create a business first.' };
      }

      // 4. Create customer directly in customers table (NO password field)
      const customer = await signupService.createCustomer({
        businessId: business.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
      });

      console.log('✅ Customer created:', customer);

      // 5. Set user state with customer data
      const userWithBusiness = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        business_id: business.id,
        business_name: business.business_name || null,
        business_plan: business.plan || 'FREE',
      };

      console.log('✅ User set:', userWithBusiness);
      setUser(userWithBusiness);

      return { 
        success: true, 
        message: 'Account created successfully!', 
        user: userWithBusiness 
      };

    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.message || 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Logging in user:', email);

      const result = await signupService.login(email, password);

      if (result.success && result.user) {
        console.log('✅ User logged in, ID:', result.user.id);

        // Fetch the latest business
        const business = await fetchLatestBusiness();

        let businessName = null;
        let plan = 'FREE';
        let businessId = null;

        if (business) {
          businessName = business.business_name;
          plan = business.plan || 'FREE';
          businessId = business.id;
          console.log('🏪 Latest business name:', businessName);
        } else {
          console.log('⚠️ No businesses found');
        }

        const userWithBusiness = {
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          email: result.user.email,
          business_id: businessId,
          business_name: businessName,
          business_plan: plan.toUpperCase(),
        };

        console.log('✅ Final user object:', userWithBusiness);
        setUser(userWithBusiness);
        return { success: true, message: result.message, user: userWithBusiness };
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const business = await fetchLatestBusiness();
    if (business && user) {
      setUser({
        ...user,
        business_id: business.id,
        business_name: business.business_name,
        business_plan: business.plan || 'FREE',
      });
    }
  };

  const logout = () => {
    console.log('🔴 Logging out...');
    setUser(null);
  };

  const updateUser = async (userData: User): Promise<boolean> => {
    try {
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
      updateUser,
      checkAuth,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};