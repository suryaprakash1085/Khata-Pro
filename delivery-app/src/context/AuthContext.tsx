import React, { createContext, useState, ReactNode, useEffect } from 'react';

// TODO: replace with your api-server's actual base URL
const API_BASE_URL = 'http://localhost:3000';

// TODO: confirm this against: select id, name from businesses where name ilike '%green cart%';
const GREEN_CART_BUSINESS_ID = 8;

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
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
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

// Simple in-memory token holder — swap for AsyncStorage persistence below
let authToken: string | null = null;

async function apiRequest(path: string, body: any) {
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // TODO: load persisted token from AsyncStorage here and call /customer-auth/me
      // to restore session on app start
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

      const result = await apiRequest('/customer-auth/signup', {
        businessId: GREEN_CART_BUSINESS_ID,
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });

      authToken = result.token;
      // TODO: persist authToken to AsyncStorage here

      const userWithBusiness: User = {
        id: result.customer.id,
        name: result.customer.name,
        phone: result.customer.phone,
        email: result.customer.email,
        business_id: result.customer.business_id,
        business_name: 'The Green Cart',
        business_plan: 'FREE',
      };

      setUser(userWithBusiness);
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

      const result = await apiRequest('/customer-auth/login', { phone, password });

      authToken = result.token;
      // TODO: persist authToken to AsyncStorage here

      const userWithBusiness: User = {
        id: result.customer.id,
        name: result.customer.name,
        phone: result.customer.phone,
        email: result.customer.email,
        business_id: result.customer.business_id,
        business_name: 'The Green Cart',
        business_plan: 'FREE',
      };

      setUser(userWithBusiness);
      return { success: true, message: 'Logged in successfully!', user: userWithBusiness };

    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    // Business is fixed (Green Cart) for now — nothing to refresh from a "latest business" lookup anymore
  };

  const logout = () => {
    authToken = null;
    // TODO: clear AsyncStorage token here
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
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser, checkAuth, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};