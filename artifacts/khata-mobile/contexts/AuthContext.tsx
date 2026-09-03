import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import type { User as ApiUser, StaffPermissions } from '@workspace/api-client-react';

const TOKEN_KEY = 'khata_auth_token';
const USER_KEY = 'khata_auth_user';

// The generated `User` type from the API client doesn't include
// `permissions` yet — the backend needs to add it to the /login (and /me)
// response schema, at which point the client can be regenerated and this
// local extension can be removed. Until then, extend it here so the rest
// of the app (tabs layout, WebSidebar, etc.) gets real type-checking
// instead of scattering `as any` everywhere.
export type User = ApiUser & { permissions?: StaffPermissions };

type AuthContextValue = {
  isLoading: boolean;
  token: string | null;
  user: User | null;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Updated synchronously during render, so it's always current before any
  // effect (parent or child) fires after this commit — avoids the race where
  // a dependent query (e.g. BusinessContext) fires with a stale/null token
  // because AuthContext's own effect hadn't re-registered the getter yet.
  const tokenRef = useRef<string | null>(token);
  tokenRef.current = token;

  useEffect(() => {
    // Register once — always reads the live ref, not a stale closure over `token`.
    setAuthTokenGetter(() => tokenRef.current);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (newToken: string, newUser: User) => {
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (newUser: User) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const value = useMemo(
    () => ({ isLoading, token, user, signIn, signOut, updateUser }),
    [isLoading, token, user, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}