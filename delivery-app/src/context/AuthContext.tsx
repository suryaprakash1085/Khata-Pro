// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { authService } from '../services/authService';
// import { getToken, getUser, removeToken, removeUser } from '../utils/storage';
// import { User } from '../types';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: User | null;
//   loading: boolean;
//   login: (credentials: { email: string; password: string }) => Promise<boolean>;
//   signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
//   logout: () => Promise<boolean>;
//   updateUser: (userData: Partial<User>) => Promise<boolean>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   user: null,
//   loading: true,
//   login: async () => false,
//   signup: async () => false,
//   logout: async () => false,
//   updateUser: async () => false,
// });

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async (): Promise<void> => {
//     try {
//       const token = await getToken();
//       const storedUser = await getUser();
//       if (token && storedUser) {
//         setIsAuthenticated(true);
//         setUser(storedUser);
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       setIsAuthenticated(false);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
//     try {
//       const response = await authService.login(credentials);
//       if (response?.token && response?.user) {
//         setIsAuthenticated(true);
//         setUser(response.user);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   const signup = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
//     try {
//       const response = await authService.signup(data);
//       if (response?.token && response?.user) {
//         setIsAuthenticated(true);
//         setUser(response.user);
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Signup failed:', error);
//       return false;
//     }
//   };

//   const logout = async (): Promise<boolean> => {
//     try {
//       await authService.logout();
//       await removeToken();
//       await removeUser();
//       setIsAuthenticated(false);
//       setUser(null);
//       return true;
//     } catch (error) {
//       console.error('Logout failed:', error);
//       return false;
//     }
//   };

//   const updateUser = async (userData: Partial<User>): Promise<boolean> => {
//     try {
//       if (!user) return false;
//       const updatedUser = { ...user, ...userData };
//       await authService.updateProfile(updatedUser);
//       setUser(updatedUser);
//       return true;
//     } catch (error) {
//       console.error('Update user failed:', error);
//       return false;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       isAuthenticated,
//       user,
//       loading,
//       login,
//       signup,
//       logout,
//       updateUser,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { getToken, getUser, removeToken, removeUser } from '../utils/storage';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => false,
  updateUser: async () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = await getToken();
      const storedUser = await getUser();
      if (token && storedUser) {
        setIsAuthenticated(true);
        setUser(storedUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);
      // FIX: Access response.data instead of response directly
      if (response?.data?.token && response?.data?.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    try {
      const response = await authService.signup(data);
      // FIX: Access response.data instead of response directly
      if (response?.data?.token && response?.data?.user) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await authService.logout();
      await removeToken();
      await removeUser();
      setIsAuthenticated(false);
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      const updatedUser = { ...user, ...userData };
      await authService.updateProfile(updatedUser);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update user failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}